import { motion } from 'framer-motion'
import { RECIPIENT } from '../data'

const word = { hidden: { y: 40, opacity: 0 }, show: { y: 0, opacity: 1 } }

export default function Hero({ revealed, onStart }) {
  const title = ['Happy', 'Birthday,']
  return (
    <section className={`hero ${revealed ? 'hero--short' : ''}`}>
      <motion.h1
        className="hero__title"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.18, delayChildren: 0.2 }}
      >
        {title.map((w) => (
          <motion.span key={w} variants={word} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>{w} </motion.span>
        ))}
        <motion.em variants={word} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>{RECIPIENT}</motion.em>
        <motion.span className="hero__cake" variants={word}> 🎂</motion.span>
      </motion.h1>

      <motion.p className="hero__sub" initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 1.1, duration: 1 }}>
        {revealed ? 'Scroll down — your wishes are waiting 💌' : 'Someone made something special just for you…'}
      </motion.p>

      {!revealed && (
        <motion.div
          className="halo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.button
            className="btn btn--primary"
            onClick={onStart}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="btn__glow" /> Tap for your surprise 🎉
          </motion.button>
        </motion.div>
      )}

      {revealed && (
        <motion.div className="hero__chevron" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>⌄</motion.div>
      )}
    </section>
  )
}
