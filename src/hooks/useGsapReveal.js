import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * Attaches a GSAP staggered reveal to all `.will-reveal` children
 * of the returned `containerRef`.
 *
 * @param {object} options
 * @param {number} [options.delay=0]       - Initial delay in seconds
 * @param {number} [options.stagger=0.08]  - Stagger between children
 * @param {number} [options.duration=0.72] - Tween duration
 * @param {boolean} [options.scrollTrigger=false] - Wire to ScrollTrigger
 * @returns {React.RefObject}
 */
export function useGsapReveal({
  delay = 0,
  stagger = 0.08,
  duration = 0.72,
  scrollTrigger = false,
} = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = containerRef.current?.querySelectorAll('.will-reveal')
      if (!targets?.length) return

      gsap.fromTo(
        targets,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          delay,
          ease: 'power3.out',
          ...(scrollTrigger && {
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }),
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [delay, stagger, duration, scrollTrigger])

  return containerRef
}
