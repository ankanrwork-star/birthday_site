import { motion } from 'framer-motion'
import { YOUTUBE_URL, YOUTUBE_LABEL } from '../data'

export default function Finale() {
  const ready = Boolean(YOUTUBE_URL)
  return (
    <section className="finale">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ type: 'spring', stiffness: 80, damping: 14 }}>
        <h2>One last thing… 🎬</h2>
        <p>Something made just for you.</p>
        <div className="halo">
          <motion.a
            className={`btn btn--primary btn--link ${ready ? '' : 'btn--off'}`}
            href={ready ? YOUTUBE_URL : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!ready}
            onClick={(e) => !ready && e.preventDefault()}
            whileHover={ready ? { scale: 1.06 } : undefined}
            whileTap={ready ? { scale: 0.96 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="btn__glow" /> ▶ {YOUTUBE_LABEL}
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}
