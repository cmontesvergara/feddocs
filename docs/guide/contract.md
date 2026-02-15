# Contrato de Federación de Documentación — v2.0

## Propósito

Este contrato define cómo cualquier repositorio puede integrar su documentación técnica al portal central. Si tu proyecto cumple estas reglas, el portal lo sincroniza automáticamente: tu documentación aparece organizada, con navegación, búsqueda y badges de ownership.

El portal organiza la documentación en tres niveles: **Portal → Equipo → Proyecto**. Cada equipo agrupa sus proyectos, y cada proyecto tiene un conjunto estándar de vistas.

---

## Lo que necesitas

Dentro de tu repositorio, crea una carpeta `sync/feddocs/` con estos 6 archivos:

```
sync/feddocs/
├── meta.json           Identidad del proyecto
├── onboarding.md       Cómo arrancar con el proyecto
├── architecture.md     Cómo está construido
├── integration.md      Cómo consumirlo o integrarse
├── operations.md       Cómo operarlo en producción
└── references.md       Links y recursos útiles
```

> [!CAUTION]
> Si falta cualquiera de estos archivos, el proyecto **no se integra**. El script reporta qué falta.

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
  "lastReviewed": "2026-02-14"
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

## Qué incluir en cada archivo

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

El portal inyecta un badge al inicio de cada página sincronizada con: Owner, Lifecycle, Last Reviewed y Support. **No incluyas metadata manualmente** — se genera automáticamente desde `meta.json`.

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

Si usas un agente IA para generar la documentación, existe una versión detallada de este contrato con templates exactos, ejemplos completos, anti-patrones y reglas de validación:

→ [Contrato para AI Agents](./contract-agents)