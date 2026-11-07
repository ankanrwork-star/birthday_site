import { useRef, useState } from 'react'
import Background from './components/Background'
import Hero from './components/Hero'
import Wishes from './components/Wishes'
import { FxProvider, useFx } from './components/Effects'

function Page() {
  const fx = useFx()
  const [revealed, setRevealed] = useState(false)
  const wishesRef = useRef(null)

  const start = () => {
    fx.confetti(140, innerWidth / 2, innerHeight * 0.6)
    fx.hearts(28)
    setRevealed(true)
    setTimeout(() => document.getElementById('wishes')?.scrollIntoView({ behavior: 'smooth' }), 900)
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
            <div ref={wishesRef}><Wishes /></div>
          </>
        )}
      </main>
    </>
  )
}

export default function App() {
  return <FxProvider><Page /></FxProvider>
}
