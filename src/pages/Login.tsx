import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Giriş başarılı!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-space text-white p-6">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-purple/20 via-deep-space to-deep-space" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-purple">
              AIO Asistan
            </span>
          </Link>
        </div>

        <div className="p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg">
          <h2 className="text-2xl font-bold mb-2 text-center">Hoş Geldiniz</h2>
          <p className="text-slate-400 text-center mb-6 text-sm">
            Hesabınıza giriş yapın
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-slate-400">E-posta</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-electric-blue outline-none transition"
                placeholder="ornek@firma.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-slate-400">Şifre</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-electric-blue outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-electric-blue py-3 rounded-lg font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-slate-400 text-sm">
              Henüz hesabınız yok mu?{' '}
              <Link to="/signup" className="text-electric-blue hover:underline font-medium">
                Kayıt Olun
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="text-xs text-slate-500 mb-2">Demo hesabı ile deneyin:</p>
          <code className="text-xs text-slate-400">
            demo@user.com / 123456
          </code>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
