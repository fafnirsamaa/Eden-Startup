/**
 * Dashboard page for a single garden unit.
 * Supports grid view (Figma: 136:3419) and list view (Figma: 160:723).
 * Accessible via /slot/:id
 */
import { useRef, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  UserRound, Droplets, Zap, LayoutGrid, List,
  ArrowLeft,
} from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { BottomNav } from '@/components/layout/BottomNav'
import laitueImg from '@/assets/images/laitue.webp'
import tomatoImg from '@/assets/images/tomato.webp'
import basilicImg from '@/assets/images/basilic.webp'

/* ── Mock data ────────────────────────────────────────────── */
const PROFILE_IMG = 'https://www.figma.com/api/mcp/asset/fded8679-9a6b-46b9-afdf-d77a506d6dae'

/* Local vegetable assets (optimized webp). */
const IMG_LAITUE  = laitueImg
const IMG_SPROUT = 'https://www.figma.com/api/mcp/asset/f22aeb74-d2dd-4ec1-b6d5-8a46340d41c4'
const IMG_BTN_ROUND = 'https://www.figma.com/api/mcp/asset/7d0af66f-1faa-405e-970a-82e87116c04a'

// Badge icons from the Figma component
const IMG_DROPLETS_2 = 'https://www.figma.com/api/mcp/asset/b606dbe6-9e49-4622-adfa-5c75a61a6b7e'
const IMG_THERMOMETER_FRAME = 'https://www.figma.com/api/mcp/asset/5d3ddbfc-5bff-4b53-81b2-05722e2fff6d'

const IMG_PLANT_FRAME_31 = laitueImg
const IMG_PLANT_FRAME_32 = tomatoImg
const IMG_PLANT_FRAME_33 = basilicImg

const MOCK_SLOTS = {
  'slot-1': {
    name: 'Eden L',
    status: 'En ligne',
    reservoir: { current: 20, total: 60 },
    plants: [
      { number: 1, name: 'Laitue verte',  water: 72, temp: 22, imageUrl: IMG_LAITUE },
      { number: 2, name: 'Laitue verte',  water: 65, temp: 24, imageUrl: IMG_LAITUE },
      { number: 3, name: 'Basilic',        water: 80, temp: 21, imageUrl: null },
      { number: 4, name: 'Tomates',        water: 55, temp: 26, imageUrl: null },
      { number: 5, name: 'Menthe fraîche', water: 90, temp: 20, imageUrl: null },
      { number: 6, name: 'Laitue verte',  water: 68, temp: 23, imageUrl: IMG_LAITUE },
    ],
  },
  'slot-2': {
    name: 'Eden L',
    status: 'En ligne',
    reservoir: { current: 35, total: 60 },
    plants: [
      { number: 1, name: 'Basilic',        water: 60, temp: 24, imageUrl: null },
      { number: 2, name: 'Menthe fraîche', water: 85, temp: 21, imageUrl: null },
      { number: 3, name: 'Tomates',        water: 50, temp: 27, imageUrl: null },
      { number: 4, name: 'Basilic',        water: 75, temp: 23, imageUrl: null },
      { number: 5, name: 'Laitue verte',  water: 88, temp: 20, imageUrl: IMG_LAITUE },
      { number: 6, name: 'Tomates',        water: 62, temp: 25, imageUrl: null },
    ],
  },
}

/** Maps a temperature (°C) to a 0-100 percentage for the ring. 15°C → 0%, 40°C → 100% */
const tempToPct = (t) => Math.min(100, Math.max(0, Math.round(((t - 15) / 25) * 100)))

/* ── Shared atoms ─────────────────────────────────────────── */

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

/** Orange circle with a small droplet icon — signals a water alert */
function AlertBadge() {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: 20, height: 20, background: 'var(--color-eden-orange)' }}
    >
      <Droplets size={10} color="white" strokeWidth={2} />
    </div>
  )
}

/** Lime circle with a notification count */
function CountBadge({ count = 99 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: 20, height: 20, background: 'var(--color-eden-lime)' }}
    >
      <span
        className="font-body font-semibold"
        style={{ fontSize: 10, color: 'var(--color-eden-ink)', lineHeight: 1 }}
      >
        {count}
      </span>
    </div>
  )
}

/* ── Grid view — box variants ─────────────────────────────── */

function PlantBox({ number, name, style: extraStyle, onClick }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg cursor-pointer flex flex-col items-center justify-center"
      style={{ background: 'var(--color-eden-elevated)', padding: 8, ...extraStyle }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <p
        className="font-heading absolute pointer-events-none select-none"
        style={{
          fontSize: 171, fontWeight: 600,
          color: 'var(--color-eden-light)', opacity: 0.2,
          top: -32, left: 0, lineHeight: 1, margin: 0, whiteSpace: 'nowrap',
        }}
        aria-hidden="true"
      >
        {number}
      </p>

      <p
        className="font-heading relative z-10"
        style={{
          fontSize: 18, fontWeight: 600,
          color: 'var(--color-eden-light)', textAlign: 'center',
          lineHeight: 1.2, margin: 0,
        }}
      >
        {name}
      </p>

      <div className="absolute flex items-center z-10" style={{ top: 8, right: 8, gap: 4 }}>
        <AlertBadge />
        <CountBadge />
      </div>
    </div>
  )
}

function SolarBox({ style: extraStyle }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-eden-elevated)', ...extraStyle }}
    >
      {/* Pulsing dot grid — signals active energy harvest */}
      <div
        className="solar-dots absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(219,255,89,0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="flex flex-col items-center relative z-10" style={{ gap: 6 }}>
        <Zap size={24} color="var(--color-eden-lime)" strokeWidth={1.5} />
        <p
          className="font-heading text-center"
          style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-eden-light)', lineHeight: 1.2, margin: 0 }}
        >
          Panneau<br />solaire
        </p>
      </div>
    </div>
  )
}

function ReservoirBox({ current = 20, total = 60, style: extraStyle }) {
  const fillPct = Math.min(Math.round((current / total) * 100), 100)
  return (
    <div
      className="relative overflow-hidden rounded-lg flex flex-col items-center justify-between"
      style={{ background: 'var(--color-eden-elevated)', padding: 8, ...extraStyle }}
    >
      <div className="flex flex-col items-center justify-center flex-1" style={{ gap: 4 }}>
        <Droplets size={24} color="var(--color-eden-lime)" strokeWidth={1.5} />
        <p
          className="font-heading"
          style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-eden-light)', whiteSpace: 'nowrap', margin: 0 }}
        >
          {current}/{total}L
        </p>
      </div>
      <div className="relative" style={{ width: 85 }}>
        <div className="rounded-full" style={{ height: 2, background: 'rgba(255,255,255,0.1)' }} />
        <div
          className="absolute rounded-full"
          style={{ height: 2, background: 'var(--color-eden-lime)', top: 0, left: 0, width: `${fillPct}%` }}
        />
      </div>
    </div>
  )
}

function GridBox({ box, style, onClick }) {
  if (box.type === 'plant')     return <PlantBox number={box.number} name={box.name} style={style} onClick={onClick} />
  if (box.type === 'solar')     return <SolarBox style={style} />
  if (box.type === 'reservoir') return <ReservoirBox current={box.current} total={box.total} style={style} />
  return null
}

/* ── List view — card ─────────────────────────────────────── */

/**
 * Circular frosted-glass sensor badge with an SVG progress ring.
 * Used in the list view card for water level and temperature.
 */
function SensorBadge({ progress = 75, color = '#DBFF59', children }) {
  const SIZE = 68
  const SW = 3
  const r = (SIZE - SW * 2) / 2
  const circ = 2 * Math.PI * r
  const dash = Math.max(0, (progress / 100) * circ)

  return (
    <div
      style={{
        position: 'relative',
        width: SIZE,
        height: SIZE,
        borderRadius: 9999,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(7.6px)',
        WebkitBackdropFilter: 'blur(7.6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={SW}
        />
        {/* Progress arc */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={r}
          fill="none" stroke={color} strokeWidth={SW}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

/**
 * Full-width list card for a plant slot.
 * Matches the Figma "Card list" component (node 160:676).
 */
function CardList({ plant, onNavigate }) {
  const { name, water = 72, temp = 22 } = plant

  const plantSrc =
    name === 'Tomates' ? IMG_PLANT_FRAME_32 :
    name === 'Basilic' ? IMG_PLANT_FRAME_33 :
    IMG_PLANT_FRAME_31

  const plantImgStyle =
    name === 'Tomates'
      ? { height: '69.21%', left: '0.56%', top: '15.4%', width: '98.89%' }
      : name === 'Basilic'
        ? { height: '122.68%', left: '-22.88%', top: '-48.85%', width: '213.1%' }
        : { height: '100%', left: '-13.51%', top: '-2.99%', width: '127.02%' }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'center',
        background: 'var(--color-eden-elevated)',
        borderRadius: 32,
        height: 'fit-content',
        overflow: 'hidden',
        flexShrink: 0,
        width: '100%',
        marginTop: 0,
        marginBottom: -56,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 8,
        paddingBottom: 46,
        paddingLeft: 8,
        paddingRight: 8,
      }}
    >
      {/* ── Header row ──── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: '0 0 auto' }}>
          <div
            style={{
              width: 42,
              height: 42,
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 9999,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img src={IMG_SPROUT} alt="" style={{ width: 20, height: 20, display: 'block' }} />
          </div>
          <p
            className="font-heading"
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--color-eden-light)',
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </p>
        </div>

        <button
          aria-label={`Voir ${name}`}
          onClick={onNavigate}
          style={{
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: 9999,
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <img src={IMG_BTN_ROUND} alt="" style={{ width: 42, height: 42, display: 'block' }} />
        </button>
      </div>

      {/* ── Body (image + overlapping badges) ──── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: 0,
          justifyContent: 'flex-start',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Image box */}
        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            width: 146,
            borderRadius: 20,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
            marginBottom: -35,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              width: 212.341,
              height: 174,
              position: 'relative',
              borderRadius: 30.155,
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 30.155, pointerEvents: 'none' }}>
              <img
                src={plantSrc}
                alt={name}
                loading="lazy"
                decoding="async"
                style={{
                  position: 'absolute',
                  maxWidth: 'none',
                  ...plantImgStyle,
                  objectFit: 'cover',
                  borderRadius: 30.155,
                }}
              />
            </div>
          </div>
        </div>

        {/* Badges row (overlaps image box bottom) */}
        <div
          style={{
            display: 'flex',
            gap: 10.163,
            alignItems: 'center',
            marginBottom: -35,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <SensorBadge progress={water} color="var(--color-eden-lime)">
            <img src={IMG_DROPLETS_2} alt="" style={{ width: 22, height: 22, display: 'block' }} />
          </SensorBadge>
          <SensorBadge progress={tempToPct(temp)} color="var(--color-eden-orange)">
            <img src={IMG_THERMOMETER_FRAME} alt="" style={{ width: 22, height: 22, display: 'block' }} />
          </SensorBadge>
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────── */

export function DashboardGridPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pageRef   = useRef(null)
  const contentRef = useRef(null)
  const [viewMode, setViewMode] = useState('grid')

  const slot = MOCK_SLOTS[id] ?? MOCK_SLOTS['slot-1']

  /* Derive grid columns from unified plants array */
  const leftColumn = [
    { type: 'plant', ...slot.plants[0] },
    { type: 'solar' },
    { type: 'reservoir', ...slot.reservoir },
  ]
  const rightColumn = slot.plants.slice(1).map((p) => ({ type: 'plant', ...p }))

  /* Initial page-enter reveal — runs once on mount only */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.will-reveal',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: 'power3.out', delay: 0.06 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* Fade content out → swap view → fade back in */
  const switchView = (mode) => {
    if (mode === viewMode || !contentRef.current) return
    gsap.to(contentRef.current, {
      opacity: 0, y: 10, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setViewMode(mode)
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
        )
      },
    })
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ background: 'var(--color-eden-dark)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 393 }}>

        {/* ── Slot title + layout switcher ────────────────── */}
        <div
          className="will-reveal flex items-center justify-between"
          style={{ padding: '16px 20px 0' }}
        >
          {/* Back button + title column */}
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              onClick={() => navigate('/')}
              aria-label="Retour"
              style={{
                width: 42, height: 42, flexShrink: 0,
                borderRadius: 9999,
                background: 'var(--color-eden-light)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ArrowLeft size={18} color="var(--color-eden-ink)" strokeWidth={2} />
            </button>

            <div className="flex flex-col items-start justify-start" style={{ gap: 8 }}>
              <h1
                className="font-heading"
                style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-eden-light)', margin: 0, lineHeight: 1.2 }}
              >
                {slot.name}
              </h1>
            </div>
          </div>

          {/* List / Grid toggle — sliding lime pill */}
          <div
            className="flex items-center rounded-full relative"
            style={{ background: 'var(--color-eden-elevated)', padding: 4 }}
          >
            {/* Animated lime pill */}
            <div
              style={{
                position: 'absolute',
                left: 4,
                width: 36, height: 36,
                borderRadius: 9999,
                background: 'var(--color-eden-lime)',
                // The toggle buttons are 36px wide with no extra gap, so the pill must shift by 36px.
                transform: `translateX(${viewMode === 'grid' ? 36 : 0}px)`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none',
              }}
            />
            <button
              aria-label="Vue liste"
              onClick={() => switchView('list')}
              style={{
                width: 36, height: 36, flexShrink: 0,
                borderRadius: 9999, border: 'none', cursor: 'pointer',
                background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 1,
                transition: 'color 0.3s',
              }}
            >
              <List
                size={18}
                color={viewMode === 'list' ? 'var(--color-eden-ink)' : 'var(--color-eden-light)'}
                strokeWidth={1.5}
              />
            </button>
            <button
              aria-label="Vue grille"
              onClick={() => switchView('grid')}
              style={{
                width: 36, height: 36, flexShrink: 0,
                borderRadius: 9999, border: 'none', cursor: 'pointer',
                background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 1,
                transition: 'color 0.3s',
              }}
            >
              <LayoutGrid
                size={18}
                color={viewMode === 'grid' ? 'var(--color-eden-ink)' : 'var(--color-eden-light)'}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────── */}
        {viewMode === 'grid' ? (

          /* Grid view */
          <div
            ref={contentRef}
            className="will-reveal flex"
            style={{ padding: '16px 20px 136px', gap: 8 }}
          >
            {/* Left column: plant | solar | reservoir */}
            <div className="flex flex-col" style={{ flex: 1, gap: 8, height: 589 }}>
              {leftColumn.map((box, i) => {
                const isEdge = i === 0 || i === leftColumn.length - 1
                return (
                  <GridBox
                    key={`left-${i}`}
                    box={box}
                    style={isEdge ? { height: 108, flexShrink: 0 } : { flex: 1 }}
                    onClick={box.type === 'plant' ? () => navigate(`/slot/${id}/box/${box.number}`) : undefined}
                  />
                )
              })}
            </div>

            {/* Right column: 5 × plant */}
            <div className="flex flex-col" style={{ flex: 1, gap: 8, height: 589 }}>
              {rightColumn.map((box, i) => (
                <GridBox
                  key={`right-${i}`}
                  box={box}
                  style={{ flex: 1 }}
                  onClick={box.type === 'plant' ? () => navigate(`/slot/${id}/box/${box.number}`) : undefined}
                />
              ))}
            </div>
          </div>

        ) : (

          /* List view */
          <div
            ref={contentRef}
            className="will-reveal flex flex-col"
          style={{ padding: '16px 20px 136px', gap: 79 }}
          >
            {slot.plants.map((plant) => (
              <CardList
                key={plant.number}
                plant={plant}
                onNavigate={() => navigate(`/slot/${id}/box/${plant.number}`)}
              />
            ))}
          </div>

        )}

      </div>

      <BottomNav />
    </div>
  )
}
