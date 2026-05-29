export const lesson = {
  id: 'lesson-1',
  title: 'Introducción a la Computación',
  subtitle: 'Lección 1 — Fundamentos',
  sections: [
    {
      id: 's1',
      title: 'Historia de la computación',
      content: `Las computadoras no siempre fueron pantallas y teclados. El camino hasta las máquinas que usamos hoy tomó siglos.

En los años **1800s**, Charles Babbage diseñó la **Máquina Analítica** — una calculadora mecánica que nunca llegó a construirse del todo, pero cuyo diseño contenía las ideas básicas de una computadora moderna. Ada Lovelace escribió el primer **algoritmo** pensado para esa máquina, convirtiéndose en la primera programadora de la historia.

En **1936**, Alan Turing definió matemáticamente qué es una computadora con su modelo teórico llamado **Máquina de Turing** — la base conceptual de toda la informática moderna.

En **1945** nació la **ENIAC**, la primera computadora electrónica de propósito general. Ocupaba una sala entera y pesaba 27 toneladas. Hoy, tu teléfono es millones de veces más potente.

La evolución siguió: transistores (1950s), circuitos integrados (1960s), microprocesadores (1970s), computadoras personales (1980s), internet (1990s) y hoy en día: computación en la nube, inteligencia artificial y dispositivos en el bolsillo.`,
      example: `# La computación avanzó siguiendo la Ley de Moore:
# cada ~2 años, la cantidad de transistores en un chip se duplica.

anno_eniac = 1945
transistores_eniac = 18000  # válvulas de vacío

anno_actual = 2024
transistores_moderno = 100_000_000_000  # 100 mil millones

crecimiento = transistores_moderno / transistores_eniac
print(f"Crecimiento desde ENIAC: x{crecimiento:,.0f}")
print(f"En {anno_actual - anno_eniac} años")`,
    },
    {
      id: 's2',
      title: '¿Qué es un programa? ¿Qué hace una computadora?',
      content: `Una **computadora** es una máquina que ejecuta instrucciones. No piensa, no entiende, no improvisa — solo sigue pasos exactos, uno por uno, a una velocidad increíble.

Un **programa** es una secuencia de instrucciones escritas por humanos en un lenguaje que la computadora puede procesar. Cada vez que abres una app, escuchas música o buscas algo en Google, hay millones de instrucciones ejecutándose en fracciones de segundo.

El proceso básico de cualquier computadora se puede resumir en tres pasos:

**Entrada** → **Procesamiento** → **Salida**

- **Entrada**: datos que ingresan (teclado, micrófono, sensores, archivos).
- **Procesamiento**: la CPU ejecuta instrucciones sobre esos datos.
- **Salida**: el resultado se muestra o guarda (pantalla, archivo, red).

Cuando escribes código en Python, estás dando instrucciones precisas. La computadora las ejecuta exactamente como las escribiste — ni más, ni menos.`,
      example: `# Este programa demuestra Entrada → Procesamiento → Salida

# Entrada: datos definidos en el código
nombre = "Carlos"
edad = 20

# Procesamiento: calcular año de nacimiento
anno_actual = 2024
anno_nacimiento = anno_actual - edad

# Salida: mostrar el resultado
print(f"Hola, {nombre}!")
print(f"Naciste aproximadamente en {anno_nacimiento}.")`,
    },
    {
      id: 's3',
      title: 'Hardware vs Software. Sistema operativo.',
      content: `Toda computadora tiene dos grandes componentes que trabajan juntos:

**Hardware** es la parte física — todo lo que puedes tocar: el procesador (CPU), la memoria RAM, el disco duro, la tarjeta gráfica, el teclado. El hardware ejecuta instrucciones, pero por sí solo no hace nada sin un programa.

**Software** es la parte lógica — los programas, el código, las instrucciones. No tiene peso ni forma física. Se divide en:

- **Software de sistema**: administra el hardware. El más importante es el **Sistema Operativo**.
- **Software de aplicación**: los programas que usas día a día (navegador, editor, juegos).

El **Sistema Operativo** (Windows, macOS, Linux) es el intermediario entre el hardware y las aplicaciones. Gestiona la memoria, organiza archivos, controla los dispositivos y permite que varios programas corran al mismo tiempo. Sin él, cada programa tendría que hablar directamente con el hardware — un caos.

Cuando escribes Python, tu código habla con el intérprete de Python, que habla con el sistema operativo, que habla con el hardware.`,
      example: `# Python puede interactuar con el sistema operativo
import platform
import os

# Información del sistema operativo
print("Sistema operativo:", platform.system())
print("Versión:", platform.version())
print("Procesador:", platform.processor())

# Directorio actual (el SO gestiona el sistema de archivos)
print("Directorio actual:", os.getcwd())`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Tu primer programa',
    description: 'Todo programador empieza con lo mismo. Escribe un programa que imprima: `¡Hola, mundo!`',
    hint: 'Usa print() con el texto entre comillas.',
    starterCode: '# Tu primer programa\n\n',
    validate(output, code) {
      const hasPrint = /print\s*\(/.test(code)
      const hasOutput = output.trim().length > 0
      if (!hasPrint) return { ok: false, message: 'Usa print() para mostrar el mensaje.' }
      if (!hasOutput) return { ok: false, message: 'El programa no produjo ninguna salida.' }
      return { ok: true, message: '¡Bienvenido a la programación! Ya eres programador.' }
    },
  },
  {
    id: 'ex2',
    title: 'Entrada → Procesamiento → Salida',
    description: 'Demuestra el ciclo básico: crea variables `producto` y `precio`, calcula el precio con 16% de IVA e imprímelo.',
    hint: 'IVA = precio * 0.16. El precio final = precio + IVA.',
    starterCode: 'producto = "Laptop"\nprecio = 1000\n\n# Calcula el IVA y el precio final\n\n# Imprime el resultado\n',
    validate(output, code) {
      const hasCalc = /\*\s*0\.16|\*\s*16/.test(code)
      const hasPrint = /print/.test(code)
      const hasOutput = output.trim().length > 0
      if (!hasCalc) return { ok: false, message: 'Calcula el IVA multiplicando por 0.16.' }
      if (!hasPrint) return { ok: false, message: 'Usa print() para mostrar el resultado.' }
      if (!hasOutput) return { ok: false, message: 'El programa no produjo salida.' }
      return { ok: true, message: '¡Correcto! Aplicaste el ciclo Entrada → Procesamiento → Salida.' }
    },
  },
  {
    id: 'ex3',
    title: 'Información del sistema',
    description: 'Importa el módulo `platform` y usa `platform.system()` y `platform.processor()` para imprimir información de la computadora donde corre tu código.',
    hint: 'Primero escribe: import platform. Luego llama a las funciones dentro de print().',
    starterCode: '# Importa el módulo\n\n# Imprime el sistema operativo y el procesador\n',
    validate(output, code) {
      const hasImport = /import\s+platform/.test(code)
      const hasSystem = /platform\.system\(\)/.test(code)
      const hasOutput = output.trim().length > 0 && !output.includes('Error')
      if (!hasImport) return { ok: false, message: 'Importa el módulo con: import platform' }
      if (!hasSystem) return { ok: false, message: 'Usa platform.system() para obtener el sistema operativo.' }
      if (!hasOutput) return { ok: false, message: 'El programa no produjo salida o tuvo un error.' }
      return { ok: true, message: '¡Tu código habló con el sistema operativo! Eso es hardware + software en acción.' }
    },
  },
]
