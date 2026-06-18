import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  Ticket, 
  DollarSign, 
  TrendingUp, 
  Bell, 
  Plane, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Info
} from 'lucide-react';
import { Booking } from '../App';

interface DashboardNotification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<{ fullName: string; email: string } | null>(null);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);

  useEffect(() => {
    // 1. Fetch user session
    const rawUser = localStorage.getItem('skywings_logged_in_user');
    if (rawUser) {
      setCurrentUser(JSON.parse(rawUser));
    }

    // 2. Fetch local storage bookings
    const rawBookings = localStorage.getItem('skywings_bookings');
    const bookingsData: Booking[] = rawBookings ? JSON.parse(rawBookings) : [];
    setBookings(bookingsData);

    // 3. Populate mock dynamic notifications based on user state
    const baseNotifications: DashboardNotification[] = [
      {
        id: 'noti-welcome',
        type: 'info',
        title: 'Welcome to SkyWings Sandbox!',
        message: 'Explore domestic or international flight routes, choose custom seat grids, and run checkout simulations.',
        time: 'Just now',
        read: false
      }
    ];

    if (bookingsData.length > 0) {
      const activeBooking = bookingsData.find(b => b.status === 'Confirmed');
      if (activeBooking) {
        baseNotifications.unshift({
          id: 'noti-checkin',
          type: 'success',
          title: 'Online Check-in Open',
          message: `Check-in is open for your flight ${activeBooking.flight.flightNo} from ${activeBooking.flight.fromCode} to ${activeBooking.flight.toCode}. Seat row ${activeBooking.seatNumber} confirmed.`,
          time: '15 mins ago',
          read: false
        });
        
        baseNotifications.push({
          id: 'noti-secured',
          type: 'success',
          title: 'Payment Cryptography Verified',
          message: `PNR ticket ${activeBooking.bookingId} is encrypted and synced with browser storage securely.`,
          time: '1 hour ago',
          read: true
        });
      }
    }

    setNotifications(baseNotifications);
  }, []);

  // Compute stat aggregates
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');
  
  // Calculate spending (each flight price + options taxes)
  const totalSpent = confirmedBookings.reduce((acc, booking) => {
    const flightPrice = booking.flight.price || 0;
    const taxes = Math.round(flightPrice * 0.08);
    const baggage = booking.extraBaggage ? 35 : 0;
    return acc + flightPrice + taxes + baggage;
  }, 0);

  // Clear specific notification
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header & Welcome Area */}
      <motion.div 
        className="relative bg-gradient-to-r from-slate-900 via-slate-950 to-sky-950 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-xl border border-slate-800"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Sky branding watermark loops */}
        <div className="absolute top-0 right-0 -translate-y-6 translate-x-6 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 translate-y-12 w-48 h-48 bg-amber-450/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/15 text-sky-300 rounded-full text-[10px] font-mono tracking-widest uppercase font-extrabold border border-sky-450/20">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>SkyWings Flight Control Terminal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
              Welcome back, <span className="text-amber-400">{currentUser ? currentUser.fullName : 'Valued Passenger'}</span>!
            </h1>
            <p className="text-xs text-slate-350 max-w-xl leading-relaxed">
              Maintain, verify, and monitor your personal check-in statuses, route statistics, and generated PNR ticket references inside our offline simulation.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link 
              to="/" 
              className="px-5 py-3 bg-sky-600 hover:bg-sky-550 text-white font-extrabold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-sky-600/20 cursor-pointer flex items-center gap-1"
            >
              <Plane className="w-4 h-4 rotate-45" />
              Book New Flight
            </Link>
            <Link 
              to="/bookings" 
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-xl text-xs uppercase tracking-widest transition-all border border-slate-700 cursor-pointer flex items-center gap-1"
            >
              <Ticket className="w-4 h-4" />
              My Bookings
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. Statistical Aggregations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Bookings Stat block */}
        <motion.div 
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block leading-none">Total Bookings</span>
            <strong className="text-xl font-mono font-black text-slate-900 mt-1 block">{bookings.length}</strong>
            <span className="text-[9px] text-slate-500 font-medium block">All-time reservation transactions</span>
          </div>
        </motion.div>

        {/* Confirmed / Active Stat block */}
        <motion.div 
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block leading-none">Confirmed Seats</span>
            <strong className="text-xl font-mono font-black text-slate-900 mt-1 block">{confirmedBookings.length}</strong>
            <span className="text-[9px] text-emerald-600 font-bold block">✓ Ready for takeoff</span>
          </div>
        </motion.div>

        {/* Cancelled Stat block */}
        <motion.div 
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block leading-none">Cancelled Runs</span>
            <strong className="text-xl font-mono font-black text-slate-900 mt-1 block">{cancelledBookings.length}</strong>
            <span className="text-[9px] text-red-500 font-semibold block">Dismissed itineraries</span>
          </div>
        </motion.div>

        {/* Total Price/Spent Stat block */}
        <motion.div 
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block leading-none">Simulated Spent</span>
            <strong className="text-xl font-mono font-black text-sky-600 mt-1 block">${totalSpent}</strong>
            <span className="text-[9px] text-slate-500 font-medium block flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> Sandboxed capital log
            </span>
          </div>
        </motion.div>

      </div>

      {/* 3. Section layout split: Notifications & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Recent Bookings list */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-4.5 h-4.5 text-sky-600" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Your Recent Flight Passes</h2>
            </div>
            
            {bookings.length > 3 && (
              <Link to="/bookings" className="text-xs font-bold text-sky-605 hover:text-sky-700 flex items-center gap-0.5">
                View All {bookings.length} Bookings
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
              <Plane className="w-12 h-12 text-slate-350 mx-auto rotate-45 mb-3 scale-x-[-1]" />
              <h4 className="text-sm font-bold text-slate-900">Your Booking Repository is Empty</h4>
              <p className="text-xs text-slate-450 mt-1 max-w-sm mx-auto">
                No active mock flight routes found in browser. Choose from international destinations now.
              </p>
              <div className="mt-4">
                <Link to="/" className="inline-block px-4.5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs">
                  Begin Search Page
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 3).map((booking) => {
                const isCancelled = booking.status === 'Cancelled';
                return (
                  <div 
                    key={`dashboard-booking-${booking.bookingId}`}
                    className={`bg-white rounded-2xl border ${
                      isCancelled ? 'border-slate-150 opacity-75' : 'border-slate-200/90 hover:border-slate-300'
                    } p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4`}
                  >
                    {/* Route Details panel */}
                    <div className="space-y-3 flex-1">
                      
                      <div className="flex items-center flex-wrap gap-2 text-xs">
                        <span className="font-mono font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-150">
                          PNR: <strong className="text-sky-605">{booking.bookingId}</strong>
                        </span>
                        
                        <span className="font-mono text-[10px] text-slate-400">
                          Class: <strong className="text-slate-700">{booking.flight.class}</strong>
                        </span>

                        <span className="font-mono text-[10px] text-slate-400">•</span>

                        <span className="font-mono text-[10px] text-slate-450">
                          Date: <strong className="text-slate-650">{booking.bookingDate}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <strong className="text-slate-900 text-base font-black block leading-none">{booking.flight.fromCode}</strong>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{booking.flight.from}</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <Plane className="w-4 h-4 text-sky-600 rotate-90" />
                          <div className="w-12 border-t border-dashed border-slate-300 my-1"></div>
                          <span className="text-[8px] font-mono text-amber-600 font-bold uppercase tracking-widest">{booking.flight.duration}</span>
                        </div>

                        <div>
                          <strong className="text-slate-900 text-base font-black block leading-none">{booking.flight.toCode}</strong>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{booking.flight.to}</span>
                        </div>
                      </div>

                    </div>

                    {/* Comfort Seats and Seat Indicators row */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-2">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 font-mono block uppercase">Assigned Seats</span>
                        <strong className="text-[11px] font-mono text-slate-800 block">{booking.seatNumber}</strong>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-extrabold border ${
                          isCancelled 
                            ? 'bg-red-50 text-red-600 border-red-150' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-150'
                        }`}>
                          {booking.status}
                        </span>

                        <button 
                          onClick={() => navigate(`/success/${booking.bookingId}`)}
                          className="p-1 px-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-lg text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1 cursor-pointer"
                        >
                          E-Ticket
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Notifications Alerts */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-amber-500" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Flight Security Alerts</h2>
            </div>
            
            {notifications.length > 0 && (
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                {notifications.filter(n => !n.read).length} Unread
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            {notifications.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                No notification logs are active. Stay tuned for real-time sandbox events.
              </div>
            ) : (
              notifications.map((notif) => {
                const isSuccess = notif.type === 'success';
                const isWarning = notif.type === 'warning';
                return (
                  <motion.div 
                    key={`dashboard-noti-${notif.id}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-2xl border transition-all relative ${
                      notif.read ? 'bg-white border-slate-200 opacity-75' : 'bg-sky-50/40 border-sky-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 prag-noti">
                      
                      {/* Left icon wrapper */}
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 border ${
                        isSuccess 
                          ? 'bg-emerald-50 text-emerald-605 border-emerald-110' 
                          : isWarning 
                            ? 'bg-red-50 text-red-600 border-red-150' 
                            : 'bg-indigo-50 text-indigo-600 border-indigo-150'
                      }`}>
                        {isSuccess ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : isWarning ? (
                          <AlertCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Info className="w-3.5 h-3.5" />
                        )}
                      </div>

                      {/* Content panel */}
                      <div className="space-y-1 pr-6">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-900 text-xs font-extrabold block">
                            {notif.title}
                          </strong>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 bg-sky-555 rounded-full animate-ping"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-505 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-slate-400 font-mono font-medium block">
                          {notif.time}
                        </span>
                      </div>

                      {/* Clear trigger actions */}
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        {!notif.read && (
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            title="Mark as read"
                            className="text-[9px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 p-1 px-1.5 rounded cursor-pointer border border-sky-100"
                          >
                            Read
                          </button>
                        )}
                        <button 
                          onClick={() => handleDismissNotification(notif.id)}
                          title="Dismiss notification"
                          className="text-slate-400 hover:text-slate-600 font-bold font-mono text-[9px] p-1 px-1.5 bg-slate-50 border border-slate-205 rounded cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* 4. Help & Security Section banner */}
      <div className="p-5.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-xs leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-sky-655 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block font-extrabold">Active Security Sandbox encryption:</strong>
            <span className="text-slate-505 block text-[11px] mt-0.5">
              All reservation state metadata remains completely on this local client. Browser sessions are private and fully decrypted.
            </span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-mono tracking-wider text-right shrink-0">
          GATEWAY STATE: OPERATIONAL
        </span>
      </div>

    </div>
  );
}
