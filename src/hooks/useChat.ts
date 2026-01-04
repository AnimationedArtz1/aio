import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/services/api';
import { useTenant } from '@/context/TenantContext';
import type { ChatMessage } from '@/types';
import { DEFAULT_TENANT_SLUG } from '@/lib/tenantIdentity';
import toast from 'react-hot-toast';

const getStoredMessages = (key: string): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
};

const LIMIT_REACHED_MESSAGE = 'Your message limit has been reached. Please upgrade your plan from the admin dashboard.';

export function useChat(storageKey: string = 'aio-chat-history') {
  const { tenant } = useTenant();
  const tenantSlug = tenant?.slug || DEFAULT_TENANT_SLUG;
  const resolvedStorageKey = `${storageKey}-${tenantSlug}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => getStoredMessages(resolvedStorageKey));
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  useEffect(() => {
    setMessages(getStoredMessages(resolvedStorageKey));
  }, [resolvedStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(resolvedStorageKey, JSON.stringify(messages));
  }, [messages, resolvedStorageKey]);

  useEffect(() => {
    setIsLimitReached(false);
    setLimitMessage(null);
  }, [tenantSlug]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      if (isLimitReached) {
        toast.error(limitMessage || LIMIT_REACHED_MESSAGE);
        return;
      }

      const timestamp = Date.now();
      const userMsg: ChatMessage = {
        id: timestamp.toString(),
        role: 'user',
        content: trimmed,
        timestamp,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const response = await chatService.sendMessage(trimmed);

        if (response.limitReached) {
          const warning = response.message || LIMIT_REACHED_MESSAGE;
          const systemMsg: ChatMessage = {
            id: `${Date.now()}-system`,
            role: 'system',
            content: warning,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, systemMsg]);
          setIsLimitReached(true);
          setLimitMessage(warning);
          toast.error(warning);
          return;
        }

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.reply ?? 'Yanıt alınamadı',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to send message';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [isLimitReached, limitMessage]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(resolvedStorageKey);
    }
  }, [resolvedStorageKey]);

  return { messages, isLoading, sendMessage, clearHistory, isLimitReached, limitMessage };
}
