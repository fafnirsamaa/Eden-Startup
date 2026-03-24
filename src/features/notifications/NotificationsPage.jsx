import { useRef, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Droplets,
  Info,
  Leaf,
  Lightbulb,
  ShoppingBasket,
  CheckCheck,
} from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { BottomNav } from '@/components/layout/BottomNav'
import { MOCK_NOTIFICATIONS } from '@/features/profile/profileConstants'
import edenLogo from '@/assets/images/eden_logo.svg'

const TYPE_ICON = {
  water: Droplets,
  harvest: Leaf,
  tip: Lightbulb,
  promo: ShoppingBasket,
  system: Info,
}

const SECTION_LABEL = {
  today: "Aujourd'hui",
  week: 'Cette semaine',
  earlier: 'Plus tôt',
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const [items, setItems] = useState(() => MOCK_NOTIFICATIONS.map((n) => ({ ...n })))

  const grouped = useMemo(() => {
    const g = { today: [], week: [], earlier: [] }
    for (const n of items) {
      g[n.section].push(n)
    }
    return g
  }, [items])

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.will-reveal',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out', delay: 0.05 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleRead = (id) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

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
            Notifications
          </h1>
          <div style={{ width: 33, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={edenLogo} alt="" className="block h-full w-full object-contain" />
          </div>
        </header>

        <div
          className="will-reveal flex items-center justify-between"
          style={{ padding: '8px 20px 16px' }}
        >
          <p className="font-body" style={{ fontSize: 13, color: 'rgba(252,255,242,0.45)', margin: 0 }}>
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
          </p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="font-body font-semibold flex items-center gap-1 transition-opacity hover:opacity-85"
              style={{
                fontSize: 13,
                color: 'var(--color-eden-lime)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <CheckCheck size={16} strokeWidth={2} />
              Tout marquer comme lu
            </button>
          )}
        </div>

        <main style={{ padding: '0 20px 136px' }}>
          {(['today', 'week', 'earlier']).map((key) => {
            const list = grouped[key]
            if (!list.length) return null
            return (
              <section key={key} className="will-reveal mb-6" aria-label={SECTION_LABEL[key]}>
                <h2
                  className="font-body font-semibold"
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'rgba(252,255,242,0.38)',
                    margin: '0 0 10px',
                  }}
                >
                  {SECTION_LABEL[key]}
                </h2>
                <ul className="flex flex-col gap-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {list.map((n) => {
                    const Icon = TYPE_ICON[n.type] ?? Info
                    return (
                      <li key={n.id}>
                        <button
                          type="button"
                          onClick={() => toggleRead(n.id)}
                          className="pressable-card w-full text-left card-dark flex gap-3"
                          style={{
                            padding: 14,
                            border: '1px solid rgba(255,255,255,0.06)',
                            background: n.read ? 'var(--color-eden-elevated)' : 'rgba(54,79,71,0.95)',
                          }}
                        >
                          <div
                            className="flex items-center justify-center rounded-xl shrink-0"
                            style={{
                              width: 44,
                              height: 44,
                              background: 'rgba(219,255,89,0.12)',
                            }}
                          >
                            <Icon size={22} color="var(--color-eden-lime)" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className="font-body font-semibold"
                                style={{
                                  fontSize: 15,
                                  color: 'var(--color-eden-light)',
                                  margin: 0,
                                  lineHeight: 1.3,
                                }}
                              >
                                {n.title}
                              </p>
                              {!n.read && (
                                <span
                                  className="shrink-0 rounded-full"
                                  style={{
                                    width: 8,
                                    height: 8,
                                    marginTop: 6,
                                    background: 'var(--color-eden-lime)',
                                  }}
                                  aria-hidden
                                />
                              )}
                            </div>
                            <p
                              className="font-body"
                              style={{
                                fontSize: 13,
                                color: 'rgba(252,255,242,0.55)',
                                margin: '6px 0 0',
                                lineHeight: 1.45,
                              }}
                            >
                              {n.body}
                            </p>
                            <p
                              className="font-body"
                              style={{ fontSize: 11, color: 'rgba(252,255,242,0.35)', margin: '8px 0 0' }}
                            >
                              {n.time}
                            </p>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}

          <p className="will-reveal font-body text-center" style={{ fontSize: 12, color: 'rgba(252,255,242,0.3)', margin: '24px 0 0' }}>
            Les alertes capteurs et rappels de récolte apparaissent ici.
          </p>
          <div className="will-reveal text-center mt-4">
            <Link
              to="/profile"
              className="font-body font-semibold"
              style={{ fontSize: 14, color: 'var(--color-eden-lime)', textDecoration: 'none' }}
            >
              Préférences de notification
            </Link>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
