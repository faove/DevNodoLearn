export const lesson = {
  id: 'lesson-1',
  title: 'Variables y Tipos de Datos',
  subtitle: 'Lección 1 — Python básico',
  sections: [
    {
      id: 's1',
      title: '¿Qué es una variable?',
      content: `Una **variable** es como una caja con nombre donde guardas información. En Python no necesitas declarar el tipo — solo asigna y listo.`,
      example: `nombre = "Ana"\nedad = 17\naltura = 1.65\nprint(nombre, "tiene", edad, "años")`,
    },
    {
      id: 's2',
      title: 'Tipos básicos',
      content: `Python tiene 4 tipos primitivos que usarás todo el tiempo:

- **str** — texto: \`"Hola"\`, \`'mundo'\`
- **int** — número entero: \`42\`, \`-8\`
- **float** — número decimal: \`3.14\`, \`-0.5\`
- **bool** — verdadero o falso: \`True\`, \`False\``,
      example: `texto = "Python"\nnumero = 100\ndecimal = 9.99\nactivo = True\n\nprint(type(texto))\nprint(type(numero))\nprint(type(decimal))\nprint(type(activo))`,
    },
    {
      id: 's3',
      title: 'Operaciones básicas',
      content: `Con variables numéricas puedes hacer operaciones matemáticas. Con strings puedes **concatenar** (unir) usando \`+\`.`,
      example: `a = 10\nb = 3\n\nprint(a + b)   # 13\nprint(a - b)   # 7\nprint(a * b)   # 30\nprint(a / b)   # 3.333...\nprint(a // b)  # 3  (división entera)\nprint(a % b)   # 1  (módulo/resto)\n\ngreeting = "Hola, " + "mundo!"\nprint(greeting)`,
    },
    {
      id: 's4',
      title: 'Operadores de comparación',
      content: `Ya conoces los operadores aritméticos (\`+\`, \`-\`, \`*\`, \`/\`). Ahora los de **comparación**: siempre devuelven \`True\` o \`False\`.

Operadores disponibles: \`==\` (igual), \`!=\` (diferente), \`>\` (mayor), \`<\` (menor), \`>=\` (mayor o igual), \`<=\` (menor o igual).

También funcionan con strings: \`"Ana" == "ana"\` devuelve \`False\` porque las mayúsculas importan.`,
      example: `edad = 18\nminimo = 18\n\nprint(edad == minimo)   # True\nprint(edad > 20)        # False\nprint(edad >= minimo)   # True\nprint(edad != 0)        # True\n\n# También con strings\nprint("python" == "python")  # True\nprint("Ana" != "ana")        # True`,
    },
    {
      id: 's5',
      title: 'Condicionales: if / elif / else',
      content: `Los condicionales permiten que tu programa **tome decisiones**. Python usa la **indentación** (4 espacios) para definir los bloques de código.

Escribe \`if condición:\` y en la línea siguiente, con 4 espacios, el código a ejecutar. Usa \`elif\` para más condiciones y \`else\` como caso por defecto. Tanto \`elif\` como \`else\` son opcionales.`,
      example: `nota = 75\n\nif nota >= 90:\n    print("Excelente")\nelif nota >= 70:\n    print("Aprobado")\nelif nota >= 50:\n    print("Suficiente")\nelse:\n    print("Reprobado")\n\n# Condicional simple\ntemperatura = 35\nif temperatura > 30:\n    print("Hace calor hoy")`,
    },
  ],
}

export const exercises = [
  {
    id: 'ex1',
    title: 'Tu primera variable',
    description: 'Crea una variable llamada `ciudad` con el nombre de tu ciudad y luego imprímela.',
    hint: 'Recuerda: el texto va entre comillas. Luego usa print() para mostrarla.',
    starterCode: '# Crea tu variable aquí\n\n',
    validate(output, code) {
      const hasVar = /ciudad\s*=\s*["'].+["']/.test(code)
      const hasPrint = /print/.test(code)
      const hasOutput = output.trim().length > 0 && !output.includes('sin salida')
      if (!hasVar) return { ok: false, message: 'Crea una variable llamada ciudad con texto.' }
      if (!hasPrint) return { ok: false, message: 'Usa print() para mostrar la variable.' }
      if (!hasOutput) return { ok: false, message: 'El programa no produjo salida. ¿Ejecutaste print()?' }
      return { ok: true, message: '¡Perfecto! Creaste y mostraste tu primera variable.' }
    },
  },
  {
    id: 'ex2',
    title: 'Tipos de datos',
    description: 'Crea tres variables: `nombre` (str), `puntaje` (int) y `aprobado` (bool). Luego imprime el tipo de cada una usando `type()`.',
    hint: 'Ejemplo: type(nombre) te dice el tipo de la variable nombre.',
    starterCode: '# Tus variables\nnombre = \npuntaje = \naprobado = \n\n# Imprime sus tipos\n',
    validate(output, code) {
      const hasStr = /nombre\s*=\s*["']/.test(code)
      const hasInt = /puntaje\s*=\s*\d+/.test(code)
      const hasBool = /aprobado\s*=\s*(True|False)/.test(code)
      const hasType = /type\(/.test(code)
      if (!hasStr) return { ok: false, message: "nombre debe ser un texto (str). Ej: nombre = \"Ana\"" }
      if (!hasInt) return { ok: false, message: 'puntaje debe ser un número entero. Ej: puntaje = 95' }
      if (!hasBool) return { ok: false, message: 'aprobado debe ser True o False.' }
      if (!hasType) return { ok: false, message: 'Usa type() para ver el tipo de las variables.' }
      return { ok: true, message: '¡Excelente! Conoces los tipos básicos de Python.' }
    },
  },
  {
    id: 'ex3',
    title: 'Calculadora simple',
    description: 'Crea dos variables numéricas `a` y `b`. Calcula e imprime su suma, resta, multiplicación y división.',
    hint: 'Usa los operadores: + - * /',
    starterCode: 'a = \nb = \n\n# Operaciones\n',
    validate(output, code) {
      const hasA = /a\s*=\s*-?\d+/.test(code)
      const hasB = /b\s*=\s*-?\d+/.test(code)
      const ops = ['+', '-', '*', '/'].filter(op => {
        // avoid matching variable assignment lines
        return new RegExp(`[ab]\\s*\\${op}|\\${op}\\s*[ab]`).test(code)
      })
      if (!hasA || !hasB) return { ok: false, message: 'Define las variables a y b con números.' }
      if (ops.length < 3) return { ok: false, message: `Usa al menos 3 operaciones. Lleva: ${ops.join(' ')}` }
      const lines = output.trim().split('\n').filter(l => l.trim())
      if (lines.length < 3) return { ok: false, message: 'Imprime los resultados de las operaciones.' }
      return { ok: true, message: '¡Calculadora lista! Ya puedes operar con variables numéricas.' }
    },
  },
  {
    id: 'ex4',
    title: 'Comparando valores',
    description: 'Crea dos variables `x` y `y` con números distintos. Luego imprime el resultado de compararlas con `==`, `>` y `<=`.',
    hint: 'Los operadores de comparación devuelven True o False. Úsalos dentro de print().',
    starterCode: 'x = \ny = \n\n# Imprime las comparaciones\n',
    validate(output, code) {
      const hasX = /x\s*=\s*-?\d+/.test(code)
      const hasY = /y\s*=\s*-?\d+/.test(code)
      const hasEq = /==/.test(code)
      const hasGt = />/.test(code)
      const hasLte = /<=/.test(code)
      const lines = output.trim().split('\n').filter(l => l.trim())
      if (!hasX || !hasY) return { ok: false, message: 'Define las variables x e y con números.' }
      if (!hasEq) return { ok: false, message: 'Usa el operador == para comparar igualdad.' }
      if (!hasGt) return { ok: false, message: 'Usa el operador > para comparar mayor que.' }
      if (!hasLte) return { ok: false, message: 'Usa el operador <= para comparar menor o igual.' }
      if (lines.length < 3) return { ok: false, message: 'Imprime el resultado de las tres comparaciones.' }
      return { ok: true, message: '¡Correcto! Los operadores de comparación son la base de toda decisión.' }
    },
  },
  {
    id: 'ex5',
    title: 'Semáforo con if / elif / else',
    description: 'Crea una variable `color` con un valor: `"rojo"`, `"amarillo"` o `"verde"`. Usa `if / elif / else` para imprimir la instrucción correspondiente: "Detente", "Precaución" o "Avanza".',
    hint: 'Compara el string con == dentro del if. Recuerda la indentación de 4 espacios.',
    starterCode: 'color = "rojo"  # prueba también "amarillo" y "verde"\n\n# Tu condicional aquí\n',
    validate(output, code) {
      const hasIf = /if\s+/.test(code)
      const hasElif = /elif\s+/.test(code)
      const hasElse = /else\s*:/.test(code)
      const out = output.trim().toLowerCase()
      const validOutputs = ['detente', 'precaución', 'precaucion', 'avanza']
      const hasValidOutput = validOutputs.some(v => out.includes(v))
      if (!hasIf) return { ok: false, message: 'Necesitas al menos un if.' }
      if (!hasElif) return { ok: false, message: 'Agrega elif para manejar el color amarillo.' }
      if (!hasElse) return { ok: false, message: 'Agrega else para el caso por defecto.' }
      if (!hasValidOutput) return { ok: false, message: 'El programa debe imprimir "Detente", "Precaución" o "Avanza" según el color.' }
      return { ok: true, message: '¡Semáforo funcionando! Dominas if / elif / else.' }
    },
  },
]
