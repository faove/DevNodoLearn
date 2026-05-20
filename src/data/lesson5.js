export const lesson = {
  id: 'lesson-5',
  title: 'CSS: Estilos y Layouts',
  subtitle: 'Lección 5 — Fase 2: Web',
  language: 'html',
  sections: [
    {
      id: 's1',
      title: 'Selectores, especificidad, cascada y herencia',
      content: `**CSS** (Cascading Style Sheets) controla cómo se ve el HTML. Para aplicar estilos, primero debes **seleccionar** el elemento al que apuntas.

**Tipos de selectores:**
- \`p\` — selector de elemento. Aplica a todas las etiquetas \`<p>\`.
- \`.clase\` — selector de clase. Aplica a cualquier elemento con \`class="clase"\`.
- \`#id\` — selector de ID. Solo aplica a un elemento con ese \`id\`.
- \`a[href]\` — selector de atributo. Aplica si el atributo existe.
- \`div p\` — descendiente. \`p\` dentro de \`div\`.
- \`div > p\` — hijo directo.

**Especificidad** decide qué regla gana cuando dos selectores apuntan al mismo elemento. La fórmula es \`(IDs, Clases, Elementos)\`:
- \`p\` → (0, 0, 1)
- \`.card\` → (0, 1, 0)
- \`#hero\` → (1, 0, 0)
- \`.card p\` → (0, 1, 1)

Un selector con más especificidad gana. Si hay empate, gana el que aparece **después** en el CSS (la cascada).

**Herencia**: algunas propiedades se heredan del padre al hijo — \`color\`, \`font-family\`, \`font-size\`. Otras no se heredan — \`margin\`, \`padding\`, \`border\`, \`width\`. Usa \`inherit\` para forzar herencia.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Selectores CSS</title>
  <style>
    /* Selector de elemento */
    p {
      color: #555;
      font-family: sans-serif;
    }

    /* Selector de clase */
    .destacado {
      color: #e74c3c;
      font-weight: bold;
    }

    /* Selector de ID (alta especificidad) */
    #principal {
      font-size: 1.5rem;
      color: #2c3e50;
    }

    /* Selector descendiente */
    .tarjeta p {
      color: #666;
      margin: 0;
    }

    /* La cascada: esta regla gana a "p" por especificidad de clase */
    .tarjeta .nota {
      color: #27ae60;
      font-style: italic;
    }
  </style>
</head>
<body>
  <p id="principal">Párrafo principal (color por ID)</p>
  <p>Párrafo normal (color por elemento)</p>
  <p class="destacado">Párrafo destacado (color por clase)</p>

  <div class="tarjeta">
    <p>Texto dentro de tarjeta (selector descendiente)</p>
    <p class="nota">Nota en tarjeta (clase > descendiente)</p>
  </div>
</body>
</html>`,
    },
    {
      id: 's2',
      title: 'Box model: margin, padding, border',
      content: `Cada elemento HTML es una **caja**. El box model define cómo se calcula su tamaño y espacio.

De adentro hacia afuera:
1. **content** — el contenido real (texto, imagen). \`width\` y \`height\` lo controlan.
2. **padding** — espacio interior entre el contenido y el borde. Tiene el color de fondo del elemento.
3. **border** — la línea que rodea el padding. \`border: 2px solid #333\`.
4. **margin** — espacio exterior entre la caja y otros elementos. Es transparente.

**El problema de \`box-sizing\`**: por defecto, \`width: 200px\` define el ancho del **contenido** — el padding y el border se suman encima. Con \`box-sizing: border-box\`, el \`width\` incluye padding y border. Casi todos los proyectos modernos usan esto globalmente:

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

**\`display\`** controla cómo la caja ocupa espacio:
- \`block\` — ocupa todo el ancho disponible, empieza en nueva línea (\`div\`, \`p\`, \`h1\`).
- \`inline\` — ocupa solo lo que necesita, no acepta \`width\`/\`height\` (\`span\`, \`a\`).
- \`inline-block\` — como inline pero acepta \`width\`/\`height\`.
- \`none\` — oculta el elemento completamente.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Box Model</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }

    body {
      font-family: sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }

    .tarjeta {
      width: 300px;
      padding: 24px;
      border: 2px solid #3498db;
      border-radius: 8px;
      margin: 16px auto;
      background: white;
    }

    .tarjeta h2 {
      margin: 0 0 12px 0;   /* top right bottom left */
      color: #2c3e50;
    }

    .tarjeta p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    /* inline-block: badges lado a lado */
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      background: #3498db;
      color: white;
      font-size: 0.8rem;
      margin-top: 12px;
      margin-right: 6px;
    }
  </style>
</head>
<body>
  <div class="tarjeta">
    <h2>Box Model</h2>
    <p>Esta tarjeta tiene: 24px de padding, 2px de border, y margin auto para centrarse.</p>
    <span class="badge">CSS</span>
    <span class="badge">Layout</span>
  </div>
</body>
</html>`,
    },
    {
      id: 's3',
      title: 'Flexbox completo',
      content: `**Flexbox** es el sistema de layout de una dimensión (fila o columna). Con \`display: flex\` en el **contenedor**, los hijos directos se convierten en **flex items**.

**Propiedades del contenedor:**
- \`flex-direction\` — \`row\` (default), \`row-reverse\`, \`column\`, \`column-reverse\`.
- \`justify-content\` — alineación en el eje principal: \`flex-start\`, \`flex-end\`, \`center\`, \`space-between\`, \`space-around\`, \`space-evenly\`.
- \`align-items\` — alineación en el eje cruzado: \`stretch\` (default), \`flex-start\`, \`flex-end\`, \`center\`, \`baseline\`.
- \`flex-wrap\` — \`nowrap\` (default), \`wrap\`. Con \`wrap\`, los items se van a la siguiente línea si no caben.
- \`gap\` — espacio entre items. Reemplaza márgenes manuales.
- \`align-content\` — alineación de múltiples líneas (solo con \`flex-wrap: wrap\`).

**Propiedades de los items:**
- \`flex-grow\` — cuánto crece el item para llenar espacio extra (0 = no crece).
- \`flex-shrink\` — cuánto se encoge si el espacio es insuficiente (1 = se encoge).
- \`flex-basis\` — tamaño base antes de distribuir espacio extra.
- \`flex: 1\` — shorthand para \`flex-grow: 1; flex-shrink: 1; flex-basis: 0\`. Muy usado.
- \`align-self\` — sobreescribe \`align-items\` para un item específico.
- \`order\` — cambia el orden visual sin cambiar el HTML.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Flexbox</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: sans-serif; margin: 0; background: #f0f2f5; }

    /* Navbar con flexbox */
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      height: 60px;
      background: #2c3e50;
      color: white;
    }

    nav .logo { font-weight: bold; font-size: 1.2rem; }

    nav ul {
      display: flex;
      gap: 24px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    nav a { color: white; text-decoration: none; }

    /* Grid de tarjetas con flex-wrap */
    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding: 24px;
    }

    .tarjeta {
      flex: 1 1 200px;   /* crece, se encoge, base 200px */
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .tarjeta h3 { margin: 0 0 8px; color: #2c3e50; }
    .tarjeta p { margin: 0; color: #666; font-size: 0.9rem; }
  </style>
</head>
<body>
  <nav>
    <span class="logo">FlexSite</span>
    <ul>
      <li><a href="#">Inicio</a></li>
      <li><a href="#">Proyectos</a></li>
      <li><a href="#">Contacto</a></li>
    </ul>
  </nav>

  <div class="grid">
    <div class="tarjeta">
      <h3>Tarjeta 1</h3>
      <p>flex: 1 — crece para llenar el espacio disponible.</p>
    </div>
    <div class="tarjeta">
      <h3>Tarjeta 2</h3>
      <p>Con flex-wrap, pasan a la siguiente fila si no caben.</p>
    </div>
    <div class="tarjeta">
      <h3>Tarjeta 3</h3>
      <p>gap reemplaza márgenes entre elementos.</p>
    </div>
  </div>
</body>
</html>`,
    },
    {
      id: 's4',
      title: 'CSS Grid básico a intermedio',
      content: `**CSS Grid** es el sistema de layout de dos dimensiones (filas y columnas simultáneamente). Es ideal para layouts de página completos.

**Definir el grid:**
- \`display: grid\` — activa el grid en el contenedor.
- \`grid-template-columns\` — define las columnas. \`repeat(3, 1fr)\` crea 3 columnas iguales. \`1fr\` es una fracción del espacio disponible.
- \`grid-template-rows\` — define las filas.
- \`gap\` — espacio entre celdas (también \`column-gap\` y \`row-gap\`).

**Colocar items:**
- \`grid-column: 1 / 3\` — el item ocupa de la línea 1 a la 3 (2 columnas).
- \`grid-column: span 2\` — el item ocupa 2 columnas desde su posición.
- \`grid-row: span 2\` — el item ocupa 2 filas.

**Grid template areas** — la forma más legible de definir layouts:
\`\`\`css
grid-template-areas:
  "header header header"
  "sidebar main main"
  "footer footer footer";
\`\`\`
Cada item usa \`grid-area: header\` para ubicarse.

**\`auto-fill\` y \`auto-fit\`** con \`minmax()\` crean grids responsivos sin media queries:
\`grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))\``,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>CSS Grid</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: sans-serif; margin: 0; padding: 20px; background: #f0f2f5; }

    /* Layout de página con grid-template-areas */
    .pagina {
      display: grid;
      grid-template-columns: 220px 1fr;
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        "header  header"
        "sidebar main"
        "footer  footer";
      gap: 16px;
      min-height: 400px;
    }

    .header  { grid-area: header;  background: #2c3e50; color: white; padding: 16px 24px; border-radius: 8px; }
    .sidebar { grid-area: sidebar; background: #ecf0f1; padding: 16px; border-radius: 8px; }
    .main    { grid-area: main;    background: white;   padding: 24px; border-radius: 8px; }
    .footer  { grid-area: footer;  background: #bdc3c7; padding: 12px 24px; border-radius: 8px; text-align: center; }

    /* Grid auto-fit: columnas responsivas sin media queries */
    .galeria {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }

    .item {
      background: #3498db;
      color: white;
      padding: 20px;
      border-radius: 6px;
      text-align: center;
    }

    .item.grande { grid-column: span 2; background: #e74c3c; }
  </style>
</head>
<body>
  <div class="pagina">
    <header class="header">
      <h1 style="margin:0;font-size:1.2rem">CSS Grid Layout</h1>
    </header>
    <aside class="sidebar">
      <h3>Sidebar</h3>
      <p>Columna fija de 220px con grid-area.</p>
    </aside>
    <main class="main">
      <h2>Contenido principal</h2>
      <p>Ocupa el espacio restante (1fr).</p>
      <div class="galeria">
        <div class="item">A</div>
        <div class="item grande">B — span 2</div>
        <div class="item">C</div>
        <div class="item">D</div>
        <div class="item">E</div>
      </div>
    </main>
    <footer class="footer">© 2025 — Grid Demo</footer>
  </div>
</body>
</html>`,
    },
    {
      id: 's5',
      title: 'Responsive design: media queries y unidades relativas',
      content: `Una página **responsive** se adapta a cualquier tamaño de pantalla. Hay dos pilares: **unidades relativas** y **media queries**.

**Unidades relativas:**
- \`%\` — relativo al padre. \`width: 50%\` ocupa la mitad del contenedor.
- \`em\` — relativo al \`font-size\` del elemento actual. \`padding: 1em\` = 1× el font-size.
- \`rem\` — relativo al \`font-size\` del \`<html>\` (16px por defecto). Más predecible que \`em\`.
- \`vw\` / \`vh\` — porcentaje del viewport. \`100vw\` = ancho total de la pantalla.
- \`min()\`, \`max()\`, \`clamp()\` — funciones para valores fluidos: \`font-size: clamp(1rem, 2.5vw, 2rem)\`.

**Enfoque mobile-first**: escribe los estilos base para móvil, luego usa \`min-width\` para añadir estilos en pantallas más grandes. Es más limpio que partir de escritorio y reducir.

\`\`\`css
/* base: móvil */
.grid { grid-template-columns: 1fr; }

/* tablet */
@media (min-width: 600px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* escritorio */
@media (min-width: 960px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
\`\`\`

Breakpoints comunes: **480px** (móvil grande), **768px** (tablet), **1024px** (laptop), **1280px** (escritorio).`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    :root {
      --max-width: 1100px;
      --padding: 1rem;
    }

    body {
      font-family: sans-serif;
      margin: 0;
      font-size: 1rem;
    }

    .contenedor {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 var(--padding);
    }

    /* Tipografía fluida */
    h1 {
      font-size: clamp(1.5rem, 5vw, 3rem);
      margin: 1.5rem 0;
    }

    /* Mobile-first: 1 columna base */
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1rem 0;
    }

    .tarjeta {
      background: #3498db;
      color: white;
      padding: 1.5rem;
      border-radius: 10px;
    }

    /* Tablet: 2 columnas */
    @media (min-width: 600px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Escritorio: 3 columnas */
    @media (min-width: 960px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
      :root { --padding: 2rem; }
    }
  </style>
</head>
<body>
  <div class="contenedor">
    <h1>Diseño Responsive</h1>
    <div class="grid">
      <div class="tarjeta"><h3>Móvil</h3><p>1 columna</p></div>
      <div class="tarjeta"><h3>Tablet</h3><p>2 columnas (600px+)</p></div>
      <div class="tarjeta"><h3>Desktop</h3><p>3 columnas (960px+)</p></div>
      <div class="tarjeta"><h3>Fluido</h3><p>clamp() para tipografía</p></div>
      <div class="tarjeta"><h3>Variables</h3><p>--max-width con :root</p></div>
      <div class="tarjeta"><h3>Mobile-first</h3><p>min-width queries</p></div>
    </div>
  </div>
</body>
</html>`,
    },
    {
      id: 's6',
      title: 'Variables CSS y pseudo-clases',
      content: `**Variables CSS** (custom properties) permiten definir valores reutilizables. Se declaran en \`:root\` para estar disponibles en todo el documento.

\`\`\`css
:root {
  --color-primario: #3498db;
  --radio-borde: 8px;
}

.boton {
  background: var(--color-primario);
  border-radius: var(--radio-borde);
}
\`\`\`

Ventaja clave: cambias un valor en un lugar y afectas todo. Perfectas para temas (modo oscuro).

**Pseudo-clases** — seleccionan elementos según su estado:
- \`:hover\` — cuando el cursor está encima.
- \`:focus\` — cuando el elemento tiene el foco (teclado/clic).
- \`:active\` — mientras se hace clic.
- \`:visited\` — enlaces visitados.
- \`:first-child\` / \`:last-child\` — primer o último hijo.
- \`:nth-child(n)\` — el n-ésimo hijo. \`:nth-child(2n)\` selecciona pares.
- \`:not(.clase)\` — cualquier elemento que no tenga la clase.

**Pseudo-elementos** — seleccionan partes de un elemento:
- \`::before\` / \`::after\` — insertan contenido antes o después. Requieren \`content: ""\`.
- \`::placeholder\` — el placeholder de un input.
- \`::first-line\` — la primera línea de un párrafo.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Variables y Pseudo-clases</title>
  <style>
    :root {
      --color-primario: #6c63ff;
      --color-acento: #ff6584;
      --radio: 8px;
      --transicion: 0.25s ease;
    }

    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: sans-serif; padding: 2rem; background: #f9f9f9; }

    /* Botones con :hover y :active */
    .boton {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: var(--color-primario);
      color: white;
      border: none;
      border-radius: var(--radio);
      cursor: pointer;
      font-size: 1rem;
      margin: 0.5rem;
    }

    .boton:hover { background: #5a52d5; transform: translateY(-2px); }
    .boton:active { transform: translateY(0); }

    /* Lista con :nth-child y ::before */
    ul { list-style: none; padding: 0; }

    li {
      padding: 0.75rem 1rem;
      border-radius: var(--radio);
      position: relative;
      padding-left: 2rem;
    }

    li::before {
      content: "→";
      position: absolute;
      left: 0.5rem;
      color: var(--color-primario);
    }

    li:nth-child(odd)  { background: #eee; }
    li:nth-child(even) { background: #ddd; }
    li:last-child { font-weight: bold; color: var(--color-acento); }

    /* Input con :focus y ::placeholder */
    input {
      display: block;
      padding: 0.75rem 1rem;
      border: 2px solid #ccc;
      border-radius: var(--radio);
      font-size: 1rem;
      width: 100%;
      max-width: 300px;
      margin-top: 1rem;
      outline: none;
    }

    input::placeholder { color: #aaa; font-style: italic; }
    input:focus { border-color: var(--color-primario); box-shadow: 0 0 0 3px rgba(108,99,255,0.2); }
  </style>
</head>
<body>
  <button class="boton">Hover sobre mí</button>
  <button class="boton">Otro botón</button>

  <ul>
    <li>Elemento impar</li>
    <li>Elemento par</li>
    <li>Elemento impar</li>
    <li>Elemento par</li>
    <li>Último hijo (bold + acento)</li>
  </ul>

  <input type="text" placeholder="Escribe algo (prueba :focus)...">
</body>
</html>`,
    },
    {
      id: 's7',
      title: 'Transiciones y animaciones CSS',
      content: `**Transiciones** animan el cambio entre dos estados. Se definen en el estado base, no en el estado hover.

\`\`\`css
.boton {
  background: blue;
  transition: background 0.3s ease, transform 0.2s ease;
}
.boton:hover {
  background: darkblue;
  transform: scale(1.05);
}
\`\`\`

La propiedad \`transition\` acepta: \`propiedad duración timing-function delay\`.
- **Timing functions**: \`ease\` (default), \`linear\`, \`ease-in\`, \`ease-out\`, \`ease-in-out\`, \`cubic-bezier()\`.

**Animaciones** con \`@keyframes\` permiten controlar múltiples etapas y repetición.

\`\`\`css
@keyframes latir {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.corazon {
  animation: latir 1s ease-in-out infinite;
}
\`\`\`

Propiedades de \`animation\`:
- \`animation-name\` — nombre del \`@keyframes\`.
- \`animation-duration\` — duración de un ciclo.
- \`animation-timing-function\` — curva de velocidad.
- \`animation-delay\` — retraso inicial.
- \`animation-iteration-count\` — número de repeticiones (\`infinite\` para siempre).
- \`animation-direction\` — \`normal\`, \`reverse\`, \`alternate\`.
- \`animation-fill-mode\` — \`forwards\` mantiene el estado final.

**Regla de rendimiento**: anima solo \`transform\` y \`opacity\` para 60fps. Animar \`width\`, \`height\`, \`top\` o \`margin\` causa reflows costosos.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Transiciones y Animaciones</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: sans-serif; padding: 2rem; background: #1a1a2e; color: white; }

    h2 { color: #e0e0e0; margin-bottom: 1.5rem; }

    /* Transición en tarjeta */
    .tarjeta {
      width: 180px;
      height: 120px;
      background: #16213e;
      border: 2px solid #0f3460;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 0.5rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
    }

    .tarjeta:hover {
      transform: translateY(-8px) scale(1.03);
      background: #0f3460;
      box-shadow: 0 12px 30px rgba(229, 57, 53, 0.4);
    }

    /* Animación de pulso */
    .pulso {
      width: 80px; height: 80px;
      background: #e53935;
      border-radius: 50%;
      margin: 1rem;
      animation: pulso 1.5s ease-in-out infinite;
    }

    @keyframes pulso {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%       { transform: scale(1.2); opacity: 0.7; }
    }

    /* Animación de entrada con fill-mode */
    .entrada {
      background: #533483;
      padding: 1rem 2rem;
      border-radius: 8px;
      display: inline-block;
      animation: deslizar 0.6s ease-out forwards;
      opacity: 0;
    }

    @keyframes deslizar {
      from { opacity: 0; transform: translateX(-40px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* Loader girando */
    .loader {
      width: 40px; height: 40px;
      border: 4px solid rgba(255,255,255,0.2);
      border-top-color: #e94560;
      border-radius: 50%;
      margin: 1rem;
      animation: girar 0.8s linear infinite;
    }

    @keyframes girar {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <h2>Transiciones (hover)</h2>
  <div class="tarjeta">Hover aquí</div>
  <div class="tarjeta">Y aquí</div>

  <h2>Animaciones</h2>
  <div class="pulso"></div>
  <div class="loader"></div>
  <div class="entrada">Entrada con deslizamiento</div>
</body>
</html>`,
    },
    {
      id: 's8',
      title: 'Proyecto: Landing page responsive',
      content: `Es hora de construir una **landing page completa** aplicando todo lo aprendido. El objetivo es una página con diseño **mobile-first**, sin frameworks, usando Flexbox y Grid.

La página debe incluir:

1. **Navbar** fija con logo y links — Flexbox, \`space-between\`.
2. **Hero section** — título con \`clamp()\`, subtítulo, botón con hover.
3. **Sección de características** — Grid \`auto-fit minmax()\`, tarjetas con pseudo-elemento \`::before\` decorativo.
4. **Variables CSS** en \`:root\` para colores y radio de bordes.
5. **Transiciones** en botones y tarjetas.
6. **Media query** que ajuste el layout en móvil (máximo 600px): navbar apila verticalmente, hero centra el texto.
7. **Footer** con texto centrado.

**Criterios de evaluación:**
- Usa \`display: flex\` para el navbar y algún componente.
- Usa \`display: grid\` para la sección de características.
- Define al menos 3 variables CSS en \`:root\`.
- Tiene al menos 1 \`@media\` query.
- Tiene transición en botones o tarjetas.
- Tiene un \`<footer>\` con contenido.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevNodo — Aprende a programar</title>
  <style>
    :root {
      --color-primario: #6c63ff;
      --color-acento: #ff6584;
      --color-fondo: #0d0d1a;
      --color-superficie: #1a1a2e;
      --color-texto: #e0e0e0;
      --radio: 10px;
      --transicion: 0.3s ease;
      --max-ancho: 1100px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', sans-serif;
      background: var(--color-fondo);
      color: var(--color-texto);
      line-height: 1.6;
    }

    /* ── NAVBAR ── */
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: var(--color-superficie);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(108,99,255,0.2);
    }

    .logo {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--color-primario);
      text-decoration: none;
    }

    nav ul {
      display: flex;
      gap: 2rem;
      list-style: none;
    }

    nav a {
      color: var(--color-texto);
      text-decoration: none;
      font-size: 0.95rem;
      transition: color var(--transicion);
    }

    nav a:hover { color: var(--color-primario); }

    /* ── HERO ── */
    .hero {
      text-align: center;
      padding: 6rem 2rem;
      background: radial-gradient(ellipse at center, rgba(108,99,255,0.15) 0%, transparent 70%);
    }

    .hero h1 {
      font-size: clamp(2rem, 6vw, 4rem);
      color: white;
      margin-bottom: 1rem;
    }

    .hero h1 span { color: var(--color-primario); }

    .hero p {
      font-size: clamp(1rem, 2.5vw, 1.25rem);
      color: #999;
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .btn {
      display: inline-block;
      padding: 0.9rem 2rem;
      background: var(--color-primario);
      color: white;
      border: none;
      border-radius: var(--radio);
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      transition: transform var(--transicion), box-shadow var(--transicion);
    }

    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(108,99,255,0.4);
    }

    .btn-secundario {
      background: transparent;
      border: 2px solid var(--color-primario);
      margin-left: 1rem;
    }

    .btn-secundario:hover { background: var(--color-primario); }

    /* ── CARACTERÍSTICAS ── */
    .caracteristicas {
      max-width: var(--max-ancho);
      margin: 0 auto;
      padding: 4rem 2rem;
    }

    .caracteristicas h2 {
      text-align: center;
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      margin-bottom: 0.5rem;
      color: white;
    }

    .subtitulo-seccion {
      text-align: center;
      color: #888;
      margin-bottom: 3rem;
    }

    .grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: var(--color-superficie);
      border-radius: var(--radio);
      padding: 2rem;
      border: 1px solid rgba(255,255,255,0.06);
      position: relative;
      overflow: hidden;
      transition: transform var(--transicion), border-color var(--transicion);
    }

    .card::before {
      content: "";
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 3px;
      background: var(--color-primario);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform var(--transicion);
    }

    .card:hover { transform: translateY(-4px); border-color: rgba(108,99,255,0.3); }
    .card:hover::before { transform: scaleX(1); }

    .card .icono {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .card h3 { color: white; margin-bottom: 0.5rem; }
    .card p  { color: #888; font-size: 0.95rem; }

    /* ── FOOTER ── */
    footer {
      text-align: center;
      padding: 2rem;
      background: var(--color-superficie);
      color: #666;
      font-size: 0.9rem;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    footer a { color: var(--color-primario); text-decoration: none; }

    /* ── RESPONSIVE ── */
    @media (max-width: 600px) {
      nav { flex-direction: column; gap: 1rem; padding: 1rem; }
      nav ul { gap: 1.5rem; }
      .hero { padding: 4rem 1.5rem; }
      .btn-secundario { margin-left: 0; margin-top: 0.75rem; }
      .hero .acciones { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    }
  </style>
</head>
<body>

  <nav>
    <a class="logo" href="#">DevNodo</a>
    <ul>
      <li><a href="#caracteristicas">Características</a></li>
      <li><a href="#" class="btn" style="padding:0.5rem 1.2rem;font-size:0.9rem">Empezar gratis</a></li>
    </ul>
  </nav>

  <section class="hero">
    <h1>Aprende a programar<br><span>sin perderte</span></h1>
    <p>Lecciones interactivas con editor en tiempo real y un tutor AI que te explica cada error.</p>
    <div class="acciones">
      <a href="#" class="btn">Comenzar ahora →</a>
      <a href="#caracteristicas" class="btn btn-secundario">Ver características</a>
    </div>
  </section>

  <section class="caracteristicas" id="caracteristicas">
    <h2>¿Por qué DevNodo?</h2>
    <p class="subtitulo-seccion">Todo lo que necesitas para pasar de cero a dev</p>

    <div class="grid-cards">
      <div class="card">
        <div class="icono">⚡</div>
        <h3>Editor en tiempo real</h3>
        <p>Escribe código y ve el resultado al instante. Sin instalaciones, directo en el navegador.</p>
      </div>
      <div class="card">
        <div class="icono">🤖</div>
        <h3>Tutor AI</h3>
        <p>Pregunta cualquier duda en lenguaje natural. El tutor explica, no solo da la respuesta.</p>
      </div>
      <div class="card">
        <div class="icono">🗺️</div>
        <h3>Ruta estructurada</h3>
        <p>Desde Python básico hasta apps web completas. Cada lección construye sobre la anterior.</p>
      </div>
      <div class="card">
        <div class="icono">✅</div>
        <h3>Validación automática</h3>
        <p>Cada ejercicio se evalúa en tiempo real con retroalimentación específica sobre tu código.</p>
      </div>
    </div>
  </section>

  <footer>
    <p>© 2025 DevNodo — Hecho con ♥ y CSS puro &nbsp;·&nbsp; <a href="#">GitHub</a></p>
  </footer>

</body>
</html>`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Selectores y especificidad',
    description: 'Escribe una hoja de estilos con: un selector de elemento que ponga `color: #333` a los párrafos, una clase `.destacado` con `font-weight: bold` y `color: #e74c3c`, y un ID `#titulo` con `font-size: 2rem`. Aplícalos en el HTML.',
    hint: 'Los selectores van dentro de <style>. Usa p { }, .destacado { }, #titulo { }. Recuerda aplicar la clase e ID a los elementos en el HTML.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Selectores</title>
  <style>
    /* Selector de elemento: color #333 a párrafos */

    /* Clase .destacado: bold y color #e74c3c */

    /* ID #titulo: font-size 2rem */

  </style>
</head>
<body>
  <h1 id="titulo">Título principal</h1>
  <p>Párrafo normal con color #333.</p>
  <p class="destacado">Párrafo destacado en rojo y bold.</p>
</body>
</html>
`,
    validate(_output, code) {
      const lower = code.toLowerCase()
      if (!lower.includes('<style')) return { ok: false, message: 'Agrega un bloque <style> en el <head>.' }
      if (!/\bp\b\s*\{[^}]*color\s*:\s*#333/i.test(code)) return { ok: false, message: 'Agrega un selector "p" con color: #333.' }
      if (!lower.includes('.destacado')) return { ok: false, message: 'Agrega una clase .destacado en los estilos.' }
      if (!/\.destacado\s*\{[^}]*font-weight\s*:\s*bold/i.test(code)) return { ok: false, message: 'La clase .destacado necesita font-weight: bold.' }
      if (!/\.destacado\s*\{[^}]*color\s*:/i.test(code)) return { ok: false, message: 'La clase .destacado necesita un color.' }
      if (!lower.includes('#titulo')) return { ok: false, message: 'Agrega un selector de ID #titulo.' }
      if (!/#titulo\s*\{[^}]*font-size\s*:/i.test(code)) return { ok: false, message: 'El ID #titulo necesita font-size: 2rem.' }
      if (!lower.includes('id="titulo"') && !lower.includes("id='titulo'")) return { ok: false, message: 'Aplica el ID id="titulo" a un elemento en el HTML.' }
      if (!lower.includes('class="destacado"') && !lower.includes("class='destacado'")) return { ok: false, message: 'Aplica class="destacado" a un elemento en el HTML.' }
      return { ok: true, message: '¡Selectores dominados! Elemento, clase e ID — los tres pilares de CSS.' }
    },
  },
  {
    id: 'ex2',
    title: 'Box model con tarjeta',
    description: 'Crea una tarjeta `.tarjeta` con: `width: 300px`, `padding: 24px`, `border: 2px solid #3498db`, `border-radius: 8px`, `margin: 20px auto`, y `background: white`. Aplica `box-sizing: border-box` globalmente.',
    hint: 'Usa el selector universal * { box-sizing: border-box; } para aplicarlo globalmente. La clase .tarjeta va en un <div class="tarjeta"> en el body.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Box Model</title>
  <style>
    /* box-sizing global */

    body {
      background: #f0f2f5;
      font-family: sans-serif;
    }

    /* Estila la tarjeta aquí */

  </style>
</head>
<body>
  <div class="tarjeta">
    <h2>Mi tarjeta</h2>
    <p>Esta tarjeta usa el box model correctamente.</p>
  </div>
</body>
</html>
`,
    validate(_output, code) {
      const lower = code.toLowerCase()
      if (!lower.includes('<style')) return { ok: false, message: 'Agrega un bloque <style> con los estilos.' }
      if (!/\*\s*\{[^}]*box-sizing\s*:\s*border-box/i.test(code)) return { ok: false, message: 'Aplica box-sizing: border-box globalmente con el selector *.' }
      if (!lower.includes('.tarjeta')) return { ok: false, message: 'Agrega los estilos para la clase .tarjeta.' }
      if (!lower.includes('class="tarjeta"') && !lower.includes("class='tarjeta'")) return { ok: false, message: 'Aplica class="tarjeta" al elemento en el HTML.' }
      if (!/\.tarjeta\s*\{[^}]*width\s*:/i.test(code)) return { ok: false, message: 'La tarjeta necesita un width.' }
      if (!/\.tarjeta\s*\{[^}]*padding\s*:/i.test(code)) return { ok: false, message: 'La tarjeta necesita padding.' }
      if (!/\.tarjeta\s*\{[^}]*border\s*:/i.test(code)) return { ok: false, message: 'La tarjeta necesita un border.' }
      if (!/\.tarjeta\s*\{[^}]*border-radius\s*:/i.test(code)) return { ok: false, message: 'Agrega border-radius a la tarjeta.' }
      if (!/\.tarjeta\s*\{[^}]*margin\s*:/i.test(code)) return { ok: false, message: 'Agrega margin para separar la tarjeta.' }
      return { ok: true, message: '¡Box model perfecto! border-box + padding + border + margin = control total del espacio.' }
    },
  },
  {
    id: 'ex3',
    title: 'Navbar y cards con Flexbox',
    description: 'Crea un `<nav>` con `display: flex`, `justify-content: space-between` y `align-items: center`. Luego un contenedor `.cards` con `display: flex`, `flex-wrap: wrap` y `gap: 16px`, con al menos 3 divs `.card` que tengan `flex: 1 1 200px`.',
    hint: 'El nav tiene logo y una lista de enlaces. El .cards va en el body fuera del nav. Los .card son divs dentro de .cards.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Flexbox</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: sans-serif; margin: 0; background: #f5f5f5; }

    /* Estila el nav con flexbox */
    nav {

    }

    /* Contenedor de cards con flex-wrap */
    .cards {

    }

    /* Cada card con flex: 1 1 200px */
    .card {

    }
  </style>
</head>
<body>
  <nav>
    <span>Mi Sitio</span>
    <ul style="list-style:none;display:flex;gap:1rem;margin:0;padding:0">
      <li><a href="#">Inicio</a></li>
      <li><a href="#">Proyectos</a></li>
    </ul>
  </nav>

  <div class="cards">
    <div class="card"><h3>Card 1</h3><p>Contenido</p></div>
    <div class="card"><h3>Card 2</h3><p>Contenido</p></div>
    <div class="card"><h3>Card 3</h3><p>Contenido</p></div>
  </div>
</body>
</html>
`,
    validate(_output, code) {
      const lower = code.toLowerCase()
      if (!/nav\s*\{[^}]*display\s*:\s*flex/i.test(code)) return { ok: false, message: 'El nav necesita display: flex.' }
      if (!/nav\s*\{[^}]*justify-content\s*:\s*space-between/i.test(code)) return { ok: false, message: 'El nav necesita justify-content: space-between.' }
      if (!/nav\s*\{[^}]*align-items\s*:\s*center/i.test(code)) return { ok: false, message: 'El nav necesita align-items: center.' }
      if (!lower.includes('.cards')) return { ok: false, message: 'Agrega estilos para .cards.' }
      if (!/.cards\s*\{[^}]*display\s*:\s*flex/i.test(code)) return { ok: false, message: '.cards necesita display: flex.' }
      if (!/.cards\s*\{[^}]*flex-wrap\s*:\s*wrap/i.test(code)) return { ok: false, message: '.cards necesita flex-wrap: wrap.' }
      if (!/.cards\s*\{[^}]*gap\s*:/i.test(code)) return { ok: false, message: '.cards necesita gap para separar las tarjetas.' }
      if (!lower.includes('.card')) return { ok: false, message: 'Agrega estilos para .card.' }
      if (!/.card\s*\{[^}]*flex\s*:/i.test(code)) return { ok: false, message: '.card necesita la propiedad flex (flex: 1 1 200px).' }
      const cardCount = (lower.match(/class="card"/g) || lower.match(/class='card'/g) || []).length
      if (cardCount < 3) return { ok: false, message: `Agrega al menos 3 elementos .card en el HTML. Tienes ${cardCount}.` }
      return { ok: true, message: '¡Flexbox en acción! Navbar con space-between y grid de cards con flex-wrap.' }
    },
  },
  {
    id: 'ex4',
    title: 'Layout con CSS Grid',
    description: 'Crea un layout de página con `display: grid` usando `grid-template-areas` con 3 áreas: `header`, `main` y `footer`. El header y footer deben ocupar el ancho completo. Usa `gap` entre áreas.',
    hint: 'Define grid-template-areas en el contenedor con las 3 áreas en forma de cadena. Luego asigna grid-area: header / main / footer a cada elemento hijo.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>CSS Grid</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: sans-serif; margin: 0; padding: 20px; background: #f0f0f0; min-height: 100vh; }

    /* Contenedor grid con template-areas */
    .pagina {

    }

    .header { grid-area: header; background: #2c3e50; color: white; padding: 1rem 2rem; border-radius: 8px; }
    .main   { grid-area: main;   background: white; padding: 2rem; border-radius: 8px; }
    .footer { grid-area: footer; background: #95a5a6; color: white; padding: 1rem 2rem; border-radius: 8px; text-align: center; }
  </style>
</head>
<body>
  <div class="pagina">
    <header class="header"><h1 style="margin:0">Mi Sitio</h1></header>
    <main class="main">
      <h2>Contenido principal</h2>
      <p>El grid-area coloca cada elemento en su zona definida.</p>
    </main>
    <footer class="footer">© 2025</footer>
  </div>
</body>
</html>
`,
    validate(_output, code) {
      const lower = code.toLowerCase()
      if (!/.pagina\s*\{[^}]*display\s*:\s*grid/i.test(code)) return { ok: false, message: 'El contenedor .pagina necesita display: grid.' }
      if (!lower.includes('grid-template-areas')) return { ok: false, message: 'Usa grid-template-areas para definir las zonas del layout.' }
      if (!lower.includes('"header') && !lower.includes("'header")) return { ok: false, message: 'Define el área "header" en grid-template-areas.' }
      if (!lower.includes('"main') && !lower.includes("'main")) return { ok: false, message: 'Define el área "main" en grid-template-areas.' }
      if (!lower.includes('"footer') && !lower.includes("'footer")) return { ok: false, message: 'Define el área "footer" en grid-template-areas.' }
      if (!/.pagina\s*\{[^}]*gap\s*:/i.test(code)) return { ok: false, message: 'Agrega gap al contenedor .pagina para separar las áreas.' }
      return { ok: true, message: '¡Grid layout con áreas nombradas! La forma más legible de definir layouts complejos.' }
    },
  },
  {
    id: 'ex5',
    title: 'Proyecto: landing page responsive',
    description: 'Construye una landing page completa con: variables CSS en `:root` (al menos 3), navbar con Flexbox, sección hero con botón que tenga transición en `:hover`, grid de características con `auto-fit minmax()`, y un `@media` query para móvil (max-width: 600px). Más un `<footer>`.',
    hint: 'Estructura: nav + section.hero + section.features (grid) + footer. Las variables van en :root { --nombre: valor; }. La media query ajusta el nav y el grid en pantallas pequeñas.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Landing Page</title>
  <style>
    /* Variables CSS */
    :root {

    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; }

    /* Navbar con Flexbox */

    /* Hero con botón y transición */

    /* Grid de características */

    /* Media query móvil (max-width: 600px) */

    /* Footer */

  </style>
</head>
<body>

  <!-- Navbar -->

  <!-- Hero -->

  <!-- Features / Características -->

  <!-- Footer -->

</body>
</html>
`,
    validate(_output, code) {
      const lower = code.toLowerCase()

      const cssVarCount = (code.match(/--[a-zA-Z][a-zA-Z0-9-]*\s*:/g) || []).length
      if (cssVarCount < 3) return { ok: false, message: `Define al menos 3 variables CSS en :root (--nombre: valor). Tienes ${cssVarCount}.` }

      if (!lower.includes('display: flex') && !lower.includes('display:flex')) return { ok: false, message: 'Usa display: flex para el navbar u otro componente.' }

      if (!lower.includes('display: grid') && !lower.includes('display:grid')) return { ok: false, message: 'Usa display: grid para la sección de características.' }

      if (!lower.includes('auto-fit') && !lower.includes('auto-fill')) return { ok: false, message: 'Usa repeat(auto-fit, minmax()) en el grid de características.' }

      if (!lower.includes('@media')) return { ok: false, message: 'Agrega al menos una @media query para el diseño responsive.' }
      if (!lower.includes('max-width: 600px') && !lower.includes('max-width:600px') && !lower.includes('min-width')) return { ok: false, message: 'La @media query debe controlar el layout móvil.' }

      if (!lower.includes('transition')) return { ok: false, message: 'Agrega una transición en el botón del hero (transition: ...).' }
      if (!lower.includes(':hover')) return { ok: false, message: 'Agrega un estado :hover al botón del hero.' }

      if (!lower.includes('<footer') || !lower.includes('</footer>')) return { ok: false, message: 'Agrega un <footer> al final de la página.' }

      if (!lower.includes('<nav') || !lower.includes('</nav>')) return { ok: false, message: 'Agrega un <nav> para la barra de navegación.' }

      return { ok: true, message: '¡Landing page profesional completa! Variables CSS, Flexbox, Grid, responsive y animaciones — el stack CSS completo.' }
    },
  },
]
