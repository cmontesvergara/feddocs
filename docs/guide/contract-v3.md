# Contrato de Federación de Documentación — v3.0

## Propósito

Este contrato define cómo cualquier repositorio puede integrar su documentación técnica al portal central. Si tu proyecto cumple estas reglas, el portal lo sincroniza automáticamente: tu documentación aparece organizada, con navegación, búsqueda, badges de ownership y explorador interactivo de APIs (Playground).

El portal organiza la documentación en tres niveles: **Portal → Equipo → Proyecto**. Cada equipo agrupa sus proyectos, y cada proyecto tiene un conjunto estándar de vistas y, opcionalmente, un visor de API.

---

## Lo que necesitas

Dentro de tu repositorio, en la carpeta `sync/feddocs/`, debes mantener estos archivos. Existen archivos requeridos para el renderizado, archivos opcionales para funcionalidad extra, y archivos de control para agentes de IA:

```
sync/
├── agent-instructions.md   (Requerido) Directrices locales para que un AI Agent respete este contrato
├── sync-lock.json          (Requerido) Lockfile para registrar actualizaciones, fechas y commits de los cambios
└── feddocs/
    ├── meta.json               (Requerido) Identidad del proyecto
    ├── onboarding.md           (Requerido) Cómo arrancar con el proyecto
    ├── architecture.md         (Requerido) Cómo está construido
    ├── integration.md          (Requerido) Cómo consumirlo o integrarse
    ├── operations.md           (Requerido) Cómo operarlo en producción
    ├── references.md           (Requerido) Links y recursos útiles
    └── openapi.yaml            (Opcional) Especificación OpenAPI para generar Playground interactivo
```

> [!CAUTION]
> Si faltan los archivos base (`.md` y `meta.json`), el proyecto **no se integra**. El script de sincronización en el portal reportará qué archivo falta.

---

## El archivo `openapi.yaml`

Si tu proyecto expone una API (REST, etc.), puedes incluir el archivo `openapi.yaml` que la describe. El proceso de sincronización lo tomará, lo convertirá al formato OpenCollection y creará un **Playground interactivo** enlazado automáticamente al índice de tu proyecto, permitiendo a otros desarrolladores explorar y probar rápidamente tus endpoints.

**Reglas para su creación:**
- Crearlo aplica **sólo si no existe**.
- Si ya existe, actualízalo si es necesario.
- Si existe otro archivo de especificación para el mismo fin (como `swagger.json` o `swagger.yaml`), úsalo como referencia base para mantener este archivo consistente o como fuente principal si el sincronizador lo soporta.

---

## Control de Agentes (AI)

El contrato v3.0 incorpora soporte explícito para mantener la documentación mediante agentes de IA. Para ello, exige dos archivos adicionales orientados a la gestión autónoma:

### 1. Instrucciones para el Agente (`sync/agent-instructions.md`)
Un archivo de texto plano o markdown que el agente debe leer al momento de iniciar tareas en este repositorio. Este archivo debe indicarle estrictamente al agente que debe apegarse al formato de `sync/feddocs/` y referenciar explícitamente [este contrato](./contract-v3.md).

### 2. Lock de sincronización (`sync/sync-lock.json`)
Cada vez que el agente (o un humano) actualice la documentación, debe dejar constancia en este archivo, ubicado un nivel arriba (fuera de la carpeta extraída `feddocs/`), lo cual permite auditar la frescura y la causalidad de los cambios.

```json
{
  "lastUpdate": "2026-03-05T16:00:00Z",
  "commitRef": "abc1234",
  "updatedBy": "AI-Agent",
  "changes": [
    "Actualización de endpoints en integration.md",
    "Agregado nuevo openapi.yaml"
  ]
}
```

---

## meta.json

Define la identidad de tu proyecto. El portal usa estos datos para agrupar, clasificar y generar badges automáticos.

```json
{
  "name": "Mi Servicio",
  "description": "Descripción corta en una línea",
  "project": "mi-servicio",
  "ownerTeam": "mi-equipo",
  "techLead": "lead@empresa.com",
  "supportChannel": "#mi-equipo",
  "lifecycle": "active",
  "version": "1.0.0",
  "lastReviewed": "2026-03-05"
}
```

| Campo | Qué es |
|---|---|
| `name` | Nombre legible del proyecto |
| `description` | Resumen de una línea — aparece en el index |
| `project` | Slug para URLs (minúsculas, guiones) |
| `ownerTeam` | Equipo dueño — agrupa en el portal |
| `techLead` | Email del responsable técnico |
| `supportChannel` | Canal de Slack/Teams |
| `lifecycle` | Estado actual: `pilot` · `active` · `maintenance` · `deprecated` · `retired` |
| `version` | Versión del sistema |
| `lastReviewed` | Última revisión de docs (formato `YYYY-MM-DD`) |

---

## Qué incluir en cada archivo Markdown

### onboarding.md
Guía para que un nuevo dev sea productivo. Incluye: qué problema resuelve el proyecto, prerequisitos, setup local, ejecución, problemas comunes y canales de soporte.

### architecture.md
Visión técnica del sistema. Incluye: diagrama general (preferible mermaid), componentes y responsabilidades, flujos críticos, decisiones técnicas y dependencias externas.

### integration.md
Lo que un consumidor necesita. Incluye: APIs expuestas con endpoints y payloads, ejemplos de consumo, autenticación requerida, rate limits y errores comunes.

### operations.md
Cómo operar en producción. Incluye: proceso de deploy, variables de entorno, monitoreo y dashboards, alertas, procedimiento de rollback e incidentes comunes.

### references.md
Links y recursos. Incluye: links a APIs (Swagger/OpenAPI), colecciones Postman, SDKs, repositorios relacionados, documentación externa y herramientas del equipo.

---

## Ciclo de Vida

| Estado | Significado |
|---|---|
| `pilot` | En desarrollo inicial, no producción |
| `active` | Mantenido activamente, en producción |
| `maintenance` | Solo fixes críticos |
| `deprecated` | Programado para retiro — incluye guía de migración |
| `retired` | Ya no existe, referencia histórica |

---

## Badges automáticos

El portal inyecta un badge al inicio de cada página sincronizada con: Owner, Lifecycle, Last Reviewed y Support. **No incluyas metadata manualmente** — se genera automáticamente desde `meta.json`. En los proyectos que contengan endpoints se generará un vínculo automático al Playground API en la vista de inicio.

---

## Markdown soportado

- **Containers:** `::: info`, `::: tip`, `::: warning`, `::: danger`, `::: details`
- **Code blocks** con syntax highlighting, line highlighting (`{2,4-6}`) y diffs (`[!code ++]`/`[!code --]`)
- **Code groups:** Tabs con `::: code-group`
- **Diagramas mermaid** dentro de bloques ` ```mermaid `
- **Tablas** estándar de markdown
- **Links internos:** `[ver architecture](./architecture.md)`

> [!CAUTION]
> NO uses HTML directo, scripts, iframes ni contenido externo embebido.

---

## Referencia para AI Agents

Si usas un agente IA para generar la documentación (lo cual es mandatorio para mantener actualizado el `sync-lock.json`), existe una versión detallada de este contrato (Contrato V3 para AI Agents) con templates exactos, ejemplos completos, anti-patrones y reglas de validación orientados a su contexto:

→ [Contrato para AI Agents v3.0](./contract-agents-v3)
