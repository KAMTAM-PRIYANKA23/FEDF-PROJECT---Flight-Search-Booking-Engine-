import React from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Plane, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Coffee, 
  Wifi, 
  Briefcase, 
  X, 
  ChevronRight, 
  Compass, 
  DollarSign, 
  Info,
  ArrowLeft
} from 'lucide-react';
import { getSavedFlights } from '../utils/flightStorage';

// ==========================================
// CENTRALIZED MOCK FLIGHT DATA REPLICATOR
// ==========================================

export interface Flight {
  id: string;
  airline: string;
  flightNo: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  class: 'Economy' | 'Business' | 'First';
}

const MOCK_FLIGHTS_DATABASE: Flight[] = [
  { id: 'f1', airline: 'SkyWings Premium', flightNo: 'SW-101', from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', departure: '08:00 AM', arrival: '08:20 PM', duration: '7h 20m', price: 450, class: 'Economy' },
  { id: 'f2', airline: 'SkyWings Shuttle', flightNo: 'SW-102', from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', departure: '02:30 PM', arrival: '02:50 AM', duration: '7h 20m', price: 390, class: 'Economy' },
  { id: 'f3', airline: 'SkyWings Royale', flightNo: 'SW-103', from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', departure: '10:00 PM', arrival: '10:20 AM', duration: '7h 20m', price: 950, class: 'Business' },
  { id: 'f4', airline: 'SkyWings Express', flightNo: 'SW-201', from: 'London', fromCode: 'LHR', to: 'Paris', toCode: 'CDG', departure: '09:15 AM', arrival: '10:30 AM', duration: '1h 15m', price: 85, class: 'Economy' },
  { id: 'f5', airline: 'SkyWings Express', flightNo: 'SW-202', from: 'London', fromCode: 'LHR', to: 'Paris', toCode: 'CDG', departure: '04:00 PM', arrival: '05:15 PM', duration: '1h 15m', price: 195, class: 'Business' },
  { id: 'f6', airline: 'SkyWings Premium', flightNo: 'SW-301', from: 'Dubai', fromCode: 'DXB', to: 'Mumbai', toCode: 'BOM', departure: '03:15 AM', arrival: '08:00 AM', duration: '3h 15m', price: 210, class: 'Economy' },
  { id: 'f7', airline: 'SkyWings Royale', flightNo: 'SW-302', from: 'Dubai', fromCode: 'DXB', to: 'Mumbai', toCode: 'BOM', departure: '09:45 PM', arrival: '02:30 AM', duration: '3h 15m', price: 420, class: 'Business' },
  { id: 'f8', airline: 'SkyWings Shuttle', flightNo: 'SW-401', from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', departure: '11:30 PM', arrival: '07:00 AM', duration: '6h 30m', price: 320, class: 'Economy' },
  { id: 'f9', airline: 'SkyWings Premium', flightNo: 'SW-402', from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', departure: '08:15 AM', arrival: '03:45 PM', duration: '6h 30m', price: 750, class: 'Business' },
  { id: 'f10', airline: 'SkyWings Emperor', flightNo: 'SW-403', from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', departure: '01:00 PM', arrival: '08:30 PM', duration: '6h 30m', price: 1550, class: 'First' },
  { id: 'f11', airline: 'SkyWings Premium', flightNo: 'SW-501', from: 'Tokyo', fromCode: 'NRT', to: 'Sydney', toCode: 'SYD', departure: '10:15 PM', arrival: '08:45 AM', duration: '9h 30m', price: 580, class: 'Economy' },
  { id: 'f12', airline: 'SkyWings Shuttle', flightNo: 'SW-601', from: 'Mumbai', fromCode: 'BOM', to: 'Singapore', toCode: 'SIN', departure: '01:05 PM', arrival: '09:15 PM', duration: '5h 40m', price: 190, class: 'Economy' }
];

export default function FlightDetails() {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load contextual query strings
  const travelers = searchParams.get('travelers') || '1';
  const travelersCount = parseInt(travelers, 10);
  const cabinClass = searchParams.get('class') || 'Economy';

  // 1. Find matching flight
  const flight = (getSavedFlights() as any[]).find(f => f.id === flightId);

  // If no flight found, deliver clean fallback
  if (!flight) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white rounded-3xl p-8 max-w-md border border-slate-200 text-center shadow-lg">
          <Plane className="w-12 h-12 text-slate-300 mx-auto mb-4 rotate-45" />
          <h3 className="text-xl font-bold text-slate-900">Flight Not Found</h3>
          <p className="text-sm text-slate-500 mt-2">
            The requested flight route details could not be loaded from our standard mock catalog.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-5 py-2.5 bg-sky-600 hover:bg-sky-505 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Cost break downs formulas
  const baseFare = flight.price * travelersCount;
  const taxesFee = Math.round(baseFare * 0.12);
  const totalAmount = baseFare + taxesFee;

  const handleProceedToBook = () => {
    // Navigate straight to booking pathway passing queries safely
    navigate(`/book/${flight.id}?travelers=${travelersCount}&class=${cabinClass}`);
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation back helper */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Search Results
          </button>
          
          <span className="text-[10px] font-mono bg-sky-100 text-sky-800 font-bold px-3 py-1 rounded-full border border-sky-200 uppercase tracking-wider">
            Flight Blueprint View
          </span>
        </div>

        {/* Outer Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Details Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Header Card */}
            <motion.div 
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 text-white relative">
                {/* Secure Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] font-mono text-slate-350">Verified FlyRoute</span>
                </div>

                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded border border-amber-400/25">
                  {flight.class} Class Room
                </span>

                <h2 className="text-2xl font-extrabold mt-4 mb-2">{flight.airline}</h2>
                <div className="flex items-center gap-3 text-xs text-sky-200 font-mono">
                  <span>Flight No: <strong className="text-white">{flight.flightNo}</strong></span>
                  <span>•</span>
                  <span>Aircraft: Boeing 787 Dreamliner</span>
                </div>
              </div>

              {/* Flight Timeline Route Tracker */}
              <div className="p-6 sm:p-8 space-y-8">
                
                {/* The Timeline Diagram */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
                  
                  {/* Source Block */}
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Origin</span>
                    <h3 className="text-2xl font-extrabold text-slate-900">{flight.departure}</h3>
                    <p className="text-xs font-mono text-slate-500 font-extrabold">{flight.from} ({flight.fromCode})</p>
                    <p className="text-[10px] text-slate-400">JFK Terminal 8 Lounge Access Available</p>
                  </div>

                  {/* Middleware Visual Track */}
                  <div className="flex-1 flex flex-col items-center py-2 min-w-[120px] w-full sm:w-auto">
                    <span className="text-[11px] font-extrabold text-sky-600 font-mono tracking-wide mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {flight.duration}
                    </span>
                    
                    <div className="w-full flex items-center relative py-2">
                      <div className="w-2.5 h-2.5 bg-slate-300 rounded-full border-2 border-white shadow-sm"></div>
                      <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                      <Plane className="w-5 h-5 text-sky-600 rotate-90 shrink-0 mx-2 drop-shadow-[0_2px_4px_rgba(2,132,199,0.3)]" />
                      <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                      <div className="w-2.5 h-2.5 bg-sky-600 rounded-full border-2 border-white shadow-sm"></div>
                    </div>

                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      Direct Non-Stop
                    </span>
                  </div>

                  {/* Destination Block */}
                  <div className="space-y-1 text-left sm:text-right z-10">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Arrive</span>
                    <h3 className="text-2xl font-extrabold text-slate-900">{flight.arrival}</h3>
                    <p className="text-xs font-mono text-slate-500 font-extrabold">{flight.to} ({flight.toCode})</p>
                    <p className="text-[10px] text-slate-400">LHR Terminal 5 Standard Arrival Gate</p>
                  </div>

                </div>

                {/* Technical metadata highlights helpful for Viva */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Stops Info</span>
                    <span className="font-extrabold text-slate-900 mt-0.5 block">0 Stops (Direct)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Bag Limit</span>
                    <span className="font-extrabold text-emerald-600 mt-0.5 block">Checked: 30kg Incl.</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Reschedule fee</span>
                    <span className="font-extrabold text-amber-600 mt-0.5 block">Mock $0 Change</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Cabin Carbon</span>
                    <span className="font-extrabold text-slate-900 mt-0.5 block">Standard Eco-Index</span>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Inflight Luxury Amenities section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/95 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-amber-500" />
                Featured Amenities Installed On Board
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your SkyWings flight experience features these hand-picked modern upgrades to maximize passenger comfort:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100/60 flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Premium Hot Meals</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Choose vegetarian or gourmet airline cuts before boarding.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100/60 flex items-start gap-3">
                  <Wifi className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Air Wi-Fi Stream</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Complimentary continuous high-speed messaging for students.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/60 flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Seat Power Outlets</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Standard Type-C USB dynamic fast chargers mounted in all seats.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Checkout pricing and decision container */}
          <div className="space-y-6">
            
            {/* Cost breakdown widget */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Fare Summary</span>
                <div className="flex items-baseline justify-between mt-1">
                  <h4 className="text-2xl font-extrabold text-slate-900">${totalAmount}</h4>
                  <span className="text-xs text-slate-400 font-mono font-semibold">USD / Clear Total</span>
                </div>
              </div>

              {/* Standard math breakdown list */}
              <div className="space-y-3.5 text-xs">
                
                <div className="flex justify-between text-slate-500">
                  <span>Base Flight ticket class ({flight.class})</span>
                  <span className="font-mono text-slate-800 font-bold">${flight.price} × {travelersCount}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Taxes & Mock Regulatory Fees (12%)</span>
                  <span className="font-mono text-slate-800 font-bold">+${taxesFee}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Student presentation trial discount</span>
                  <span className="text-emerald-600 font-bold font-mono">-$0 Free Demo</span>
                </div>

                <div className="border-t border-slate-100 pt-3.5 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Grand Total Payment Due</span>
                  <span className="font-mono text-sky-600">${totalAmount}</span>
                </div>

              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 flex items-start gap-2.5 text-[11px] text-slate-500 leading-relaxed">
                <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  No real physical cards are billed during this college academic offline presentation.
                </div>
              </div>

              {/* CTA Book Now */}
              <button
                onClick={handleProceedToBook}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-550 active:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-md shadow-sky-600/20 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Proceed To Book Now
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

            {/* Interactive Flight Map Simulator Card  */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 relative overflow-hidden shadow-md">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
                <Compass className="w-48 h-48 animate-[spin_60s_linear_infinite]" />
              </div>

              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">Simulation Map Radar</span>
                <h5 className="font-bold text-slate-100 text-sm">SkyWings Live Flight Routing</h5>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Active mock telemetry pinging coordinates between <strong>{flight.fromCode}</strong> and <strong>{flight.toCode}</strong>. Global waypoint track secured on offline database structure.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-450 rounded-full animate-ping"></span>
                  <span className="text-[10px] font-mono text-slate-450 uppercase">Satellite link: steady</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
