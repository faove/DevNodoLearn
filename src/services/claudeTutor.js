const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'anthropic/claude-3.5-haiku'

function buildSystemPrompt(lessonContext) {
  return `Eres un tutor de programación en Python para jóvenes de 15+ años.
Estás enseñando la lección: "${lessonContext}".

Reglas:
- Responde SIEMPRE en español.
- Sé conciso: máximo 3-4 oraciones salvo que el estudiante pida más detalle.
- Usa ejemplos de código cortos cuando ayude a entender.
- Si el estudiante comparte código con errores, señala el problema sin darle la solución completa — guíalo.
- Tono amigable y motivador, no condescendiente.
- Si la pregunta no tiene que ver con Python o la lección, redirige amablemente.`
}

export async function askClaude({ question, lessonContext, userCode }) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  if (!apiKey || apiKey === 'TU_KEY_AQUI') {
    return '⚠️ Falta configurar la API key en el archivo .env (VITE_OPENROUTER_API_KEY).'
  }

  const userMessage = userCode?.trim()
    ? `${question}\n\nMi código actual:\n\`\`\`python\n${userCode}\n\`\`\``
    : question

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://learn.devnodo.com',
      'X-Title': 'DevNodo Learn',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: buildSystemPrompt(lessonContext) },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 400,
      temperature: 0.5,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Error ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}
