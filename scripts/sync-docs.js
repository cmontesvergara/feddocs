import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const SOURCES_PATH = 'docs.sources.json'
const LOCK_PATH = 'docs.lock.json'
const CLONE_DIR = 'docs/sync/_sources'
const DOCS_DIR = 'docs'
const SIDEBAR_PATH = 'docs/.generated-sidebar.json'

// ── Contract definition ─────────────────────────────────────
const REQUIRED_FILES = ['onboarding.md', 'architecture.md', 'integration.md', 'operations.md', 'references.md', 'meta.json']
const VIEWS = ['onboarding', 'architecture', 'integration', 'operations', 'references']

// Load sources
const sources = JSON.parse(
    fs.readFileSync(SOURCES_PATH, 'utf8')
)

// Load lock
const lock = fs.existsSync(LOCK_PATH)
    ? JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8'))
    : {}

function run(cmd, cwd) {
    execSync(cmd, {
        stdio: 'inherit',
        cwd: cwd || process.cwd()
    })
}

/**
 * Recursively copy .md files from src to dest.
 */
function copyMdFiles(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
    }
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)
        if (entry.isDirectory()) {
            copyMdFiles(srcPath, destPath)
        } else if (entry.name.endsWith('.md')) {
            fs.copyFileSync(srcPath, destPath)
        }
    }
}

/**
 * Extract title from frontmatter or filename.
 */
function extractTitle(filePath) {
    const content = fs.readFileSync(filePath, 'utf8')
    const match = content.match(/^---\s*\n[\s\S]*?title:\s*["']?(.+?)["']?\s*\n[\s\S]*?---/)
    if (match) return match[1]
    const name = path.basename(filePath, '.md')
    return name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Validate contract compliance.
 */
function validateContract(srcDir) {
    const missing = []

    for (const file of REQUIRED_FILES) {
        if (!fs.existsSync(path.join(srcDir, file))) {
            missing.push(file)
        }
    }
    return { valid: missing.length === 0, missing }
}

/**
 * Generate badge markdown from meta.json.
 */
function generateBadge(meta) {
    const parts = []
    if (meta.ownerTeam) parts.push(`**Owner:** ${meta.ownerTeam}`)
    if (meta.lifecycle) parts.push(`**Lifecycle:** ${meta.lifecycle}`)
    if (meta.lastReviewed) parts.push(`**Last Reviewed:** ${meta.lastReviewed}`)
    if (meta.supportChannel) parts.push(`**Support:** ${meta.supportChannel}`)
    if (parts.length === 0) return ''
    return `::: info Metadata\n${parts.join(' · ')}\n:::\n\n`
}

/**
 * Prepend badge to file content, respecting frontmatter.
 */
function injectBadge(srcFile, destFile, badge) {
    const content = fs.readFileSync(srcFile, 'utf8')
    let output
    const fmMatch = content.match(/^(---\s*\n[\s\S]*?\n---\s*\n)/)
    if (fmMatch) {
        output = fmMatch[1] + badge + content.slice(fmMatch[1].length)
    } else {
        output = badge + content
    }
    fs.writeFileSync(destFile, output)
}

/**
 * Slugify a team name for use in paths.
 * "sso-team" → "sso-team", "Payments Team" → "payments-team"
 */
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
}

/**
 * Format a slug back to display label.
 * "sso-team" → "SSO Team" (uses meta.ownerTeam if available)
 */
function labelFromSlug(slug) {
    return slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
}

// ── Main sync loop ──────────────────────────────────────────

// Track: { teamSlug: { label, projects: [{ name, label, dir }] } }
const teams = {}
const errors = []

for (const [name, cfg] of Object.entries(sources)) {
    const cloneDir = path.join(CLONE_DIR, name)

    console.log(`\n📦 Syncing ${name} (sparse)...`)

    try {
        // Fresh clone
        if (!fs.existsSync(cloneDir)) {
            run(`git clone --filter=blob:none --no-checkout ${cfg.repo} ${cloneDir}`)
        }

        // Sparse-checkout
        run(`git sparse-checkout init --no-cone`, cloneDir)
        run(`git sparse-checkout set "${cfg.path}/**"`, cloneDir)
        run(`git fetch origin`, cloneDir)

        let ref = cfg.ref
        let remoteCommit
        if (process.env.DOCS_LOCK === 'true' && lock[name]) {
            remoteCommit = lock[name].commit
        } else {
            remoteCommit = execSync(`git rev-parse origin/${ref}`, { cwd: cloneDir })
                .toString().trim()
        }

        // ── Validate source path ────────────────────────────────
        // Need to checkout first to read meta.json
        run(`git checkout ${remoteCommit}`, cloneDir)

        const srcDocs = path.join(cloneDir, cfg.path)
        if (!fs.existsSync(srcDocs)) {
            const msg = `"${cfg.path}" not found in ${cfg.repo} (ref: ${ref})`
            console.log(`⚠️  ${name}: ${msg}`)
            errors.push({ source: name, reason: msg })
            continue
        }

        // ── Read meta.json to determine team + project ──────────
        const metaPath = path.join(srcDocs, 'meta.json')
        if (!fs.existsSync(metaPath)) {
            const msg = `meta.json not found — cannot determine team/project`
            console.log(`❌ ${name}: ${msg}`)
            errors.push({ source: name, reason: msg })
            continue
        }

        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
        const teamSlug = slugify(meta.ownerTeam || 'unassigned')
        const teamLabel = meta.ownerTeam || 'Unassigned'
        const projectSlug = slugify(meta.project || name)
        const projectLabel = meta.name || meta.project || name

        const destDir = path.join(DOCS_DIR, teamSlug, projectSlug)

        // ── Cache check ─────────────────────────────────────────
        if (lock[name]?.commit === remoteCommit && fs.existsSync(destDir)) {
            console.log(`⏩ ${name} unchanged (${remoteCommit.slice(0, 8)}), skipping copy`)

            // Still track for sidebar
            if (!teams[teamSlug]) teams[teamSlug] = { label: teamLabel, projects: [] }
            teams[teamSlug].projects.push({ name: projectSlug, label: projectLabel, dir: destDir })
            continue
        }

        // ── Validate contract ───────────────────────────────────
        const validation = validateContract(srcDocs)
        if (!validation.valid) {
            const msg = `Contract violation: missing ${validation.missing.join(', ')}`
            console.log(`❌ ${name}: ${msg}`)
            errors.push({ source: name, reason: msg })
            continue
        }

        const badge = generateBadge(meta)

        // ── Clean + copy ────────────────────────────────────────
        if (fs.existsSync(destDir)) {
            fs.rmSync(destDir, { recursive: true })
        }
        fs.mkdirSync(destDir, { recursive: true })

        // Copy each view with badge injection
        for (const view of VIEWS) {
            const srcFile = path.join(srcDocs, `${view}.md`)
            if (fs.existsSync(srcFile)) {
                const destFile = path.join(destDir, `${view}.md`)
                injectBadge(srcFile, destFile, badge)
                console.log(`  📄 ${teamSlug}/${projectSlug}/${view}.md`)
            }
        }

        // Generate project index page
        const indexContent = generateProjectIndex(meta, teamSlug, projectSlug)
        fs.writeFileSync(path.join(destDir, 'index.md'), indexContent)
        console.log(`  📄 ${teamSlug}/${projectSlug}/index.md`)

        // Track team
        if (!teams[teamSlug]) teams[teamSlug] = { label: teamLabel, projects: [] }
        teams[teamSlug].projects.push({ name: projectSlug, label: projectLabel, dir: destDir })

        // ── Record lock ─────────────────────────────────────────
        lock[name] = {
            commit: remoteCommit,
            ref: cfg.ref,
            path: cfg.path,
            syncedAt: new Date().toISOString()
        }

        console.log(`✅ ${name} → ${teamSlug}/${projectSlug} @ ${remoteCommit}`)
    } catch (err) {
        const msg = err.message.split('\n')[0]
        console.log(`⚠️  ${name}: ${msg}`)
        errors.push({ source: name, reason: msg })
    }
}

/**
 * Generate project index.md from meta.json.
 */
function generateProjectIndex(meta, teamSlug, projectSlug) {
    const basePath = `/${teamSlug}/${projectSlug}`
    let content = `# ${meta.name || projectSlug}\n\n`

    if (meta.description) {
        content += `> ${meta.description}\n\n`
    }

    content += `::: info Metadata\n`
    if (meta.ownerTeam) content += `**Owner:** ${meta.ownerTeam} · `
    if (meta.lifecycle) content += `**Lifecycle:** ${meta.lifecycle} · `
    if (meta.lastReviewed) content += `**Last Reviewed:** ${meta.lastReviewed} · `
    if (meta.supportChannel) content += `**Support:** ${meta.supportChannel}`
    content += `\n:::\n\n`

    content += `## Vistas\n\n`
    content += `| Sección | Descripción |\n`
    content += `| :--- | :--- |\n`
    content += `| [Onboarding](${basePath}/onboarding) | Setup, dependencias, primeros pasos |\n`
    content += `| [Architecture](${basePath}/architecture) | Diagrama, componentes, decisiones técnicas |\n`
    content += `| [Integration](${basePath}/integration) | APIs, contratos, autenticación |\n`
    content += `| [Operations](${basePath}/operations) | Deploy, monitoreo, alertas |\n`
    content += `| [References](${basePath}/references) | APIs, SDKs, links externos |\n`

    content += `\n`
    return content
}

// ── NEW: Generate Team Index Pages ──────────────────────────
const teamsContent = []

for (const [teamSlug, team] of Object.entries(teams)) {
    const teamDir = path.join(DOCS_DIR, teamSlug)
    if (!fs.existsSync(teamDir)) {
        fs.mkdirSync(teamDir, { recursive: true })
    }

    // Generate Team Home (docs/<team>/index.md)
    let teamIndex = `# ${team.label}\n\n`
    teamIndex += `Proyectos documentados de este equipo:\n\n`
    teamIndex += `| Proyecto | Descripción |\n`
    teamIndex += `| :--- | :--- |\n`

    for (const project of team.projects) {
        // Read project description from meta.json if possible, or just use label
        const metaPath = path.join(project.dir, '../..', 'sync/_sources', Object.keys(process.env.DOCS_LOCK === 'true' ? lock : sources).find(key => sources[key]?.path && project.dir.includes(slugify(sources[key].path))) || '', 'meta.json')
        // Simplified: just link to project
        teamIndex += `| [**${project.label}**](./${project.name}/) | Documentación de ${project.label} |\n`
    }

    fs.writeFileSync(path.join(teamDir, 'index.md'), teamIndex)
    console.log(`  📄 ${teamSlug}/index.md`)

    teamsContent.push(`| [**${team.label}**](./${teamSlug}/) | ${team.projects.length} proyectos |`)
}

// ── NEW: Generate Global Teams List ─────────────────────────
let globalTeamsIndex = `# Equipos\n\n`
if (teamsContent.length > 0) {
    globalTeamsIndex += `Estructura de documentación por equipos:\n\n`
    globalTeamsIndex += `| Equipo | Proyectos |\n`
    globalTeamsIndex += `| :--- | :--- |\n`
    globalTeamsIndex += teamsContent.join('\n')
} else {
    globalTeamsIndex += `No hay equipos sincronizados aún.`
}
fs.writeFileSync(path.join(DOCS_DIR, 'teams.md'), globalTeamsIndex)
console.log(`  📄 teams.md`)


// ── Generate sidebar ────────────────────────────────────────

const sidebar = {}

for (const [teamSlug, team] of Object.entries(teams)) {

    // Sidebar for Team Home (/sso-team/)
    sidebar[`/${teamSlug}/`] = [
        {
            text: team.label,
            items: team.projects.map(p => ({
                text: p.label,
                link: `/${teamSlug}/${p.name}/`
            }))
        }
    ]

    // Sidebar for each Project
    for (const project of team.projects) {
        const basePath = `/${teamSlug}/${project.name}`

        // Build items from existing files
        const items = []
        const indexFile = path.join(project.dir, 'index.md')
        if (fs.existsSync(indexFile)) {
            items.push({ text: 'Overview', link: `${basePath}/` })
        }
        for (const view of VIEWS) {
            const viewFile = path.join(project.dir, `${view}.md`)
            if (fs.existsSync(viewFile)) {
                items.push({
                    text: extractTitle(viewFile),
                    link: `${basePath}/${view}`
                })
            }
        }

        // Project-level sidebar matches URLs starting with /team/project/
        sidebar[`${basePath}/`] = [
            {
                text: team.label,
                link: `/${teamSlug}/`,
                items: [
                    {
                        text: project.label,
                        // collapsed: false, // VitePress default is fine
                        items
                    }
                ]
            }
        ]
    }
}

// Save lock
fs.writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2))

// Save generated sidebar
fs.writeFileSync(SIDEBAR_PATH, JSON.stringify(sidebar, null, 2))
console.log(`\n📑 Sidebar generated → ${SIDEBAR_PATH}`)

// ── Error summary ───────────────────────────────────────────
if (errors.length > 0) {
    console.log('\n⚠️  Some sources had issues:')
    for (const { source, reason } of errors) {
        console.log(`   • ${source}: ${reason}`)
    }
    console.log('')
}

console.log('\n🎉 Docs sync complete')
