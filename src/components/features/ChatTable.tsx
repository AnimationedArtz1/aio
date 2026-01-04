import React from 'react';
import type { ChatLog } from '@/types';

interface ChatTableProps {
  logs: ChatLog[];
}

const ChatTable: React.FC<ChatTableProps> = ({ logs }) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
       <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-semibold text-white text-lg">Son Konuşmalar</h3>
          <button className="text-xs text-electric-blue hover:text-white transition-colors">Tümünü Gör</button>
       </div>
       
       <div className="overflow-x-auto">
         <table className="w-full text-left text-sm">
           <thead className="bg-white/[0.02] text-slate-400 font-medium">
             <tr>
               <th className="px-6 py-4">Platform</th>
               <th className="px-6 py-4">Kullanıcı ID</th>
               <th className="px-6 py-4">Mesaj Önizleme</th>
               <th className="px-6 py-4">Yanıt</th>
               <th className="px-6 py-4">Tarih</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
             {logs.map((log) => (
               <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                 <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 text-xs text-slate-300 border border-white/5">
                       {log.platform}
                    </span>
                 </td>
                 <td className="px-6 py-4 text-slate-300 font-mono text-xs">{log.userId}</td>
                 <td className="px-6 py-4 text-slate-300 max-w-[200px] truncate">{log.messagePreview}</td>
                 <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate">{log.responsePreview}</td>
                 <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};

export default ChatTable;
