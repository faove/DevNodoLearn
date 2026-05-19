import { useState, useRef, useEffect } from 'react'
import { askClaude } from '../services/claudeTutor'
import './TutorChat.css'

export default function TutorChat({ lessonContext, userCode }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '¡Hola! Soy tu tutor de Python. Pregúntame cualquier duda sobre la lección — variables, tipos, errores, lo que necesites.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const question = input.trim()
    if (!question || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setLoading(true)

    const answer = await askClaude({ question, lessonContext, userCode })
    setMessages(prev => [...prev, { role: 'assistant', text: answer }])
    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="tutor-chat">
      <div className="tutor-header">
        <div className="tutor-avatar">AI</div>
        <div>
          <div className="tutor-name">Tutor Claude</div>
          <div className="tutor-subtitle">Pregúntame sobre la lección</div>
        </div>
        <div className="tutor-badge">Placeholder</div>
      </div>

      <div className="tutor-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role}`}>
            {msg.role === 'assistant' && <div className="msg-avatar">AI</div>}
            <div className="msg-bubble">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="message message-assistant">
            <div className="msg-avatar">AI</div>
            <div className="msg-bubble msg-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="tutor-input-row">
        <textarea
          className="tutor-input"
          placeholder="Escribe tu duda…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button
          className="tutor-send"
          onClick={handleSend}
          disabled={!input.trim() || loading}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
