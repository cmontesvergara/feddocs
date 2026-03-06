# Contrato de Federación — Instrucciones para AI Agents

> **Versión:** 3.0  
> **Objetivo:** Generar documentación técnica federada que cumpla exactamente con el contrato del portal e incorpore APIs autogeneradas (Playground), audiciones y trazabilidad autónoma.  
> **Regla #1:** Si un archivo no se menciona aquí, NO lo crees. Si un campo no se menciona aquí, NO lo inventes.

---

## REGLAS ABSOLUTAS

1. La carpeta DEBE llamarse exactamente `sync/feddocs/` (con "s" al final)
2. Hay **6 archivos markdown y 1 JSON (meta.json) obligatorios** dentro de `sync/feddocs/`. Si falta UNO, el proyecto se rechaza completo.
3. Hay **1 archivo JSON (`sync-lock.json`)** y **1 archivo markdown (`agent-instructions.md`)** en la carpeta padre `sync/` que DEBES mantener para auditar tus propios cambios como agente.
4. Opcionalmente (pero sumamente recomendado), maneja el archivo `openapi.yaml` dentro de `sync/feddocs/` para generación autolocalizada del Playground. Crea este archivo SOLO si no existe. Si existe, actualízalo si es requerido, o usa otros archivos Swagger existentes como referencia.
5. Los nombres de archivos son **case-sensitive** y en **minúsculas**
6. NO crees `index.md` dentro de `sync/feddocs/` — el portal lo genera automáticamente.
7. NO incluyas metadata/badges manualmente en los `.md` — el portal los inyecta.

---

## ESTRUCTURA EXACTA (v3.0)

Crea exactamente esta estructura dentro de `sync/feddocs/`:

```
sync/
├── agent-instructions.md  (Obligatorio para AI Agents)
├── sync-lock.json         (Obligatorio para AI Agents)
└── feddocs/
    ├── meta.json
    ├── onboarding.md
    ├── architecture.md
    ├── integration.md
    ├── operations.md
    ├── references.md
    └── openapi.yaml       (Opcional, pero se evaluará)
```

---

## ARCHIVO: sync/sync-lock.json

Debe ser generado o actualizado ante CUALQUIER cambio que realices en el directorio. Esto deja una huella inmutable de tu ejecución, lo que permite observar cuándo se renovó la documentación y qué commits fueron parte del salto de versiones.

### Esquema y Ejemplo

```json
{
  "lastUpdate": "2026-03-05T16:00:00Z",
  "commitRef": "abc1234",
  "updatedBy": "GenAI-Doc-Agent",
  "changes": [
    "Generación inicial de operaciones.",
    "Conversión de openapi.yaml a 3.1.0."
  ]
}
```

---

## ARCHIVO: sync/agent-instructions.md

Cuando un Agente de IA entra en el repositorio, la idea es que ubique este documento. Aquí tienes que estipular explícitamente y en un lenguaje directo (como si estuvieras instruyendo a un clon):

1. **El Agente DEBE apegarse al contrato v3.0**. (Es decir, tú como Agente, debes leer y dejar instrucciones de que otro agente, al venir al repositorio para una sesión de asistencia o auditoría, se dedique estrictamente a seguir las validaciones del formato. Debe enlazar a la URL del portal donde viva el Contrato de Federación V3).
2. Todo update debe escribirse también en `sync/sync-lock.json`.

---

## ARCHIVO: meta.json

### Esquema completo

```json
{
  "name": "REQUERIDO - string - Nombre legible del proyecto",
  "description": "REQUERIDO - string - UNA sola línea descriptiva, máximo 120 caracteres",
  "project": "REQUERIDO - string - Slug para URLs: solo minúsculas, números y guiones",
  "ownerTeam": "REQUERIDO - string - Nombre del equipo, se usa para agrupar en el portal",
  "techLead": "REQUERIDO - string - Email del responsable técnico",
  "supportChannel": "REQUERIDO - string - Canal de Slack/Teams, con # al inicio",
  "lifecycle": "REQUERIDO - enum - UNO de: pilot | active | maintenance | deprecated | retired",
  "version": "REQUERIDO - string - Versión semver del sistema",
  "lastReviewed": "REQUERIDO - string - Fecha ISO YYYY-MM-DD"
}
```

### Ejemplo correcto

```json
{
  "name": "SSO Core",
  "description": "Identity Provider centralizado con OAuth 2.0, multi-tenancy y RBAC granular",
  "project": "sso-core",
  "ownerTeam": "sso-team",
  "techLead": "carlos.montes@empresa.com",
  "supportChannel": "#sso-core",
  "lifecycle": "active",
  "version": "1.2.0",
  "lastReviewed": "2026-03-05"
}
```

---

## ARCHIVO: openapi.yaml (Para generación de Playground)

Si el repositorio que documentas expone endpoints web y tienes el contexto de cada método HTTP y path, debes escribir (o portar) un documento de Open API 3.x puro. Este `openapi.yaml` debe residir en la raíz de la carpeta `sync/feddocs/`.  

**Reglas para su creación y mantenimiento:**
- La creación aplica SOLO si el archivo no existe.
- Si ya existe, debes actualizarlo en base a los últimos cambios en la API.
- Si el repositorio ya contiene un archivo de especificación principal (`swagger.json`, `swagger.yaml`), úsalo de manera estricta como base para referenciar o generar el `openapi.yaml`.

**Nota sobre referencias**: NO uses referencias externas inalcanzables (`$ref` a URLs que necesiten auth de tu navegador local), todo debe ser autocontenido o referenciar URLs públicas o locales puras que el sincronizador de DocForge convertirá a un formato interactivo.

---

## ARCHIVOS BASE (.md)

Todos los repositorios deben incluir esta estructura base. Las plantillas a continuación son obligatorias para cumplir con el formato. Todos deben emplear la misma convención:
1. Empezar con un H1: `# Título — {nombre}`
2. Contener headings H2 (`##`).
3. Links relativos para saltar entre sí (`[Integration](./integration.md)`).
4. No usar HTML directo, iframes ni importaciones de componentes de Vue. Soportan Mermaid para diagramación (ej: `architecture.md`).

### ARCHIVO: onboarding.md

#### Propósito
Guía para que un nuevo desarrollador pueda ser productivo con el proyecto en el menor tiempo posible.

#### Template exacto

```markdown
# Onboarding — {nombre del proyecto}

## ¿Qué es {nombre}?

{1-3 párrafos explicando qué problema resuelve, para quién y por qué existe.}

## Prerequisitos

- **{tecnología}** ≥ {versión mínima}
- **{otra tecnología}** ≥ {versión mínima}
- {otros requisitos: accesos, VPN, tokens, etc.}

## Setup Local

### 1. Clonar el repositorio

\`\`\`sh
git clone {url-del-repo}
cd {nombre-del-proyecto}
\`\`\`

### 2. Instalar dependencias

\`\`\`sh
{comando de instalación, ej: npm install}
\`\`\`

### 3. Configurar variables de entorno

\`\`\`sh
cp .env.example .env
\`\`\`

{tabla o lista con las variables que se deben llenar manualmente}

### 4. Ejecutar

\`\`\`sh
{comando para levantar el proyecto localmente}
\`\`\`

El servicio estará disponible en `http://localhost:{puerto}`.

## Verificar que funciona

{Cómo saber que el setup fue exitoso: un curl, un test, una página que cargar}

## Problemas Comunes

| Problema | Causa | Solución |
|---|---|---|
| {error que aparece} | {por qué ocurre} | {cómo resolverlo} |
| {otro error} | {causa} | {solución} |

## Canales de Soporte

| Canal | Propósito |
|---|---|
| {canal de Slack} | Soporte general y consultas |
| {otro recurso} | {para qué sirve} |
```

#### Reglas específicas para onboarding.md

- DEBE tener al menos 200 palabras de contenido real (no placeholders)
- DEBE tener al menos 2 secciones con heading `##`
- Los comandos de setup DEBEN ser copiables y ejecutables tal cual
- NO uses `{placeholder}` en el contenido final — reemplaza con datos reales
- INCLUYE una tabla de problemas comunes con al menos 2 filas reales
- El tono debe ser directo e instructivo, no teórico

---

### ARCHIVO: architecture.md

#### Propósito
Visión técnica del sistema para que cualquier desarrollador entienda cómo está construido y por qué se tomaron ciertas decisiones.

#### Template exacto

```markdown
# Architecture — {nombre del proyecto}

## Visión General

{1-2 párrafos describiendo la arquitectura a nivel alto}

\`\`\`mermaid
graph TD
    A[{componente 1}] --> B[{componente 2}]
    B --> C[{componente 3}]
    B --> D[{componente 4}]
    C --> E[({base de datos})]
\`\`\`

## Componentes Principales

### {Componente 1}

- **Responsabilidad:** {qué hace}
- **Tecnología:** {stack usado}
- **Puerto/URL:** {dónde corre}

### {Componente 2}

{misma estructura para cada componente}

## Flujos Críticos

### {Flujo 1, ej: Autenticación}

\`\`\`mermaid
sequenceDiagram
    participant C as Cliente
    participant A as API Gateway
    participant S as {Servicio}
    participant DB as {Base de Datos}
    C->>A: {paso 1}
    A->>S: {paso 2}
    S->>DB: {paso 3}
    DB-->>S: {respuesta}
    S-->>A: {respuesta}
    A-->>C: {respuesta final}
\`\`\`

## Decisiones Técnicas

| Decisión | Alternativas Evaluadas | Razón |
|---|---|---|
| {qué se decidió} | {qué se descartó} | {por qué} |

## Dependencias Externas

| Servicio | Propósito | SLA/Criticidad |
|---|---|---|
| {servicio externo} | {para qué se usa} | {qué tan crítico es} |
```

#### Reglas específicas para architecture.md

- DEBE tener al menos 200 palabras
- DEBE tener al menos 2 secciones con heading `##`
- DEBE incluir al menos 1 diagrama mermaid (obligatorio)
- Los diagramas mermaid DEBEN usar la sintaxis correcta: `\`\`\`mermaid` (sin espacio antes del backtick)
- Usa `graph TD` para diagramas de componentes y `sequenceDiagram` para flujos
- NO uses imágenes externas — todo debe ser mermaid renderizable
- Los componentes del diagrama deben ser legibles (nombres cortos, sin abreviaciones crípticas)

---

### ARCHIVO: integration.md

#### Propósito
Todo lo que un equipo consumidor necesita para integrarse con este proyecto. Si este proyecto expone APIs, aquí se documenta cómo consumirlas.

#### Template exacto

```markdown
# Integration — {nombre del proyecto}

## Autenticación

{Cómo autenticarse para usar las APIs de este proyecto}

\`\`\`sh
# Ejemplo de obtener token
curl -X POST {url}/auth/token \
  -H "Content-Type: application/json" \
  -d '{"clientId": "...", "clientSecret": "..."}'
\`\`\`

## Endpoints

### {Recurso 1}

#### `{MÉTODO}` `{/ruta/del/endpoint}`

{Descripción de qué hace este endpoint}

**Request:**

\`\`\`json
{
  "campo1": "valor",
  "campo2": 123
}
\`\`\`

**Response (200):**

\`\`\`json
{
  "id": "uuid",
  "campo1": "valor",
  "createdAt": "2026-01-01T00:00:00Z"
}
\`\`\`

**Errores:**

| Código | Significado |
|---|---|
| 400 | {cuándo ocurre} |
| 401 | {cuándo ocurre} |
| 404 | {cuándo ocurre} |

### {Recurso 2}

{misma estructura}

## SDKs y Librerías Cliente

{Si existen, cómo instalar y usar}

\`\`\`sh
npm install @{org}/{paquete}
\`\`\`

\`\`\`typescript
import { Client } from '@{org}/{paquete}'
const client = new Client({ apiKey: '...' })
const result = await client.{método}({params})
\`\`\`

## Rate Limits

| Endpoint | Límite | Ventana |
|---|---|---|
| {endpoint} | {N} requests | {periodo} |

## Errores Comunes de Integración

| Problema | Causa | Solución |
|---|---|---|
| {error} | {causa} | {cómo resolverlo} |
```

#### Reglas específicas para integration.md

- DEBE tener al menos 200 palabras
- DEBE tener al menos 2 secciones con heading `##`
- DEBE incluir al menos 1 code block con ejemplo real de consumo de API
- Los ejemplos de request/response DEBEN usar JSON válido
- INCLUYE los códigos de error más comunes para cada endpoint
- Si el proyecto NO expone APIs (ej: es una librería interna), documenta cómo importar y usar la librería con ejemplos de código

---

### ARCHIVO: operations.md

#### Propósito
Cómo operar este proyecto en producción. Para el equipo de operaciones, on-call, y cualquier persona que necesite intervenir en producción.

#### Template exacto

```markdown
# Operations — {nombre del proyecto}

## Deploy

### Pipeline CI/CD

{Describir el proceso de deploy: qué trigger lo activa, qué stages tiene, dónde se despliega}

\`\`\`mermaid
graph LR
    A[Push a main] --> B[CI: Tests]
    B --> C[CI: Build]
    C --> D[CD: Deploy Staging]
    D --> E[CD: Deploy Prod]
\`\`\`

### Deploy Manual

\`\`\`sh
{comandos para deploy manual si aplica}
\`\`\`

## Variables de Entorno

| Variable | Requerida | Descripción | Ejemplo |
|---|---|---|---|
| `{VARIABLE}` | ✅ | {qué hace} | `{valor ejemplo}` |

## Monitoreo

| Métrica | Dashboard | Umbral de Alerta |
|---|---|---|
| {métrica} | {link o nombre} | {cuándo alertar} |

## Alertas

| Alerta | Severidad | Causa Probable | Acción |
|---|---|---|---|
| {nombre alerta} | {alta/media/baja} | {qué la causa} | {qué hacer} |

## Rollback

\`\`\`sh
{procedimiento de rollback paso a paso}
\`\`\`

## Incidentes Comunes

| Incidente | Síntoma | Runbook |
|---|---|---|
| {tipo de incidente} | {qué se observa} | {pasos para resolver} |
```

#### Reglas específicas para operations.md

- DEBE tener al menos 200 palabras
- DEBE tener al menos 2 secciones con heading `##`
- Las variables de entorno DEBEN tener columna de ejemplo
- Los procedimientos de rollback DEBEN ser ejecutables paso a paso
- NO uses frases vagas como "contactar al equipo" — da pasos concretos

---

### ARCHIVO: references.md

#### Propósito
Lista curada de links y recursos externos útiles para trabajar con el proyecto.

#### Template exacto

```markdown
# References — {nombre del proyecto}

## APIs

- [{nombre descriptivo}]({url}) — {breve descripción}
- [{Swagger/OpenAPI}]({url}) — Documentación interactiva de la API

## Repositorios

- [{repo principal}]({url}) — {descripción}
- [{repo relacionado}]({url}) — {descripción}

## Herramientas

- [{herramienta}]({url}) — {para qué se usa}
- [{otra herramienta}]({url}) — {para qué se usa}

## Documentación Externa

- [{recurso}]({url}) — {qué aporta}
- [{otro recurso}]({url}) — {qué aporta}
```

#### Reglas específicas para references.md

- DEBE incluir al menos 5 links funcionales
- Cada link DEBE tener una descripción de para qué sirve (no solo el URL)
- Los links DEBEN usar formato markdown estándar: `[texto](url)`
- NO pongas links rotos o de ejemplo — si no existe un recurso real, no lo inventes
- Agrupa los links en categorías con headings `##`

---

## MARKDOWN — FEATURES PERMITIDAS

### Containers (callouts)

```markdown
::: info Título
Información general o contexto.
:::

::: tip Buena Práctica
Recomendación para el equipo.
:::

::: warning Advertencia
Algo a tener en cuenta antes de proceder.
:::

::: danger Peligro
Acción destructiva o irreversible.
:::

::: details Click para expandir
Contenido colapsable.
:::
```

### Code blocks

```markdown
\`\`\`typescript
// Syntax highlighting — especifica SIEMPRE el lenguaje
const result = await service.getData()
\`\`\`

\`\`\`ts {2,4-6}
// Line highlighting — resaltar líneas específicas
function setup() {
  const db = connect()     // ← resaltada (línea 2)
  const cache = initCache()
  const auth = initAuth()  // ← resaltada (línea 4)
  const logger = initLog() // ← resaltada (línea 5)
  const queue = initQueue()// ← resaltada (línea 6)
}
\`\`\`

\`\`\`ts
// Diffs inline
const url = '/api/v1/auth/logout'  // [!code --]
const url = '/api/v1/auth/signout' // [!code ++]
\`\`\`
```

### Code groups (tabs)

```markdown
::: code-group
\`\`\`sh [npm]
npm install @org/paquete
\`\`\`
\`\`\`sh [yarn]
yarn add @org/paquete
\`\`\`
\`\`\`sh [pnpm]
pnpm add @org/paquete
\`\`\`
:::
```

### Mermaid

```markdown
\`\`\`mermaid
graph TD
    A[Cliente] --> B[API Gateway]
    B --> C[Auth Service]
    C --> D[(PostgreSQL)]
\`\`\`
```

### Tablas

```markdown
| Columna 1 | Columna 2 | Columna 3 |
|---|---|---|
| dato | dato | dato |
```

---

## MARKDOWN — LO QUE ESTÁ PROHIBIDO

- ❌ HTML directo (`<div>`, `<span>`, `<br>`, `<img>`, etc.)
- ❌ `<script>` o `<style>` tags
- ❌ `<iframe>` o embeds externos
- ❌ CSS inline o clases custom
- ❌ Frontmatter YAML (`---` al inicio del archivo)
- ❌ Imports de Vue components
- ❌ Links absolutos a archivos locales del repo (usa `./` relativo)
- ❌ Imágenes externas con URLs que podrían caer
- ❌ Emojis Unicode directos (usa `:emoji:` syntax en su lugar)

---

## CHECKLIST FINAL ANTES DE ENTREGAR (AI AGENT AUDIT)

Antes de dar como finalizada tu labor (y avisar al Humano para commit/push), verifica tus propias acciones:

- [ ] La carpeta se llama exactamente `sync/feddocs/` (con "s")
- [ ] Existen todos los `.md` y `meta.json` mandatorios.
- [ ] NO existe `index.md` ni `README.md` dentro de `sync/feddocs/`.
- [ ] Existe y he actualizado el `sync/sync-lock.json` con mi registro y resumen de mi acción en este ciclo de trabajo.
- [ ] Existe el `sync/agent-instructions.md` obligando a cualquier agente que trabaje sobre este repo a apegarse al contrato, con link al V3.
- [ ] Si aplica, se añadió o actualizó `openapi.yaml`.
- [ ] `meta.json` es JSON válido con todos los atributos descritos arriba.

---

## EJEMPLO COMPLETO DE agent-instructions.md PARA REFERENCIA

```markdown
# Instrucciones de Cumplimiento IA (FedDocs)

Si eres un modelo de Inteligencia Artificial convocado para asistir con cambios en este repositorio, DEBES acatar estrictamente las siguientes normativas:

1. Modificas o renuevas la estructura de documentación SÓLO dentro de la matriz `sync/feddocs/`.
2. Las plantillas y esquema deben ceñirse invariablemente al Contrato V3.0 especificado en los lineamientos federados globales de DocsForge. (Revisa: https://tu-portal-docs.com/guide/contract-v3).
3. Antes de concluir tu turno de iteración de archivos (ejemplo: después de refactorizar tu código y portar la info a la documentación), tienes LA OBLIGACIÓN de actualizar la data de `sync/sync-lock.json` indicando qué cambiaste y la fecha de la transacción, para mantener intacta la cadena de responsabilidades. No puedes omitir este paso, bajo ninguna causal.
4. Si creaste nuevos endpoints, no olvides que dispones del medio para crear `sync/feddocs/openapi.yaml`. Crear implica que SOLO generas el archivo si no existe. Si existe y fue modificado un endpoint, reescríbelo. Si hay un swagger.json nativo, úsalo como referencia principal.
```
