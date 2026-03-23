/**
 * Slot detail — sensor overview for a single plant box.
 * Figma: Dashboard/Detail-Slot (node 136:5001)
 * Route: /slot/:slotId/box/:boxNumber
 */
import { useRef, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Sun, Droplets, Gauge, Thermometer,
  BarChart3, CalendarDays, CircleHelp, ArrowLeft, FlaskConical,
  Bell, UserRound,
} from 'lucide-react'
import { gsap } from '@/lib/gsap'
import edenLNoBg from '@/assets/images/eden_l_no_bg.png'

/* ── Mock data — swap for real API ────────────────────────── */
/* Figma reference values match slot-1-4 (Tomate ronde) exactly. */
const TOMATO_IMG = 'https://www.figma.com/api/mcp/asset/9daaf590-c894-48ae-8427-a60bdd725839'
const LETTUCE_IMG = 'https://www.figma.com/api/mcp/asset/59497f31-17b5-4515-ae23-0fb8de3f701f'

const MOCK = {
  'slot-1': {
    1: { label: 'Bac 1', name: 'Laitue verte',   sunHours: 3, humidity: 72, ph: 7.2, temp: 18, minerals: 65, imageUrl: LETTUCE_IMG },
    2: { label: 'Bac 2', name: 'Laitue verte',   sunHours: 2, humidity: 65, ph: 7.4, temp: 20, minerals: 60, imageUrl: LETTUCE_IMG },
    3: { label: 'Bac 3', name: 'Basilic',          sunHours: 4, humidity: 80, ph: 6.8, temp: 21, minerals: 72, imageUrl: null },
    4: { label: 'Bac 4', name: 'Tomate ronde',   sunHours: 2, humidity: 64, ph: 7.6, temp: 15, minerals: 54, imageUrl: TOMATO_IMG },
    5: { label: 'Bac 5', name: 'Menthe fraîche', sunHours: 1, humidity: 90, ph: 7.0, temp: 16, minerals: 38, imageUrl: null },
    6: { label: 'Bac 6', name: 'Laitue verte',   sunHours: 3, humidity: 68, ph: 7.4, temp: 17, minerals: 50, imageUrl: LETTUCE_IMG },
  },
  'slot-2': {
    1: { label: 'Bac 1', name: 'Basilic',          sunHours: 3, humidity: 60, ph: 6.7, temp: 22, minerals: 55, imageUrl: null },
    2: { label: 'Bac 2', name: 'Menthe fraîche', sunHours: 1, humidity: 85, ph: 7.1, temp: 18, minerals: 40, imageUrl: null },
    3: { label: 'Bac 3', name: 'Tomates',          sunHours: 4, humidity: 50, ph: 6.5, temp: 24, minerals: 48, imageUrl: null },
    4: { label: 'Bac 4', name: 'Basilic',          sunHours: 2, humidity: 75, ph: 6.9, temp: 20, minerals: 62, imageUrl: null },
    5: { label: 'Bac 5', name: 'Laitue verte',   sunHours: 3, humidity: 88, ph: 7.3, temp: 17, minerals: 70, imageUrl: LETTUCE_IMG },
    6: { label: 'Bac 6', name: 'Tomates',          sunHours: 5, humidity: 62, ph: 6.6, temp: 25, minerals: 44, imageUrl: null },
  },
}

const MAX_SUN_HOURS = 8

/* ── SVG sunlight arc ─────────────────────────────────────── */

const ARC = {
  W:  353,
  H:  165,    // SVG viewBox height
  CX: 176.5,  // horizontal centre = card width / 2
  CY: 157,    // arc diameter sits at this y in the SVG
  R:  150,    // radius — arc spans CX±150 = 26.5…326.5 (6px side padding)
}

/**
 * Computes SVG path data for the sunlight arc track and progress fill.
 * The arc is a top semi-circle (counter-clockwise in screen coords).
 * θ=0 → left end (dawn), θ=π → right end (dusk).
 */
function arcPaths(hours, maxHours) {
  const { CX, CY, R } = ARC
  const sx = CX - R               // left end of diameter
  const ex = CX + R               // right end

  const p = Math.min(1, hours / maxHours)
  const theta = Math.PI * p
  const px = CX - R * Math.cos(theta)
  const py = CY - R * Math.sin(theta)
  const la = p > 0.5 ? 1 : 0     // large-arc-flag

  return {
    track:   `M ${sx},${CY} A ${R},${R} 0 0 0 ${ex},${CY}`,
    fill:    p > 0 ? `M ${sx},${CY} A ${R},${R} 0 ${la},0 ${px},${py}` : '',
    startX:  sx,           // sun icon anchor x (in SVG coords)
    startY:  CY,           // sun icon anchor y
    tipX:    px,           // progress tip x (for "2H" pill)
    tipY:    py,           // progress tip y
  }
}

/* ── Page sub-components ──────────────────────────────────── */

/**
 * Full-width hero card with a lime sunlight arc, plant image, and duration pill.
 */
function SunlightCard({ sunHours = 2, imageUrl }) {
  const { track, fill, startX, startY, tipX, tipY } = arcPaths(sunHours, MAX_SUN_HOURS)
  const SVG_TOP = 50   // distance from card top to SVG top
  const IMG_H   = 170
  const CARD_H  = 295

  /* Absolute card positions of key elements */
  const sunTop  = SVG_TOP + startY - 24        // sun icon centre
  const sunLeft = startX - 20
  const pillTop = SVG_TOP + tipY - 15
  const pillLeft = Math.min(ARC.W - 64, Math.max(4, tipX - 24))

  return (
    <div
      style={{
        position: 'relative',
        height: CARD_H,
        background: 'var(--color-eden-elevated)',
        borderRadius: 32,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* ── Arc SVG ── */}
      <svg
        width={ARC.W}
        height={ARC.H}
        style={{ position: 'absolute', top: SVG_TOP, left: 0 }}
      >
        <path d={track} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} strokeLinecap="round" />
        {fill && (
          <path d={fill} fill="none" stroke="var(--color-eden-lime)" strokeWidth={5} strokeLinecap="round" />
        )}
      </svg>

      {/* ── Sun icon at arc start ── */}
      <div
        style={{
          position: 'absolute',
          top: sunTop,
          left: sunLeft,
          zIndex: 3,
        }}
        aria-hidden="true"
      >
        <Sun size={42} color="var(--color-eden-lime)" strokeWidth={1.5} />
      </div>

      {/* ── Duration pill at arc tip ── */}
      <div
        style={{
          position: 'absolute',
          top: pillTop,
          left: pillLeft,
          zIndex: 4,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderRadius: 9999,
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          className="font-body"
          style={{ fontSize: 16, color: 'var(--color-eden-light)', lineHeight: 1 }}
        >
          {sunHours}H
        </span>
      </div>

      {/* ── Plant image (in front of arc) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: IMG_H,
          zIndex: 2,
        }}
      >
        <img
          src={imageUrl ?? edenLNoBg}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
          }}
        />
      </div>

      {/* ── Title + icon (topmost layer) ── */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          padding: '8px 8px 8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 5,
        }}
      >
        <p
          className="font-heading"
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--color-eden-light)',
            margin: 0,
          }}
        >
          Durée d'ensoleillement
        </p>
        <button
          aria-label="Paramètres"
          style={{
            width: 42, height: 42, flexShrink: 0,
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.1)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Sun size={20} color="var(--color-eden-light)" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

/**
 * Half-width sensor metric card with a vertical level bar.
 *
 * @param {number}  value     - numeric sensor reading
 * @param {number}  maxValue  - maximum value for the bar scale
 * @param {string}  display   - formatted string shown as the big value ("64%", "7,6", "15°")
 * @param {string}  label     - small label below the value ("Humidité", "pH", …)
 * @param {string}  barColor  - CSS colour for the filled bar
 * @param {object}  Icon      - Lucide icon component for the top-right button
 */
function SensorCard({ value, maxValue = 100, display, label, barColor, Icon }) {
  const BAR_H = 123                                     // height of the bar track
  const fillH = Math.round(Math.min(1, value / maxValue) * BAR_H)
  const fillTop = BAR_H - fillH                         // bar fills from bottom

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        height: 171,
        background: 'var(--color-eden-elevated)',
        borderRadius: 32,
        padding: '24px 16px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Icon button — absolute top-right */}
      <div
        style={{
          position: 'absolute',
          top: 8, right: 8,
          width: 42, height: 42,
          borderRadius: 9999,
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon size={20} color="var(--color-eden-light)" strokeWidth={1.5} />
      </div>

      {/* Level bar + value row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          height: BAR_H,
        }}
      >
        {/* Vertical bar track + fill */}
        <div
          style={{
            position: 'relative',
            width: 10,
            height: '100%',
            borderRadius: 8,
            background: 'rgba(252,255,242,0.15)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: fillTop,
              width: 10,
              height: fillH,
              borderRadius: 8,
              background: barColor,
            }}
          />
        </div>

        {/* Value + label */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p
            className="font-heading"
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: 'var(--color-eden-light)',
              lineHeight: 1.1,
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {display}
          </p>
          <span
            className="font-body"
            style={{ fontSize: 12, color: 'var(--color-eden-light)', lineHeight: 1.4 }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}

/** 4-button frosted pill nav bar specific to this page. */
function DetailNav() {
  const navigate = useNavigate()

  const buttons = [
    { Icon: ArrowLeft,   label: 'Retour',        onClick: () => navigate(-1) },
    { Icon: BarChart3,   label: 'Statistiques',  onClick: () => {} },
    { Icon: CalendarDays, label: 'Calendrier',   onClick: () => {} },
    { Icon: CircleHelp,  label: 'Aide',          onClick: () => {} },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-2">
      <nav
        className="flex items-center"
        style={{
          gap: 8,
          padding: 12,
          borderRadius: 101,
          background: 'rgba(28,28,28,0.20)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        aria-label="Navigation détail"
      >
        {buttons.map(({ Icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            aria-label={label}
            style={{
              width: 52, height: 52,
              borderRadius: 9999,
              background: 'rgba(252,255,242,0.10)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon size={22} color="var(--color-eden-light)" strokeWidth={1.5} />
          </button>
        ))}
      </nav>
      <div
        className="mt-2 rounded-full bg-white/40"
        style={{ width: 139, height: 5 }}
        aria-hidden="true"
      />
    </div>
  )
}

/* ── Page shared atoms ────────────────────────────────────── */

const PROFILE_IMG = 'https://www.figma.com/api/mcp/asset/fded8679-9a6b-46b9-afdf-d77a506d6dae'

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

/* ── Page ─────────────────────────────────────────────────── */

export function SlotDetailPage() {
  const { slotId, boxNumber } = useParams()
  const navigate = useNavigate()
  const pageRef  = useRef(null)

  const boxData = MOCK[slotId]?.[Number(boxNumber)] ?? MOCK['slot-1'][4]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.will-reveal',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.04 }
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
      <div className="mx-auto" style={{ maxWidth: 393 }}>

        {/* ── Header ─────────────────────────────────────── */}
        <header
          className="will-reveal flex items-center justify-between"
          style={{ padding: '16px 20px 8px' }}
        >
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
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

          {/* Action buttons */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <Avatar src={PROFILE_IMG} />
            <button
              aria-label="Notifications"
              className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
              style={{
                width: 42, height: 42,
                background: 'var(--color-eden-lime)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Bell size={20} color="#1D261B" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* ── Box title ──────────────────────────────────── */}
        <div
          className="will-reveal flex items-center"
          style={{ padding: '16px 20px 0', gap: 8 }}
        >
          <span
            className="font-body font-semibold whitespace-nowrap"
            style={{
              fontSize: 12,
              background: 'var(--color-eden-lime)',
              color: 'var(--color-eden-ink)',
              borderRadius: 9999,
              padding: '4px 8px',
            }}
          >
            {boxData.label}
          </span>
          <h1
            className="font-heading"
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--color-eden-light)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {boxData.name}
          </h1>
        </div>

        {/* ── Sensor cards ───────────────────────────────── */}
        <div
          style={{
            padding: '8px 20px 136px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {/* Sunlight hero card */}
          <div className="will-reveal">
            <SunlightCard sunHours={boxData.sunHours} imageUrl={boxData.imageUrl} />
          </div>

          {/* Row 1: Humidity + pH */}
          <div className="will-reveal flex" style={{ gap: 8 }}>
            <SensorCard
              value={boxData.humidity}
              maxValue={100}
              display={`${boxData.humidity}%`}
              label="Humidité"
              barColor="#FFDF0E"
              Icon={Droplets}
            />
            <SensorCard
              value={boxData.ph}
              maxValue={14}
              display={String(boxData.ph).replace('.', ',')}
              label="pH"
              barColor="var(--color-eden-lime)"
              Icon={Gauge}
            />
          </div>

          {/* Row 2: Temperature + Minerals */}
          <div className="will-reveal flex" style={{ gap: 8 }}>
            <SensorCard
              value={boxData.temp}
              maxValue={40}
              display={`${boxData.temp}°`}
              label="Celsius"
              barColor="var(--color-eden-lime)"
              Icon={Thermometer}
            />
            <SensorCard
              value={boxData.minerals}
              maxValue={100}
              display={`${boxData.minerals}%`}
              label="Niveau d'engrais"
              barColor="var(--color-eden-orange)"
              Icon={FlaskConical}
            />
          </div>
        </div>

      </div>

      <DetailNav />
    </div>
  )
}
