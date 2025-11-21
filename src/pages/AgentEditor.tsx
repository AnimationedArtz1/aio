import { useState } from 'react'
import { CheckCircle2, AlertCircle, Brain, Zap } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { api } from '@/services/api'
import type { AgentConfig } from '@/types'

export const AgentEditor = () => {
  const [config, setConfig] = useState<AgentConfig>({
    name: 'AIO Assistant',
    role_type: 'general',
    model: 'gemini-pro',
    system_prompt: `Sen AIO şirketinin uzman yapay zeka asistanısın. Kullanıcılara yardımcı ol, profesyonel ve samimi bir dil kullan.`,
    temperature: 0.7,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const lineNumbers = Array.from(
    { length: Math.max(config.system_prompt.split('\n').length, 3) },
    (_, index) => index + 1,
  )

  const handleSave = async () => {
    if (!config.name.trim() || !config.system_prompt.trim()) {
      toast.error('Lütfen tüm zorunlu alanları doldurun')
      return
    }

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      await api.updateAgent(config)
      setSaveSuccess(true)
      toast.success('Ajan yapılandırması başarıyla güncellendi!')
      
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kayıt başarısız'
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-2xl gradient-primary p-3">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white">Ajan Beyni</h2>
          </div>
          <p className="text-slate-400">
            AI modelini, davranış tarzını ve yanıt stratejilerini yapılandır.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-4 py-3 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-semibold">Kaydedildi!</span>
          </div>
        )}
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Ajan İsmi <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="input-field"
              placeholder="Örn: AIO Sales Expert"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Rol Türü <span className="text-red-400">*</span>
            </label>
            <select
              value={config.role_type}
              onChange={(e) => setConfig({ ...config, role_type: e.target.value as AgentConfig['role_type'] })}
              className="select-field"
            >
              <option value="sales">Satış</option>
              <option value="support">Destek</option>
              <option value="general">Genel</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Model <span className="text-red-400">*</span>
            </label>
            <select
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value as AgentConfig['model'] })}
              className="select-field"
            >
              <option value="gemini-pro">Gemini Pro (Daha Akıllı)</option>
              <option value="gemini-flash">Gemini Flash (Daha Hızlı)</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Zap className="h-4 w-4 text-electric-blue" />
              Temperature: <span className="text-white">{config.temperature}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="temperature-slider"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>Tutarlı</span>
              <span>Yaratıcı</span>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            System Prompt (Davranış Talimatları) <span className="text-red-400">*</span>
          </label>
          <div className="relative glass-card rounded-xl overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-white/5 bg-white/[0.01] flex flex-col items-center py-3 text-xs text-slate-600 font-mono select-none">
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6">
                  {num}
                </div>
              ))}
            </div>
            <textarea
              value={config.system_prompt}
              onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
              rows={12}
              className="w-full pl-16 pr-4 py-3 bg-transparent text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue/50 resize-none placeholder:text-slate-500"
              placeholder="Ajanın nasıl davranacağını, hangi dilde konuşacağını detaylıca açıklayın..."
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Bu alan ajanın tüm davranışlarını belirler. Net ve detaylı talimatlar yazın.
          </p>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            variant="primary"
          >
            {!isSaving && (
              saveSuccess ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  Kaydedildi
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Kaydet ve Uygula
                </>
              )
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
