export const lesson = {
  id: 'lesson-12',
  title: 'Autenticación, Middleware y Validación',
  subtitle: 'Lección 12 — Fase 4: PHP & Laravel',
  language: 'php',
  sections: [
    {
      id: 's1',
      title: 'Laravel Breeze: autenticación lista en minutos',
      content: `**Laravel Breeze** es el starter kit oficial de autenticación. Genera en segundos todo el sistema de login/registro/reset de contraseña con código que puedes leer y modificar.

**Instalación:**
\`\`\`bash
composer require laravel/breeze --dev
php artisan breeze:install blade   # Blade puro (también: react, vue, api)
npm install && npm run dev
php artisan migrate
\`\`\`

**Qué genera Breeze automáticamente:**

| Archivo | Qué hace |
|---------|----------|
| \`routes/auth.php\` | Rutas de login, registro, logout, reset |
| \`app/Http/Controllers/Auth/\` | 6 controladores (Login, Register, Password…) |
| \`resources/views/auth/\` | Vistas Blade de login, registro, verificación |
| \`app/Http/Requests/Auth/\` | Form Requests con validación |

**Rutas que añade Breeze:**
\`\`\`
GET  /login           → Auth\\AuthenticatedSessionController@create
POST /login           → Auth\\AuthenticatedSessionController@store
POST /logout          → Auth\\AuthenticatedSessionController@destroy
GET  /register        → Auth\\RegisteredUserController@create
POST /register        → Auth\\RegisteredUserController@store
GET  /forgot-password → Auth\\PasswordResetLinkController@create
POST /forgot-password → Auth\\PasswordResetLinkController@store
GET  /reset-password  → Auth\\NewPasswordController@create
POST /reset-password  → Auth\\NewPasswordController@store
GET  /dashboard       → (protegida por middleware auth)
\`\`\`

**Helpers de autenticación:**
\`\`\`php
auth()->check()         // ¿hay usuario autenticado?
auth()->user()          // instancia del User actual
auth()->id()            // ID del usuario actual
auth()->guest()         // ¿es visitante sin autenticar?

Auth::login($user)      // iniciar sesión manualmente
Auth::logout()          // cerrar sesión
Auth::attempt(['email' => $email, 'password' => $pass])  // intentar login
\`\`\`

**En Blade:**
\`\`\`blade
@auth
    <p>Hola, {{ auth()->user()->name }}</p>
    <a href="{{ route('dashboard') }}">Mi cuenta</a>
@endauth

@guest
    <a href="{{ route('login') }}">Iniciar sesión</a>
@endguest
\`\`\``,
      example: `<?php
// ─── Flujo completo de instalación ───
// 1. composer require laravel/breeze --dev
// 2. php artisan breeze:install blade
// 3. npm install && npm run dev
// 4. php artisan migrate

// ─── app/Http/Controllers/Auth/AuthenticatedSessionController.php ───
// (Breeze lo genera — aquí lo exploramos)

namespace App\\Http\\Controllers\\Auth;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Auth\\LoginRequest;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\View\\View;

class AuthenticatedSessionController extends Controller
{
    // Muestra el formulario de login
    public function create(): View
    {
        return view('auth.login');
    }

    // Procesa el formulario de login
    public function store(LoginRequest $request): RedirectResponse
    {
        // LoginRequest ya valida email/password y hace throttle de intentos
        $request->authenticate();

        // Regenerar session ID — previene session fixation
        $request->session()->regenerate();

        // Redirige al intended (URL que intentaba visitar) o al dashboard
        return redirect()->intended(route('dashboard'));
    }

    // Cierra la sesión
    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

// ─── routes/web.php — proteger rutas con middleware ───
use Illuminate\\Support\\Facades\\Route;

// Rutas públicas
Route::get('/', fn() => view('welcome'))->name('home');

// Rutas solo para autenticados
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn() => view('dashboard'))->name('dashboard');
    Route::resource('posts', PostController::class)->except(['index', 'show']);
});

// Rutas solo para invitados (redirige si ya está logueado)
Route::middleware('guest')->group(function () {
    Route::get('/bienvenida', fn() => view('marketing'))->name('marketing');
});`,
    },
    {
      id: 's2',
      title: 'Middleware: auth, guest y make:middleware personalizado',
      content: `Los **middleware** son capas que interceptan las peticiones HTTP antes de llegar al controlador (o las respuestas antes de salir). Laravel incluye varios y puedes crear los tuyos.

**Middleware incluidos en Laravel:**
\`\`\`php
'auth'            // requiere usuario autenticado
'guest'           // solo para usuarios NO autenticados
'verified'        // requiere email verificado
'throttle:60,1'   // limita a 60 peticiones por minuto
'signed'          // requiere URL firmada
\`\`\`

**Crear middleware personalizado:**
\`\`\`bash
php artisan make:middleware EnsureUserIsAdmin
\`\`\`

\`\`\`php
// app/Http/Middleware/EnsureUserIsAdmin.php
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->esAdmin()) {
            abort(403, 'Acceso denegado.');
        }

        return $next($request); // continuar con la petición
    }
}
\`\`\`

**Registrar middleware en Laravel 11+ (\`bootstrap/app.php\`):**
\`\`\`php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \\App\\Http\\Middleware\\EnsureUserIsAdmin::class,
        'role'  => \\App\\Http\\Middleware\\CheckRole::class,
    ]);
})
\`\`\`

**Aplicar middleware:**
\`\`\`php
// En rutas
Route::get('/admin', AdminController::class)->middleware('admin');
Route::middleware(['auth', 'admin'])->group(function () { ... });

// En el controlador
public function __construct()
{
    $this->middleware('auth');
    $this->middleware('admin')->only(['destroy']);
    $this->middleware('throttle:5,1')->only(['store']);
}
\`\`\`

**Middleware con parámetros:**
\`\`\`php
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!in_array($request->user()?->role, $roles)) {
            abort(403);
        }
        return $next($request);
    }
}

// Uso: ->middleware('role:admin,editor')
\`\`\``,
      example: `<?php
// ─── app/Http/Middleware/EnsureUserIsAdmin.php ───

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Si no está autenticado, redirigir al login
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Si está autenticado pero no es admin, denegar
        if ($request->user()->role !== 'admin') {
            abort(403, 'Solo los administradores pueden acceder a esta sección.');
        }

        return $next($request);
    }
}

// ─── app/Http/Middleware/CheckRole.php — middleware con parámetros ───

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $userRole = $request->user()?->role;

        if (!$userRole || !in_array($userRole, $roles)) {
            // AJAX: responder con JSON
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Sin permisos.'], 403);
            }

            abort(403, "Se requiere uno de estos roles: " . implode(', ', $roles));
        }

        return $next($request);
    }
}

// ─── bootstrap/app.php — registrar alias en Laravel 11 ───

use Illuminate\\Foundation\\Application;
use Illuminate\\Foundation\\Configuration\\Exceptions;
use Illuminate\\Foundation\\Configuration\\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'admin'     => \\App\\Http\\Middleware\\EnsureUserIsAdmin::class,
            'role'      => \\App\\Http\\Middleware\\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

// ─── routes/web.php — uso ───

Route::middleware(['auth', 'role:admin,editor'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', Admin\\UserController::class);
    Route::resource('posts', Admin\\PostController::class);
});

Route::delete('/users/{user}', [UserController::class, 'destroy'])
    ->middleware(['auth', 'admin']);`,
    },
    {
      id: 's3',
      title: 'Validación con Form Request y reglas',
      content: `Laravel tiene un sistema de validación muy completo. La mejor práctica es extraerlo a **Form Request** en lugar de validar en el controlador.

**Crear un Form Request:**
\`\`\`bash
php artisan make:request StorePostRequest
\`\`\`

\`\`\`php
class StorePostRequest extends FormRequest
{
    // ¿Está autorizado a hacer esta petición?
    public function authorize(): bool
    {
        return auth()->check(); // o lógica más específica
    }

    // Reglas de validación
    public function rules(): array
    {
        return [
            'titulo'    => 'required|string|min:5|max:255',
            'contenido' => 'required|string|min:50',
            'categoria' => 'required|exists:categorias,id',
            'imagen'    => 'nullable|image|mimes:jpg,png,webp|max:2048',
        ];
    }

    // Mensajes personalizados (opcional)
    public function messages(): array
    {
        return [
            'titulo.required' => 'El título no puede estar vacío.',
            'titulo.min'      => 'El título debe tener al menos :min caracteres.',
            'categoria.exists'=> 'La categoría seleccionada no existe.',
        ];
    }
}
\`\`\`

**Usar el Form Request en el controlador:**
\`\`\`php
public function store(StorePostRequest $request): RedirectResponse
{
    // Si llega aquí, la validación pasó — $request->validated() son los datos limpios
    $post = Post::create($request->validated());
    return redirect()->route('posts.show', $post);
}
\`\`\`

**Reglas de validación más usadas:**
\`\`\`
required         nullable         sometimes
string           integer          numeric          boolean
min:3            max:255          between:1,100
email            url              ip               uuid
confirmed        (password_confirmation debe coincidir)
unique:tabla     unique:tabla,col,exceptId
exists:tabla,col
in:a,b,c         not_in:a,b
image            mimes:jpg,png    max:2048  (KB)
date             date_format:Y-m-d  after:today
regex:/patron/   alpha            alpha_num
array            array|min:1
\`\`\``,
      example: `<?php
// ─── app/Http/Requests/StorePostRequest.php ───

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Solo usuarios autenticados pueden crear posts
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'titulo'       => 'required|string|min:5|max:255',
            'extracto'     => 'nullable|string|max:500',
            'contenido'    => 'required|string|min:100',
            'categoria_id' => 'required|integer|exists:categorias,id',
            'etiquetas'    => 'nullable|array',
            'etiquetas.*'  => 'integer|exists:etiquetas,id',   // cada elemento del array
            'imagen'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'estado'       => 'required|in:borrador,publicado',
            'publicado_en' => 'nullable|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required'        => 'El título es obligatorio.',
            'titulo.min'             => 'El título debe tener al menos :min caracteres.',
            'contenido.min'          => 'El contenido es demasiado corto (mínimo :min caracteres).',
            'categoria_id.exists'    => 'La categoría seleccionada no existe.',
            'imagen.max'             => 'La imagen no puede superar los 2 MB.',
            'publicado_en.after_or_equal' => 'La fecha de publicación no puede ser en el pasado.',
        ];
    }

    // Modificar datos antes de validar (prepareForValidation)
    protected function prepareForValidation(): void
    {
        if ($this->titulo) {
            $this->merge([
                'titulo' => trim($this->titulo),
            ]);
        }
    }
}

// ─── app/Http/Requests/UpdatePostRequest.php — reutilizar con ajustes ───

class UpdatePostRequest extends StorePostRequest
{
    public function rules(): array
    {
        $rules = parent::rules();

        // Al actualizar, el título solo debe ser único excepto para ESTE post
        $rules['titulo'] = 'required|string|min:5|max:255|unique:posts,titulo,' . $this->post->id;

        // La imagen es opcional al actualizar
        $rules['imagen'] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048';

        return $rules;
    }
}

// ─── app/Http/Controllers/PostController.php ───

class PostController extends Controller
{
    public function store(StorePostRequest $request): \\Illuminate\\Http\\RedirectResponse
    {
        // $request->validated() devuelve SOLO los campos que pasaron las reglas
        $datos = $request->validated();

        // Subir imagen si viene
        if ($request->hasFile('imagen')) {
            $datos['imagen_url'] = $request->file('imagen')
                ->store('posts', 'public');
        }

        $post = Post::create(array_merge($datos, ['user_id' => auth()->id()]));

        // Sincronizar etiquetas
        if (!empty($datos['etiquetas'])) {
            $post->etiquetas()->sync($datos['etiquetas']);
        }

        return redirect()
            ->route('posts.show', $post)
            ->with('exito', 'Post creado correctamente.');
    }
}`,
    },
    {
      id: 's4',
      title: 'Flash messages y errores en Blade',
      content: `Los **flash messages** son mensajes que se guardan en sesión por una sola petición — perfectos para confirmaciones de éxito o errores tras un redirect.

**Enviar mensajes flash desde el controlador:**
\`\`\`php
return redirect()->route('posts.index')
    ->with('exito', 'Post creado correctamente.');

return redirect()->back()
    ->with('error', 'No se pudo completar la operación.')
    ->withInput(); // preservar los datos del formulario
\`\`\`

**Mostrar mensajes flash en Blade:**
\`\`\`blade
@if(session('exito'))
    <div class="alerta alerta-exito">{{ session('exito') }}</div>
@endif

@if(session('error'))
    <div class="alerta alerta-error">{{ session('error') }}</div>
@endif
\`\`\`

**Mostrar errores de validación con \`@error\`:**
\`\`\`blade
<input
    type="text"
    name="titulo"
    value="{{ old('titulo') }}"
    class="{{ $errors->has('titulo') ? 'input-error' : '' }}"
>

@error('titulo')
    <span class="mensaje-error">{{ $message }}</span>
@enderror
\`\`\`

**\`old()\`** — recupera el valor que el usuario escribió antes del error:
\`\`\`blade
<input name="email" value="{{ old('email') }}">
<select name="categoria_id">
    @foreach($categorias as $cat)
        <option value="{{ $cat->id }}"
            {{ old('categoria_id') == $cat->id ? 'selected' : '' }}>
            {{ $cat->nombre }}
        </option>
    @endforeach
</select>
\`\`\`

**\`$errors\`** — la bolsa de errores disponible en toda vista:
\`\`\`blade
@if($errors->any())
    <ul class="lista-errores">
        @foreach($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
    </ul>
@endif

{{-- Errores de un named bag (formularios múltiples en la misma página) --}}
@error('email', 'login')
    {{ $message }}
@enderror
\`\`\``,
      example: `{{-- resources/views/layouts/app.blade.php — flash global en el layout --}}

<body>
    @include('partials.navbar')

    {{-- ── Mensajes flash — se muestran en cualquier página ── --}}
    <div class="notificaciones">
        @foreach(['exito' => 'verde', 'error' => 'rojo', 'aviso' => 'amarillo'] as $tipo => $color)
            @if(session($tipo))
                <div class="alerta alerta-{{ $color }}" role="alert">
                    <strong>{{ session($tipo) }}</strong>
                    <button onclick="this.parentElement.remove()" aria-label="Cerrar">×</button>
                </div>
            @endif
        @endforeach
    </div>

    <main>@yield('contenido')</main>
</body>

{{-- ─────────────────────────────────────────────── --}}
{{-- resources/views/posts/create.blade.php — formulario con errores --}}

@extends('layouts.app')
@section('titulo', 'Nuevo post')

@section('contenido')
<div class="formulario-contenedor">
    <h1>Crear post</h1>

    {{-- Resumen de errores --}}
    @if($errors->any())
        <div class="errores-resumen">
            <strong>Por favor corrige estos errores:</strong>
            <ul>
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('posts.store') }}" enctype="multipart/form-data">
        @csrf

        {{-- Campo título --}}
        <div class="campo {{ $errors->has('titulo') ? 'campo-error' : '' }}">
            <label for="titulo">Título *</label>
            <input
                id="titulo"
                type="text"
                name="titulo"
                value="{{ old('titulo') }}"
                placeholder="Escribe el título del post"
                autofocus
            >
            @error('titulo')
                <span class="mensaje-error">{{ $message }}</span>
            @enderror
        </div>

        {{-- Campo categoría --}}
        <div class="campo {{ $errors->has('categoria_id') ? 'campo-error' : '' }}">
            <label for="categoria_id">Categoría *</label>
            <select id="categoria_id" name="categoria_id">
                <option value="">— Selecciona —</option>
                @foreach($categorias as $cat)
                    <option
                        value="{{ $cat->id }}"
                        {{ old('categoria_id') == $cat->id ? 'selected' : '' }}
                    >
                        {{ $cat->nombre }}
                    </option>
                @endforeach
            </select>
            @error('categoria_id')
                <span class="mensaje-error">{{ $message }}</span>
            @enderror
        </div>

        {{-- Campo contenido --}}
        <div class="campo {{ $errors->has('contenido') ? 'campo-error' : '' }}">
            <label for="contenido">Contenido *</label>
            <textarea id="contenido" name="contenido" rows="12">{{ old('contenido') }}</textarea>
            @error('contenido')
                <span class="mensaje-error">{{ $message }}</span>
            @enderror
        </div>

        <button type="submit" class="btn-primario">Publicar post</button>
        <a href="{{ route('posts.index') }}" class="btn-secundario">Cancelar</a>
    </form>
</div>
@endsection`,
    },
    {
      id: 's5',
      title: 'Roles básicos con Gates y Policies',
      content: `**Gates** y **Policies** son el sistema de autorización de Laravel — definen *quién puede hacer qué*.

- **Gate**: autorización simple, no ligada a un modelo específico.
- **Policy**: autorización ligada a un modelo Eloquent concreto.

**Gates — definir en \`AppServiceProvider\`:**
\`\`\`php
use Illuminate\\Support\\Facades\\Gate;

public function boot(): void
{
    Gate::define('ver-panel-admin', function (User $user) {
        return $user->role === 'admin';
    });

    Gate::define('publicar-posts', function (User $user) {
        return in_array($user->role, ['admin', 'editor']);
    });
}
\`\`\`

**Usar Gates:**
\`\`\`php
// En un controlador
Gate::allows('ver-panel-admin')   // true/false
Gate::denies('publicar-posts')
Gate::authorize('ver-panel-admin') // lanza AuthorizationException si falla

// En Blade
@can('publicar-posts')
    <a href="{{ route('posts.create') }}">Nuevo post</a>
@endcan

@cannot('ver-panel-admin')
    <p>No tienes acceso al panel de administración.</p>
@endcannot
\`\`\`

**Policies — autorización ligada a un modelo:**
\`\`\`bash
php artisan make:policy PostPolicy --model=Post
\`\`\`

\`\`\`php
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id   // es el autor
            || $user->role === 'admin';        // o es admin
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->role === 'admin';
    }
}
\`\`\`

**Usar Policies:**
\`\`\`php
// En el controlador
$this->authorize('update', $post);   // lanza 403 si no puede

// Blade
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Editar</a>
@endcan
\`\`\`

**Registrar la Policy** (Laravel 11 — en \`AppServiceProvider\`):
\`\`\`php
Gate::policy(Post::class, PostPolicy::class);
\`\`\``,
      example: `<?php
// ─── app/Providers/AppServiceProvider.php ───

namespace App\\Providers;

use App\\Models\\Post;
use App\\Policies\\PostPolicy;
use Illuminate\\Support\\Facades\\Gate;
use Illuminate\\Support\\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // ── Registrar Policy ──
        Gate::policy(Post::class, PostPolicy::class);

        // ── Gates sencillos (sin modelo) ──
        Gate::define('acceder-admin', function ($user) {
            return $user->role === 'admin';
        });

        Gate::define('publicar-posts', function ($user) {
            return in_array($user->role, ['admin', 'editor']);
        });

        Gate::define('moderar-comentarios', function ($user) {
            return in_array($user->role, ['admin', 'editor', 'moderador']);
        });

        // ── Superadmin: salta todas las comprobaciones ──
        Gate::before(function ($user, $ability) {
            if ($user->role === 'superadmin') {
                return true; // permite todo
            }
        });
    }
}

// ─── app/Policies/PostPolicy.php ───

namespace App\\Policies;

use App\\Models\\Post;
use App\\Models\\User;
use Illuminate\\Auth\\Access\\Response;

class PostPolicy
{
    // Puede crear posts
    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'editor', 'autor']);
    }

    // Puede ver un post (incluso borradores propios)
    public function view(?User $user, Post $post): bool
    {
        if ($post->estado === 'publicado') return true;
        return $user?->id === $post->user_id || $user?->role === 'admin';
    }

    // Puede editar un post
    public function update(User $user, Post $post): Response
    {
        return $user->id === $post->user_id || $user->role === 'admin'
            ? Response::allow()
            : Response::deny('Solo el autor o un administrador puede editar este post.');
    }

    // Puede eliminar un post
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->role === 'admin';
    }
}

// ─── app/Http/Controllers/PostController.php — uso de authorize() ───

class PostController extends Controller
{
    public function create(): \\Illuminate\\View\\View
    {
        $this->authorize('create', Post::class);
        return view('posts.create');
    }

    public function edit(Post $post): \\Illuminate\\View\\View
    {
        $this->authorize('update', $post); // lanza 403 si la Policy lo deniega
        return view('posts.edit', compact('post'));
    }

    public function destroy(Post $post): \\Illuminate\\Http\\RedirectResponse
    {
        $this->authorize('delete', $post);
        $post->delete();
        return redirect()->route('posts.index')->with('exito', 'Post eliminado.');
    }
}

// ─── resources/views/posts/show.blade.php — Blade con Gates y Policies ───

// @can('update', $post)
//     <a href="{{ route('posts.edit', $post) }}" class="btn">Editar</a>
// @endcan
//
// @can('delete', $post)
//     <form method="POST" action="{{ route('posts.destroy', $post) }}">
//         @csrf @method('DELETE')
//         <button class="btn-peligro"
//                 onclick="return confirm('¿Eliminar este post?')">
//             Eliminar
//         </button>
//     </form>
// @endcan
//
// @can('acceder-admin')
//     <a href="{{ route('admin.dashboard') }}">Panel Admin</a>
// @endcan`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Middleware personalizado con parámetros',
    description: 'Escribe un middleware llamado `CheckRole` con el método `handle()` que: (1) reciba parámetros `string ...$roles` además de `Request $request` y `Closure $next`, (2) compruebe si el usuario autenticado existe con `$request->user()`, (3) si no existe, redirija a `route("login")`, (4) compruebe si `$request->user()->role` está dentro del array `$roles` con `in_array()`, (5) si no está, llame a `abort(403)`, (6) si pasa las comprobaciones, retorne `$next($request)`.',
    hint: 'public function handle(Request $request, Closure $next, string ...$roles): Response. if (!$request->user()) return redirect()->route("login"). if (!in_array($request->user()->role, $roles)) abort(403). return $next($request).',
    starterCode: `<?php
// app/Http/Middleware/CheckRole.php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class CheckRole
{
    // Implementa handle() con:
    // - parámetros: Request $request, Closure $next, string ...$roles
    // - si no hay usuario autenticado: redirect a route("login")
    // - si el role del usuario no está en $roles: abort(403)
    // - si todo está bien: retornar $next($request)

}
`,
    validate(_output, code) {
      if (!/public\s+function\s+handle\s*\(/i.test(code))
        return { ok: false, message: 'Define el método `public function handle(...)` en el middleware.' }
      if (!/Request\s+\$request/i.test(code))
        return { ok: false, message: 'El método `handle()` debe recibir `Request $request` como primer parámetro.' }
      if (!/Closure\s+\$next/i.test(code))
        return { ok: false, message: 'El método `handle()` debe recibir `Closure $next` como segundo parámetro.' }
      if (!/string\s+\.\.\.\$roles/i.test(code))
        return { ok: false, message: 'Declara el parámetro variádico `string ...$roles` para recibir los roles permitidos.' }
      if (!/\$request->user\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Comprueba si hay usuario con `$request->user()` antes de acceder a su role.' }
      if (!/redirect\s*\(\s*\)->route\s*\(\s*['"]login['"]\s*\)/i.test(code))
        return { ok: false, message: 'Si no hay usuario, redirige con `redirect()->route("login")`.' }
      if (!/in_array\s*\(/i.test(code))
        return { ok: false, message: 'Usa `in_array(...)` para comprobar si el role del usuario está en el array de roles permitidos.' }
      if (!/abort\s*\(\s*403\s*\)/i.test(code))
        return { ok: false, message: 'Si el role no está permitido, lanza `abort(403)` para denegar el acceso.' }
      if (!/return\s+\$next\s*\(\s*\$request\s*\)/i.test(code))
        return { ok: false, message: 'Al final, retorna `return $next($request)` para continuar con la petición.' }
      return { ok: true, message: '¡Middleware con parámetros correcto! Con el alias "role" en bootstrap/app.php puedes usarlo como ->middleware("role:admin,editor") en cualquier ruta.' }
    },
  },
  {
    id: 'ex2',
    title: 'Form Request con authorize() y rules()',
    description: 'Escribe un Form Request llamado `StoreComentarioRequest` con: (1) `authorize()` que retorne `auth()->check()`, (2) `rules()` que retorne un array con: `"post_id"` requerido, entero, que exista en tabla `posts` columna `id`; `"contenido"` requerido, string, mínimo 10 caracteres, máximo 1000; (3) `messages()` con un mensaje personalizado para `"contenido.min"` que diga `"El comentario debe tener al menos :min caracteres."`.',
    hint: 'authorize(): return auth()->check(). rules(): ["post_id" => "required|integer|exists:posts,id", "contenido" => "required|string|min:10|max:1000"]. messages(): ["contenido.min" => "..."].',
    starterCode: `<?php
// app/Http/Requests/StoreComentarioRequest.php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class StoreComentarioRequest extends FormRequest
{
    // 1. authorize(): solo usuarios autenticados

    // 2. rules():
    //    - post_id: requerido, entero, que exista en posts.id
    //    - contenido: requerido, string, min:10, max:1000

    // 3. messages():
    //    - contenido.min: "El comentario debe tener al menos :min caracteres."
}
`,
    validate(_output, code) {
      if (!/public\s+function\s+authorize\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Define el método `public function authorize(): bool`.' }
      if (!/auth\s*\(\s*\)->check\s*\(\s*\)/i.test(code))
        return { ok: false, message: '`authorize()` debe retornar `auth()->check()` para permitir solo usuarios autenticados.' }
      if (!/public\s+function\s+rules\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Define el método `public function rules(): array`.' }
      if (!/'post_id'/.test(code) && !/"post_id"/.test(code))
        return { ok: false, message: 'Incluye la regla para `"post_id"` en `rules()`.' }
      if (!/exists:posts,id/i.test(code))
        return { ok: false, message: 'El campo `post_id` necesita la regla `exists:posts,id` para validar que el post existe.' }
      if (!/'contenido'/.test(code) && !/"contenido"/.test(code))
        return { ok: false, message: 'Incluye la regla para `"contenido"` en `rules()`.' }
      if (!/min:10/i.test(code))
        return { ok: false, message: 'El campo `contenido` necesita la regla `min:10`.' }
      if (!/max:1000/i.test(code))
        return { ok: false, message: 'El campo `contenido` necesita la regla `max:1000`.' }
      if (!/public\s+function\s+messages\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Define el método `public function messages(): array` para personalizar los mensajes.' }
      if (!/contenido\.min/i.test(code))
        return { ok: false, message: 'Añade el mensaje personalizado para la clave `"contenido.min"` en `messages()`.' }
      if (!/al menos :min/i.test(code))
        return { ok: false, message: 'El mensaje de `contenido.min` debe incluir el placeholder `:min` para mostrar el número dinámicamente.' }
      return { ok: true, message: '¡Form Request completo! authorize + rules + messages — la validación queda fuera del controlador, que se mantiene limpio y enfocado en la lógica de negocio.' }
    },
  },
  {
    id: 'ex3',
    title: 'Flash messages y @error en Blade',
    description: 'Escribe un fragmento Blade que: (1) muestre el mensaje flash `session("exito")` en un `<div class="alerta-exito">` si existe, (2) muestre el mensaje flash `session("error")` en un `<div class="alerta-error">` si existe, (3) muestre un campo `<input name="titulo">` con `value="{{ old("titulo") }}"`, (4) use la directiva `@error("titulo")` para mostrar `$message` en un `<span class="error">`, (5) use `@if($errors->any())` para mostrar un listado con `$errors->all()`.',
    hint: '@if(session("exito")) <div class="alerta-exito">...</div> @endif. <input value="{{ old("titulo") }}">. @error("titulo") <span>{{ $message }}</span> @enderror. @if($errors->any()) @foreach($errors->all() as $error) ... @endforeach @endif.',
    starterCode: `{{-- Fragmento de vista Blade para un formulario con mensajes --}}

{{-- 1. Mostrar flash "exito" si existe --}}

{{-- 2. Mostrar flash "error" si existe --}}

{{-- 3. Campo input "titulo" con old() y @error --}}

{{-- 4. Lista de todos los errores con $errors->any() --}}
`,
    validate(_output, code) {
      if (!/session\s*\(\s*['"]exito['"]\s*\)/i.test(code))
        return { ok: false, message: 'Muestra el flash de éxito con `session("exito")`.' }
      if (!/alerta-exito/i.test(code))
        return { ok: false, message: 'Envuelve el mensaje de éxito en un `<div class="alerta-exito">`.' }
      if (!/session\s*\(\s*['"]error['"]\s*\)/i.test(code))
        return { ok: false, message: 'Muestra el flash de error con `session("error")`.' }
      if (!/alerta-error/i.test(code))
        return { ok: false, message: 'Envuelve el mensaje de error en un `<div class="alerta-error">`.' }
      if (!/old\s*\(\s*['"]titulo['"]\s*\)/i.test(code))
        return { ok: false, message: 'Usa `{{ old("titulo") }}` como `value` del input para repoblar el campo tras un error.' }
      if (!/@error\s*\(\s*['"]titulo['"]\s*\)/i.test(code))
        return { ok: false, message: 'Usa `@error("titulo")` para mostrar el error específico de ese campo.' }
      if (!/\{\{\s*\$message\s*\}\}/i.test(code))
        return { ok: false, message: 'Dentro de `@error`, muestra el mensaje con `{{ $message }}`.' }
      if (!/@enderror/i.test(code))
        return { ok: false, message: 'Cierra la directiva `@error` con `@enderror`.' }
      if (!/\$errors->any\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Usa `@if($errors->any())` para mostrar el bloque de errores solo cuando existan.' }
      if (!/\$errors->all\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Itera con `$errors->all()` para listar todos los mensajes de error.' }
      return { ok: true, message: '¡Flash messages y errores Blade completos! session() para mensajes de una sola vez, @error para errores de campo específicos, $errors->any() para el resumen — el trío estándar de UX en formularios Laravel.' }
    },
  },
  {
    id: 'ex4',
    title: 'Definir y usar un Gate',
    description: 'En el método `boot()` de `AppServiceProvider`, define un Gate llamado `"editar-posts"` que retorne `true` si `$user->role` es `"admin"` o `"editor"`. Luego escribe un método de controlador `edit(Post $post)` que use `Gate::authorize("editar-posts")` para denegar el acceso si el usuario no puede editar, y retorne la vista `"posts.edit"`. Finalmente escribe la directiva Blade `@can("editar-posts")` mostrando un link de edición.',
    hint: 'Gate::define("editar-posts", fn($user) => in_array($user->role, ["admin", "editor"])). En el controlador: Gate::authorize("editar-posts"). En Blade: @can("editar-posts") ... @endcan.',
    starterCode: `<?php
// Parte 1: en AppServiceProvider::boot()
// Define el Gate "editar-posts"
// que permite acceso si el role es "admin" o "editor"

use Illuminate\\Support\\Facades\\Gate;

public function boot(): void
{
    // escribe Gate::define aquí
}

// ──────────────────────────────────────────

// Parte 2: en PostController
// Método edit(Post $post) con Gate::authorize y retorno de vista

use Illuminate\\Support\\Facades\\Gate;

// escribe el método edit aquí

// ──────────────────────────────────────────

{{-- Parte 3: directiva Blade --}}
{{-- Muestra un <a> de "Editar post" solo si el usuario puede "editar-posts" --}}
`,
    validate(_output, code) {
      if (!/Gate::define\s*\(\s*['"]editar-posts['"]/i.test(code))
        return { ok: false, message: 'Define el Gate con `Gate::define("editar-posts", function(...) { ... })`.' }
      if (!/in_array\s*\(/.test(code) && !/(===\s*['"]admin['"].*===\s*['"]editor['"]|===\s*['"]editor['"].*===\s*['"]admin['"]).test(code))
        return { ok: false, message: 'El Gate debe comprobar que el role sea "admin" o "editor". Usa `in_array($user->role, ["admin", "editor"])`.' }
      if (!/'admin'/.test(code) && !/"admin"/.test(code))
        return { ok: false, message: 'El Gate debe incluir el role `"admin"` entre los permitidos.' }
      if (!/'editor'/.test(code) && !/"editor"/.test(code))
        return { ok: false, message: 'El Gate debe incluir el role `"editor"` entre los permitidos.' }
      if (!/Gate::authorize\s*\(\s*['"]editar-posts['"]\s*\)/i.test(code))
        return { ok: false, message: 'En el controlador usa `Gate::authorize("editar-posts")` para lanzar 403 automáticamente si no tiene permisos.' }
      if (!/function\s+edit\s*\(/i.test(code))
        return { ok: false, message: 'Escribe el método `edit(Post $post)` en el controlador.' }
      if (!/return\s+view\s*\(\s*['"]posts\.edit['"]/i.test(code))
        return { ok: false, message: 'El método `edit()` debe retornar `view("posts.edit", ...)`.' }
      if (!/@can\s*\(\s*['"]editar-posts['"]\s*\)/i.test(code))
        return { ok: false, message: 'En Blade usa `@can("editar-posts")` para mostrar el link solo a usuarios con ese permiso.' }
      if (!/@endcan/i.test(code))
        return { ok: false, message: 'Cierra la directiva con `@endcan`.' }
      return { ok: true, message: '¡Gate definido y usado correctamente! Gate::define en el proveedor, Gate::authorize en el controlador, @can en la vista — las tres capas de la autorización en Laravel.' }
    },
  },
  {
    id: 'ex5',
    title: 'Policy: método update y uso con authorize()',
    description: 'Escribe la clase `PostPolicy` con el método `update(User $user, Post $post): bool` que retorne `true` si `$user->id === $post->user_id` (el usuario es el autor) O si `$user->role === "admin"`. Luego escribe el método `update()` de `PostController` que: (1) reciba `Request $request` y `Post $post`, (2) use `$this->authorize("update", $post)` para comprobar la Policy, (3) actualice el post con `$request->validate()` con la regla `titulo` requerido, string, (4) redirija a `route("posts.show", $post)` con flash `"exito"`.',
    hint: 'public function update(User $user, Post $post): bool { return $user->id === $post->user_id || $user->role === "admin"; }. En el controlador: $this->authorize("update", $post). $post->update($request->validate(...)). redirect()->route("posts.show", $post)->with("exito", ...).',
    starterCode: `<?php
// Parte 1: app/Policies/PostPolicy.php
// Método update: retorna true si es el autor O si es admin

namespace App\\Policies;

use App\\Models\\Post;
use App\\Models\\User;

class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        // retorna true si $user->id === $post->user_id
        // O si $user->role === "admin"
    }
}

// ──────────────────────────────────────────

// Parte 2: app/Http/Controllers/PostController.php
// Método update(Request $request, Post $post):
// - $this->authorize con la policy
// - validar: titulo (required|string)
// - $post->update() con los datos validados
// - redirect a posts.show con flash "exito"
`,
    validate(_output, code) {
      if (!/class\s+PostPolicy/i.test(code))
        return { ok: false, message: 'Define la clase `PostPolicy`.' }
      if (!/public\s+function\s+update\s*\(\s*User\s+\$user\s*,\s*Post\s+\$post\s*\)/i.test(code))
        return { ok: false, message: 'Define `public function update(User $user, Post $post): bool` en la Policy.' }
      if (!/\$user->id\s*===\s*\$post->user_id/i.test(code) && !/\$post->user_id\s*===\s*\$user->id/i.test(code))
        return { ok: false, message: 'La Policy debe comprobar `$user->id === $post->user_id` para permitir al autor editar su post.' }
      if (!/\$user->role\s*===\s*['"]admin['"]/i.test(code))
        return { ok: false, message: 'La Policy también debe permitir el acceso si `$user->role === "admin"`.' }
      if (!/\|\|/.test(code) && !/or\s/.test(code))
        return { ok: false, message: 'Las dos condiciones deben estar unidas con `||` — el autor O el admin pueden editar.' }
      if (!/\$this->authorize\s*\(\s*['"]update['"]\s*,\s*\$post\s*\)/i.test(code))
        return { ok: false, message: 'En el controlador usa `$this->authorize("update", $post)` para invocar la Policy automáticamente.' }
      if (!/\$request->validate\s*\(/i.test(code))
        return { ok: false, message: 'Valida los datos con `$request->validate([...])` antes de actualizar.' }
      if (!/'titulo'\s*=>\s*['"]required/.test(code) && !/"titulo"\s*=>\s*['"]required/.test(code))
        return { ok: false, message: 'Incluye la regla `"titulo" => "required|string"` en la validación.' }
      if (!/\$post->update\s*\(/i.test(code))
        return { ok: false, message: 'Actualiza el post con `$post->update($validados)`.' }
      if (!/redirect\s*\(\s*\)->route\s*\(\s*['"]posts\.show['"]/i.test(code))
        return { ok: false, message: 'Redirige a `route("posts.show", $post)` después de actualizar.' }
      if (!/->with\s*\(\s*['"]exito['"]/i.test(code))
        return { ok: false, message: 'Añade el mensaje flash `->with("exito", "...")` en el redirect.' }
      return { ok: true, message: '¡Policy completa! La Policy encapsula la lógica de "quién puede hacer qué" en un solo lugar — si las reglas cambian, solo editas la Policy y todo el sistema se actualiza.' }
    },
  },
]
