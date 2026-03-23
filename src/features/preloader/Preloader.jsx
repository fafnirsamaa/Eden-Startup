/**
 * Full-screen preloader (Figma: Pre-loader, node 136:3).
 *
 * Sequence
 *  1. Background noise (container) fades in
 *  2. Eden logo fades + rises into place
 *  3. Version label appears
 *  4. Horizontal rule draws outward from the intersection
 *  5. Vertical rule draws outward from the intersection (overlaps)
 *  6. Diamond star appears at the intersection
 *  7. Logo / lines / version fade out
 *  8. Star scales up to fill the entire screen (eden-dark colour)
 *  9. Preloader fades to 0 → onComplete()
 */
import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import bgNoise from '@/assets/images/bg_noise.webp'
import edenLogo from '@/assets/images/eden_logo_baseline.svg'

/* Intersection position as percentages of the preloader frame */
const IX = 20   // vertical line: % from left
const IY = 61   // horizontal line: % from top

const LINE_COLOR = '#203B32'
const STAR_COLOR = '#203B32'

export function Preloader({ onComplete }) {
  const containerRef = useRef(null)
  const logoRef      = useRef(null)
  const hLineRef     = useRef(null)
  const vLineRef     = useRef(null)
  const starRef      = useRef(null)
  const versionRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const logo      = logoRef.current
      const hLine     = hLineRef.current
      const vLine     = vLineRef.current
      const star      = starRef.current
      const version   = versionRef.current

      /* ── Initial hidden state ──────────────────────────────── */
      gsap.set(container, { opacity: 0 })
      gsap.set([logo, version], { opacity: 0 })
      gsap.set(hLine, { scaleX: 0, opacity: 1 })
      gsap.set(vLine, { scaleY: 0, opacity: 1 })
      gsap.set(star,  { scale: 0, opacity: 0 })

      const tl = gsap.timeline()

      /* 1. Noise background fades in */
      tl.to(container, { opacity: 1, duration: 0.5, ease: 'power1.in' })

      /* 2. Logo */
      tl.fromTo(
        logo,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.2'
      )

      /* 3. Version */
      tl.to(version, { opacity: 0.55, duration: 0.35 }, '-=0.45')

      /* 4. Horizontal line — drawn outward from intersection */
      tl.to(hLine, {
        scaleX: 1,
        duration: 0.65,
        ease: 'power2.inOut',
        transformOrigin: `${IX}% 50%`,
      }, '+=0.1')

      /* 5. Vertical line — drawn outward from intersection (overlaps) */
      tl.to(vLine, {
        scaleY: 1,
        duration: 0.65,
        ease: 'power2.inOut',
        transformOrigin: `50% ${IY}%`,
      }, '-=0.38')

      /* 6. Diamond star appears */
      tl.to(star, {
        scale: 1,
        opacity: 1,
        duration: 0.38,
        ease: 'back.out(2.2)',
      }, '-=0.12')

      /* 7. Fade everything except the star */
      tl.to(
        [logo, hLine, vLine, version],
        { opacity: 0, duration: 0.3, ease: 'power1.in' },
        '+=0.35'
      )

      /* 8. Star explodes outward — floods the screen with eden-dark */
      tl.to(star, {
        scale: 90,
        duration: 0.85,
        ease: 'power4.in',
      }, '-=0.2')

      /* 9. Fade the whole preloader, then hand off */
      tl.to(container, {
        opacity: 0,
        duration: 0.28,
        onComplete: () => onComplete?.(),
      }, '-=0.08')
    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        backgroundImage: `url(${bgNoise})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* ── Eden logo ─────────────────────────────── */}
      <div
        ref={logoRef}
        style={{
          position: 'absolute',
          top: '18%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          src={edenLogo}
          alt="Eden"
          style={{ width: 220, height: 'auto', display: 'block' }}
        />
      </div>

      {/* ── Horizontal rule ───────────────────────── */}
      <div
        ref={hLineRef}
        style={{
          position: 'absolute',
          top: `${IY}%`,
          left: 0,
          right: 0,
          height: 1,
          background: LINE_COLOR,
        }}
      />

      {/* ── Vertical rule ─────────────────────────── */}
      <div
        ref={vLineRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${IX}%`,
          width: 1,
          background: LINE_COLOR,
        }}
      />

      {/* ── Diamond star at intersection ──────────── */}
      {/*
        Centered on the intersection via negative margin (avoids CSS transform
        conflicts with GSAP's scale).  The fill matches --color-eden-dark so
        the explosion seamlessly becomes the home-page background.
      */}
      <div
        ref={starRef}
        style={{
          position: 'absolute',
          top: `${IY}%`,
          left: `${IX}%`,
          width: 28,
          height: 28,
          marginLeft: -14,
          marginTop: -14,
        }}
      >
        <svg viewBox="0 0 28 28" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 14,0 Q 14,14 28,14 Q 14,14 14,28 Q 14,14 0,14 Q 14,14 14,0 Z"
            fill={STAR_COLOR}
          />
        </svg>
      </div>

      {/* ── Version label ─────────────────────────── */}
      <div
        ref={versionRef}
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          letterSpacing: '0.08em',
          color: LINE_COLOR,
          pointerEvents: 'none',
        }}
      >
        v0.01
      </div>
    </div>
  )
}
