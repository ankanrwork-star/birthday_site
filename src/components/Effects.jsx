import { createContext, useCallback, useContext, useEffect, useRef } from 'react'

const FxContext = createContext(null)
export const useFx = () => useContext(FxContext)

const COLORS = ['#ff4d6d', '#ff8fab', '#c9184a', '#ffb3c6', '#ffd166', '#ffffff']
const HEARTS = ['💖', '💗', '💕', '❤️', '🩷']
const sprites = {}
const sprite = (ch) => {
  if (!sprites[ch]) {
    const c = document.createElement('canvas'); c.width = c.height = 64
    const x = c.getContext('2d'); x.font = '50px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, 32, 34)
    sprites[ch] = c
  }
  return sprites[ch]
}
const rand = (a, b) => a + Math.random() * (b - a)

/** Canvas particle layer. Exposes confetti / hearts / sparkles through context. */
export function FxProvider({ children }) {
  const canvasRef = useRef(null)
  const parts = useRef([])
  const raf = useRef(0)
  const last = useRef(0)

  const tick = useCallback((t) => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const dt = Math.min((t - last.current) / 16.67, 3) || 1
    last.current = t
    ctx.clearRect(0, 0, c.width, c.height)
    parts.current = parts.current.filter((p) => p.life > 0)
    for (const p of parts.current) {
      p.life -= dt
      p.vy += p.g * dt
      p.vx *= 0.99
      p.x += (p.vx + (p.sway ? Math.sin(p.life / 14) * p.sway : 0)) * dt
      p.y += p.vy * dt
      p.rot += p.vr * dt
      const k = Math.max(p.life / p.max, 0)
      ctx.save()
      ctx.globalAlpha = Math.min(1, k * 2.5)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      if (p.kind === 'emoji') {
        ctx.drawImage(sprite(p.char), -p.size / 2, -p.size / 2, p.size, p.size)
      } else if (p.kind === 'spark') {
        ctx.fillStyle = p.color
        const s = p.size * (0.5 + k)
        ctx.beginPath()
        ctx.moveTo(0, -s); ctx.lineTo(s * 0.25, -s * 0.25); ctx.lineTo(s, 0); ctx.lineTo(s * 0.25, s * 0.25)
        ctx.lineTo(0, s); ctx.lineTo(-s * 0.25, s * 0.25); ctx.lineTo(-s, 0); ctx.lineTo(-s * 0.25, -s * 0.25)
        ctx.fill()
      } else {
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, (-p.size * p.ratio) / 2, p.size, p.size * p.ratio)
      }
      ctx.restore()
    }
    raf.current = parts.current.length ? requestAnimationFrame(tick) : 0
  }, [])

  const add = useCallback((list) => {
    parts.current.push(...list)
    if (!raf.current) { last.current = performance.now(); raf.current = requestAnimationFrame(tick) }
  }, [tick])

  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current
      const d = Math.min(devicePixelRatio || 1, 1.5)
      c.width = innerWidth * d; c.height = innerHeight * d
      c.getContext('2d').setTransform(d, 0, 0, d, 0, 0)
    }
    resize()
    addEventListener('resize', resize)
    return () => { removeEventListener('resize', resize); cancelAnimationFrame(raf.current) }
  }, [])

  const api = useRef({
    confetti(n = 100, x = innerWidth / 2, y = innerHeight / 2) {
      add(Array.from({ length: n }, () => {
        const a = rand(0, Math.PI * 2), s = rand(4, 13)
        const life = rand(70, 150)
        return { kind: 'rect', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, g: 0.22, rot: rand(0, 6),
          vr: rand(-0.3, 0.3), size: rand(6, 12), ratio: rand(0.4, 1), color: COLORS[(Math.random() * COLORS.length) | 0], life, max: life }
      }))
    },
    hearts(n = 20) {
      for (let i = 0; i < n; i++) {
        setTimeout(() => {
          const life = rand(160, 280)
          add([{ kind: 'emoji', char: HEARTS[i % HEARTS.length], x: rand(0, innerWidth), y: innerHeight + 30,
            vx: 0, vy: rand(-3.2, -1.6), g: -0.002, sway: rand(0.3, 1.2), rot: rand(-0.3, 0.3), vr: rand(-0.01, 0.01),
            size: rand(20, 42), life, max: life }])
        }, i * rand(40, 110))
      }
    },
    sparkles(x, y, n = 14) {
      add(Array.from({ length: n }, (_, i) => {
        const a = rand(0, Math.PI * 2), s = rand(1, 5), life = rand(35, 70)
        return { kind: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 0.03, rot: 0, vr: rand(-0.1, 0.1),
          size: rand(5, 12), color: i % 2 ? '#ffd166' : '#fff', life, max: life }
      }))
    },
    finale() {
      const { confetti, hearts, sparkles } = api.current
      confetti(220, innerWidth / 2, innerHeight * 0.4)
      hearts(60)
      setTimeout(() => confetti(140, innerWidth * 0.15, innerHeight * 0.55), 350)
      setTimeout(() => confetti(140, innerWidth * 0.85, innerHeight * 0.55), 650)
      for (let i = 0; i < 10; i++) setTimeout(() => sparkles(rand(0, innerWidth), rand(0, innerHeight), 14), i * 220)
    },
  })

  return (
    <FxContext.Provider value={api.current}>
      {children}
      <canvas ref={canvasRef} className="fx" aria-hidden="true" />
    </FxContext.Provider>
  )
}
