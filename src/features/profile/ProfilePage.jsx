import { useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Flame,
  Leaf,
  MapPin,
  Pencil,
  Shield,
  Sprout,
} from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { BottomNav } from '@/components/layout/BottomNav'
import { Avatar } from '@/components/Avatar'
import { MOCK_USER, PROFILE_IMG } from './profileConstants'
import edenLogo from '@/assets/images/eden_logo.svg'

function StatCard({ label, value, icon }) {
  const StatIcon = icon
  return (
    <div
      className="flex flex-col items-center justify-center flex-1"
      style={{
        background: 'var(--color-eden-elevated)',
        borderRadius: 20,
        padding: '16px 12px',
        border: '1px solid rgba(255,255,255,0.08)',
        minWidth: 0,
      }}
    >
      <StatIcon size={22} color="var(--color-eden-lime)" strokeWidth={1.5} />
      <p
        className="font-heading font-semibold"
        style={{ fontSize: 22, color: 'var(--color-eden-light)', margin: '8px 0 0', lineHeight: 1 }}
      >
        {value}
      </p>
      <span className="font-body text-center" style={{ fontSize: 11, color: 'rgba(252,255,242,0.55)', marginTop: 4 }}>
        {label}
      </span>
    </div>
  )
}

export function ProfilePage() {
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
          <div style={{ width: 33, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={edenLogo} alt="" className="block h-full w-full object-contain" />
          </div>
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
        </header>

        <section className="will-reveal flex flex-col items-center" style={{ padding: '8px 20px 24px' }}>
          <Avatar src={PROFILE_IMG} size={96} />
          <h1
            className="font-heading font-semibold"
            style={{ fontSize: 28, color: 'var(--color-eden-light)', margin: '16px 0 4px', textAlign: 'center' }}
          >
            {MOCK_USER.displayName}
          </h1>
          <p className="font-body" style={{ fontSize: 14, color: 'rgba(252,255,242,0.55)', margin: 0 }}>
            {MOCK_USER.email}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <MapPin size={14} color="var(--color-eden-lime)" strokeWidth={1.5} />
            <span className="font-body" style={{ fontSize: 13, color: 'rgba(252,255,242,0.7)' }}>
              {MOCK_USER.city} · Membre depuis {MOCK_USER.memberSince}
            </span>
          </div>
          <button type="button" className="btn-accent mt-5 pressable-card">
            <Pencil size={16} strokeWidth={1.75} />
            Modifier le profil
          </button>
        </section>

        <div className="will-reveal flex gap-3" style={{ padding: '0 20px 20px' }}>
          <StatCard label="Appareils Eden" value={MOCK_USER.edenDevices} icon={Sprout} />
          <StatCard label="Plantes actives" value={MOCK_USER.activePlants} icon={Leaf} />
          <StatCard label="Jours de série" value={MOCK_USER.harvestStreakDays} icon={Flame} />
        </div>

        <section className="will-reveal card-dark mx-5" style={{ marginBottom: 16 }}>
          <p className="font-body font-semibold" style={{ fontSize: 12, color: 'rgba(252,255,242,0.45)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            À propos
          </p>
          <p className="font-body" style={{ fontSize: 15, color: 'var(--color-eden-light)', margin: 0, lineHeight: 1.5 }}>
            {MOCK_USER.bio}
          </p>
        </section>

        <nav className="will-reveal flex flex-col" style={{ padding: '0 20px 24px', gap: 10 }} aria-label="Compte">
          <Link
            to="/notifications"
            className="pressable-card flex items-center justify-between card-dark"
            style={{ padding: 16, textDecoration: 'none' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 40, height: 40, background: 'rgba(219,255,89,0.15)' }}
              >
                <Bell size={20} color="var(--color-eden-lime)" strokeWidth={1.5} />
              </div>
              <span className="font-body font-medium" style={{ color: 'var(--color-eden-light)' }}>
                Notifications
              </span>
            </div>
            <ChevronRight size={20} color="rgba(252,255,242,0.35)" strokeWidth={1.5} />
          </Link>

          <Link
            to="/settings"
            className="pressable-card flex items-center justify-between card-dark"
            style={{ padding: 16, textDecoration: 'none' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 40, height: 40, background: 'rgba(219,255,89,0.15)' }}
              >
                <Shield size={20} color="var(--color-eden-lime)" strokeWidth={1.5} />
              </div>
              <span className="font-body font-medium" style={{ color: 'var(--color-eden-light)' }}>
                Sécurité et confidentialité
              </span>
            </div>
            <ChevronRight size={20} color="rgba(252,255,242,0.35)" strokeWidth={1.5} />
          </Link>
        </nav>

        <footer className="will-reveal px-5 pb-36">
          <p className="font-body text-center" style={{ fontSize: 12, color: 'rgba(252,255,242,0.35)', margin: 0 }}>
            Eden · Compte personnel
          </p>
        </footer>

        <BottomNav />
      </div>
    </div>
  )
}
