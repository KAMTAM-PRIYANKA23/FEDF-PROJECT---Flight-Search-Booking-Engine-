import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, AlertCircle, ShieldAlert, Sparkles, ArrowRight, Plane } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    setIsLoggingIn(true);

    // Mock verification after short duration
    setTimeout(() => {
      setIsLoggingIn(false);
      // Let's accept generic admin/admin or admin/admin123 for sandbox testing ease
      if (
        (username.toLowerCase() === 'admin' && password === 'admin') ||
        (username.toLowerCase() === 'admin' && password === 'admin123')
      ) {
        localStorage.setItem('skywings_admin_session', 'true');
        localStorage.setItem(
          'skywings_logged_in_user',
          JSON.stringify({ fullName: 'Chief Administrator Officer', email: 'admin@skywings.aero' })
        );
        navigate('/admin/dashboard');
      } else {
        setError('Invalid administrative credentials. Use admin / admin123.');
      }
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 sm:px-6">
      
      <motion.div 
        className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Sky Header Area */}
        <div className="bg-slate-900 p-6 text-white text-center relative">
          <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="w-12 h-12 bg-sky-500/15 border border-sky-500/25 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6 text-sky-400" />
          </div>
          
          <span className="text-[9px] font-mono tracking-widest text-sky-300 font-extrabold uppercase">
            Restricted Personnel Area
          </span>
          <h2 className="text-lg font-black tracking-tight mt-0.5">SkyWings Administration</h2>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Please register biometric or passcode credentials to modify routes.
          </p>
        </div>

        {/* Content area */}
        <div className="p-6 sm:p-8 space-y-6">

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick info presentation badge */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-slate-800 rounded-xl text-xs space-y-1">
            <strong className="block text-amber-800 font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Simulation Credentials:
            </strong>
            <p className="text-[10px] text-slate-650 leading-relaxed font-mono">
              Username: <strong className="text-slate-900">admin</strong> <br/>
              Password: <strong className="text-slate-900">admin123</strong> (or admin)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username input */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Passcode / Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Access control submit */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all shadow-md text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <span>Access Terminal Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure disclaimer indicator */}
          <p className="text-[10px] text-slate-400 text-center leading-normal">
            Unauthorized interception logged. Local sandbox mode is enabled. Fits secure administrative policies.
          </p>

        </div>
      </motion.div>

    </div>
  );
}
