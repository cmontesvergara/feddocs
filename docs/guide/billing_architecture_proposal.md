# Propuesta de Arquitectura: Billing Core & Ecosistema EmpireSoft

Este documento define la arquitectura recomendada para abstraer y centralizar la lógica de monetización, pagos y suscripciones en un ecosistema de microservicios, donde existe un servidor central de identidad (SSO Core) y múltiples aplicaciones satélites (NotiBot, David Sender, etc.).

## 1. Visión General del Ecosistema

La arquitectura se divide en tres pilares fundamentales para garantizar el principio de responsabilidad única (Single Responsibility Principle) y la escalabilidad del modelo de negocio (SaaS):

1. **SSO Core**: Fuente de la verdad de **Identidad**. Gestiona usuarios, workspaces, credenciales y firma de JWTs.
2. **Billing Core (Nueva App)**: Fuente de la verdad de **Pagos y Suscripciones**. Gestiona planes recurrentes, catálogos de productos, integraciones con pasarelas (Stripe, Mercado Pago) y emite notificaciones de cambios de estado.
3. **Apps Satélites (Ej. NotiBot, David Sender)**: Entidades consumidoras. Interpretan su estado de licenciamiento a partir de eventos y reportan el consumo de recursos (metering) si aplican cuotas variables.

---

## 2. Diagrama de Arquitectura (Mermaid)

```mermaid
graph TD
  subgraph Client [Interfaces de Usuario]
    UI_AppA[Frontend NotiBot]
    UI_AppB[Frontend David Sender]
    UI_Billing[Portal Central de Pagos]
  end

  subgraph BackendEcosystem [Backend Ecosistema EmpireSoft]
    SSOCore[SSO Core <br/> Identidad y JWT]
    BillingCore[Billing Core <br/> Pagos y Suscripciones]
    
    subgraph Satellites [Apps Satélites]
      AppA[NotiBot Backend]
      AppB[David Sender Backend]
    end
    
    Broker[(Redis Pub/Sub <br/> Eventos del Ecosistema)]
    DB_Billing[(Billing DB <br/> Suscripciones, Facturas)]
  end

  subgraph Gateways [Pasarelas Externas]
    Stripe[Stripe]
    MercadoPago[Mercado Pago]
  end

  %% Interacción de Usuarios
  UI_AppA <--> AppA
  UI_AppB <--> AppB
  UI_Billing <--> BillingCore

  %% Validación de Identidad
  AppA -.->|Validar JWT| SSOCore
  AppB -.->|Validar JWT| SSOCore
  BillingCore -.->|Validar JWT| SSOCore

  %% Flujo de Checkout
  UI_AppA -->|Redirección para Pagar| UI_Billing
  UI_Billing -->|Generar Checkout Session| BillingCore
  BillingCore <--> Gateways
  
  %% Webhooks Externos
  Gateways -->|Webhooks confirmación| BillingCore
  BillingCore -->|Actualizar Estado| DB_Billing

  %% Comunicación Asíncrona (Sincronización de Apps)
  BillingCore -->|Emitir Eventos <br/>(Plan Activado/Cancelado)| Broker
  Broker -->|Consumir Eventos <br/>(Sincronizar permisos)| Satellites

  %% Reporte de Consumo (Opcional - Uso Medido)
  AppA -->|Reportar Consumo (Metering)| BillingCore
```

---

## 3. Flujos de Comunicación Core

### Flujo A: Compra o Upgrade de Suscripción (Checkout)
1. El usuario, operando en **NotiBot** (UI), intenta acceder a una función pro o hace clic en "Comprar Plan".
2. **NotiBot (UI)** redirige al usuario a la interfaz del **Billing Core**, enviando su JWT (que contiene `workspaceId`) y los parámetros del producto (`appId=notibot`, `planId=pro`).
3. El **Billing Core** verifica la identidad con el SSO, carga los precios y genera una sesión con la pasarela seleccionada (Stripe/MP).
4. El pago es procesado por la pasarela. Tras finalizar, se redirige al usuario de vuelta a **NotiBot (UI)**.
5. De forma asíncrona, la pasarela envía un Webhook al **Billing Core** confirmando la transacción. El **Billing Core** activa la suscripción en la base de datos `DB_Billing`.

### Flujo B: Notificación de Permisos a las Apps (El Event-Driven pub/sub)
Dado que las apps satélites no deben consultar la capa de Billing en cada petición para no afectar la latencia, se usa un mecanismo reactivo:

1. El **Billing Core** procesa el webhook y emite un evento en Redis:
   ```json
   // Ejemplo Evento: billing.subscription.updated
   {
     "workspaceId": "ws_12345",
     "appId": "notibot",
     "status": "ACTIVE",
     "planId": "pro",
     "features": ["whatsapp_unlimited", "premium_support"]
   }
   ```
2. **NotiBot Backend**, al estar suscrito a `billing.subscription.updated`, recibe el mensaje y cachea este estado localmente (en su propia base de datos o en Redis bajo su prefijo).
3. A partir de ese momento, los Guards de ruta en NotiBot pueden consultar instantáneamente la memoria local para autorizar o denegar operaciones premium.

### Flujo C: Sistema de Consumo (Metering / Limits)
Si vendes por volumen (ej. 10,000 mensajes al mes):
1. **NotiBot Backend** procesa un envío de mensaje real.
2. **NotiBot** de forma asíncrona notifica al **Billing Core**: consumí 1 unidad para `workspaceId: ws_12345`.
3. El **Billing Core** lleva el conteo centralizado.
4. Si el **Billing Core** detecta que se alcanzó el límite del 100%, dispara un evento por Redis: `billing.quota.exceeded`.
5. **NotiBot Backend** lo recibe y congela la operativa de ese usuario hasta el próximo ciclo de cobro o upgrade.

---

## 4. Ventajas de esta Arquitectura

- **Seguridad (PCI Compliance Aislado):** Las apps principales y el SSO nunca ven datos financieros ni se integran con SDKs de pagos externos.
- **Escalabilidad del Negocio:** Puedes lanzar 50 aplicaciones SaaS en el ecosistema. Sumarlas a los pagos es sólo registrar el `appId` en el Billing Core y suscribirlas a Redis.
- **Resiliencia:** Si el servidor de Billing se cae o hay demoras en Stripe, los usuarios existentes pueden seguir operando en NotiBot y David Sender porque sus capas validan permisos desde su caché distribuida basada en el último evento conocido (Eventual Consistency).
- **Portal de Cliente Integrado:** El usuario tiene un único lugar central para descargar todas sus facturas de EmpireSoft, actualizar tarjeta de crédito o cancelar suscripciones, en lugar de hacerlo app por app.
