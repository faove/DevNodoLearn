export const lesson = {
  id: 'lesson-13',
  title: 'Proyecto Final Laravel',
  subtitle: 'Lección 13 — Fase 4: PHP & Laravel',
  language: 'php',
  sections: [
    {
      id: 's1',
      title: 'Subida de archivos e imágenes (Storage)',
      content: `Laravel abstrae el sistema de archivos con el facade **Storage**. Puedes guardar en disco local, disco público o en la nube (S3, Cloudflare R2) cambiando solo la configuración.

**Discos disponibles (config/filesystems.php):**
\`\`\`
local    → storage/app/          (privado, no accesible desde la web)
public   → storage/app/public/   (público, enlazado a public/storage)
s3       → Amazon S3 / compatible
\`\`\`

**Enlace simbólico** — necesario para que el disco "public" sea accesible:
\`\`\`bash
php artisan storage:link
# crea: public/storage → storage/app/public
\`\`\`

**Subir un archivo en el controlador:**
\`\`\`php
// Verificar que viene un archivo
if ($request->hasFile('imagen') && $request->file('imagen')->isValid()) {
    // Guardar con nombre aleatorio — evita colisiones y traversal attacks
    $ruta = $request->file('imagen')->store('productos', 'public');
    // → storage/app/public/productos/uuid.jpg
    // → accesible en: /storage/productos/uuid.jpg
}
\`\`\`

**API de Storage:**
\`\`\`php
use Illuminate\\Support\\Facades\\Storage;

Storage::disk('public')->put('archivo.txt', 'contenido');
Storage::disk('public')->get('archivo.txt');
Storage::disk('public')->exists('imagen.jpg');
Storage::disk('public')->delete('imagen.jpg');
Storage::disk('public')->url('productos/foto.jpg');  // URL pública
Storage::disk('public')->size('foto.jpg');           // tamaño en bytes
Storage::disk('public')->files('productos/');        // listar archivos
\`\`\`

**URL pública de un archivo:**
\`\`\`php
// En el controlador
$url = Storage::disk('public')->url($producto->imagen);

// En Blade
<img src="{{ Storage::disk('public')->url($producto->imagen) }}" alt="...">
<img src="{{ asset('storage/' . $producto->imagen) }}" alt="...">
\`\`\`

**Actualizar imagen — borrar la anterior:**
\`\`\`php
if ($request->hasFile('imagen')) {
    // Borrar la imagen anterior antes de guardar la nueva
    if ($producto->imagen) {
        Storage::disk('public')->delete($producto->imagen);
    }
    $datos['imagen'] = $request->file('imagen')->store('productos', 'public');
}
\`\`\``,
      example: `<?php
// ─── app/Http/Controllers/ProductoController.php ───

namespace App\\Http\\Controllers;

use App\\Models\\Producto;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Support\\Facades\\Storage;
use Illuminate\\View\\View;

class ProductoController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validados = $request->validate([
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio'      => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'imagen'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Subir imagen si viene en el request
        if ($request->hasFile('imagen') && $request->file('imagen')->isValid()) {
            $validados['imagen'] = $request->file('imagen')
                ->store('productos', 'public');
        }

        $producto = Producto::create(array_merge($validados, [
            'user_id' => auth()->id(),
        ]));

        return redirect()
            ->route('productos.show', $producto)
            ->with('exito', 'Producto creado correctamente.');
    }

    public function update(Request $request, Producto $producto): RedirectResponse
    {
        $this->authorize('update', $producto);

        $validados = $request->validate([
            'nombre'  => 'required|string|max:255',
            'precio'  => 'required|numeric|min:0',
            'imagen'  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('imagen') && $request->file('imagen')->isValid()) {
            // Eliminar imagen anterior antes de guardar la nueva
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }
            $validados['imagen'] = $request->file('imagen')
                ->store('productos', 'public');
        }

        $producto->update($validados);

        return redirect()
            ->route('productos.show', $producto)
            ->with('exito', 'Producto actualizado.');
    }

    public function destroy(Producto $producto): RedirectResponse
    {
        $this->authorize('delete', $producto);

        // Eliminar imagen del disco antes de borrar el registro
        if ($producto->imagen) {
            Storage::disk('public')->delete($producto->imagen);
        }

        $producto->delete();

        return redirect()
            ->route('productos.index')
            ->with('exito', 'Producto eliminado.');
    }
}

// ─── En Blade — mostrar imagen con fallback ───
// <img
//     src="{{ $producto->imagen
//         ? asset('storage/' . $producto->imagen)
//         : asset('img/placeholder.png') }}"
//     alt="{{ $producto->nombre }}"
//     class="producto-imagen"
// >`,
    },
    {
      id: 's2',
      title: 'Paginación y búsqueda',
      content: `Laravel hace la paginación trivial. Con **\`paginate()\`** obtienes automáticamente los links, el conteo total y la integración con la URL.

**Paginación básica:**
\`\`\`php
// Controlador
$productos = Producto::latest()->paginate(12);
// →  $productos->currentPage(), ->lastPage(), ->total(), ->links()

// Mantiene otros parámetros de URL al paginar
$productos = Producto::paginate(12)->withQueryString();
\`\`\`

**Mostrar links en Blade:**
\`\`\`blade
{{ $productos->links() }}
{{-- genera los botones de paginación con Tailwind/Bootstrap --}}
\`\`\`

**Búsqueda con \`?buscar=texto\` en la URL:**
\`\`\`php
public function index(Request $request): View
{
    $query = Producto::query();

    if ($request->filled('buscar')) {
        $termino = $request->buscar;
        $query->where(function ($q) use ($termino) {
            $q->where('nombre', 'like', "%{$termino}%")
              ->orWhere('descripcion', 'like', "%{$termino}%");
        });
    }

    $productos = $query->latest()->paginate(12)->withQueryString();

    return view('productos.index', compact('productos'));
}
\`\`\`

**Formulario de búsqueda en Blade:**
\`\`\`blade
<form method="GET" action="{{ route('productos.index') }}">
    <input
        type="search"
        name="buscar"
        value="{{ request('buscar') }}"
        placeholder="Buscar productos..."
    >
    <button type="submit">Buscar</button>
    @if(request('buscar'))
        <a href="{{ route('productos.index') }}">Limpiar</a>
    @endif
</form>

{{-- Mostrar el término buscado y el total --}}
@if(request('buscar'))
    <p>{{ $productos->total() }} resultados para "{{ request('buscar') }}"</p>
@endif
\`\`\`

**Filtros combinados (búsqueda + categoría + precio):**
\`\`\`php
$query = Producto::query()->with('categoria');

if ($request->filled('buscar'))     $query->buscar($request->buscar);
if ($request->filled('categoria'))  $query->where('categoria_id', $request->categoria);
if ($request->filled('precio_max')) $query->where('precio', '<=', $request->precio_max);
if ($request->boolean('en_stock'))  $query->where('stock', '>', 0);

$productos = $query->latest()->paginate(12)->withQueryString();
\`\`\``,
      example: `<?php
// ─── app/Http/Controllers/ProductoController.php — index con filtros ───

namespace App\\Http\\Controllers;

use App\\Models\\{Producto, Categoria};
use Illuminate\\Http\\Request;
use Illuminate\\View\\View;

class ProductoController extends Controller
{
    public function index(Request $request): View
    {
        $query = Producto::with(['categoria', 'user:id,name'])
            ->where('activo', true);

        // ── Búsqueda por texto ──
        if ($request->filled('buscar')) {
            $t = $request->buscar;
            $query->where(function ($q) use ($t) {
                $q->where('nombre', 'like', "%{$t}%")
                  ->orWhere('descripcion', 'like', "%{$t}%");
            });
        }

        // ── Filtro por categoría ──
        if ($request->filled('categoria')) {
            $query->where('categoria_id', $request->categoria);
        }

        // ── Filtro por precio máximo ──
        if ($request->filled('precio_max') && is_numeric($request->precio_max)) {
            $query->where('precio', '<=', $request->precio_max);
        }

        // ── Solo en stock ──
        if ($request->boolean('en_stock')) {
            $query->where('stock', '>', 0);
        }

        // ── Ordenación ──
        match ($request->get('orden', 'reciente')) {
            'precio_asc'  => $query->orderBy('precio'),
            'precio_desc' => $query->orderByDesc('precio'),
            'nombre'      => $query->orderBy('nombre'),
            default       => $query->latest(),
        };

        $productos  = $query->paginate(12)->withQueryString();
        $categorias = Categoria::orderBy('nombre')->get();

        return view('productos.index', compact('productos', 'categorias'));
    }
}

// ─── resources/views/productos/index.blade.php ───

// @extends('layouts.app')
// @section('contenido')
//
// <form method="GET" action="{{ route('productos.index') }}" class="filtros">
//     <input type="search" name="buscar" value="{{ request('buscar') }}"
//            placeholder="Buscar...">
//
//     <select name="categoria">
//         <option value="">Todas las categorías</option>
//         @foreach($categorias as $cat)
//             <option value="{{ $cat->id }}"
//                 {{ request('categoria') == $cat->id ? 'selected' : '' }}>
//                 {{ $cat->nombre }}
//             </option>
//         @endforeach
//     </select>
//
//     <select name="orden">
//         <option value="reciente" {{ request('orden','reciente')=='reciente'?'selected':'' }}>Más recientes</option>
//         <option value="precio_asc" {{ request('orden')=='precio_asc'?'selected':'' }}>Precio: menor a mayor</option>
//         <option value="precio_desc" {{ request('orden')=='precio_desc'?'selected':'' }}>Precio: mayor a menor</option>
//     </select>
//
//     <label>
//         <input type="checkbox" name="en_stock" value="1"
//                {{ request('en_stock') ? 'checked' : '' }}>
//         Solo en stock
//     </label>
//
//     <button type="submit">Filtrar</button>
//     <a href="{{ route('productos.index') }}">Limpiar filtros</a>
// </form>
//
// <p class="resultados-info">
//     Mostrando {{ $productos->firstItem() }}–{{ $productos->lastItem() }}
//     de {{ $productos->total() }} productos
// </p>
//
// <div class="grid">
//     @forelse($productos as $producto)
//         @include('productos.partials.card', compact('producto'))
//     @empty
//         <p>No se encontraron productos con esos filtros.</p>
//     @endforelse
// </div>
//
// {{ $productos->links() }}
//
// @endsection`,
    },
    {
      id: 's3',
      title: 'Despliegue en producción',
      content: `Desplegar una app Laravel implica configurar el servidor, las variables de entorno y optimizar para producción.

**Opciones de despliegue (de más fácil a más control):**

| Plataforma | Pros | Contra |
|------------|------|--------|
| **Railway** | Git push = deploy automático, MySQL incluido | Free tier limitado |
| **Render** | Similar a Railway, buena DX | Cold starts en free |
| **Forge + VPS** | Control total, barato (DigitalOcean $6/mes) | Más configuración |
| **Shared hosting** | Barato | Muy limitado, sin Artisan fácil |

**Deploy en Railway (el más rápido):**
\`\`\`bash
# 1. Conectar repo de GitHub en railway.app
# 2. Añadir servicio MySQL
# 3. Configurar variables de entorno en el dashboard
# 4. Railway detecta PHP automáticamente con Nixpacks
\`\`\`

**Checklist de producción — ejecutar en el servidor:**
\`\`\`bash
composer install --no-dev --optimize-autoloader
npm run build                    # compilar assets

php artisan key:generate         # si es primera vez
php artisan migrate --force      # --force requerido en producción
php artisan db:seed --force      # datos iniciales si aplica

php artisan storage:link         # enlace para subida de archivos

# Optimizaciones de caché
php artisan config:cache         # cachear config/*.php
php artisan route:cache          # cachear routes/
php artisan view:cache           # pre-compilar vistas Blade
php artisan event:cache          # cachear eventos

# O todo de una vez:
php artisan optimize
\`\`\`

**Limpiar caché (cuando actualizas el código):**
\`\`\`bash
php artisan optimize:clear
\`\`\`

**Permisos de carpetas** (en Linux/VPS):
\`\`\`bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
\`\`\`

**Archivo \`Procfile\`** (Railway/Render):
\`\`\`
web: heroku-php-apache2 public/
\`\`\``,
      example: `<?php
// ─── Script de deploy automatizado (deploy.sh) ───

// #!/bin/bash
// set -e   # detener si cualquier comando falla
//
// echo "→ Actualizando código..."
// git pull origin main
//
// echo "→ Instalando dependencias PHP..."
// composer install --no-dev --optimize-autoloader
//
// echo "→ Compilando assets..."
// npm ci && npm run build
//
// echo "→ Ejecutando migraciones..."
// php artisan migrate --force
//
// echo "→ Enlace de storage..."
// php artisan storage:link
//
// echo "→ Limpiando caché anterior..."
// php artisan optimize:clear
//
// echo "→ Reconstruyendo caché de producción..."
// php artisan optimize
//
// echo "✓ Deploy completado."

// ─── Verificar configuración de producción ───

// php artisan about
// ┌──────────────────────────────────────────────────┐
// │ Environment                                      │
// ├──────────────────────────┬───────────────────────┤
// │ Application Name         │ Mi Tienda             │
// │ Laravel Version          │ 11.x                  │
// │ PHP Version              │ 8.3                   │
// │ Environment              │ production            │
// │ Debug Mode               │ OFF ✓                 │
// │ URL                      │ https://mitienda.com  │
// │ Maintenance Mode         │ OFF                   │
// ├──────────────────────────┴───────────────────────┤
// │ Cache                                            │
// ├──────────────────────────┬───────────────────────┤
// │ Config                   │ CACHED ✓              │
// │ Events                   │ CACHED ✓              │
// │ Routes                   │ CACHED ✓              │
// │ Views                    │ CACHED ✓              │
// └──────────────────────────┴───────────────────────┘

// ─── Modo mantenimiento (durante el deploy) ───
// php artisan down --secret="mi-token-secreto"
//   → La app muestra "En mantenimiento" a todos
//   → Excepto si accedes con: /mi-token-secreto
//
// php artisan up
//   → Vuelve a modo normal

// ─── railway.toml (config de Railway) ───
// [build]
// builder = "nixpacks"
//
// [deploy]
// startCommand = "php artisan migrate --force && php artisan optimize && heroku-php-apache2 public/"
// healthcheckPath = "/"
// healthcheckTimeout = 100
// restartPolicyType = "on_failure"`,
    },
    {
      id: 's4',
      title: 'Variables de entorno en producción',
      content: `En producción el \`.env\` **nunca va en git**. Cada plataforma tiene su propio sistema para inyectar variables de entorno de forma segura.

**Variables críticas que cambiar en producción:**
\`\`\`env
# ── Obligatorio cambiar ──
APP_ENV=production        # activa optimizaciones
APP_DEBUG=false           # NUNCA true en producción (expone stack traces)
APP_URL=https://tudominio.com
APP_KEY=base64:...        # php artisan key:generate

# ── Base de datos (Railway/Render las genera automáticamente) ──
DB_CONNECTION=mysql
DB_HOST=containers-us.railway.app
DB_PORT=6543
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=TuPasswordSegura

# ── Correo (Mailtrap para staging, SES/Mailgun en producción) ──
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@tudominio.com
MAIL_PASSWORD=TuApiKey
MAIL_FROM_ADDRESS=noreply@tudominio.com

# ── Sesiones y caché ──
SESSION_DRIVER=database   # mejor que "file" en múltiples instancias
CACHE_STORE=redis         # si tienes Redis disponible
QUEUE_CONNECTION=redis
\`\`\`

**Gestión de variables por plataforma:**

| Plataforma | Cómo configurar |
|------------|-----------------|
| **Railway** | Dashboard → Variables → Raw Editor |
| **Render** | Dashboard → Environment → Add Variable |
| **VPS/Forge** | Forge dashboard → Sites → Env |
| **GitHub Actions** | Settings → Secrets and Variables |

**\`.env.example\`** — siempre mantenerlo actualizado en el repo:
\`\`\`bash
# Al añadir una variable nueva al .env, añadirla también al .env.example
# con el valor vacío o de ejemplo:
NUEVA_API_KEY=           # sin valor real
OTRA_VAR=ejemplo-valor
\`\`\`

**Validar que las variables están configuradas** (config/app.php):
\`\`\`php
// Laravel lanzará un error claro si APP_KEY no está configurada
// Para variables personalizadas, valida en el servicio que las usa:
class PagoService
{
    public function __construct()
    {
        if (!config('servicios.stripe_key')) {
            throw new \\RuntimeException('STRIPE_KEY no configurada.');
        }
    }
}
\`\`\``,
      example: `<?php
// ─── config/servicios.php — variables personalizadas ───

return [
    'stripe' => [
        'key'    => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'cloudinary' => [
        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        'api_key'    => env('CLOUDINARY_API_KEY'),
        'api_secret' => env('CLOUDINARY_API_SECRET'),
    ],
];

// ─── .env.example (SÍ va en git, sin valores reales) ───
//
// APP_NAME="Mi Tienda"
// APP_ENV=local
// APP_KEY=
// APP_DEBUG=true
// APP_URL=http://localhost:8000
//
// DB_CONNECTION=mysql
// DB_HOST=127.0.0.1
// DB_PORT=3306
// DB_DATABASE=tienda_db
// DB_USERNAME=root
// DB_PASSWORD=
//
// MAIL_MAILER=log
// MAIL_FROM_ADDRESS="hello@example.com"
// MAIL_FROM_NAME="${APP_NAME}"
//
// STRIPE_KEY=
// STRIPE_SECRET=
// CLOUDINARY_CLOUD_NAME=
//
// ─── GitHub Actions — usar secrets en CI/CD ───
//
// # .github/workflows/deploy.yml
// name: Deploy to production
//
// on:
//   push:
//     branches: [main]
//
// jobs:
//   deploy:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//
//       - name: Deploy via SSH
//         uses: appleboy/ssh-action@v1
//         with:
//           host: \${{ secrets.SERVER_HOST }}
//           username: \${{ secrets.SERVER_USER }}
//           key: \${{ secrets.SERVER_SSH_KEY }}
//           script: |
//             cd /var/www/tienda
//             git pull origin main
//             composer install --no-dev --optimize-autoloader
//             php artisan migrate --force
//             php artisan optimize

// ─── Diferencias clave local vs producción ───
//
// LOCAL                    PRODUCCIÓN
// APP_DEBUG=true           APP_DEBUG=false
// APP_ENV=local            APP_ENV=production
// MAIL_MAILER=log          MAIL_MAILER=smtp
// CACHE_STORE=file         CACHE_STORE=redis
// QUEUE_CONNECTION=sync    QUEUE_CONNECTION=redis
// DB_HOST=127.0.0.1        DB_HOST=<host-producción>`,
    },
    {
      id: 's5',
      title: 'Trabajo en ramas y PRs en equipo',
      content: `En un equipo, nunca se trabaja directamente en \`main\`. Cada funcionalidad vive en su propia rama hasta ser revisada y aprobada.

**Flujo de trabajo estándar (GitHub Flow):**
\`\`\`bash
# 1. Partir siempre desde main actualizado
git checkout main
git pull origin main

# 2. Crear rama descriptiva para tu tarea
git checkout -b feature/subida-imagenes-productos
# o: fix/error-paginacion, chore/actualizar-deps

# 3. Desarrollar en commits pequeños y descriptivos
git add app/Http/Controllers/ProductoController.php
git commit -m "feat(productos): añadir subida de imagen con Storage"

git add resources/views/productos/
git commit -m "feat(productos): vista de formulario con preview de imagen"

# 4. Subir la rama al remoto
git push -u origin feature/subida-imagenes-productos

# 5. Abrir Pull Request en GitHub
# Título: feat(productos): subida y gestión de imágenes
# Description: qué hace, cómo probarlo, capturas si hay UI

# 6. Revisar el PR del compañero
# 7. Hacer merge a main cuando esté aprobado
# 8. Borrar la rama (GitHub lo hace automáticamente si está configurado)
git branch -d feature/subida-imagenes-productos
\`\`\`

**Convención de nombres de rama:**
\`\`\`
feature/nombre-descriptivo    nueva funcionalidad
fix/descripcion-del-bug       corrección de bug
hotfix/bug-critico            fix urgente directo a producción
chore/descripcion             mantenimiento, deps, config
refactor/lo-que-se-refactoriza
\`\`\`

**Resolver conflictos de merge:**
\`\`\`bash
# Si hay conflictos al mergear
git checkout main
git pull origin main
git checkout feature/mi-rama
git merge main               # traer cambios de main a tu rama

# Resolver conflictos en los archivos marcados con <<<<<<
# Luego:
git add .
git commit -m "merge: resolver conflictos con main"
git push origin feature/mi-rama
\`\`\`

**Buenas prácticas en PRs:**
- Título sigue Conventional Commits: \`feat(scope): descripción\`
- Descripción explica el **por qué**, no solo el **qué**
- Máximo 400 líneas cambiadas — si es más, dividir en PRs más pequeños
- Incluir capturas de pantalla si cambia la UI
- Añadir \`Closes #123\` para cerrar el Issue automáticamente al mergear`,
      example: `# ─── Flujo completo de trabajo en equipo ───

# === DESARROLLADOR A: nueva feature ===

# Crear rama desde main actualizado
# git checkout main && git pull origin main
# git checkout -b feature/carrito-compras

# Desarrollo con commits atómicos
# git add app/Models/Carrito.php
# git commit -m "feat(carrito): modelo Carrito con relaciones"
#
# git add app/Http/Controllers/CarritoController.php
# git commit -m "feat(carrito): controller con add/remove/clear"
#
# git add resources/views/carrito/
# git commit -m "feat(carrito): vistas de carrito con actualización de cantidad"
#
# git add database/migrations/*carrito*
# git commit -m "feat(carrito): migración tabla carrito_items"

# Subir y abrir PR
# git push -u origin feature/carrito-compras
# gh pr create --title "feat(carrito): implementar carrito de compras" \
#              --body "Closes #45\n\n## Qué incluye\n- Modelo CarritoItem\n- CRUD en sesión\n- Vista con JS para actualizar cantidades sin recargar"

# === DESARROLLADOR B: code review ===

# gh pr checkout 12          # cambiar a la rama del PR
# Revisar código, probar en local, añadir comentarios en GitHub
# gh pr review 12 --approve  # o --request-changes

# === MERGE (cuando está aprobado) ===

# En GitHub: "Merge pull request" → "Squash and merge"
# (squash agrupa todos los commits en uno solo — historial limpio)

# === DESPUÉS DEL MERGE ===

# Volver a main y limpiar
# git checkout main
# git pull origin main
# git branch -d feature/carrito-compras  # borrar rama local

# ─── .github/pull_request_template.md ───
# (plantilla automática para todos los PRs del repo)

# ## ¿Qué hace este PR?
# <!-- Descripción breve del cambio -->
#
# ## Tipo de cambio
# - [ ] feat: nueva funcionalidad
# - [ ] fix: corrección de bug
# - [ ] refactor: sin cambio funcional
# - [ ] chore: mantenimiento
#
# ## Cómo probar
# 1. ...
# 2. ...
#
# ## Capturas (si hay cambios en UI)
#
# ## Issues relacionados
# Closes #`,
    },
    {
      id: 's6',
      title: '🏆 Proyecto de Fase: Tienda Online',
      content: `El proyecto final integra todo lo aprendido en la Fase 4. Construirás una tienda online funcional y la desplegarás en producción.

**Lo que construirás:**

\`\`\`
Tienda Online
├── Autenticación (Breeze)
│   ├── Registro / Login / Logout
│   └── Perfil de usuario
├── Catálogo de productos
│   ├── Listado con búsqueda y filtros
│   ├── Paginación
│   ├── Detalle del producto
│   └── Imágenes subidas a Storage
├── Gestión de productos (rol admin)
│   ├── CRUD completo con imágenes
│   └── Panel de administración
├── Comentarios / Reseñas
│   ├── Crear (usuarios autenticados)
│   ├── Aprobar/eliminar (admin)
│   └── Validación y flash messages
├── Roles y permisos
│   ├── admin: gestiona todo
│   └── usuario: solo comenta y navega
└── Deploy en Railway o Render
\`\`\`

**Arquitectura de la base de datos:**
\`\`\`sql
users          (id, name, email, password, role, timestamps)
categorias     (id, nombre, slug, timestamps)
productos      (id, user_id, categoria_id, nombre, slug, descripcion,
                precio, stock, imagen, activo, timestamps)
comentarios    (id, user_id, producto_id, contenido, aprobado, timestamps)
\`\`\`

**Milestones del proyecto (orden sugerido):**

**Milestone 1 — Base (lección 10-11)**
- [ ] Crear proyecto Laravel e instalar Breeze
- [ ] Diseñar y ejecutar migraciones
- [ ] Modelos con relaciones y factories
- [ ] Seeder con datos de prueba

**Milestone 2 — CRUD de productos (lección 11-12)**
- [ ] Resource controller para productos
- [ ] Subida de imágenes con Storage
- [ ] Validación con Form Request
- [ ] Búsqueda + filtros + paginación

**Milestone 3 — Comentarios y roles (lección 12)**
- [ ] CRUD de comentarios (solo usuarios autenticados)
- [ ] Gate/Policy: solo el autor o admin puede borrar
- [ ] Panel admin: aprobar/rechazar comentarios
- [ ] Flash messages en toda la app

**Milestone 4 — Deploy (lección 13)**
- [ ] Rama \`main\` protegida, trabajar en feature branches
- [ ] \`.env\` de producción configurado en Railway/Render
- [ ] \`php artisan optimize\` y \`storage:link\` en deploy
- [ ] App funcional en URL pública — ¡demo en vivo!

**Criterios de evaluación:**
- La app funciona en producción con URL pública
- Los roles admin/usuario están correctamente separados
- El código está en GitHub con historial de commits limpio
- Hay al menos 3 PRs mergeados con código revisado
- Las imágenes se suben y se muestran correctamente
- La búsqueda y paginación funcionan`,
      example: `<?php
// ─── Checklist técnico del proyecto ───

// MODELOS NECESARIOS
// php artisan make:model Categoria -mf
// php artisan make:model Producto -mfc
// php artisan make:model Comentario -mf

// CONTROLADORES
// php artisan make:controller ProductoController --resource --model=Producto
// php artisan make:controller ComentarioController --resource --model=Comentario
// php artisan make:controller Admin/ProductoController --resource

// POLICIES
// php artisan make:policy ProductoPolicy --model=Producto
// php artisan make:policy ComentarioPolicy --model=Comentario

// FORM REQUESTS
// php artisan make:request StoreProductoRequest
// php artisan make:request UpdateProductoRequest
// php artisan make:request StoreComentarioRequest

// ─── routes/web.php — estructura de rutas ───

// Route::get('/', [ProductoController::class, 'index'])->name('home');
// Route::resource('productos', ProductoController::class)->only(['index', 'show']);
//
// Route::middleware('auth')->group(function () {
//     Route::resource('productos.comentarios', ComentarioController::class)
//          ->only(['store', 'destroy']);
// });
//
// Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
//     Route::resource('productos', Admin\\ProductoController::class);
//     Route::patch('comentarios/{comentario}/aprobar', [Admin\\ComentarioController::class, 'aprobar'])
//          ->name('comentarios.aprobar');
// });

// ─── Seeder con datos realistas ───

// class DatabaseSeeder extends Seeder
// {
//     public function run(): void
//     {
//         // Admin
//         User::factory()->create(['email' => 'admin@tienda.test', 'role' => 'admin']);
//
//         // Categorías
//         $cats = Categoria::factory()->createMany([
//             ['nombre' => 'Electrónica', 'slug' => 'electronica'],
//             ['nombre' => 'Ropa',        'slug' => 'ropa'],
//             ['nombre' => 'Hogar',       'slug' => 'hogar'],
//         ]);
//
//         // 20 usuarios + productos + comentarios
//         User::factory(20)->create()->each(function (User $user) use ($cats) {
//             Producto::factory(rand(2, 5))
//                 ->for($user)
//                 ->for($cats->random())
//                 ->has(Comentario::factory(rand(0, 8))->aprobado())
//                 ->create();
//         });
//     }
// }`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Subir imagen con Storage',
    description: 'Escribe el método `store()` de un `ProductoController` que: (1) valide `nombre` requerido string, `precio` requerido numeric min:0, `imagen` nullable image max:2048, (2) si `$request->hasFile("imagen")` es verdadero y el archivo es válido, guarde el archivo con `->store("productos", "public")` asignando la ruta a `$datos["imagen"]`, (3) cree el producto con `Producto::create()` incluyendo `user_id` de `auth()->id()`, (4) redirija a `route("productos.show", $producto)` con flash `"exito"`.',
    hint: '$request->validate([...]). if ($request->hasFile("imagen") && $request->file("imagen")->isValid()) { $datos["imagen"] = $request->file("imagen")->store("productos", "public"); }. Producto::create(array_merge($datos, ["user_id" => auth()->id()])). redirect()->route("productos.show", $producto)->with("exito", ...).',
    starterCode: `<?php
// app/Http/Controllers/ProductoController.php

namespace App\\Http\\Controllers;

use App\\Models\\Producto;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\RedirectResponse;

class ProductoController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        // 1. Validar: nombre (required|string), precio (required|numeric|min:0),
        //             imagen (nullable|image|max:2048)

        // 2. Si viene imagen válida, guardarla con store("productos", "public")

        // 3. Crear el producto con Producto::create()
        //    incluyendo user_id de auth()->id()

        // 4. Redirigir a productos.show con flash "exito"
    }
}
`,
    validate(_output, code) {
      if (!/\$request->validate\s*\(/i.test(code))
        return { ok: false, message: 'Usa `$request->validate([...])` para validar los datos del formulario.' }
      if (!/'nombre'\s*=>\s*['"]required/.test(code) && !/"nombre"\s*=>\s*['"]required/.test(code))
        return { ok: false, message: 'Incluye la regla `"nombre" => "required|string"` en la validación.' }
      if (!/'precio'\s*=>\s*['"]required/.test(code) && !/"precio"\s*=>\s*['"]required/.test(code))
        return { ok: false, message: 'Incluye la regla `"precio" => "required|numeric|min:0"` en la validación.' }
      if (!/min:0/i.test(code))
        return { ok: false, message: 'El precio necesita `min:0` — un producto no puede tener precio negativo.' }
      if (!/\$request->hasFile\s*\(\s*['"]imagen['"]\s*\)/i.test(code))
        return { ok: false, message: 'Comprueba si viene archivo con `$request->hasFile("imagen")`.' }
      if (!/->isValid\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Verifica que el archivo sea válido con `->isValid()` antes de guardarlo.' }
      if (!/->store\s*\(\s*['"]productos['"]\s*,\s*['"]public['"]\s*\)/i.test(code))
        return { ok: false, message: 'Guarda la imagen con `->store("productos", "public")` para que sea accesible públicamente.' }
      if (!/Producto::create\s*\(/i.test(code))
        return { ok: false, message: 'Crea el producto con `Producto::create([...])`.' }
      if (!/auth\s*\(\s*\)->id\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Incluye `"user_id" => auth()->id()` para registrar quién creó el producto.' }
      if (!/redirect\s*\(\s*\)->route\s*\(\s*['"]productos\.show['"]/i.test(code))
        return { ok: false, message: 'Redirige a `route("productos.show", $producto)` después de crear.' }
      if (!/->with\s*\(\s*['"]exito['"]/i.test(code))
        return { ok: false, message: 'Añade el mensaje flash `->with("exito", "...")` en el redirect.' }
      return { ok: true, message: '¡Subida de imagen completa! hasFile + isValid + store("disco") + Producto::create — el flujo estándar para manejar archivos en Laravel de forma segura.' }
    },
  },
  {
    id: 'ex2',
    title: 'Controlador con búsqueda y paginación',
    description: 'Escribe el método `index(Request $request)` de `ProductoController` que: (1) inicie una query con `Producto::query()`, (2) si `$request->filled("buscar")` es verdadero, aplique `where("nombre", "like", "%{$t}%")` siendo `$t` el valor de `$request->buscar`, (3) pagine con `paginate(12)` encadenando `->withQueryString()`, (4) retorne la vista `"productos.index"` pasando la variable `$productos`.',
    hint: '$query = Producto::query(). if ($request->filled("buscar")) { $t = $request->buscar; $query->where("nombre", "like", "%{$t}%"); }. $productos = $query->paginate(12)->withQueryString(). return view("productos.index", compact("productos")).',
    starterCode: `<?php
// app/Http/Controllers/ProductoController.php

namespace App\\Http\\Controllers;

use App\\Models\\Producto;
use Illuminate\\Http\\Request;
use Illuminate\\View\\View;

class ProductoController extends Controller
{
    public function index(Request $request): View
    {
        // 1. Iniciar query con Producto::query()

        // 2. Si hay búsqueda (request->filled), filtrar por nombre con LIKE

        // 3. Paginar de 12 en 12 con withQueryString()

        // 4. Retornar vista "productos.index" con $productos
    }
}
`,
    validate(_output, code) {
      if (!/Producto::query\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Inicia la query con `Producto::query()` para poder añadir condiciones de forma opcional.' }
      if (!/\$request->filled\s*\(\s*['"]buscar['"]\s*\)/i.test(code))
        return { ok: false, message: 'Usa `$request->filled("buscar")` para comprobar si hay término de búsqueda — `filled()` es mejor que `isset()` porque también descarta strings vacíos.' }
      if (!/like/i.test(code))
        return { ok: false, message: 'Usa `where("nombre", "like", "%{$t}%")` para búsqueda parcial por nombre.' }
      if (!/%.*\$.*%/.test(code))
        return { ok: false, message: 'El patrón LIKE necesita los `%` antes y después del término: `"%{$t}%"`.' }
      if (!/->paginate\s*\(\s*12\s*\)/i.test(code))
        return { ok: false, message: 'Pagina los resultados con `->paginate(12)`.' }
      if (!/->withQueryString\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Encadena `->withQueryString()` para que los links de paginación preserven el parámetro `?buscar=...`.' }
      if (!/return\s+view\s*\(\s*['"]productos\.index['"]/i.test(code))
        return { ok: false, message: 'Retorna `view("productos.index", compact("productos"))`.' }
      if (!/compact\s*\(\s*['"]productos['"]\s*\)/i.test(code) && !/\[\s*['"]productos['"]\s*=>\s*\$productos\s*\]/i.test(code))
        return { ok: false, message: 'Pasa la variable `$productos` a la vista con `compact("productos")`.' }
      return { ok: true, message: '¡Búsqueda y paginación correctas! Producto::query() + filled() + paginate()->withQueryString() — los links de página incluirán automáticamente ?buscar=texto.' }
    },
  },
  {
    id: 'ex3',
    title: 'Eliminar imagen al actualizar',
    description: 'Escribe el método `update()` de `ProductoController` que recibe `Request $request` y `Producto $producto`. Debe: (1) llamar a `$this->authorize("update", $producto)`, (2) validar `nombre` requerido string y `imagen` nullable image max:2048, (3) si viene nueva imagen válida: primero eliminar la anterior con `Storage::disk("public")->delete($producto->imagen)` si existe, luego guardar la nueva con `->store("productos", "public")`, (4) actualizar el producto y redirigir.',
    hint: '$this->authorize("update", $producto). Si viene imagen: Storage::disk("public")->delete($producto->imagen) antes de guardar la nueva. $validados["imagen"] = $request->file("imagen")->store("productos", "public"). $producto->update($validados).',
    starterCode: `<?php
// app/Http/Controllers/ProductoController.php

use Illuminate\\Support\\Facades\\Storage;

class ProductoController extends Controller
{
    public function update(Request $request, Producto $producto): \\Illuminate\\Http\\RedirectResponse
    {
        // 1. Autorizar con Policy: $this->authorize("update", $producto)

        // 2. Validar: nombre (required|string), imagen (nullable|image|max:2048)

        // 3. Si viene imagen nueva:
        //    a) Eliminar la imagen anterior con Storage si existe
        //    b) Guardar la nueva imagen

        // 4. Actualizar $producto con $validados

        // 5. Redirigir a productos.show con flash "exito"
    }
}
`,
    validate(_output, code) {
      if (!/\$this->authorize\s*\(\s*['"]update['"]\s*,\s*\$producto\s*\)/i.test(code))
        return { ok: false, message: 'Llama a `$this->authorize("update", $producto)` al inicio del método para verificar la Policy.' }
      if (!/\$request->validate\s*\(/i.test(code))
        return { ok: false, message: 'Valida los datos con `$request->validate([...])`.' }
      if (!/'nombre'\s*=>\s*['"]required/.test(code) && !/"nombre"\s*=>\s*['"]required/.test(code))
        return { ok: false, message: 'Incluye la regla `"nombre" => "required|string"` en la validación.' }
      if (!/\$request->hasFile\s*\(\s*['"]imagen['"]\s*\)/i.test(code))
        return { ok: false, message: 'Comprueba si viene imagen nueva con `$request->hasFile("imagen")`.' }
      if (!/Storage::disk\s*\(\s*['"]public['"]\s*\)->delete\s*\(/i.test(code))
        return { ok: false, message: 'Elimina la imagen anterior con `Storage::disk("public")->delete($producto->imagen)` antes de guardar la nueva — sin esto acumulas archivos huérfanos.' }
      if (!/\$producto->imagen/i.test(code))
        return { ok: false, message: 'Verifica que `$producto->imagen` existe antes de intentar borrarla.' }
      if (!/->store\s*\(\s*['"]productos['"]\s*,\s*['"]public['"]\s*\)/i.test(code))
        return { ok: false, message: 'Guarda la nueva imagen con `->store("productos", "public")`.' }
      if (!/\$producto->update\s*\(/i.test(code))
        return { ok: false, message: 'Actualiza el producto con `$producto->update($validados)`.' }
      if (!/redirect\s*\(\s*\)->route\s*\(\s*['"]productos\.show['"]/i.test(code))
        return { ok: false, message: 'Redirige a `route("productos.show", $producto)` tras la actualización.' }
      return { ok: true, message: '¡Actualización con Storage correcta! authorize + validate + delete anterior + store nueva + update — nunca acumules archivos huérfanos en tu disco de producción.' }
    },
  },
  {
    id: 'ex4',
    title: 'Variables de entorno de producción',
    description: 'Escribe un bloque `.env` de producción con exactamente estas variables y valores: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://mitienda.railway.app`, `DB_CONNECTION=mysql`, `SESSION_DRIVER=database`. Luego escribe el comando artisan para cachear toda la configuración (`optimize`) y el comando para generar el enlace simbólico de Storage (`storage:link`).',
    hint: 'APP_ENV=production, APP_DEBUG=false, SESSION_DRIVER=database. php artisan optimize. php artisan storage:link.',
    starterCode: `<?php
// Escribe el bloque .env de producción y los comandos artisan
// como comentarios PHP (// VARIABLE=valor)

// ─── 1. Variables .env para producción ───
// (APP_ENV, APP_DEBUG, APP_URL, DB_CONNECTION, SESSION_DRIVER)

// ─── 2. Comando para cachear toda la configuración en producción ───
// (php artisan ...)

// ─── 3. Comando para crear el enlace simbólico de Storage ───
// (php artisan ...)
`,
    validate(_output, code) {
      if (!/APP_ENV\s*=\s*production/i.test(code))
        return { ok: false, message: 'Define `APP_ENV=production` — activa optimizaciones de Laravel en producción.' }
      if (!/APP_DEBUG\s*=\s*false/i.test(code))
        return { ok: false, message: 'Define `APP_DEBUG=false` — con `true` en producción expones stack traces con rutas, variables y config sensible.' }
      if (!/APP_URL\s*=\s*https:\/\//i.test(code))
        return { ok: false, message: 'Define `APP_URL=https://...` con HTTPS — necesario para que los helpers url() y asset() generen URLs correctas.' }
      if (!/DB_CONNECTION\s*=\s*mysql/i.test(code))
        return { ok: false, message: 'Define `DB_CONNECTION=mysql` para la base de datos de producción.' }
      if (!/SESSION_DRIVER\s*=\s*database/i.test(code))
        return { ok: false, message: 'Define `SESSION_DRIVER=database` — el driver `file` no funciona bien en plataformas cloud con múltiples instancias.' }
      if (!/artisan\s+optimize(?!:clear)/i.test(code))
        return { ok: false, message: 'Incluye `php artisan optimize` para cachear config, rutas y vistas en un solo comando.' }
      if (!/artisan\s+storage:link/i.test(code))
        return { ok: false, message: 'Incluye `php artisan storage:link` para crear el enlace simbólico que hace accesibles los archivos subidos.' }
      return { ok: true, message: '¡Configuración de producción correcta! APP_DEBUG=false + APP_ENV=production + SESSION_DRIVER=database + optimize + storage:link — el checklist mínimo antes de poner una app Laravel en producción.' }
    },
  },
  {
    id: 'ex5',
    title: 'Flujo completo de rama y PR',
    description: 'Escribe la secuencia de comandos git para: (1) actualizar main con `git pull origin main`, (2) crear una rama `feature/comentarios-productos`, (3) hacer dos commits con mensajes en Conventional Commits: primero `"feat(comentarios): modelo y migración"`, luego `"feat(comentarios): controller y vistas"`, (4) subir la rama con `git push -u origin feature/comentarios-productos`, (5) crear el PR con `gh pr create` con título `"feat(comentarios): sistema de reseñas de productos"` y body que incluya `"Closes #7"`.',
    hint: 'git checkout main && git pull origin main. git checkout -b feature/comentarios-productos. git commit -m "feat(comentarios): ...". git push -u origin feature/comentarios-productos. gh pr create --title "..." --body "Closes #7".',
    starterCode: `# Escribe los comandos git/gh para el flujo completo de feature branch

# 1. Actualizar main desde el remoto

# 2. Crear la rama feature/comentarios-productos

# 3. Primer commit: "feat(comentarios): modelo y migración"

# 4. Segundo commit: "feat(comentarios): controller y vistas"

# 5. Subir la rama al remoto con tracking (-u)

# 6. Crear PR con gh pr create
#    título: "feat(comentarios): sistema de reseñas de productos"
#    body debe incluir "Closes #7"
`,
    validate(_output, code) {
      if (!/git\s+pull\s+origin\s+main/i.test(code))
        return { ok: false, message: 'Empieza con `git pull origin main` para tener el código más reciente antes de ramificar.' }
      if (!/git\s+checkout\s+-b\s+feature\/comentarios-productos/i.test(code))
        return { ok: false, message: 'Crea la rama con `git checkout -b feature/comentarios-productos`.' }
      if (!/git\s+commit\s+-m\s+["']feat\(comentarios\):\s+modelo\s+y\s+migraci/i.test(code))
        return { ok: false, message: 'Haz el primer commit con mensaje `"feat(comentarios): modelo y migración"` siguiendo Conventional Commits.' }
      if (!/git\s+commit\s+-m\s+["']feat\(comentarios\):\s+controller\s+y\s+vistas/i.test(code))
        return { ok: false, message: 'Haz el segundo commit con mensaje `"feat(comentarios): controller y vistas"`.' }
      if (!/git\s+push\s+-u\s+origin\s+feature\/comentarios-productos/i.test(code))
        return { ok: false, message: 'Sube la rama con `git push -u origin feature/comentarios-productos` — el flag `-u` configura el tracking para futuros `git push`.' }
      if (!/gh\s+pr\s+create/i.test(code))
        return { ok: false, message: 'Crea el Pull Request con `gh pr create --title "..." --body "..."`.' }
      if (!/feat\(comentarios\):\s+sistema\s+de\s+rese[ñn]as/i.test(code))
        return { ok: false, message: 'El título del PR debe ser `"feat(comentarios): sistema de reseñas de productos"` — sigue Conventional Commits.' }
      if (!/Closes\s+#7/i.test(code))
        return { ok: false, message: 'El body del PR debe incluir `"Closes #7"` para cerrar el Issue automáticamente cuando se mergee.' }
      return { ok: true, message: '¡Flujo de trabajo en equipo completo! pull main → branch → commits atómicos → push → PR con Closes #issue — así se trabaja en cualquier equipo profesional.' }
    },
  },
]
