import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-deep-space" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(139,92,246,0.1),transparent)]" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-electric-blue/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center shadow-lg shadow-electric-blue/25 group-hover:shadow-electric-blue/40 transition-shadow">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-purple">
              AIO Asistan
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 rounded-3xl blur-xl opacity-50" />

          <div className="relative p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Hoş Geldiniz</h2>
            <p className="text-slate-400 text-center mb-8 text-sm">
              Hesabınıza giriş yapın
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail size={16} />
                  E-posta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/30 border border-white/[0.08] rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 outline-none transition-all"
                  placeholder="ornek@firma.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-400">
                  <Lock size={16} />
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/[0.08] rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gradient-to-r from-electric-blue to-indigo-600 py-3.5 rounded-xl font-semibold text-white shadow-lg shadow-electric-blue/25 hover:shadow-electric-blue/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    Giriş Yap
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
              <p className="text-slate-400 text-sm">
                Henüz hesabınız yok mu?{' '}
                <Link to="/signup" className="text-electric-blue hover:text-electric-blue/80 font-medium transition-colors">
                  Kayıt Olun
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
        >
          <p className="text-xs text-slate-500 mb-2">Demo hesabı ile deneyin:</p>
          <code className="text-xs text-slate-400 bg-black/30 px-3 py-1.5 rounded-lg">
            demo@user.com / 123456
          </code>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
