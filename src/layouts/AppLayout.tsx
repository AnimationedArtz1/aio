import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ChatWidget } from '@/components/chat/ChatWidget'

export const AppLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-deep-space text-slate-100">
      <Sidebar isMobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 px-4 py-6 md:px-10 md:py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-10">
            <Outlet />
          </div>
        </main>
      </div>

      <ChatWidget />
    </div>
  )
}
