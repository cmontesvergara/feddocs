# Setup del Portal

Esta guía explica cómo instalar y configurar el portal de documentación federada desde cero.

## Prerequisitos

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Git** instalado y configurado
- Acceso a los repositorios que deseas federar

## 1. Crear el proyecto

```sh
mkdir docs-portal && cd docs-portal
npm init -y
```

## 2. Instalar dependencias

```sh
npm install -D vitepress markdown-it-include
```

| Paquete | Uso |
|---|---|
| `vitepress` | Generador de sitios estáticos basado en Vue |
| `markdown-it-include` | Permite incluir fragmentos de markdown entre archivos |

## 3. Estructura de archivos

Crea la siguiente estructura:

```
docs-portal/
├── docs/
│   ├── .vitepress/
│   │   └── config.mts          ← Configuración de VitePress
│   ├── guide/                  ← Documentación estática del portal
│   └── index.md                ← Home page
├── scripts/
│   └── sync-docs.js            ← Motor de sincronización
├── docs.sources.json           ← Lista de repositorios federados
├── docs.lock.json              ← Auto-generado: commits sincronizados
├── package.json
└── .gitignore
```

## 4. Configurar `package.json`

Agrega los scripts necesarios:

```json
{
  "name": "docs-portal",
  "type": "module",
  "scripts": {
    "sync": "node scripts/sync-docs.js",
    "dev": "npm run sync && vitepress dev docs",
    "build": "npm run sync && vitepress build docs",
    "preview": "vitepress preview docs"
  },
  "devDependencies": {
    "vitepress": "^1.6.4",
    "markdown-it-include": "^2.0.0"
  }
}
```

::: tip Flujo recomendado
`npm run dev` ejecuta primero el sync y luego levanta el dev server con hot-reload.
:::

## 5. Configurar VitePress

Crea `docs/.vitepress/config.mts`:

```typescript
import { defineConfig } from 'vitepress'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import mdInclude from 'markdown-it-include'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Sidebar auto-generado por sync-docs.js
const sidebarPath = resolve(__dirname, '../.generated-sidebar.json')
const generatedSidebar = existsSync(sidebarPath)
  ? JSON.parse(readFileSync(sidebarPath, 'utf8'))
  : {}

export default defineConfig({
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
      // Agrega links a proyectos aquí
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guía del Portal',
          items: [
            { text: 'Introducción', link: '/guide/' },
            { text: 'Setup', link: '/guide/setup' },
            { text: 'Contrato', link: '/guide/contract' },
            { text: 'Agregar Source', link: '/guide/add-source' },
            { text: 'Sync Script', link: '/guide/sync-script' },
          ]
        }
      ],
      ...generatedSidebar
    }
  }
})
```

::: info Sidebar dinámico
El sidebar de los proyectos federados se genera automáticamente por `sync-docs.js`.
Solo el sidebar de la guía (`/guide/`) se define manualmente en `config.mts`.
:::

## 6. Crear la Home Page

Crea `docs/index.md`:

```yaml
---
layout: home

hero:
  name: "Nombre del Portal"
  text: "Documentación Técnica Interna"
  tagline: Documentación federada desde múltiples repositorios
  actions:
    - theme: brand
      text: Guía
      link: /guide/

features:
  - title: Organizado por Equipos
    details: Cada equipo agrupa sus proyectos
  - title: Contratos Claros
    details: Estructura estandarizada
  - title: Sincronización Automática
    details: Desde repositorios fuente
---
```

## 7. Configurar `.gitignore`

```
node_modules/
docs/.vitepress/cache
docs/.vitepress/dist
docs/sync/_sources/
docs/.generated-sidebar.json

# Directorios generados por sync (equipos)
# Agrega aquí los directorios de equipos generados
# docs/sso-team/
```

::: warning Importante
Los directorios de equipos (`docs/sso-team/`, etc.) son **generados automáticamente**.
No los versiones en git — se regeneran con cada `npm run sync`.
:::

::: tip docs.lock.json — ¿versionarlo o no?
`docs.lock.json` es **auto-generado** por el sync script y registra el commit exacto de cada source sincronizado.
- **Sí versionarlo** → permite builds reproducibles con `DOCS_LOCK=true`
- **No versionarlo** → cada sync siempre trae lo más reciente

Recomendación: **sí versionarlo** en producción para builds deterministas.
:::

## 8. Crear `docs.sources.json`

Este archivo lista los repositorios a sincronizar:

```json
{
    "sso-core": {
        "repo": "https://github.com/tu-org/sso-core.git",
        "ref": "main",
        "path": "sync/feddocs",
        "label": "SSO Core"
    }
}
```

Consulta [Agregar un Source](./add-source) para más detalles.

## 9. Copiar el Sync Script

Copia `scripts/sync-docs.js` desde este repositorio.
Ver [Sync Script](./sync-script) para entender cómo funciona.

## 10. Ejecutar

```sh
# Primera ejecución (genera docs.lock.json automáticamente)
npm run sync

# Levantar dev server
npm run dev

# Build para producción
npm run build

# Build reproducible (usa commits del lock file)
DOCS_LOCK=true npm run build

# Forzar re-sync completo (ignora cache)
rm docs.lock.json && npm run sync
```

::: info docs.lock.json
Después del primer `npm run sync`, se genera `docs.lock.json` con el commit de cada source.
En ejecuciones siguientes, el script **omite la copia** si el commit no cambió (cache).
Ver [Sync Script → Cache y Performance](./sync-script#cache-y-performance) para más detalles.
:::

## Siguiente paso

→ [Contrato de Federación](./contract) — reglas que cada repositorio debe cumplir
