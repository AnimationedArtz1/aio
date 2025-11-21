import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { api } from '@/services/api'
import { useMobile } from '@/hooks/useMobile'
import type { ChatMessage } from '@/types'

const STORAGE_KEY = 'aio_v2_chat_history'

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await api.sendChatMessage(userMessage.message)

      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.reply,
        sender: 'agent',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bağlantı hatası'
      toast.error(errorMessage)

      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        sender: 'agent',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([])
    toast.success('Konuşma geçmişi temizlendi')
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full gradient-primary shadow-[0_12px_60px_rgba(59,130,246,0.6)] hover:scale-110 transition-transform duration-300"
            aria-label="Sohbeti Aç"
          >
            <MessageCircle className="h-7 w-7 text-white mx-auto" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: isMobile ? 1 : 0.9, y: isMobile ? '100%' : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: isMobile ? 1 : 0.9, y: isMobile ? '100%' : 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 flex flex-col ${
              isMobile
                ? 'inset-0 rounded-none'
                : 'bottom-6 right-6 h-[600px] w-[380px] rounded-3xl'
            } glass-card border border-white/10 shadow-2xl overflow-hidden`}
          >
            <div className="glass-header flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">AIO Assistant</h3>
                  <p className="text-xs text-slate-400">Her zaman yanınızda</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="rounded-xl p-2 transition-all hover:bg-red-500/20"
                    aria-label="Sohbeti Temizle"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 transition-all hover:bg-white/10"
                  aria-label="Sohbeti Kapat"
                >
                  <X className="h-5 w-5 text-slate-300" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="space-y-3 max-w-xs">
                    <div className="h-16 w-16 rounded-full gradient-primary mx-auto flex items-center justify-center animate-glow-pulse">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white">Merhaba! 👋</h4>
                    <p className="text-sm text-slate-400">
                      Size nasıl yardımcı olabilirim? Herhangi bir sorunuz varsa sormaktan çekinmeyin.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'gradient-primary text-white'
                        : 'glass-card text-slate-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                    <p className="mt-1 text-xs opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="glass-card rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-electric-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-electric-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-electric-blue animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="glass-header border-t border-white/5 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  disabled={isLoading}
                  className="input-field flex-1 py-2.5"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl gradient-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed hover-glow"
                  aria-label="Gönder"
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
