
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, User, Loader2 } from 'lucide-react';
import { MockDB } from '../db';
import { User as UserType } from '../types';

export default function LoginPage({ onLogin }: { onLogin: (u: UserType) => void }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    
    const user = MockDB.register(formData.username || 'Player123', formData.email);
    onLogin(user);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md mc-card p-10 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Aesthetic accents */}
        <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
        
        <div className="flex flex-col items-center mb-10">
          <div className="bg-green-600 p-3 rounded-lg mb-4 mc-border">
            <Trophy size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black">{isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h2>
          <p className="text-zinc-500 mt-2">{isLogin ? 'Continue your legacy' : 'Join the elite ranks'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Steve"
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded-sm focus:border-green-600 outline-none transition-all"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="email" 
                required
                placeholder="steve@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded-sm focus:border-green-600 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            {isLogin && <p className="text-[10px] text-zinc-600 mt-1">Tip: Use admin@mc.np for Admin access</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded-sm focus:border-green-600 outline-none transition-all"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mc-button mc-button-green py-4 font-black text-white text-lg rounded-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'LOGIN' : 'REGISTER')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 hover:text-green-500 font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
