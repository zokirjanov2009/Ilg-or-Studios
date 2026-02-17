import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { SolarSystemCanvas } from './SolarSystemCanvas'

export function Background() {
  const { scrollYProgress } = useScroll()
  const reducedMotion = useReducedMotion()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.2,
  })

  const leftBlobY = useTransform(smoothProgress, [0, 1], ['-8%', '10%'])
  const rightBlobY = useTransform(smoothProgress, [0, 1], ['4%', '-8%'])
  const centerBlobY = useTransform(smoothProgress, [0, 1], ['0%', '14%'])
  const canvasOpacity = useTransform(smoothProgress, [0, 0.08, 0.85, 1], [0.72, 0.95, 1, 0.86])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: leftBlobY }}
        className="absolute -left-28 -top-32 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl md:h-96 md:w-96"
      />
      <motion.div
        style={{ y: rightBlobY }}
        className="absolute -right-28 top-1/4 h-72 w-72 rounded-full bg-cyan-500/16 blur-3xl md:h-96 md:w-96"
      />
      <motion.div
        style={{ y: centerBlobY }}
        className="absolute -bottom-36 left-1/3 h-80 w-80 rounded-full bg-purple-500/16 blur-3xl md:h-112 md:w-md"
      />

      <motion.div style={{ opacity: canvasOpacity }} className="absolute inset-0">
        <SolarSystemCanvas scroll={smoothProgress} reducedMotion={Boolean(reducedMotion)} />
      </motion.div>

      <div className="noise absolute inset-0 opacity-[0.14]" />
    </div>
  )
}
