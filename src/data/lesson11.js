export const lesson = {
  id: 'lesson-11',
  title: 'Base de datos con Eloquent ORM',
  subtitle: 'Lección 11 — Fase 4: PHP & Laravel',
  language: 'php',
  sections: [
    {
      id: 's1',
      title: 'Migraciones: make:migration, up() y down()',
      content: `Las **migraciones** son control de versiones para tu base de datos. Cada migración define cómo crear o modificar tablas con PHP, sin escribir SQL directamente. Viven en \`database/migrations/\`.

**Crear una migración:**
\`\`\`bash
php artisan make:migration create_posts_table          # nueva tabla
php artisan make:migration add_publicado_to_posts_table # columna nueva
php artisan make:migration create_posts_table --create=posts  # con scaffold
\`\`\`

**Estructura de una migración:**
\`\`\`php
public function up(): void   // ← se ejecuta con php artisan migrate
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();                          // BIGINT UNSIGNED PK auto-increment
        $table->string('titulo', 255);
        $table->text('contenido');
        $table->boolean('publicado')->default(false);
        $table->timestamp('publicado_en')->nullable();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->timestamps();                  // created_at + updated_at
    });
}

public function down(): void // ← se ejecuta con php artisan migrate:rollback
{
    Schema::dropIfExists('posts');
}
\`\`\`

**Tipos de columna más usados:**
| Método | SQL |
|--------|-----|
| \`id()\` | BIGINT UNSIGNED PK AI |
| \`string('nombre', 100)\` | VARCHAR(100) |
| \`text('contenido')\` | TEXT |
| \`integer('orden')\` | INT |
| \`unsignedBigInteger('user_id')\` | BIGINT UNSIGNED |
| \`boolean('activo')\` | TINYINT(1) |
| \`decimal('precio', 8, 2)\` | DECIMAL(8,2) |
| \`enum('estado', ['activo','inactivo'])\` | ENUM |
| \`json('metadata')\` | JSON |
| \`timestamp('publicado_en')\` | TIMESTAMP |
| \`timestamps()\` | created_at + updated_at |
| \`softDeletes()\` | deleted_at (borrado lógico) |

**Modificadores de columna:**
\`\`\`php
->nullable()         // permite NULL
->default('valor')   // valor por defecto
->unique()           // índice único
->index()            // índice para búsquedas
->after('columna')   // posición en MySQL
\`\`\`

**Comandos de migración:**
\`\`\`bash
php artisan migrate              # ejecutar nuevas migraciones
php artisan migrate:rollback     # deshacer último lote
php artisan migrate:rollback --step=3  # deshacer últimos 3 lotes
php artisan migrate:fresh        # borrar todo y migrar desde cero
php artisan migrate:fresh --seed # ídem + ejecutar seeders
php artisan migrate:status       # ver estado de migraciones
\`\`\``,
      example: `<?php
// ─── database/migrations/2024_01_01_000001_create_posts_table.php ───

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            // Clave foránea a users — crea user_id + FK automáticamente
            $table->foreignId('user_id')
                  ->constrained()        // references users(id)
                  ->cascadeOnDelete();   // ON DELETE CASCADE

            $table->string('titulo');
            $table->string('slug')->unique();
            $table->text('extracto')->nullable();
            $table->longText('contenido');

            $table->enum('estado', ['borrador', 'revision', 'publicado'])
                  ->default('borrador');

            $table->boolean('destacado')->default(false);
            $table->unsignedInteger('vistas')->default(0);
            $table->timestamp('publicado_en')->nullable();

            $table->timestamps();   // created_at + updated_at
            $table->softDeletes();  // deleted_at — borrado lógico
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};

// ─── database/migrations/..._create_etiquetas_table.php ───
// (Tabla pivot para relación many-to-many post ↔ etiqueta)

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('etiquetas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('slug')->unique();
            $table->string('color', 7)->default('#6b7280'); // hex
            $table->timestamps();
        });

        // Tabla pivot: etiqueta_post (orden alfabético por convención)
        Schema::create('etiqueta_post', function (Blueprint $table) {
            $table->foreignId('etiqueta_id')->constrained()->cascadeOnDelete();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->primary(['etiqueta_id', 'post_id']); // clave primaria compuesta
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('etiqueta_post');
        Schema::dropIfExists('etiquetas');
    }
};`,
    },
    {
      id: 's2',
      title: 'Modelos Eloquent: make:model, $fillable y $casts',
      content: `Los **modelos Eloquent** representan una tabla de la base de datos. Cada instancia es una fila. Viven en \`app/Models/\`.

**Crear modelos con Artisan:**
\`\`\`bash
php artisan make:model Post                  # solo el modelo
php artisan make:model Post -m               # + migración
php artisan make:model Post -mfc             # + migración + factory + controller
php artisan make:model Post --all            # + todo
\`\`\`

**Propiedades clave del modelo:**
\`\`\`php
class Post extends Model
{
    // Columnas que se pueden asignar masivamente (create/fill)
    protected $fillable = ['titulo', 'contenido', 'estado', 'user_id'];

    // Alternativa: todo excepto lo listado (prefiere $fillable)
    // protected $guarded = ['id'];

    // Conversión automática de tipos al leer de la BD
    protected $casts = [
        'publicado_en' => 'datetime',
        'destacado'    => 'boolean',
        'vistas'       => 'integer',
        'metadata'     => 'array',       // JSON → array PHP
    ];

    // Si la tabla no sigue la convención (plural del modelo)
    // protected $table = 'mis_posts';

    // Si no quieres timestamps automáticos
    // public $timestamps = false;
}
\`\`\`

**Convenciones de Eloquent** — si las sigues, no necesitas configurar nada:
| Modelo | Tabla | PK | FK en otras tablas |
|--------|-------|----|--------------------|
| \`Post\` | \`posts\` | \`id\` | \`post_id\` |
| \`UserProfile\` | \`user_profiles\` | \`id\` | \`user_profile_id\` |

**Accesores y mutadores** (transformar al leer/escribir):
\`\`\`php
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;

// Accesor: $post->titulo_mayusculas
protected function tituloMayusculas(): Attribute
{
    return Attribute::make(
        get: fn () => strtoupper($this->titulo),
    );
}

// Mutador: normaliza al guardar
protected function slug(): Attribute
{
    return Attribute::make(
        set: fn (string $value) => Str::slug($value),
    );
}
\`\`\``,
      example: `<?php
// ─── app/Models/Post.php ───

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;
use Illuminate\\Support\\Str;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    // ── Asignación masiva permitida ──
    protected $fillable = [
        'user_id', 'titulo', 'slug',
        'extracto', 'contenido',
        'estado', 'destacado', 'publicado_en',
    ];

    // ── Conversión de tipos automática ──
    protected $casts = [
        'publicado_en' => 'datetime',
        'destacado'    => 'boolean',
        'vistas'       => 'integer',
        'metadata'     => 'array',
    ];

    // ── Atributos ocultos para serialización (toArray/JSON) ──
    protected $hidden = ['deleted_at'];

    // ── Accesor: $post->resumen (primeros 160 chars del contenido) ──
    protected function resumen(): Attribute
    {
        return Attribute::make(
            get: fn () => Str::limit(strip_tags($this->contenido), 160),
        );
    }

    // ── Mutador: auto-genera slug al asignar titulo ──
    protected function titulo(): Attribute
    {
        return Attribute::make(
            set: function (string $value) {
                $this->attributes['titulo'] = $value;
                $this->attributes['slug']   = Str::slug($value);
            },
        );
    }

    // ── Comprobación rápida de estado ──
    public function estaPublicado(): bool
    {
        return $this->estado === 'publicado';
    }
}`,
    },
    {
      id: 's3',
      title: 'CRUD con Eloquent: create, find, update, delete',
      content: `Eloquent proporciona una API fluida para todas las operaciones de base de datos.

**Crear registros:**
\`\`\`php
// create() — asignación masiva (requiere $fillable)
$post = Post::create([
    'titulo'    => 'Mi primer post',
    'contenido' => 'Hola mundo',
    'user_id'   => 1,
]);

// new + save() — útil para lógica antes de guardar
$post = new Post;
$post->titulo    = 'Mi post';
$post->contenido = 'Contenido';
$post->save();

// firstOrCreate — busca o crea
$etiqueta = Etiqueta::firstOrCreate(
    ['slug' => 'php'],
    ['nombre' => 'PHP', 'color' => '#7c3aed']
);
\`\`\`

**Leer registros:**
\`\`\`php
Post::all();                          // todos (¡cuidado en tablas grandes!)
Post::find(1);                        // por PK, null si no existe
Post::findOrFail(1);                  // por PK, lanza 404 si no existe
Post::where('estado', 'publicado')->get();  // colección filtrada
Post::where('estado', 'publicado')->first(); // primer resultado o null
Post::count();                        // número de filas
Post::latest()->take(5)->get();       // últimos 5 ordenados por created_at
\`\`\`

**Actualizar registros:**
\`\`\`php
// update() en instancia
$post = Post::findOrFail(1);
$post->update(['titulo' => 'Nuevo título', 'estado' => 'publicado']);

// Actualizar masivamente con where
Post::where('user_id', 3)->update(['estado' => 'borrador']);

// Incrementar / decrementar sin cargar el modelo
Post::where('id', 1)->increment('vistas');
Post::where('id', 1)->increment('vistas', 5);
\`\`\`

**Eliminar registros:**
\`\`\`php
$post = Post::findOrFail(1);
$post->delete();                     // borrado real (o lógico con SoftDeletes)

Post::destroy(1);                    // por PK sin cargar modelo
Post::destroy([1, 2, 3]);            // varios

// Con SoftDeletes activo:
Post::withTrashed()->find(1);        // incluye borrados lógicos
Post::onlyTrashed()->get();          // solo borrados
$post->restore();                    // recuperar
$post->forceDelete();                // borrado real definitivo
\`\`\``,
      example: `<?php
// ─── app/Http/Controllers/PostController.php — métodos CRUD ───

namespace App\\Http\\Controllers;

use App\\Models\\Post;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\View\\View;

class PostController extends Controller
{
    // ── Listar ──
    public function index(): View
    {
        // Paginación de 15 posts ordenados del más nuevo al más viejo
        $posts = Post::latest()->paginate(15);
        return view('posts.index', compact('posts'));
    }

    // ── Crear ──
    public function store(Request $request): RedirectResponse
    {
        $validados = $request->validate([
            'titulo'    => 'required|string|max:255',
            'contenido' => 'required|string',
            'estado'    => 'required|in:borrador,revision,publicado',
        ]);

        // Añadir datos que no vienen del formulario
        $validados['user_id']     = auth()->id();
        $validados['publicado_en'] = $validados['estado'] === 'publicado'
            ? now()
            : null;

        $post = Post::create($validados);

        return redirect()
            ->route('posts.show', $post)
            ->with('exito', 'Post creado correctamente.');
    }

    // ── Actualizar ──
    public function update(Request $request, Post $post): RedirectResponse
    {
        // Autorización: solo el autor puede editar
        abort_if($post->user_id !== auth()->id(), 403);

        $validados = $request->validate([
            'titulo'    => 'required|string|max:255',
            'contenido' => 'required|string',
        ]);

        // Publicar si cambia el estado
        if ($request->estado === 'publicado' && !$post->publicado_en) {
            $validados['publicado_en'] = now();
        }

        $post->update($validados);

        return redirect()
            ->route('posts.show', $post)
            ->with('exito', 'Post actualizado.');
    }

    // ── Incrementar vistas (sin cargar el modelo completo) ──
    public function verPost(Post $post): View
    {
        Post::where('id', $post->id)->increment('vistas');
        return view('posts.show', compact('post'));
    }

    // ── Eliminar (soft delete) ──
    public function destroy(Post $post): RedirectResponse
    {
        abort_if($post->user_id !== auth()->id(), 403);

        $post->delete(); // soft delete — registra deleted_at

        return redirect()
            ->route('posts.index')
            ->with('exito', 'Post eliminado.');
    }
}`,
    },
    {
      id: 's4',
      title: 'Relaciones: hasMany, belongsTo, belongsToMany',
      content: `Eloquent maneja relaciones entre modelos con métodos simples. Laravel infiere los nombres de las claves foráneas automáticamente.

**Una a muchos (1:N):**
\`\`\`php
// User tiene muchos Posts
class User extends Model {
    public function posts(): HasMany {
        return $this->hasMany(Post::class);
        // asume foreign key: post.user_id
    }
}

// Post pertenece a un User
class Post extends Model {
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
        // asume foreign key: post.user_id
    }
}
\`\`\`

**Usar las relaciones:**
\`\`\`php
$usuario = User::find(1);
$usuario->posts;                   // colección de posts (lazy loading)
$usuario->posts()->count();        // query COUNT, sin cargar todos
$usuario->posts()->where('estado', 'publicado')->get();

$post = Post::find(1);
$post->user;                       // el User dueño del post
$post->user->name;                 // nombre del autor
\`\`\`

**Muchos a muchos (N:M):**
\`\`\`php
// Post tiene muchas Etiquetas (y viceversa)
class Post extends Model {
    public function etiquetas(): BelongsToMany {
        return $this->belongsToMany(Etiqueta::class);
        // tabla pivot: etiqueta_post (alfabético)
    }
}

class Etiqueta extends Model {
    public function posts(): BelongsToMany {
        return $this->belongsToMany(Post::class);
    }
}
\`\`\`

**Sincronizar tabla pivot:**
\`\`\`php
$post->etiquetas()->attach([1, 2, 3]);    // añadir
$post->etiquetas()->detach([2]);          // quitar
$post->etiquetas()->sync([1, 3]);         // reemplazar (borra los demás)
\`\`\`

**Eager Loading — evitar el problema N+1:**
\`\`\`php
// ❌ N+1: 1 query + 1 por cada post
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name; // query por cada post
}

// ✅ Eager loading: 2 queries en total
$posts = Post::with('user')->get();
$posts = Post::with(['user', 'etiquetas'])->get();
$posts = Post::with('user:id,name')->get(); // solo columnas necesarias
\`\`\``,
      example: `<?php
// ─── app/Models/User.php — relaciones ───

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;

class User extends Authenticatable
{
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(Comentario::class);
    }
}

// ─── app/Models/Post.php — relaciones ───

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;

class Post extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(Comentario::class);
    }

    public function etiquetas(): BelongsToMany
    {
        return $this->belongsToMany(Etiqueta::class)
            ->withTimestamps(); // registrar created_at/updated_at en pivot
    }
}

// ─── Uso en un controlador ───

class PostController extends Controller
{
    public function index(): \\Illuminate\\View\\View
    {
        // Eager loading de relaciones — evita N+1
        $posts = Post::with(['user:id,name', 'etiquetas'])
            ->where('estado', 'publicado')
            ->latest('publicado_en')
            ->paginate(10);

        return view('posts.index', compact('posts'));
    }

    public function store(Request $request): \\Illuminate\\Http\\RedirectResponse
    {
        $post = Post::create([
            'user_id'   => auth()->id(),
            'titulo'    => $request->titulo,
            'contenido' => $request->contenido,
            'estado'    => 'borrador',
        ]);

        // Sincronizar etiquetas en la tabla pivot
        $post->etiquetas()->sync($request->input('etiquetas', []));

        return redirect()->route('posts.show', $post);
    }
}

// ─── En una vista Blade ───
// @foreach($posts as $post)
//     <h2>{{ $post->titulo }}</h2>
//     <p>Por: {{ $post->user->name }}</p>
//     @foreach($post->etiquetas as $etiqueta)
//         <span style="background:{{ $etiqueta->color }}">{{ $etiqueta->nombre }}</span>
//     @endforeach
// @endforeach`,
    },
    {
      id: 's5',
      title: 'Seeders y Factories para datos de prueba',
      content: `Los **seeders** poblan la base de datos con datos iniciales. Las **factories** generan datos falsos realistas usando Faker.

**Crear seeder y factory:**
\`\`\`bash
php artisan make:seeder PostSeeder
php artisan make:factory PostFactory --model=Post
\`\`\`

**Factory — definir datos falsos:**
\`\`\`php
// database/factories/PostFactory.php
class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'    => User::factory(), // crea un User relacionado
            'titulo'     => fake()->sentence(6),
            'slug'       => fake()->unique()->slug(),
            'contenido'  => fake()->paragraphs(4, true),
            'estado'     => fake()->randomElement(['borrador', 'publicado']),
            'destacado'  => fake()->boolean(20), // 20% de probabilidad true
            'publicado_en' => fake()->optional(0.7)->dateTimeBetween('-1 year'),
        ];
    }

    // Estado personalizado — Post::factory()->publicado()->make()
    public function publicado(): static
    {
        return $this->state(['estado' => 'publicado', 'publicado_en' => now()]);
    }
}
\`\`\`

**Seeder — llamar a las factories:**
\`\`\`php
// database/seeders/PostSeeder.php
class PostSeeder extends Seeder
{
    public function run(): void
    {
        // Crear 10 users, cada uno con 5 posts publicados
        User::factory(10)
            ->has(Post::factory(5)->publicado())
            ->create();
    }
}
\`\`\`

**DatabaseSeeder — orchestrar todos los seeders:**
\`\`\`php
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            PostSeeder::class,
            EtiquetaSeeder::class,
        ]);
    }
}
\`\`\`

**Ejecutar seeders:**
\`\`\`bash
php artisan db:seed                        # ejecutar DatabaseSeeder
php artisan db:seed --class=PostSeeder    # seeder específico
php artisan migrate:fresh --seed          # migrar desde cero + seed
\`\`\``,
      example: `<?php
// ─── database/factories/PostFactory.php ───

namespace Database\\Factories;

use App\\Models\\User;
use Illuminate\\Database\\Eloquent\\Factories\\Factory;
use Illuminate\\Support\\Str;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $titulo = fake()->sentence(rand(4, 8));

        return [
            'user_id'      => User::factory(),
            'titulo'       => rtrim($titulo, '.'),
            'slug'         => Str::slug($titulo) . '-' . fake()->unique()->numberBetween(1, 9999),
            'extracto'     => fake()->paragraph(2),
            'contenido'    => implode("\\n\\n", fake()->paragraphs(6)),
            'estado'       => fake()->randomElement(['borrador', 'borrador', 'publicado']),
            'destacado'    => fake()->boolean(15),
            'vistas'       => fake()->numberBetween(0, 10000),
            'publicado_en' => null,
        ];
    }

    // ── Estados personalizados ──

    public function publicado(): static
    {
        return $this->state([
            'estado'       => 'publicado',
            'publicado_en' => fake()->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    public function destacado(): static
    {
        return $this->state(['destacado' => true]);
    }
}

// ─── database/seeders/DatabaseSeeder.php ───

namespace Database\\Seeders;

use App\\Models\\{User, Post, Etiqueta};
use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Usuario administrador fijo ──
        User::factory()->create([
            'name'  => 'Admin',
            'email' => 'admin@devnodo.test',
        ]);

        // ── 5 usuarios con posts variados ──
        User::factory(5)
            ->has(
                Post::factory(8)->publicado(),
                'posts'
            )
            ->has(
                Post::factory(3), // borradores
                'posts'
            )
            ->create();

        // ── Etiquetas base ──
        $etiquetas = Etiqueta::factory()->createMany([
            ['nombre' => 'PHP',        'slug' => 'php',        'color' => '#7c3aed'],
            ['nombre' => 'Laravel',    'slug' => 'laravel',    'color' => '#dc2626'],
            ['nombre' => 'JavaScript', 'slug' => 'javascript', 'color' => '#d97706'],
            ['nombre' => 'Tutoriales', 'slug' => 'tutoriales', 'color' => '#059669'],
        ]);

        // ── Asignar etiquetas aleatorias a los posts publicados ──
        Post::where('estado', 'publicado')
            ->get()
            ->each(function (Post $post) use ($etiquetas) {
                $post->etiquetas()->sync(
                    $etiquetas->random(rand(1, 3))->pluck('id')
                );
            });

        $this->command->info('Base de datos sembrada con éxito.');
    }
}`,
    },
    {
      id: 's6',
      title: 'Query Builder y Scopes',
      content: `El **Query Builder** de Laravel permite construir queries complejas de forma fluida. Los **scopes** encapsulan condiciones reutilizables dentro del modelo.

**Query Builder — filtros y orden:**
\`\`\`php
Post::where('estado', 'publicado')
    ->where('destacado', true)
    ->orWhere('vistas', '>', 1000)
    ->whereNull('deleted_at')
    ->whereBetween('publicado_en', [$inicio, $fin])
    ->whereIn('estado', ['publicado', 'revision'])
    ->orderBy('publicado_en', 'desc')
    ->orderByDesc('vistas')
    ->latest()          // shorthand de orderBy('created_at', 'desc')
    ->oldest()
    ->skip(10)->take(5) // offset + limit
    ->select('id', 'titulo', 'user_id')
    ->get();
\`\`\`

**Agregaciones:**
\`\`\`php
Post::count();
Post::where('estado', 'publicado')->count();
Post::max('vistas');
Post::avg('vistas');
Post::sum('vistas');
Post::groupBy('estado')
    ->selectRaw('estado, count(*) as total')
    ->get();
\`\`\`

**Local Scopes** — condiciones reutilizables dentro del modelo:
\`\`\`php
class Post extends Model
{
    // Scope: Post::publicados()->get()
    public function scopePublicados(Builder $query): Builder
    {
        return $query->where('estado', 'publicado');
    }

    // Scope con parámetro: Post::recientes(7)->get()
    public function scopeRecientes(Builder $query, int $dias = 30): Builder
    {
        return $query->where('publicado_en', '>=', now()->subDays($dias));
    }

    // Scope encadenables
    public function scopeDestacados(Builder $query): Builder
    {
        return $query->where('destacado', true);
    }
}

// Uso — scopes son encadenables con otros métodos
Post::publicados()->destacados()->recientes(7)->with('user')->get();
\`\`\`

**Global Scope** — se aplica automáticamente a todas las queries del modelo:
\`\`\`php
// En el modelo:
protected static function booted(): void
{
    // Nunca mostrar posts borrador en producción
    static::addGlobalScope('publicados', function (Builder $builder) {
        $builder->where('estado', '!=', 'borrador');
    });
}
\`\`\``,
      example: `<?php
// ─── app/Models/Post.php — scopes ───

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Builder;

class Post extends Model
{
    // ── Local Scopes ──

    public function scopePublicados(Builder $query): Builder
    {
        return $query->where('estado', 'publicado')
                     ->whereNotNull('publicado_en');
    }

    public function scopeDestacados(Builder $query): Builder
    {
        return $query->where('destacado', true);
    }

    public function scopeDeAutor(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecientes(Builder $query, int $dias = 30): Builder
    {
        return $query->where('publicado_en', '>=', now()->subDays($dias));
    }

    public function scopeBuscar(Builder $query, string $termino): Builder
    {
        return $query->where(function (Builder $q) use ($termino) {
            $q->where('titulo', 'like', "%{$termino}%")
              ->orWhere('contenido', 'like', "%{$termino}%");
        });
    }
}

// ─── Uso en un controlador ───

class PostController extends Controller
{
    public function index(Request $request): \\Illuminate\\View\\View
    {
        $query = Post::publicados()->with(['user:id,name', 'etiquetas']);

        // Filtros opcionales encadenados
        if ($request->filled('buscar')) {
            $query->buscar($request->buscar);
        }

        if ($request->boolean('destacados')) {
            $query->destacados();
        }

        if ($request->filled('autor')) {
            $query->deAutor($request->autor);
        }

        $posts = $query->latest('publicado_en')->paginate(12);

        return view('posts.index', compact('posts'));
    }

    // ── Estadísticas con Query Builder ──
    public function estadisticas(): \\Illuminate\\View\\View
    {
        $stats = [
            'total'      => Post::publicados()->count(),
            'destacados' => Post::publicados()->destacados()->count(),
            'vistas'     => Post::publicados()->sum('vistas'),
            'promedio'   => Post::publicados()->avg('vistas'),

            // Posts por estado
            'por_estado' => Post::selectRaw('estado, count(*) as total')
                ->groupBy('estado')
                ->pluck('total', 'estado'),

            // Top 5 más vistos
            'top_posts'  => Post::publicados()
                ->with('user:id,name')
                ->orderByDesc('vistas')
                ->take(5)
                ->get(['id', 'titulo', 'vistas', 'user_id']),
        ];

        return view('posts.estadisticas', compact('stats'));
    }
}`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Escribir una migración',
    description: 'Escribe el método `up()` de una migración que cree la tabla `comentarios` con: `id()`, clave foránea `user_id` con `constrained()` y `cascadeOnDelete()`, clave foránea `post_id` con `constrained()` y `cascadeOnDelete()`, columna `contenido` de tipo `text`, columna `aprobado` de tipo `boolean` con valor por defecto `false`, y `timestamps()`.',
    hint: 'Schema::create("comentarios", function (Blueprint $table) { ... }). foreignId("user_id")->constrained()->cascadeOnDelete(). boolean("aprobado")->default(false).',
    starterCode: `<?php
// database/migrations/..._create_comentarios_table.php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Crea la tabla "comentarios" con:
        // - id()
        // - FK user_id (constrained + cascadeOnDelete)
        // - FK post_id (constrained + cascadeOnDelete)
        // - texto: contenido (text)
        // - booleano: aprobado (default false)
        // - timestamps()
    }

    public function down(): void
    {
        Schema::dropIfExists('comentarios');
    }
};
`,
    validate(_output, code) {
      if (!/Schema::create\s*\(\s*['"]comentarios['"]/i.test(code))
        return { ok: false, message: 'Usa `Schema::create("comentarios", ...)` para crear la tabla.' }
      if (!/\$table->id\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Añade `$table->id()` como clave primaria.' }
      if (!/foreignId\s*\(\s*['"]user_id['"]\s*\)/i.test(code))
        return { ok: false, message: 'Define la FK `user_id` con `$table->foreignId("user_id")`.' }
      if (!/foreignId\s*\(\s*['"]post_id['"]\s*\)/i.test(code))
        return { ok: false, message: 'Define la FK `post_id` con `$table->foreignId("post_id")`.' }
      if ((code.match(/->constrained\s*\(\s*\)/g) || []).length < 2)
        return { ok: false, message: 'Añade `->constrained()` a ambas claves foráneas (user_id y post_id).' }
      if ((code.match(/->cascadeOnDelete\s*\(\s*\)/g) || []).length < 2)
        return { ok: false, message: 'Añade `->cascadeOnDelete()` a ambas FKs para que los comentarios se eliminen si se elimina el usuario o el post.' }
      if (!/\$table->text\s*\(\s*['"]contenido['"]\s*\)/i.test(code))
        return { ok: false, message: 'Añade `$table->text("contenido")` para el cuerpo del comentario.' }
      if (!/\$table->boolean\s*\(\s*['"]aprobado['"]\s*\)/i.test(code))
        return { ok: false, message: 'Añade `$table->boolean("aprobado")` para el estado de moderación.' }
      if (!/->default\s*\(\s*false\s*\)/i.test(code))
        return { ok: false, message: 'El campo `aprobado` debe tener `->default(false)` — los comentarios no se aprueban solos.' }
      if (!/\$table->timestamps\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Añade `$table->timestamps()` para registrar cuándo se creó/actualizó cada comentario.' }
      return { ok: true, message: '¡Migración perfecta! id + FKs con cascade + columnas tipadas + timestamps — esta es la estructura estándar de una tabla relacional en Laravel.' }
    },
  },
  {
    id: 'ex2',
    title: 'Modelo Eloquent con $fillable, $casts y relación',
    description: 'Escribe el modelo `Comentario` que: (1) use el trait `HasFactory`, (2) tenga `$fillable` con `["user_id", "post_id", "contenido", "aprobado"]`, (3) tenga `$casts` con `"aprobado"` casteado a `"boolean"`, (4) defina el método `user()` que retorne `$this->belongsTo(User::class)`, (5) defina el método `post()` que retorne `$this->belongsTo(Post::class)`.',
    hint: 'use HasFactory. protected $fillable = [...]. protected $casts = ["aprobado" => "boolean"]. public function user(): BelongsTo { return $this->belongsTo(User::class); }',
    starterCode: `<?php
// app/Models/Comentario.php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Comentario extends Model
{
    // 1. Trait HasFactory

    // 2. $fillable: user_id, post_id, contenido, aprobado

    // 3. $casts: aprobado → boolean

    // 4. Relación: user() → belongsTo(User::class)

    // 5. Relación: post() → belongsTo(Post::class)
}
`,
    validate(_output, code) {
      if (!/use\s+HasFactory\s*;/i.test(code))
        return { ok: false, message: 'Añade `use HasFactory;` dentro de la clase para poder usar factories en tests.' }
      if (!/\$fillable\s*=/i.test(code))
        return { ok: false, message: 'Define la propiedad `protected $fillable` con las columnas permitidas.' }
      if (!/'user_id'/.test(code) && !/"user_id"/.test(code))
        return { ok: false, message: 'Incluye `"user_id"` en `$fillable`.' }
      if (!/'post_id'/.test(code) && !/"post_id"/.test(code))
        return { ok: false, message: 'Incluye `"post_id"` en `$fillable`.' }
      if (!/'contenido'/.test(code) && !/"contenido"/.test(code))
        return { ok: false, message: 'Incluye `"contenido"` en `$fillable`.' }
      if (!/\$casts\s*=/i.test(code))
        return { ok: false, message: 'Define `protected $casts` para convertir tipos automáticamente.' }
      if (!/'aprobado'\s*=>\s*'boolean'/.test(code) && !/"aprobado"\s*=>\s*"boolean"/.test(code))
        return { ok: false, message: 'Añade `"aprobado" => "boolean"` en `$casts` para que Laravel lo convierta a bool al leer.' }
      if (!/function\s+user\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Define el método `user()` para la relación con el modelo User.' }
      if (!/belongsTo\s*\(\s*User::class\s*\)/i.test(code))
        return { ok: false, message: 'El método `user()` debe retornar `$this->belongsTo(User::class)`.' }
      if (!/function\s+post\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Define el método `post()` para la relación con el modelo Post.' }
      if (!/belongsTo\s*\(\s*Post::class\s*\)/i.test(code))
        return { ok: false, message: 'El método `post()` debe retornar `$this->belongsTo(Post::class)`.' }
      return { ok: true, message: '¡Modelo Eloquent completo! HasFactory + $fillable + $casts + relaciones — la receta estándar de cualquier modelo en Laravel.' }
    },
  },
  {
    id: 'ex3',
    title: 'CRUD con Eloquent',
    description: 'Escribe cuatro fragmentos de código Eloquent: (1) crear un comentario con `Comentario::create()` pasando `user_id`, `post_id` y `contenido`, (2) buscar un comentario por ID con `findOrFail()`, (3) aprobar ese comentario con `update(["aprobado" => true])`, (4) eliminar todos los comentarios no aprobados de un post con `where(...)->delete()`.',
    hint: 'Comentario::create([...]). $com = Comentario::findOrFail($id). $com->update(["aprobado" => true]). Comentario::where("post_id", $postId)->where("aprobado", false)->delete().',
    starterCode: `<?php
// Fragmentos de CRUD con el modelo Comentario

// 1. Crear un comentario (create con user_id=1, post_id=5, contenido="Excelente artículo")

// 2. Buscar el comentario con id=1 (lanza 404 si no existe)

// 3. Actualizar el comentario encontrado: aprobado = true

// 4. Eliminar todos los comentarios NO aprobados del post con id=5
`,
    validate(_output, code) {
      if (!/Comentario::create\s*\(/i.test(code))
        return { ok: false, message: 'Usa `Comentario::create([...])` para crear el comentario.' }
      if (!/user_id/i.test(code))
        return { ok: false, message: 'El array de `create()` debe incluir `"user_id"`.' }
      if (!/post_id/i.test(code))
        return { ok: false, message: 'El array de `create()` debe incluir `"post_id"`.' }
      if (!/contenido/i.test(code))
        return { ok: false, message: 'El array de `create()` debe incluir `"contenido"`.' }
      if (!/findOrFail\s*\(/i.test(code))
        return { ok: false, message: 'Usa `Comentario::findOrFail($id)` para buscar — genera 404 automáticamente si no existe.' }
      if (!/->update\s*\(\s*\[/i.test(code))
        return { ok: false, message: 'Usa `$comentario->update(["aprobado" => true])` para aprobar el comentario.' }
      if (!/'aprobado'\s*=>\s*true/.test(code) && !/"aprobado"\s*=>\s*true/.test(code))
        return { ok: false, message: 'El `update()` debe incluir `"aprobado" => true`.' }
      if (!/->where\s*\(.*aprobado.*\)->delete\s*\(\s*\)/i.test(code) && !/->where.*aprobado.*\n.*->delete/i.test(code))
        return { ok: false, message: 'Usa `Comentario::where("post_id", ...)->where("aprobado", false)->delete()` para eliminar masivamente.' }
      return { ok: true, message: '¡CRUD Eloquent dominado! create + findOrFail + update + where->delete — las cuatro operaciones fundamentales con el ORM de Laravel.' }
    },
  },
  {
    id: 'ex4',
    title: 'Relaciones y eager loading',
    description: 'En el modelo `Post`, define: (1) el método `comentarios()` que retorne `hasMany(Comentario::class)`, (2) el método `etiquetas()` que retorne `belongsToMany(Etiqueta::class)`. Luego escribe una query que obtenga los 10 posts más recientes con eager loading de `user` (solo columnas `id,name`) y `comentarios`, usando `with()`.',
    hint: 'public function comentarios(): HasMany { return $this->hasMany(Comentario::class); }. Post::with(["user:id,name", "comentarios"])->latest()->take(10)->get()',
    starterCode: `<?php
// Parte 1: en el modelo Post, define las dos relaciones

class Post extends Model
{
    // 1. Relación hasMany con Comentario

    // 2. Relación belongsToMany con Etiqueta
}

// ──────────────────────────────────────────

// Parte 2: query con eager loading
// Obtener los 10 posts más recientes
// cargando relaciones: user (solo id,name) y comentarios
$posts = // escribe aquí la query
`,
    validate(_output, code) {
      if (!/function\s+comentarios\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Define el método `comentarios()` en el modelo Post.' }
      if (!/hasMany\s*\(\s*Comentario::class\s*\)/i.test(code))
        return { ok: false, message: '`comentarios()` debe retornar `$this->hasMany(Comentario::class)`.' }
      if (!/function\s+etiquetas\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Define el método `etiquetas()` en el modelo Post.' }
      if (!/belongsToMany\s*\(\s*Etiqueta::class\s*\)/i.test(code))
        return { ok: false, message: '`etiquetas()` debe retornar `$this->belongsToMany(Etiqueta::class)`.' }
      if (!/Post::with\s*\(/i.test(code))
        return { ok: false, message: 'Usa `Post::with([...])` para hacer eager loading y evitar el problema N+1.' }
      if (!/user:id,name/.test(code) && !/'user'\s*,/.test(code) && !/"user"/.test(code))
        return { ok: false, message: 'Carga la relación `user` en el `with()`. Usa `"user:id,name"` para traer solo las columnas necesarias.' }
      if (!/'comentarios'/.test(code) && !/"comentarios"/.test(code))
        return { ok: false, message: 'Incluye `"comentarios"` en el `with()` para cargarlos junto con los posts.' }
      if (!/->latest\s*\(\s*\)/i.test(code) && !/->orderBy\s*\(\s*['"]created_at['"]/i.test(code))
        return { ok: false, message: 'Ordena por fecha descendente con `->latest()` o `->orderBy("created_at", "desc")`.' }
      if (!/->take\s*\(\s*10\s*\)/i.test(code) && !/->limit\s*\(\s*10\s*\)/i.test(code))
        return { ok: false, message: 'Limita a 10 resultados con `->take(10)`.' }
      return { ok: true, message: '¡Relaciones y eager loading correctos! Con with() cargas todo en 2 queries en vez de N+1 — la diferencia entre una app rápida y una que escala mal.' }
    },
  },
  {
    id: 'ex5',
    title: 'Scope y Query Builder',
    description: 'En el modelo `Post`, define un local scope `scopeAprobados` que filtre `where("estado", "publicado")` y `whereNotNull("publicado_en")`. Luego escribe una query usando ese scope encadenada con: filtro `where("destacado", true)`, ordenada por `publicado_en` descendente, paginada de 10 en 10 con `paginate(10)`.',
    hint: 'public function scopeAprobados(Builder $query): Builder { return $query->where(...)->whereNotNull(...); }. Post::aprobados()->where("destacado", true)->orderByDesc("publicado_en")->paginate(10)',
    starterCode: `<?php
// Parte 1: define el scope en el modelo Post

use Illuminate\\Database\\Eloquent\\Builder;

class Post extends Model
{
    // Local scope "aprobados":
    // - where estado = "publicado"
    // - whereNotNull publicado_en
    public function scopeAprobados(Builder $query): Builder
    {
        // escribe el return aquí
    }
}

// ──────────────────────────────────────────

// Parte 2: usa el scope en una query
// Posts aprobados + destacados, ordenados por publicado_en desc, paginar de 10 en 10
$posts = // escribe aquí la query
`,
    validate(_output, code) {
      if (!/function\s+scopeAprobados\s*\(\s*Builder\s+\$\w+\s*\)/i.test(code))
        return { ok: false, message: 'Define `public function scopeAprobados(Builder $query): Builder` en el modelo.' }
      if (!/->where\s*\(\s*['"]estado['"]\s*,\s*['"]publicado['"]\s*\)/i.test(code))
        return { ok: false, message: 'El scope debe incluir `->where("estado", "publicado")`.' }
      if (!/->whereNotNull\s*\(\s*['"]publicado_en['"]\s*\)/i.test(code))
        return { ok: false, message: 'El scope debe incluir `->whereNotNull("publicado_en")` para excluir posts sin fecha de publicación.' }
      if (!/Post::aprobados\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Usa el scope con `Post::aprobados()` en la query.' }
      if (!/->where\s*\(\s*['"]destacado['"]\s*,\s*true\s*\)/i.test(code))
        return { ok: false, message: 'Encadena `->where("destacado", true)` para filtrar los destacados.' }
      if (!/->orderByDesc\s*\(\s*['"]publicado_en['"]\s*\)/i.test(code) && !/->orderBy\s*\(\s*['"]publicado_en['"]\s*,\s*['"]desc['"]\s*\)/i.test(code))
        return { ok: false, message: 'Ordena con `->orderByDesc("publicado_en")` para mostrar los más recientes primero.' }
      if (!/->paginate\s*\(\s*10\s*\)/i.test(code))
        return { ok: false, message: 'Pagina los resultados con `->paginate(10)` — nunca uses `->get()` en listas públicas sin límite.' }
      return { ok: true, message: '¡Scopes y Query Builder dominados! Los scopes hacen el código legible como inglés: Post::aprobados()->destacados() es mejor documentación que cualquier comentario.' }
    },
  },
]
