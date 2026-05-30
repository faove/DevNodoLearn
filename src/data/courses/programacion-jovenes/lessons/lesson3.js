export const lesson = {
  id: 'lesson-3',
  title: 'Bucles, Listas y Funciones',
  subtitle: 'Lección 3 — Python intermedio',
  sections: [
    {
      id: 's1',
      title: 'Bucles: for y while',
      content: `Un **bucle** repite un bloque de código múltiples veces. Python tiene dos tipos.

**for** itera sobre una secuencia (lista, string, rango). Es el más común cuando sabes cuántas veces quieres repetir algo. Usa \`range(n)\` para repetir \`n\` veces.

**while** repite mientras una condición sea \`True\`. Úsalo cuando no sabes de antemano cuántas iteraciones necesitas. Siempre asegúrate de que la condición eventualmente se vuelva \`False\`, o tendrás un bucle infinito.

La palabra clave **break** sale del bucle inmediatamente. **continue** salta a la siguiente iteración.`,
      example: `# for con range
for i in range(5):
    print(f"Iteración {i}")

# for sobre una lista
frutas = ["manzana", "pera", "uva"]
for fruta in frutas:
    print(fruta.upper())

# while con contador
contador = 3
while contador > 0:
    print(f"Cuenta: {contador}")
    contador -= 1
print("¡Listo!")

# break y continue
for n in range(10):
    if n == 3:
        continue   # salta el 3
    if n == 7:
        break      # para en 7
    print(n)`,
    },
    {
      id: 's2',
      title: 'Listas y diccionarios',
      content: `Una **lista** es una colección ordenada y modificable de elementos. Se define con corchetes \`[]\`. Puedes mezclar tipos, aunque lo común es guardar elementos del mismo tipo.

Métodos útiles: \`append(x)\` agrega al final, \`remove(x)\` elimina la primera ocurrencia, \`pop(i)\` elimina por índice, \`sort()\` ordena en su lugar, \`len(lista)\` devuelve el tamaño.

Un **diccionario** es una colección de pares **clave: valor**. Se define con llaves \`{}\`. Accedes a valores con \`dict["clave"]\` y puedes comprobar si existe una clave con \`"clave" in dict\`.

Métodos útiles: \`keys()\`, \`values()\`, \`items()\` para iterar, \`get("clave", defecto)\` para acceder sin error si no existe.`,
      example: `# Listas
numeros = [4, 2, 7, 1, 9]
numeros.append(5)
numeros.sort()
print("Lista ordenada:", numeros)
print("Primero:", numeros[0], "| Último:", numeros[-1])

# Iterar lista con índice
for i, n in enumerate(numeros):
    print(f"  [{i}] → {n}")

# Diccionarios
jugador = {"nombre": "Ana", "puntaje": 0, "vidas": 3}
jugador["puntaje"] += 100
print(jugador["nombre"], "tiene", jugador["puntaje"], "puntos")

# Iterar diccionario
for clave, valor in jugador.items():
    print(f"  {clave}: {valor}")`,
    },
    {
      id: 's3',
      title: 'Funciones: def, parámetros, return',
      content: `Una **función** agrupa código reutilizable bajo un nombre. Se define con \`def\` seguido del nombre y paréntesis. Todo lo que esté indentado debajo pertenece a la función.

Los **parámetros** son variables que la función recibe al ser llamada. Puedes darles valores por defecto: \`def saluda(nombre, saludo="Hola")\`.

**return** devuelve un valor y termina la función. Si no hay \`return\`, la función devuelve \`None\`.

Una función bien diseñada hace **una sola cosa**. Si tu función necesita muchos comentarios para explicar qué hace, probablemente deba dividirse.`,
      example: `# Función básica
def saludar(nombre):
    return f"¡Hola, {nombre}!"

print(saludar("Carlos"))

# Parámetro con valor por defecto
def potencia(base, exponente=2):
    return base ** exponente

print(potencia(3))      # 9  (exponente=2 por defecto)
print(potencia(2, 10))  # 1024

# Función que trabaja con listas
def promedio(numeros):
    if len(numeros) == 0:
        return 0
    return sum(numeros) / len(numeros)

notas = [85, 92, 78, 96, 88]
print(f"Promedio: {promedio(notas):.1f}")`,
    },
    {
      id: 's4',
      title: 'Alcance de variables (scope)',
      content: `El **scope** define dónde es visible una variable en tu código.

Una variable creada **dentro** de una función es **local** — existe solo durante la ejecución de esa función y no se puede acceder desde fuera.

Una variable creada **fuera** de todas las funciones es **global** — visible en todo el módulo, pero modificarla dentro de una función requiere declararla con \`global\`.

La regla práctica: **evita variables globales** cuando puedas. Pasa los datos como parámetros y recíbelos con \`return\`. Tu código será más predecible y fácil de probar.`,
      example: `# Variable local: solo vive dentro de la función
def calcular():
    resultado = 42   # local
    return resultado

print(calcular())
# print(resultado)  # Error: resultado no existe aquí

# Variable global
contador_global = 0

def incrementar():
    global contador_global   # necesario para modificarla
    contador_global += 1

incrementar()
incrementar()
print("Global:", contador_global)  # 2

# La forma preferida: parámetros + return
def incrementar_v2(contador):
    return contador + 1

c = 0
c = incrementar_v2(c)
c = incrementar_v2(c)
print("Sin global:", c)  # 2`,
    },
    {
      id: 's5',
      title: 'Introducción a depuración (debugging)',
      content: `**Debuggear** es el proceso de encontrar y corregir errores en tu código. Todo programador pasa mucho tiempo haciéndolo — es una habilidad tan importante como escribir código.

Tipos de errores en Python:
- **SyntaxError**: el código está mal escrito (falta un \`:\`, paréntesis sin cerrar).
- **NameError**: usas una variable que no existe.
- **TypeError**: operación inválida entre tipos (sumar \`str\` con \`int\`).
- **IndexError**: accedes a un índice que no existe en la lista.
- **ZeroDivisionError**: divides entre cero.

Técnicas básicas: usa \`print()\` para inspeccionar valores en puntos clave del código. Lee el **traceback** de abajo hacia arriba — la última línea te dice qué pasó y dónde. Prueba tus funciones con valores simples antes de integrarlas.`,
      example: `# Técnica print-debugging
def dividir_lista(numeros, divisor):
    print(f"DEBUG: numeros={numeros}, divisor={divisor}")  # inspeccionamos entrada
    resultados = []
    for n in numeros:
        if divisor == 0:
            print("DEBUG: divisor es 0, saltando")
            continue
        resultados.append(n / divisor)
    print(f"DEBUG: resultados={resultados}")  # inspeccionamos salida
    return resultados

datos = [10, 20, 30, 0, 40]
print(dividir_lista(datos, 5))
print(dividir_lista(datos, 0))`,
    },
    {
      id: 's6',
      title: 'Proyecto: Juego de adivinanza con puntaje',
      content: `Llegó el momento de combinar todo lo que aprendiste en un **primer proyecto completo**.

El juego funciona así: la computadora elige un número aleatorio entre 1 y 100. El jugador tiene intentos limitados para adivinarlo. Cada ronda ganada suma puntos — menos intentos usados significa más puntos. El historial de puntajes se guarda en una lista.

Usamos el módulo \`random\` para generar números aleatorios. Como el editor no soporta \`input()\` interactivo, la versión aquí simula los intentos con una lista — así puedes correrla y ver cómo funciona. En un programa real, reemplazarías la lista por \`input()\`.`,
      example: `import random

historial = []

def calcular_puntos(intentos_usados, max_intentos):
    return max(10, (max_intentos - intentos_usados + 1) * 20)

def jugar_ronda(secreto, intentos_simulados, max_intentos=5):
    print(f"--- Nueva ronda (secreto: {secreto}) ---")
    for i, intento in enumerate(intentos_simulados[:max_intentos], 1):
        print(f"Intento {i}: {intento}")
        if intento == secreto:
            puntos = calcular_puntos(i, max_intentos)
            print(f"¡Correcto en {i} intento(s)! +{puntos} puntos")
            return puntos
        elif intento < secreto:
            print("  → Muy bajo")
        else:
            print("  → Muy alto")
    print(f"Sin intentos. Era {secreto}. +0 puntos")
    return 0

# Simular 3 rondas
rondas = [
    (42, [20, 60, 40, 45, 42]),
    (71, [50, 75, 70, 71]),
    (15, [50, 25, 10, 20, 15]),
]

for secreto, intentos in rondas:
    puntos = jugar_ronda(secreto, intentos)
    historial.append(puntos)

print(f"\n=== Historial: {historial} ===")
print(f"Puntaje total: {sum(historial)}")
print(f"Mejor ronda:   {max(historial)} puntos")`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Tabla de multiplicar',
    description: 'Usa un bucle `for` con `range()` para imprimir la tabla de multiplicar del 7 (del 7×1 al 7×10).',
    hint: 'for i in range(1, 11): imprime 7 * i con un mensaje como "7 x 1 = 7".',
    starterCode: '# Tabla de multiplicar del 7\n\n',
    validate(output, code) {
      const hasFor = /for\s+\w+\s+in\s+range/.test(code)
      const lines = output.trim().split('\n').filter(l => l.trim())
      if (!hasFor) return { ok: false, message: 'Usa un bucle for con range().' }
      if (lines.length < 10) return { ok: false, message: `Debes imprimir 10 líneas. Llevas ${lines.length}.` }
      const has70 = output.includes('70')
      if (!has70) return { ok: false, message: 'Verifica que la última línea sea 7 × 10 = 70.' }
      return { ok: true, message: '¡Tabla completa! Los bucles for son perfectos para esto.' }
    },
  },
  {
    id: 'ex2',
    title: 'Lista de compras',
    description: 'Crea una lista `compras` con al menos 4 productos. Agrega uno más con `append()`, elimina el primero con `pop(0)` e imprime la lista final y su tamaño con `len()`.',
    hint: 'lista.append("item") agrega al final. lista.pop(0) elimina el primer elemento.',
    starterCode: 'compras = []\n\n# Agrega 4 productos\n\n# append y pop(0)\n\n# Imprime la lista y su tamaño\n',
    validate(output, code) {
      const hasAppend = /\.append\s*\(/.test(code)
      const hasPop = /\.pop\s*\(\s*0\s*\)/.test(code)
      const hasLen = /len\s*\(/.test(code)
      const hasOutput = output.trim().length > 0
      if (!hasAppend) return { ok: false, message: 'Usa .append() para agregar un elemento.' }
      if (!hasPop) return { ok: false, message: 'Usa .pop(0) para eliminar el primer elemento.' }
      if (!hasLen) return { ok: false, message: 'Usa len() para mostrar el tamaño de la lista.' }
      if (!hasOutput) return { ok: false, message: 'Imprime la lista final.' }
      return { ok: true, message: '¡Lista manejada correctamente! append, pop y len son esenciales.' }
    },
  },
  {
    id: 'ex3',
    title: 'Diccionario de estudiante',
    description: 'Crea un diccionario `estudiante` con las claves `nombre`, `edad` y `promedio`. Luego imprime cada clave y valor usando un bucle `for` con `.items()`.',
    hint: 'for clave, valor in diccionario.items(): te da cada par.',
    starterCode: 'estudiante = {}\n\n# Rellena el diccionario\n\n# Itera con .items()\n',
    validate(output, code) {
      const hasDict = /estudiante\s*=\s*\{/.test(code)
      const hasItems = /\.items\s*\(\s*\)/.test(code)
      const hasFor = /for\s+.+\s+in\s+/.test(code)
      const lines = output.trim().split('\n').filter(l => l.trim())
      if (!hasDict) return { ok: false, message: 'Define el diccionario estudiante con {}.' }
      if (!hasFor) return { ok: false, message: 'Usa un bucle for para iterar el diccionario.' }
      if (!hasItems) return { ok: false, message: 'Usa .items() para obtener claves y valores.' }
      if (lines.length < 3) return { ok: false, message: 'Debes imprimir al menos 3 pares clave-valor.' }
      return { ok: true, message: '¡Diccionario dominado! .items() es tu mejor amigo para iterar.' }
    },
  },
  {
    id: 'ex4',
    title: 'Función: mayor de una lista',
    description: 'Escribe una función `mayor(lista)` que reciba una lista de números y devuelva el número más grande **sin usar** `max()`. Pruébala con `[3, 9, 1, 7, 4]`.',
    hint: 'Empieza con actual = lista[0]. Luego itera con for y compara cada elemento.',
    starterCode: 'def mayor(lista):\n    # Tu código aquí\n    pass\n\nprint(mayor([3, 9, 1, 7, 4]))\n',
    validate(output, code) {
      const hasDef = /def\s+mayor\s*\(/.test(code)
      const hasReturn = /return/.test(code)
      const noMax = !/\bmax\s*\(/.test(code)
      const outputTrim = output.trim()
      if (!hasDef) return { ok: false, message: 'Define la función mayor(lista).' }
      if (!hasReturn) return { ok: false, message: 'La función debe usar return para devolver el resultado.' }
      if (!noMax) return { ok: false, message: 'No uses max() — implementa la lógica tú mismo.' }
      if (!outputTrim.includes('9')) return { ok: false, message: 'El mayor de [3, 9, 1, 7, 4] es 9. Revisa tu lógica.' }
      return { ok: true, message: '¡Correcto! Implementaste tu propia función de búsqueda.' }
    },
  },
  {
    id: 'ex5',
    title: 'Proyecto: juego de adivinanza',
    description: 'Implementa el juego completo. Tu código debe: importar `random`, definir al menos una función, usar una lista para guardar el historial de puntajes, usar un bucle para los intentos, e imprimir el puntaje total al final.',
    hint: 'Como el editor no soporta input(), usa una lista de intentos simulados. Revisa el ejemplo de la sección 6.',
    starterCode: 'import random\n\nhistorial = []\n\n# Define tus funciones aquí\n\n# Simula al menos 2 rondas y guarda los puntajes en historial\n\n# Imprime el puntaje total\nprint("Total:", sum(historial))\n',
    validate(output, code) {
      const hasImport = /import\s+random/.test(code)
      const hasDef = /def\s+\w+/.test(code)
      const hasList = /historial/.test(code)
      const hasLoop = /for\s+|while\s+/.test(code)
      const hasTotal = /sum\s*\(/.test(code)
      const hasOutput = output.trim().length > 0 && !output.includes('Error')
      if (!hasImport) return { ok: false, message: 'Importa el módulo random.' }
      if (!hasDef) return { ok: false, message: 'Define al menos una función con def.' }
      if (!hasList) return { ok: false, message: 'Usa la lista historial para guardar los puntajes.' }
      if (!hasLoop) return { ok: false, message: 'Usa un bucle for o while para los intentos.' }
      if (!hasTotal) return { ok: false, message: 'Calcula el puntaje total con sum(historial).' }
      if (!hasOutput) return { ok: false, message: 'El programa produjo un error. Revisa la consola.' }
      return { ok: true, message: '¡Primer proyecto completo! Usaste funciones, listas, bucles y módulos.' }
    },
  },
]
