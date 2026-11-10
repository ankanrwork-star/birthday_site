import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AGE, RECIPIENT } from '../data'
import { useFx } from './Effects'

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const SPRINKLES = [[88, 262], [128, 292], [172, 268], [214, 296], [256, 266], [296, 292], [318, 262], [150, 190], [200, 205], [250, 188]]
const DRIPS = [78, 112, 146, 182, 218, 254, 288, 322]

export default function Cake() {
  const fx = useFx()
  const btn = useRef(null)
  const [blown, setBlown] = useState(false)
  const [round, setRound] = useState(0) // restarts the smoke animation on every blow

  const digits = String(AGE).split('')
  const xs = digits.map((_, i) => 200 + (i - (digits.length - 1) / 2) * 74)

  const blow = () => {
    const r = btn.current.getBoundingClientRect()
    setBlown(true)
    setRound((n) => n + 1)
    fx.confetti(70, r.left + r.width / 2, r.top)
    fx.hearts(10)
    setTimeout(() => fx.sparkles(innerWidth / 2, innerHeight * 0.4, 12), 300)
  }

  return (
    <section className="cake-sec" id="cake">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <h2>{blown ? `Happy ${ordinal(AGE)}, ${RECIPIENT}! 🎉` : 'Time for the cake! 🎂'}</h2>
        <p className="cake-sec__sub">{blown ? 'May every wish you made come true 💫' : 'Close your eyes, make a wish, then blow out the candles.'}</p>
      </motion.div>

      <motion.div
        className={`cake ${blown ? 'cake--blown' : ''}`}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 80, damping: 14 }}
      >
        <div className="cake__glow" />
        <motion.svg viewBox="0 0 400 360" role="img" aria-label={`Birthday cake with ${AGE} candles`}
          animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
          <defs>
            <linearGradient id="tier1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff8fab" /><stop offset="1" stopColor="#ff4d6d" /></linearGradient>
            <linearGradient id="tier2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb3c6" /><stop offset="1" stopColor="#ff8fab" /></linearGradient>
            <linearGradient id="candle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset=".5" stopColor="#ffe5ec" /><stop offset="1" stopColor="#ffd166" /></linearGradient>
            <radialGradient id="flameOuter" cx=".5" cy=".75" r=".6"><stop offset="0" stopColor="#fff3b0" /><stop offset=".6" stopColor="#ffb703" /><stop offset="1" stopColor="#ff6b35" /></radialGradient>
          </defs>

          <ellipse cx="200" cy="322" rx="175" ry="22" fill="#ffd9e2" stroke="#ffb3c6" strokeWidth="3" />
          {/* bottom tier */}
          <rect x="60" y="220" width="280" height="102" rx="20" fill="url(#tier1)" />
          <rect x="60" y="220" width="280" height="26" rx="14" fill="#fff" />
          {DRIPS.map((x, i) => <circle key={x} cx={x} cy={246 + (i % 2) * 6} r="12" fill="#fff" />)}
          {/* top tier */}
          <rect x="110" y="150" width="180" height="78" rx="16" fill="url(#tier2)" />
          <rect x="110" y="150" width="180" height="22" rx="12" fill="#fff" />
          {[128, 160, 192, 224, 256, 274].map((x, i) => <circle key={x} cx={x} cy={172 + (i % 2) * 5} r="10" fill="#fff" />)}
          {SPRINKLES.map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="10" height="4" rx="2" fill={['#ffd166', '#c9184a', '#fff', '#80ffdb'][i % 4]} transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
          <text x="200" y="305" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontSize="22" fill="#fff" opacity=".9">make a wish</text>

          {/* number candles */}
          {digits.map((d, i) => (
            <g key={i}>
              <text x={xs[i]} y="152" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="700" fontSize="92"
                fill="url(#candle)" stroke="#c9184a" strokeWidth="3" paintOrder="stroke">{d}</text>
              <line x1={xs[i]} y1="82" x2={xs[i]} y2="94" stroke="#4a0a1f" strokeWidth="3" strokeLinecap="round" />
              <g transform={`translate(${xs[i]} 84)`}>
                <g className="flame" style={{ animationDelay: `${i * 0.25}s`, transitionDelay: `${i * 0.18}s` }}>
                  <path d="M0,0 C-13,-5 -13,-22 0,-44 C13,-22 13,-5 0,0 Z" fill="url(#flameOuter)" />
                  <path d="M0,-2 C-6,-5 -6,-14 0,-26 C6,-14 6,-5 0,-2 Z" fill="#fffbe6" opacity=".9" />
                </g>
                {blown && [0, 1, 2].map((k) => (
                  <circle key={`${round}-${k}`} className="smoke" r="5" cx="0" cy="-14"
                    style={{ animationDelay: `${i * 0.18 + k * 0.28}s`, '--dx': `${(k - 1) * 14 + (i ? 10 : -10)}px` }} />
                ))}
              </g>
            </g>
          ))}
        </motion.svg>
      </motion.div>

      <div className="cake-sec__actions">
        <AnimatePresence mode="wait" initial={false}>
          {!blown ? (
            <motion.div key="blow" className="halo" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <motion.button ref={btn} className="btn btn--primary" onClick={blow} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <span className="btn__glow" /> 🕯️ Blow the candles
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="after" className="cake-sec__after" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }}>
              <button className="btn btn--ghost" onClick={() => setBlown(false)}>🔥 Light them again</button>
              <button className="btn btn--primary btn--sm2" onClick={() => document.getElementById('wishes')?.scrollIntoView({ behavior: 'smooth' })}>
                Open your wishes 💌
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
