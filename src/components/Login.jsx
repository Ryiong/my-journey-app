import React, { useState } from 'react';
import logoSvg from '../assets/icon.svg';
import { supabase } from '../supabaseClient';


export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      alert("Xác thực thất bại: " + error.message);
    } else if (data.user) {
      onLoginSuccess(data.user);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-6 bg-surface z-50 select-none">
      <div className="w-full max-w-sm bg-white p-6 rounded-card border border-surface-container-highest stitch-shadow space-y-6">
        <div className="text-center space-y-1">
          <img
            src={logoSvg}
            alt="Journey Logo"
            className="w-8 h-8 m-auto object-contain active:scale-95 transition-transform"
          />
          <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Journey
          </h1>
          <p className="text-[10px] text-outline font-medium uppercase tracking-wider">Who are you?</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Your account</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface border-none focus:ring-1 focus:ring-primary rounded-xl text-xs p-3 outline-none"
              placeholder="name@domain.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Your key</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface border-none focus:ring-1 focus:ring-primary rounded-xl text-xs p-3 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white font-bold text-xs rounded-xl tracking-widest active:scale-98 transition-transform disabled:opacity-50"
          >
            {loading ? 'CHECKING...' : 'JOIN'}
          </button>
        </form>
      </div>
    </div>
  );
}