# Bigso Design System - Sistema de Diseño Unificado

## 1. Concepto & Visión

El Sistema de Diseño de Bigso es la autoridad visual central que garantiza consistencia, profesionalismo y escalabilidad en todo el ecosistema digital. Cada interacción transmite confianza y modernidad, reflejando el compromiso de Bigso con soluciones empresariales de alta calidad. La identidad visual es **minimalista pero distintiva**, con énfasis en claridad, jerarquía visual y experiencias de usuario fluidas.

Este documento establece los estándares que gobernarán www.bigso.co, sso.bigso.co, ordamy.bigso.co y cualquier producto futuro dentro del ecosistema.

---

## 2. Sistema de Colores

### Paleta Principal (Light Mode)

| Rol | Color | Hex | Tailwind | Uso |
|-----|-------|-----|----------|-----|
| **Primary** | Deep Indigo | `#4F46E5` | `indigo-600` | Acciones principales, enlaces, elementos de navegación activos |
| **Primary Hover** | Darker Indigo | `#4338CA` | `indigo-700` | Estados hover en elementos primarios |
| **Primary Light** | Light Indigo | `#EEF2FF` | `indigo-50` | Fondos sutiles, badges, chips |
| **Secondary** | Slate | `#64748B` | `slate-500` | Texto secundario, iconos, bordes sutiles |
| **Accent** | Emerald | `#10B981` | `emerald-500` | Éxito, confirmaciones, CTAs positivos |
| **Warning** | Amber | `#F59E0B` | `amber-500` | Alertas, información importante |
| **Error** | Rose | `#F43F5E` | `rose-500` | Errores, acciones destructivas |
| **Background Primary** | White | `#FFFFFF` | `white` | Fondo principal de páginas |
| **Background Secondary** | Slate 50 | `#F8FAFC` | `slate-50` | Secciones alternas, cards con fondo |
| **Text Primary** | Slate 900 | `#0F172A` | `slate-900` | Títulos, texto principal |
| **Text Secondary** | Slate 600 | `#475569` | `slate-600` | Texto descriptivo, subtítulos |
| **Text Tertiary** | Slate 400 | `#94A3B8` | `slate-400` | Placeholders, texto deshabilitado |
| **Border** | Slate 200 | `#E2E8F0` | `slate-200` | Bordes de inputs, separadores |
| **Border Hover** | Slate 300 | `#CBD5E1` | `slate-300` | Estados hover en elementos con borde |

### Paleta Oscura (Dark Mode)

| Rol | Color | Hex | Tailwind | Uso |
|-----|-------|-----|----------|-----|
| **Primary** | Indigo 400 | `#818CF8` | `indigo-400` | Acciones principales en dark mode |
| **Primary Hover** | Indigo 300 | `#A5B4FC` | `indigo-300` | Estados hover |
| **Background Primary** | Slate 950 | `#020617` | `slate-950` | Fondo principal |
| **Background Secondary** | Slate 900 | `#0F172A` | `slate-900` | Cards, elementos elevados |
| **Background Tertiary** | Slate 800 | `#1E293B` | `slate-800` | Elementos con más elevación |
| **Text Primary** | Slate 50 | `#F8FAFC` | `slate-50` | Títulos, texto principal |
| **Text Secondary** | Slate 400 | `#94A3B8` | `slate-400` | Texto secundario |
| **Border** | Slate 700 | `#334155` | `slate-700` | Bordes en dark mode |

### Aplicación de Colores

```
Fondo de página        → background: #FFFFFF / slate-50
Cards y contenedores   → background: #FFFFFF, border: #E2E8F0, shadow-sm
Botones primarios      → background: #4F46E5, hover: #4338CA
Texto headings         → color: #0F172A
Texto body             → color: #475569
Enlaces                → color: #4F46E5, hover: #4338CA
Iconos                 → color: #64748B
Bordes                 → border-color: #E2E8F0
```

---

## 3. Tipografía

### Familia Tipográfica Principal

**Font Principal**: `Inter` (Google Fonts)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

### Sistema de Escalas Tipográficas

| Elemento | Weight | Size | Line Height | Letter Spacing | Uso |
|----------|--------|------|-------------|----------------|-----|
| **Display** | 700 | 48px / 3rem | 1.1 | -0.02em | Hero headings principales |
| **H1** | 700 | 36px / 2.25rem | 1.2 | -0.02em | Títulos de página principales |
| **H2** | 600 | 30px / 1.875rem | 1.25 | -0.01em | Títulos de sección |
| **H3** | 600 | 24px / 1.5rem | 1.3 | -0.01em | Subtítulos de sección |
| **H4** | 600 | 20px / 1.25rem | 1.4 | 0 | Títulos de cards, elementos de navegación |
| **Body Large** | 400 | 18px / 1.125rem | 1.6 | 0 | Descripciones de features, texto destacado |
| **Body** | 400 | 16px / 1rem | 1.6 | 0 | Texto principal de párrafos |
| **Body Small** | 400 | 14px / 0.875rem | 1.5 | 0 | Texto secundario, metadata |
| **Caption** | 500 | 12px / 0.75rem | 1.4 | 0.02em | Labels de badges, timestamps |
| **Button** | 500 | 14px / 0.875rem | 1 | 0.02em | Texto de botones |

### Clases Tailwind CSS对应

```css
/* Tailwind Font Size Utilities */
/* Display → text-5xl font-bold tracking-tight */
/* H1 → text-4xl font-bold tracking-tight */
/* H2 → text-3xl font-semibold tracking-tight */
/* H3 → text-2xl font-semibold */
/* H4 → text-xl font-semibold */
/* Body Large → text-lg */
/* Body → text-base */
/* Body Small → text-sm text-slate-600 */
/* Caption → text-xs font-medium tracking-wider uppercase */
```

---

## 4. Sistema de Espaciado

### Escala Base: 4px

| Token | Valor | px | Uso |
|-------|-------|-----|-----|
| `space-0` | 0 | 0px | Sin espacio |
| `space-1` | 0.25rem | 4px | Separación mínima inline |
| `space-2` | 0.5rem | 8px | Padding interno de chips, gap entre icono y texto |
| `space-3` | 0.75rem | 12px | Padding de inputs pequeños |
| `space-4` | 1rem | 16px | Padding estándar de botones, inputs, cards |
| `space-5` | 1.25rem | 20px | Separación entre elementos relacionados |
| `space-6` | 1.5rem | 24px | Separación entre secciones internas de cards |
| `space-8` | 2rem | 32px | Separación entre grupos de elementos |
| `space-10` | 2.5rem | 40px | Separación entre secciones principales |
| `space-12` | 3rem | 48px | Padding de secciones hero |
| `space-16` | 4rem | 64px | Separación entre secciones de página |
| `space-20` | 5rem | 80px | Padding vertical de secciones grandes |
| `space-24` | 6rem | 96px | Separación máxima entre secciones |

### Aplicación Práctica

```
Padding de página (contenedor)     → px-6 (mobile) / px-8 (tablet) / px-12 (desktop)
Padding interno de cards           → p-6
Gap entre cards en grid            → gap-6
Separación título-parrafo           → mt-4
Separación entre secciones          → py-16
Margen entre botones                → gap-3
```

---

## 5. Sombras y Elevación

### Sistema de Sombras

| Nivel | Valor | Uso |
|-------|-------|-----|
| **Shadow-xs** | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Bordes sutiles, elementos casi planos |
| **Shadow-sm** | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | Cards en estado default |
| **Shadow-md** | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Cards elevadas, dropdowns |
| **Shadow-lg** | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Modals, tooltips |
| **Shadow-xl** | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | Notificaciones flotantes |

### Reglas de Aplicación

```
Cards normales              → shadow-sm hover:shadow-md transition-shadow
Botones con dropdown       → shadow-md (menú abierto)
Modales                    → shadow-lg
Elementos flotantes        → shadow-xl
Dark mode cards            → bg-slate-900 shadow-black/20
```

---

## 6. Bordes y Radios

### Sistema de Radios (Border Radius)

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-none` | 0px | Elementos sin radio (usar con moderación) |
| `rounded-sm` | 4px | Chips, badges, elementos pequeños |
| `rounded` | 6px | Inputs, botones secondary, dropdowns |
| `rounded-md` | 8px | Cards, modals |
| `rounded-lg` | 12px | Contenedores grandes, imágenes destacadas |
| `rounded-xl` | 16px | Cards de features, hero sections |
| `rounded-full` | 9999px | Avatares, botones circulares, toggles |

### Grosor de Bordes

```
Bordes estándar       → border border-slate-200
Bordes hover          → border-slate-300
Bordes activos/focus  → border-indigo-500 ring-2 ring-indigo-500/20
Bordes dark mode      → border-slate-700
```

---

## 7. Componentes Base

### 7.1 Botones (Buttons)

#### Botón Primario

```html
<!-- Estados: default, hover, active, disabled, loading -->
<button class="
  inline-flex items-center justify-center gap-2
  px-4 py-2.5
  bg-indigo-600 text-white
  text-sm font-medium
  rounded-md
  shadow-sm
  hover:bg-indigo-700
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-150
  cursor-pointer
">
  <!-- Contenido -->
</button>
```

**Specs:**
- Height mínimo: 40px (touch target)
- Padding horizontal: 16px (px-4)
- Padding vertical: 10px (py-2.5)
- Font weight: 500
- Border radius: 6px (rounded-md)
- Transition: 150ms

#### Botón Secundario

```html
<button class="
  inline-flex items-center justify-center gap-2
  px-4 py-2.5
  bg-white text-slate-700
  text-sm font-medium
  rounded-md
  border border-slate-200
  hover:bg-slate-50 hover:border-slate-300
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-150
  cursor-pointer
">
```

#### Botón Ghost (Texto)

```html
<button class="
  inline-flex items-center justify-center gap-2
  px-4 py-2.5
  text-indigo-600
  text-sm font-medium
  rounded-md
  hover:bg-indigo-50
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-150
  cursor-pointer
">
```

#### Botón Destructive

```html
<button class="
  inline-flex items-center justify-center gap-2
  px-4 py-2.5
  bg-rose-500 text-white
  text-sm font-medium
  rounded-md
  shadow-sm
  hover:bg-rose-600
  focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2
  transition-colors duration-150
  cursor-pointer
">
```

#### Tamaños de Botones

| Tamaño | Padding | Font Size | Height | Uso |
|--------|---------|-----------|--------|-----|
| **Small (sm)** | px-3 py-1.5 | text-xs | 32px | Badges, elementos inline |
| **Medium (md)** | px-4 py-2.5 | text-sm | 40px | Default, formularios |
| **Large (lg)** | px-6 py-3 | text-base | 48px | CTAs principales, hero |

### 7.2 Inputs (Formularios)

#### Input de Texto

```html
<div class="w-full">
  <label class="block text-sm font-medium text-slate-700 mb-1.5">
    Label
  </label>
  <input type="text" class="
    w-full px-3.5 py-2.5
    bg-white text-slate-900
    text-sm
    rounded-md
    border border-slate-200
    placeholder:text-slate-400
    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
    disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
    transition-colors duration-150
  " placeholder="Placeholder text">
  <p class="mt-1.5 text-xs text-slate-500">Texto de ayuda</p>
</div>
```

**Specs:**
- Height: 40px
- Padding: 14px horizontal (px-3.5)
- Border radius: 6px (rounded-md)
- Border: 1px solid
- Focus ring: 2px indigo-500/20

#### Input con Error

```html
<input class="
  w-full px-3.5 py-2.5
  bg-white text-slate-900
  text-sm rounded-md
  border border-rose-500
  focus:outline-none focus:ring-2 focus:ring-rose-500/20
  /* ... */
">
<p class="mt-1.5 text-xs text-rose-500">Mensaje de error</p>
```

#### Textarea

```html
<textarea class="
  w-full px-3.5 py-2.5
  bg-white text-slate-900
  text-sm rounded-md
  border border-slate-200
  min-h-[120px] resize-y
  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
">
```

#### Select

```html
<select class="
  w-full px-3.5 py-2.5
  bg-white text-slate-900
  text-sm rounded-md
  border border-slate-200
  cursor-pointer
  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
  /* Requiere chevron-down icon */
">
```

### 7.3 Cards

```html
<div class="
  w-full p-6
  bg-white
  rounded-lg
  border border-slate-200
  shadow-sm
  hover:shadow-md hover:border-slate-300
  transition-all duration-200
">
  <!-- Contenido de card -->
</div>
```

**Specs:**
- Padding: 24px (p-6)
- Border radius: 8px (rounded-lg)
- Border: 1px slate-200
- Shadow: shadow-sm, hover → shadow-md
- Gap entre cards: 24px (gap-6)

### 7.4 Badges / Chips

```html
<span class="
  inline-flex items-center
  px-2.5 py-0.5
  text-xs font-medium
  rounded-full
  bg-indigo-50 text-indigo-700
">
  Badge
</span>
```

**Variantes:**

| Variante | Background | Text Color |
|----------|------------|------------|
| Default | slate-100 | slate-700 |
| Primary | indigo-50 | indigo-700 |
| Success | emerald-50 | emerald-700 |
| Warning | amber-50 | amber-700 |
| Error | rose-50 | rose-700 |

### 7.5 Navegación (Header)

```html
<header class="
  sticky top-0 z-50
  w-full
  bg-white/95 backdrop-blur-sm
  border-b border-slate-200
">
  <nav class="
    max-w-7xl mx-auto
    px-6 lg:px-8
    h-16
    flex items-center justify-between
  ">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 cursor-pointer">
      <span class="text-xl font-bold text-slate-900">Bigso</span>
    </a>

    <!-- Links -->
    <div class="hidden md:flex items-center gap-8">
      <a href="#" class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Producto</a>
      <a href="#" class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Precios</a>
      <a href="#" class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Recursos</a>
    </div>

    <!-- CTAs -->
    <div class="flex items-center gap-3">
      <a href="#" class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Iniciar sesión</a>
      <a href="#" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors cursor-pointer">Registrarse</a>
    </div>
  </nav>
</header>
```

### 7.6 Footer

```html
<footer class="
  w-full
  bg-slate-50
  border-t border-slate-200
  py-12
">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Logo & Description -->
      <div class="col-span-1">
        <span class="text-lg font-bold text-slate-900">Bigso</span>
        <p class="mt-3 text-sm text-slate-600">
          Ecosistema de soluciones digitales para empresas y personas.
        </p>
      </div>

      <!-- Links Columns -->
      <div>
        <h4 class="text-sm font-semibold text-slate-900 mb-4">Producto</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Funciones</a></li>
          <li><a href="#" class="text-sm text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Precios</a></li>
        </ul>
      </div>
      <!-- ... más columnas -->
    </div>

    <div class="mt-8 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm text-slate-500">© 2026 Bigso. Todos los derechos reservados.</p>
      <div class="flex gap-4">
        <a href="#" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">Privacidad</a>
        <a href="#" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">Términos</a>
      </div>
    </div>
  </div>
</footer>
```

---

## 8. Iconografía

### Regla Fundamental

**⚠️ PROHIBIDO: Usar emojis como iconos de UI**
**✅ REQUERIDO: Usar SVG icons exclusivamente**

### Librerías Recomendadas

| Librería | Uso | URL |
|----------|-----|-----|
| **Heroicons** | Default recomendado | https://heroicons.com |
| **Lucide** | Alternativa moderna | https://lucide.dev |
| **Simple Icons** | Iconos de marcas/tecnologías | https://simpleicons.org |

### Especificaciones de Iconos

| Contexto | Size | Stroke | Color |
|----------|------|--------|-------|
| **Navbar icons** | 20x20 | 1.5px | text-slate-500 |
| **Button icons** | 16x16 | 2px | heredar del texto |
| **Feature icons** | 24x24 | 1.5px | text-indigo-600 |
| **Inline text icons** | 16x16 | 2px | text-slate-400 |
| **Social icons** | 20x20 | 1.5px | text-slate-400 |

### Ejemplo de Implementación (Heroicons)

```html
<!-- Icono en navbar -->
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-slate-500">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>

<!-- Usar en botón -->
<button class="flex items-center gap-2 ...">
  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
  Añadir elemento
</button>
```

---

## 9. Animaciones y Transiciones

### Duraciones Estándar

| Tipo | Duración | Uso |
|------|----------|-----|
| **Instant** | 0ms | Feedback inmediato (toggle, switch) |
| **Fast** | 75-150ms | Interacciones hover, micro-feedback |
| **Normal** | 150-200ms | Transiciones de estado, expand/collapse |
| **Slow** | 300ms | Transiciones de layout, modals |
| **Slower** | 500ms | Animaciones de entrada (usar con moderación) |

### Reglas de Animación

```
✅ PERMITIDO:
- opacity: 150-300ms ease
- transform: 150-300ms ease-out (solo translate, scale, rotate)
- color: 150ms ease

❌ PROHIBIDO:
- Animaciones > 500ms para interacciones normales
- layout shifts durante animaciones
- animation de background-color
```

### Ejemplo de Transición Hover

```html
<button class="
  px-4 py-2
  bg-indigo-600 text-white
  rounded-md
  transition-all duration-150
  hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5
  focus:ring-2 focus:ring-indigo-500
  cursor-pointer
">
  Botón con micro-interacción
</button>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Layout y Responsividad

### Breakpoints

| Breakpoint | Min Width | Tailwind | Uso |
|------------|-----------|----------|-----|
| **Mobile** | 0px | - | Diseño móvil default |
| **sm** | 640px | `sm:` | Phones landscape, tablets pequeñas |
| **md** | 768px | `md:` | Tablets |
| **lg** | 1024px | `lg:` | Laptops, desktops pequeños |
| **xl** | 1280px | `xl:` | Desktops |
| **2xl** | 1536px | `2xl:` | Pantallas grandes |

### Contenedor Máximo

```html
<div class="max-w-7xl mx-auto px-6 lg:px-8">
  <!-- Contenido centrado con máximo 1280px -->
</div>
```

### Grid de 12 Columnas

| Elemento | Columnas | Gap |
|----------|----------|-----|
| **Feature cards** | 1 (mobile) / 2 (md) / 3 (lg) | gap-6 |
| **Hero split** | 1 / 2 (lg) | gap-12 |
| **Footer columns** | 1 / 2 (md) / 4 (lg) | gap-8 |
| **Pricing cards** | 1 (mobile) / 3 (lg) | gap-8 |

### Touch Targets (Mobile)

```
✅ Mínimo: 44x44px para todos los elementos clickeables
✅ Espaciado mínimo: 8px entre elementos adyacentes
✅ Botones de navegación: altura mínima 48px
```

---

## 11. Dark Mode

### Implementación con Tailwind

```html
<!-- Background -->
<div class="bg-white dark:bg-slate-900">
  <!-- Contenido -->
</div>

<!-- Texto -->
<p class="text-slate-900 dark:text-slate-50">
  Texto adaptativo
</p>

<!-- Botón -->
<button class="bg-indigo-600 dark:bg-indigo-500">
  Botón adaptativo
</button>
```

### Checklist Dark Mode

```
□ Background: #FFFFFF (light) → #0F172A (dark)
□ Cards: bg-white → bg-slate-800/50
□ Bordes: slate-200 → slate-700
□ Texto principal: slate-900 → slate-50
□ Texto secundario: slate-600 → slate-400
□ Sombras: usar shadow-black/10 en lugar de shadow-black/50
```

---

## 12. Accesibilidad

### Contraste de Color

```
❌ PROHIBIDO: Contraste menor a 4.5:1 para texto normal
❌ PROHIBIDO: Contraste menor a 3:1 para texto grande (18px+)
✅ REQUERIDO: Verificar contraste en ambos modos (light/dark)
```

### Estados de Focus

```css
/* Siempre visible y distintivo */
:focus-visible {
  outline: 2px solid #4F46E5;
  outline-offset: 2px;
}

/* En dark mode */
.dark :focus-visible {
  outline-color: #818CF8;
}
```

### Etiquetas ARIA

```html
<!-- Botones sin texto visible -->
<button aria-label="Cerrar menú" class="...">
  <svg><!-- X icon --></svg>
</button>

<!-- Imágenes -->
<img src="dashboard.jpg" alt="Vista del dashboard de Analítica Empresarial">

<!-- Inputs -->
<input type="text" aria-label="Correo electrónico" ...>
```

### Navegación por Teclado

```
✅ Tab para mover entre elementos
✅ Enter/Space para activar
✅ Escape para cerrar modales/dropdowns
✅ Arrow keys en menús y selects
```

---

## 13. Tokens CSS (Custom Properties)

Para implementación en sistemas que no usan Tailwind directamente:

```css
:root {
  /* Colors - Light Mode */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-primary-light: #EEF2FF;
  --color-secondary: #64748B;
  --color-accent: #10B981;
  --color-warning: #F59E0B;
  --color-error: #F43F5E;
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94A3B8;
  --color-border: #E2E8F0;

  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #818CF8;
    --color-bg-primary: #020617;
    --color-bg-secondary: #0F172A;
    --color-text-primary: #F8FAFC;
    --color-text-secondary: #94A3B8;
    --color-border: #334155;
  }
}
```

---

## 14. Checklist de Implementación

### Pre-Delivery

```
□ No emojis como iconos (solo SVG)
□ Contraste WCAG 4.5:1 verificado
□ Touch targets mínimo 44x44px
□ Hover states sin layout shift
□ Transiciones 150-300ms
□ Focus states visibles
□ Dark mode funcional
□ Responsive en 375px, 768px, 1024px, 1440px
□ No scroll horizontal en mobile
```

---

## 15. Recursos

### Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Extensiones VS Code Recomendadas

- Tailwind CSS IntelliSense
- Headwind (clases CSS ordenado)
- Prettier
- ESLint

### Herramientas de Verificación

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind Play](https://play.tailwindcss.com/) para prototipado
- Lighthouse de Chrome para accesibilidad

---

*Documento creado: 2026-04-02*
*Versión: 1.0*
*Propietario: Bigso Design Team*
