import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane,
  Mail,
  Lock,
  LogIn,
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Password cannot be empty.');
      return;
    }

    try {
      const existingUsersRaw = localStorage.getItem('skywings_users');

      const usersList = existingUsersRaw
        ? JSON.parse(existingUsersRaw)
        : [];

      const userMatch = usersList.find(
        (u: any) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (!userMatch) {
        setErrorMessage(
          'Invalid email or password. Please register first.'
        );
        return;
      }

      localStorage.setItem(
        'skywings_logged_in_user',
        JSON.stringify({
          fullName: userMatch.fullName,
          email: userMatch.email
        })
      );

      window.dispatchEvent(new Event('authChange'));

      setSuccessMessage(
        `Welcome back, ${userMatch.fullName}! Redirecting...`
      );

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        'Unable to access local storage. Please refresh the page.'
      );
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
        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-6 text-center relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px]">Secure</span>
            </div>

            <div className="inline-flex p-3 bg-sky-600/20 rounded-xl mb-3">
              <Plane className="w-6 h-6 text-amber-400 rotate-45" />
            </div>

            <h2 className="text-xl font-bold">
              Sign In to SkyWings
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Access your flight dashboard
            </p>
          </div>

          <div className="p-6">
            {errorMessage && (
              <div className ="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded text-xs flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />

                <div>{errorMessage}</div>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded text-xs flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />

                <div>{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-500">
                Don't have an account?
              </span>

              <Link
                to="/signup"
                className="ml-2 text-sky-600 font-semibold"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
