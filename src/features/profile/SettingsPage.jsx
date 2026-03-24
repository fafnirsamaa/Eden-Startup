import { useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  LogOut,
  Shield,
  UserRound,
} from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { BottomNav } from '@/components/layout/BottomNav'
import edenLogo from '@/assets/images/eden_logo.svg'

function Row({ icon, label, to, onClick, destructive }) {
  const RowIcon = icon
  const content = (
    <div
      className="pressable-card flex items-center justify-between card-dark"
      style={{ padding: 16, textDecoration: 'none', width: '100%', border: 'none', background: 'var(--color-eden-elevated)', cursor: onClick || to ? 'pointer' : 'default' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 40,
            height: 40,
            background: destructive ? 'rgba(255,102,14,0.15)' : 'rgba(219,255,89,0.15)',
          }}
        >
          <RowIcon
            size={20}
            color={destructive ? 'var(--color-eden-orange)' : 'var(--color-eden-lime)'}
            strokeWidth={1.5}
          />
        </div>
        <span
          className="font-body font-medium"
          style={{ color: destructive ? 'var(--color-eden-orange)' : 'var(--color-eden-light)' }}
        >
          {label}
        </span>
      </div>
      {!destructive && <ChevronRight size={20} color="rgba(252,255,242,0.35)" strokeWidth={1.5} />}
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block rounded-[var(--radius-lg)] overflow-hidden" style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded-[var(--radius-lg)] overflow-hidden" style={{ padding: 0, border: 'none', background: 'transparent' }}>
      {content}
    </button>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.will-reveal',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out', delay: 0.06 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen" style={{ background: 'var(--color-eden-dark)' }}>
      <div className="mx-auto" style={{ maxWidth: 393 }}>

        <header
          className="will-reveal flex items-center justify-between"
          style={{ padding: '16px 20px 8px' }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Retour"
            style={{
              width: 42,
              height: 42,
              flexShrink: 0,
              borderRadius: 9999,
              background: 'var(--color-eden-light)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={18} color="var(--color-eden-ink)" strokeWidth={2} />
          </button>
          <h1 className="font-heading font-semibold" style={{ fontSize: 20, color: 'var(--color-eden-light)', margin: 0 }}>
            Réglages
          </h1>
          <div style={{ width: 33, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={edenLogo} alt="" className="block h-full w-full object-contain" />
          </div>
        </header>

        <p
          className="will-reveal font-body"
          style={{ fontSize: 14, color: 'rgba(252,255,242,0.5)', padding: '8px 20px 16px', margin: 0 }}
        >
          Compte, alertes et préférences de l’application.
        </p>

        <div className="will-reveal flex flex-col" style={{ padding: '0 20px 24px', gap: 10 }}>
          <Row icon={UserRound} label="Mon profil" to="/profile" />
          <Row icon={Bell} label="Notifications" to="/notifications" />
          <Row icon={Globe} label="Langue — Français" onClick={() => {}} />
          <Row icon={Shield} label="Confidentialité et données" onClick={() => {}} />
          <Row icon={HelpCircle} label="Aide et contact" onClick={() => {}} />
          <Row icon={LogOut} label="Se déconnecter" destructive onClick={() => {}} />
        </div>

        <BottomNav />
      </div>
    </div>
  )
}
