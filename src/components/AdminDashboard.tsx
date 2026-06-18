import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Plane, 
  Ticket, 
  TrendingUp, 
  DollarSign, 
  Armchair, 
  Users, 
  Settings, 
  ArrowRight, 
  ChevronRight, 
  Activity, 
  AlertCircle,
  Clock,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { Flight, Booking } from '../App';
import { getSavedFlights, getSavedBookings } from '../utils/flightStorage';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Authorized session guard check
    const adminSession = localStorage.getItem('skywings_admin_session');
    if (adminSession !== 'true') {
      navigate('/admin/login');
      return;
    }
    setIsAuthorized(true);

    // 2. Fetch synchronous data
    setFlights(getSavedFlights());
    setBookings(getSavedBookings());
  }, [navigate]);

  if (!isAuthorized) {
    return (
      <div className="p-12 text-center text-xs font-mono text-slate-500">
        Verifying Administrative Security Authentication...
      </div>
    );
  }

  // Calculate stats
  const totalFlights = flights.length;
  const totalBookingsCount = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');
  
  const totalEarnings = confirmedBookings.reduce((acc, booking) => {
    const base = booking.flight.price || 0;
    const taxes = Math.round(base * 0.08);
    const luggage = booking.extraBaggage ? 35 : 0;
    return acc + base + taxes + luggage;
  }, 0);

  // Quick logout helper
  const handleLogoutAdmin = () => {
    localStorage.removeItem('skywings_admin_session');
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin header welcome row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold text-sky-600 uppercase tracking-widest bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100 w-fit mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-sky-555" />
            <span>Personnel Control Panel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Administrator Dashboard Hub
          </h1>
          <p className="text-xs text-slate-500">
            Real-time control loops. Configure available flight schedules, manage occupied seat maps, and inspect active traveler databases.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link 
            to="/" 
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black transition-all border border-slate-200 cursor-pointer text-center"
          >
            Switch to Passenger View
          </Link>
          <button 
            type="button"
            onClick={handleLogoutAdmin}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-550 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
          >
            Secure Sign-Out
          </button>
        </div>
      </div>

      {/* Grid of Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Dynamic Route Count */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Plane className="w-5.5 h-5.5 rotate-45" />
          </div>
          <div>
            <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-widest block leading-none">Mapped Routes</span>
            <strong className="text-xl font-mono font-black text-slate-900 mt-1 block">{totalFlights}</strong>
            <span className="text-[9px] text-indigo-600 font-bold block">Active schedule models</span>
          </div>
        </div>

        {/* KPI 2: Live Ticket Registry */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Ticket className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-455 font-extrabold uppercase tracking-widest block leading-none">Booked PNRs</span>
            <strong className="text-xl font-mono font-black text-slate-900 mt-1 block">{totalBookingsCount}</strong>
            <span className="text-[9px] text-slate-500 font-medium block flex items-center gap-1">
              ✓ {confirmedBookings.length} Active • {cancelledBookings.length} Cancelled
            </span>
          </div>
        </div>

        {/* KPI 3: Sandbox Revenue Capitalization */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-widest block leading-none">Revenue Log</span>
            <strong className="text-xl font-mono font-black text-sky-655 mt-1 block">${totalEarnings}</strong>
            <span className="text-[9px] text-emerald-600 font-semibold block flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Simulation tracking
            </span>
          </div>
        </div>

        {/* KPI 4: Security Integrity Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <Activity className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-widest block leading-none">Security Guard</span>
            <strong className="text-sm font-black text-emerald-600 mt-1 block">OPERATIONAL</strong>
            <span className="text-[9px] text-slate-400 block truncate">100% Offline client-side sandbox</span>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Grid Panels (Bento design) */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Administrative Control Panels
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Action Card 1: Manage Flights */}
          <motion.div 
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            whileHover={{ y: -2 }}
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-900 text-white rounded-xl w-fit">
                <Plane className="w-5 h-5 rotate-45" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Manage Flight Inventories</h4>
              <p className="text-xs text-slate-500 leading-normal">
                Initialize new destination routes, change base service pricing quotes, delete inactive flights, or configure custom timetable codes.
              </p>
            </div>
            <Link 
              to="/admin/flights" 
              className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center block cursor-pointer flex items-center justify-center gap-1 shadow-sm"
            >
              Configure Flights
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Action Card 2: Manage Seat map blockings */}
          <motion.div 
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            whileHover={{ y: -2 }}
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-amber-500/10 text-amber-600 border border-amber-300 w-fit rounded-xl">
                <Armchair className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Configure Occupied Seats</h4>
              <p className="text-xs text-slate-500 leading-normal">
                Force pre-book limits or block row seats for private corporate partners. Modifying this map affects user layout interfaces immediately.
              </p>
            </div>
            <Link 
              to="/admin/seats" 
              className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center block cursor-pointer flex items-center justify-center gap-1 shadow-sm"
            >
              Block Seats Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Action Card 3: View passenger bookings */}
          <motion.div 
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            whileHover={{ y: -2 }}
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-sky-50 text-sky-600 border border-sky-100 w-fit rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Inspect Active Passenger Bookings</h4>
              <p className="text-xs text-slate-500 leading-normal">
                Review verified list of travelers names, passports validation profiles, cancel bookings, or re-verify generated PNR receipts.
              </p>
            </div>
            <Link 
              to="/admin/bookings" 
              className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center block cursor-pointer flex items-center justify-center gap-1 shadow-sm"
            >
              Inspect Bookings list
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Live Sandbox Activity log table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-150 mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4.5 h-4.5 text-indigo-650" />
            <h3 className="font-bold text-sm text-slate-900">Recent Sandbox Ticketing Feed</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Latest confirmation loop feeds
          </span>
        </div>

        {confirmedBookings.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-405 italic">
            No dynamic passenger transaction history recorded yet on this computer. Keep search testing active.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/45 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">PNR</th>
                  <th className="py-2.5 px-3">Passenger</th>
                  <th className="py-2.5 px-3">Flight No</th>
                  <th className="py-2.5 px-3">Itinerary Route</th>
                  <th className="py-2.5 px-3">Seat No</th>
                  <th className="py-2.5 px-3">Log Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {confirmedBookings.slice(0, 5).map((b) => (
                  <tr key={`dashboard-tbl-${b.bookingId}`} className="hover:bg-slate-50/20">
                    <td className="py-3 px-3 font-mono text-sky-600 font-bold">{b.bookingId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{b.passengerName}</td>
                    <td className="py-3 px-3 font-mono">{b.flight.flightNo}</td>
                    <td className="py-3 px-3">
                      <strong>{b.flight.fromCode}</strong> to <strong>{b.flight.toCode}</strong>
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-amber-600">{b.seatNumber}</td>
                    <td className="py-3 px-3 text-slate-450">{b.bookingDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
