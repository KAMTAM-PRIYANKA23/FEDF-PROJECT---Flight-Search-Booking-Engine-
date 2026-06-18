import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Armchair, 
  CheckCircle2, 
  XCircle, 
  Plane, 
  Undo2, 
  AlertCircle, 
  ShieldCheck, 
  Info,
  Sparkles,
  RefreshCw,
  EyeOff
} from 'lucide-react';
import { Flight } from '../App';
import { getSavedFlights, getSeatMapBlockedSeats, saveSeatMapBlockedSeats } from '../utils/flightStorage';
import { MOCK_30_SEATS } from './SeatMap';

export default function ManageSeats() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [blockedSeats, setBlockedSeats] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Session authorization guard
    const adminSession = localStorage.getItem('skywings_admin_session');
    if (adminSession !== 'true') {
      navigate('/admin/login');
      return;
    }
    
    const activeFlights = getSavedFlights();
    setFlights(activeFlights);
    
    if (activeFlights.length > 0) {
      setSelectedFlight(activeFlights[0]);
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedFlight) {
      const blocked = getSeatMapBlockedSeats(selectedFlight.id);
      setBlockedSeats(blocked);
    }
  }, [selectedFlight]);

  // Toggle seat block handler
  const handleToggleBlockSeat = (seatId: string) => {
    if (!selectedFlight) return;
    
    let updated: string[];
    if (blockedSeats.includes(seatId)) {
      updated = blockedSeats.filter(id => id !== seatId);
      setFeedback(`Seat ${seatId} unlocked successfully.`);
    } else {
      updated = [...blockedSeats, seatId];
      setFeedback(`Seat ${seatId} blocked for booking.`);
    }

    setBlockedSeats(updated);
    saveSeatMapBlockedSeats(selectedFlight.id, updated);
    
    // Auto clear small toast
    setTimeout(() => setFeedback(''), 3000);
  };

  // Reset all locks trigger
  const handleResetSeats = () => {
    if (!selectedFlight) return;
    if (window.confirm('Reset all custom seat blockages for this flight?')) {
      setBlockedSeats([]);
      saveSeatMapBlockedSeats(selectedFlight.id, []);
      setFeedback('All seat locks cleared.');
      setTimeout(() => setFeedback(''), 3500);
    }
  };

  const rows = [1, 2, 3, 4, 5];
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Paths row indicators */}
      <div>
        <Link to="/admin/dashboard" className="text-xs font-bold text-sky-655 hover:text-sky-700 flex items-center gap-1">
          <Undo2 className="w-3.5 h-3.5" /> Back to Admin Dashboard
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
          <Armchair className="w-6 h-6 text-indigo-650" />
          Seat Layout Allocation Terminal
        </h1>
        <p className="text-xs text-slate-500">
          Lock/unlock specific seats to manage boarding quotas. Blocked seats are marked as unavailable for passengers.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold rounded-xl max-w-md">
          {feedback}
        </div>
      )}

      {/* Main double column split: Flights list & Map editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Flight Selection Feed (Column Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Plane className="w-4 h-4 rotate-45 text-sky-505" />
            Select Target Schedule Route
          </h3>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
            {flights.map((flight) => {
              const active = selectedFlight?.id === flight.id;
              return (
                <button
                  key={`seats-fli-pick-${flight.id}`}
                  onClick={() => setSelectedFlight(flight)}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all cursor-pointer block ${
                    active 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                      : 'bg-white border-slate-200 hover:border-slate-350 text-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className={`font-mono text-[10px] font-extrabold px-2 py-0.5 rounded leading-none ${
                      active ? 'bg-sky-500/15 text-sky-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {flight.flightNo}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider leading-none ${
                      active ? 'text-amber-400' : 'text-slate-505'
                    }`}>
                      {flight.class} Class
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <strong className="block text-sm font-black">{flight.fromCode}</strong>
                      <span className={`text-[10px] block ${active ? 'text-slate-300' : 'text-slate-455'}`}>{flight.from}</span>
                    </div>
                    <div className="h-0.5 border-t border-dashed w-12 border-slate-400"></div>
                    <div className="text-right">
                      <strong className="block text-sm font-black">{flight.toCode}</strong>
                      <span className={`text-[10px] block ${active ? 'text-slate-300' : 'text-slate-455'}`}>{flight.to}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Cabin Seat Arrangement Block Editor (Column Span 7) */}
        <div className="lg:col-span-7">
          {selectedFlight ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              {/* Header and statistics log */}
              <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-slate-150">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Interactive Cabin Configurator ({selectedFlight.flightNo})
                  </h3>
                  <p className="text-[11px] text-slate-455">
                    Click seats to toggle blocked/accessible statuses instantly.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleResetSeats}
                  className="px-3.5 py-2 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Clear Customs Blockages ({blockedSeats.length})
                </button>
              </div>

              {/* Grid map with Fuselage visual cues */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 relative overflow-hidden border border-slate-900 max-w-sm mx-auto">
                
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>

                {/* Simulated Cockpit Nose */}
                <div className="max-w-xs mx-auto text-center mb-6 relative">
                  <div className="w-14 h-6 bg-slate-900 border-t-4 border-sky-500/20 rounded-t-full mx-auto"></div>
                  <span className="text-[8px] font-mono tracking-widest text-slate-500 block uppercase mt-1">CABIN NOSE</span>
                </div>

                {/* Grid framework */}
                <div className="relative border-l-2 border-r-2 border-slate-800 px-4 py-6 rounded-[30px] bg-slate-950/20">
                  
                  {/* Columns headers label */}
                  <div className="grid grid-cols-7 gap-2.5 mb-3 text-center text-[10px] font-mono text-slate-500 font-extrabold pb-2 border-b border-slate-800/50">
                    <div>A</div>
                    <div>B</div>
                    <div>C</div>
                    <div className="text-[7px] text-sky-450/60 font-semibold self-center">Aisle</div>
                    <div>D</div>
                    <div>E</div>
                    <div>F</div>
                  </div>

                  {/* Seat matrix loops */}
                  <div className="space-y-3 font-mono">
                    {rows.map((rowNum) => (
                      <div key={`manage-row-${rowNum}`} className="grid grid-cols-7 gap-2.5 items-center">
                        
                        {/* Column Letters Left group */}
                        {['A', 'B', 'C'].map((col) => {
                          const seatId = `${rowNum}${col}`;
                          const isBlocked = blockedSeats.includes(seatId);
                          const mockInfo = MOCK_30_SEATS.find(s => s.id === seatId);
                          
                          return (
                            <button
                              key={`manage-seat-${seatId}`}
                              onClick={() => handleToggleBlockSeat(seatId)}
                              type="button"
                              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[9px] font-bold border transition-all cursor-pointer ${
                                isBlocked
                                  ? 'bg-red-500/20 border-red-500 text-red-400 shadow-inner'
                                  : mockInfo?.isOccupied
                                    ? 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
                                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-sky-400'
                              }`}
                              title={`Seat ${seatId} (${isBlocked ? 'Blocked' : 'Free'})`}
                            >
                              <span>{seatId}</span>
                              {isBlocked && <EyeOff className="w-2.5 h-2.5 text-red-400 mt-0.5" />}
                            </button>
                          );
                        })}

                        {/* Middle dynamic Aisle indicator */}
                        <div className="text-[10px] text-slate-650 font-bold font-sans text-center">
                          {rowNum}
                        </div>

                        {/* Column Letters Right group */}
                        {['D', 'E', 'F'].map((col) => {
                          const seatId = `${rowNum}${col}`;
                          const isBlocked = blockedSeats.includes(seatId);
                          const mockInfo = MOCK_30_SEATS.find(s => s.id === seatId);
                          
                          return (
                            <button
                              key={`manage-seat-${seatId}`}
                              onClick={() => handleToggleBlockSeat(seatId)}
                              type="button"
                              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[9px] font-bold border transition-all cursor-pointer ${
                                isBlocked
                                  ? 'bg-red-500/20 border-red-500 text-red-400 shadow-inner'
                                  : mockInfo?.isOccupied
                                    ? 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
                                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-sky-400'
                              }`}
                              title={`Seat ${seatId} (${isBlocked ? 'Blocked' : 'Free'})`}
                            >
                              <span>{seatId}</span>
                              {isBlocked && <EyeOff className="w-2.5 h-2.5 text-red-400 mt-0.5" />}
                            </button>
                          );
                        })}

                      </div>
                    ))}
                  </div>

                </div>

                {/* Decorative map legends row */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-4 border-t border-slate-900 text-[10px] text-slate-400 font-medium font-sans">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 bg-slate-900 border border-slate-700 rounded-sm"></div>
                    <span>Available Selection</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 bg-red-500/20 border border-red-500 rounded-sm"></div>
                    <span className="text-red-450 font-semibold">Custom Blocked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 bg-slate-800/45 border border-slate-800 rounded-sm"></div>
                    <span>Statically Booked</span>
                  </div>
                </div>

              </div>
              
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold">Block Row Management Policy:</strong>
                  <span className="text-[11px] block mt-0.5">
                    Seats configured as "Blocked" here cannot be checked in on passenger pages. Perfect and convenient for reserving Exit Rows or setting exclusive VIP space.
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 border-2 border-dashed border-slate-300 rounded-3xl text-center text-xs text-slate-400 italic">
              Please register or select a flight route from the list first.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
