export const lesson = {
  id: 'lesson-7',
  title: 'Git y Control de Versiones',
  subtitle: 'Lección 7 — Fase 3: Git & GitHub',
  language: 'bash',
  sections: [
    {
      id: 's1',
      title: '¿Qué es un sistema de control de versiones?',
      content: `Un **sistema de control de versiones** (VCS) registra cada cambio que haces en tus archivos a lo largo del tiempo. En lugar de tener \`proyecto_v1.zip\`, \`proyecto_final.zip\`, \`proyecto_FINAL_de_verdad.zip\`... tienes un **historial completo y navegable**.

**¿Para qué sirve?**
- Volver a cualquier versión anterior si algo se rompe.
- Trabajar en paralelo sin pisarte con otros devs.
- Saber **quién**, **cuándo** y **por qué** cambió cada línea.
- Fusionar cambios de distintas personas de forma controlada.

**Git** es el VCS más usado en el mundo. Es **distribuido**: cada desarrollador tiene una copia completa del historial en su máquina, sin depender de un servidor central.

**Git ≠ GitHub**: Git es la herramienta local. GitHub es una plataforma web que aloja repositorios Git y añade colaboración (issues, pull requests, CI/CD).

**Conceptos clave:**
- **Repositorio (repo)** — el proyecto con todo su historial. Vive en la carpeta \`.git/\`.
- **Working directory** — los archivos que ves y editas.
- **Staging area (índice)** — zona de preparación antes de hacer un commit.
- **Commit** — una instantánea del proyecto en un momento dado. Tiene un ID único (hash SHA-1).
- **HEAD** — puntero que indica en qué commit estás ahora mismo.`,
      example: `# ─── El flujo de tres zonas de Git ───
#
#   Working Directory  →  Staging Area  →  Repositorio (.git)
#
#   (editas archivos)     (git add)         (git commit)
#
# Analogía: escribir un libro
#   - Working dir = el borrador que estás escribiendo
#   - Staging area = las páginas que ya revisaste y quieres incluir
#   - Commit = el capítulo terminado e impreso
#
# Cada commit tiene:
#   - Hash único:    a1b2c3d
#   - Autor:         Ana García <ana@email.com>
#   - Fecha:         2025-06-01 10:30:00
#   - Mensaje:       "feat: agregar formulario de contacto"
#   - Referencia al commit padre (forma la cadena de historial)
#
# Ver el historial de cualquier proyecto:
git log
git log --oneline
git log --oneline --graph --all   # visual de ramas`,
    },
    {
      id: 's2',
      title: 'git init, add, commit, status, log',
      content: `Estos cinco comandos forman el **flujo diario** de Git. Con ellos puedes crear un repo desde cero y guardar tu trabajo.

**\`git init\`** — inicializa un repositorio en el directorio actual. Crea la carpeta oculta \`.git/\`.

**\`git status\`** — muestra el estado actual: archivos no rastreados, modificados, o en staging. Úsalo constantemente.

**\`git add\`** — mueve cambios al staging area:
\`\`\`bash
git add archivo.txt        # un archivo específico
git add src/               # un directorio
git add .                  # todos los cambios (con cuidado)
\`\`\`

**\`git commit\`** — guarda los cambios del staging como un commit:
\`\`\`bash
git commit -m "feat: agregar página de inicio"
\`\`\`
El mensaje debe describir el **por qué**, no el qué. Convención popular: **Conventional Commits** — prefijos \`feat:\`, \`fix:\`, \`docs:\`, \`refactor:\`, \`chore:\`.

**\`git log\`** — muestra el historial de commits:
\`\`\`bash
git log                    # historial completo
git log --oneline          # una línea por commit
git log --oneline -5       # últimos 5
git log --author="Ana"     # filtra por autor
\`\`\`

**\`git diff\`** — ver exactamente qué cambió:
\`\`\`bash
git diff                   # cambios en working dir vs staging
git diff --staged          # cambios en staging vs último commit
\`\`\``,
      example: `# ─── Flujo completo: primer proyecto con Git ───

# 1. Crear el proyecto e inicializar
mkdir mi-web
cd mi-web
git init
# Initialized empty Git repository in .../mi-web/.git/

# 2. Configurar tu identidad (solo la primera vez)
git config --global user.name  "Tu Nombre"
git config --global user.email "tu@email.com"

# 3. Crear archivos
echo "# Mi Web" > README.md
echo "<!DOCTYPE html><html><body><h1>Hola</h1></body></html>" > index.html

# 4. Ver qué hay sin trackear
git status
# On branch main
# Untracked files:
#   README.md
#   index.html

# 5. Agregar al staging
git add README.md index.html

# 6. Confirmar lo que está en staging
git status
# Changes to be committed:
#   new file: README.md
#   new file: index.html

# 7. Primer commit
git commit -m "feat: estructura inicial del proyecto"
# [main (root-commit) 4f2a1b3] feat: estructura inicial del proyecto
#  2 files changed, 2 insertions(+)

# 8. Modificar un archivo y ver la diferencia
echo "<p>Bienvenido</p>" >> index.html
git diff
# diff --git a/index.html b/index.html
# +<p>Bienvenido</p>

# 9. Commit del cambio
git add index.html
git commit -m "feat: agregar párrafo de bienvenida"

# 10. Ver historial
git log --oneline
# 9c3d2e1 (HEAD -> main) feat: agregar párrafo de bienvenida
# 4f2a1b3 feat: estructura inicial del proyecto`,
    },
    {
      id: 's3',
      title: 'Ramas: git branch, checkout, merge',
      content: `Una **rama** (branch) es una línea de desarrollo independiente. Te permite trabajar en una funcionalidad nueva sin afectar el código estable de \`main\`.

**La rama \`main\`** (o \`master\`) es la principal — representa el código listo para producción.

**Crear y moverse entre ramas:**
\`\`\`bash
git branch                      # listar ramas locales
git branch feature/login        # crear rama (sin moverse)
git checkout feature/login      # moverse a esa rama
git checkout -b feature/login   # crear y moverse en un paso
git switch -c feature/login     # forma moderna (Git 2.23+)
\`\`\`

**El flujo de trabajo estándar (Feature Branch Workflow):**
1. Crear una rama desde \`main\` para cada funcionalidad.
2. Hacer commits en esa rama.
3. Fusionarla a \`main\` cuando esté lista.
4. Borrar la rama.

**\`git merge\`** — fusiona una rama en la actual:
\`\`\`bash
git checkout main
git merge feature/login
\`\`\`

**Tipos de merge:**
- **Fast-forward** — \`main\` no tuvo commits desde que creaste la rama. Git simplemente mueve el puntero. Historial lineal.
- **3-way merge** — ambas ramas divergieron. Git crea un nuevo *merge commit* que une los dos historiales.

**Borrar una rama** después de fusionarla:
\`\`\`bash
git branch -d feature/login   # borrar (seguro: solo si está fusionada)
git branch -D feature/login   # forzar borrado
\`\`\``,
      example: `# ─── Feature Branch Workflow ───

# Estamos en main con código estable
git log --oneline
# a3f1c2e (HEAD -> main) feat: página de inicio

# 1. Crear rama para nueva funcionalidad
git checkout -b feature/contacto
# Switched to a new branch 'feature/contacto'

# 2. Trabajar en la rama
echo "<form>...</form>" > contacto.html
git add contacto.html
git commit -m "feat: agregar formulario de contacto"

echo "form { padding: 1rem; }" >> styles.css
git add styles.css
git commit -m "style: estilos del formulario"

# El historial en esta rama:
git log --oneline
# 7d4e9f1 (HEAD -> feature/contacto) style: estilos del formulario
# 2b8a3c5 feat: agregar formulario de contacto
# a3f1c2e (main) feat: página de inicio

# 3. Volver a main y fusionar
git checkout main
git merge feature/contacto
# Updating a3f1c2e..7d4e9f1
# Fast-forward  ← historial lineal, no hubo divergencia
#  contacto.html | 1 +
#  styles.css    | 1 +

# 4. Borrar la rama (ya no la necesitamos)
git branch -d feature/contacto

# 5. Ver todas las ramas
git branch
# * main    ← asterisco = rama actual

# ─── Ver gráfico de ramas ───
git log --oneline --graph --all
# * 7d4e9f1 (HEAD -> main) style: estilos del formulario
# * 2b8a3c5 feat: agregar formulario de contacto
# * a3f1c2e feat: página de inicio`,
    },
    {
      id: 's4',
      title: 'Resolución de conflictos básica',
      content: `Un **conflicto** ocurre cuando dos ramas modifican la **misma línea del mismo archivo**. Git no puede decidir cuál versión conservar — tienes que decidirlo tú.

**¿Cuándo sucede?**
Al hacer \`git merge\` (o \`git rebase\`, \`git pull\`) si ambas ramas editaron las mismas líneas.

**Cómo Git marca el conflicto** en el archivo:
\`\`\`
<<<<<<< HEAD
  color: blue;         ← tu versión (rama actual)
=======
  color: green;        ← versión entrante (la que estás fusionando)
>>>>>>> feature/tema
\`\`\`

**Pasos para resolver:**
1. Abre el archivo con el conflicto.
2. Decide qué conservar: la versión de HEAD, la entrante, o una combinación.
3. **Elimina todos los marcadores** (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`).
4. Guarda el archivo.
5. \`git add\` el archivo resuelto.
6. \`git commit\` (Git prepara un mensaje automático).

**Herramientas útiles:**
- **VS Code** — detecta conflictos y muestra botones: "Accept Current", "Accept Incoming", "Accept Both".
- \`git mergetool\` — abre tu herramienta de diff configurada.
- \`git merge --abort\` — cancela el merge y vuelve al estado anterior.

**Prevenir conflictos:**
- Ramas cortas (máximo 1-2 días de trabajo).
- Hacer \`git pull\` frecuentemente para sincronizar con \`main\`.
- Dividir el trabajo por archivos/módulos independientes.`,
      example: `# ─── Creando y resolviendo un conflicto ───

# Situación: dos ramas editaron la misma línea de styles.css

# Rama main tiene:
# body { background: #fff; color: #333; }

# Rama feature/tema tiene:
# body { background: #0d0d1a; color: #e0e0e0; }

git checkout main
git merge feature/tema
# Auto-merging styles.css
# CONFLICT (content): Merge conflict in styles.css
# Automatic merge failed; fix conflicts and then commit the result.

# ── El archivo styles.css ahora se ve así: ──
# body {
# <<<<<<< HEAD
#   background: #fff;
#   color: #333;
# =======
#   background: #0d0d1a;
#   color: #e0e0e0;
# >>>>>>> feature/tema
# }

# ── Decisión: quiero el tema oscuro. Edito el archivo a: ──
# body {
#   background: #0d0d1a;
#   color: #e0e0e0;
# }

# Verificar qué archivos tienen conflictos
git status
# both modified: styles.css

# Marcar como resuelto y commitear
git add styles.css
git commit
# [main 5e8b2a1] Merge branch 'feature/tema'

# Si quiero cancelar TODO el merge (antes de commitear):
# git merge --abort`,
    },
    {
      id: 's5',
      title: '.gitignore',
      content: `**\`.gitignore\`** le dice a Git qué archivos y carpetas **nunca debe rastrear**. Se coloca en la raíz del repositorio.

**¿Qué ignorar?**
- Dependencias instaladas: \`node_modules/\`, \`venv/\`, \`.venv/\`
- Archivos de compilación: \`dist/\`, \`build/\`, \`*.pyc\`
- Variables de entorno y secretos: \`.env\`, \`.env.local\`, \`*.key\`
- Archivos del editor: \`.vscode/\`, \`.idea/\`, \`*.swp\`
- Logs: \`*.log\`, \`logs/\`
- Caché del sistema operativo: \`.DS_Store\` (Mac), \`Thumbs.db\` (Windows)

**Sintaxis de patrones:**
\`\`\`
*.log           # cualquier archivo .log
/dist           # carpeta dist en la raíz (no en subdirectorios)
dist/           # carpeta dist en cualquier nivel
!importante.log # excepcionar un archivo específico
src/**/*.test   # todos los .test dentro de src/ (recursivo)
\`\`\`

**Si ya rastreaste un archivo por error:**
\`\`\`bash
git rm --cached archivo.env   # quita del tracking sin borrar el archivo
git rm --cached -r dist/      # quita un directorio
\`\`\`
Después añade el patrón al \`.gitignore\` y haz commit.

**Tip**: GitHub mantiene plantillas de \`.gitignore\` para cada lenguaje en [github.com/github/gitignore](https://github.com/github/gitignore). Al crear un repo en GitHub puedes elegir una plantilla automáticamente.`,
      example: `# ─── .gitignore para un proyecto web con Node.js ───

# Dependencias
node_modules/
.pnp
.pnp.js

# Build / compilación
dist/
build/
.next/
out/

# Variables de entorno (¡NUNCA subir claves al repo!)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editores e IDEs
.vscode/
.idea/
*.swp
*.swo
*.suo

# Sistema operativo
.DS_Store
.DS_Store?
Thumbs.db
ehthumbs.db

# Caché
.cache/
.parcel-cache/
.eslintcache

# Testing
coverage/
.nyc_output/

# ─── Agregar .gitignore a un repo existente ───
# Si ya habías hecho commit de node_modules/:

git rm --cached -r node_modules/
# Agrega node_modules/ a .gitignore
git add .gitignore
git commit -m "chore: agregar .gitignore y dejar de trackear node_modules"`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Flujo básico: init, add, commit',
    description: 'Escribe los comandos Git necesarios para: (1) inicializar un repositorio en una carpeta, (2) agregar todos los archivos al staging area, (3) hacer un commit con el mensaje `"feat: primer commit"`. Un comando por línea.',
    hint: 'Los tres comandos son: git init, git add ., git commit -m "mensaje". Escríbelos en orden, uno por línea.',
    starterCode: `# Escribe los 3 comandos en orden

# 1. Inicializar el repositorio

# 2. Agregar todos los archivos al staging

# 3. Hacer el primer commit con mensaje "feat: primer commit"
`,
    validate(_output, code) {
      if (!/git\s+init\b/i.test(code))
        return { ok: false, message: 'Agrega el comando `git init` para inicializar el repositorio.' }
      if (!/git\s+add\s+\./i.test(code) && !/git\s+add\s+-A/i.test(code))
        return { ok: false, message: 'Usa `git add .` para agregar todos los archivos al staging area.' }
      if (!/git\s+commit\s+-m/i.test(code))
        return { ok: false, message: 'Usa `git commit -m "mensaje"` para guardar el commit.' }
      if (!/"feat:\s*primer commit"/i.test(code) && !/'feat:\s*primer commit'/i.test(code))
        return { ok: false, message: 'El mensaje del commit debe ser exactamente `"feat: primer commit"`.' }
      return { ok: true, message: '¡Flujo básico dominado! init → add → commit es el ciclo fundamental de Git.' }
    },
  },
  {
    id: 'ex2',
    title: 'Inspeccionar el repositorio',
    description: 'Escribe los comandos para: (1) ver el estado actual del repositorio, (2) ver el historial en formato compacto (una línea por commit), (3) ver las diferencias entre el working directory y el staging area.',
    hint: 'Los comandos son: git status, git log --oneline, git diff. Cada uno en su propia línea.',
    starterCode: `# Escribe los comandos para inspeccionar el repo

# 1. Ver el estado actual (archivos modificados, staging, etc.)

# 2. Ver el historial compacto (una línea por commit)

# 3. Ver qué cambió en el working directory (sin stagear)
`,
    validate(_output, code) {
      if (!/git\s+status\b/i.test(code))
        return { ok: false, message: 'Agrega `git status` para ver el estado del repositorio.' }
      if (!/git\s+log\s+--oneline/i.test(code))
        return { ok: false, message: 'Usa `git log --oneline` para el historial compacto.' }
      if (!/git\s+diff\b/i.test(code))
        return { ok: false, message: 'Usa `git diff` para ver los cambios en el working directory.' }
      return { ok: true, message: '¡status + log + diff son tus ojos dentro del repositorio!' }
    },
  },
  {
    id: 'ex3',
    title: 'Crear una rama y fusionarla',
    description: 'Escribe los comandos para el flujo completo de una rama: (1) crear y moverse a una nueva rama llamada `feature/navbar`, (2) hacer un commit en esa rama, (3) volver a `main`, (4) fusionar `feature/navbar` en `main`, (5) borrar la rama.',
    hint: 'Usa: git checkout -b feature/navbar, git commit -m "...", git checkout main, git merge feature/navbar, git branch -d feature/navbar.',
    starterCode: `# Flujo completo de rama

# 1. Crear y moverse a la rama "feature/navbar"

# 2. Hacer un commit (mensaje libre, usa la convención feat:)

# 3. Volver a main

# 4. Fusionar feature/navbar en main

# 5. Borrar la rama feature/navbar
`,
    validate(_output, code) {
      if (!/git\s+(checkout\s+-b|switch\s+-c)\s+feature\/navbar/i.test(code))
        return { ok: false, message: 'Crea y muévete a la rama con `git checkout -b feature/navbar`.' }
      if (!/git\s+commit\s+-m/i.test(code))
        return { ok: false, message: 'Haz un commit en la rama (git commit -m "...").' }
      if (!/git\s+(checkout|switch)\s+main/i.test(code))
        return { ok: false, message: 'Vuelve a main con `git checkout main`.' }
      if (!/git\s+merge\s+feature\/navbar/i.test(code))
        return { ok: false, message: 'Fusiona con `git merge feature/navbar`.' }
      if (!/git\s+branch\s+-[dD]\s+feature\/navbar/i.test(code))
        return { ok: false, message: 'Borra la rama con `git branch -d feature/navbar`.' }
      return { ok: true, message: '¡Feature Branch Workflow completo! Este es el flujo que usan los equipos profesionales.' }
    },
  },
  {
    id: 'ex4',
    title: 'Resolver un conflicto',
    description: 'El archivo `styles.css` tiene un conflicto de merge. Reescríbelo con el conflicto resuelto: conserva la versión de `feature/tema` (fondo oscuro `#0d0d1a`, texto `#e0e0e0`) y elimina todos los marcadores de conflicto.',
    hint: 'Elimina las líneas con <<<<<<<, =======, >>>>>>>. Conserva solo las líneas de fondo oscuro. El archivo final debe tener body { } con los dos valores del tema oscuro.',
    starterCode: `/* styles.css — con conflicto de merge */

body {
<<<<<<< HEAD
  background: #ffffff;
  color: #333333;
=======
  background: #0d0d1a;
  color: #e0e0e0;
>>>>>>> feature/tema
}
`,
    validate(_output, code) {
      if (/<<<<<<</i.test(code))
        return { ok: false, message: 'Elimina el marcador `<<<<<<<`. El conflicto no está resuelto.' }
      if (/=======/i.test(code))
        return { ok: false, message: 'Elimina el separador `=======`. El conflicto no está resuelto.' }
      if (/>>>>>>>/i.test(code))
        return { ok: false, message: 'Elimina el marcador `>>>>>>>`. El conflicto no está resuelto.' }
      if (!/#0d0d1a/i.test(code))
        return { ok: false, message: 'Conserva el fondo oscuro `#0d0d1a` de la rama feature/tema.' }
      if (!/#e0e0e0/i.test(code))
        return { ok: false, message: 'Conserva el color de texto `#e0e0e0` de la rama feature/tema.' }
      if (/#ffffff/i.test(code) || /#333333/i.test(code))
        return { ok: false, message: 'Elimina los valores de la versión HEAD (#ffffff y #333333).' }
      return { ok: true, message: '¡Conflicto resuelto! Sin marcadores, con el tema oscuro elegido. Ahora harías git add + git commit.' }
    },
  },
  {
    id: 'ex5',
    title: 'Escribir un .gitignore para proyecto web',
    description: 'Escribe un archivo `.gitignore` para un proyecto web con Node.js. Debe ignorar: la carpeta `node_modules/`, la carpeta `dist/`, cualquier archivo `.env`, archivos `.log`, y el archivo `.DS_Store` del sistema operativo.',
    hint: 'Cada patrón en su propia línea. Para carpetas: node_modules/ y dist/. Para archivos por extensión: *.env o solo .env, *.log. Para un archivo específico: .DS_Store.',
    starterCode: `# .gitignore para proyecto web con Node.js
# Agrega los patrones necesarios abajo

`,
    validate(_output, code) {
      if (!/(^|\n)\s*node_modules\//m.test(code))
        return { ok: false, message: 'Ignora la carpeta de dependencias: `node_modules/`.' }
      if (!/(^|\n)\s*dist\//m.test(code))
        return { ok: false, message: 'Ignora la carpeta de build: `dist/`.' }
      if (!/(^|\n)\s*(\.env|\*\.env)/m.test(code))
        return { ok: false, message: 'Ignora los archivos de variables de entorno: `.env` o `*.env`.' }
      if (!/(^|\n)\s*\*\.log/m.test(code))
        return { ok: false, message: 'Ignora los archivos de log con el patrón: `*.log`.' }
      if (!/(^|\n)\s*\.DS_Store/m.test(code))
        return { ok: false, message: 'Ignora el archivo del sistema macOS: `.DS_Store`.' }
      return { ok: true, message: '¡.gitignore completo! Nunca más subas node_modules ni claves secretas al repositorio.' }
    },
  },
]
