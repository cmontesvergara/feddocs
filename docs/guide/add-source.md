# Agregar un Source

Guía paso a paso para federar un nuevo repositorio al portal.

## Prerequisitos

- Acceso al repositorio del portal (`docs-portal`)
- Acceso al repositorio que quieres federar
- El repositorio a federar debe tener una rama `main` (o la que configures)

---

## Paso 1: Crear la estructura en el repositorio fuente

En el repositorio que quieres federar, crea la carpeta `sync/feddocs/`:

```sh
mkdir -p sync/feddocs
```

Crea los 6 archivos obligatorios:

```sh
touch sync/feddocs/{onboarding,architecture,integration,operations,references}.md
touch sync/feddocs/meta.json
```

---

## Paso 2: Configurar `meta.json`

Este archivo determina **quién es el dueño** y **dónde aparece** en el portal:

```json
{
  "name": "mi-servicio",
  "description": "Descripción corta del servicio",
  "project": "mi-servicio",
  "ownerTeam": "mi-equipo",
  "techLead": "dev@company.com",
  "supportChannel": "#mi-equipo",
  "lifecycle": "active",
  "version": "1.0.0",
  "lastReviewed": "2026-02-14"
}
```

::: warning ownerTeam determina la agrupación
El valor de `ownerTeam` se usa como directorio padre en el portal.
Ejemplo: `ownerTeam: "payments-team"` → el proyecto aparecerá en `/payments-team/mi-servicio/`.
Si otro proyecto tiene el mismo `ownerTeam`, aparecerán juntos.
:::

---

## Paso 3: Escribir la documentación

Llena cada archivo `.md` según el [contrato](./contract). Un ejemplo mínimo:

::: details onboarding.md (ejemplo)
```md
# Mi Servicio — Onboarding

## Propósito

Este servicio maneja el procesamiento de pagos para la plataforma.
Soporta múltiples proveedores (Stripe, PayPal) y opera en producción
desde enero 2025.

## Setup

### Prerequisitos

- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Instalación

\`\`\`sh
git clone https://github.com/org/mi-servicio.git
cd mi-servicio
npm install
cp .env.example .env
npm run db:migrate
npm run dev
\`\`\`

## Problemas Comunes

| Problema | Solución |
|---|---|
| Puerto 3000 en uso | Cambiar PORT en .env |
| Error de conexión a DB | Verificar POSTGRES_URL en .env |

## Soporte

Canal de Slack: `#mi-equipo`
```
:::

---

## Paso 4: Commit y push

```sh
cd /path/to/mi-repositorio
git add sync/feddocs/
git commit -m "docs: add federated documentation"
git push origin main
```

---

## Paso 5: Registrar en el portal

En el repositorio del portal, edita `docs.sources.json`:

```json
{
    "sso-core": {
        "repo": "https://github.com/tu-org/sso-core.git",
        "ref": "main",
        "path": "sync/feddocs",
        "label": "SSO Core"
    },
    "mi-servicio": { // [!code ++]
        "repo": "https://github.com/tu-org/mi-servicio.git", // [!code ++]
        "ref": "main", // [!code ++]
        "path": "sync/feddocs", // [!code ++]
        "label": "Mi Servicio" // [!code ++]
    } // [!code ++]
}
```

| Campo | Descripción |
|---|---|
| `repo` | URL del repositorio (HTTPS o SSH) |
| `ref` | Rama a sincronizar (normalmente `main`) |
| `path` | Ruta dentro del repo a la carpeta de docs |
| `label` | Nombre legible (fallback si `meta.json` no tiene `name`) |

---

## Paso 6: Sincronizar

```sh
npm run sync
```

Si todo está correcto, verás:

```
📦 Syncing mi-servicio (sparse)...
  📄 mi-equipo/mi-servicio/onboarding.md
  📄 mi-equipo/mi-servicio/architecture.md
  📄 mi-equipo/mi-servicio/integration.md
  📄 mi-equipo/mi-servicio/operations.md
  📄 mi-equipo/mi-servicio/references.md
  📄 mi-equipo/mi-servicio/index.md
✅ mi-servicio → mi-equipo/mi-servicio @ abc1234...

📑 Sidebar generated → docs/.generated-sidebar.json

🎉 Docs sync complete
```

Si falta algún archivo obligatorio:

```
❌ mi-servicio: Contract violation: missing architecture.md, references.md
```

---

## Paso 7: Verificar

```sh
npm run dev
```

Navega a `http://localhost:5173/mi-equipo/mi-servicio/` y verifica:
- ✅ Overview con metadata badge y tabla de vistas
- ✅ Cada vista carga correctamente
- ✅ El sidebar muestra el proyecto bajo su equipo

---

## Paso 8 (opcional): Agregar al nav

Si quieres un link directo en la barra de navegación superior, edita `docs/.vitepress/config.mts`:

```typescript
nav: [
  { text: 'Home', link: '/' },
  { text: 'Guía', link: '/guide/' },
  { text: 'Mi Servicio', link: '/mi-equipo/mi-servicio/' }, // [!code ++]
],
```

---

## Troubleshooting

| Problema | Causa | Solución |
|---|---|---|
| `Contract violation: missing X` | Falta un archivo obligatorio | Crear el archivo faltante en `sync/feddocs/` |
| `meta.json not found` | No existe `meta.json` | Crear `sync/feddocs/meta.json` con los campos obligatorios |
| `path not found in repo` | La ruta en `docs.sources.json` no existe | Verificar que `path` coincide con la estructura del repo |
| Proyecto no aparece en sidebar | El sync no corrió | Ejecutar `npm run sync` de nuevo |
| Datos desactualizados | Cache del lock file | Borrar `docs.lock.json` y re-sincronizar |

---

## Siguiente paso

→ [Sync Script](./sync-script) — cómo funciona el motor de sincronización
