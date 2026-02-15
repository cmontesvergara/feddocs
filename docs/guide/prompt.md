# Prompt para Nuevos Federados

> Copia este prompt y pégalo directamente en tu agente IA (Cursor, Copilot, Gemini, etc.) para generar toda la documentación federada de tu proyecto automáticamente.

---

## Antes de usar el prompt

1. Asegúrate de estar en la raíz de tu repositorio
2. Ten claro: nombre del proyecto, equipo, tech lead y canal de soporte
3. El agente creará la carpeta `sync/feddocs/` con los 6 archivos necesarios

---

## El Prompt

::: tip Copiar y pegar
Copia todo el bloque de abajo, reemplaza los valores entre `{llaves}` con la información real de tu proyecto, y pégalo como instrucción a tu agente IA.
:::

````text
Necesito que generes la documentación federada de mi proyecto para
integrarla al portal central de documentación.

## Lo que debes hacer PRIMERO

Lee el contrato de federación para AI Agents publicado en:
https://{dominio-del-portal}/guide/contract-agents.html

Ese documento contiene las reglas absolutas, los templates exactos de
cada archivo, los anti-patrones, las features de markdown permitidas
y prohibidas, y el checklist final de validación.

Debes seguir ese contrato al pie de la letra. No improvises ni
inventes reglas propias.

## Datos de mi proyecto

- **Nombre:** {Mi Servicio}
- **Descripción:** {Descripción corta en una línea}
- **Slug:** {mi-servicio}
- **Equipo:** {mi-equipo}
- **Tech Lead:** {lead@empresa.com}
- **Canal de soporte:** {#mi-equipo}
- **Lifecycle:** {active}
- **Versión:** {1.0.0}

## Instrucciones

1. Lee el contrato de federación del link anterior
2. Analiza el código fuente de este repositorio
3. Genera los 6 archivos en `sync/feddocs/` según el contrato
4. Usa datos reales del código — no inventes APIs, endpoints ni configuración
5. Al terminar, ejecuta el checklist final del contrato y muéstrame el resultado
````

---

## Después de generar

Una vez que el agente genere los archivos:

1. **Revisa el contenido** — verifica que los datos sean correctos
2. **Haz commit y push:**

```sh
git add sync/feddocs/
git commit -m "docs: add federated documentation"
git push origin main
```

3. **Notifica al equipo del portal** para que agreguen tu repo a `docs.sources.json`:

```json
{
    "mi-servicio": {
        "repo": "https://github.com/tu-org/mi-servicio.git",
        "ref": "main",
        "path": "sync/feddocs",
        "label": "Mi Servicio"
    }
}
```

4. **Ejecuta el sync** desde el portal:

```sh
npm run sync
```

Tu documentación aparecerá automáticamente en el portal bajo `/{tu-equipo}/{tu-proyecto}/`.
