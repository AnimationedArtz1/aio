import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-deep-space text-slate-400 font-sans selection:bg-electric-blue/30 selection:text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"></div>
         
         <Header onMenuClick={() => setIsSidebarOpen(true)} />
         
         <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
           <Outlet />
         </main>
      </div>
    </div>
  );
};

export default AdminLayout;
