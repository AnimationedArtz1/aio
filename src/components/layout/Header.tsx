import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export const Header = ({ onMenuClick }: HeaderProps) => (
  <header className="glass-header sticky top-0 z-30 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 transition-all hover:bg-white/5 lg:hidden"
          aria-label="Menüyü Aç"
        >
          <Menu className="h-6 w-6 text-slate-300" />
        </button>
        
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white lg:text-2xl">
            AIO V2.0 Admin Panel
          </h1>
          <p className="text-sm text-slate-400 hidden sm:block">Production-Ready SaaS Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 lg:flex">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-glow-pulse" />
          <span className="text-sm font-medium text-emerald-400">Online</span>
        </div>

        <div className="flex items-center gap-3 rounded-2xl glass-card px-4 py-2.5">
          <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-white">
            MT
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">Mehmet Tutar</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  </header>
)
