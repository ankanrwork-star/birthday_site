import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WISHES, ULTIMATE } from '../data'
import { useFx } from './Effects'

const KEY = 'bday-viewed-v2'
const loadViewed = () => {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch { return new Set() }
}

const grid = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }
const item = {
  hidden: { opacity: 0, y: 60, scale: 0.85, rotate: -3 },
  show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } },
}

function Modal({ card, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div className="overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className={`modal ${card.big ? 'modal--big' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0, rotate: -6, y: 40 }}
        animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.8 }}
      >
        <motion.div className="modal__emoji" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>{card.icon}</motion.div>
        <h3>{card.title}</h3>
        <p>{card.text}</p>
        <button className="btn btn--primary btn--sm" autoFocus onClick={onClose}>Close 💗</button>
      </motion.div>
    </motion.div>
  )
}

export default function Wishes() {
  const fx = useFx()
  const [viewed, setViewed] = useState(loadViewed)
  const [open, setOpen] = useState(null)

  const openWish = (i, e) => {
    const r = e.currentTarget.getBoundingClientRect()
    fx.sparkles(r.left + r.width / 2, r.top + r.height / 2)
    fx.hearts(10)
    setOpen({ ...WISHES[i] })
    setViewed((prev) => {
      const next = new Set(prev).add(i)
      try { localStorage.setItem(KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }

  const openUltimate = () => {
    fx.finale()
    setOpen({ icon: '🎂', ...ULTIMATE, big: true })
  }

  const count = viewed.size
  const all = count >= WISHES.length

  return (
    <section className="wishes" id="wishes">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <h2>Birthday Wishes 💌</h2>
        <p className="wishes__sub">Each one is wrapped just for you. Open them all.</p>
        <div className="meter" aria-label={`${count} of ${WISHES.length} wishes opened`}>
          <motion.div className="meter__fill" animate={{ width: `${(count / WISHES.length) * 100}%` }} transition={{ type: 'spring', stiffness: 80, damping: 15 }} />
        </div>
        <p className="wishes__count">{all ? 'All wishes opened 💝 — one last gift awaits' : `${count} of ${WISHES.length} opened`}</p>
      </motion.div>

      <motion.div className="grid" variants={grid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
        {WISHES.map((w, i) => (
          <motion.button
            key={w.title}
            variants={item}
            className={`wish ${viewed.has(i) ? 'wish--viewed' : ''}`}
            whileHover={{ y: -8, scale: 1.04, rotate: i % 2 ? 1.5 : -1.5 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => openWish(i, e)}
          >
            <span className="wish__icon">{w.icon}</span>
            <span className="wish__title">{w.title}</span>
            {viewed.has(i) && <span className="wish__check">✓</span>}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        className="ultimate-wrap"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 90, damping: 14 }}
      >
        <div className="halo">
          <motion.button className="btn btn--ultimate" onClick={openUltimate} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <span className="btn__glow" /> 🎁 Ultimate Birthday Message
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>{open && <Modal card={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  )
}
