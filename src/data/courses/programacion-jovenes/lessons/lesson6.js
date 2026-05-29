export const lesson = {
  id: 'lesson-6',
  title: 'JavaScript Esencial',
  subtitle: 'Lección 6 — Fase 2: JavaScript',
  language: 'html',
  sections: [
    {
      id: 's1',
      title: 'Variables, tipos de datos y funciones',
      content: `**JavaScript** es el único lenguaje que los navegadores ejecutan de forma nativa. Controla el comportamiento de la página.

**Variables: \`let\` y \`const\`**
- \`const\` — valor que no se reasigna. Úsalo por defecto.
- \`let\` — valor que puede cambiar. Úsalo cuando necesites reasignar.
- Nunca uses \`var\` — tiene scoping confuso y está deprecado en código moderno.

**Tipos de datos primitivos:**
| Tipo | Ejemplo | \`typeof\` |
|------|---------|----------|
| String | \`"hola"\`, \`'mundo'\` | \`"string"\` |
| Number | \`42\`, \`3.14\`, \`-7\` | \`"number"\` |
| Boolean | \`true\`, \`false\` | \`"boolean"\` |
| Null | \`null\` | \`"object"\` ⚠️ quirk histórico |
| Undefined | variable sin valor | \`"undefined"\` |

**Template literals** — strings con interpolación:
\`\`\`js
const nombre = "Ana";
const saludo = \`Hola, \${nombre}! Tienes \${30 + 2} años.\`;
\`\`\`

**Funciones** — tres formas equivalentes:
\`\`\`js
// Declaración (hoisting: disponible antes de definirse)
function sumar(a, b) { return a + b; }

// Expresión (sin hoisting)
const restar = function(a, b) { return a - b; };

// Arrow function (forma moderna y compacta)
const multiplicar = (a, b) => a * b;

// Con parámetro por defecto
const saludar = (nombre = "mundo") => \`Hola, \${nombre}!\`;
\`\`\``,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Variables y Funciones</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    .card { background: #1a1a2e; border-radius: 10px; padding: 1.5rem; margin: 1rem 0; border-left: 3px solid #6c63ff; }
    .card h3 { color: #6c63ff; margin: 0 0 0.75rem; }
    .res { background: #0f3460; padding: 0.5rem 1rem; border-radius: 6px; margin: 0.25rem 0; font-family: monospace; }
    .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 4px; }
    .tag-string  { background: #1b5e20; color: #a5d6a7; }
    .tag-number  { background: #e65100; color: #ffcc80; }
    .tag-boolean { background: #880e4f; color: #f48fb1; }
    .tag-object  { background: #333; color: #aaa; }
    .tag-undefined { background: #333; color: #aaa; }
  </style>
</head>
<body>
<div id="app"></div>
<script>
  // ─── const vs let ───
  const PI = 3.14159;
  let contador = 0;
  contador += 1;

  // ─── Tipos de datos ───
  const nombre    = "DevNodo";
  const version   = 2.5;
  const activo    = true;
  const vacio     = null;
  let indefinido;

  // ─── Template literal ───
  const mensaje = \`Plataforma: \${nombre} v\${version} — activo: \${activo}\`;

  // ─── Arrow functions ───
  const sumar   = (a, b) => a + b;
  const saludar = (quien = "mundo") => \`¡Hola, \${quien}!\`;

  // ─── Función con lógica ───
  function clasificar(nota) {
    if (nota >= 90) return "Sobresaliente";
    if (nota >= 60) return "Aprobado";
    return "Reprobado";
  }

  const tipos = [
    { label: nombre,      valor: typeof nombre,     tipo: "string"    },
    { label: version,     valor: typeof version,    tipo: "number"    },
    { label: activo,      valor: typeof activo,     tipo: "boolean"   },
    { label: "null",      valor: typeof vacio,      tipo: "object"    },
    { label: indefinido,  valor: typeof indefinido, tipo: "undefined" },
  ];

  document.getElementById("app").innerHTML = \`
    <div class="card">
      <h3>typeof — tipos primitivos</h3>
      \${tipos.map(d => \`
        <div class="res">
          typeof <strong>\${d.label}</strong> →
          <span class="tag tag-\${d.tipo}">\${d.valor}</span>
        </div>
      \`).join("")}
    </div>
    <div class="card">
      <h3>Template literal</h3>
      <div class="res">\${mensaje}</div>
    </div>
    <div class="card">
      <h3>Arrow functions</h3>
      <div class="res">sumar(8, 7) → \${sumar(8, 7)}</div>
      <div class="res">saludar() → \${saludar()}</div>
      <div class="res">saludar("Ana") → \${saludar("Ana")}</div>
    </div>
    <div class="card">
      <h3>Función clasificar(nota)</h3>
      <div class="res">clasificar(95) → \${clasificar(95)}</div>
      <div class="res">clasificar(75) → \${clasificar(75)}</div>
      <div class="res">clasificar(50) → \${clasificar(50)}</div>
    </div>
  \`;
</script>
</body>
</html>`,
    },
    {
      id: 's2',
      title: 'Arrays, objetos y métodos funcionales',
      content: `**Arrays** son listas ordenadas. **Objetos** son colecciones de pares clave-valor.

\`\`\`js
const frutas  = ["manzana", "banana", "cereza"];
const usuario = { nombre: "Ana", edad: 28, activo: true };
\`\`\`

**Destructuring** — extraer valores limpiamente:
\`\`\`js
const [primera, segunda] = frutas;          // Array
const { nombre, edad }   = usuario;         // Objeto
const { nombre: alias }  = usuario;         // Renombrar al extraer
\`\`\`

**Spread operator** (\`...\`) — copiar y unir sin mutar:
\`\`\`js
const copia = [...frutas, "mango"];          // Array nuevo
const nuevo = { ...usuario, rol: "admin" }; // Objeto nuevo
\`\`\`

**Métodos funcionales** — no mutan el array original:

| Método | Retorna | Uso |
|--------|---------|-----|
| \`map(fn)\` | nuevo array (mismo tamaño) | transformar cada elemento |
| \`filter(fn)\` | nuevo array (tamaño ≤) | quedarse con los que cumplen |
| \`reduce(fn, inicio)\` | un valor acumulado | sumar, agrupar, contar |
| \`find(fn)\` | el primer elemento que cumple | buscar uno |
| \`some(fn)\` | boolean | ¿alguno cumple? |
| \`every(fn)\` | boolean | ¿todos cumplen? |

\`\`\`js
const precios = [100, 250, 80, 320, 150];

const dobles  = precios.map(p => p * 2);
const caros   = precios.filter(p => p > 100);
const total   = precios.reduce((acc, p) => acc + p, 0);
const primero = precios.find(p => p > 200);
\`\`\``,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Arrays y Métodos</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    .card { background: #1a1a2e; border-radius: 10px; padding: 1.5rem; margin: 1rem 0; border-left: 3px solid #ff6584; }
    .card h3 { color: #ff6584; margin: 0 0 0.75rem; }
    .res { background: #0f0f20; padding: 0.5rem 1rem; border-radius: 6px; margin: 0.25rem 0; font-family: monospace; font-size: 0.9rem; }
    .producto { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 1rem; background: #16213e; border-radius: 6px; margin: 0.3rem 0; }
    .badge { padding: 2px 10px; border-radius: 20px; font-size: 0.8rem; }
    .disponible { background: #1b5e20; color: #a5d6a7; }
    .agotado    { background: #7f0000; color: #ef9a9a; }
  </style>
</head>
<body>
<div id="app"></div>
<script>
  const productos = [
    { nombre: "Laptop Pro",  precio: 1200, stock: 5,  categoria: "tech"   },
    { nombre: "Teclado RGB", precio: 85,   stock: 0,  categoria: "tech"   },
    { nombre: "Silla Gamer", precio: 350,  stock: 12, categoria: "mueble" },
    { nombre: "Monitor 4K",  precio: 600,  stock: 3,  categoria: "tech"   },
    { nombre: "Escritorio",  precio: 280,  stock: 7,  categoria: "mueble" },
    { nombre: "Auriculares", precio: 120,  stock: 0,  categoria: "tech"   },
  ];

  // map — añadir precio con IVA sin mutar el original
  const conIVA = productos.map(p => ({ ...p, precioFinal: (p.precio * 1.21).toFixed(2) }));

  // filter
  const disponibles  = productos.filter(p => p.stock > 0);
  const soloTech     = productos.filter(p => p.categoria === "tech");

  // reduce
  const totalInventario = productos.reduce((acc, p) => acc + p.precio * p.stock, 0);
  const porCategoria    = productos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1;
    return acc;
  }, {});

  // find / some / every
  const primeroAgotado = productos.find(p => p.stock === 0);
  const hayAgotados    = productos.some(p => p.stock === 0);
  const todosDispo     = productos.every(p => p.stock > 0);

  document.getElementById("app").innerHTML = \`
    <div class="card">
      <h3>Catálogo — map() + spread</h3>
      \${conIVA.map(p => \`
        <div class="producto">
          <span>\${p.nombre}</span>
          <span>€\${p.precioFinal} (IVA incl.)</span>
          <span class="badge \${p.stock > 0 ? 'disponible' : 'agotado'}">
            \${p.stock > 0 ? \`Stock: \${p.stock}\` : "Agotado"}
          </span>
        </div>
      \`).join("")}
    </div>
    <div class="card">
      <h3>filter() y reduce()</h3>
      <div class="res">Disponibles: \${disponibles.length} de \${productos.length}</div>
      <div class="res">Solo tech: \${soloTech.map(p => p.nombre).join(", ")}</div>
      <div class="res">Total inventario: €\${totalInventario.toLocaleString()}</div>
      <div class="res">Por categoría: \${JSON.stringify(porCategoria)}</div>
    </div>
    <div class="card">
      <h3>find() / some() / every()</h3>
      <div class="res">Primer agotado: \${primeroAgotado?.nombre}</div>
      <div class="res">¿Hay agotados? \${hayAgotados}</div>
      <div class="res">¿Todos disponibles? \${todosDispo}</div>
    </div>
  \`;
</script>
</body>
</html>`,
    },
    {
      id: 's3',
      title: 'Manipulación del DOM',
      content: `El **DOM** (Document Object Model) es la representación del HTML como árbol de objetos JavaScript. Puedes leerlo y modificarlo en tiempo real.

**Seleccionar elementos:**
\`\`\`js
const titulo  = document.querySelector("h1");        // primero que coincida
const botones = document.querySelectorAll(".btn");   // NodeList con todos
const porId   = document.getElementById("mi-id");   // por ID (más rápido)
\`\`\`

**Leer y modificar contenido:**
\`\`\`js
elemento.textContent = "Nuevo texto";    // solo texto, seguro
elemento.innerHTML   = "<b>Bold</b>";   // HTML — solo con datos confiables
elemento.getAttribute("href");
elemento.setAttribute("data-id", "42");
\`\`\`

**Crear y añadir elementos:**
\`\`\`js
const div = document.createElement("div");
div.textContent = "Hola";
div.classList.add("tarjeta");

padre.append(div);    // añade al final
padre.prepend(div);   // añade al inicio
div.remove();         // elimina del DOM
\`\`\`

**Clases** — la forma más limpia de cambiar estilos dinámicamente:
\`\`\`js
el.classList.add("activo");
el.classList.remove("activo");
el.classList.toggle("activo");       // añade si no está, quita si está
el.classList.contains("activo");     // → true/false
\`\`\`

**Dataset** — leer atributos \`data-*\` definidos en el HTML:
\`\`\`html
<button data-id="5" data-accion="borrar">Borrar</button>
\`\`\`
\`\`\`js
btn.dataset.id;      // "5"
btn.dataset.accion;  // "borrar"
\`\`\``,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>DOM</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    h2 { color: #6c63ff; margin-bottom: 1rem; }
    .formulario { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    input {
      flex: 1; padding: 0.7rem 1rem; border: 2px solid #333; border-radius: 8px;
      background: #1a1a2e; color: white; font-size: 1rem; outline: none;
    }
    input:focus { border-color: #6c63ff; }
    button {
      padding: 0.7rem 1.2rem; border: none; border-radius: 8px;
      background: #6c63ff; color: white; cursor: pointer; font-size: 1rem;
    }
    button:hover { background: #5a52d5; }
    .lista { list-style: none; }
    .item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.75rem 1rem; background: #1a1a2e; border-radius: 8px;
      margin-bottom: 0.5rem; transition: opacity 0.3s;
    }
    .item.hecho { opacity: 0.4; text-decoration: line-through; }
    .item .acciones { display: flex; gap: 0.5rem; }
    .btn-small { padding: 0.3rem 0.7rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
    .btn-check  { background: #1b5e20; color: #a5d6a7; }
    .btn-borrar { background: #7f0000; color: #ef9a9a; }
    .contador { color: #888; font-size: 0.9rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <h2>Lista de tareas — DOM puro</h2>
  <div class="formulario">
    <input id="input-tarea" type="text" placeholder="Nueva tarea..." />
    <button id="btn-agregar">Agregar</button>
  </div>
  <p class="contador" id="contador">0 tareas</p>
  <ul class="lista" id="lista"></ul>

  <script>
    const inputTarea = document.querySelector("#input-tarea");
    const btnAgregar = document.querySelector("#btn-agregar");
    const lista      = document.querySelector("#lista");
    const contadorEl = document.querySelector("#contador");
    let tareas = [];

    function renderizar() {
      lista.innerHTML = "";
      tareas.forEach((tarea, index) => {
        const li = document.createElement("li");
        li.classList.add("item");
        if (tarea.hecha) li.classList.add("hecho");

        li.innerHTML = \`
          <span>\${tarea.texto}</span>
          <div class="acciones">
            <button class="btn-small btn-check"  data-accion="toggle" data-index="\${index}">\${tarea.hecha ? "↺" : "✓"}</button>
            <button class="btn-small btn-borrar" data-accion="borrar" data-index="\${index}">✕</button>
          </div>
        \`;
        lista.append(li);
      });

      const pendientes = tareas.filter(t => !t.hecha).length;
      contadorEl.textContent = \`\${tareas.length} tareas · \${pendientes} pendientes\`;
    }

    function agregarTarea() {
      const texto = inputTarea.value.trim();
      if (!texto) return;
      tareas.push({ texto, hecha: false });
      inputTarea.value = "";
      renderizar();
    }

    // Event delegation: un solo listener maneja todos los botones
    lista.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-accion]");
      if (!btn) return;
      const index = Number(btn.dataset.index);
      if (btn.dataset.accion === "toggle") {
        tareas[index].hecha = !tareas[index].hecha;
      } else if (btn.dataset.accion === "borrar") {
        tareas.splice(index, 1);
      }
      renderizar();
    });

    btnAgregar.addEventListener("click", agregarTarea);
    inputTarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter") agregarTarea();
    });

    tareas = [
      { texto: "Aprender querySelector", hecha: true },
      { texto: "Practicar classList.toggle", hecha: false },
      { texto: "Dominar el DOM", hecha: false },
    ];
    renderizar();
  </script>
</body>
</html>`,
    },
    {
      id: 's4',
      title: 'Eventos del navegador',
      content: `**Los eventos** son acciones del usuario (o del navegador) a las que puedes reaccionar con \`addEventListener\`.

**Registrar un listener:**
\`\`\`js
elemento.addEventListener("click", (evento) => {
  console.log(evento.target); // el elemento que recibió el clic
});
\`\`\`

**El objeto \`Event\`** contiene información crucial:
- \`e.target\` — el elemento exacto que desencadenó el evento.
- \`e.currentTarget\` — el elemento al que añadiste el listener.
- \`e.preventDefault()\` — cancela el comportamiento por defecto (submit, link).
- \`e.stopPropagation()\` — evita que el evento suba al elemento padre.
- \`e.key\` / \`e.code\` — para eventos de teclado.

**Eventos más comunes:**
| Evento | Cuándo se dispara |
|--------|------------------|
| \`click\` | clic con el ratón |
| \`input\` | cada vez que el valor cambia |
| \`change\` | al perder el foco con valor distinto |
| \`submit\` | al enviar un formulario |
| \`keydown\` / \`keyup\` | al presionar / soltar tecla |
| \`focus\` / \`blur\` | al ganar / perder foco |
| \`DOMContentLoaded\` | cuando el HTML está listo |

**Event delegation** — un solo listener en el padre para hijos dinámicos:
\`\`\`js
lista.addEventListener("click", (e) => {
  if (e.target.matches(".btn-borrar")) {
    e.target.closest("li").remove();
  }
});
\`\`\``,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Eventos</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    h2 { color: #6c63ff; margin: 1.5rem 0 0.75rem; font-size: 1.1rem; }
    .seccion { background: #1a1a2e; border-radius: 10px; padding: 1.5rem; margin-bottom: 1.5rem; }
    input {
      width: 100%; padding: 0.7rem 1rem; border: 2px solid #333; border-radius: 8px;
      background: #0d0d1a; color: white; font-size: 1rem; outline: none;
    }
    input:focus { border-color: #6c63ff; }
    .estado { margin-top: 0.5rem; font-size: 0.9rem; color: #888; font-family: monospace; }
    .teclado { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem; }
    .tecla {
      padding: 0.5rem 1rem; background: #16213e; border-radius: 6px;
      border: 1px solid #333; font-family: monospace; transition: transform 0.1s, background 0.1s;
    }
    .tecla.activa { background: #6c63ff; transform: scale(0.9); }
    .contador-clicks { font-size: 3rem; font-weight: bold; color: #6c63ff; text-align: center; padding: 1rem; }
    .botones { display: flex; gap: 1rem; }
    button { padding: 0.7rem 1.4rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; }
    .btn-primario { background: #6c63ff; color: white; }
    .btn-peligro  { background: #e53935; color: white; }
    .log { background: #0f0f20; border-radius: 6px; padding: 1rem; margin-top: 1rem; font-family: monospace; font-size: 0.85rem; max-height: 110px; overflow-y: auto; }
    .log p { margin: 0.2rem 0; color: #aaa; }
    .log p.nuevo { color: #6c63ff; }
  </style>
</head>
<body>
  <div class="seccion">
    <h2>evento: input — en tiempo real</h2>
    <input id="campo" type="text" placeholder="Escribe algo...">
    <p class="estado" id="estado-input">Esperando...</p>
  </div>

  <div class="seccion">
    <h2>eventos: keydown / keyup (presiona A, S, D, F)</h2>
    <div class="teclado">
      <div class="tecla" id="tecla-a">A</div>
      <div class="tecla" id="tecla-s">S</div>
      <div class="tecla" id="tecla-d">D</div>
      <div class="tecla" id="tecla-f">F</div>
    </div>
    <p class="estado" id="estado-tecla">Presiona A, S, D o F</p>
  </div>

  <div class="seccion">
    <h2>evento: click + submit con preventDefault</h2>
    <div class="contador-clicks" id="contador">0</div>
    <div class="botones">
      <button class="btn-primario" id="btn-sumar">+ Sumar</button>
      <button class="btn-peligro"  id="btn-reset">Reset</button>
    </div>
    <form id="mi-form" style="margin-top:1rem;display:flex;gap:0.5rem">
      <input type="text" placeholder="Simula un submit...">
      <button type="submit" class="btn-primario">Enviar</button>
    </form>
    <div class="log" id="log"></div>
  </div>

  <script>
    // ── 1. Input en tiempo real ──
    const campo      = document.querySelector("#campo");
    const estadoInput = document.querySelector("#estado-input");
    campo.addEventListener("input", (e) => {
      const val = e.target.value;
      estadoInput.textContent = val ? \`\${val.length} caracteres: "\${val}"\` : "Campo vacío";
    });

    // ── 2. Teclado ──
    const estadoTecla = document.querySelector("#estado-tecla");
    const mapa = { a: "tecla-a", s: "tecla-s", d: "tecla-d", f: "tecla-f" };

    document.addEventListener("keydown", (e) => {
      const id = mapa[e.key.toLowerCase()];
      if (id) {
        document.getElementById(id).classList.add("activa");
        estadoTecla.textContent = \`keydown: "\${e.key}" | código: \${e.code}\`;
      }
    });
    document.addEventListener("keyup", (e) => {
      const id = mapa[e.key.toLowerCase()];
      if (id) document.getElementById(id).classList.remove("activa");
    });

    // ── 3. Clicks y submit ──
    let clicks = 0;
    const contadorEl = document.querySelector("#contador");
    const log        = document.querySelector("#log");

    function addLog(msg, nuevo = true) {
      const p = document.createElement("p");
      p.className = nuevo ? "nuevo" : "";
      p.textContent = \`[\${new Date().toLocaleTimeString()}] \${msg}\`;
      log.prepend(p);
    }

    document.querySelector("#btn-sumar").addEventListener("click", () => {
      clicks++;
      contadorEl.textContent = clicks;
      addLog(\`Click #\${clicks}\`);
    });

    document.querySelector("#btn-reset").addEventListener("click", () => {
      clicks = 0;
      contadorEl.textContent = 0;
      addLog("Reset — contador a 0", false);
    });

    document.querySelector("#mi-form").addEventListener("submit", (e) => {
      e.preventDefault();
      addLog("submit interceptado con preventDefault() ✓");
    });
  </script>
</body>
</html>`,
    },
    {
      id: 's5',
      title: 'Introducción a fetch() y APIs (JSON)',
      content: `**\`fetch()\`** es la API nativa para hacer peticiones HTTP desde el navegador. Retorna una **Promise** que se resuelve con la respuesta.

**Flujo básico con \`.then()\`:**
\`\`\`js
fetch("https://api.ejemplo.com/datos")
  .then(response => {
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return response.json();    // también: .text(), .blob()
  })
  .then(datos => {
    console.log(datos);
  })
  .catch(error => {
    console.error("Error:", error.message);
  });
\`\`\`

**El objeto \`Response\`:**
- \`response.ok\` — \`true\` si el status es 200–299.
- \`response.status\` — código HTTP (200, 404, 500…).
- \`response.json()\` — parsea el body como JSON (retorna otra Promise).
- \`response.text()\` — body como string plano.

**JSON** (JavaScript Object Notation):
\`\`\`js
// JS → string (para enviar)
const texto  = JSON.stringify({ nombre: "Ana", edad: 28 });

// string → JS (al recibir)
const objeto = JSON.parse('{"nombre":"Ana","edad":28}');
\`\`\`

**Opciones de \`fetch\`** — para POST/PUT/DELETE:
\`\`\`js
fetch("/api/usuarios", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre: "Ana" }),
})
\`\`\`

**CORS**: el servidor debe permitir peticiones desde tu origen. APIs públicas como JSONPlaceholder y Open Meteo ya lo hacen.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Fetch y APIs</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    h2 { color: #6c63ff; margin-bottom: 1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
    .post-card { background: #1a1a2e; border-radius: 10px; padding: 1.25rem; border-left: 3px solid #6c63ff; }
    .post-card h3 { font-size: 0.95rem; color: #ddd; margin-bottom: 0.5rem; text-transform: capitalize; }
    .post-card p  { font-size: 0.85rem; color: #888; line-height: 1.5; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; background: #16213e; color: #6c63ff; margin-bottom: 0.5rem; }
    .loading { color: #888; font-style: italic; }
    .error   { color: #e53935; }
    .status-bar { display: flex; gap: 1rem; align-items: center; padding: 0.75rem 1rem; background: #1a1a2e; border-radius: 8px; margin-bottom: 1.5rem; font-family: monospace; font-size: 0.9rem; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: #888; }
    .dot.ok { background: #4caf50; animation: pulso 1.5s ease-in-out infinite; }
    @keyframes pulso { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  </style>
</head>
<body>
  <div class="status-bar">
    <div class="dot" id="dot"></div>
    <span id="status-text">Conectando a JSONPlaceholder...</span>
  </div>
  <h2>Posts desde <code>jsonplaceholder.typicode.com</code></h2>
  <div class="grid" id="grid">
    <p class="loading">Cargando posts...</p>
  </div>

  <script>
    const grid   = document.getElementById("grid");
    const dot    = document.getElementById("dot");
    const status = document.getElementById("status-text");

    fetch("https://jsonplaceholder.typicode.com/posts?_limit=6")
      .then(response => {
        // 1) Verificar que la respuesta sea exitosa
        if (!response.ok) throw new Error(\`Error HTTP: \${response.status}\`);
        status.textContent = \`HTTP \${response.status} OK — parseando JSON...\`;
        // 2) .json() también retorna una Promise
        return response.json();
      })
      .then(posts => {
        // 3) Ya tenemos el array de posts
        dot.classList.add("ok");
        status.textContent = \`\${posts.length} posts recibidos ✓\`;

        grid.innerHTML = posts.map(post => \`
          <div class="post-card">
            <span class="badge">user #\${post.userId} · post #\${post.id}</span>
            <h3>\${post.title}</h3>
            <p>\${post.body}</p>
          </div>
        \`).join("");
      })
      .catch(error => {
        // 4) Manejo de errores de red o lógica
        status.textContent = error.message;
        grid.innerHTML = \`<p class="error">⚠️ \${error.message}</p>\`;
      });
  </script>
</body>
</html>`,
    },
    {
      id: 's6',
      title: 'Async / await básico',
      content: `**\`async/await\`** es azúcar sintáctica sobre Promises. Hace que el código asíncrono se lea como si fuera síncrono.

\`\`\`js
// Con .then() encadenado
fetch(url).then(r => r.json()).then(datos => console.log(datos));

// Con async/await — más legible
async function obtenerDatos() {
  const respuesta = await fetch(url);
  const datos     = await respuesta.json();
  console.log(datos);
}
\`\`\`

**Reglas clave:**
- Solo puedes usar \`await\` dentro de una función marcada como \`async\`.
- \`await\` pausa la función hasta que la Promise se resuelve — sin bloquear el hilo principal.
- Una función \`async\` siempre retorna una Promise.

**Manejo de errores con \`try/catch\`:**
\`\`\`js
async function obtenerClima(ciudad) {
  try {
    const res  = await fetch(\`/api/clima?ciudad=\${ciudad}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  } finally {
    console.log("Petición terminada"); // siempre se ejecuta
  }
}
\`\`\`

**Peticiones en paralelo con \`Promise.all()\`:**
\`\`\`js
async function cargarTodo() {
  // Ambas peticiones se lanzan AL MISMO TIEMPO
  const [usuarios, posts] = await Promise.all([
    fetch("/api/usuarios").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
  ]);
}
\`\`\`

**IIFE async** — patrón para usar \`await\` al nivel de un script:
\`\`\`js
(async () => {
  const datos = await obtenerDatos();
  renderizar(datos);
})();
\`\`\``,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Async/Await + Open Meteo</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    h1 { color: #6c63ff; margin-bottom: 1.5rem; font-size: 1.5rem; }
    .tarjetas { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .tarjeta { background: #1a1a2e; border-radius: 12px; padding: 1.5rem; text-align: center; border: 1px solid rgba(108,99,255,0.2); }
    .tarjeta .valor { font-size: 2.5rem; font-weight: bold; color: #6c63ff; }
    .tarjeta .unidad { font-size: 0.85rem; color: #888; margin-top: 0.25rem; }
    .tarjeta .etiqueta { font-size: 0.9rem; color: #aaa; margin-top: 0.5rem; }
    .log { background: #1a1a2e; border-radius: 10px; padding: 1rem; font-family: monospace; font-size: 0.85rem; }
    .log p { margin: 0.3rem 0; }
    .log .ok  { color: #4caf50; }
    .log .err { color: #e53935; }
    .log .inf { color: #6c63ff; }
    .ciudades { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .ciudad-btn {
      padding: 0.5rem 1.2rem; border: 2px solid #333; border-radius: 20px;
      background: transparent; color: #e0e0e0; cursor: pointer; transition: all 0.2s;
    }
    .ciudad-btn:hover, .ciudad-btn.activo { background: #6c63ff; border-color: #6c63ff; }
  </style>
</head>
<body>
  <h1>Clima en tiempo real — Open Meteo (sin API key)</h1>
  <div class="ciudades" id="ciudades"></div>
  <div class="tarjetas" id="tarjetas"><p style="color:#888">Selecciona una ciudad...</p></div>
  <div class="log" id="log"></div>

  <script>
    const ciudades = [
      { nombre: "Madrid",        lat: 40.4168,  lon: -3.7038  },
      { nombre: "Ciudad de México", lat: 19.4326, lon: -99.1332 },
      { nombre: "Buenos Aires",  lat: -34.6037, lon: -58.3816 },
      { nombre: "Bogotá",        lat: 4.6097,   lon: -74.0817 },
    ];

    const tarjetasEl = document.getElementById("tarjetas");
    const logEl      = document.getElementById("log");
    let activoBtn    = null;

    function addLog(msg, tipo = "inf") {
      const p = document.createElement("p");
      p.className = tipo;
      p.textContent = \`[\${new Date().toLocaleTimeString()}] \${msg}\`;
      logEl.prepend(p);
    }

    // ─── async/await con try/catch ───
    async function obtenerClima(ciudad) {
      addLog(\`Iniciando fetch para \${ciudad.nombre}...\`);
      const URL = \`https://api.open-meteo.com/v1/forecast?latitude=\${ciudad.lat}&longitude=\${ciudad.lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&timezone=auto\`;

      try {
        tarjetasEl.innerHTML = \`<p style="color:#888;font-style:italic">Cargando \${ciudad.nombre}...</p>\`;

        const res  = await fetch(URL);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        addLog(\`Respuesta recibida: HTTP \${res.status}\`, "ok");

        const data = await res.json();
        addLog(\`JSON parseado ✓ — \${Object.keys(data.current).length} campos\`, "ok");

        renderClima(ciudad.nombre, data.current);
      } catch (error) {
        addLog(\`Error: \${error.message}\`, "err");
        tarjetasEl.innerHTML = \`<p style="color:#e53935">⚠️ \${error.message}</p>\`;
      }
    }

    const wmo = {
      0:"Despejado", 1:"Casi despejado", 2:"Parcialmente nublado", 3:"Cubierto",
      45:"Niebla", 61:"Lluvia leve", 63:"Lluvia", 80:"Chubascos", 95:"Tormenta"
    };

    function renderClima(nombre, c) {
      const cond = wmo[c.weather_code] ?? \`código \${c.weather_code}\`;
      tarjetasEl.innerHTML = \`
        <div class="tarjeta">
          <div class="valor">\${c.temperature_2m}°</div>
          <div class="unidad">Celsius</div>
          <div class="etiqueta">Temperatura</div>
        </div>
        <div class="tarjeta">
          <div class="valor">\${c.wind_speed_10m}</div>
          <div class="unidad">km/h</div>
          <div class="etiqueta">Viento</div>
        </div>
        <div class="tarjeta">
          <div class="valor">\${c.relative_humidity_2m}%</div>
          <div class="unidad"> </div>
          <div class="etiqueta">Humedad</div>
        </div>
        <div class="tarjeta">
          <div class="valor" style="font-size:1.2rem;line-height:1.3">\${cond}</div>
          <div class="unidad">código \${c.weather_code}</div>
          <div class="etiqueta">Condición</div>
        </div>
      \`;
      addLog(\`Renderizadas tarjetas para \${nombre}\`, "ok");
    }

    // ─── Botones de ciudades ───
    const contenedor = document.getElementById("ciudades");
    ciudades.forEach(ciudad => {
      const btn = document.createElement("button");
      btn.className = "ciudad-btn";
      btn.textContent = ciudad.nombre;
      btn.addEventListener("click", () => {
        if (activoBtn) activoBtn.classList.remove("activo");
        btn.classList.add("activo");
        activoBtn = btn;
        obtenerClima(ciudad);
      });
      contenedor.append(btn);
    });
  </script>
</body>
</html>`,
    },
    {
      id: 's7',
      title: 'Proyecto: App de clima con API pública',
      content: `Es hora de construir tu **primera app real** que consume una API pública. Integra todo lo aprendido en esta lección.

La app debe:

1. **Input + botón de búsqueda** — el usuario escribe una ciudad y presiona Buscar (o Enter).
2. **Fetch con async/await** — primero llama a la **Geocoding API** para obtener lat/lon, luego a la **Forecast API** para el clima actual. Ambas son gratuitas, sin API key.
3. **Tarjetas dinámicas** — muestra temperatura, viento, humedad y condición creadas con DOM.
4. **Estado de carga** — muestra "Buscando..." mientras espera la respuesta.
5. **Manejo de errores** — si la ciudad no existe o hay error de red, muestra un mensaje claro.
6. **Historial** — guarda las últimas 5 búsquedas en un array y muéstralas como chips clicables.

**APIs a usar (sin key, CORS abierto):**
- Geocoding: \`https://geocoding-api.open-meteo.com/v1/search?name=Madrid&count=1&language=es\`
- Forecast: \`https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code\`

**Criterios de evaluación:**
- Usa \`async/await\` con \`try/catch\`.
- Hace al menos 2 llamadas a \`fetch()\`.
- Renderiza tarjetas dinámicamente con DOM.
- Maneja el estado de carga.
- Maneja errores (ciudad no encontrada, red caída).
- Tiene historial de búsquedas.`,
      example: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App de Clima</title>
  <style>
    :root {
      --bg: #0d0d1a; --superficie: #1a1a2e; --primario: #6c63ff;
      --acento: #ff6584; --texto: #e0e0e0; --sutil: #888; --radio: 12px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: var(--texto); min-height: 100vh; padding: 2rem 1rem; }
    .app { max-width: 700px; margin: 0 auto; }
    h1 { font-size: clamp(1.5rem, 4vw, 2rem); color: var(--primario); margin-bottom: 0.5rem; }
    .subtitulo { color: var(--sutil); margin-bottom: 2rem; font-size: 0.95rem; }
    .busqueda { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
    input {
      flex: 1; padding: 0.85rem 1.25rem; border: 2px solid #333;
      border-radius: var(--radio); background: var(--superficie); color: var(--texto);
      font-size: 1rem; outline: none;
    }
    input:focus { border-color: var(--primario); }
    button.btn-buscar {
      padding: 0.85rem 1.5rem; background: var(--primario); color: white;
      border: none; border-radius: var(--radio); cursor: pointer; font-size: 1rem;
      font-weight: 600; transition: transform 0.15s, box-shadow 0.15s;
    }
    button.btn-buscar:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(108,99,255,0.35); }
    button.btn-buscar:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .historial { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; min-height: 34px; }
    .chip {
      padding: 0.3rem 0.9rem; border-radius: 20px; background: var(--superficie);
      border: 1px solid #333; color: var(--sutil); cursor: pointer; font-size: 0.85rem;
      transition: border-color 0.2s, color 0.2s;
    }
    .chip:hover { border-color: var(--primario); color: var(--primario); }
    #resultado { min-height: 100px; }
    .ciudad-nombre { font-size: 1.4rem; font-weight: 700; color: white; margin-bottom: 1rem; }
    .tarjetas { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; }
    .tarjeta {
      background: var(--superficie); border-radius: var(--radio); padding: 1.25rem 1rem;
      text-align: center; border: 1px solid rgba(108,99,255,0.15);
      transition: transform 0.2s, border-color 0.2s;
    }
    .tarjeta:hover { transform: translateY(-3px); border-color: rgba(108,99,255,0.4); }
    .tarjeta .icono  { font-size: 1.8rem; }
    .tarjeta .valor  { font-size: 2rem; font-weight: bold; color: var(--primario); margin: 0.25rem 0; }
    .tarjeta .unidad { font-size: 0.75rem; color: var(--sutil); }
    .tarjeta .etiqueta { font-size: 0.85rem; color: #aaa; margin-top: 0.25rem; }
    .cargando { color: var(--sutil); font-style: italic; }
    .error-msg { color: var(--acento); background: rgba(255,101,132,0.1); padding: 1rem; border-radius: var(--radio); }
  </style>
</head>
<body>
<div class="app">
  <h1>🌤 App de Clima</h1>
  <p class="subtitulo">Datos en tiempo real · Open Meteo API · Sin API key</p>

  <div class="busqueda">
    <input id="input-ciudad" type="text" placeholder="Madrid, Bogotá, Buenos Aires..." autocomplete="off">
    <button class="btn-buscar" id="btn-buscar">Buscar</button>
  </div>

  <div class="historial" id="historial"></div>
  <div id="resultado"></div>
</div>

<script>
  const inputCiudad = document.getElementById("input-ciudad");
  const btnBuscar   = document.getElementById("btn-buscar");
  const resultadoEl = document.getElementById("resultado");
  const historialEl = document.getElementById("historial");
  let historial = [];

  const wmo = {
    0:"Despejado ☀️", 1:"Casi despejado 🌤", 2:"Parcialmente nublado ⛅", 3:"Cubierto ☁️",
    45:"Niebla 🌫", 51:"Llovizna 🌦", 61:"Lluvia leve 🌧", 63:"Lluvia 🌧",
    80:"Chubascos 🌦", 95:"Tormenta ⛈",
  };

  // Paso 1: ciudad → lat/lon
  async function geocodificar(ciudad) {
    const url = \`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(ciudad)}&count=1&language=es&format=json\`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(\`Error de red: \${res.status}\`);
    const data = await res.json();
    if (!data.results?.length) throw new Error(\`Ciudad "\${ciudad}" no encontrada.\`);
    return data.results[0];
  }

  // Paso 2: lat/lon → clima
  async function obtenerForecast(lat, lon) {
    const url = \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&timezone=auto\`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(\`Error en API de clima: \${res.status}\`);
    return res.json();
  }

  // Orquestador
  async function buscarClima(ciudad) {
    btnBuscar.disabled = true;
    resultadoEl.innerHTML = \`<p class="cargando">Buscando "\${ciudad}"...</p>\`;

    try {
      const lugar    = await geocodificar(ciudad);
      const forecast = await obtenerForecast(lugar.latitude, lugar.longitude);
      const c        = forecast.current;
      const condicion = wmo[c.weather_code] ?? \`código \${c.weather_code}\`;

      resultadoEl.innerHTML = \`
        <p class="ciudad-nombre">\${lugar.name}, \${lugar.country}</p>
        <div class="tarjetas">
          <div class="tarjeta">
            <div class="icono">🌡</div>
            <div class="valor">\${c.temperature_2m}°</div>
            <div class="unidad">Celsius</div>
            <div class="etiqueta">Temperatura</div>
          </div>
          <div class="tarjeta">
            <div class="icono">💨</div>
            <div class="valor">\${c.wind_speed_10m}</div>
            <div class="unidad">km/h</div>
            <div class="etiqueta">Viento</div>
          </div>
          <div class="tarjeta">
            <div class="icono">💧</div>
            <div class="valor">\${c.relative_humidity_2m}%</div>
            <div class="unidad"> </div>
            <div class="etiqueta">Humedad</div>
          </div>
          <div class="tarjeta">
            <div class="icono">☁️</div>
            <div class="valor" style="font-size:1rem;line-height:1.3">\${condicion}</div>
            <div class="unidad"> </div>
            <div class="etiqueta">Condición</div>
          </div>
        </div>
      \`;

      historial = [lugar.name, ...historial.filter(h => h !== lugar.name)].slice(0, 5);
      historialEl.innerHTML = historial.map(h =>
        \`<span class="chip" data-ciudad="\${h}">\${h}</span>\`
      ).join("");
      historialEl.querySelectorAll(".chip").forEach(chip => {
        chip.addEventListener("click", () => buscarClima(chip.dataset.ciudad));
      });

    } catch (error) {
      resultadoEl.innerHTML = \`<p class="error-msg">⚠️ \${error.message}</p>\`;
    } finally {
      btnBuscar.disabled = false;
    }
  }

  btnBuscar.addEventListener("click", () => {
    const ciudad = inputCiudad.value.trim();
    if (ciudad) buscarClima(ciudad);
  });

  inputCiudad.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const ciudad = inputCiudad.value.trim();
      if (ciudad) buscarClima(ciudad);
    }
  });
</script>
</body>
</html>`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Variables y funciones arrow',
    description: 'Declara: (1) `const PI = 3.14159`, (2) `let radio = 7`, (3) una arrow function `areaCirculo` que reciba `r` y retorne `PI * r * r`. Luego muestra en `<div id="resultado">` el texto: `Área del círculo (r=7): [resultado redondeado a 2 decimales]`.',
    hint: 'La arrow function: const areaCirculo = (r) => PI * r * r. Usa template literal y .toFixed(2) para redondear. Selecciona el div con document.getElementById y asigna a .textContent.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Variables y Funciones</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    #resultado { background: #1a1a2e; padding: 1rem; border-radius: 8px; margin-top: 1rem; font-family: monospace; }
  </style>
</head>
<body>
  <h2>Área del círculo</h2>
  <div id="resultado">Aquí aparecerá el resultado...</div>

  <script>
    // 1. Declara const PI = 3.14159

    // 2. Declara let radio = 7

    // 3. Arrow function areaCirculo(r) que retorne PI * r * r

    // 4. Muestra en #resultado: "Área del círculo (r=7): [valor].toFixed(2)"

  </script>
</body>
</html>
`,
    validate(_output, code) {
      if (!/const\s+PI\s*=\s*3\.14/i.test(code))
        return { ok: false, message: 'Declara `const PI = 3.14159`.' }
      if (!/let\s+radio\s*=/i.test(code))
        return { ok: false, message: 'Declara `let radio = 7`.' }
      if (!/const\s+areaCirculo\s*=\s*[\w\s]*=>/i.test(code))
        return { ok: false, message: 'Crea una arrow function llamada `areaCirculo`.' }
      if (!/document\.(getElementById|querySelector)/i.test(code))
        return { ok: false, message: 'Usa `document.getElementById` o `querySelector` para seleccionar el div.' }
      if (!/\.textContent|\.innerHTML/i.test(code))
        return { ok: false, message: 'Asigna el resultado al `.textContent` o `.innerHTML` del elemento.' }
      if (!/`/.test(code))
        return { ok: false, message: 'Usa un template literal (backticks) para mostrar el texto con el resultado.' }
      return { ok: true, message: '¡const, let y arrow functions dominadas! Estas son las bases de todo JS moderno.' }
    },
  },
  {
    id: 'ex2',
    title: 'map, filter y reduce',
    description: 'Dado el array `const notas = [45, 78, 92, 61, 55, 88, 73, 34]`, usa: (1) `filter` para obtener las notas >= 60, (2) `map` sobre las aprobadas para etiquetar cada una como `"Aprobado"` (< 90) o `"Sobresaliente"` (>= 90), (3) `reduce` para calcular el promedio de TODAS las notas. Muestra los 3 resultados en `#resultado`.',
    hint: 'const aprobadas = notas.filter(n => n >= 60). Luego aprobadas.map(n => n >= 90 ? "Sobresaliente" : "Aprobado"). Promedio: notas.reduce((acc, n) => acc + n, 0) / notas.length.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Array Methods</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    .res { background: #1a1a2e; padding: 0.75rem 1rem; border-radius: 8px; margin: 0.5rem 0; font-family: monospace; }
  </style>
</head>
<body>
  <h2>Análisis de notas</h2>
  <div id="resultado"></div>

  <script>
    const notas = [45, 78, 92, 61, 55, 88, 73, 34];

    // 1. filter: notas >= 60

    // 2. map sobre las aprobadas: "Aprobado" o "Sobresaliente"

    // 3. reduce: promedio de todas las notas

    // 4. Renderiza los 3 resultados en #resultado

  </script>
</body>
</html>
`,
    validate(_output, code) {
      if (!/\.filter\s*\(/i.test(code))
        return { ok: false, message: 'Usa `.filter()` para obtener las notas aprobadas (>= 60).' }
      if (!/\.map\s*\(/i.test(code))
        return { ok: false, message: 'Usa `.map()` para etiquetar cada nota aprobada.' }
      if (!/\.reduce\s*\(/i.test(code))
        return { ok: false, message: 'Usa `.reduce()` para calcular el promedio.' }
      if (!/60/.test(code))
        return { ok: false, message: 'El filter debe comparar con 60 (notas >= 60).' }
      if (!/90/.test(code))
        return { ok: false, message: 'El map debe distinguir Sobresaliente (>= 90) de Aprobado.' }
      if (!/document\.(getElementById|querySelector)/i.test(code))
        return { ok: false, message: 'Muestra los resultados en el elemento #resultado del DOM.' }
      return { ok: true, message: '¡map, filter y reduce en acción! La triada funcional para transformar datos.' }
    },
  },
  {
    id: 'ex3',
    title: 'DOM dinámico: lista interactiva',
    description: 'Crea un `<input>` y un botón "Agregar". Al hacer clic (o presionar Enter), añade un `<li>` al `<ul id="lista">` con el texto del input. Cada `<li>` debe tener un botón "✕" que al clicarlo elimine ese item con `.remove()`.',
    hint: 'Usa document.createElement("li") y .append() para agregar el li a la lista. El botón ✕ dentro del li debe tener un listener que llame a li.remove(). Limpia el input (input.value = "") después de agregar.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>DOM Dinámico</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    .form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    input { flex: 1; padding: 0.7rem 1rem; border: 2px solid #333; border-radius: 8px; background: #1a1a2e; color: white; font-size: 1rem; outline: none; }
    input:focus { border-color: #6c63ff; }
    button { padding: 0.7rem 1.2rem; background: #6c63ff; color: white; border: none; border-radius: 8px; cursor: pointer; }
    ul { list-style: none; padding: 0; }
    li { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #1a1a2e; border-radius: 8px; margin-bottom: 0.4rem; }
    .btn-borrar { background: #7f0000; color: #ef9a9a; border: none; border-radius: 6px; padding: 0.2rem 0.6rem; cursor: pointer; }
  </style>
</head>
<body>
  <h2>Mi lista dinámica</h2>
  <div class="form">
    <input id="input-item" type="text" placeholder="Nuevo item...">
    <button id="btn-agregar">Agregar</button>
  </div>
  <ul id="lista"></ul>

  <script>
    // 1. Selecciona input, botón y lista

    // 2. Función para agregar un item (crea <li>, botón ✕ con .remove())

    // 3. Listener en el botón "Agregar"

    // 4. Listener en el input para Enter (e.key === "Enter")

  </script>
</body>
</html>
`,
    validate(_output, code) {
      if (!/document\.(getElementById|querySelector)/i.test(code))
        return { ok: false, message: 'Usa querySelector o getElementById para seleccionar los elementos.' }
      if (!/createElement\s*\(\s*['"]li['"]/i.test(code))
        return { ok: false, message: 'Usa document.createElement("li") para crear cada item.' }
      if (!/(\.append|\.appendChild)/i.test(code))
        return { ok: false, message: 'Usa .append() o .appendChild() para añadir el <li> a la lista.' }
      if (!/\.remove\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Usa .remove() para eliminar el item al hacer clic en ✕.' }
      if (!/addEventListener\s*\(\s*['"]click['"]/i.test(code))
        return { ok: false, message: 'Añade un addEventListener("click") al botón de agregar.' }
      if (!/e\.key\s*===?\s*['"]Enter['"]/i.test(code))
        return { ok: false, message: 'Añade un listener para Enter en el input (e.key === "Enter").' }
      if (!/\.value\s*=\s*['"]{2}/.test(code))
        return { ok: false, message: 'Limpia el input después de agregar (input.value = "").' }
      return { ok: true, message: '¡DOM dinámico completo! createElement + append + remove — la base de cualquier UI interactiva.' }
    },
  },
  {
    id: 'ex4',
    title: 'Formulario con validación de eventos',
    description: 'Crea un formulario con `<input id="nombre">` y `<input id="email">`. Con `addEventListener("submit", ...)` y `e.preventDefault()`, valida: nombre >= 3 caracteres y email contiene "@". Si hay error, muéstralo en `<p id="errores">`. Si es válido, muestra "¡Enviado correctamente!" en `<p id="exito">`.',
    hint: 'Escucha el evento "submit" del form, llama a e.preventDefault(). Lee los valores con .value.trim(). Valida con .length < 3 e includes("@"). Muestra los mensajes en los párrafos.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Validación de Formulario</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    form { display: flex; flex-direction: column; gap: 0.75rem; max-width: 400px; }
    input { padding: 0.75rem 1rem; border: 2px solid #333; border-radius: 8px; background: #1a1a2e; color: white; font-size: 1rem; outline: none; }
    input:focus { border-color: #6c63ff; }
    button { padding: 0.75rem; background: #6c63ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
    #errores { color: #ff6584; min-height: 1.2rem; }
    #exito   { color: #4caf50; min-height: 1.2rem; }
  </style>
</head>
<body>
  <h2>Formulario de registro</h2>
  <form id="mi-form">
    <input id="nombre" type="text" placeholder="Tu nombre">
    <input id="email"  type="email" placeholder="tu@email.com">
    <button type="submit">Enviar</button>
  </form>
  <p id="errores"></p>
  <p id="exito"></p>

  <script>
    // 1. Selecciona el form, los inputs y los párrafos

    // 2. addEventListener("submit") en el form

    // 3. preventDefault(), validar y mostrar mensajes

  </script>
</body>
</html>
`,
    validate(_output, code) {
      if (!/addEventListener\s*\(\s*['"]submit['"]/i.test(code))
        return { ok: false, message: 'Escucha el evento "submit" en el formulario con addEventListener.' }
      if (!/e\.preventDefault\(\)|event\.preventDefault\(\)/i.test(code))
        return { ok: false, message: 'Llama a e.preventDefault() para evitar que la página se recargue.' }
      if (!/\.length/i.test(code))
        return { ok: false, message: 'Valida la longitud del nombre con .length (mínimo 3 caracteres).' }
      if (!/includes\s*\(\s*['"]@['"]\)/i.test(code))
        return { ok: false, message: 'Valida que el email incluya "@" con .includes("@").' }
      if (!/errores/i.test(code))
        return { ok: false, message: 'Muestra los errores en el elemento #errores.' }
      if (!/exito/i.test(code))
        return { ok: false, message: 'Muestra el mensaje de éxito en el elemento #exito.' }
      return { ok: true, message: '¡Validación completa! submit + preventDefault + lógica de validación = formularios robustos.' }
    },
  },
  {
    id: 'ex5',
    title: 'Proyecto: App de clima',
    description: 'Construye la app de clima completa con: un `<input>` para la ciudad, botón "Buscar", y `async/await` con `try/catch` para llamar primero a la Geocoding API (lat/lon) y luego a la Forecast API (clima). Muestra temperatura, viento y humedad en tarjetas. Maneja estado de carga y errores.',
    hint: 'Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=CIUDAD&count=1`. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON&current=temperature_2m,wind_speed_10m,relative_humidity_2m`. Ambas APIs son gratuitas y sin API key.',
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App de Clima</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #0d0d1a; color: #e0e0e0; }
    h1 { color: #6c63ff; margin-bottom: 1.5rem; }
    .busqueda { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
    input { flex: 1; padding: 0.85rem 1.25rem; border: 2px solid #333; border-radius: 12px; background: #1a1a2e; color: white; font-size: 1rem; outline: none; }
    input:focus { border-color: #6c63ff; }
    button { padding: 0.85rem 1.5rem; background: #6c63ff; color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 1rem; font-weight: 600; }
    .tarjetas { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; }
    .tarjeta { background: #1a1a2e; border-radius: 12px; padding: 1.25rem; text-align: center; }
    .tarjeta .valor { font-size: 2rem; font-weight: bold; color: #6c63ff; }
    .tarjeta .etiqueta { font-size: 0.85rem; color: #888; margin-top: 0.25rem; }
  </style>
</head>
<body>
  <h1>🌤 App de Clima</h1>
  <div class="busqueda">
    <input id="input-ciudad" placeholder="Escribe una ciudad..." type="text">
    <button id="btn-buscar">Buscar</button>
  </div>
  <div id="resultado"></div>

  <script>
    // 1. Selecciona los elementos del DOM

    // 2. async function geocodificar(ciudad) — llama a la Geocoding API

    // 3. async function obtenerForecast(lat, lon) — llama a la Forecast API

    // 4. async function buscarClima(ciudad) — orquesta las dos con try/catch

    // 5. Renderiza tarjetas con temperatura, viento y humedad

    // 6. Listeners al botón y al Enter del input

  </script>
</body>
</html>
`,
    validate(_output, code) {
      if (!/async\s+function|const\s+\w+\s*=\s*async/i.test(code))
        return { ok: false, message: 'Usa funciones `async` para manejar las peticiones a la API.' }
      if (!/await\s+fetch/i.test(code))
        return { ok: false, message: 'Usa `await fetch(...)` para esperar la respuesta de la API.' }
      if ((code.match(/fetch\s*\(/g) || []).length < 2)
        return { ok: false, message: 'Debes hacer al menos 2 llamadas a fetch(): geocoding y forecast.' }
      if (!/try\s*\{/i.test(code))
        return { ok: false, message: 'Usa un bloque `try` para el código de las peticiones async.' }
      if (!/catch\s*\(/i.test(code))
        return { ok: false, message: 'Agrega un bloque `catch` para manejar errores de red o ciudad no encontrada.' }
      if (!/geocoding-api\.open-meteo\.com/i.test(code))
        return { ok: false, message: 'Usa la Geocoding API de Open Meteo para convertir la ciudad en lat/lon.' }
      if (!/api\.open-meteo\.com\/v1\/forecast/i.test(code))
        return { ok: false, message: 'Usa la Forecast API de Open Meteo para obtener el clima actual.' }
      if (!/temperature_2m/i.test(code))
        return { ok: false, message: 'Solicita `temperature_2m` en los parámetros del forecast.' }
      if (!/(\.tarjeta|tarjeta)/i.test(code))
        return { ok: false, message: 'Muestra los datos en tarjetas (elementos con clase .tarjeta).' }
      return { ok: true, message: '¡App de clima completa! fetch + async/await + DOM + manejo de errores — tu primer contacto real con APIs. 🌍' }
    },
  },
]
