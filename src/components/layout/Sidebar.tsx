import { AnimatePresence, motion } from 'framer-motion'
import { Brain, MessageSquare, Settings, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface SidebarProps {
  isMobileOpen: boolean
  onClose: () => void
}

const navItems = [
  { label: 'Ajan Beyni', path: '/', icon: Brain },
  { label: 'Widget Kontrolü', path: '#', icon: MessageSquare, disabled: true },
  { label: 'Otomasyonlar', path: '#', icon: Sparkles, disabled: true },
  { label: 'Ayarlar', path: '#', icon: Settings, disabled: true },
]

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
  <div className="flex h-full flex-col gap-8 p-6">
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-[0.35em] text-slate-500">AIO V2.0</div>
      <div className="text-2xl font-semibold tracking-tight text-white">Deep Space Panel</div>
      <p className="text-sm text-slate-400">Ajan zekasını, widget deneyimini ve otomasyonları tek yerden yönet.</p>
    </div>

    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon
        if (item.disabled) {
          return (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.01] px-4 py-3 text-slate-500"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-white/[0.04] p-2">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </div>
              <span className="text-xs text-electric-blue">Yakında</span>
            </div>
          )
        }

        return (
          <NavLink
            key={item.label}
            to={item.path}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'gradient-primary text-white shadow-[0_12px_45px_rgba(59,130,246,0.35)]'
                  : 'glass-card text-slate-300 hover:bg-white/[0.04]'
              }`
            }
          >
            <span className="rounded-2xl bg-white/10 p-2">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold tracking-tight">{item.label}</p>
              <p className="text-xs text-white/60">Agent Brain</p>
            </div>
          </NavLink>
        )
      })}
    </nav>

    <div className="mt-auto space-y-4 rounded-2xl border border-white/5 bg-gradient-to-br from-electric-blue/10 to-neon-purple/10 p-4">
      <h4 className="text-sm font-semibold text-white">Canlı Sistem Özeti</h4>
      <ul className="space-y-2 text-sm text-slate-400">
        <li className="flex items-center justify-between">
          <span>Production API</span>
          <span className="text-emerald-400">Aktif</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Model Versiyonu</span>
          <span className="text-white">Gemini Pro</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Widget Uptime</span>
          <span className="text-white">99.9%</span>
        </li>
      </ul>
    </div>
  </div>
)

export const Sidebar = ({ isMobileOpen, onClose }: SidebarProps) => (
  <>
    <aside className="glass-card hidden h-screen w-72 flex-shrink-0 flex-col rounded-none border-r border-white/5 lg:flex">
      <SidebarContent />
    </aside>

    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 h-full w-72 bg-deep-space"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <SidebarContent onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  </>
)
