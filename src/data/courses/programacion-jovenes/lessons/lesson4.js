export const lesson = {
  id: 'lesson-4',
  title: 'HTML Semántico',
  subtitle: 'Lección 4 — Fase 2: Web',
  language: 'html',
  sections: [
    {
      id: 's1',
      title: 'Estructura de un documento HTML5',
      content: `**HTML** (HyperText Markup Language) es el lenguaje de marcado que estructura todo lo que ves en la web. No es un lenguaje de programación — no tiene lógica — pero es la base sobre la que construyes cualquier página.

Un documento HTML5 siempre empieza con \`<!DOCTYPE html>\`, que le dice al navegador qué versión usar. Luego viene la etiqueta raíz \`<html>\`, que contiene dos secciones: \`<head>\` y \`<body>\`.

**\`<head>\`** contiene metadatos: el juego de caracteres (\`<meta charset="UTF-8">\`), el título de la pestaña (\`<title>\`), y la configuración de pantalla (\`<meta name="viewport">\`). El viewport es crucial para que la página se vea bien en móviles.

**\`<body>\`** contiene todo lo que el usuario ve: textos, imágenes, formularios, tablas.

Las etiquetas trabajan en pares: \`<p>texto</p>\`. Algunas son auto-cerrantes: \`<img />\`, \`<input />\`.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi primera página web</title>
</head>
<body>
  <h1>¡Hola, mundo!</h1>
  <p>Esta es mi primera página HTML.</p>
  <p>HTML estructura el contenido; CSS lo hace bonito; JS lo hace interactivo.</p>
</body>
</html>`,
    },
    {
      id: 's2',
      title: 'Etiquetas semánticas de layout',
      content: `Antes de HTML5, todo se hacía con \`<div>\`. El problema: los \`<div>\` no describen qué contienen. Para un lector de pantalla o un motor de búsqueda, todos son iguales — sin significado.

HTML5 introdujo etiquetas **semánticas** que sí describen su propósito:

- **\`<header>\`** — cabecera de la página o sección. Logo, título, menú principal.
- **\`<nav>\`** — bloque de navegación con enlaces.
- **\`<main>\`** — contenido principal. Solo uno por página.
- **\`<section>\`** — agrupa contenido relacionado. Tiene su propio \`<h2>\`.
- **\`<article>\`** — contenido independiente (un post, una tarjeta).
- **\`<aside>\`** — contenido lateral (datos curiosos, navegación secundaria).
- **\`<footer>\`** — pie de página. Copyright, redes sociales, contacto.

Usar semántica importa por: **accesibilidad** (lectores de pantalla navegan por secciones), **SEO** (Google entiende qué es importante), y **mantenibilidad** (el código se lee como un documento).`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Blog de tecnología</title>
</head>
<body>
  <header>
    <h1>TechBlog</h1>
    <nav>
      <a href="#inicio">Inicio</a>
      <a href="#articulos">Artículos</a>
      <a href="#contacto">Contacto</a>
    </nav>
  </header>

  <main>
    <section id="articulos">
      <h2>Últimos artículos</h2>
      <article>
        <h3>¿Qué es HTML semántico?</h3>
        <p>HTML semántico usa etiquetas con significado para estructurar el contenido...</p>
      </article>
      <article>
        <h3>CSS Grid vs Flexbox</h3>
        <p>Ambos son herramientas de layout, pero para casos distintos...</p>
      </article>
    </section>

    <aside>
      <h3>Dato curioso</h3>
      <p>Tim Berners-Lee inventó HTML en 1991.</p>
    </aside>
  </main>

  <footer>
    <p>&copy; 2025 TechBlog — Todos los derechos reservados</p>
  </footer>
</body>
</html>`,
    },
    {
      id: 's3',
      title: 'Textos, listas, enlaces e imágenes',
      content: `Los **encabezados** van de \`<h1>\` a \`<h6>\`. \`<h1>\` es el más importante (solo uno por página). No los uses para hacer texto grande — úsalos para estructurar el documento como un índice.

Los **párrafos** van en \`<p>\`. \`<strong>\` hace el texto negrita con significado semántico, \`<em>\` lo hace cursiva con énfasis.

Las **listas**: \`<ul>\` (sin orden) para items sin jerarquía. \`<ol>\` (ordenada) para secuencias o rankings. Cada item va en \`<li>\`.

Los **enlaces** usan \`<a href="url">\`. \`target="_blank"\` abre en nueva pestaña — siempre agrégale \`rel="noopener"\` por seguridad. Para secciones de la misma página usa \`href="#id"\`.

Las **imágenes** se insertan con \`<img src="ruta" alt="descripción">\`. El \`alt\` es obligatorio — es lo que leen los lectores de pantalla y lo que muestra el navegador si la imagen falla. \`width\` y \`height\` evitan el salto visual al cargar.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mis favoritos</title>
</head>
<body>
  <h1>Mis cosas favoritas</h1>

  <h2>Lenguajes de programación</h2>
  <ol>
    <li><strong>Python</strong> — legible y poderoso</li>
    <li>JavaScript — para la web</li>
    <li>Rust — ultra rápido</li>
  </ol>

  <h2>Recursos útiles</h2>
  <ul>
    <li>
      <a href="https://developer.mozilla.org" target="_blank" rel="noopener">
        MDN Web Docs
      </a>
    </li>
    <li>
      <a href="https://css-tricks.com" target="_blank" rel="noopener">
        CSS-Tricks
      </a>
    </li>
  </ul>

  <h2>Logo de HTML</h2>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/240px-HTML5_logo_and_wordmark.svg.png"
    alt="Logo oficial de HTML5 con el número 5 en naranja"
    width="80"
  >
</body>
</html>`,
    },
    {
      id: 's4',
      title: 'Formularios',
      content: `Los **formularios** permiten que el usuario envíe datos. Todo vive dentro de \`<form>\`. El atributo \`action\` define a dónde se envían y \`method\` el método HTTP (\`GET\` o \`POST\`).

Cada campo tiene:
- **\`<label>\`** — etiqueta visible. Conéctala al input con \`for="id-del-input"\`.
- **\`<input>\`** — campo de texto. El tipo cambia con \`type\`: \`text\`, \`email\`, \`password\`, \`number\`, \`date\`, \`checkbox\`, \`radio\`.
- **\`<textarea>\`** — campo de texto multilínea.
- **\`<select>\` + \`<option>\`** — menú desplegable.
- **\`<button type="submit">\`** — envía el formulario.

Atributos importantes: \`name\` (clave del dato al enviar), \`placeholder\` (texto guía), \`required\` (campo obligatorio).

La accesibilidad en formularios es crítica: siempre conecta \`<label>\` con \`<input>\` mediante \`for\`/\`id\`. Los usuarios de teclado dependen de esto.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Formulario de contacto</title>
</head>
<body>
  <h1>Contáctame</h1>

  <form action="/enviar" method="POST">
    <div>
      <label for="nombre">Nombre completo</label><br>
      <input type="text" id="nombre" name="nombre"
             placeholder="Ej: Ana García" required>
    </div>
    <br>
    <div>
      <label for="email">Correo electrónico</label><br>
      <input type="email" id="email" name="email"
             placeholder="ana@ejemplo.com" required>
    </div>
    <br>
    <div>
      <label for="tema">Tema</label><br>
      <select id="tema" name="tema">
        <option value="consulta">Consulta general</option>
        <option value="proyecto">Propuesta de proyecto</option>
        <option value="otro">Otro</option>
      </select>
    </div>
    <br>
    <div>
      <label for="mensaje">Mensaje</label><br>
      <textarea id="mensaje" name="mensaje" rows="4"
                placeholder="Escribe tu mensaje..."></textarea>
    </div>
    <br>
    <button type="submit">Enviar mensaje</button>
  </form>
</body>
</html>`,
    },
    {
      id: 's5',
      title: 'Tablas y accesibilidad básica',
      content: `Las **tablas** estructuran datos tabulares — información con filas y columnas. No se usan para layout (eso es trabajo de CSS).

Estructura de una tabla:
- \`<table>\` — contenedor
- \`<caption>\` — título descriptivo
- \`<thead>\` / \`<tbody>\` / \`<tfoot>\` — secciones
- \`<tr>\` — fila, \`<th>\` — celda de encabezado, \`<td>\` — celda de datos
- \`scope="col"\` o \`scope="row"\` en \`<th>\` para accesibilidad

**Accesibilidad básica:**
- \`alt\` en imágenes — esencial.
- \`<label for="id">\` en formularios — esencial.
- \`aria-label="descripción"\` — describe elementos sin texto visible.
- \`<button>\` en vez de \`<div onclick>\` — los botones son accesibles por defecto.

El principio central: si quitas el CSS, la página debe seguir teniendo sentido.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Tabla de calificaciones</title>
</head>
<body>
  <h1>Calificaciones del semestre</h1>

  <table border="1">
    <caption>Notas finales — Grupo 2025-A</caption>
    <thead>
      <tr>
        <th scope="col">Estudiante</th>
        <th scope="col">Matemáticas</th>
        <th scope="col">Ciencias</th>
        <th scope="col">Promedio</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Ana García</th>
        <td>95</td>
        <td>88</td>
        <td>91.5</td>
      </tr>
      <tr>
        <th scope="row">Luis Torres</th>
        <td>78</td>
        <td>85</td>
        <td>81.5</td>
      </tr>
      <tr>
        <th scope="row">María López</th>
        <td>92</td>
        <td>96</td>
        <td>94.0</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="row">Promedio del grupo</th>
        <td>88.3</td>
        <td>89.7</td>
        <td>89.0</td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`,
    },
    {
      id: 's6',
      title: 'Proyecto: Página de perfil personal',
      content: `Es hora de combinar todo lo aprendido en una **página de perfil personal completa**.

La página debe tener:
1. **\`<header>\`** con tu nombre y **\`<nav>\`** con enlaces internos
2. **Sección "Sobre mí"** con imagen (\`alt\` descriptivo), párrafo de presentación y lista de habilidades
3. **Sección "Proyectos"** con \`<article>\` describiendo 2 proyectos
4. **Sección "Contacto"** con formulario (nombre, email, mensaje), cada campo con su \`<label>\`
5. **\`<footer>\`** con copyright

No necesitas CSS todavía — el objetivo es que la estructura sea correcta. Un documento bien estructurado en HTML, aunque feo, es la base de una buena página web. El CSS vendrá en la siguiente lección.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perfil — Ana García</title>
</head>
<body>

  <header>
    <h1>Ana García</h1>
    <p>Desarrolladora web junior</p>
    <nav>
      <a href="#sobre-mi">Sobre mí</a> |
      <a href="#proyectos">Proyectos</a> |
      <a href="#contacto">Contacto</a>
    </nav>
  </header>

  <main>
    <section id="sobre-mi">
      <h2>Sobre mí</h2>
      <img
        src="https://via.placeholder.com/100"
        alt="Foto de perfil de Ana García"
        width="100"
      >
      <p>Estudiante de informática apasionada por la web y el código abierto.</p>
      <h3>Habilidades</h3>
      <ul>
        <li>HTML y CSS</li>
        <li>JavaScript</li>
        <li>Python</li>
        <li>Git y GitHub</li>
      </ul>
    </section>

    <section id="proyectos">
      <h2>Proyectos</h2>
      <article>
        <h3>DevNodo Learn</h3>
        <p>Plataforma de aprendizaje con editor en tiempo real y tutor AI.</p>
        <a href="https://github.com" target="_blank" rel="noopener">Ver en GitHub →</a>
      </article>
      <article>
        <h3>Lista de tareas</h3>
        <p>App web para organizar tareas con almacenamiento local.</p>
        <a href="https://github.com" target="_blank" rel="noopener">Ver en GitHub →</a>
      </article>
    </section>

    <section id="contacto">
      <h2>Contacto</h2>
      <form>
        <label for="nombre">Nombre</label><br>
        <input type="text" id="nombre" name="nombre" required><br><br>

        <label for="email">Email</label><br>
        <input type="email" id="email" name="email" required><br><br>

        <label for="mensaje">Mensaje</label><br>
        <textarea id="mensaje" name="mensaje" rows="4"></textarea><br><br>

        <button type="submit">Enviar</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2025 Ana García</p>
  </footer>

</body>
</html>`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Estructura HTML5 básica',
    description: 'Escribe el esqueleto completo de un documento HTML5: `<!DOCTYPE html>`, `<html lang="es">`, `<head>` con `<meta charset="UTF-8">` y `<title>`, y `<body>` con al menos un `<h1>` y un `<p>`.',
    hint: 'Empieza con <!DOCTYPE html>, luego <html lang="es">, dentro un <head> con <meta charset="UTF-8"> y <title>Mi página</title>, y un <body> con <h1> y <p>.',
    starterCode: `<!DOCTYPE html>
<!-- Completa la estructura HTML5 básica -->
`,
    validate(_output, code) {
      const lower = code.toLowerCase()
      if (!lower.includes('<!doctype html>')) return { ok: false, message: 'Agrega <!DOCTYPE html> al inicio del documento.' }
      if (!lower.includes('<html')) return { ok: false, message: 'Necesitas la etiqueta <html>.' }
      if (!lower.includes('<head') || !lower.includes('</head>')) return { ok: false, message: 'Agrega la sección <head>...</head>.' }
      if (!lower.includes('<body') || !lower.includes('</body>')) return { ok: false, message: 'Agrega la sección <body>...</body>.' }
      if (!lower.includes('<title>')) return { ok: false, message: 'Agrega un <title> dentro del <head>.' }
      if (!lower.includes('<meta charset')) return { ok: false, message: 'Agrega <meta charset="UTF-8"> en el <head>.' }
      if (!lower.includes('<h1')) return { ok: false, message: 'Agrega un <h1> dentro del <body>.' }
      if (!lower.includes('<p>') && !lower.includes('<p ')) return { ok: false, message: 'Agrega al menos un párrafo <p> en el <body>.' }
      return { ok: true, message: '¡Estructura HTML5 perfecta! Estos son los cimientos de toda página web.' }
    },
  },
  {
    id: 'ex2',
    title: 'Página con etiquetas semánticas',
    description: 'Crea una página con estructura semántica completa: un `<header>` con `<h1>`, un `<nav>` con al menos 2 enlaces `<a>`, un `<main>` con una `<section>`, y un `<footer>` con texto.',
    hint: 'Dentro del <nav> usa <a href="#">Texto</a>. El <main> debe tener una <section> con su propio <h2> y un párrafo.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi sitio</title>
</head>
<body>
  <!-- Agrega: header con h1, nav con 2+ enlaces,
       main con una section, y footer -->

</body>
</html>
`,
    validate(_output, code) {
      const lower = code.toLowerCase()
      if (!lower.includes('<header')) return { ok: false, message: 'Agrega un <header> con tu título principal.' }
      if (!lower.includes('<nav')) return { ok: false, message: 'Agrega un <nav> para la navegación.' }
      const linkCount = (lower.match(/<a[\s>]/g) || []).length
      if (linkCount < 2) return { ok: false, message: `El <nav> necesita al menos 2 enlaces <a>. Tienes ${linkCount}.` }
      if (!lower.includes('<main')) return { ok: false, message: 'Agrega un <main> con el contenido principal.' }
      if (!lower.includes('<section')) return { ok: false, message: 'Agrega una <section> dentro del <main>.' }
      if (!lower.includes('<footer')) return { ok: false, message: 'Agrega un <footer> al final de la página.' }
      return { ok: true, message: '¡Estructura semántica excelente! Google y los lectores de pantalla lo agradecen.' }
    },
  },
  {
    id: 'ex3',
    title: 'Lista, enlace e imagen',
    description: 'Crea una página con: una imagen `<img>` con `src` y `alt`, una lista `<ul>` o `<ol>` con al menos 3 elementos `<li>`, y un enlace `<a>` con `href` y `target="_blank"`.',
    hint: 'Para la imagen usa src="https://via.placeholder.com/200". El alt debe describir qué muestra la imagen. Para el enlace externo agrega target="_blank" rel="noopener".',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mis favoritos</title>
</head>
<body>
  <h1>Mis cosas favoritas</h1>

  <!-- Agrega una imagen con src y alt -->

  <!-- Agrega una lista con al menos 3 elementos -->

  <!-- Agrega un enlace que abra en nueva pestaña -->

</body>
</html>
`,
    validate(_output, code) {
      const lower = code.toLowerCase()
      if (!lower.includes('<img')) return { ok: false, message: 'Agrega una imagen con <img>.' }
      if (!/src\s*=\s*["'][^"']+["']/.test(lower)) return { ok: false, message: 'La imagen necesita el atributo src con una URL.' }
      if (!/alt\s*=\s*["'][^"']*["']/.test(lower)) return { ok: false, message: 'La imagen necesita el atributo alt con una descripción.' }
      if (!lower.includes('<ul') && !lower.includes('<ol')) return { ok: false, message: 'Agrega una lista <ul> o <ol>.' }
      const itemCount = (lower.match(/<li/g) || []).length
      if (itemCount < 3) return { ok: false, message: `La lista necesita al menos 3 elementos <li>. Tienes ${itemCount}.` }
      if (!/<a[\s>]/.test(lower)) return { ok: false, message: 'Agrega un enlace <a href="...">.' }
      if (!lower.includes('target="_blank"') && !lower.includes("target='_blank'")) return { ok: false, message: 'El enlace debe abrir en nueva pestaña: target="_blank".' }
      return { ok: true, message: '¡Excelente! Imágenes accesibles, listas y enlaces — los bloques de contenido más usados en la web.' }
    },
  },
  {
    id: 'ex4',
    title: 'Formulario de contacto',
    description: 'Crea un formulario con `<form>`, al menos 2 campos `<input>` (tipo texto y email), cada uno con su `<label>` conectado por `for`/`id`, un `<textarea>` para el mensaje, y un `<button type="submit">`.',
    hint: 'Conecta label e input con for="miId" en el label e id="miId" en el input. Los valores deben coincidir exactamente.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Contacto</title>
</head>
<body>
  <h1>Formulario de contacto</h1>
  <!-- Crea el formulario con:
    - input de texto para nombre (con label)
    - input de email (con label)
    - textarea para mensaje (con label)
    - botón de enviar -->
</body>
</html>
`,
    validate(_output, code) {
      const lower = code.toLowerCase()
      if (!lower.includes('<form')) return { ok: false, message: 'Agrega una etiqueta <form>.' }
      const inputs = (lower.match(/<input/g) || []).length
      if (inputs < 2) return { ok: false, message: `Necesitas al menos 2 campos <input> (texto y email). Tienes ${inputs}.` }
      if (!lower.includes('type="email"') && !lower.includes("type='email'")) return { ok: false, message: 'Uno de los inputs debe ser type="email".' }
      if (!lower.includes('<label')) return { ok: false, message: 'Agrega etiquetas <label> para cada campo.' }
      const forCount = (lower.match(/\bfor\s*=\s*["'][^"']+["']/g) || []).length
      if (forCount < 2) return { ok: false, message: 'Conecta los labels con sus inputs usando el atributo for="id-del-input".' }
      if (!lower.includes('<textarea')) return { ok: false, message: 'Agrega un <textarea> para el mensaje.' }
      if (!lower.includes('<button') && !lower.includes('type="submit"')) return { ok: false, message: 'Agrega un botón de enviar: <button type="submit">.' }
      return { ok: true, message: '¡Formulario accesible! Los labels conectados son esenciales para usuarios de teclado.' }
    },
  },
  {
    id: 'ex5',
    title: 'Proyecto: página personal',
    description: 'Crea tu página personal completa con: `<header>` + `<nav>`, sección "sobre mí" (imagen con alt + lista de habilidades), sección "proyectos" (al menos 1 `<article>`), formulario de contacto con `<label>` en cada campo, y `<footer>`.',
    hint: 'Revisa el ejemplo de la sección 6 como guía. La página no necesita verse bonita todavía — lo importante es la estructura HTML correcta con semántica.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Perfil</title>
</head>
<body>
  <!-- Construye tu página de perfil con:
    header + nav
    main con secciones: sobre mí, proyectos, contacto
    footer
    Incluye: imagen con alt, lista, formulario con labels -->

</body>
</html>
`,
    validate(_output, code) {
      const lower = code.toLowerCase()
      if (!lower.includes('<header')) return { ok: false, message: 'Agrega un <header> con tu nombre.' }
      if (!lower.includes('<nav')) return { ok: false, message: 'Agrega un <nav> en el header.' }
      if (!lower.includes('<main')) return { ok: false, message: 'Agrega un <main> con el contenido principal.' }
      if ((lower.match(/<section/g) || []).length < 2) return { ok: false, message: 'Necesitas al menos 2 secciones (sobre mí y proyectos).' }
      if (!lower.includes('<article')) return { ok: false, message: 'Agrega al menos un <article> en la sección de proyectos.' }
      if (!lower.includes('<img') || !/alt\s*=\s*["'][^"']+["']/.test(lower)) return { ok: false, message: 'Agrega una imagen <img> con atributo alt descriptivo (no vacío).' }
      if (!lower.includes('<ul') && !lower.includes('<ol')) return { ok: false, message: 'Agrega una lista de habilidades (<ul> o <ol>).' }
      if (!lower.includes('<form')) return { ok: false, message: 'Agrega un formulario de contacto.' }
      if (!lower.includes('<label')) return { ok: false, message: 'Los inputs del formulario necesitan <label>.' }
      if (!lower.includes('<footer')) return { ok: false, message: 'Agrega un <footer> al final.' }
      return { ok: true, message: '¡Página personal completa! Base sólida en HTML semántico. Siguiente: CSS para darle estilo.' }
    },
  },
]
