import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Ticket, Menu, X, ShieldCheck, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ fullName: string; email: string } | null>(null);

  // Load active session from local storage on mount & listen to custom trigger events
  const syncSession = () => {
    const rawUser = localStorage.getItem('skywings_logged_in_user');
    if (rawUser) {
      setLoggedInUser(JSON.parse(rawUser));
    } else {
      setLoggedInUser(null);
    }
  };

  useEffect(() => {
    syncSession();
    
    // Custom trigger dispatcher listener
    window.addEventListener('authChange', syncSession);
    return () => {
      window.removeEventListener('authChange', syncSession);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('skywings_logged_in_user');
    setLoggedInUser(null);
    // Notify application
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <nav className="navbar-custom sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-sky-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Brand Name */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="logo-badge p-2 bg-sky-600 rounded-lg group-hover:bg-sky-505 transition-colors">
              <Plane className="w-6 h-6 text-white rotate-45" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-sky-200 bg-clip-text text-transparent">
                Sky<span className="text-amber-400">Wings</span>
              </span>
              <span className="block text-[10px] text-slate-450 font-mono tracking-widest uppercase">Airlines</span>
            </div>
          </Link>

          {/* Desktop Navigation Link Options */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="nav-link text-slate-300 hover:text-white transition-colors text-sm font-medium hover:border-b-2 hover:border-sky-500 py-1"
            >
              Search Flights
            </Link>
            <Link 
              to="/dashboard" 
              className="nav-link text-slate-300 hover:text-white transition-colors text-sm font-medium hover:border-b-2 hover:border-sky-500 py-1"
            >
              Dashboard
            </Link>
            <Link 
              to="/bookings" 
              className="nav-link text-slate-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5 hover:border-b-2 hover:border-amber-400 py-1"
            >
              <Ticket className="w-4 h-4 text-amber-400 font-bold" />
              My Bookings
            </Link>
            <Link 
              to="/admin/login" 
              className="nav-link text-slate-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5 hover:border-b-2 hover:border-sky-500 py-1"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400 font-bold" />
              Admin Portal
            </Link>
          </div>

          {/* User Auth Action Toolbar */}
          <div className="hidden lg:flex items-center gap-4">
            {loggedInUser ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-slate-800 text-slate-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  Hi, {loggedInUser.fullName.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-red-500/20 hover:bg-red-500 hover:text-white border border-red-500/40 text-red-300 font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs text-slate-305 hover:text-white transition-colors font-semibold px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-xs bg-sky-600 hover:bg-sky-505 text-white font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-md shadow-sky-600/10"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Practical Live Mock Status Indicator */}
          <div className="hidden md:flex items-center gap-2 py-1.5 px-3 bg-slate-855 rounded-full border border-slate-705">
            <ShieldCheck className="w-4 h-4 text-emerald-455" />
            <span className="text-xs font-mono text-slate-305">Viva Sandbox Active</span>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-800 focus:outline-none"
              id="hamburger-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-2 animate-fade-in">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Search Flights
          </Link>
          <Link 
            to="/dashboard" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Dashboard
          </Link>
          <Link 
            to="/bookings" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
          >
            <Ticket className="w-5 h-5 text-amber-400" />
            My Bookings
          </Link>
          <Link 
            to="/admin/login" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            Admin Portal
          </Link>
          
          {/* User Auth controls in drawer */}
          <div className="pt-2 border-t border-slate-800">
            {loggedInUser ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-slate-400 px-3 py-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-400" />
                  Hi, {loggedInUser.fullName}
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:bg-slate-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-amber-400 hover:bg-slate-800"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>

          <div className="px-3 py-2 text-xs font-mono text-slate-505 border-t border-slate-800 flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-455" />
            Offline Mock Sandbox Active
          </div>
        </div>
      )}
    </nav>
  );
}
