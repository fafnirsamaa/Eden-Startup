import { useRef, useEffect, useState, useMemo } from 'react'
import {
  Bell,
  UserRound,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { BottomNav } from '@/components/layout/BottomNav'
import laitueImg from '@/assets/images/laitue.webp'
import tomatoImg from '@/assets/images/tomato.webp'
import basilicImg from '@/assets/images/basilic.webp'
import edenLogo from '@/assets/images/eden_logo.svg'

const PROFILE_IMG = 'https://www.figma.com/api/mcp/asset/fded8679-9a6b-46b9-afdf-d77a506d6dae'

/* Pinned "today" for the mock data. Swap for new Date() in production. */
const TODAY = new Date(2026, 2, 23)

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

/* ── Date helpers ──────────────────────────────────────────── */
const MONTH_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
]
const DOW_FR = ['L','M','M','J','V','S','D']

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(base, n) {
  const d = new Date(base)
  d.setDate(d.getDate() + n)
  return d
}

const TODAY_KEY = dateKey(TODAY)

/* ── Shared sub-components ─────────────────────────────────── */

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
            style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? 'none' : 1, minWidth: 0 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: step.done
                    ? 'var(--color-eden-lime)'
                    : isActive ? 'rgba(252,255,242,0.65)' : 'rgba(252,255,242,0.18)',
                  boxShadow: isActive ? '0 0 0 3px rgba(219,255,89,0.22)' : 'none',
                }}
              />
              <span
                className="font-body"
                style={{
                  fontSize: 9.5,
                  color: step.done
                    ? 'var(--color-eden-lime)'
                    : isActive ? 'rgba(252,255,242,0.85)' : 'rgba(252,255,242,0.32)',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                style={{
                  flex: 1, height: 1.5, alignSelf: 'flex-start',
                  marginTop: 4, marginLeft: 4, marginRight: 4,
                  background: step.done ? 'var(--color-eden-lime)' : 'rgba(252,255,242,0.13)',
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
        borderRadius: 24, padding: 16,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 58, height: 58, borderRadius: 14, overflow: 'hidden', flexShrink: 0, background: 'rgba(32,59,50,0.7)' }}>
          <img src={plant.image} alt={plant.name} loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-eden-light)', margin: 0 }}>
              {plant.name}
            </h3>
            <span className="font-body" style={{ fontSize: 11, color: 'rgba(252,255,242,0.42)' }}>
              {plant.variety}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <CalendarDays size={12} color={isUrgent ? 'var(--color-eden-lime)' : 'rgba(252,255,242,0.42)'} strokeWidth={1.5} />
            <span className="font-body" style={{ fontSize: 12, color: isUrgent ? 'var(--color-eden-lime)' : 'rgba(252,255,242,0.42)' }}>
              Récolte le {plant.harvestDate}
            </span>
          </div>
        </div>
        <div style={{
          background: isUrgent ? 'var(--color-eden-lime)' : 'rgba(252,255,242,0.08)',
          borderRadius: 12, padding: '8px 10px', textAlign: 'center', flexShrink: 0, minWidth: 48,
        }}>
          <div className="font-body" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, color: isUrgent ? 'var(--color-eden-ink)' : 'var(--color-eden-light)' }}>
            {plant.daysLeft}
          </div>
          <div className="font-body" style={{ fontSize: 10, lineHeight: 1.4, color: isUrgent ? 'rgba(29,38,27,0.65)' : 'rgba(252,255,242,0.42)' }}>
            jours
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="font-body" style={{ fontSize: 11, color: 'rgba(252,255,242,0.42)' }}>Progression</span>
          <span className="font-body" style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-eden-lime)' }}>{progressPct}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 9999, background: 'rgba(252,255,242,0.1)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--color-eden-lime)', borderRadius: 9999 }} />
        </div>
      </div>
      <StepsTimeline steps={plant.steps} />
    </div>
  )
}

/* ── Calendar grid view ────────────────────────────────────── */

function CalendarGridView({ allPlants }) {
  const [viewYear, setViewYear] = useState(TODAY.getFullYear())
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth())
  const [selectedKey, setSelectedKey] = useState(null)

  /* Build events map  { 'YYYY-MM-DD': [plant, …] } */
  const events = useMemo(() => {
    const map = {}
    allPlants.forEach(plant => {
      const key = dateKey(addDays(TODAY, plant.daysLeft))
      if (!map[key]) map[key] = []
      map[key].push(plant)
    })
    return map
  }, [allPlants])

  /* Grid cells — leading nulls + day numbers + trailing nulls */
  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const startDow = (first.getDay() + 6) % 7 // Mon = 0
    const arr = Array(startDow).fill(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(d)
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setSelectedKey(null)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setSelectedKey(null)
  }

  const selectedEvents = selectedKey ? (events[selectedKey] ?? []) : []

  /* Format selected day label */
  const selectedLabel = useMemo(() => {
    if (!selectedKey) return ''
    const [y, m, d] = selectedKey.split('-').map(Number)
    return `${d} ${MONTH_FR[m - 1]} ${y}`
  }, [selectedKey])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Month grid card */}
      <div style={{ background: 'var(--color-eden-elevated)', borderRadius: 24, padding: '18px 16px 16px' }}>

        {/* Month navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <button
            onClick={prevMonth}
            aria-label="Mois précédent"
            style={{ width: 32, height: 32, borderRadius: 9999, border: 'none', cursor: 'pointer', background: 'rgba(252,255,242,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={16} color="var(--color-eden-light)" strokeWidth={2} />
          </button>
          <p className="font-heading" style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-eden-light)', margin: 0 }}>
            {MONTH_FR[viewMonth]} {viewYear}
          </p>
          <button
            onClick={nextMonth}
            aria-label="Mois suivant"
            style={{ width: 32, height: 32, borderRadius: 9999, border: 'none', cursor: 'pointer', background: 'rgba(252,255,242,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronRight size={16} color="var(--color-eden-light)" strokeWidth={2} />
          </button>
        </div>

        {/* Day-of-week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
          {DOW_FR.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, fontFamily: 'var(--font-body)', color: 'rgba(252,255,242,0.32)', paddingBottom: 6 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />

            const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday    = key === TODAY_KEY
            const isSelected = key === selectedKey
            const hasEvents  = !!events[key]
            const isUrgent   = hasEvents && events[key].some(p => p.daysLeft <= 14)

            return (
              <button
                key={i}
                onClick={() => setSelectedKey(isSelected ? null : key)}
                aria-label={`${day} ${MONTH_FR[viewMonth]}${hasEvents ? ' — événement' : ''}`}
                aria-pressed={isSelected}
                style={{
                  height: 44,
                  borderRadius: 10,
                  border: isToday && !isSelected ? '1.5px solid var(--color-eden-lime)' : 'none',
                  cursor: 'pointer',
                  background: isSelected
                    ? 'var(--color-eden-lime)'
                    : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  padding: 0,
                }}
              >
                <span style={{
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  fontWeight: isToday || isSelected ? 700 : 400,
                  lineHeight: 1,
                  color: isSelected
                    ? 'var(--color-eden-ink)'
                    : isToday
                    ? 'var(--color-eden-lime)'
                    : 'var(--color-eden-light)',
                }}>
                  {day}
                </span>
                {hasEvents && (
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: isSelected
                      ? 'rgba(29,38,27,0.55)'
                      : isUrgent
                      ? 'var(--color-eden-orange)'
                      : 'var(--color-eden-lime)',
                  }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(252,255,242,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-eden-lime)' }} />
            <span className="font-body" style={{ fontSize: 11, color: 'rgba(252,255,242,0.45)' }}>Récolte</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-eden-orange)' }} />
            <span className="font-body" style={{ fontSize: 11, color: 'rgba(252,255,242,0.45)' }}>Urgent (≤ 14 j)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid var(--color-eden-lime)', background: 'transparent' }} />
            <span className="font-body" style={{ fontSize: 11, color: 'rgba(252,255,242,0.45)' }}>Aujourd&apos;hui</span>
          </div>
        </div>
      </div>

      {/* Selected-day events panel */}
      {selectedEvents.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3
            className="font-body"
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(252,255,242,0.45)', margin: 0 }}
          >
            {selectedLabel}
          </h3>
          {selectedEvents.map(plant => (
            <div
              key={plant.id}
              style={{ background: 'var(--color-eden-elevated)', borderRadius: 20, padding: '14px', display: 'flex', alignItems: 'center', gap: 14 }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 13, overflow: 'hidden', flexShrink: 0, background: 'rgba(32,59,50,0.7)' }}>
                <img src={plant.image} alt={plant.name} loading="lazy" decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <p className="font-heading" style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-eden-light)', margin: 0 }}>
                    {plant.name}
                  </p>
                  <span className="font-body" style={{ fontSize: 11, color: 'rgba(252,255,242,0.4)' }}>{plant.variety}</span>
                </div>
                <p className="font-body" style={{ fontSize: 11, color: 'rgba(252,255,242,0.4)', margin: '2px 0 0' }}>
                  {plant.slotName}
                </p>
              </div>
              <span
                className="font-body"
                style={{
                  fontSize: 11, fontWeight: 600,
                  padding: '5px 12px', borderRadius: 9999, flexShrink: 0,
                  background: plant.daysLeft <= 14 ? 'var(--color-eden-lime)' : 'rgba(219,255,89,0.14)',
                  color: plant.daysLeft <= 14 ? 'var(--color-eden-ink)' : 'var(--color-eden-lime)',
                }}
              >
                Récolte
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Empty month hint */}
      {selectedKey === null && !Object.keys(events).some(k => k.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`)) && (
        <p className="font-body" style={{ fontSize: 13, color: 'rgba(252,255,242,0.3)', textAlign: 'center', paddingTop: 8 }}>
          Aucun événement ce mois-ci
        </p>
      )}
    </div>
  )
}

/* ── List view ─────────────────────────────────────────────── */

function ListView({ upcomingHarvests }) {
  return (
    <>
      {/* Upcoming strip */}
      <div>
        <h2
          className="font-body"
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(252,255,242,0.45)', marginBottom: 12 }}
        >
          Prochaines récoltes
        </h2>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {upcomingHarvests.map(plant => {
            const urgent = plant.daysLeft <= 14
            return (
              <div
                key={plant.id}
                style={{ flexShrink: 0, width: 128, background: 'var(--color-eden-elevated)', borderRadius: 20, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', background: 'rgba(32,59,50,0.7)' }}>
                  <img src={plant.image} alt={plant.name} loading="lazy" decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }} />
                </div>
                <div>
                  <p className="font-heading" style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-eden-light)', margin: 0, lineHeight: 1.2 }}>
                    {plant.name}
                  </p>
                  <p className="font-body" style={{ fontSize: 10, color: 'rgba(252,255,242,0.38)', margin: '2px 0 0' }}>
                    {plant.slotName.split('—')[1]?.trim()}
                  </p>
                </div>
                <div style={{
                  background: urgent ? 'var(--color-eden-lime)' : 'rgba(252,255,242,0.08)',
                  borderRadius: 8, padding: '5px 9px', display: 'inline-flex', alignItems: 'baseline', gap: 3, width: 'fit-content',
                }}>
                  <span className="font-body" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1, color: urgent ? 'var(--color-eden-ink)' : 'var(--color-eden-light)' }}>{plant.daysLeft}</span>
                  <span className="font-body" style={{ fontSize: 10, color: urgent ? 'rgba(29,38,27,0.6)' : 'rgba(252,255,242,0.45)' }}>j</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-slot plant cards */}
      {MOCK_CALENDAR.map(slot => (
        <div key={slot.slotId}>
          <h2
            className="font-body"
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(252,255,242,0.45)', marginBottom: 12 }}
          >
            {slot.slotName}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {slot.plants.map(plant => <PlantCard key={plant.id} plant={plant} />)}
          </div>
        </div>
      ))}
    </>
  )
}

/* ── View toggle pill ──────────────────────────────────────── */

function ViewToggle({ value, onChange }) {
  return (
    <div
      className="flex items-center rounded-full relative"
      style={{ background: 'var(--color-eden-elevated)', padding: 4 }}
    >
      {/* Sliding lime pill */}
      <div
        style={{
          position: 'absolute',
          left: 4,
          width: 36, height: 36,
          borderRadius: 9999,
          background: 'var(--color-eden-lime)',
          transform: `translateX(${value === 'calendar' ? 36 : 0}px)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
        }}
      />
      {[
        { id: 'list',     Icon: List,        label: 'Vue liste' },
        { id: 'calendar', Icon: CalendarDays, label: 'Vue calendrier' },
      ].map(({ id, Icon, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          aria-label={label}
          aria-pressed={value === id}
          style={{
            width: 36, height: 36, flexShrink: 0,
            borderRadius: 9999, border: 'none', cursor: 'pointer',
            background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1,
          }}
        >
          <Icon
            size={18}
            strokeWidth={1.5}
            color={value === id ? 'var(--color-eden-ink)' : 'var(--color-eden-light)'}
          />
        </button>
      ))}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────── */

export function CalendarPage() {
  const pageRef = useRef(null)
  const [view, setView] = useState('list')

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

  const allPlants = useMemo(
    () => MOCK_CALENDAR.flatMap(slot => slot.plants.map(p => ({ ...p, slotName: slot.slotName }))),
    []
  )

  const upcomingHarvests = useMemo(
    () => [...allPlants].sort((a, b) => a.daysLeft - b.daysLeft),
    [allPlants]
  )

  return (
    <div ref={pageRef} className="min-h-screen" style={{ background: 'var(--color-eden-dark)' }}>
      <div className="mx-auto" style={{ maxWidth: 393 }}>

        {/* Header */}
        <header className="will-reveal flex items-center justify-between" style={{ padding: '16px 20px 8px' }}>
          <div style={{ width: 33, height: 42, display: 'flex', alignItems: 'center' }}>
            <img src={edenLogo} alt="Eden" className="block h-full w-full object-contain" style={{ objectPosition: 'left center' }} />
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <Avatar src={PROFILE_IMG} />
            <button
              aria-label="Notifications"
              className="flex items-center justify-center rounded-full"
              style={{ width: 42, height: 42, background: 'var(--color-eden-lime)', border: 'none', cursor: 'pointer' }}
            >
              <Bell size={20} color="#1D261B" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Title + view toggle */}
        <section className="will-reveal" style={{ padding: '24px 20px 8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h1 className="font-heading font-medium" style={{ fontSize: 48, lineHeight: 1.1, color: 'var(--color-eden-light)', margin: 0 }}>
            Calendrier
          </h1>
          <ViewToggle value={view} onChange={setView} />
        </section>

        <main className="flex flex-col will-reveal" style={{ padding: '16px 20px 136px', gap: 24 }}>
          {view === 'list'
            ? <ListView upcomingHarvests={upcomingHarvests} />
            : <CalendarGridView allPlants={allPlants} />
          }
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
