import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { BottomNav } from '@/components/layout/BottomNav'
import { Avatar } from '@/components/Avatar'
import { GardenSlotCard } from './components/GardenSlotCard'
import { OfferBannerCard } from './components/OfferBannerCard'
import { NewProductCard } from './components/NewProductCard'
import edenLNoBg from '../../assets/images/eden_l_no_bg.webp'
import edenLogo from '../../assets/images/eden_logo.svg'

/** Mock slots — swap for real data from gardenStore / useSensorData */
const MOCK_SLOTS = [
  { id: 'slot-1', name: 'Eden L', status: 'En ligne', imageUrl: edenLNoBg },
  { id: 'slot-2', name: 'Eden L', status: 'En ligne', imageUrl: edenLNoBg },
]

export function HomePage() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.will-reveal',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.08,
        }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ background: 'var(--color-eden-dark)' }}
    >
      {/* Mobile-width constraint — centred on desktop */}
      <div className="mx-auto" style={{ maxWidth: 393 }}>

        {/* ── Top navigation bar ─────────────────── */}
        <header
          className="will-reveal flex items-center justify-between"
          style={{ padding: '16px 20px 8px' }}
        >
          {/* Eden logo */}
          <div style={{ width: 33, height: 42, display: 'flex', alignItems: 'center' }}>
            <img
              src={edenLogo}
              alt="Eden"
              className="block h-full w-full object-contain"
              style={{ objectPosition: 'left center' }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <Link to="/profile" aria-label="Mon profil" className="rounded-full overflow-hidden shrink-0">
              <Avatar />
            </Link>

            <Link
              to="/notifications"
              aria-label="Notifications"
              className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
              style={{
                width: 42,
                height: 42,
                background: 'var(--color-eden-lime)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Bell size={20} color="#1D261B" strokeWidth={1.5} />
            </Link>
          </div>
        </header>

        {/* ── Greeting ───────────────────────────── */}
        <section
          className="will-reveal"
          style={{ padding: '24px 20px 16px' }}
        >
          <h1
            className="font-heading font-medium"
            style={{
              fontSize: 48,
              lineHeight: 1.1,
              color: 'var(--color-eden-light)',
            }}
          >
            {'Bon retour, '}
            <span
              className="font-heading font-bold"
              style={{ color: 'var(--color-eden-lime)' }}
            >
              Charles
            </span>
          </h1>
        </section>

        {/* ── Card feed ──────────────────────────── */}
        <main
          className="flex flex-col"
          style={{ padding: '0 20px 136px', gap: 16 }}
        >
          {/* Slot 1 */}
          <div className="will-reveal">
            <GardenSlotCard {...MOCK_SLOTS[0]} />
          </div>

          {/* Promo banner */}
          <div className="will-reveal">
            <OfferBannerCard discountPct={20} />
          </div>

          {/* Slot 2 */}
          <div className="will-reveal">
            <GardenSlotCard {...MOCK_SLOTS[1]} />
          </div>

          {/* New product teaser */}
          <div className="will-reveal">
            <NewProductCard />
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
