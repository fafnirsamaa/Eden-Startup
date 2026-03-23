/**
 * Slot detail — sensor overview for a single plant box.
 * Figma: Dashboard/Detail-Slot (node 136:5001)
 * Route: /slot/:slotId/box/:boxNumber
 */
import { useRef, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Sun, Droplets, Gauge, Thermometer, ArrowLeft, FlaskConical,
  Bell, UserRound,
} from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { BottomNav } from '@/components/layout/BottomNav'
import edenLNoBg from '@/assets/images/eden_l_no_bg.webp'
import laitueImg from '@/assets/images/laitue.webp'
import tomatoImg from '@/assets/images/tomato.webp'

/* ── Mock data — swap for real API ────────────────────────── */
const TOMATO_IMG = tomatoImg
const LETTUCE_IMG = laitueImg

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

// Figma node 164:394 geometry:
// Arc group positioned at left=16.64, top=71 in card.
// Track (Subtract): 319.726×160px → semicircle from (16.64,231) to (336.37,231), top at (176.5,71)
// Arc centre: CX=176.5, CY=231, R=160
const ARC_CX = 176.5
const ARC_CY = 231
const ARC_R  = 160

function sunlightArc(hours, maxHours) {
  const progress = Math.max(0, Math.min(1, hours / maxHours))
  // θ=π at progress=0 (left), θ=0 at progress=1 (right)
  const theta = Math.PI * (1 - progress)
  const tipX  = ARC_CX + ARC_R * Math.cos(theta)
  const tipY  = ARC_CY - ARC_R * Math.sin(theta)
  return {
    track: `M ${ARC_CX - ARC_R},${ARC_CY} A ${ARC_R},${ARC_R} 0 0 0 ${ARC_CX + ARC_R},${ARC_CY}`,
    fill: progress > 0
      ? `M ${ARC_CX - ARC_R},${ARC_CY} A ${ARC_R},${ARC_R} 0 ${progress > 0.5 ? 1 : 0} 0 ${tipX},${tipY}`
      : '',
    tipX,
    tipY,
  }
}

/* ── Page sub-components ──────────────────────────────────── */

/**
 * Sunlight card — Figma 164:394.
 * Arc: semicircle CX=176.5 CY=231 R=160, top dome at y=71. Card h=295.
 * Plant in 146×146 frosted box at top=123, image 295×197 centred and overflowing.
 */
function SunlightCard({ sunHours = 2, imageUrl }) {
  const CARD_H = 295
  const CARD_W = 353
  const { track, fill, tipX, tipY } = sunlightArc(sunHours, MAX_SUN_HOURS)

  // Sun icon 52×52 centred on arc tip
  const sunL = tipX - 26
  const sunT = tipY - 26

  return (
    <div
      style={{
        position: 'relative',
        width: CARD_W,
        height: CARD_H,
        background: '#364F47',
        borderRadius: 32,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Arc SVG — track + progress fill */}
      <svg
        width={CARD_W}
        height={CARD_H}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <path
          d={track}
          fill="none"
          stroke="rgba(252,255,242,0.13)"
          strokeWidth={12}
          strokeLinecap="round"
        />
        {fill && (
          <path
            d={fill}
            fill="none"
            stroke="var(--color-eden-lime)"
            strokeWidth={12}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Sun icon at arc tip */}
      <div
        style={{ position: 'absolute', top: sunT, left: sunL, zIndex: 4 }}
        aria-hidden="true"
      >
        <Sun size={52} color="var(--color-eden-lime)" strokeWidth={1.5} />
      </div>

      {/* Frosted 146×146 box at top=123, image 295×197 overflowing centre */}
      <div
        style={{
          position: 'absolute',
          top: 123,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 146,
          height: 146,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.10)',
          overflow: 'visible',
          zIndex: 3,
        }}
      >
        <img
          src={imageUrl ?? edenLNoBg}
          alt=""
          loading="eager"
          decoding="sync"
          style={{
            position: 'absolute',
            width: 295,
            height: 197,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            objectPosition: 'center bottom',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Header row */}
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
          style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-eden-light)', margin: 0 }}
        >
          Durée d&apos;ensoleillement
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

      <BottomNav />
    </div>
  )
}
