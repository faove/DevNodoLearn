export const lesson = {
  id: 'lesson-8',
  title: 'GitHub y Flujo Colaborativo',
  subtitle: 'Lección 8 — Fase 3: Git & GitHub',
  language: 'bash',
  sections: [
    {
      id: 's1',
      title: 'Repositorio remoto: push, pull, clone, fetch',
      content: `Un **repositorio remoto** es una copia de tu repo en un servidor (GitHub, GitLab, etc.). Permite compartir código y colaborar.

**Conectar tu repo local con GitHub:**
\`\`\`bash
git remote add origin https://github.com/usuario/repo.git
git remote -v                  # ver remotos configurados
\`\`\`
\`origin\` es el nombre convencional del remoto principal. Puedes tener varios remotos.

**Subir cambios al remoto:**
\`\`\`bash
git push -u origin main        # primer push: -u vincula la rama local con la remota
git push                       # pushes siguientes (ya está vinculada)
git push origin feature/login  # subir una rama específica
\`\`\`

**Bajar cambios del remoto:**
\`\`\`bash
git fetch origin               # descarga cambios SIN fusionarlos
git pull                       # fetch + merge en un paso
git pull --rebase              # fetch + rebase (historial más lineal)
\`\`\`
\`git fetch\` es más seguro: descarga y te deja revisar antes de fusionar. \`git pull\` es más cómodo para el día a día.

**Clonar un repositorio existente:**
\`\`\`bash
git clone https://github.com/usuario/repo.git
git clone https://github.com/usuario/repo.git mi-carpeta  # nombre personalizado
\`\`\`
\`clone\` ya configura \`origin\` automáticamente.

**Ramas remotas:**
\`\`\`bash
git branch -r                  # listar ramas remotas
git branch -a                  # locales + remotas
git push origin --delete rama  # borrar rama remota
\`\`\``,
      example: `# ─── Flujo completo: local → GitHub ───

# 1. Tienes un repo local y quieres subirlo a GitHub
#    (primero crea el repo vacío en github.com)

git remote add origin https://github.com/tuusuario/mi-proyecto.git

# Verificar
git remote -v
# origin  https://github.com/tuusuario/mi-proyecto.git (fetch)
# origin  https://github.com/tuusuario/mi-proyecto.git (push)

# 2. Subir rama principal por primera vez (-u vincula la rama)
git push -u origin main
# Enumerating objects: 5, done.
# Branch 'main' set up to track remote branch 'main' from 'origin'.

# 3. Hacer cambios locales y subirlos
echo "nueva función" >> app.js
git add app.js
git commit -m "feat: agregar nueva función"
git push                       # ya no necesita -u origin main

# ─── Trabajar con cambios de otro desarrollador ───

# 4. Otro dev subió cambios, necesitas sincronizar
git fetch origin
# remote: Enumerating objects: 3, done.
# From https://github.com/tuusuario/mi-proyecto
#    a1b2c3d..7e8f9a0  main -> origin/main

# Ver qué trajeron sin fusionar aún
git log HEAD..origin/main --oneline
# 7e8f9a0 fix: corregir validación del formulario

# 5. Fusionar los cambios remotos
git pull
# Updating a1b2c3d..7e8f9a0
# Fast-forward

# ─── Clonar un proyecto existente ───
git clone https://github.com/org/proyecto.git
cd proyecto
git log --oneline -3`,
    },
    {
      id: 's2',
      title: 'Fork y colaboración en repos ajenos',
      content: `Un **fork** es una copia personal de un repositorio ajeno en tu cuenta de GitHub. Te permite proponer cambios sin tener acceso de escritura al repo original.

**Fork vs Clone:**
- \`clone\`: copia local de un repo (al que normalmente tienes acceso).
- \`fork\`: copia del repo en tu cuenta de GitHub + clone local de esa copia.

**Convención de remotos en fork:**
- \`origin\` → tu fork (tienes permisos de escritura).
- \`upstream\` → el repo original (solo lectura).

**El flujo de fork completo:**
\`\`\`bash
# 1. Haz fork en github.com (botón "Fork")
# 2. Clona TU fork
git clone https://github.com/TU-USUARIO/repo.git
cd repo

# 3. Añade el repo original como "upstream"
git remote add upstream https://github.com/AUTOR-ORIGINAL/repo.git
git remote -v   # verifica: origin + upstream

# 4. Crea una rama para tu contribución
git checkout -b feature/mi-mejora

# 5. Trabaja, commitea y sube a TU fork
git add .
git commit -m "feat: descripción de mi mejora"
git push origin feature/mi-mejora

# 6. Abre un Pull Request en github.com desde tu rama
#    hacia la rama main del repo original
\`\`\`

**Sincronizar tu fork con upstream** (para no quedarte atrás):
\`\`\`bash
git fetch upstream
git checkout main
git merge upstream/main        # o: git rebase upstream/main
git push origin main           # actualiza tu fork en GitHub
\`\`\`

Hacerlo antes de crear cada nueva rama evita conflictos.`,
      example: `# ─── Contribuir a un proyecto open source ───

# Escenario: quieres corregir un bug en "devnodo/curriculum"

# 1. Fork en github.com → botón Fork → queda en "tuusuario/curriculum"

# 2. Clonar tu fork
git clone https://github.com/tuusuario/curriculum.git
cd curriculum

# 3. Configurar remotos
git remote add upstream https://github.com/devnodo/curriculum.git
git remote -v
# origin    https://github.com/tuusuario/curriculum.git (fetch/push)
# upstream  https://github.com/devnodo/curriculum.git (fetch/push)

# 4. Sincronizar antes de empezar (buena práctica)
git fetch upstream
git merge upstream/main
git push origin main

# 5. Crear rama para el fix
git checkout -b fix/typo-leccion-3

# 6. Corregir el bug
sed -i 's/intalación/instalación/' leccion3.md
git add leccion3.md
git commit -m "fix: corregir typo en lección 3"

# 7. Subir a tu fork
git push origin fix/typo-leccion-3
# remote: Create a pull request for 'fix/typo-leccion-3' on GitHub:
# remote:   https://github.com/tuusuario/curriculum/pull/new/fix/typo-leccion-3

# 8. Abrir PR en github.com hacia devnodo/curriculum:main
#    (GitHub muestra el link directo en el output del push)

# ─── Después de que el PR fue mergeado ───
git checkout main
git fetch upstream
git merge upstream/main        # tu main ahora incluye tu contribución
git branch -d fix/typo-leccion-3
git push origin main`,
    },
    {
      id: 's3',
      title: 'Pull Request: creación, revisión y merge',
      content: `Un **Pull Request (PR)** es una solicitud para fusionar cambios de una rama en otra. Es el corazón de la colaboración en GitHub — es donde se revisa el código, se discute y se aprueba.

**Crear un PR:**
1. Sube tu rama a GitHub: \`git push origin feature/mi-rama\`.
2. GitHub muestra un banner "Compare & pull request" — haz clic.
3. Elige base (destino, ej. \`main\`) y compare (tu rama).
4. Escribe título y descripción claros.
5. Asigna revisores, labels y milestone si aplica.

**Anatomía de una buena descripción de PR:**
\`\`\`markdown
## ¿Qué hace este PR?
Agrega la funcionalidad de login con email/contraseña.

## ¿Por qué?
Issue #42 — los usuarios no podían autenticarse.

## Cambios principales
- Nuevo componente Login.jsx
- Hook useAuth con JWT
- Rutas protegidas en App.jsx

## Cómo probar
1. npm install && npm run dev
2. Ve a /login
3. Usa credenciales: test@test.com / 123456

## Screenshot
[imagen del formulario funcionando]
\`\`\`

**Revisar un PR:**
- **Approve** — el código está listo para fusionar.
- **Request changes** — hay algo que corregir antes de mergear.
- **Comment** — observación sin bloquear.
- Puedes comentar en líneas específicas del diff.

**Estrategias de merge:**
- **Merge commit** — preserva toda la historia de la rama. Crea un merge commit.
- **Squash and merge** — aplana todos los commits en uno. Historial más limpio.
- **Rebase and merge** — reinscribe los commits sin merge commit. Historial lineal.

**Draft PR**: abre el PR marcado como borrador para pedir feedback temprano sin que sea mergeado accidentalmente.`,
      example: `# ─── Flujo PR completo con GitHub CLI (gh) ───
# Instalar: https://cli.github.com/

# 1. Autenticar
gh auth login

# 2. Crear PR desde la terminal (sin abrir el navegador)
git push origin feature/auth
gh pr create \\
  --title "feat: sistema de autenticación con JWT" \\
  --body "## ¿Qué hace?
Implementa login/register con JWT.

## Issue relacionado
Closes #42

## Cómo probar
1. npm run dev
2. Ir a /login" \\
  --reviewer compañero1,compañero2 \\
  --label "feature"

# 3. Ver PRs abiertos
gh pr list

# 4. Ver el diff de un PR
gh pr diff 15

# 5. Hacer checkout de un PR para revisarlo localmente
gh pr checkout 15

# 6. Aprobar un PR
gh pr review 15 --approve --body "Código limpio, bien documentado ✓"

# 7. Pedir cambios
gh pr review 15 --request-changes --body "Falta validación en el email"

# 8. Mergear (squash para historial limpio)
gh pr merge 15 --squash --delete-branch

# ─── Después del merge ───
git checkout main
git pull                       # sincronizar local con main actualizado
git branch -d feature/auth     # limpiar rama local`,
    },
    {
      id: 's4',
      title: 'Issues, Projects y cierre automático',
      content: `**Issues** son la unidad de trabajo en GitHub: bugs, features, preguntas, tareas. Todo el trabajo se planifica y rastrea mediante issues.

**Crear un issue de calidad:**
- **Título** — corto y específico: "Error 500 al registrar usuario con email duplicado".
- **Descripción** — pasos para reproducir, comportamiento esperado, comportamiento actual.
- **Labels** — \`bug\`, \`enhancement\`, \`documentation\`, \`help wanted\`, \`good first issue\`.
- **Assignee** — quién lo resuelve.
- **Milestone** — a qué versión o sprint pertenece.

**Cerrar issues automáticamente desde un commit o PR:**
Incluye cualquiera de estas palabras clave seguidas del número de issue en el mensaje de commit o en el cuerpo del PR:
\`\`\`
closes #42
fixes #42
resolves #42
\`\`\`
Cuando el PR se fusiona a \`main\`, el issue se cierra automáticamente.

**GitHub Projects** — tablero kanban para gestionar el trabajo:
- Columnas típicas: **To Do → In Progress → In Review → Done**.
- Los issues y PRs se arrastran entre columnas.
- Se puede automatizar: "cuando un PR se abre, mover a In Review".
- Vistas: Board (kanban), Table (hoja de cálculo), Roadmap (timeline).

**Templates de issues y PRs** — archivo \`.github/ISSUE_TEMPLATE.md\` o \`.github/pull_request_template.md\` en el repo. GitHub los usa como plantilla automática al abrir un issue o PR.

\`\`\`markdown
# .github/ISSUE_TEMPLATE/bug_report.md
name: Bug Report
about: Reportar un error
labels: bug

## Descripción del bug
## Pasos para reproducir
## Comportamiento esperado
## Screenshots
\`\`\``,
      example: `# ─── Issues y cierre automático ───

# Escenario: el issue #7 reporta que el botón de login no funciona

# Rama específica para el fix
git checkout -b fix/login-button

# Corrección...
git add src/components/Login.jsx
git commit -m "fix: corregir handler del botón de login

El botón no tenía preventDefault en el submit,
causando recarga de página.

Closes #7"

git push origin fix/login-button

# Al abrir el PR y fusionarlo a main → issue #7 se cierra solo

# ─── Referenciar sin cerrar ───
git commit -m "refactor: extraer lógica del formulario

Relacionado con #7, preparando el terreno para el fix."

# ─── GitHub CLI: gestionar issues ───
# Crear un issue
gh issue create \\
  --title "Agregar validación de email en el registro" \\
  --body "El formulario acepta emails sin @.
Comportamiento esperado: mostrar error de validación." \\
  --label "enhancement" \\
  --assignee "@me"

# Listar issues abiertos
gh issue list

# Ver un issue
gh issue view 7

# Cerrar un issue manualmente
gh issue close 7 --comment "Resuelto en PR #15"

# ─── Proyectos ───
# Se gestionan en github.com/ORG/REPO/projects
# Cada issue/PR se añade al tablero y se arrastra entre columnas:
# To Do → In Progress → In Review → Done`,
    },
    {
      id: 's5',
      title: 'GitHub Pages: despliegue gratuito',
      content: `**GitHub Pages** es un servicio de hosting estático gratuito que sirve archivos HTML/CSS/JS directamente desde un repositorio de GitHub. Sin servidores, sin configuración compleja.

**¿Qué puede alojar?**
- Portafolios personales
- Documentación de proyectos
- Páginas de landing de proyectos open source
- Proyectos estáticos (React/Vite con build)

**Activar GitHub Pages:**
1. Ve a tu repo en GitHub → **Settings → Pages**.
2. En "Source" elige la rama (\`main\` o \`gh-pages\`) y la carpeta (\`/root\` o \`/docs\`).
3. Guarda. En ~1 minuto tu sitio está en: \`https://usuario.github.io/repo\`.

**Opción A — Archivos estáticos en \`main\`:**
Sube \`index.html\` directamente a la raíz o a la carpeta \`/docs\`.

**Opción B — Proyecto con build (React, Vite):**
\`\`\`bash
# 1. Construir el proyecto
npm run build          # genera la carpeta dist/

# 2. Subir solo el build a la rama gh-pages
npm install --save-dev gh-pages

# package.json:
# "homepage": "https://usuario.github.io/repo",
# "scripts": {
#   "predeploy": "npm run build",
#   "deploy": "gh-pages -d dist"
# }

npm run deploy         # publica en la rama gh-pages automáticamente
\`\`\`

**Opción C — GitHub Actions (más potente):**
Cada \`push\` a \`main\` dispara un workflow que hace \`build\` y despliega automáticamente. GitHub tiene una plantilla lista en Settings → Pages → "GitHub Actions".

**Dominio personalizado:**
Añade un archivo \`CNAME\` con tu dominio al repo y configura los DNS.`,
      example: `# ─── Desplegar un proyecto Vite/React en GitHub Pages ───

# 1. Instalar el paquete gh-pages
npm install --save-dev gh-pages

# 2. Configurar package.json
# Agrega estas dos secciones:
cat package.json
# {
#   "name": "mi-portfolio",
#   "homepage": "https://tuusuario.github.io/mi-portfolio",
#   "scripts": {
#     "dev": "vite",
#     "build": "vite build",
#     "predeploy": "npm run build",
#     "deploy": "gh-pages -d dist"
#   }
# }

# 3. (Vite) Configurar la base en vite.config.js
cat vite.config.js
# import { defineConfig } from 'vite'
# export default defineConfig({
#   base: '/mi-portfolio/',   // ← nombre exacto del repo
# })

# 4. Hacer deploy
npm run deploy
# > mi-portfolio@1.0.0 predeploy
# > npm run build
# > mi-portfolio@1.0.0 deploy
# > gh-pages -d dist
# Published

# Tu sitio estará en:
# https://tuusuario.github.io/mi-portfolio

# ─── Verificar en GitHub ───
# Settings → Pages → mostrará la URL activa

# ─── GitHub Actions: deploy automático en cada push ───
# Crea .github/workflows/deploy.yml:
# name: Deploy to GitHub Pages
# on:
#   push:
#     branches: [main]
# jobs:
#   deploy:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: actions/setup-node@v4
#       - run: npm ci && npm run build
#       - uses: peaceiris/actions-gh-pages@v3
#         with:
#           github_token: \${{ secrets.GITHUB_TOKEN }}
#           publish_dir: ./dist`,
    },
    {
      id: 's6',
      title: 'Conventional Commits',
      content: `**Conventional Commits** es una convención de nombres para mensajes de commit que hace el historial legible para humanos y máquinas.

**Formato:**
\`\`\`
<tipo>(<alcance opcional>): <descripción>

[cuerpo opcional]

[footer(s) opcional(es)]
\`\`\`

**Tipos principales:**
| Tipo | Cuándo usarlo |
|------|--------------|
| \`feat\` | nueva funcionalidad (incrementa versión MINOR) |
| \`fix\` | corrección de bug (incrementa versión PATCH) |
| \`docs\` | solo cambios en documentación |
| \`style\` | formato, espacios, sin cambios de lógica |
| \`refactor\` | reescritura sin añadir funcionalidad ni corregir bugs |
| \`test\` | añadir o modificar tests |
| \`chore\` | tareas de mantenimiento (build, dependencias, CI) |
| \`perf\` | mejoras de rendimiento |
| \`ci\` | cambios en el pipeline de CI/CD |

**Breaking changes** — cambio que rompe compatibilidad:
\`\`\`bash
feat!: cambiar respuesta de la API de array a objeto
# o en el footer:
feat(api): nuevo endpoint de autenticación

BREAKING CHANGE: el endpoint /login ahora devuelve { token, user }
en lugar de solo el token como string.
\`\`\`

**Ejemplos reales:**
\`\`\`bash
feat(auth): agregar login con Google OAuth
fix(cart): corregir cálculo del total con descuentos
docs(readme): actualizar instrucciones de instalación
chore: actualizar dependencias de seguridad
refactor(api): extraer lógica de validación a middleware
test(login): agregar tests de integración para el formulario
\`\`\`

**Por qué importa:**
- Generación automática de \`CHANGELOG.md\`.
- Bumping de versión semántica automático con herramientas como \`semantic-release\`.
- Historial de git que cualquier dev puede entender de un vistazo.
- Filtra fácilmente: \`git log --oneline --grep "^feat"\`.

**Herramientas:** \`commitlint\` + \`husky\` validan el formato en cada commit. \`commitizen\` ofrece un CLI interactivo.`,
      example: `# ─── Conventional Commits en la práctica ───

# ✅ Buenos mensajes
git commit -m "feat(auth): agregar registro con email y contraseña"
git commit -m "fix(nav): corregir menú que no cierra en móvil"
git commit -m "docs: agregar guía de contribución al README"
git commit -m "chore: actualizar vite a v5.2"
git commit -m "refactor(api): extraer cliente HTTP a módulo separado"
git commit -m "style: aplicar formato con prettier"
git commit -m "test(auth): agregar tests para hook useAuth"
git commit -m "perf(images): convertir PNG a WebP, reducir tamaño 60%"

# ❌ Mensajes que no sirven
git commit -m "fix"
git commit -m "cambios"
git commit -m "WIP"
git commit -m "arreglé cosas"

# ─── Breaking change ───
git commit -m "feat(api)!: cambiar estructura de respuesta de /users

BREAKING CHANGE: El endpoint ahora devuelve { data: [], meta: {} }
en lugar de un array plano. Actualizar todos los clientes."

# ─── Filtrar historial por tipo ───
git log --oneline --grep "^feat"
git log --oneline --grep "^fix"

# ─── Configurar commitlint (opcional, equipo) ───
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky

# echo '{"extends": ["@commitlint/config-conventional"]}' > .commitlintrc.json
# npx husky init
# echo "npx commitlint --edit \$1" > .husky/commit-msg
# Ahora git rechaza commits que no sigan la convención`,
    },
    {
      id: 's7',
      title: 'Hito del curso: Pull Request real',
      content: `Es el momento de integrar todo lo que aprendiste en un flujo colaborativo real. Harás un Pull Request a un repositorio compartido de la clase, siguiendo el proceso profesional completo.

**El objetivo:**
Cada estudiante agrega su tarjeta de presentación al repositorio \`devnodo/students-wall\`, un muro colaborativo construido por toda la clase.

**Pasos del hito:**

**1. Fork y configuración:**
\`\`\`bash
# Fork en github.com → luego:
git clone https://github.com/TU-USUARIO/students-wall.git
cd students-wall
git remote add upstream https://github.com/devnodo/students-wall.git
\`\`\`

**2. Rama con tu nombre:**
\`\`\`bash
git checkout -b feature/tu-nombre
\`\`\`

**3. Agregar tu tarjeta:**
Crea el archivo \`students/tu-nombre.html\` con tu tarjeta de presentación (nombre, descripción, links). Reutiliza lo aprendido de HTML y CSS.

**4. Commit con Conventional Commits:**
\`\`\`bash
git add students/tu-nombre.html
git commit -m "feat(students): agregar tarjeta de [Tu Nombre]"
git push origin feature/tu-nombre
\`\`\`

**5. Abrir el PR con descripción completa:**
- Título: \`feat(students): agregar tarjeta de [Tu Nombre]\`
- Descripción: qué hace, screenshot de tu tarjeta, cualquier decisión de diseño.
- Asigna a un compañero como revisor.

**6. Revisar el PR de un compañero:**
- Haz checkout de su rama, prueba que se ve bien.
- Deja al menos un comentario constructivo.
- Aprueba o pide cambios.

**Criterios de evaluación:**
- Fork configurado con upstream.
- Rama nombrada \`feature/tu-nombre\`.
- Commit siguiendo Conventional Commits.
- PR con título y descripción completos.
- Screenshot de la tarjeta en el PR.
- Revisión del PR de un compañero.`,
      example: `# ─── Hito completo: de fork a PR mergeado ───

# ── PASO 1: Configuración ──
git clone https://github.com/TU-USUARIO/students-wall.git
cd students-wall
git remote add upstream https://github.com/devnodo/students-wall.git
git fetch upstream
git merge upstream/main         # sincronizar antes de empezar

# ── PASO 2: Tu rama ──
git checkout -b feature/ana-garcia

# ── PASO 3: Tu tarjeta ──
mkdir -p students
cat > students/ana-garcia.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ana García</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0d0d1a; color: #e0e0e0; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: #1a1a2e; border-radius: 16px; padding: 2rem; max-width: 360px; border: 1px solid #6c63ff; text-align: center; }
    .avatar { width: 80px; height: 80px; border-radius: 50%; background: #6c63ff; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    h1 { color: white; margin: 0 0 0.5rem; }
    p { color: #888; margin: 0 0 1rem; }
    .tags { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
    .tag { padding: 4px 12px; border-radius: 20px; background: rgba(108,99,255,0.2); color: #6c63ff; font-size: 0.8rem; }
    a { color: #6c63ff; text-decoration: none; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">👩‍💻</div>
    <h1>Ana García</h1>
    <p>Aprendiendo desarrollo web desde Bogotá 🇨🇴</p>
    <div class="tags">
      <span class="tag">HTML</span>
      <span class="tag">CSS</span>
      <span class="tag">JavaScript</span>
    </div>
    <br>
    <a href="https://github.com/ana-garcia">@ana-garcia en GitHub</a>
  </div>
</body>
</html>
EOF

# ── PASO 4: Commit ──
git add students/ana-garcia.html
git commit -m "feat(students): agregar tarjeta de Ana García"
git push origin feature/ana-garcia

# ── PASO 5: PR con GitHub CLI ──
gh pr create \\
  --title "feat(students): agregar tarjeta de Ana García" \\
  --body "## Descripción
Agrega mi tarjeta de presentación al muro de la clase.

## Screenshot
[Captura del diseño de la tarjeta]

## Notas de diseño
- Tema oscuro consistente con el resto de la app
- Tags con mis tecnologías actuales
- Link a mi perfil de GitHub" \\
  --reviewer compañero-asignado

# ── PASO 6: Revisar PR de un compañero ──
gh pr checkout 23            # número del PR de tu compañero
# Abrir students/su-nombre.html en el navegador
# Verificar que se ve bien, no hay errores
gh pr review 23 --approve \\
  --body "¡Tarjeta genial! El diseño es consistente y se ve muy bien.
Sugerencia para el futuro: podrías agregar un enlace a LinkedIn también."`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Conectar y sincronizar con remoto',
    description: 'Escribe los comandos para: (1) agregar un remoto llamado `origin` apuntando a `https://github.com/usuario/repo.git`, (2) subir la rama `main` al remoto por primera vez (con el flag que vincula las ramas), (3) bajar los últimos cambios del remoto y fusionarlos.',
    hint: 'Usa: git remote add origin URL, git push -u origin main, git pull. El flag -u en el push vincula la rama local con la remota para que los siguientes pushes sean solo "git push".',
    starterCode: `# Conectar repo local con GitHub y sincronizar

# 1. Agregar el remoto "origin"

# 2. Subir main por primera vez (vinculando la rama con -u)

# 3. Bajar y fusionar los cambios del remoto
`,
    validate(_output, code) {
      if (!/git\s+remote\s+add\s+origin/i.test(code))
        return { ok: false, message: 'Agrega el remoto con `git remote add origin URL`.' }
      if (!/git\s+push\s+-u\s+origin\s+main|git\s+push\s+--set-upstream\s+origin\s+main/i.test(code))
        return { ok: false, message: 'Usa `git push -u origin main` para el primer push (el flag -u vincula la rama).' }
      if (!/git\s+pull\b/i.test(code))
        return { ok: false, message: 'Usa `git pull` para bajar y fusionar los cambios del remoto.' }
      return { ok: true, message: '¡Conexión al remoto dominada! remote add → push -u → pull es el flujo de sincronización base.' }
    },
  },
  {
    id: 'ex2',
    title: 'Flujo de fork y contribución',
    description: 'Escribe los comandos completos del flujo de fork: (1) clonar TU fork desde `https://github.com/tuusuario/proyecto.git`, (2) agregar el repo original como remoto `upstream` con URL `https://github.com/autor/proyecto.git`, (3) crear y moverte a una rama `feature/mejora`, (4) subir esa rama a `origin`.',
    hint: 'git clone URL, git remote add upstream URL, git checkout -b feature/mejora, git push origin feature/mejora.',
    starterCode: `# Flujo completo de fork y contribución

# 1. Clonar tu fork (usa la URL de ejemplo del enunciado)

# 2. Agregar el repo original como "upstream"

# 3. Crear y moverte a la rama feature/mejora

# 4. Subir la rama a tu fork (origin)
`,
    validate(_output, code) {
      if (!/git\s+clone\s+https:\/\/github\.com\/tuusuario/i.test(code))
        return { ok: false, message: 'Clona TU fork con `git clone https://github.com/tuusuario/proyecto.git`.' }
      if (!/git\s+remote\s+add\s+upstream/i.test(code))
        return { ok: false, message: 'Añade el repo original como `upstream` con `git remote add upstream URL`.' }
      if (!/git\s+(checkout\s+-b|switch\s+-c)\s+feature\/mejora/i.test(code))
        return { ok: false, message: 'Crea la rama con `git checkout -b feature/mejora`.' }
      if (!/git\s+push\s+origin\s+feature\/mejora/i.test(code))
        return { ok: false, message: 'Sube la rama con `git push origin feature/mejora`.' }
      return { ok: true, message: '¡Flujo de fork completo! clone → upstream → rama → push es la base de toda contribución open source.' }
    },
  },
  {
    id: 'ex3',
    title: 'Escribir un mensaje de commit Conventional',
    description: 'Escribe tres commits siguiendo Conventional Commits: (1) un `feat` que agrega un componente de búsqueda en el scope `ui`, (2) un `fix` que corrige el cálculo del precio con descuento en el scope `cart`, (3) un `chore` que actualiza las dependencias sin scope.',
    hint: 'Formato: git commit -m "tipo(scope): descripción en minúsculas". Los tres tipos son feat, fix y chore. El scope va en paréntesis y es opcional en el chore.',
    starterCode: `# Escribe los tres commits con Conventional Commits

# 1. feat: nuevo componente de búsqueda (scope: ui)

# 2. fix: corrección del precio con descuento (scope: cart)

# 3. chore: actualizar dependencias (sin scope)
`,
    validate(_output, code) {
      if (!/git\s+commit\s+-m\s+["']feat\(ui\):/i.test(code))
        return { ok: false, message: 'El primer commit debe seguir el formato: `git commit -m "feat(ui): descripción"`.' }
      if (!/git\s+commit\s+-m\s+["']fix\(cart\):/i.test(code))
        return { ok: false, message: 'El segundo commit debe seguir el formato: `git commit -m "fix(cart): descripción"`.' }
      if (!/git\s+commit\s+-m\s+["']chore:/i.test(code))
        return { ok: false, message: 'El tercer commit debe ser: `git commit -m "chore: descripción"`.' }
      return { ok: true, message: '¡Conventional Commits aplicados! Un historial así habla por sí solo en cualquier equipo.' }
    },
  },
  {
    id: 'ex4',
    title: 'Commit que cierra un issue',
    description: 'Escribe un commit que: (1) sea de tipo `fix` con scope `auth`, (2) describa que se corrige el redirect después del login, (3) incluya en el cuerpo del mensaje la palabra clave para cerrar automáticamente el issue número `#15` de GitHub.',
    hint: 'Usa git commit -m con un mensaje multilínea, o escribe el tipo(scope): descripción en la primera línea y "Closes #15" en el cuerpo. En bash puedes usar comillas dobles con saltos de línea \\n o el flag -m dos veces.',
    starterCode: `# Commit que cierra automáticamente el issue #15

# El commit debe ser fix(auth) sobre el redirect post-login
# y debe cerrar el issue #15 de GitHub automáticamente
`,
    validate(_output, code) {
      if (!/git\s+commit/i.test(code))
        return { ok: false, message: 'Escribe el comando `git commit` con su mensaje.' }
      if (!/fix\(auth\):/i.test(code))
        return { ok: false, message: 'El tipo y scope deben ser `fix(auth):` exactamente.' }
      if (!/closes?\s+#15|fixes?\s+#15|resolves?\s+#15/i.test(code))
        return { ok: false, message: 'Incluye `Closes #15` (o Fixes/Resolves) en el mensaje para cerrar el issue automáticamente.' }
      return { ok: true, message: '¡Perfecto! Cuando este commit llegue a main vía PR, el issue #15 se cerrará automáticamente.' }
    },
  },
  {
    id: 'ex5',
    title: 'Hito: comandos del PR completo',
    description: 'Escribe la secuencia completa de comandos del hito del curso: (1) sincronizar tu fork con upstream antes de empezar, (2) crear la rama `feature/tu-nombre`, (3) agregar y commitear un archivo `students/tu-nombre.html` con mensaje Conventional Commits, (4) subir la rama a origin.',
    hint: 'Sincronizar: git fetch upstream + git merge upstream/main. Luego checkout -b, git add + commit con "feat(students): ...", y git push origin feature/tu-nombre.',
    starterCode: `# Secuencia completa del hito del curso

# 1. Sincronizar con el repo original (upstream) antes de empezar
#    (fetch + merge)

# 2. Crear la rama feature/tu-nombre

# 3. Agregar el archivo students/tu-nombre.html al staging

# 4. Commit siguiendo Conventional Commits
#    (tipo: feat, scope: students)

# 5. Subir la rama a tu fork (origin)
`,
    validate(_output, code) {
      if (!/git\s+fetch\s+upstream/i.test(code))
        return { ok: false, message: 'Sincroniza primero con `git fetch upstream`.' }
      if (!/git\s+merge\s+upstream\/main/i.test(code))
        return { ok: false, message: 'Fusiona los cambios del upstream con `git merge upstream/main`.' }
      if (!/git\s+(checkout\s+-b|switch\s+-c)\s+feature\//i.test(code))
        return { ok: false, message: 'Crea tu rama con `git checkout -b feature/tu-nombre`.' }
      if (!/git\s+add\b/i.test(code))
        return { ok: false, message: 'Agrega tu archivo al staging con `git add`.' }
      if (!/git\s+commit\s+-m\s+["']feat\(students\):/i.test(code))
        return { ok: false, message: 'El commit debe seguir el formato: `git commit -m "feat(students): agregar tarjeta de ..."`.' }
      if (!/git\s+push\s+origin\s+feature\//i.test(code))
        return { ok: false, message: 'Sube tu rama con `git push origin feature/tu-nombre`.' }
      return { ok: true, message: '¡Hito completado! Este es exactamente el flujo que usarás en tu primer trabajo como developer. 🚀' }
    },
  },
]
