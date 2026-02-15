import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import mdInclude from 'markdown-it-include'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load auto-generated sidebar (created by sync-docs.js)
const sidebarPath = resolve(__dirname, '../.generated-sidebar.json')
const generatedSidebar = existsSync(sidebarPath)
  ? JSON.parse(readFileSync(sidebarPath, 'utf8'))
  : {}

export default withMermaid(
  defineConfig({
    title: 'Internal Docs',
    markdown: {
      config: (md) => {
        md.use(mdInclude)
      }
    },
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guía', link: '/guide/' },
        { text: 'Equipos', link: '/teams' }
      ],

      sidebar: {
        '/guide/': [
          {
            text: 'Guía del Portal',
            items: [
              { text: 'Introducción', link: '/guide/' },
              { text: 'Setup del Portal', link: '/guide/setup' },
              { text: 'Contrato de Federación', link: '/guide/contract' },
              { text: 'Contrato para AI Agents', link: '/guide/contract-agents' },
              { text: 'Prompt Inicial', link: '/guide/prompt' },
              { text: 'Agregar un Source', link: '/guide/add-source' },
              { text: 'Sync Script', link: '/guide/sync-script' },
            ]
          }
        ],
        ...generatedSidebar
      }
    },
    mermaid: {},
  })
)
