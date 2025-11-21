import axios, { AxiosError } from 'axios'
import type { AgentConfig, ChatResponse } from '@/types'

const rawBaseUrl = import.meta.env.VITE_N8N_WEBHOOK_URL

if (!rawBaseUrl) {
  throw new Error('VITE_N8N_WEBHOOK_URL environment variable is required')
}

const sanitizedBaseUrl = rawBaseUrl.replace(/\/+$/, '')

const client = axios.create({
  baseURL: sanitizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
})

const resolveEndpoint = (path: string) => `${sanitizedBaseUrl}/${path.replace(/^\/+/, '')}`

const extractErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>
    const message = axiosError.response?.data?.message || axiosError.message
    return message || 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Bir hata oluştu. Lütfen bağlantınızı kontrol edin.'
}

export const api = {
  async updateAgent(payload: AgentConfig) {
    try {
      const response = await client.post(resolveEndpoint('/webhook/update-agent'), payload)
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  },

  async sendChatMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await client.post(resolveEndpoint('/webhook/chat'), { message })
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  },
}
