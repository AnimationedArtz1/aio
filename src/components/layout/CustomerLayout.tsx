import React from 'react';
import { Outlet } from 'react-router-dom';
import { Bot, HelpCircle } from 'lucide-react';

const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-deep-space text-slate-400 font-sans selection:bg-neon-purple/30 selection:text-white relative overflow-x-hidden flex flex-col">
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-purple/20 via-deep-space to-deep-space pointer-events-none"></div>
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"></div>

       <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-purple to-indigo-600 flex items-center justify-center shadow-lg shadow-neon-purple/20">
                <Bot className="text-white" size={24} />
             </div>
             <div>
                <h1 className="font-bold text-2xl tracking-tight text-white">AIO Asistan</h1>
                <p className="text-sm text-neon-purple font-medium">Customer Support</p>
             </div>
          </div>
          
           <a href="#" className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
             <HelpCircle size={18} />
             <span>Yardım Merkezi</span>
           </a>
       </header>

       <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-6">
          <Outlet />
       </main>

       <footer className="relative z-10 w-full py-6 text-center text-xs text-slate-600">
         &copy; {new Date().getFullYear()} AIO Systems. All rights reserved.
       </footer>
    </div>
  );
};

export default CustomerLayout;
