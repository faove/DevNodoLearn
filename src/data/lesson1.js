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
]
