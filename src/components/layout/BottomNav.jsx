import { NavLink } from 'react-router-dom'
import { Home, ShoppingBasket, Calendar, BookOpen, Settings } from 'lucide-react'

const TABS = [
  { to: '/',            icon: Home,           label: 'Accueil' },
  { to: '/marketplace', icon: ShoppingBasket, label: 'Boutique' },
  { to: '/calendar',    icon: Calendar,       label: 'Calendrier' },
  { to: '/learn',       icon: BookOpen,       label: 'Apprendre' },
  { to: '/settings',    icon: Settings,       label: 'Réglages' },
]

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-2">
      <nav
        className="flex items-center gap-[12px] p-[12px] rounded-[101px] text-[8px]"
        style={{
          background: 'rgba(28, 28, 28, 0.20)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        aria-label="Navigation principale"
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

      {/* iOS home-bar indicator */}
      <div
        className="mt-2 rounded-full bg-white/40"
        style={{ width: 139, height: 5 }}
        aria-hidden="true"
      />
    </div>
  )
}
