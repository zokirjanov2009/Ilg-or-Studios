import { useReducedMotion, useScroll } from 'framer-motion'
import { SolarSystemCanvas } from './SolarSystemCanvas'

export function Background() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <SolarSystemCanvas scroll={scrollYProgress} reducedMotion={!!prefersReducedMotion} />
    </div>
  )
}

