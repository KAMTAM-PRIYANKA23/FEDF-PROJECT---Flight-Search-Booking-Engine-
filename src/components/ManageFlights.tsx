import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  Plus, 
  Trash2, 
  CheckCircle, 
  X, 
  MapPin, 
  DollarSign, 
  Clock, 
  AlertCircle,
  Undo2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Flight } from '../App';
import { getSavedFlights, saveFlights } from '../utils/flightStorage';

export default function ManageFlights() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields State
  const [airline, setAirline] = useState('SkyWings Express');
  const [flightNo, setFlightNo] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [fromCode, setFromCode] = useState('');
  const [toCity, setToCity] = useState('');
  const [toCode, setToCode] = useState('');
  const [departureTime, setDepartureTime] = useState('08:15 AM');
  const [arrivalTime, setArrivalTime] = useState('03:45 PM');
  const [duration, setDuration] = useState('7h 30m');
  const [price, setPrice] = useState('350');
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Business' | 'First'>('Economy');

  useEffect(() => {
    // Session check guard
    const adminSession = localStorage.getItem('skywings_admin_session');
    if (adminSession !== 'true') {
      navigate('/admin/login');
      return;
    }
    setFlights(getSavedFlights());
  }, [navigate]);

  // Form submit add route flow
  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!flightNo.trim() || !fromCity.trim() || !fromCode.trim() || !toCity.trim() || !toCode.trim()) {
      setErrorMessage('Please fill in all airport routes and flight identifier fields.');
      return;
    }

    const newFlight: Flight = {
      id: 'f_dynamic_' + Date.now(),
      airline,
      flightNo: flightNo.toUpperCase().trim(),
      from: fromCity.trim(),
      fromCode: fromCode.toUpperCase().trim().substring(0, 3),
      to: toCity.trim(),
      toCode: toCode.toUpperCase().trim().substring(0, 3),
      departure: departureTime,
      arrival: arrivalTime,
      duration: duration || '3h 30m',
      price: Math.max(1, parseInt(price) || 200),
      class: cabinClass
    };

    // Confirm code parameters uniqueness
    if (flights.some(f => f.flightNo === newFlight.flightNo && f.class === newFlight.class)) {
      setErrorMessage(`Flight ${newFlight.flightNo} in ${newFlight.class} class already exists.`);
      return;
    }

    const updatedList = [newFlight, ...flights];
    setFlights(updatedList);
    saveFlights(updatedList);
    
    // Success notice logic matches standard UI patterns
    setSuccessMessage(`Route flight ${newFlight.flightNo} (${newFlight.class}) added securely.`);
    setShowAddForm(false);
    
    // Clear form
    setFlightNo('');
    setFromCity('');
    setFromCode('');
    setToCity('');
    setToCode('');
    
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Delete flight flow
  const handleDeleteFlight = (id: string, flightLabelCode: string) => {
    if (window.confirm(`Are you absolutely sure you want to delete flight ${flightLabelCode}?`)) {
      const filtered = flights.filter(f => f.id !== id);
      setFlights(filtered);
      saveFlights(filtered);
      setSuccessMessage(`Flight route ${flightLabelCode} successfully purged.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Dynamic top path trail row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin/dashboard" className="text-xs font-bold text-sky-655 hover:text-sky-700 flex items-center gap-1">
            <Undo2 className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <Plane className="w-6 h-6 text-indigo-650 rotate-45" />
            Airways Flight Scheduling Terminal
          </h1>
          <p className="text-xs text-slate-500">
            Realtime database index modifications. Added routes are queryable instantly by passenger search triggers.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setErrorMessage('');
          }}
          className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel Creation' : 'Register New Route'}
        </button>
      </div>

      {/* Pop-up dynamic Feedback alerts */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl text-xs flex items-center gap-2.5 shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <strong className="font-bold">{successMessage}</strong>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div 
            className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2.5 shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle className="w-5 h-5 text-red-505 shrink-0" />
            <strong>{errorMessage}</strong>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creation form Drawer segment */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            className="bg-white border border-slate-205 rounded-2xl p-6 shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 mb-5">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              <h2 className="font-extrabold text-sm text-slate-900 uppercase tracking-widest">
                Create Dynamic Flight Scheduling
              </h2>
            </div>

            <form onSubmit={handleAddFlight} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Airline Title */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Airline Carrier Title
                  </label>
                  <select
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold"
                  >
                    <option value="SkyWings Premium">SkyWings Premium</option>
                    <option value="SkyWings Royale">SkyWings Royale</option>
                    <option value="SkyWings Shuttle">SkyWings Shuttle</option>
                    <option value="SkyWings Express">SkyWings Express</option>
                    <option value="SkyWings Emperor">SkyWings Emperor</option>
                  </select>
                </div>

                {/* Flight ID Code */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 font-mono">
                    Flight Identifier Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SW-145"
                    value={flightNo}
                    onChange={(e) => setFlightNo(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                {/* Seat Class Selection */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-sky-600">
                    Cabin Comfort Class
                  </label>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value as any)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold"
                  >
                    <option value="Economy">Economy Class</option>
                    <option value="Business">Business Class</option>
                    <option value="First">First Class</option>
                  </select>
                </div>

                {/* Base price markup value */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-emerald-500">
                    Base Ticket Cost ($USD)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 420"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="block w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

              </div>

              {/* ROUTE GEOMETRICS SECTOR CHASSIS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-150">
                
                {/* Sector A: Departure parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-r border-dashed border-slate-250 pr-4">
                  <div className="sm:col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                    <MapPin className="w-3.5 h-3.5 text-sky-505" />
                    <span>Departure Hub Setup</span>
                  </div>
                  
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Origin City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Singapore"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="block w-full px-3 py-1.8 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">3-digit Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SIN"
                      maxLength={3}
                      value={fromCode}
                      onChange={(e) => setFromCode(e.target.value)}
                      className="block w-full px-3 py-1.8 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 font-bold"
                    />
                  </div>
                </div>

                {/* Sector B: Arrival parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Arrival Hub Destination</span>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Destination City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tokyo"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="block w-full px-3 py-1.8 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">3-digit Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NRT"
                      maxLength={3}
                      value={toCode}
                      onChange={(e) => setToCode(e.target.value)}
                      className="block w-full px-3 py-1.8 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 font-bold"
                    />
                  </div>
                </div>

              </div>

              {/* TIMETABLE DURATION GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Departure Time Log
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:30 AM"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Arrival Time Log
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 04:50 PM"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Estimated Route Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7h 20m"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                  />
                </div>

              </div>

              {/* Submit triggers action container */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-505 text-white font-extrabold uppercase tracking-wider rounded-xl text-xs cursor-pointer"
                >
                  Write Route to Directory
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Database Listing inventory panel */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5.5 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="text-xs font-black tracking-widest uppercase flex items-center gap-2">
            Airways Active Schedules Directory ({flights.length})
          </h3>
          <span className="text-[9px] font-mono font-bold bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider text-slate-300">
            Secure CRUD Directory
          </span>
        </div>

        {flights.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 italic">
            There are zero registered flights stored in local simulation. Create dynamic models above now.
          </div>
        ) : (
          <div className="divide-y divide-slate-150">
            {flights.map((flight) => (
              <div 
                key={`manage-fli-row-${flight.id}`}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                
                {/* Sector data column */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                      Flight Code: <strong className="font-mono text-indigo-650">{flight.flightNo}</strong>
                    </span>
                    <span className="bg-amber-400/10 text-amber-705 border border-amber-400/15 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded">
                      {flight.class} Class
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate">
                      Carrier: <strong>{flight.airline}</strong>
                    </span>
                  </div>

                  {/* Cities details row */}
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div>
                      <strong className="text-slate-900 font-black text-sm block leading-none">{flight.fromCode}</strong>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[120px] mt-0.5">{flight.from}</span>
                    </div>

                    <div className="flex flex-col items-center shrink-0">
                      <Plane className="w-4 h-4 text-slate-450 rotate-90" />
                      <span className="text-[8px] font-mono text-slate-400 mt-0.5">{flight.duration}</span>
                    </div>

                    <div>
                      <strong className="text-slate-900 font-black text-sm block leading-none">{flight.toCode}</strong>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[120px] mt-0.5">{flight.to}</span>
                    </div>
                  </div>
                </div>

                {/* Clock schedule meta mapping */}
                <div className="flex items-center flex-wrap gap-4 text-xs shrink-0 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-150">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-mono text-slate-400 block tracking-wider font-extrabold">DEPT TIME</span>
                    <strong className="text-slate-800 text-xs font-black font-mono block leading-none">{flight.departure}</strong>
                  </div>
                  
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-mono text-slate-400 block tracking-wider font-extrabold">ARRV TIME</span>
                    <strong className="text-indigo-650 text-xs font-black font-mono block leading-none">{flight.arrival || 'Scheduled'}</strong>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-mono text-slate-405 block tracking-wider font-extrabold">PRICE QUOTE</span>
                    <span className="text-emerald-600 font-extrabold font-mono text-sm block leading-none">${flight.price}</span>
                  </div>
                </div>

                {/* Actions triggered button block */}
                <div className="flex items-center gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleDeleteFlight(flight.id, `${flight.flightNo} [${flight.class}]`)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer border border-red-200 hover:border-red-300"
                    title="Purge flight route permanent"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
