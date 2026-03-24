import { useMemo } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  ShoppingBasket,
  Calendar,
  BookOpen,
  Settings,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CircleHelp,
} from 'lucide-react'

const TABS = [
  { to: '/',            icon: Home,           label: 'Accueil' },
  { to: '/marketplace', icon: ShoppingBasket, label: 'Boutique' },
  { to: '/calendar',    icon: CalendarDays,   label: 'Calendrier' },
  { to: '/learn',       icon: BookOpen,       label: 'Apprendre' },
  { to: '/settings',    icon: Settings,       label: 'Réglages' },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isDetailRoute = /^\/slot\/[^/]+(?:\/box\/[^/]+)?$/.test(pathname)
  const boxRouteMatch = pathname.match(/^\/slot\/([^/]+)\/box\/[^/]+$/)
  const navShellStyle = useMemo(
    () => ({
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 101,
      background: 'rgba(28, 28, 28, 0.20)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      transition: 'opacity 260ms ease, transform 260ms ease',
    }),
    []
  )

  const detailButtons = [
    { Icon: ArrowLeft, label: 'Retour', onClick: () => navigate(-1) },
    {
      Icon: BarChart3,
      label: 'Synthèse',
      onClick: () => {
        if (boxRouteMatch) navigate(`/slot/${boxRouteMatch[1]}`)
      },
    },
    { Icon: CalendarDays, label: 'Calendrier', onClick: () => navigate('/calendar') },
    { Icon: CircleHelp, label: 'Aide', onClick: () => {} },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-2">
      <div
        style={{
          position: 'relative',
          height: 76,
          width: isDetailRoute ? 256 : 332,
          transition: 'width 260ms ease',
        }}
      >
        <nav
          className="flex items-center gap-[12px] p-[12px] rounded-[101px] text-[8px]"
          style={{
            ...navShellStyle,
            opacity: isDetailRoute ? 0 : 1,
            transform: isDetailRoute ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
            pointerEvents: isDetailRoute ? 'none' : 'auto',
          }}
          aria-label="Navigation principale"
          aria-hidden={isDetailRoute}
        >
          {TABS.map((tab) => {
            const TabIcon = tab.icon
            return (
              <NavLink key={tab.to} to={tab.to} end aria-label={tab.label}>
                {({ isActive }) => (
                  <div
                    className="flex items-center justify-center rounded-full transition-colors duration-200"
                    style={{
                      width: 52,
                      height: 52,
                      background: isActive
                        ? 'var(--color-eden-lime)'
                        : 'rgba(252, 255, 242, 0.10)',
                    }}
                  >
                    <TabIcon
                      size={24}
                      strokeWidth={1.5}
                      color={isActive ? '#1D261B' : '#FCFFF2'}
                    />
                  </div>
                )}
              </NavLink>
            )
          })}
        </nav>

        <nav
          className="flex items-center"
          style={{
            ...navShellStyle,
            opacity: isDetailRoute ? 1 : 0,
            transform: isDetailRoute ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
            pointerEvents: isDetailRoute ? 'auto' : 'none',
            gap: 8,
            padding: 12,
          }}
          aria-label="Navigation détail"
          aria-hidden={!isDetailRoute}
        >
          {detailButtons.map(({ Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              aria-label={label}
              style={{
                width: 52,
                height: 52,
                borderRadius: 9999,
                background: label === 'Retour'
                  ? 'var(--color-eden-light)'
                  : 'rgba(252,255,242,0.10)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                size={22}
                color={label === 'Retour' ? 'var(--color-eden-ink)' : 'var(--color-eden-light)'}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </nav>
      </div>

      {/* iOS home-bar indicator */}
      <div
        className="mt-2 rounded-full bg-white/40"
        style={{ width: 139, height: 5 }}
        aria-hidden="true"
      />
    </div>
  )
}
