
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
// Assuming AuthContext is exported or handled in App.tsx
// Since we are in the same project, we'll use window context or similar if needed, 
// but actually we need to fix the import or just rely on the existing pattern.
// I'll update the component to use the context properly once I'm sure of the structure.

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // In App.tsx, we'll pass loginSuccess via context. 
  // For simplicity here, we'll stick to a robust reload if context isn't used, 
  // but I have already updated App.tsx to handle state. 
  // Actually, I'll just rely on the user session being set and then navigate.

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authService.login(email, password);
      // Instead of reload, we just navigate. App.tsx will pick up the user from localStorage on next render or via context.
      // To ensure context updates, we'll use a hard refresh if needed, but the App.tsx update is better.
      window.location.href = '#/dashboard';
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-3xl tracking-tighter mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={22} fill="white" />
            </div>
            STRATUM
          </Link>
          <h2 className="text-zinc-100 text-xl font-semibold">Welcome back</h2>
          <p className="text-zinc-500 text-sm mt-2">Enter your credentials to access your intelligence dashboard</p>
        </div>

        <div className="glass p-8 rounded-3xl border-zinc-800/50">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-blue-600 transition-colors"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-blue-600 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

            <button 
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-zinc-800/50 pt-6">
            <p className="text-zinc-500 text-sm">
              Don't have an account? <Link to="/signup" className="text-blue-400 font-semibold hover:underline">Start your journey</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
