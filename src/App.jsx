import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './features/dashboard/HomePage'
import { DashboardGridPage } from './features/detail-slot/DashboardGridPage'
import { SlotDetailPage } from './features/detail-slot/SlotDetailPage'
import { CalendarPage } from './features/calendar/CalendarPage'
import { MarketplacePage } from './features/marketplace/MarketplacePage'
import { ProfilePage, SettingsPage } from './features/profile'
import { NotificationsPage } from './features/notifications'
import { Preloader } from './features/preloader/Preloader'

function App() {
  const basePath = import.meta.env.BASE_URL || '/'
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
  const appPath = window.location.pathname.startsWith(normalizedBase)
    ? window.location.pathname.slice(normalizedBase.length) || '/'
    : window.location.pathname
  const startsOnHome = appPath === '/'
  const [ready, setReady] = useState(!startsOnHome)

  if (!ready) {
    return <Preloader onComplete={() => setReady(true)} />
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/slot/:id" element={<DashboardGridPage />} />
        <Route path="/slot/:slotId/box/:boxNumber" element={<SlotDetailPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        {/* GitHub Pages / direct-link fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
