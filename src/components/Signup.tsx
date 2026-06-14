import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, User, Mail, Lock, Key, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();

  // 1. Form Field States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 2. Feedback States (Toast and Alert simulator)
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // --- Dynamic Form Field Validations ---
    if (!fullName.trim()) {
      setErrorMessage('Full name is required to register boarding credentials.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please write a valid communication email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Security password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify again.');
      return;
    }

    // --- Mock User Persistence via LocalStorage ---
    try {
      const existingUsersRaw = localStorage.getItem('skywings_users');
      const usersList = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      // Check if user already exists
      const userExists = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setErrorMessage('This email is already registered with SkyWings Airlines.');
        return;
      }

      // Add user to local catalog
      const newRegisteredUser = {
        fullName,
        email: email.toLowerCase(),
        password // Plain-text mock simulation for easy student explanation!
      };
      
      usersList.push(newRegisteredUser);
      localStorage.setItem('skywings_users', JSON.stringify(usersList));

      setSuccessMessage('Account created successfully! Redirecting you to login...');
      
      // Auto redirect to Login page after 1.5 seconds mock delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setErrorMessage('Write storage permission error. Try reloading page.');
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
        
        {/* Sign Up Card Box */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-250/90 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-6 text-center relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[9px] font-mono text-slate-350">Mock DB Secure</span>
            </div>
            
            <div className="inline-flex p-2.5 bg-sky-600/20 rounded-xl mb-3 border border-sky-500/25">
              <Plane className="w-6 h-6 text-amber-400 rotate-45" />
            </div>
            <h2 className="text-xl font-bold">Register on SkyWings</h2>
            <p className="text-xs text-slate-400 mt-1">Start simulating your luxury flight bookings</p>
          </div>

          <div className="p-6 md:p-8">
            
            {/* Inline Notifications / Micro Toast simulation */}
            {errorMessage && (
              <div className="p-4 mb-5 bg-red-50 border-l-4 border-red-500 text-red-750 flex items-start gap-2 rounded-r-xl text-xs animate-pulse">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">Validation Alert</span>
                  {errorMessage}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="p-4 mb-5 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 flex items-start gap-2 rounded-r-xl text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">Registration Confirmed</span>
                  {successMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              
              {/* Name field */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">
                  Full Name (For Boarding Pass)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyank Reddy"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              {/* Email field */}
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

              {/* Password field */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              {/* Confirm Password field */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3 bg-sky-600 hover:bg-sky-505 text-white font-bold rounded-xl transition-all shadow-md shadow-sky-600/20 text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            <div className="mt-6 pt-5 border-t border-slate-150 text-center text-xs">
              <span className="text-slate-500">Already have an air account? </span>
              <Link to="/login" className="text-sky-650 hover:text-sky-700 font-bold transition-colors">
                Sign In Here
              </Link>
            </div>

          </div>

        </div>

        {/* Short Presentation Info Tips */}
        <div className="mt-4 p-4.5 bg-slate-100 rounded-2xl border border-slate-205 text-[11px] text-slate-500 text-center">
          💡 <strong>Student Note for Viva:</strong> In a real-world app, passwords should be salted and hashed on a server-side DB. In our beginner project, we persist plaintext strings inside client-side browser <code>localStorage</code> storage for easy demonstrability.
        </div>

      </motion.div>
    </div>
  );
}
