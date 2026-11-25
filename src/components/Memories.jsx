import { useState } from 'react'
import { motion } from 'framer-motion'
import { MEMORIES } from '../data'

const list = { hidden: {}, show: { transition: { staggerChildren: 0.18 } } }
const tilt = (i) => (i % 2 ? 2.5 : -3)
const card = {
  hidden: { opacity: 0, y: 60, scale: 0.9, rotate: 0 },
  show: (i) => ({ opacity: 1, y: 0, scale: 1, rotate: tilt(i), transition: { type: 'spring', stiffness: 100, damping: 15 } }),
}

function Photo({ m, i }) {
  const [broken, setBroken] = useState(false)
  const src = m.src ? import.meta.env.BASE_URL + m.src.replace(/^\//, '') : ''
  const showImg = src && !broken
  return (
    <motion.figure className={`polaroid ${i % 2 ? 'polaroid--b' : 'polaroid--a'}`} variants={card} custom={i}
      whileHover={{ y: -10, rotate: 0, scale: 1.04 }} transition={{ type: 'spring', stiffness: 250, damping: 20 }}>
      <span className="polaroid__age">Age {m.age}</span>
      <div className="polaroid__frame">
        {showImg ? (
          <img src={src} alt={`Age ${m.age}: ${m.caption}`} loading="lazy" decoding="async" onError={() => setBroken(true)} />
        ) : (
          <div className="polaroid__ph" aria-label={`Placeholder for the age ${m.age} photo`}>
            <span>📷</span>
            <small>Photo {i + 1}</small>
          </div>
        )}
      </div>
      <figcaption>{m.caption}</figcaption>
    </motion.figure>
  )
}

export default function Memories() {
  return (
    <section className="years" id="years">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <h2>Through the Years 📸</h2>
        <p className="years__sub">A little walk through the moments that made you, you.</p>
      </motion.div>
      <motion.div className="years__grid" variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
        {MEMORIES.map((m, i) => <Photo key={i} m={m} i={i} />)}
      </motion.div>
    </section>
  )
}
