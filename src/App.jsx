import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './features/dashboard/HomePage'
import { DashboardGridPage } from './features/detail-slot/DashboardGridPage'
import { SlotDetailPage } from './features/detail-slot/SlotDetailPage'
import { Preloader } from './features/preloader/Preloader'

function App() {
  const [ready, setReady] = useState(false)

  if (!ready) {
    return <Preloader onComplete={() => setReady(true)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/slot/:id" element={<DashboardGridPage />} />
        <Route path="/slot/:slotId/box/:boxNumber" element={<SlotDetailPage />} />
        {/* Additional routes will be wired here as features are built */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
