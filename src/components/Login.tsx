import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, Mail, Lock, LogIn, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  // 1. Form Inputs State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. Alert Feedback States
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Field Validations
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please type a valid email login address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Security password cannot be blank.');
      return;
    }

    // Load registered mock users pool from LocalStorage
    try {
      const existingUsersRaw = localStorage.getItem('skywings_users');
      const usersList = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      // Find user match
      const userMatch = usersList.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!userMatch) {
        setErrorMessage('Invalid email address or incorrect password. Try registering first!');
        return;
      }

      // Successful matching -> Store active session data
      localStorage.setItem('skywings_logged_in_user', JSON.stringify({
        fullName: userMatch.fullName,
        email: userMatch.email
      }));

      setSuccessMessage(`Welcome back, ${userMatch.fullName}! Logging you in...`);

      // Trigger standard listener dispatch to notify other components (e.g. Navbar)
      window.dispatchEvent(new Event('authChange'));

      // Redirect of user back home
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      setErrorMessage('Critical Sandbox storage read error. Try reloading page.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        
        {/* Login Account Wrapper Panel */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-250/90 overflow-hidden">
          
          {/* Header banner brand bar */}
          <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-6 text-center relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[9px] font-mono text-slate-350">Mock DB Secure</span>
            </div>
            
            <div className="inline-flex p-2.5 bg-sky-600/20 rounded-xl mb-3 border border-sky-500/25">
              <Plane className="w-6 h-6 text-amber-400 rotate-45" />
            </div>
            <h2 className="text-xl font-bold">Sign In to SkyWings</h2>
            <p className="text-xs text-slate-400 mt-1">Simulate flight reservations on your mock profile</p>
          </div>

          <div className="p-6 md:p-8">
            
            {/* Notifications Alert banner */}
            {errorMessage && (
              <div className="p-4 mb-5 bg-red-50 border-l-4 border-red-500 text-red-750 flex items-start gap-2 rounded-r-xl text-xs animate-pulse">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">Authentication Failed</span>
                  {errorMessage}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="p-4 mb-5 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 flex items-start gap-2 rounded-r-xl text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">Verification Secure</span>
                  {successMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email login */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              {/* Security password login */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">
                  Security Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Type your stored password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3 bg-sky-600 hover:bg-sky-505 text-white font-bold rounded-xl transition-all shadow-md shadow-sky-600/20 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In account
              </button>

            </form>

            <div className="mt-6 pt-5 border-t border-slate-150 text-center text-xs">
              <span className="text-slate-500">New boarding member on board? </span>
              <Link to="/signup" className="text-sky-655 hover:text-sky-750 font-bold transition-colors">
                Register Free Here
              </Link>
            </div>

          </div>

        </div>

        {/* Short Presentation Info Tips */}
        <div className="mt-4 p-4.5 bg-slate-100 rounded-2xl border border-slate-205 text-[11px] text-slate-500 text-center">
          💡 <strong>Student Note for Viva:</strong> Pre-registered a mock user in your mind? Alternatively, tap on the "Register Free Here" option to quickly instantiate new user records in <code>localStorage</code> database!
        </div>

      </motion.div>
    </div>
  );
}
