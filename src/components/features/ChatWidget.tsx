import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { useChat } from '@/hooks/useChat';
import TypingIndicator from './TypingIndicator';
import { useTenant } from '@/context/TenantContext';

const LIMIT_NOTICE_FALLBACK = 'Your message limit has been reached. Please upgrade your plan from the admin dashboard.';

interface ChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
  storageKey?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  isOpen: externalIsOpen, 
  onToggle: externalOnToggle,
  storageKey = 'aio-widget-history'
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const toggle = externalOnToggle || (() => setInternalIsOpen(!internalIsOpen));
  
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage, isLimitReached, limitMessage } = useChat(storageKey);
  const { tenant, tenantProfile } = useTenant();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || isLimitReached) return;
    
    const msg = input;
    setInput(''); // Clear immediately
    await sendMessage(msg);
  };

  const limitNotice = limitMessage || LIMIT_NOTICE_FALLBACK;

  return (
    <>
      {/* Toggle Button - Only show if not externally controlled or if we are using internal state */}
      {externalIsOpen === undefined && (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            className={cn(
            "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-shadow",
            isOpen && "hidden"
            )}
        >
            <MessageSquare size={28} fill="currentColor" />
        </motion.button>
      )}

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => toggle()}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed z-[60] flex flex-col bg-[#0B0F19] border border-white/10 shadow-2xl overflow-hidden",
                "transition-all duration-300 ease-in-out",
                // MOBİL: Tam Ekran
                "inset-0 w-full h-[100dvh] rounded-none",
                // MASAÜSTÜ: Sağ Alt Köşe
                "md:inset-auto md:bottom-6 md:right-6 md:w-[380px] md:h-[600px] md:rounded-2xl"
              )}
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <Bot size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{tenant?.name || 'AIO Asistan'}</h3>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-medium">
                          {tenant?.status === 'suspended' ? 'Pasif' : 'Çevrimiçi'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wide">
                        {tenantProfile?.plan.name || 'Standart Plan'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => toggle()}
                  className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0F19]">
                {messages.length === 0 && (
                    <div className="text-center text-slate-500 text-sm mt-10">
                        <Bot className="mx-auto mb-2 opacity-50" size={32} />
                        <p>Merhaba! Size nasıl yardımcı olabilirim?</p>
                    </div>
                )}
                {messages.map((msg) => {
                  const timeLabel = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  if (msg.role === 'system') {
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center"
                      >
                        <div className="max-w-sm w-full text-center px-3 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs leading-relaxed shadow-md shadow-amber-500/10">
                          {msg.content}
                          <div className="mt-1 text-[10px] text-amber-200/70">{timeLabel}</div>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                        msg.role === 'user' ? "bg-electric-blue/20 text-electric-blue" : "bg-neon-purple/20 text-neon-purple"
                      )}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed",
                        msg.role === 'user' 
                          ? "bg-electric-blue text-white rounded-tr-none" 
                          : "bg-white/[0.05] text-slate-200 border border-white/[0.05] rounded-tl-none"
                      )}>
                        {msg.content}
                        <div className="mt-1 text-[10px] opacity-50 text-right">
                          {timeLabel}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center flex-shrink-0">
                       <Bot size={14} />
                    </div>
                    <TypingIndicator />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#0B0F19] border-t border-white/5">
                {isLimitReached && (
                  <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                    <AlertTriangle size={14} className="flex-shrink-0" />
                    <span>{limitNotice}</span>
                  </div>
                )}
                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isLimitReached
                        ? 'Kredi limitiniz doldu. Lütfen panelden planınızı yükseltin.'
                        : 'Mesajınızı yazın...'
                    }
                    disabled={isLimitReached}
                    className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="absolute right-2 h-9 w-9 p-0 rounded-lg"
                    disabled={!input.trim() || isLoading || isLimitReached}
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
