// Placeholder — reemplazar con llamada real a Anthropic API cuando tengas la key.
// Estructura lista para conectar: recibe { question, lessonContext, userCode }
// y devuelve una respuesta de texto.

export async function askClaude({ question, lessonContext, userCode }) {
  // --- CONEXIÓN REAL (descomentar cuando tengas la API key) ---
  // const response = await fetch('/api/tutor', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ question, lessonContext, userCode }),
  // })
  // const data = await response.json()
  // return data.answer

  // --- PLACEHOLDER: respuestas simuladas ---
  await new Promise(r => setTimeout(r, 800))

  const q = question.toLowerCase()

  if (q.includes('variable')) {
    return 'Una variable es un espacio en memoria al que le das un nombre para guardar un valor. En Python solo escribes el nombre, un =, y el valor. Por ejemplo: edad = 17'
  }
  if (q.includes('type') || q.includes('tipo')) {
    return 'Puedes saber el tipo de cualquier valor usando type(). Por ejemplo: print(type(42)) te mostrará <class "int">. Los tipos principales son str, int, float y bool.'
  }
  if (q.includes('string') || q.includes('texto') || q.includes('str')) {
    return 'Un string (str) es texto. Siempre va entre comillas simples o dobles: nombre = "Ana" o nombre = \'Ana\'. Puedes unir strings con el operador +.'
  }
  if (q.includes('print')) {
    return 'print() muestra valores en la consola. Puedes pasarle varios valores separados por coma: print("Hola", nombre, "tienes", edad, "años")'
  }
  if (q.includes('error')) {
    return 'Los errores en Python dan mucha información. Mira la última línea del mensaje — dice qué tipo de error es. SyntaxError = algo mal escrito. NameError = usaste una variable que no existe. TypeError = operación con tipos incompatibles.'
  }

  return `Buena pregunta sobre "${question}". Estoy en modo placeholder por ahora. Cuando se conecte la API de Claude real, recibirás respuestas personalizadas basadas en el código que estás escribiendo y la lección actual.`
}
