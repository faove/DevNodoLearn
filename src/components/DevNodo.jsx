import { useEffect, useMemo, useState } from 'react'
import { getCoursePath } from '../services/courseService'
import { getCourse } from '../data/registry'
import './DevNodo.css'

const Y_STEP = 220
const Y_OFFSET = 80

const xFor = i => {
  const cycle = [50, 28, 18, 32, 52, 72, 82, 68]
  return cycle[i % cycle.length]
}

function layoutPositions(count) {
  return Array.from({ length: count }, (_, i) => ({ x: xFor(i), y: Y_OFFSET + i * Y_STEP }))
}

function computeStates(path, completed) {
  return path.map((n, i) => {
    if (completed.includes(n.id)) return 'completed'
    const activeIdx = path.findIndex(node => !completed.includes(node.id))
    const safeActiveIdx = activeIdx === -1 ? path.length - 1 : activeIdx
    if (i === safeActiveIdx) return 'active'
    return 'locked'
  })
}

function StatChip({ label, value, unit, color }) {
  const colors = {
    amber: { v: '#FFB020', glow: 'rgba(255,176,32,.6)' },
    green: { v: '#39FF14', glow: 'rgba(57,255,20,.6)' },
    cyan: { v: '#00E5FF', glow: 'rgba(0,229,255,.6)' },
  }[color]

  return (
    <div className="devnodo-stat-chip">
      <div className="devnodo-stat-label">{label}</div>
      <div
        className="devnodo-stat-value"
        style={{ color: colors.v, textShadow: `0 0 12px ${colors.glow}` }}
      >
        {value}
        {unit && <span className="devnodo-stat-unit">{unit}</span>}
      </div>
    </div>
  )
}

function HUD({
  rank,
  xpInLevel,
  xpToNext,
  totalXp,
  completedCount,
  nodeCount,
  onBack,
}) {
  const pct = Math.min(100, Math.round((xpInLevel / xpToNext) * 100))

  return (
    <header className="devnodo-hud">
      <button type="button" className="devnodo-btn-back" onClick={onBack}>
        ← INICIO
      </button>

      <div className="devnodo-hud-brand">
        <div className="devnodo-hud-logo">
          <div className="devnodo-hud-logo-outer" />
          <div className="devnodo-hud-logo-inner">
            <span>D</span>
          </div>
        </div>
        <div className="devnodo-hud-title">
          <div className="devnodo-hud-title-main">DEV-NODE</div>
          <div className="devnodo-hud-title-sub">LEARN.DEVNODO.COM</div>
        </div>
      </div>

      <div className="devnodo-hud-divider" />

      <div className="devnodo-hud-xp-block">
        <div className="devnodo-hud-rank-row">
          <span className="devnodo-hud-rank-label">
            RANK_{String(rank.lvl).padStart(2, '0')}
          </span>
          <span className="devnodo-hud-rank-name">{rank.name}</span>
          <span className="devnodo-hud-xp-text">
            {xpInLevel.toLocaleString()}
            <span> / {xpToNext.toLocaleString()} XP</span>
          </span>
        </div>
        <div className="devnodo-xp-track">
          <div className="devnodo-xp-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="devnodo-hud-divider" />

      <div className="devnodo-hud-stats">
        <StatChip label="NODES" value={completedCount} unit={`/${nodeCount}`} color="green" />
        <StatChip label="TOTAL_XP" value={totalXp.toLocaleString()} unit="" color="cyan" />
      </div>
    </header>
  )
}

function HexNode({ node, state, x, y, onClick }) {
  const cls = `hex ${state} ${state !== 'locked' ? 'tilt' : ''}`
  const handleClick = state === 'locked' ? undefined : () => onClick(node)

  return (
    <div
      className="hex-node-wrap"
      style={{
        left: `calc(${x}% - 66px)`,
        top: `${y}px`,
        zIndex: state === 'active' ? 4 : state === 'completed' ? 3 : 2,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${node.title} — ${state}`}
        className={cls}
        disabled={state === 'locked'}
      >
        <div className="hex-inner">
          {state === 'completed' && (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12.5L10 17.5L19 7.5"
                stroke="#39FF14"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 8px #39FF14)' }}
              />
            </svg>
          )}
          {state === 'active' && (
            <>
              <div className="hex-label">NODE_{node.id.slice(1)}</div>
              <div className="hex-num">▶</div>
            </>
          )}
          {state === 'locked' && (
            <svg className="lock-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="#3a3f55" strokeWidth="1.8" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#3a3f55" strokeWidth="1.8" />
            </svg>
          )}
        </div>
      </button>

      <div className="hex-caption">
        <div className={`hex-caption-status ${state}`}>
          {state === 'active' ? '// ACTIVO' : state === 'completed' ? '// COMPLETADO' : '// BLOQUEADO'}
        </div>
        <div className={`hex-caption-title ${state === 'locked' ? 'locked' : ''}`}>{node.title}</div>
        <div className={`hex-caption-sub ${state === 'locked' ? 'locked' : ''}`}>{node.sub}</div>
      </div>
    </div>
  )
}

function ChapterMarker({ chapter, y, chapterTitles }) {
  return (
    <div className="devnodo-chapter-marker" style={{ top: y - 60 }}>
      <div className="devnodo-chapter-row">
        <span className="devnodo-section-tag">{chapterTitles[chapter]}</span>
        <div className="devnodo-chapter-line" />
      </div>
    </div>
  )
}

function Cables({ positions, states, totalHeight }) {
  return (
    <svg className="devnodo-cables" style={{ height: totalHeight }} aria-hidden>
      <defs>
        <linearGradient id="cable-live" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#39FF14" />
          <stop offset="50%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#B026FF" />
        </linearGradient>
        <filter id="cable-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {positions.map((p, i) => {
        if (i === positions.length - 1) return null
        const a = p
        const b = positions[i + 1]
        const x1 = `${a.x}%`
        const x2 = `${b.x}%`
        const y1 = a.y + 76
        const y2 = b.y + 76
        const cy = (y1 + y2) / 2
        const path = `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`
        const isLive = states[i] === 'completed'

        return (
          <path
            key={i}
            d={path}
            stroke={isLive ? 'url(#cable-live)' : '#1a1d2e'}
            strokeWidth={isLive ? 2.5 : 1.5}
            fill="none"
            filter={isLive ? 'url(#cable-glow)' : undefined}
            className={isLive ? 'cable' : undefined}
            strokeLinecap="round"
            opacity={isLive ? 1 : 0.5}
          />
        )
      })}
    </svg>
  )
}

function ModalStat({ label, value, unit, color }) {
  return (
    <div className="devnodo-modal-stat">
      <div className="devnodo-modal-stat-label">{label}</div>
      <div className="devnodo-modal-stat-value" style={{ color, textShadow: `0 0 12px ${color}55` }}>
        {value} <span className="devnodo-modal-stat-unit">{unit}</span>
      </div>
    </div>
  )
}

function NodeModal({ node, state, onClose, onStart }) {
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!node) return null

  const isLocked = state === 'locked'
  const diffColor = node.tag === 'boss' ? '#FFB020' : '#39FF14'

  return (
    <div className="devnodo-modal-overlay" role="dialog" aria-modal="true">
      <div className="devnodo-modal-card">
        <div className="devnodo-corner tl" />
        <div className="devnodo-corner tr" />
        <div className="devnodo-corner bl" />
        <div className="devnodo-corner br" />

        <button type="button" className="devnodo-modal-close" onClick={onClose}>
          [ESC] CLOSE
        </button>

        <div className="devnodo-modal-header">
          <span className="devnodo-section-tag">
            NODE_{node.id.slice(1)} · CH·{String(node.chapter).padStart(2, '0')}
          </span>
          <span className="devnodo-modal-tag-active">
            {isLocked ? '// BLOQUEADO' : '// ACTIVO'}
          </span>
        </div>

        <h2 className="devnodo-modal-title">{node.title}</h2>
        <p className="devnodo-modal-sub">{node.sub}</p>

        <div className="devnodo-modal-stats">
          <ModalStat label="RECOMPENSA" value={`+${node.xp}`} unit="XP" color="#00E5FF" />
          <ModalStat label="DURACIÓN" value={node.mins} unit="MIN" color="#B026FF" />
          <ModalStat
            label="DIFICULTAD"
            value={node.tag === 'boss' ? 'BOSS' : 'STD'}
            unit=""
            color={diffColor}
          />
        </div>

        <div className="devnodo-modal-briefing">
          <div className="devnodo-modal-briefing-label">// BRIEFING</div>
          <p>
            En este nodo trabajarás <span className="text-cyan">{node.title.toLowerCase()}</span>.
            Incluye <span className="text-violet">{node.sectionCount} secciones</span> y{' '}
            <span className="text-violet">{node.exerciseCount} ejercicios prácticos</span>.
            {isLocked
              ? ' Completa el nodo anterior para desbloquearlo.'
              : ' Tu progreso sumará XP a tu rango en la red Dev-Node.'}
          </p>
        </div>

        <div className="devnodo-modal-actions">
          {!isLocked && (
            <button type="button" className="devnodo-btn-neon" onClick={() => onStart(node)}>
              ▸ INICIAR NODO
            </button>
          )}
          <button type="button" className="devnodo-btn-ghost" onClick={onClose}>
            {isLocked ? 'Cerrar' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DevNodo({ courseSlug = 'programacion-jovenes', onBack, onStartLesson, onProgressChange }) {
  const courseConfig = useMemo(() => getCourse(courseSlug), [courseSlug])
  const ranks = courseConfig?.ranks ?? []
  const chapterTitles = courseConfig?.chapterTitles ?? {}
  const rankSize = courseConfig?.rankSize ?? 500

  const [path, setPath] = useState([])
  const [courseTitle, setCourseTitle] = useState('')
  const [completed, setCompleted] = useState([])
  const [totalXp, setTotalXp] = useState(0)
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openNode, setOpenNode] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadPath() {
      setLoading(true)
      setError('')
      try {
        const data = await getCoursePath(courseSlug)
        if (cancelled) return
        setPath(data.path ?? [])
        setCourseTitle(data.course?.title ?? '')
        setCompleted(data.progress?.completedNodeIds ?? [])
        setTotalXp(data.progress?.totalXp ?? 0)
        setActiveExerciseIndex(data.progress?.activeExerciseIndex ?? 0)
        onProgressChange?.(data.progress?.completedNodeIds ?? [])
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPath()
    return () => {
      cancelled = true
    }
  }, [courseSlug, onProgressChange])

  const states = useMemo(
    () => computeStates(path, completed),
    [path, completed],
  )
  const positions = useMemo(() => layoutPositions(path.length), [path.length])
  const totalHeight = Y_OFFSET + path.length * Y_STEP + 200

  const rankLvl = Math.min(ranks.length - 1, Math.floor(totalXp / rankSize))
  const xpInLevel = totalXp - rankLvl * rankSize
  const rank = ranks[rankLvl]

  const chapterMarkers = useMemo(() => {
    const seen = new Set()
    return path.map((n, i) => {
      if (seen.has(n.chapter)) return null
      seen.add(n.chapter)
      return { chapter: n.chapter, y: positions[i]?.y ?? 0 }
    }).filter(Boolean)
  }, [path, positions])

  const openNodeState = openNode
    ? states[path.findIndex(n => n.id === openNode.id)]
    : null

  function handleNodeClick(node) {
    setOpenNode(node)
  }

  function handleStart(node) {
    setOpenNode(null)
    const nodeIndex = path.findIndex(n => n.id === node.id)
    const nodeState = nodeIndex >= 0 ? states[nodeIndex] : 'locked'
    const exerciseIdx = nodeState === 'active' ? activeExerciseIndex : 0
    onStartLesson(node.lessonIndex, exerciseIdx)
  }

  if (loading) {
    return (
      <div className="devnodo-root devnodo-root--loading">
        <p className="devnodo-loading-text">Cargando mapa Dev-Node...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="devnodo-root devnodo-root--loading">
        <p className="devnodo-loading-text devnodo-loading-text--error">{error}</p>
        <button type="button" className="devnodo-btn-back" onClick={onBack}>
          ← INICIO
        </button>
      </div>
    )
  }

  return (
    <div className="devnodo-root">
      <div className="devnodo-grid-floor" aria-hidden />

      <HUD
        rank={rank}
        xpInLevel={xpInLevel}
        xpToNext={rankSize}
        totalXp={totalXp}
        completedCount={completed.length}
        nodeCount={path.length}
        onBack={onBack}
      />

      <div className="devnodo-path-wrap">
        <div className="devnodo-path-inner" style={{ height: totalHeight }}>
          {courseTitle && (
            <div className="devnodo-course-title">{courseTitle}</div>
          )}

          {chapterMarkers.map(cm => (
            <ChapterMarker
              key={cm.chapter}
              chapter={cm.chapter}
              y={cm.y}
              chapterTitles={chapterTitles}
            />
          ))}

          <Cables positions={positions} states={states} totalHeight={totalHeight} />

          {path.map((n, i) => (
            <HexNode
              key={n.id}
              node={n}
              state={states[i]}
              x={positions[i].x}
              y={positions[i].y}
              onClick={handleNodeClick}
            />
          ))}

          <div className="devnodo-end-marker" style={{ top: totalHeight - 100 }}>
            <div className="devnodo-end-title">FULLSTACK DEVELOPER</div>
            <div className="devnodo-end-sub">// END_OF_PATH · {path.length} NODES</div>
          </div>
        </div>
      </div>

      {openNode && (
        <NodeModal
          node={openNode}
          state={openNodeState}
          onClose={() => setOpenNode(null)}
          onStart={handleStart}
        />
      )}

      <footer className="devnodo-footer">
        <span>
          $ devnode --status <span className="online">● online</span> · sync:learn.devnodo.com
        </span>
        <span>
          ↑↓ scroll · click hex · nodo activo: <span className="hint">▸ INICIAR NODO</span>
        </span>
      </footer>
    </div>
  )
}
