export const lesson = {
  id: 'lesson-9',
  title: 'PHP Moderno desde Cero',
  subtitle: 'Lección 9 — Fase 4: PHP & Laravel',
  language: 'php',
  sections: [
    {
      id: 's1',
      title: 'Sintaxis PHP 8: variables, tipos y operadores',
      content: `**PHP** es un lenguaje de scripting del lado del servidor. Cada archivo PHP comienza con \`<?php\`. El código se ejecuta en el servidor y devuelve HTML al navegador.

**Variables**: siempre empiezan con \`$\`. Sin declaración explícita de tipo por defecto (tipado dinámico), aunque PHP 8 permite tipado estricto.

**Tipos primitivos:**
| Tipo | Ejemplo |
|------|---------|
| \`string\` | \`"hola"\`, \`'mundo'\` |
| \`int\` | \`42\`, \`-7\` |
| \`float\` | \`3.14\`, \`-0.5\` |
| \`bool\` | \`true\`, \`false\` |
| \`null\` | \`null\` |
| \`array\` | \`[1, 2, 3]\`, \`["clave" => "valor"]\` |

**PHP 8 — características modernas:**
- **\`match\`** — como switch pero más seguro (comparación estricta, debe ser exhaustivo).
- **Nullsafe operator \`?->\`** — evita llamar métodos en null.
- **Named arguments** — pasar argumentos por nombre en cualquier orden.
- **Union types** — \`int|string\` como tipo.
- **Constructor property promotion** — declara y asigna propiedades en el constructor.

\`\`\`php
// Tipado estricto (recomendado)
declare(strict_types=1);

// Union types
function procesarId(int|string $id): string {
    return "ID: $id";
}

// Match expression
$estado = match($codigo) {
    200 => "OK",
    404 => "No encontrado",
    500 => "Error del servidor",
    default => "Código desconocido",
};

// Nullsafe operator
$ciudad = $usuario?->perfil?->direccion?->ciudad ?? "Sin ciudad";
\`\`\``,
      example: `<?php
declare(strict_types=1);

// ─── Variables y tipos ───
$nombre  = "DevNodo";
$version = 8.2;
$activo  = true;
$nada    = null;

echo gettype($nombre)  . ": $nombre\\n";   // string: DevNodo
echo gettype($version) . ": $version\\n";  // double: 8.2
echo gettype($activo)  . ": " . ($activo ? "true" : "false") . "\\n";

// ─── String heredoc y funciones ───
$html = <<<HTML
<h1>Hola, $nombre</h1>
HTML;

echo strlen($nombre) . "\\n";              // 7
echo strtoupper($nombre) . "\\n";          // DEVNODO
echo str_contains($nombre, "Nodo") ? "contiene 'Nodo'\\n" : "";
echo str_replace("Dev", "Aprende", $nombre) . "\\n"; // AprendeNodo

// ─── Match expression (PHP 8) ───
$nota = 85;
$calificacion = match(true) {
    $nota >= 90 => "Sobresaliente",
    $nota >= 70 => "Aprobado",
    $nota >= 50 => "Suspenso",
    default     => "Muy deficiente",
};
echo "Nota $nota: $calificacion\\n";

// ─── Named arguments (PHP 8) ───
function crearUsuario(
    string $nombre,
    int    $edad   = 25,
    bool   $activo = true
): array {
    return compact('nombre', 'edad', 'activo');
}

$u1 = crearUsuario(nombre: "Ana", activo: false);
$u2 = crearUsuario(edad: 30, nombre: "Luis");  // orden libre

print_r($u1);
print_r($u2);

// ─── Nullsafe operator (PHP 8) ───
class Direccion { public string $ciudad = "Madrid"; }
class Perfil    { public ?Direccion $direccion = null; }
class Usuario   { public ?Perfil $perfil = null; }

$usuario = new Usuario();
// Sin nullsafe: $usuario->perfil->direccion->ciudad daría Fatal Error
$ciudad = $usuario?->perfil?->direccion?->ciudad ?? "Sin ciudad";
echo "Ciudad: $ciudad\\n"; // Sin ciudad`,
    },
    {
      id: 's2',
      title: 'Funciones, arrays y control de flujo',
      content: `**Control de flujo:**
- \`if / elseif / else\` — condicionales clásicos.
- \`match\` — alternativa moderna a switch, con comparación estricta.
- \`for\`, \`foreach\`, \`while\`, \`do-while\` — bucles.
- \`break\`, \`continue\` — controlar el flujo de bucles.

**Funciones:**
\`\`\`php
// Tipado completo (PHP 8)
function sumar(int $a, int $b): int {
    return $a + $b;
}

// Valor por defecto + tipo nullable
function saludar(string $nombre, ?string $titulo = null): string {
    return "Hola, " . ($titulo ? "$titulo " : "") . $nombre;
}

// Arrow functions (PHP 7.4+) — una expresión, captura scope automáticamente
$doble = fn(int $n): int => $n * 2;
\`\`\`

**Arrays** — dos sabores:
\`\`\`php
$lista   = [1, 2, 3, 4, 5];            // indexado
$persona = ["nombre" => "Ana", "edad" => 28]; // asociativo
\`\`\`

**Funciones de array más usadas:**
| Función | Hace |
|---------|------|
| \`array_map(fn, $arr)\` | transforma cada elemento |
| \`array_filter($arr, fn)\` | filtra elementos |
| \`array_reduce($arr, fn, $init)\` | acumula un valor |
| \`in_array($val, $arr)\` | busca un valor |
| \`array_keys / array_values\` | extrae claves o valores |
| \`count($arr)\` | cuenta elementos |
| \`implode(",", $arr)\` | une a string |
| \`array_push / array_pop\` | añadir/quitar al final |`,
      example: `<?php
declare(strict_types=1);

// ─── Control de flujo ───
$numeros = range(1, 10);

foreach ($numeros as $n) {
    if ($n % 2 === 0) continue;  // saltar pares
    echo "$n ";                   // 1 3 5 7 9
}
echo "\\n";

// ─── Funciones tipadas y arrow functions ───
function potencia(float $base, int $exp = 2): float {
    return $base ** $exp;
}

$cuadrado = fn(float $n): float => $n ** 2;
$cubo     = fn(float $n): float => $n ** 3;

echo potencia(3.0) . "\\n";     // 9
echo $cuadrado(5.0) . "\\n";    // 25
echo $cubo(3.0) . "\\n";        // 27

// ─── Arrays funcionales ───
$productos = [
    ["nombre" => "Laptop",   "precio" => 1200, "stock" => 5],
    ["nombre" => "Teclado",  "precio" => 85,   "stock" => 0],
    ["nombre" => "Monitor",  "precio" => 600,  "stock" => 3],
    ["nombre" => "Ratón",    "precio" => 40,   "stock" => 8],
];

// array_filter: solo disponibles
$disponibles = array_filter($productos, fn($p) => $p['stock'] > 0);

// array_map: añadir precio con IVA
$conIva = array_map(fn($p) => [
    ...$p,
    'precio_iva' => round($p['precio'] * 1.21, 2)
], $productos);

// array_reduce: total del inventario
$totalInventario = array_reduce(
    $productos,
    fn($acc, $p) => $acc + ($p['precio'] * $p['stock']),
    0
);

echo "Disponibles: " . count($disponibles) . "\\n";  // 3
echo "Total inventario: €$totalInventario\\n";        // 6745

// usort: ordenar por precio
usort($productos, fn($a, $b) => $a['precio'] <=> $b['precio']);
foreach ($productos as $p) {
    echo "  {$p['nombre']}: €{$p['precio']}\\n";
}`,
    },
    {
      id: 's3',
      title: 'POO: clases, herencia e interfaces',
      content: `PHP tiene un sistema de POO completo. PHP 8 añadió varias mejoras de ergonomía.

**Clase básica:**
\`\`\`php
class Usuario {
    // Constructor property promotion (PHP 8) — declara y asigna en un paso
    public function __construct(
        private string $nombre,
        private string $email,
        protected int  $edad = 0,
    ) {}

    public function getNombre(): string { return $this->nombre; }

    public function __toString(): string {
        return "{$this->nombre} <{$this->email}>";
    }
}
\`\`\`

**Herencia:**
\`\`\`php
class Admin extends Usuario {
    public function __construct(
        string $nombre,
        string $email,
        private array $permisos = []
    ) {
        parent::__construct($nombre, $email);
    }
}
\`\`\`

**Interfaces** — definen un contrato sin implementación:
\`\`\`php
interface Autenticable {
    public function login(string $password): bool;
    public function logout(): void;
}

class Usuario implements Autenticable {
    public function login(string $password): bool { ... }
    public function logout(): void { ... }
}
\`\`\`

**Readonly properties (PHP 8.1)** — solo se pueden asignar una vez:
\`\`\`php
class Producto {
    public function __construct(
        public readonly int    $id,
        public readonly string $sku,
        public float           $precio, // mutable
    ) {}
}
\`\`\`

**Traits** — reutilizar métodos entre clases sin herencia:
\`\`\`php
trait Timestamps {
    public function createdAt(): string { return date('Y-m-d'); }
}
class Post { use Timestamps; }
\`\`\``,
      example: `<?php
declare(strict_types=1);

// ─── Interface ───
interface Repositorio {
    public function buscarPorId(int $id): ?array;
    public function guardar(array $datos): int;
    public function todos(): array;
}

// ─── Clase base con constructor promotion (PHP 8) ───
abstract class ModeloBase {
    public function __construct(
        public readonly ?int $id = null,
    ) {}

    abstract public function validar(): bool;

    public function toArray(): array {
        return get_object_vars($this);
    }
}

// ─── Clase concreta ───
class Tarea extends ModeloBase {
    public function __construct(
        ?int                $id       = null,
        public string       $titulo   = '',
        public string       $estado   = 'pendiente',
        public readonly string $creadoEn = '',
    ) {
        parent::__construct($id);
    }

    public function validar(): bool {
        return strlen(trim($this->titulo)) >= 3;
    }

    public function completar(): self {
        // Devuelve nueva instancia (inmutabilidad)
        return new self(
            id:       $this->id,
            titulo:   $this->titulo,
            estado:   'completada',
            creadoEn: $this->creadoEn,
        );
    }

    public function __toString(): string {
        $icono = $this->estado === 'completada' ? '✓' : '○';
        return "$icono [{$this->estado}] {$this->titulo}";
    }
}

// ─── Uso ───
$t1 = new Tarea(titulo: "Aprender PHP 8", creadoEn: date('Y-m-d'));
$t2 = new Tarea(titulo: "Instalar Composer");
$t3 = new Tarea(titulo: "Crear proyecto Laravel");

var_dump($t1->validar());  // bool(true)

$t1completada = $t1->completar();
echo $t1completada . "\\n"; // ✓ [completada] Aprender PHP 8
echo $t2 . "\\n";           // ○ [pendiente] Instalar Composer

print_r($t1completada->toArray());

// readonly: no se puede reasignar
// $t1->id = 5;  // Fatal error: Cannot modify readonly property`,
    },
    {
      id: 's4',
      title: 'Formularios y superglobales',
      content: `PHP accede a los datos enviados por el navegador a través de **superglobales** — arrays globales disponibles en cualquier parte del código.

**Superglobales principales:**
| Variable | Contiene |
|----------|----------|
| \`$_GET\` | Datos del query string (\`?clave=valor\`) |
| \`$_POST\` | Datos enviados con method="POST" |
| \`$_SERVER\` | Información del servidor y la petición |
| \`$_SESSION\` | Datos de sesión del usuario |
| \`$_COOKIE\` | Cookies enviadas por el navegador |
| \`$_FILES\` | Archivos subidos |

**Flujo típico de un formulario:**
\`\`\`php
// Detectar si el formulario fue enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Leer y sanitizar
    $nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_SPECIAL_CHARS);
    $email  = filter_input(INPUT_POST, 'email',  FILTER_VALIDATE_EMAIL);

    // Validar
    if (!$nombre || strlen($nombre) < 3) {
        $errores[] = "El nombre debe tener al menos 3 caracteres.";
    }
    if ($email === false) {
        $errores[] = "El email no es válido.";
    }

    // Procesar si no hay errores
    if (empty($errores)) {
        // guardar en BD, redirigir...
        header("Location: /gracias.php");
        exit;
    }
}
\`\`\`

**Seguridad básica obligatoria:**
- \`htmlspecialchars($val)\` — escapa HTML al mostrar datos del usuario (previene XSS).
- \`filter_input()\` — sanitiza o valida datos de entrada.
- **Nunca** insertes \`$_POST\`/\`$_GET\` directamente en SQL (usa PDO con prepared statements).
- **Token CSRF** — genera un token en la sesión y verifica que el POST lo incluya.`,
      example: `<?php
// registro.php — formulario de registro completo

session_start();

$errores  = [];
$valores  = ['nombre' => '', 'email' => '', 'edad' => ''];
$exito    = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // ─── Leer y sanitizar ───
    $nombre = trim(filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
    $email  = trim(filter_input(INPUT_POST, 'email',  FILTER_SANITIZE_EMAIL)         ?? '');
    $edad   = filter_input(INPUT_POST, 'edad', FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 18, 'max_range' => 120]
    ]);

    // Guardar para repoblar el form si hay errores
    $valores = compact('nombre', 'email') + ['edad' => $_POST['edad'] ?? ''];

    // ─── Validar ───
    if (strlen($nombre) < 3) {
        $errores['nombre'] = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores['email'] = "Introduce un email válido.";
    }
    if ($edad === false || $edad === null) {
        $errores['edad'] = "Debes tener entre 18 y 120 años.";
    }

    // ─── Token CSRF ───
    $tokenEnviado = $_POST['csrf_token'] ?? '';
    if (!hash_equals($_SESSION['csrf_token'] ?? '', $tokenEnviado)) {
        $errores['csrf'] = "Token de seguridad inválido. Recarga la página.";
    }

    // ─── Procesar si no hay errores ───
    if (empty($errores)) {
        // Aquí iría: guardar en BD, enviar email, etc.
        $exito = true;
        // header('Location: /dashboard.php');
        // exit;
    }
}

// ─── Generar token CSRF ───
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// ─── Función helper para mostrar error ───
function errorCampo(array $errores, string $campo): string {
    return isset($errores[$campo])
        ? '<span class="error">' . htmlspecialchars($errores[$campo]) . '</span>'
        : '';
}
?>
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Registro</title></head>
<body>
<?php if ($exito): ?>
    <p>¡Registro exitoso! Bienvenido, <?= htmlspecialchars($valores['nombre']) ?></p>
<?php else: ?>
<form method="POST" action="">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">

    <label>Nombre:
        <input type="text" name="nombre" value="<?= htmlspecialchars($valores['nombre']) ?>">
        <?= errorCampo($errores, 'nombre') ?>
    </label>

    <label>Email:
        <input type="email" name="email" value="<?= htmlspecialchars($valores['email']) ?>">
        <?= errorCampo($errores, 'email') ?>
    </label>

    <label>Edad:
        <input type="number" name="edad" value="<?= htmlspecialchars($valores['edad']) ?>">
        <?= errorCampo($errores, 'edad') ?>
    </label>

    <button type="submit">Registrarse</button>
</form>
<?php endif; ?>
</body>
</html>`,
    },
    {
      id: 's5',
      title: 'Conexión a base de datos con PDO',
      content: `**PDO** (PHP Data Objects) es la abstracción de base de datos estándar en PHP. Funciona con MySQL, PostgreSQL, SQLite y más, con la misma API.

**Conectar:**
\`\`\`php
$dsn = "mysql:host=localhost;dbname=mi_db;charset=utf8mb4";
$pdo = new PDO($dsn, 'usuario', 'contraseña', [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
]);
\`\`\`

**Prepared statements** — SIEMPRE para datos del usuario (previene SQL injection):
\`\`\`php
// ❌ NUNCA así (vulnerable a SQL injection)
$query = "SELECT * FROM users WHERE email = '$email'";

// ✅ Siempre con parámetros preparados
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$usuario = $stmt->fetch();

// Con parámetros nombrados
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute([':email' => $email]);
\`\`\`

**Modos de fetch:**
- \`PDO::FETCH_ASSOC\` — array asociativo (default configurado arriba).
- \`PDO::FETCH_OBJ\` — objeto stdClass.
- \`PDO::FETCH_CLASS\` — instancia de una clase propia.

**Transacciones:**
\`\`\`php
$pdo->beginTransaction();
try {
    $pdo->prepare("UPDATE cuentas SET saldo = saldo - ? WHERE id = ?")->execute([$monto, $idOrigen]);
    $pdo->prepare("UPDATE cuentas SET saldo = saldo + ? WHERE id = ?")->execute([$monto, $idDestino]);
    $pdo->commit();
} catch (PDOException $e) {
    $pdo->rollBack();
    throw $e;
}
\`\`\``,
      example: `<?php
declare(strict_types=1);

// ─── Conexión con PDO ───
function getConexion(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host=localhost;dbname=tareas_db;charset=utf8mb4",
            'root',
            '',
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    }
    return $pdo;
}

// ─── Schema SQL (ejecutar una vez) ───
/*
CREATE TABLE tareas (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    titulo      VARCHAR(255) NOT NULL,
    descripcion TEXT,
    completada  TINYINT(1)   NOT NULL DEFAULT 0,
    creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
*/

// ─── CRUD completo ───

// CREATE
function crearTarea(string $titulo, string $descripcion = ''): int {
    $stmt = getConexion()->prepare(
        "INSERT INTO tareas (titulo, descripcion) VALUES (:titulo, :descripcion)"
    );
    $stmt->execute([':titulo' => $titulo, ':descripcion' => $descripcion]);
    return (int) getConexion()->lastInsertId();
}

// READ — todas
function obtenerTareas(bool $soloIncompletas = false): array {
    $sql = "SELECT * FROM tareas";
    if ($soloIncompletas) $sql .= " WHERE completada = 0";
    $sql .= " ORDER BY creado_en DESC";
    return getConexion()->query($sql)->fetchAll();
}

// READ — una
function obtenerTarea(int $id): ?array {
    $stmt = getConexion()->prepare("SELECT * FROM tareas WHERE id = ?");
    $stmt->execute([$id]);
    $tarea = $stmt->fetch();
    return $tarea ?: null;
}

// UPDATE
function completarTarea(int $id): bool {
    $stmt = getConexion()->prepare(
        "UPDATE tareas SET completada = 1 WHERE id = ?"
    );
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}

// DELETE
function eliminarTarea(int $id): bool {
    $stmt = getConexion()->prepare("DELETE FROM tareas WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}

// ─── Uso con manejo de errores ───
try {
    $id = crearTarea("Aprender PDO", "Prepared statements y transacciones");
    echo "Tarea creada con ID: $id\\n";

    $tareas = obtenerTareas();
    foreach ($tareas as $t) {
        $estado = $t['completada'] ? '✓' : '○';
        echo "$estado [{$t['id']}] {$t['titulo']}\\n";
    }

    completarTarea($id);
    echo "Tarea $id marcada como completada\\n";

} catch (PDOException $e) {
    // Nunca mostrar el mensaje real en producción
    error_log("DB Error: " . $e->getMessage());
    echo "Error al acceder a la base de datos.\\n";
}`,
    },
    {
      id: 's6',
      title: 'Composer y autoloading PSR-4',
      content: `**Composer** es el gestor de dependencias de PHP. Descarga paquetes, gestiona versiones y genera el autoloader.

**Instalar Composer** (una vez en tu sistema):
\`\`\`bash
# Linux/Mac
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Windows: descargar instalador desde getcomposer.org
\`\`\`

**\`composer.json\`** — el equivalente de \`package.json\`:
\`\`\`json
{
    "name": "miapp/tareas",
    "autoload": {
        "psr-4": {
            "App\\\\": "src/"
        }
    },
    "require": {
        "php": "^8.1",
        "vlucas/phpdotenv": "^5.5"
    },
    "require-dev": {
        "phpunit/phpunit": "^10.0"
    }
}
\`\`\`

**Comandos esenciales:**
\`\`\`bash
composer init                  # crear composer.json interactivo
composer require paquete/nombre  # instalar dependencia
composer require --dev paquete   # solo para desarrollo
composer install               # instalar todo lo de composer.lock
composer update                # actualizar dependencias
composer dump-autoload         # regenerar el autoloader
\`\`\`

**PSR-4 autoloading** — mapea namespaces a directorios. Si configuras \`"App\\\\": "src/"\`, PHP cargará:
- \`App\\Controllers\\HomeController\` → \`src/Controllers/HomeController.php\`
- \`App\\Models\\Usuario\` → \`src/Models/Usuario.php\`

Añadir al inicio de tu \`index.php\`:
\`\`\`php
require_once __DIR__ . '/vendor/autoload.php';
\`\`\`
A partir de ahí todas las clases con el namespace correcto se cargan automáticamente.`,
      example: `<?php
// ─── Estructura de proyecto con Composer ───
//
// mi-proyecto/
// ├── composer.json
// ├── composer.lock        ← generado automáticamente
// ├── vendor/              ← generado, NO va en git
// │   └── autoload.php
// ├── src/
// │   ├── Models/
// │   │   └── Tarea.php    ← namespace App\\Models
// │   ├── Repositories/
// │   │   └── TareaRepo.php
// │   └── Controllers/
// │       └── TareaController.php
// └── public/
//     └── index.php        ← punto de entrada

// ─── src/Models/Tarea.php ───
namespace App\\Models;

class Tarea
{
    public function __construct(
        public readonly ?int $id,
        public string        $titulo,
        public string        $estado    = 'pendiente',
        public readonly string $creadoEn = '',
    ) {}

    public static function fromArray(array $datos): self {
        return new self(
            id:        $datos['id']        ?? null,
            titulo:    $datos['titulo'],
            estado:    $datos['estado']    ?? 'pendiente',
            creadoEn:  $datos['creado_en'] ?? date('Y-m-d H:i:s'),
        );
    }
}

// ─── src/Repositories/TareaRepo.php ───
namespace App\\Repositories;

use App\\Models\\Tarea;
use PDO;

class TareaRepo
{
    public function __construct(private PDO $db) {}

    public function todos(): array {
        $rows = $this->db->query("SELECT * FROM tareas ORDER BY id DESC")->fetchAll();
        return array_map(fn($row) => Tarea::fromArray($row), $rows);
    }

    public function crear(string $titulo): Tarea {
        $stmt = $this->db->prepare("INSERT INTO tareas (titulo) VALUES (?)");
        $stmt->execute([$titulo]);
        return new Tarea(id: (int)$this->db->lastInsertId(), titulo: $titulo);
    }
}

// ─── public/index.php ───
require_once __DIR__ . '/../vendor/autoload.php';

use App\\Repositories\\TareaRepo;

$db   = new PDO("mysql:host=localhost;dbname=tareas_db;charset=utf8mb4", 'root', '');
$repo = new TareaRepo($db);

$tareas = $repo->todos();
foreach ($tareas as $tarea) {
    echo "[{$tarea->id}] {$tarea->titulo} — {$tarea->estado}\\n";
}`,
    },
    {
      id: 's7',
      title: 'Mini proyecto: CRUD en PHP puro',
      content: `Es hora de construir una **aplicación real sin frameworks**: una lista de tareas con MySQL y PHP puro. Esto te hará entender exactamente qué problemas resuelve Laravel.

**Estructura del proyecto:**
\`\`\`
tareas-crud/
├── composer.json          ← autoload PSR-4
├── .env                   ← credenciales (nunca en git)
├── .gitignore
├── src/
│   ├── Database.php       ← conexión PDO singleton
│   ├── Models/Tarea.php
│   └── Repositories/TareaRepo.php
└── public/
    ├── index.php          ← listar tareas
    ├── crear.php          ← formulario + procesar
    ├── completar.php      ← toggle estado
    └── eliminar.php       ← borrar
\`\`\`

**Schema SQL:**
\`\`\`sql
CREATE DATABASE tareas_db CHARACTER SET utf8mb4;

CREATE TABLE tareas (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    titulo      VARCHAR(255) NOT NULL,
    completada  TINYINT(1) NOT NULL DEFAULT 0,
    creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Criterios de evaluación:**
- Conexión PDO con prepared statements en todas las operaciones.
- CRUD completo: Crear, Leer, Actualizar (completar), Eliminar.
- Validación del formulario de creación (título obligatorio, mínimo 3 chars).
- Protección XSS con \`htmlspecialchars()\` al mostrar datos.
- Token CSRF en el formulario de creación.
- Autoloading con Composer PSR-4 y namespaces.
- \`.env\` para las credenciales de BD (con \`vlucas/phpdotenv\`).

**Lo que aún falta y que Laravel resuelve:** routing elegante, ORM, migraciones, autenticación, validación declarativa, vistas Blade, middleware. Pero ahora entiendes **por qué** existen esas abstracciones.`,
      example: `<?php
// ─── src/Database.php ───
namespace App;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;

    public static function conectar(): PDO
    {
        if (self::$instance === null) {
            $host   = $_ENV['DB_HOST']     ?? 'localhost';
            $dbname = $_ENV['DB_DATABASE'] ?? 'tareas_db';
            $user   = $_ENV['DB_USERNAME'] ?? 'root';
            $pass   = $_ENV['DB_PASSWORD'] ?? '';

            self::$instance = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $user, $pass,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );
        }
        return self::$instance;
    }
}

// ─── public/index.php — listar + acciones ───
require_once __DIR__ . '/../vendor/autoload.php';

use App\\Database;
use App\\Repositories\\TareaRepo;

(\\Dotenv\\Dotenv::createImmutable(__DIR__ . '/../'))->load();

$db   = Database::conectar();
$repo = new TareaRepo($db);

// Redirigir acciones POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';
    $id     = (int)($_POST['id'] ?? 0);

    match($accion) {
        'completar' => $repo->toggleCompletar($id),
        'eliminar'  => $repo->eliminar($id),
        default     => null,
    };

    header('Location: /');
    exit;
}

$tareas = $repo->todos();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Lista de Tareas</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; background: #f5f5f5; }
    .tarea { display: flex; align-items: center; gap: 1rem; background: white; padding: 0.75rem 1rem; border-radius: 8px; margin: 0.5rem 0; }
    .tarea.completada { opacity: 0.5; text-decoration: line-through; }
    button { border: none; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; }
    .btn-completar { background: #10b981; color: white; }
    .btn-eliminar  { background: #ef4444; color: white; }
  </style>
</head>
<body>
  <h1>Mis Tareas</h1>
  <a href="crear.php">+ Nueva tarea</a>

  <?php foreach ($tareas as $tarea): ?>
    <div class="tarea <?= $tarea->completada ? 'completada' : '' ?>">
      <span><?= htmlspecialchars($tarea->titulo) ?></span>
      <form method="POST" style="margin-left:auto;display:flex;gap:.5rem">
        <input type="hidden" name="id" value="<?= $tarea->id ?>">
        <button name="accion" value="completar" class="btn-completar">
          <?= $tarea->completada ? '↺' : '✓' ?>
        </button>
        <button name="accion" value="eliminar" class="btn-eliminar"
                onclick="return confirm('¿Eliminar?')">✕</button>
      </form>
    </div>
  <?php endforeach; ?>
</body>
</html>`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Variables y tipos PHP 8',
    description: 'Escribe un script PHP que: (1) declare `strict_types=1`, (2) cree variables de tipo string, int, float y bool con valores de tu elección, (3) defina una función `describir` con tipado completo (parámetro `string $texto`, retorno `string`) que retorne el texto en mayúsculas con su longitud: `"HOLA (4 chars)"`, (4) llame a la función con `echo`.',
    hint: 'Usa declare(strict_types=1) en la primera línea. La función: function describir(string $texto): string { return strtoupper($texto) . " (" . strlen($texto) . " chars)"; }',
    starterCode: `<?php
// 1. Activar strict_types

// 2. Declarar variables: string, int, float, bool

// 3. Función "describir" con tipos completos
//    Parámetro: string $texto
//    Retorna:   string en mayúsculas con su longitud
//    Ejemplo:   describir("hola") → "HOLA (4 chars)"

// 4. Llamar a la función con echo
`,
    validate(_output, code) {
      if (!/declare\s*\(\s*strict_types\s*=\s*1\s*\)/i.test(code))
        return { ok: false, message: 'Agrega `declare(strict_types=1);` al inicio del archivo.' }
      if (!/\$\w+\s*=\s*["']/i.test(code))
        return { ok: false, message: 'Declara al menos una variable string (ej. $nombre = "texto").' }
      if (!/\$\w+\s*=\s*\d+\s*;/i.test(code))
        return { ok: false, message: 'Declara al menos una variable int (ej. $edad = 25).' }
      if (!/function\s+describir\s*\(\s*string\s+\$\w+\s*\)\s*:\s*string/i.test(code))
        return { ok: false, message: 'Define la función `function describir(string $texto): string`.' }
      if (!/strtoupper/i.test(code))
        return { ok: false, message: 'Usa `strtoupper()` dentro de `describir` para poner en mayúsculas.' }
      if (!/strlen/i.test(code))
        return { ok: false, message: 'Usa `strlen()` para obtener la longitud del texto.' }
      if (!/echo\s+describir/i.test(code))
        return { ok: false, message: 'Llama a `describir()` con `echo` para mostrar el resultado.' }
      return { ok: true, message: '¡Variables tipadas y funciones PHP 8 dominadas! strict_types + tipado explícito = código predecible.' }
    },
  },
  {
    id: 'ex2',
    title: 'Arrays y métodos funcionales',
    description: 'Dado un array de productos (con claves `nombre`, `precio`, `stock`), usa: (1) `array_filter` para quedarte solo con los que tienen `stock > 0`, (2) `array_map` para añadir a cada producto la clave `precio_iva` = precio * 1.21 redondeado a 2 decimales, (3) `array_reduce` para calcular el precio total de los disponibles (suma de precios). Usa `echo` para mostrar los 3 resultados.',
    hint: 'Usa array_filter($productos, fn($p) => $p["stock"] > 0). Luego array_map con spread: fn($p) => [...$p, "precio_iva" => round($p["precio"] * 1.21, 2)]. Para array_reduce el acumulador empieza en 0.',
    starterCode: `<?php
declare(strict_types=1);

$productos = [
    ["nombre" => "Laptop",   "precio" => 1200.00, "stock" => 5],
    ["nombre" => "Teclado",  "precio" => 85.00,   "stock" => 0],
    ["nombre" => "Monitor",  "precio" => 600.00,  "stock" => 3],
    ["nombre" => "Ratón",    "precio" => 40.00,   "stock" => 0],
    ["nombre" => "Auriculares", "precio" => 120.00, "stock" => 2],
];

// 1. array_filter: solo productos con stock > 0

// 2. array_map sobre TODOS: añadir clave "precio_iva" = precio * 1.21

// 3. array_reduce sobre los DISPONIBLES: suma total de precios

// Mostrar con echo los 3 resultados
`,
    validate(_output, code) {
      if (!/array_filter/i.test(code))
        return { ok: false, message: 'Usa `array_filter()` para filtrar los productos con stock > 0.' }
      if (!/array_map/i.test(code))
        return { ok: false, message: 'Usa `array_map()` para añadir el precio con IVA a cada producto.' }
      if (!/array_reduce/i.test(code))
        return { ok: false, message: 'Usa `array_reduce()` para calcular el total de precios.' }
      if (!/precio_iva/i.test(code))
        return { ok: false, message: 'El array_map debe añadir la clave `precio_iva` a cada producto.' }
      if (!/round\s*\(/i.test(code))
        return { ok: false, message: 'Usa `round(..., 2)` para redondear el precio con IVA a 2 decimales.' }
      if (!/echo/i.test(code))
        return { ok: false, message: 'Muestra los resultados con `echo`.' }
      return { ok: true, message: '¡array_filter + array_map + array_reduce en PHP! El paradigma funcional funciona igual que en JavaScript.' }
    },
  },
  {
    id: 'ex3',
    title: 'Clase con constructor promotion',
    description: 'Crea una clase `Producto` usando constructor property promotion de PHP 8 con: `readonly int $id`, `string $nombre`, `float $precio`, y `int $stock = 0`. Añade un método `conDescuento(float $pct): float` que retorne el precio con el descuento aplicado. Instancia la clase y llama al método.',
    hint: 'Constructor promotion: public function __construct(public readonly int $id, public string $nombre, ...). El método: return round($this->precio * (1 - $pct / 100), 2).',
    starterCode: `<?php
declare(strict_types=1);

// Define la clase Producto con:
// - Constructor property promotion (PHP 8)
// - Propiedades: readonly int $id, string $nombre, float $precio, int $stock = 0
// - Método conDescuento(float $pct): float

// Instancia un producto y muestra su precio con 20% de descuento
`,
    validate(_output, code) {
      if (!/class\s+Producto/i.test(code))
        return { ok: false, message: 'Define la clase `Producto`.' }
      if (!/public\s+function\s+__construct\s*\(/i.test(code))
        return { ok: false, message: 'Define el constructor con `public function __construct(...)`.' }
      if (!/readonly\s+int\s+\$id|int\s+\$id.*readonly/i.test(code))
        return { ok: false, message: 'Declara `$id` como `readonly int` en el constructor.' }
      if (!/public\s+string\s+\$nombre/i.test(code))
        return { ok: false, message: 'Declara `public string $nombre` en el constructor (property promotion).' }
      if (!/public\s+float\s+\$precio/i.test(code))
        return { ok: false, message: 'Declara `public float $precio` en el constructor.' }
      if (!/function\s+conDescuento\s*\(\s*float\s+\$\w+\s*\)\s*:\s*float/i.test(code))
        return { ok: false, message: 'Define el método `conDescuento(float $pct): float`.' }
      if (!/new\s+Producto\s*\(/i.test(code))
        return { ok: false, message: 'Instancia la clase con `new Producto(...)`.' }
      if (!/->conDescuento\s*\(/i.test(code))
        return { ok: false, message: 'Llama al método `->conDescuento(...)` en tu instancia.' }
      return { ok: true, message: '¡Constructor promotion y readonly en PHP 8! Mucho menos boilerplate que PHP 7.' }
    },
  },
  {
    id: 'ex4',
    title: 'Procesar formulario con validación',
    description: 'Escribe el bloque PHP de procesamiento de un formulario POST con los campos `titulo` (mínimo 3 chars) y `prioridad` (debe ser "alta", "media" o "baja"). Usa `$_SERVER["REQUEST_METHOD"]` para detectar el POST, `filter_input` para leer, un array `$errores` para acumular errores, y `htmlspecialchars` al mostrar los valores.',
    hint: 'if ($_SERVER["REQUEST_METHOD"] === "POST") { $titulo = trim(filter_input(INPUT_POST, "titulo", FILTER_SANITIZE_SPECIAL_CHARS) ?? ""); if (strlen($titulo) < 3) $errores[] = "..."; }',
    starterCode: `<?php
// Procesamiento de formulario POST

$errores = [];
$valores = ['titulo' => '', 'prioridad' => 'media'];

// 1. Detectar si se envió el formulario (POST)

// 2. Leer y sanitizar: $titulo (FILTER_SANITIZE_SPECIAL_CHARS)
//                      $prioridad (FILTER_SANITIZE_SPECIAL_CHARS)

// 3. Validar:
//    - titulo: mínimo 3 caracteres
//    - prioridad: debe ser "alta", "media" o "baja"

// 4. Si no hay errores: mostrar "¡Tarea creada!"
//    Si hay errores: mostrar cada error con htmlspecialchars
`,
    validate(_output, code) {
      if (!/'REQUEST_METHOD'/.test(code) && !/"REQUEST_METHOD"/.test(code))
        return { ok: false, message: 'Detecta el método HTTP con `$_SERVER["REQUEST_METHOD"] === "POST"`.' }
      if (!/filter_input\s*\(\s*INPUT_POST/i.test(code))
        return { ok: false, message: 'Usa `filter_input(INPUT_POST, "campo", FILTER_...)` para leer los datos.' }
      if (!/\$errores/i.test(code))
        return { ok: false, message: 'Usa un array `$errores` para acumular los mensajes de error.' }
      if (!/strlen\s*\(/i.test(code) && !/mb_strlen\s*\(/i.test(code))
        return { ok: false, message: 'Valida la longitud del título con `strlen()` (mínimo 3 chars).' }
      if (!/in_array\s*\(|=== 'alta'|=== "alta"/.test(code))
        return { ok: false, message: 'Valida que la prioridad sea "alta", "media" o "baja" (usa `in_array`).' }
      if (!/htmlspecialchars\s*\(/i.test(code))
        return { ok: false, message: 'Usa `htmlspecialchars()` al mostrar los valores para prevenir XSS.' }
      return { ok: true, message: '¡Formulario seguro! REQUEST_METHOD + filter_input + validación + htmlspecialchars — la base de cualquier form PHP.' }
    },
  },
  {
    id: 'ex5',
    title: 'Mini proyecto: CRUD con PDO',
    description: 'Escribe las funciones `crearTarea(PDO $db, string $titulo): int` y `obtenerTareas(PDO $db): array` usando PDO con prepared statements. `crearTarea` inserta en la tabla `tareas (titulo)` y retorna el `lastInsertId`. `obtenerTareas` retorna todas las filas ordenadas por `id DESC`.',
    hint: 'crearTarea: $stmt = $db->prepare("INSERT INTO tareas (titulo) VALUES (?)"); $stmt->execute([$titulo]); return (int)$db->lastInsertId(). obtenerTareas: $db->query("SELECT * FROM tareas ORDER BY id DESC")->fetchAll().',
    starterCode: `<?php
declare(strict_types=1);

// ─── Función para insertar una tarea ───
// Parámetros: PDO $db, string $titulo
// Retorna: int (el ID del nuevo registro)
function crearTarea(PDO $db, string $titulo): int
{
    // Usar prepared statement con parámetro posicional (?)

}

// ─── Función para obtener todas las tareas ───
// Parámetros: PDO $db
// Retorna: array de filas asociativas, ordenadas por id DESC
function obtenerTareas(PDO $db): array
{

}

// ─── Demostración de uso ───
// (En un proyecto real $db vendría de tu clase Database)
// $id     = crearTarea($db, "Aprender PDO");
// $tareas = obtenerTareas($db);
`,
    validate(_output, code) {
      if (!/function\s+crearTarea\s*\(\s*PDO\s+\$\w+/i.test(code))
        return { ok: false, message: 'Define `function crearTarea(PDO $db, string $titulo): int`.' }
      if (!/function\s+obtenerTareas\s*\(\s*PDO\s+\$\w+\s*\)\s*:\s*array/i.test(code))
        return { ok: false, message: 'Define `function obtenerTareas(PDO $db): array`.' }
      if (!/->prepare\s*\(/i.test(code))
        return { ok: false, message: 'Usa `$db->prepare(...)` para crear prepared statements.' }
      if (!/->execute\s*\(/i.test(code))
        return { ok: false, message: 'Llama a `->execute([...])` para ejecutar el prepared statement.' }
      if (!/lastInsertId\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Retorna el ID con `(int)$db->lastInsertId()` en `crearTarea`.' }
      if (!/fetchAll\s*\(\s*\)/i.test(code))
        return { ok: false, message: 'Usa `->fetchAll()` en `obtenerTareas` para obtener todas las filas.' }
      if (!/ORDER BY\s+id\s+DESC/i.test(code))
        return { ok: false, message: 'Ordena los resultados con `ORDER BY id DESC`.' }
      return { ok: true, message: '¡CRUD con PDO y prepared statements! Nunca SQL injection, siempre parámetros. Esto es lo que Laravel hace bajo el capó.' }
    },
  },
]
