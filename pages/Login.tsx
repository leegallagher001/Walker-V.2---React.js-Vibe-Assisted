
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    await login(email, name);
    navigate('/');
  };

  return (
    <div className="fade-in max-w-xl mx-auto py-12 px-4">
      <div className="bg-white rounded-[50px] p-8 md:p-12 shadow-2xl border border-black/5 text-center">
        <div className="mb-10">
          <div className="inline-block p-4 bg-[#5FB37A] rounded-full mb-6 shadow-lg">
             <span className="text-4xl">🥾</span>
          </div>
          <h2 className="text-4xl font-black text-[#5E4C06] tracking-tight">WELCOME BACK</h2>
          <p className="text-[#5E4C06]/60 font-medium mt-2">Ready for your next expedition?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.3em] mb-2 ml-1">Explorer Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Walker"
              className="w-full p-5 rounded-2xl border border-black/10 text-xl focus:outline-none focus:ring-4 focus:ring-[#5FB37A]/20 bg-[#F4F0E4] text-[#5E4C06] font-bold placeholder:text-[#5E4C06]/20 transition-all shadow-inner"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.3em] mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@expedition.com"
              className="w-full p-5 rounded-2xl border border-black/10 text-xl focus:outline-none focus:ring-4 focus:ring-[#5FB37A]/20 bg-[#F4F0E4] text-[#5E4C06] font-bold placeholder:text-[#5E4C06]/20 transition-all shadow-inner"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#5E4C06] text-[#F4F0E4] py-5 rounded-3xl text-2xl font-black border-4 border-[#FFF6D2] hover:bg-[#5FB37A] transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-4 uppercase tracking-widest"
          >
            {loading ? 'Entering...' : 'Begin Journey'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-black/5">
          <p className="text-xs font-bold text-[#5E4C06]/30 uppercase tracking-[0.2em] mb-4">Why Sign In?</p>
          <p className="text-sm text-[#5E4C06]/50 italic">
            "By logging in, we can ensure your walks, memories, and habits are synced safely across all your devices."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
