import { useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Background from './components/Background'
import Hero from './components/Hero'
import Wishes from './components/Wishes'
import Cake from './components/Cake'
import { FxProvider, useFx } from './components/Effects'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/** Eased glide to an element (native smooth scroll is linear and abrupt). */
function glideTo(el, ms = 1500) {
  const to = el.getBoundingClientRect().top + scrollY
  if (reduced()) return scrollTo(0, to)
  const from = scrollY, dist = to - from, t0 = performance.now()
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const step = (now) => {
    const p = Math.min((now - t0) / ms, 1)
    scrollTo(0, from + dist * ease(p))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function Page() {
  const fx = useFx()
  const [revealed, setRevealed] = useState(false)
  const wishesRef = useRef(null)

  const start = () => {
    fx.confetti(60, innerWidth / 2, innerHeight * 0.6)
    fx.hearts(10)
    setRevealed(true)
    setTimeout(() => { const el = document.getElementById('cake'); el && glideTo(el) }, 700)
  }

  return (
    <>
      <Background />
      <main>
        <Hero revealed={revealed} onStart={start} />
        {revealed && (
          <>
            <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,64 C240,128 480,0 720,48 C960,96 1200,16 1440,64 L1440,120 L0,120 Z" />
            </svg>
            <Cake />
            <div ref={wishesRef}><Wishes /></div>
          </>
        )}
      </main>
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <FxProvider><Page /></FxProvider>
    </MotionConfig>
  )
}
