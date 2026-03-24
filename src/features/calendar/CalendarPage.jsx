import { useRef, useEffect, useState } from 'react'
import { Bell, UserRound, CalendarDays } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { BottomNav } from '@/components/layout/BottomNav'
import laitueImg from '@/assets/images/laitue.webp'
import tomatoImg from '@/assets/images/tomato.webp'
import basilicImg from '@/assets/images/basilic.webp'
import edenLogo from '@/assets/images/eden_logo.svg'

const PROFILE_IMG = 'https://www.figma.com/api/mcp/asset/fded8679-9a6b-46b9-afdf-d77a506d6dae'

/* ── Mock data ─────────────────────────────────────────────── */
const MOCK_CALENDAR = [
  {
    slotId: 'slot-1',
    slotName: 'Eden L — Bac 1',
    plants: [
      {
        id: 'p1',
        name: 'Tomate',
        variety: 'Cerise',
        image: tomatoImg,
        harvestDate: '20 avr. 2026',
        daysLeft: 28,
        steps: [
          { label: 'Semis', done: true },
          { label: 'Germination', done: true },
          { label: 'Croissance', done: true },
          { label: 'Récolte', done: false },
        ],
      },
      {
        id: 'p2',
        name: 'Laitue',
        variety: 'Batavia',
        image: laitueImg,
        harvestDate: '5 avr. 2026',
        daysLeft: 13,
        steps: [
          { label: 'Semis', done: true },
          { label: 'Germination', done: true },
          { label: 'Récolte', done: false },
        ],
      },
    ],
  },
  {
    slotId: 'slot-2',
    slotName: 'Eden L — Bac 2',
    plants: [
      {
        id: 'p3',
        name: 'Basilic',
        variety: 'Génois',
        image: basilicImg,
        harvestDate: '15 mai 2026',
        daysLeft: 53,
        steps: [
          { label: 'Semis', done: true },
          { label: 'Germination', done: true },
          { label: 'Croissance', done: false },
          { label: 'Récolte', done: false },
        ],
      },
    ],
  },
]

/* ── Sub-components ────────────────────────────────────────── */

function Avatar({ src }) {
  const [broken, setBroken] = useState(false)
  return broken ? (
    <div
      className="flex items-center justify-center rounded-full overflow-hidden"
      style={{ width: 42, height: 42, background: 'var(--color-eden-elevated)' }}
    >
      <UserRound size={22} color="var(--color-eden-light)" strokeWidth={1.5} />
    </div>
  ) : (
    <img
      src={src}
      alt="Profil"
      onError={() => setBroken(true)}
      className="rounded-full object-cover"
      style={{ width: 42, height: 42 }}
    />
  )
}

function StepsTimeline({ steps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {steps.map((step, i) => {
        const isActive = !step.done && (i === 0 || steps[i - 1].done)
        const isLast = i === steps.length - 1
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              flex: isLast ? 'none' : 1,
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: step.done
                    ? 'var(--color-eden-lime)'
                    : isActive
                    ? 'rgba(252,255,242,0.65)'
                    : 'rgba(252,255,242,0.18)',
                  boxShadow: isActive ? '0 0 0 3px rgba(219,255,89,0.22)' : 'none',
                }}
              />
              <span
                className="font-body"
                style={{
                  fontSize: 9.5,
                  color: step.done
                    ? 'var(--color-eden-lime)'
                    : isActive
                    ? 'rgba(252,255,242,0.85)'
                    : 'rgba(252,255,242,0.32)',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: 1.5,
                  alignSelf: 'flex-start',
                  marginTop: 4,
                  marginLeft: 4,
                  marginRight: 4,
                  background: step.done
                    ? 'var(--color-eden-lime)'
                    : 'rgba(252,255,242,0.13)',
                  borderRadius: 9999,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function PlantCard({ plant }) {
  const doneCount = plant.steps.filter(s => s.done).length
  const progressPct = Math.round((doneCount / plant.steps.length) * 100)
  const isUrgent = plant.daysLeft <= 14

  return (
    <div
      style={{
        background: 'var(--color-eden-elevated)',
        borderRadius: 24,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 14,
            overflow: 'hidden',
            flexShrink: 0,
            background: 'rgba(32,59,50,0.7)',
          }}
        >
          <img
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center bottom',
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            <h3
              className="font-heading"
              style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-eden-light)', margin: 0 }}
            >
              {plant.name}
            </h3>
            <span
              className="font-body"
              style={{ fontSize: 11, color: 'rgba(252,255,242,0.42)' }}
            >
              {plant.variety}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <CalendarDays
              size={12}
              color={isUrgent ? 'var(--color-eden-lime)' : 'rgba(252,255,242,0.42)'}
              strokeWidth={1.5}
            />
            <span
              className="font-body"
              style={{
                fontSize: 12,
                color: isUrgent ? 'var(--color-eden-lime)' : 'rgba(252,255,242,0.42)',
              }}
            >
              Récolte le {plant.harvestDate}
            </span>
          </div>
        </div>

        {/* Countdown badge */}
        <div
          style={{
            background: isUrgent ? 'var(--color-eden-lime)' : 'rgba(252,255,242,0.08)',
            borderRadius: 12,
            padding: '8px 10px',
            textAlign: 'center',
            flexShrink: 0,
            minWidth: 48,
          }}
        >
          <div
            className="font-body"
            style={{
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1,
              color: isUrgent ? 'var(--color-eden-ink)' : 'var(--color-eden-light)',
            }}
          >
            {plant.daysLeft}
          </div>
          <div
            className="font-body"
            style={{
              fontSize: 10,
              lineHeight: 1.4,
              color: isUrgent ? 'rgba(29,38,27,0.65)' : 'rgba(252,255,242,0.42)',
            }}
          >
            jours
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="font-body" style={{ fontSize: 11, color: 'rgba(252,255,242,0.42)' }}>
            Progression
          </span>
          <span
            className="font-body"
            style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-eden-lime)' }}
          >
            {progressPct}%
          </span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 9999,
            background: 'rgba(252,255,242,0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: 'var(--color-eden-lime)',
              borderRadius: 9999,
            }}
          />
        </div>
      </div>

      {/* Step timeline */}
      <StepsTimeline steps={plant.steps} />
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────── */

export function CalendarPage() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.will-reveal',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.72, stagger: 0.1, ease: 'power3.out', delay: 0.08 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const upcomingHarvests = MOCK_CALENDAR
    .flatMap(slot => slot.plants.map(p => ({ ...p, slotName: slot.slotName })))
    .sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <div ref={pageRef} className="min-h-screen" style={{ background: 'var(--color-eden-dark)' }}>
      <div className="mx-auto" style={{ maxWidth: 393 }}>

        {/* Header */}
        <header
          className="will-reveal flex items-center justify-between"
          style={{ padding: '16px 20px 8px' }}
        >
          <div style={{ width: 33, height: 42, display: 'flex', alignItems: 'center' }}>
            <img
              src={edenLogo}
              alt="Eden"
              className="block h-full w-full object-contain"
              style={{ objectPosition: 'left center' }}
            />
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <Avatar src={PROFILE_IMG} />
            <button
              aria-label="Notifications"
              className="flex items-center justify-center rounded-full"
              style={{
                width: 42,
                height: 42,
                background: 'var(--color-eden-lime)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Bell size={20} color="#1D261B" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Title */}
        <section className="will-reveal" style={{ padding: '24px 20px 8px' }}>
          <h1
            className="font-heading font-medium"
            style={{ fontSize: 48, lineHeight: 1.1, color: 'var(--color-eden-light)' }}
          >
            Calendrier
          </h1>
        </section>

        <main className="flex flex-col" style={{ padding: '0 20px 136px', gap: 28 }}>

          {/* Upcoming harvests — horizontal scroll strip */}
          <div className="will-reveal">
            <h2
              className="font-body"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(252,255,242,0.45)',
                marginBottom: 12,
              }}
            >
              Prochaines récoltes
            </h2>
            <div
              style={{
                display: 'flex',
                gap: 10,
                overflowX: 'auto',
                paddingBottom: 4,
                scrollbarWidth: 'none',
              }}
            >
              {upcomingHarvests.map(plant => {
                const urgent = plant.daysLeft <= 14
                return (
                  <div
                    key={plant.id}
                    style={{
                      flexShrink: 0,
                      width: 128,
                      background: 'var(--color-eden-elevated)',
                      borderRadius: 20,
                      padding: '14px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: 'rgba(32,59,50,0.7)',
                      }}
                    >
                      <img
                        src={plant.image}
                        alt={plant.name}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center bottom',
                        }}
                      />
                    </div>
                    <div>
                      <p
                        className="font-heading"
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: 'var(--color-eden-light)',
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {plant.name}
                      </p>
                      <p
                        className="font-body"
                        style={{ fontSize: 10, color: 'rgba(252,255,242,0.38)', margin: '2px 0 0' }}
                      >
                        {plant.slotName.split('—')[1]?.trim()}
                      </p>
                    </div>
                    <div
                      style={{
                        background: urgent ? 'var(--color-eden-lime)' : 'rgba(252,255,242,0.08)',
                        borderRadius: 8,
                        padding: '5px 9px',
                        display: 'inline-flex',
                        alignItems: 'baseline',
                        gap: 3,
                        width: 'fit-content',
                      }}
                    >
                      <span
                        className="font-body"
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          lineHeight: 1,
                          color: urgent ? 'var(--color-eden-ink)' : 'var(--color-eden-light)',
                        }}
                      >
                        {plant.daysLeft}
                      </span>
                      <span
                        className="font-body"
                        style={{
                          fontSize: 10,
                          color: urgent ? 'rgba(29,38,27,0.6)' : 'rgba(252,255,242,0.45)',
                        }}
                      >
                        j
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Per-slot plant cards */}
          {MOCK_CALENDAR.map(slot => (
            <div key={slot.slotId} className="will-reveal">
              <h2
                className="font-body"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(252,255,242,0.45)',
                  marginBottom: 12,
                }}
              >
                {slot.slotName}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {slot.plants.map(plant => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            </div>
          ))}
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
