import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AgentData {
  name: string;
  role_type: string;
  system_prompt: string;
  model: string;
  temperature: number;
}

const AgentEditor = () => {
  const [formData, setFormData] = useState<AgentData>({
    name: '',
    role_type: 'general',
    system_prompt: '',
    model: 'gemini-pro',
    temperature: 0.7
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get('/api/agent', getHeaders());
        if (res.data) {
          setFormData({
            name: res.data.name || '',
            role_type: res.data.role_type || 'general',
            system_prompt: res.data.system_prompt || '',
            model: res.data.model || 'gemini-pro',
            temperature: res.data.temperature || 0.7
          });
        }
      } catch (e) {
        toast.error('Ajan bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.put('/api/agent', formData, getHeaders());
      toast.success('Ajan güncellendi!');
      navigate('/dashboard');
    } catch (e) {
      toast.error('Güncelleme başarısız');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space text-white flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-white p-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-neon-purple">Ajanı Düzenle</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white transition"
          >
            Geri Dön
          </button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
          
          <div>
            <label className="block mb-2 text-slate-400">Ajan Adı</label>
            <input 
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:outline-none transition"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Örn: Satış Asistanı"
            />
          </div>

          <div>
            <label className="block mb-2 text-slate-400">Rol Tipi</label>
            <select 
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:outline-none transition"
              value={formData.role_type}
              onChange={e => setFormData({...formData, role_type: e.target.value})}
            >
              <option value="general">Genel Asistan</option>
              <option value="sales">Satış</option>
              <option value="support">Müşteri Destek</option>
              <option value="booking">Randevu/Rezervasyon</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-slate-400">Model</label>
            <select 
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:outline-none transition"
              value={formData.model}
              onChange={e => setFormData({...formData, model: e.target.value})}
            >
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-slate-400">
              Sıcaklık (Temperature): {formData.temperature}
            </label>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="w-full"
              value={formData.temperature}
              onChange={e => setFormData({...formData, temperature: parseFloat(e.target.value)})}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Tutarlı (0)</span>
              <span>Yaratıcı (1)</span>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-slate-400">Sistem Talimatı (Prompt)</label>
            <textarea 
              className="w-full h-48 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:outline-none transition resize-none"
              value={formData.system_prompt}
              onChange={e => setFormData({...formData, system_prompt: e.target.value})}
              placeholder="Örnek: Sen bir restoran asistanısın. Müşterilere menü hakkında bilgi ver, rezervasyon al ve sipariş kaydı oluştur. Her zaman nazik ve yardımsever ol."
            />
            <p className="text-xs text-slate-500 mt-2">
              Bu talimat, AI'ın nasıl davranacağını belirler. Ne kadar detaylı yazarsanız o kadar iyi sonuç alırsınız.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="flex-1 bg-white/10 py-3 rounded-lg hover:bg-white/20 transition font-medium"
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 bg-neon-purple py-3 rounded-lg font-bold hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AgentEditor;
