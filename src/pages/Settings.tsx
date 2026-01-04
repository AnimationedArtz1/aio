import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, Lock, CreditCard, Bell, Save, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    email: '',
    phone: '',
    company: '',
    notificationEnabled: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        // Backend'den user info al
        if (user) {
          setSettings({
            email: user.email || '',
            phone: user.phone_number || '',
            company: user.name || '',
            notificationEnabled: true
          });
        }
      } catch (err) {
        console.error('Ayarlar yüklenemedi:', err);
      }
    };
    
    fetchSettings();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Backend'e güncelleme gönder (mock için)
      console.log('Ayarlar kaydediliyor:', settings);
      
      toast.success('Ayarlar güncellendi!');
      setLoading(false);
    } catch (err) {
      console.error('Kaydetme hatası:', err);
      toast.error('Ayarlar kaydedilemedi');
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    navigate('/dashboard/settings/password');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Ayarlar</h1>
        <p className="text-slate-400">
          Hesap ve işletme ayarlarınızı buradan yönetin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profil Bilgileri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl border border-white/10 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User size={20} />
            Profil Bilgileri
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <Mail size={16} />
                E-posta Adresi
              </label>
              <input
                type="email"
                value={settings.email}
                disabled
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-slate-500"
              />
              <p className="text-xs text-slate-500">E-posta değiştirilemez (Destek ile iletişim gereklidir)</p>
            </div>

            {/* Telefon */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <Phone size={16} />
                İletişim Telefonu
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+90 5XX XXX XX XX"
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:outline-none transition"
              />
            </div>

            {/* İşletme Adı */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <Building2 size={16} />
                İşletme Adı
              </label>
              <input
                type="text"
                value={settings.company}
                onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                placeholder="Örn: Lezzet Restoran"
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:outline-none transition"
              />
            </div>

            {/* Bildirimler */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-electric-blue" />
                <div>
                  <p className="text-sm text-white">Bildirimler</p>
                  <p className="text-xs text-slate-500">E-posta bildirimleri al</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-electric-blue rounded-full relative cursor-pointer transition-colors hover:bg-blue-600">
                <div 
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notificationEnabled ? 'translate-x-5' : ''}`}
                />
              </div>
            </div>

            {/* Kaydet Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-electric-blue py-3 rounded-lg font-medium text-white hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </form>
        </motion.div>

        {/* Güvenlik ve Faturalama */}
        <div className="space-y-6">
          {/* Şifre Değiştirme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-xl border border-white/10 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <Lock size={20} className="text-neon-purple" />
              <h3 className="text-lg font-semibold text-white">Şifre</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin.
            </p>
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center justify-center gap-2 bg-white/10 text-electric-blue py-2 rounded-lg hover:bg-white/20 transition"
            >
              Şifre Değiştir
            </button>
          </motion.div>

          {/* Faturalama */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-xl border border-white/10 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <CreditCard size={20} className="text-green-400" />
              <h3 className="text-lg font-semibold text-white">Faturalama</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Mevcut Plan</span>
                <span className="text-white font-medium">Professional</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Aylık Ücret</span>
                <span className="text-white font-medium">$199.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Sonraki Fatura</span>
                <span className="text-white font-medium">25 Ocak 2025</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-white/10 text-electric-blue py-2 rounded-lg hover:bg-white/20 transition">
              Faturalar Sayfasına Git
            </button>
          </motion.div>

          {/* Çıkış Yap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-500/10 rounded-xl border border-red-500/20 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <LogOut size={20} className="text-red-400" />
              <h3 className="text-lg font-semibold text-white">Oturum Kapat</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Bu cihazdan çıkmak istediğinizden emin olun.
            </p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition"
            >
              <LogOut size={18} />
              Çıkış Yap
            </button>
          </motion.div>

          {/* Hesap Durumu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 rounded-xl border border-white/10 p-5"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-400" />
              Hesap Durumu
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-slate-300">Hesap aktif</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-slate-300">E-posta doğrulandı</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <AlertTriangle size={16} className="text-yellow-400" />
                <span className="text-slate-300">2FA (İki faktörlü doğrulama) kapalı</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-white/10 text-electric-blue py-2 rounded-lg hover:bg-white/20 transition">
              2FA Aktif Et
            </button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
