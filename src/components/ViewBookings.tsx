import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Trash2, 
  XCircle, 
  CheckCircle, 
  Plane, 
  Undo2, 
  ShieldCheck, 
  Mail, 
  CreditCard, 
  Filter, 
  Eye, 
  Calendar, 
  Armchair,
  AlertCircle,
  X
} from 'lucide-react';
import { Booking } from '../App';
import { getSavedBookings, saveBookings } from '../utils/flightStorage';

export default function ViewBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const [inspectedBooking, setInspectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Session status check guard
    const adminSession = localStorage.getItem('skywings_admin_session');
    if (adminSession !== 'true') {
      navigate('/admin/login');
      return;
    }
    setBookings(getSavedBookings());
  }, [navigate]);

  // Handle Cancellation of a Reservation
  const handleCancelReservation = (bookingId: string, passenger: string) => {
    if (window.confirm(`Are you absolutely sure you want to cancel passenger ${passenger}'s reservation (${bookingId})?`)) {
      const updated = bookings.map(b => {
        if (b.bookingId === bookingId) {
          return { ...b, status: 'Cancelled' as const };
        }
        return b;
      });

      setBookings(updated);
      saveBookings(updated);
      
      // Update active inspector modal if open
      if (inspectedBooking && inspectedBooking.bookingId === bookingId) {
        setInspectedBooking({ ...inspectedBooking, status: 'Cancelled' });
      }

      setSuccessMsg(`Reservation PNR ${bookingId} has been CANCELLED and deactivated.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Filter list matching queries
  const filteredList = bookings.filter((b) => {
    const sTerm = filterQuery.toLowerCase().trim();
    const queryMatch = 
      b.passengerName.toLowerCase().includes(sTerm) ||
      b.passportNumber.toLowerCase().includes(sTerm) ||
      b.bookingId.toLowerCase().includes(sTerm) ||
      b.flight.flightNo.toLowerCase().includes(sTerm) ||
      b.passengerEmail.toLowerCase().includes(sTerm);

    const statusMatch = statusFilter === 'All' ? true : b.status === statusFilter;
    
    return queryMatch && statusMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search Header and path navigations */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin/dashboard" className="text-xs font-bold text-sky-655 hover:text-sky-700 flex items-center gap-1">
            <Undo2 className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-650" />
            Passenger Bookings Audit Registry
          </h1>
          <p className="text-xs text-slate-500">
            Audit offline reservation states. Review contact details, flight cabin assignments, passport listings, and verify PNR status logs.
          </p>
        </div>
      </div>

      {/* Success alert message container */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            className="p-4 bg-amber-500/10 border border-amber-300 text-slate-900 rounded-2xl text-xs flex items-center gap-2.5 shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <strong>{successMsg}</strong>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search queries card section layout */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center">
        
        {/* Term lookup search */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search bookings by Passenger Name, Passport ID, PNR Code or Email..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.8 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-505 focus:outline-none text-xs"
          />
        </div>

        {/* Status filter selection state */}
        <div className="flex items-center gap-2 w-full md:w-auto self-stretch md:self-auto shrink-0 justify-end">
          <span className="text-xs text-slate-455 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> State Filter:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2 px-3 font-semibold cursor-pointer w-full md:w-auto"
          >
            <option value="All">All Bookings</option>
            <option value="Confirmed">Confirmed Bookings</option>
            <option value="Cancelled">Cancelled Bookings</option>
          </select>
        </div>

      </div>

      {/* Bookings registry split panels layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main auditing table of bookings (Column span 7 or 8 depending on modal visibility state) */}
        <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all ${
          inspectedBooking ? 'lg:col-span-7' : 'lg:col-span-12'
        }`}>
          <div className="p-4.5 bg-slate-900 text-white flex justify-between items-center">
            <h3 className="text-xs font-black tracking-widest uppercase flex items-center gap-2">
              Traveller Booking Registry Logs ({filteredList.length} matches)
            </h3>
            <span className="text-[9px] font-mono font-bold bg-white/10 px-2.5 py-1 rounded-full uppercase">
              SANDBOX DB
            </span>
          </div>

          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              No matching bookings found. Complete reservations as a passenger first.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">PNR Code</th>
                    <th className="py-3 px-3">Passenger</th>
                    <th className="py-3 px-3">Flight Code</th>
                    <th className="py-3 px-3 text-center">Seat</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans font-medium">
                  {filteredList.map((b) => {
                    const isCancelled = b.status === 'Cancelled';
                    return (
                      <tr 
                        key={`audit-booking-${b.bookingId}`} 
                        className={`hover:bg-slate-50/40 transition-colors ${
                          inspectedBooking?.bookingId === b.bookingId ? 'bg-sky-500/5' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 font-mono text-sky-600 font-black">
                          {b.bookingId}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          <div>
                            <span>{b.passengerName}</span>
                            <span className="block text-[9px] text-slate-455 font-mono uppercase">{b.passportNumber}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div>
                            <span className="font-mono text-slate-700 font-bold">{b.flight.flightNo}</span>
                            <span className="block text-[9px] text-slate-500">
                              {b.flight.fromCode} → {b.flight.toCode}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-black text-amber-605">
                          {b.seatNumber}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase border ${
                            isCancelled 
                              ? 'bg-red-50 text-red-600 border-red-150' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-150'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right space-x-1 shrink-0">
                          <button
                            onClick={() => setInspectedBooking(b)}
                            className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-bold uppercase transition-all inline-flex items-center gap-1 cursor-pointer"
                            title="Inspect details"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-650" />
                            Inspect
                          </button>
                          
                          {!isCancelled && (
                            <button
                              onClick={() => handleCancelReservation(b.bookingId, b.passengerName)}
                              className="p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all inline-flex items-center cursor-pointer border border-red-200"
                              title="Cancel passenger reservation"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed dynamic passenger modal (Column span 5) */}
        {inspectedBooking && (
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6 relative">
            <button 
              onClick={() => setInspectedBooking(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <div className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-extrabold mb-1">
                INSPECTION PROFILE
              </div>
              <h3 className="text-slate-900 font-black text-sm">
                Passenger: {inspectedBooking.passengerName}
              </h3>
              <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 border border-sky-100/50 px-2.5 py-0.5 rounded mt-1 inline-block">
                PNR PENDING CODE: {inspectedBooking.bookingId}
              </span>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700">
              
              {/* Sector info card */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                <span className="text-[8px] font-mono text-slate-455 tracking-widest block uppercase font-bold">
                  ITINERARY FLIGHT DETAIL
                </span>
                <strong className="text-slate-900 font-extrabold block">
                  {inspectedBooking.flight.airline} ({inspectedBooking.flight.flightNo})
                </strong>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200/50">
                  <span>Sector origin: <strong>{inspectedBooking.flight.fromCode}</strong></span>
                  <span>Sector dest: <strong>{inspectedBooking.flight.toCode}</strong></span>
                  <span>Class: <strong>{inspectedBooking.flight.class}</strong></span>
                </div>
              </div>

              {/* Personal metadata */}
              <div className="space-y-3 p-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold leading-normal">Age Group</span>
                    <strong className="text-slate-800 text-xs block">{inspectedBooking.passengerAge} Years Old</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold leading-normal">Passport ID No</span>
                    <strong className="text-slate-800 text-xs font-mono uppercase block">{inspectedBooking.passportNumber}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold leading-normal">Assigned Seat Row</span>
                    <strong className="text-amber-600 font-mono text-xs block flex items-center gap-1.5 font-black">
                      <Armchair className="w-4 h-4" /> Seat {inspectedBooking.seatNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold leading-normal">Status Verification</span>
                    <strong className={`text-xs uppercase block ${
                      inspectedBooking.status === 'Cancelled' ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      ● {inspectedBooking.status}
                    </strong>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-slate-505 text-[11px]">
                    <Mail className="w-4.5 h-4.5 text-slate-400" />
                    <span>Email: <strong>{inspectedBooking.passengerEmail}</strong></span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-555 text-[11px]">
                    <Calendar className="w-4.5 h-4.5 text-slate-400" />
                    <span>Booked Stamp: <strong>{inspectedBooking.bookingDate}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-505 text-[11px]">
                    <ShieldCheck className="w-4.5 h-4.5 text-slate-400" />
                    <span>Meal Selection: <strong className="text-slate-800">{inspectedBooking.mealOption || 'Standard Meal'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-505 text-[11px]">
                    <ShieldCheck className="w-4.5 h-4.5 text-slate-400" />
                    <span>Baggage Upgrade: <strong>{inspectedBooking.extraBaggage ? 'Included (+30kg Extra Checked)' : 'Standard Allowance'}</strong></span>
                  </div>
                </div>

              </div>

              {/* Controls triggers */}
              <div className="border-t border-slate-150 pt-5 pt-3.5 flex justify-end gap-2.5">
                {inspectedBooking.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancelReservation(inspectedBooking.bookingId, inspectedBooking.passengerName)}
                    className="w-full py-2.8 bg-red-650 hover:bg-red-550 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Cancel Seat reservation
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
