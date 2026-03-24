/**
 * Slot detail — sensor overview for a single plant box.
 * Figma: Dashboard/Detail-Slot (node 136:5001)
 * Route: /slot/:slotId/box/:boxNumber
 */
import { useRef, useEffect, useState, useCallback } from 'react'
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

/* ── Canvas sunlight arc ──────────────────────────────────── */

// Figma node 164:394 geometry:
// Arc group at left=16.64, top=71; track width=319.726, height=160.
// Semicircle: CX=176.5, CY=231, R=160 — dome top at y=71.
const ARC_CX = 176.5
const ARC_CY = 231
const ARC_R  = 160

// Canvas arc direction note:
//   Canvas angles: 0=right, π/2=down, π=left, 3π/2=up (y-axis is flipped vs. math).
//   Clockwise (anticlockwise=false) from π → 3π/2 → 2π draws the top dome ✓.
//   Progress end angle = π + π*pct (clockwise sweep from the left end).
//
// Tip position uses the same trig identity as the old SVG helper:
//   tipX = CX + R·cos(π·(1+pct))   ≡  CX + R·cos(π·(1−pct))
//   tipY = CY + R·sin(π·(1+pct))   ≡  CY − R·sin(π·(1−pct))

function arcTip(pct) {
  const angle = Math.PI * (1 + pct)         // canvas clockwise angle at progress tip
  return {
    tipX: ARC_CX + ARC_R * Math.cos(angle),
    tipY: ARC_CY + ARC_R * Math.sin(angle),
  }
}

const FROSTED_SIZE = 146
/** Lettuce visual ~20% larger than frosted plate (Figma). */
const LETTUCE_PLATE_SCALE = 1.2
const LETTUCE_WRAPPER = Math.round(FROSTED_SIZE * LETTUCE_PLATE_SCALE)

function setupCanvas2d(canvas, cardW, cardH) {
  if (!canvas) return null
  const dpr = window.devicePixelRatio || 1
  canvas.width        = cardW * dpr
  canvas.height       = cardH * dpr
  canvas.style.width  = `${cardW}px`
  canvas.style.height = `${cardH}px`
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.scale(dpr, dpr)
  return ctx
}

/** Track + progress on separate layers so stacking matches Figma: track → frost → progress → plant. */
function useSunlightArcLayers(trackRef, progressRef, sunHours, cardW, cardH) {
  const draw = useCallback(() => {
    const pct = Math.max(0, Math.min(1, sunHours / MAX_SUN_HOURS))

    const tctx = setupCanvas2d(trackRef.current, cardW, cardH)
    if (tctx) {
      tctx.beginPath()
      tctx.arc(ARC_CX, ARC_CY, ARC_R, Math.PI, Math.PI * 2, false)
      tctx.strokeStyle = 'rgba(252,255,242,0.14)'
      tctx.lineWidth   = 12
      tctx.lineCap     = 'round'
      tctx.stroke()
      tctx.restore()
    }

    const pctx = setupCanvas2d(progressRef.current, cardW, cardH)
    if (pctx) {
      if (pct > 0.005) {
        pctx.beginPath()
        pctx.arc(ARC_CX, ARC_CY, ARC_R, Math.PI, Math.PI * (1 + pct), false)
        pctx.strokeStyle = '#DBFF59'
        pctx.lineWidth   = 12
        pctx.lineCap     = 'round'
        pctx.stroke()
      }
      pctx.restore()
    }
  }, [trackRef, progressRef, sunHours, cardW, cardH])

  useEffect(() => { draw() }, [draw])
}

/* ── Page sub-components ──────────────────────────────────── */

/**
 * Sunlight card — Figma 164:394.
 * Z-order: grey track → frosted plate (empty) → lime progress → sun marker → plant (on top of arc).
 * Two canvases so the plant can sit above the progress stroke while the frost sits below it.
 */
function SunlightCard({ sunHours = 2, imageUrl }) {
  const CARD_H = 295
  const CARD_W = 353
  const trackCanvasRef = useRef(null)
  const progressCanvasRef = useRef(null)

  useSunlightArcLayers(trackCanvasRef, progressCanvasRef, sunHours, CARD_W, CARD_H)

  const pct  = Math.max(0, Math.min(1, sunHours / MAX_SUN_HOURS))
  const { tipX, tipY } = arcTip(pct)
  const currentImage = imageUrl ?? edenLNoBg
  const isLettuceImage = currentImage === laitueImg || currentImage === LETTUCE_IMG

  const frostedTop = 123
  const lettuceTop = frostedTop + (FROSTED_SIZE - LETTUCE_WRAPPER) / 2

  // Sun icon 52×52 centred on arc tip — same layer as progress, under the plant
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
      {/* 1 — Track only */}
      <canvas
        ref={trackCanvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, display: 'block', zIndex: 1, pointerEvents: 'none' }}
      />

      {/* 2 — Frosted plate (no image: avoids clipping; plant is layered above progress) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: frostedTop,
          left: '50%',
          transform: 'translateX(-50%)',
          width: FROSTED_SIZE,
          height: FROSTED_SIZE,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.10)',
          zIndex: 2,
        }}
      />

      {/* 3 — Progress arc only */}
      <canvas
        ref={progressCanvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, display: 'block', zIndex: 3, pointerEvents: 'none' }}
      />

      {/* 3 — Sun at arc tip (above progress stroke, below plant) */}
      <div
        style={{ position: 'absolute', top: sunT, left: sunL, zIndex: 3 }}
        aria-hidden="true"
      >
        <Sun size={52} color="var(--color-eden-lime)" strokeWidth={1.75} />
      </div>

      {/* 4 — Plant: ~20% larger footprint than frost; not clipped by frost */}
      <div
        style={{
          position: 'absolute',
          top: lettuceTop,
          left: '50%',
          transform: 'translateX(-50%)',
          width: isLettuceImage ? LETTUCE_WRAPPER : FROSTED_SIZE,
          height: isLettuceImage ? LETTUCE_WRAPPER : FROSTED_SIZE,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        <img
          src={currentImage}
          alt=""
          loading="eager"
          decoding="sync"
          style={{
            width: '100%',
            height: '100%',
            objectFit: isLettuceImage ? 'contain' : 'cover',
            objectPosition: 'center bottom',
            display: 'block',
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
          style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-eden-light)', margin: 0 }}
        >
          Durée d&apos;ensoleillement
        </p>
        <button
          aria-label="Paramètres"
          style={{
            width: 42, height: 42, flexShrink: 0,
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.12)',
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
