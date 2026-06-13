import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Ticket, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-custom bg-slate-900 text-slate-400 text-sm border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo & Brief Description */}
          <div className="footer-section">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="w-5 h-5 text-sky-500 rotate-45" />
              <span className="text-white font-semibold text-base">SkyWings Airlines</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A beginner-friendly design engineered for quick client flight search simulations, ticket routing, and instant offline reservations.
            </p>
          </div>

          {/* Practical Navigation Quick actions */}
          <div className="footer-section">
            <h3 className="text-white font-medium mb-3">Quick Actions</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>✈</span> Search & Book Flights
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>🎫</span> Manage Your Hot Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Sandbox Credit lines */}
          <div className="footer-section">
            <h3 className="text-white font-medium mb-3">Project Metadata</h3>
            <p className="text-xs text-slate-405 leading-relaxed">
              Maintains standard state storage persistence using browser <strong>LocalStorage</strong> APIs, allowing you to test bookings offline.
            </p>
            <div className="mt-3 inline-block px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-amber-400">
              College Viva presentation template
            </div>
          </div>

        </div>

        {/* Copyright notice row */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} SkyWings Flight Booking System. All Rights Reserved.</span>
          <div className="flex items-center gap-2 text-[10px] bg-slate-950/40 px-2 py-1 rounded border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-400 font-mono">Status: LocalStorage Sandbox Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
