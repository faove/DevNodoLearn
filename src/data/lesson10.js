export const lesson = {
  id: 'lesson-10',
  title: 'Laravel: MVC, Rutas y Blade',
  subtitle: 'Lección 10 — Fase 4: PHP & Laravel',
  language: 'php',
  sections: [
    {
      id: 's1',
      title: 'Instalación con Composer y estructura de directorios',
      content: `**Laravel** es el framework PHP más popular. Usa el patrón **MVC** (Model-View-Controller) y proporciona herramientas que hacen lo que construiste en PHP puro de forma elegante y segura.

**Crear un proyecto:**
\`\`\`bash
composer create-project laravel/laravel mi-app
cd mi-app
php artisan serve      # servidor de desarrollo en http://localhost:8000
\`\`\`

**Estructura de directorios clave:**
\`\`\`
mi-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/   ← tus controladores
│   │   └── Middleware/
│   └── Models/            ← modelos Eloquent
├── config/                ← archivos de configuración
├── database/
│   ├── migrations/        ← definición del schema SQL
│   └── seeders/           ← datos de prueba
├── public/                ← único directorio público (index.php, assets)
├── resources/
│   └── views/             ← vistas Blade (.blade.php)
├── routes/
│   ├── web.php            ← rutas de la aplicación web
│   └── api.php            ← rutas de la API
├── storage/               ← logs, caché, archivos subidos
├── .env                   ← configuración del entorno (no en git)
└── artisan                ← CLI de Laravel
\`\`\`

**Artisan** — la CLI de Laravel. Es tu mejor herramienta:
\`\`\`bash
php artisan list                    # ver todos los comandos
php artisan make:controller Nombre  # crear controlador
php artisan make:model Nombre       # crear modelo
php artisan make:migration nombre   # crear migración
php artisan migrate                 # ejecutar migraciones
php artisan tinker                  # REPL interactivo
php artisan route:list              # ver todas las rutas
\`\`\``,
      example: `<?php
// ─── Flujo de instalación y primer arranque ───

// En la terminal:
// composer create-project laravel/laravel blog
// cd blog
// cp .env.example .env
// php artisan key:generate
// php artisan serve

// ─── app/Http/Controllers/WelcomeController.php ───
// (generado con: php artisan make:controller WelcomeController)

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class WelcomeController extends Controller
{
    public function index(): \\Illuminate\\View\\View
    {
        $datos = [
            'titulo'   => 'Bienvenido a Laravel',
            'version'  => app()->version(),
            'entorno'  => config('app.env'),
        ];

        // Retorna resources/views/welcome.blade.php
        return view('welcome', $datos);
    }
}

// ─── routes/web.php ───
use App\\Http\\Controllers\\WelcomeController;

Route::get('/', [WelcomeController::class, 'index'])
    ->name('welcome');

// ─── resources/views/welcome.blade.php ───
// <h1>{{ $titulo }}</h1>
// <p>Laravel v{{ $version }} — Entorno: {{ $entorno }}</p>

// ─── Verificar que todo funciona ───
// php artisan route:list
//
// GET  /  App\\Http\\Controllers\\WelcomeController@index  welcome`,
    },
    {
      id: 's2',
      title: 'Rutas: web.php, Route::get/post/resource',
      content: `Las **rutas** en Laravel definen cómo responde la aplicación a cada URL. Se configuran en \`routes/web.php\` para vistas y en \`routes/api.php\` para APIs.

**Tipos de rutas:**
\`\`\`php
// Closure directa (solo para prototipos rápidos)
Route::get('/hola', fn() => 'Hola, mundo');

// Apuntando a un controlador
Route::get('/tareas', [TareaController::class, 'index']);
Route::post('/tareas', [TareaController::class, 'store']);

// Rutas con parámetros
Route::get('/tareas/{id}', [TareaController::class, 'show']);
Route::get('/usuarios/{user?}', fn($user = 'anón') => $user);

// Restricción con where
Route::get('/tareas/{id}', ...)->where('id', '[0-9]+');
\`\`\`

**Route::resource** — registra las 7 rutas RESTful de una vez:
\`\`\`php
Route::resource('tareas', TareaController::class);
\`\`\`
| Verbo | URI | Acción | Nombre |
|-------|-----|--------|--------|
| GET | /tareas | index | tareas.index |
| GET | /tareas/create | create | tareas.create |
| POST | /tareas | store | tareas.store |
| GET | /tareas/{id} | show | tareas.show |
| GET | /tareas/{id}/edit | edit | tareas.edit |
| PUT/PATCH | /tareas/{id} | update | tareas.update |
| DELETE | /tareas/{id} | destroy | tareas.destroy |

**Rutas nombradas** — generan URLs automáticamente:
\`\`\`php
Route::get('/tareas', [TareaController::class, 'index'])->name('tareas.index');

// En un controlador o vista:
route('tareas.index')         // → /tareas
route('tareas.show', ['id' => 5])  // → /tareas/5
\`\`\`

**Grupos de rutas:**
\`\`\`php
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::resource('usuarios', UsuarioController::class);
    Route::resource('posts', PostController::class);
});
\`\`\``,
      example: `<?php
// ─── routes/web.php completo ───

use App\\Http\\Controllers\\TareaController;
use App\\Http\\Controllers\\HomeController;
use Illuminate\\Support\\Facades\\Route;

// ── Página principal ──
Route::get('/', [HomeController::class, 'index'])->name('home');

// ── CRUD completo con resource (7 rutas de una vez) ──
Route::resource('tareas', TareaController::class);

// ── Ruta con parámetro y restricción de tipo ──
Route::get('/tareas/{id}/completar', [TareaController::class, 'completar'])
    ->where('id', '[0-9]+')
    ->name('tareas.completar');

// ── Rutas de autenticación agrupadas ──
Route::prefix('auth')->name('auth.')->group(function () {
    Route::get('/login',    [AuthController::class, 'loginForm'])->name('login');
    Route::post('/login',   [AuthController::class, 'login']);
    Route::post('/logout',  [AuthController::class, 'logout'])->name('logout');
    Route::get('/register', [AuthController::class, 'registerForm'])->name('register');
    Route::post('/register',[AuthController::class, 'register']);
});

// ── Rutas protegidas por autenticación ──
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn() => view('dashboard'))->name('dashboard');
    Route::resource('proyectos', ProyectoController::class)->except(['index']);
});

// ── Ver todas las rutas registradas ──
// php artisan route:list --columns=method,uri,name,action
//
// GET  HEAD  /             home                  HomeController@index
// GET  HEAD  /tareas       tareas.index          TareaController@index
// POST       /tareas       tareas.store          TareaController@store
// GET  HEAD  /tareas/create tareas.create        TareaController@create
// GET  HEAD  /tareas/{tarea} tareas.show         TareaController@show
// ...`,
    },
    {
      id: 's3',
      title: 'Controladores: artisan make:controller',
      content: `Los **controladores** reciben las peticiones HTTP, interactúan con los modelos y retornan respuestas (vistas, JSON, redirects). Viven en \`app/Http/Controllers/\`.

**Crear controladores con Artisan:**
\`\`\`bash
php artisan make:controller TareaController            # básico
php artisan make:controller TareaController --resource # con los 7 métodos RESTful
php artisan make:controller TareaController --model=Tarea  # resource + Eloquent
\`\`\`

**El objeto \`Request\`** — acceso a la petición HTTP:
\`\`\`php
use Illuminate\\Http\\Request;

public function store(Request $request): RedirectResponse
{
    // Leer datos del POST
    $titulo = $request->input('titulo');
    $titulo = $request->titulo;          // acceso como propiedad
    $todos  = $request->all();           // todos los campos
    $solo   = $request->only(['titulo', 'descripcion']);

    // Validar directamente en el request
    $validados = $request->validate([
        'titulo'      => 'required|min:3|max:255',
        'descripcion' => 'nullable|string',
        'prioridad'   => 'required|in:alta,media,baja',
    ]);
}
\`\`\`

**Tipos de respuestas:**
\`\`\`php
return view('tareas.index', ['tareas' => $tareas]);
return view('tareas.index')->with('tareas', $tareas);
return redirect()->route('tareas.index');
return redirect()->back()->withErrors($errores);
return response()->json(['ok' => true, 'data' => $dato]);
\`\`\`

**Validación integrada** — si falla, Laravel redirige automáticamente con los errores en sesión:
\`\`\`php
// En la vista Blade:
@error('titulo')
    <span class="error">{{ $message }}</span>
@enderror
\`\`\``,
      example: `<?php
// ─── app/Http/Controllers/TareaController.php ───
// Generado con: php artisan make:controller TareaController --resource

namespace App\\Http\\Controllers;

use App\\Models\\Tarea;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\View\\View;

class TareaController extends Controller
{
    // GET /tareas
    public function index(): View
    {
        $tareas = Tarea::orderBy('created_at', 'desc')->get();
        return view('tareas.index', compact('tareas'));
    }

    // GET /tareas/create
    public function create(): View
    {
        return view('tareas.create');
    }

    // POST /tareas
    public function store(Request $request): RedirectResponse
    {
        // Validar — si falla, redirige con $errors automáticamente
        $validados = $request->validate([
            'titulo'      => 'required|string|min:3|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'prioridad'   => 'required|in:alta,media,baja',
        ]);

        Tarea::create($validados);

        return redirect()
            ->route('tareas.index')
            ->with('exito', 'Tarea creada correctamente.');
    }

    // GET /tareas/{tarea}
    public function show(Tarea $tarea): View
    {
        // Route model binding: Laravel inyecta el modelo automáticamente
        return view('tareas.show', compact('tarea'));
    }

    // GET /tareas/{tarea}/edit
    public function edit(Tarea $tarea): View
    {
        return view('tareas.edit', compact('tarea'));
    }

    // PUT /tareas/{tarea}
    public function update(Request $request, Tarea $tarea): RedirectResponse
    {
        $validados = $request->validate([
            'titulo'    => 'required|string|min:3|max:255',
            'prioridad' => 'required|in:alta,media,baja',
        ]);

        $tarea->update($validados);

        return redirect()->route('tareas.show', $tarea)
            ->with('exito', 'Tarea actualizada.');
    }

    // DELETE /tareas/{tarea}
    public function destroy(Tarea $tarea): RedirectResponse
    {
        $tarea->delete();
        return redirect()->route('tareas.index')
            ->with('exito', 'Tarea eliminada.');
    }
}`,
    },
    {
      id: 's4',
      title: 'Vistas Blade: @extends, @section, @yield, @include',
      content: `**Blade** es el motor de plantillas de Laravel. Los archivos tienen extensión \`.blade.php\` y viven en \`resources/views/\`.

**Mostrar variables:**
\`\`\`blade
{{ $variable }}       ← escapa HTML automáticamente (seguro, anti-XSS)
{!! $html !!}         ← sin escapar — solo para HTML de confianza
{{ $var ?? 'default' }}  ← valor por defecto si es null
\`\`\`

**Sistema de layouts** — el patrón maestro/hijo:

**1. Layout principal** (\`resources/views/layouts/app.blade.php\`):
\`\`\`blade
<!DOCTYPE html>
<html>
<head>
    <title>@yield('titulo', 'Mi App')</title>
    @yield('estilos')
</head>
<body>
    @include('partials.nav')
    <main>
        @yield('contenido')
    </main>
    @include('partials.footer')
    @yield('scripts')
</body>
</html>
\`\`\`

**2. Vista hija** (\`resources/views/tareas/index.blade.php\`):
\`\`\`blade
@extends('layouts.app')

@section('titulo', 'Lista de Tareas')

@section('contenido')
    <h1>Mis Tareas</h1>
    {{-- contenido específico de esta página --}}
@endsection

@section('scripts')
    <script src="/js/tareas.js"></script>
@endsection
\`\`\`

**\`@include\`** — reutilizar fragmentos:
\`\`\`blade
@include('partials.alerta', ['tipo' => 'exito', 'mensaje' => 'Guardado'])
@includeIf('partials.banner')       ← solo si el archivo existe
@includeWhen($user->isAdmin(), 'partials.admin-menu')
\`\`\`

**Componentes Blade** (Laravel 8+) — para elementos reutilizables complejos:
\`\`\`bash
php artisan make:component Alerta
\`\`\`
\`\`\`blade
<x-alerta tipo="exito" :mensaje="$texto" />
\`\`\``,
      example: `{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('titulo', config('app.name'))</title>

    {{-- CSS base siempre cargado --}}
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

    {{-- Sección opcional para CSS adicional de cada página --}}
    @yield('estilos')
</head>
<body class="{{ Auth::check() ? 'autenticado' : 'invitado' }}">

    @include('partials.navbar')

    {{-- Mensajes flash de sesión --}}
    @if(session('exito'))
        @include('partials.alerta', ['tipo' => 'exito', 'mensaje' => session('exito')])
    @endif

    <main class="contenedor">
        @yield('contenido')
    </main>

    @include('partials.footer')

    <script src="{{ asset('js/app.js') }}"></script>
    @yield('scripts')
</body>
</html>

{{-- ─────────────────────────────────────────── --}}
{{-- resources/views/tareas/index.blade.php --}}

@extends('layouts.app')

@section('titulo', 'Mis Tareas — ' . config('app.name'))

@section('estilos')
    <link rel="stylesheet" href="{{ asset('css/tareas.css') }}">
@endsection

@section('contenido')
    <div class="cabecera">
        <h1>Mis Tareas</h1>
        <a href="{{ route('tareas.create') }}" class="btn-primario">
            + Nueva tarea
        </a>
    </div>

    @include('tareas.partials.lista', ['tareas' => $tareas])
@endsection

{{-- ─────────────────────────────────────────── --}}
{{-- resources/views/partials/alerta.blade.php --}}

<div class="alerta alerta-{{ $tipo }}">
    {{ $mensaje }}
    <button class="cerrar" onclick="this.parentElement.remove()">×</button>
</div>`,
    },
    {
      id: 's5',
      title: 'Directivas Blade: @if, @foreach, @forelse',
      content: `Las **directivas Blade** son la forma de añadir lógica a tus vistas sin escribir PHP mezclado con HTML.

**Condicionales:**
\`\`\`blade
@if($tareas->count() > 0)
    <p>Tienes {{ $tareas->count() }} tareas.</p>
@elseif($usuario->esPremium())
    <p>Tu plan premium está activo.</p>
@else
    <p>No hay tareas pendientes.</p>
@endif

{{-- Para checar autenticación --}}
@auth
    <a href="{{ route('dashboard') }}">Mi cuenta</a>
@endauth

@guest
    <a href="{{ route('auth.login') }}">Iniciar sesión</a>
@endguest

{{-- Para checar rol --}}
@can('editar-posts')
    <button>Editar</button>
@endcan
\`\`\`

**Bucles:**
\`\`\`blade
@foreach($tareas as $tarea)
    <li>{{ $tarea->titulo }}</li>
@endforeach

{{-- @forelse = foreach + mensaje si está vacío (lo más útil en práctica) --}}
@forelse($tareas as $tarea)
    <li>{{ $tarea->titulo }}</li>
@empty
    <p>No hay tareas todavía.</p>
@endforelse

{{-- Variable $loop dentro de @foreach/@forelse --}}
@foreach($items as $item)
    @if($loop->first) <ul> @endif
    <li class="{{ $loop->even ? 'par' : 'impar' }}">
        {{ $loop->iteration }}/{{ $loop->count }}: {{ $item }}
    </li>
    @if($loop->last) </ul> @endif
@endforeach
\`\`\`

**Otras directivas útiles:**
\`\`\`blade
@isset($variable)   {{-- si existe y no es null --}}
@empty($coleccion)  {{-- si está vacío --}}
@switch($rol)
    @case('admin')  Administrador @break
    @case('editor') Editor        @break
    @default        Usuario
@endswitch
@php $total = $precio * $cantidad; @endphp
\`\`\``,
      example: `{{-- resources/views/tareas/index.blade.php --}}

@extends('layouts.app')
@section('titulo', 'Tareas')

@section('contenido')
<div class="tareas-page">

    {{-- ── Cabecera con condicional ── --}}
    <div class="cabecera">
        <h1>
            Tareas
            @if($tareas->isNotEmpty())
                <span class="badge">{{ $tareas->count() }}</span>
            @endif
        </h1>
        <a href="{{ route('tareas.create') }}" class="btn">+ Nueva</a>
    </div>

    {{-- ── Filtros por prioridad ── --}}
    @php $prioridades = ['alta', 'media', 'baja']; @endphp

    <div class="filtros">
        @foreach($prioridades as $p)
            <a href="{{ route('tareas.index', ['prioridad' => $p]) }}"
               class="chip {{ request('prioridad') === $p ? 'activo' : '' }}">
                {{ ucfirst($p) }}
            </a>
        @endforeach
    </div>

    {{-- ── Lista principal con @forelse ── --}}
    @forelse($tareas as $tarea)
        <div class="tarea {{ $tarea->completada ? 'completada' : '' }}
                         prioridad-{{ $tarea->prioridad }}">

            {{-- Número de la iteración con $loop --}}
            <span class="num">{{ $loop->iteration }}</span>

            <div class="contenido">
                <h3>{{ $tarea->titulo }}</h3>

                @isset($tarea->descripcion)
                    <p>{{ Str::limit($tarea->descripcion, 80) }}</p>
                @endisset
            </div>

            <div class="acciones">
                @unless($tarea->completada)
                    <form method="POST"
                          action="{{ route('tareas.completar', $tarea) }}">
                        @csrf
                        @method('PATCH')
                        <button class="btn-completar">✓</button>
                    </form>
                @endunless

                @can('eliminar-tareas')
                    <form method="POST"
                          action="{{ route('tareas.destroy', $tarea) }}"
                          onsubmit="return confirm('¿Eliminar?')">
                        @csrf
                        @method('DELETE')
                        <button class="btn-eliminar">✕</button>
                    </form>
                @endcan
            </div>
        </div>

        {{-- Separador entre grupos (excepto el último) --}}
        @if(!$loop->last && $tarea->prioridad !== $tareas[$loop->index + 1]->prioridad)
            <hr class="separador-grupo">
        @endif

    @empty
        <div class="estado-vacio">
            <p>No hay tareas
                @if(request('prioridad'))
                    de prioridad <strong>{{ request('prioridad') }}</strong>
                @endif
            </p>
            <a href="{{ route('tareas.create') }}">Crea la primera →</a>
        </div>
    @endforelse

    {{-- ── Paginación (cuando uses ->paginate()) ── --}}
    {{ $tareas->links() }}

</div>
@endsection`,
    },
    {
      id: 's6',
      title: 'Variables de entorno (.env)',
      content: `El archivo **\`.env\`** guarda la configuración específica de cada entorno (local, staging, producción) sin hardcodear valores en el código. **Nunca se sube a Git**.

**Variables principales de Laravel:**
\`\`\`env
APP_NAME="Mi Aplicación"
APP_ENV=local              # local | staging | production
APP_DEBUG=true             # false en producción siempre
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mi_app
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
\`\`\`

**Leer el \`.env\` en PHP:**
\`\`\`php
// Función env() — directamente del .env
$debug = env('APP_DEBUG', false);   // segundo arg = valor por defecto

// Función config() — a través de config/app.php (recomendado)
$nombre = config('app.name');
$host   = config('database.connections.mysql.host');
\`\`\`

**¿Por qué usar \`config()\` en lugar de \`env()\`?**
Cuando ejecutas \`php artisan config:cache\`, Laravel serializa todos los archivos de \`config/\` en un solo archivo cacheado. \`env()\` directo deja de funcionar en producción con caché activa. \`config()\` siempre funciona.

**Flujo recomendado:**
1. Leer \`env()\` solo dentro de \`config/*.php\`.
2. Usar \`config()\` en todo el resto del código.

**Comandos de caché:**
\`\`\`bash
php artisan config:cache    # cachear configuración (producción)
php artisan config:clear    # limpiar caché de config
php artisan cache:clear     # limpiar caché de la aplicación
php artisan optimize        # cachear config + rutas + vistas
\`\`\`

**\`.env.example\`** — versión sin valores reales que SÍ va en Git. Todo el equipo copia este archivo y pone sus propios valores.`,
      example: `<?php
// ─── .env (no va en git) ───
// APP_NAME="DevNodo Blog"
// APP_ENV=local
// APP_DEBUG=true
// APP_URL=http://localhost:8000
//
// DB_CONNECTION=mysql
// DB_HOST=127.0.0.1
// DB_PORT=3306
// DB_DATABASE=devnodo_blog
// DB_USERNAME=root
// DB_PASSWORD=
//
// MAIL_MAILER=log
//
// POSTS_PER_PAGE=10
// FEATURE_COMENTARIOS=true

// ─── config/app.php — leer el .env aquí ───
return [
    'name'     => env('APP_NAME', 'Laravel'),
    'env'      => env('APP_ENV', 'production'),
    'debug'    => (bool) env('APP_DEBUG', false),
    'url'      => env('APP_URL', 'http://localhost'),
    'timezone' => 'America/Mexico_City',
    'locale'   => 'es',
];

// ─── config/blog.php — variables personalizadas ───
return [
    'posts_per_page'       => (int) env('POSTS_PER_PAGE', 15),
    'feature_comentarios'  => (bool) env('FEATURE_COMENTARIOS', false),
];

// ─── Usar config() en un controlador ───
namespace App\\Http\\Controllers;

class PostController extends Controller
{
    public function index(): \\Illuminate\\View\\View
    {
        // ✅ Correcto — funciona con y sin config:cache
        $porPagina = config('blog.posts_per_page');
        $appName   = config('app.name');

        // ❌ Evitar en producción (rompe con config:cache activo)
        // $porPagina = env('POSTS_PER_PAGE');

        $posts = \\App\\Models\\Post::latest()
            ->paginate($porPagina);

        return view('posts.index', compact('posts', 'appName'));
    }
}

// ─── Blade: acceder a config ───
// <title>{{ config('app.name') }} — Blog</title>
//
// @if(config('blog.feature_comentarios'))
//     @include('partials.comentarios')
// @endif`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Definir rutas web',
    description: 'En `routes/web.php`, define: (1) una ruta GET `/` que apunte al método `index` de `HomeController` con nombre `home`, (2) una ruta `resource` completa para `posts` apuntando a `PostController`, (3) una ruta GET `/posts/{id}/publicar` con restricción de que `{id}` sea numérico, nombre `posts.publicar`.',
    hint: 'Route::get("/", [HomeController::class, "index"])->name("home"). Route::resource("posts", PostController::class). Para la tercera: ->where("id", "[0-9]+")->name("posts.publicar").',
    starterCode: `<?php
// routes/web.php

use App\\Http\\Controllers\\HomeController;
use App\\Http\\Controllers\\PostController;
use Illuminate\\Support\\Facades\\Route;

// 1. Ruta GET "/" → HomeController@index, nombre: "home"

// 2. Resource completo para "posts" → PostController

// 3. GET /posts/{id}/publicar
//    - restricción: id numérico
//    - nombre: posts.publicar
`,
    validate(_output, code) {
      if (!/Route::get\s*\(\s*['"]\/['"]/i.test(code))
        return { ok: false, message: 'Define `Route::get("/", ...)` para la página principal.' }
      if (!/HomeController::class/i.test(code))
        return { ok: false, message: 'Apunta la ruta "/" a `HomeController::class`.' }
      if (!/->name\s*\(\s*['"]home['"]\s*\)/i.test(code))
        return { ok: false, message: 'Añade el nombre `"home"` a la ruta principal con `->name("home")`.' }
      if (!/Route::resource\s*\(\s*['"]posts['"]/i.test(code))
        return { ok: false, message: 'Usa `Route::resource("posts", PostController::class)` para el CRUD completo.' }
      if (!/PostController::class/i.test(code))
        return { ok: false, message: 'El resource debe apuntar a `PostController::class`.' }
      if (!/['"]posts\/\{id\}\/publicar['"]/i.test(code) && !/posts.*publicar/i.test(code))
        return { ok: false, message: 'Define la ruta GET `/posts/{id}/publicar`.' }
      if (!/->where\s*\(\s*['"]id['"]/i.test(code))
        return { ok: false, message: 'Añade `->where("id", "[0-9]+")` para restringir el parámetro a números.' }
      if (!/->name\s*\(\s*['"]posts\.publicar['"]\s*\)/i.test(code))
        return { ok: false, message: 'Nombra la ruta de publicar con `->name("posts.publicar")`.' }
      return { ok: true, message: '¡Rutas definidas correctamente! get + resource + where + name — el vocabulario completo de routing en Laravel.' }
    },
  },
  {
    id: 'ex2',
    title: 'Controlador con validación',
    description: 'Escribe el método `store` de un `PostController` que: (1) use `$request->validate()` con reglas: `titulo` requerido, string, mínimo 5 caracteres; `contenido` requerido, string; `categoria` requerido, con valores permitidos `["tech", "diseño", "negocio"]`, (2) cree el post con `Post::create($validados)`, (3) redirija a `route("posts.index")` con mensaje flash `"exito"` = `"Post creado."` .',
    hint: 'public function store(Request $request): RedirectResponse. Dentro: $validados = $request->validate([...]). Post::create($validados). return redirect()->route("posts.index")->with("exito", "Post creado.").',
    starterCode: `<?php
// app/Http/Controllers/PostController.php

namespace App\\Http\\Controllers;

use App\\Models\\Post;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\RedirectResponse;

class PostController extends Controller
{
    // Escribe el método store completo:
    // - validate: titulo (required|string|min:5), contenido (required|string),
    //             categoria (required|in:tech,diseño,negocio)
    // - Post::create con los datos validados
    // - redirect a posts.index con flash "exito" => "Post creado."

}
`,
    validate(_output, code) {
      if (!/public\s+function\s+store\s*\(\s*Request\s+\$\w+\s*\)/i.test(code))
        return { ok: false, message: 'Define `public function store(Request $request): RedirectResponse`.' }
      if (!/\$request->validate\s*\(/i.test(code))
        return { ok: false, message: 'Usa `$request->validate([...])` para validar los datos.' }
      if (!/'titulo'\s*=>\s*['"]required/i.test(code) && !/"titulo"\s*=>\s*['"]required/i.test(code))
        return { ok: false, message: 'Añade la regla `"titulo" => "required|string|min:5"` en validate.' }
      if (!/min:5/i.test(code))
        return { ok: false, message: 'El campo `titulo` necesita la regla `min:5`.' }
      if (!/in:tech/i.test(code))
        return { ok: false, message: 'Añade `in:tech,diseño,negocio` para la regla de `categoria`.' }
      if (!/Post::create\s*\(/i.test(code))
        return { ok: false, message: 'Crea el post con `Post::create($validados)`.' }
      if (!/redirect\(\)->route\s*\(\s*['"]posts\.index['"]/i.test(code))
        return { ok: false, message: 'Redirige a `route("posts.index")` después de crear.' }
      if (!/->with\s*\(\s*['"]exito['"]/i.test(code))
        return { ok: false, message: 'Añade el mensaje flash con `->with("exito", "Post creado.")`.' }
      return { ok: true, message: '¡Controlador con validación completo! validate + create + redirect->with es el flujo store estándar de Laravel.' }
    },
  },
  {
    id: 'ex3',
    title: 'Layout Blade con @yield e @include',
    description: 'Escribe un layout Blade `layouts/app.blade.php` que: (1) use `@yield("titulo", "Mi App")` en el `<title>`, (2) incluya `partials.navbar` con `@include`, (3) tenga un `@yield("contenido")` dentro de un `<main>`, (4) al final del body tenga `@yield("scripts")`. Además escribe la vista hija que extienda este layout con `@extends` y llene la sección `contenido` con un `<h1>`.',
    hint: 'El layout usa @yield("titulo", "Mi App"), @include("partials.navbar"), @yield("contenido"), @yield("scripts"). La vista hija: @extends("layouts.app") seguido de @section("titulo", "Inicio") y @section("contenido") ... @endsection.',
    starterCode: `{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    {{-- 1. @yield para el título con valor por defecto "Mi App" --}}

</head>
<body>
    {{-- 2. @include del partial "partials.navbar" --}}

    <main>
        {{-- 3. @yield para el contenido principal --}}

    </main>

    {{-- 4. @yield para scripts al final del body --}}

</body>
</html>

{{-- ─────────────────────────────── --}}
{{-- resources/views/inicio.blade.php --}}

{{-- 5. @extends el layout "layouts.app" --}}

{{-- 6. @section para el título: "Inicio" --}}

{{-- 7. @section para el contenido con un <h1>Bienvenido</h1> --}}
`,
    validate(_output, code) {
      if (!/@yield\s*\(\s*['"]titulo['"]/i.test(code))
        return { ok: false, message: 'Usa `@yield("titulo", "Mi App")` en el `<title>` del layout.' }
      if (!/'Mi App'|"Mi App"/.test(code))
        return { ok: false, message: 'El @yield del título debe tener el valor por defecto `"Mi App"`.' }
      if (!/@include\s*\(\s*['"]partials\.navbar['"]\s*\)/i.test(code))
        return { ok: false, message: 'Incluye la navbar con `@include("partials.navbar")`.' }
      if (!/@yield\s*\(\s*['"]contenido['"]\s*\)/i.test(code))
        return { ok: false, message: 'Añade `@yield("contenido")` dentro del `<main>` del layout.' }
      if (!/@yield\s*\(\s*['"]scripts['"]\s*\)/i.test(code))
        return { ok: false, message: 'Añade `@yield("scripts")` al final del `<body>` para scripts opcionales.' }
      if (!/@extends\s*\(\s*['"]layouts\.app['"]\s*\)/i.test(code))
        return { ok: false, message: 'La vista hija debe usar `@extends("layouts.app")`.' }
      if (!/@section\s*\(\s*['"]contenido['"]/i.test(code))
        return { ok: false, message: 'Rellena la sección `@section("contenido")` en la vista hija.' }
      if (!/@endsection/i.test(code))
        return { ok: false, message: 'Cierra la sección con `@endsection`.' }
      return { ok: true, message: '¡Layout Blade completo! @yield + @extends + @section es el sistema de herencia de plantillas de Laravel.' }
    },
  },
  {
    id: 'ex4',
    title: 'Directivas @forelse, @if y $loop',
    description: 'Escribe una vista Blade que: (1) use `@forelse($posts as $post)` con `@empty` mostrando "No hay posts publicados.", (2) dentro del bucle muestre `$post->titulo` y use `$loop->iteration` para mostrar el número, (3) use `@if($loop->first)` para añadir la clase CSS `"primero"` al primer item, (4) fuera del bucle use `@auth` para mostrar un link "Crear post".',
    hint: '@forelse($posts as $post) ... @empty ... @endforelse. Dentro: {{ $loop->iteration }}. @if($loop->first) class="primero" @endif. @auth ... @endauth.',
    starterCode: `{{-- resources/views/posts/index.blade.php --}}

@extends('layouts.app')

@section('contenido')

{{-- 1. @forelse sobre $posts, con @empty que muestra "No hay posts publicados." --}}

    {{-- 2. Dentro del bucle: mostrar número con $loop->iteration y $post->titulo --}}

    {{-- 3. @if para añadir clase "primero" al primer elemento --}}

{{-- (cierre del forelse) --}}

{{-- 4. @auth para mostrar link "Crear post" apuntando a route('posts.create') --}}

@endsection
`,
    validate(_output, code) {
      if (!/@forelse\s*\(\s*\$posts\s+as\s+\$post\s*\)/i.test(code))
        return { ok: false, message: 'Usa `@forelse($posts as $post)` para iterar los posts.' }
      if (!/@empty/i.test(code))
        return { ok: false, message: 'Añade `@empty` dentro del @forelse con el mensaje de estado vacío.' }
      if (!/No hay posts/i.test(code))
        return { ok: false, message: 'El bloque @empty debe mostrar "No hay posts publicados."' }
      if (!/@endforelse/i.test(code))
        return { ok: false, message: 'Cierra el bucle con `@endforelse`.' }
      if (!/\$loop->iteration/i.test(code))
        return { ok: false, message: 'Usa `{{ $loop->iteration }}` para mostrar el número de cada post.' }
      if (!/@if\s*\(\s*\$loop->first\s*\)/i.test(code))
        return { ok: false, message: 'Usa `@if($loop->first)` para aplicar la clase "primero" al primer elemento.' }
      if (!/@auth/i.test(code))
        return { ok: false, message: 'Usa `@auth ... @endauth` para mostrar el link de crear post solo a usuarios autenticados.' }
      if (!/posts\.create/i.test(code))
        return { ok: false, message: 'El link dentro de @auth debe apuntar a `route("posts.create")`.' }
      return { ok: true, message: '¡Directivas Blade dominadas! @forelse + $loop + @if + @auth — la lógica de vistas de Laravel es expresiva y limpia.' }
    },
  },
  {
    id: 'ex5',
    title: 'Variables de entorno y config()',
    description: 'Escribe: (1) un bloque `.env` con las variables `APP_NAME="Mi Blog"`, `APP_DEBUG=false`, `DB_DATABASE=blog_db`, y una variable personalizada `POSTS_PER_PAGE=12`, (2) un archivo `config/blog.php` que retorne un array leyendo `POSTS_PER_PAGE` con `env()` y valor por defecto `15`, (3) en un controlador, usa `config("blog.posts_per_page")` para paginar (no `env()` directamente).',
    hint: 'El .env escribe las variables sin comillas en los valores numéricos. config/blog.php: return ["posts_per_page" => (int) env("POSTS_PER_PAGE", 15)]. En el controlador: config("blog.posts_per_page").',
    starterCode: `<?php
// ─── 1. Bloque .env ───
// Escribe las 4 variables de entorno como comentarios PHP
// APP_NAME, APP_DEBUG, DB_DATABASE, POSTS_PER_PAGE

// ─── 2. config/blog.php ───
// Retorna un array con la clave "posts_per_page"
// leyendo POSTS_PER_PAGE con env() y default 15

// ─── 3. Fragmento del controlador ───
// Método index() que usa config("blog.posts_per_page")
// para paginar posts (Post::latest()->paginate(...))
`,
    validate(_output, code) {
      if (!/APP_NAME\s*=\s*["']?Mi Blog["']?/i.test(code))
        return { ok: false, message: 'Define `APP_NAME="Mi Blog"` en el bloque .env.' }
      if (!/APP_DEBUG\s*=\s*false/i.test(code))
        return { ok: false, message: 'Define `APP_DEBUG=false` en el .env.' }
      if (!/DB_DATABASE\s*=\s*blog_db/i.test(code))
        return { ok: false, message: 'Define `DB_DATABASE=blog_db` en el .env.' }
      if (!/POSTS_PER_PAGE\s*=\s*12/i.test(code))
        return { ok: false, message: 'Define `POSTS_PER_PAGE=12` en el .env.' }
      if (!/return\s*\[/i.test(code))
        return { ok: false, message: 'El archivo config/blog.php debe retornar un array con `return [...]`.' }
      if (!/env\s*\(\s*['"]POSTS_PER_PAGE['"]/i.test(code))
        return { ok: false, message: 'Usa `env("POSTS_PER_PAGE", 15)` dentro de config/blog.php.' }
      if (!/config\s*\(\s*['"]blog\.posts_per_page['"]\s*\)/i.test(code))
        return { ok: false, message: 'En el controlador usa `config("blog.posts_per_page")`, nunca `env()` directamente.' }
      if (!/->paginate\s*\(/i.test(code))
        return { ok: false, message: 'Usa `->paginate(config("blog.posts_per_page"))` para la paginación.' }
      return { ok: true, message: '¡.env + config() bien separados! env() solo en config/*.php, config() en todo lo demás — esto es lo que hace tu app compatible con config:cache en producción.' }
    },
  },
]
