import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase'; 
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Call Supabase to verify your email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Success! Redirect to the hidden dashboard
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Jungle Theme Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#060913]/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(132,204,22,0.15)]">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black text-white">Admin Portal</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <ShieldAlert size={18} className="text-red-400 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_20px_-5px_rgba(132,204,22,0.4)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Secure Login'} 
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}