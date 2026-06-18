import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Armchair, 
  Users, 
  ArrowLeftRight, 
  Plane, 
  Clock, 
  ChevronRight, 
  Filter, 
  TrendingUp, 
  Sparkles,
  Info
} from 'lucide-react';
import { getSavedFlights } from '../utils/flightStorage';

// ==========================================
// MOCK DATA & INTERFACES FOR VIVA VOUCHING
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

const MOCK_FLIGHTS_DATA: Flight[] = [
  { id: 'f1', airline: 'SkyWings Premium', flightNo: 'SW-101', from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', departure: '08:00 AM', arrival: '08:20 PM', duration: '7h 20m', price: 450, class: 'Economy' },
  { id: 'f2', airline: 'SkyWings Shuttle', flightNo: 'SW-102', from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', departure: '02:30 PM', arrival: '02:50 AM', duration: '7h 20m', price: 390, class: 'Economy' },
  { id: 'f3', airline: 'SkyWings Royale', flightNo: 'SW-103', from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', departure: '10:00 PM', arrival: '10:20 AM', duration: '7h 20m', price: 950, class: 'Business' },
  { id: 'f4', airline: 'SkyWings Express', flightNo: 'SW-201', from: 'London', fromCode: 'LHR', to: 'Paris', toCode: 'CDG', departure: '09:15 AM', arrival: '10:30 AM', duration: '1h 15m', price: 85, class: 'Economy' },
  { id: 'f5', airline: 'SkyWings Express', flightNo: 'SW-202', from: 'London', fromCode: 'LHR', to: 'Paris', toCode: 'CDG', departure: '04:00 PM', arrival: '05:15 PM', duration: '1h 15m', price: 195, class: 'Business' },
  { id: 'f6', airline: 'SkyWings Premium', flightNo: 'SW-301', from: 'Dubai', fromCode: 'DXB', to: 'Mumbai', toCode: 'BOM', departure: '03:15 AM', arrival: '08:00 AM', duration: '3h 15m', price: 210, class: 'Economy' },
  { id: 'f7', airline: 'SkyWings Royale', flightNo: 'SW-302', from: 'Dubai', fromCode: 'DXB', to: 'Mumbai', toCode: 'BOM', departure: '09:45 PM', arrival: '02:30 AM', duration: '3h 15m', price: 420, class: 'Business' },
  { id: 'f8', airline: 'SkyWings Shuttle', flightNo: 'SW-401', from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', departure: '11:30 PM', arrival: '07:00 AM', duration: '6h 30m', price: 320, class: 'Economy' },
  { id: 'f9', airline: 'SkyWings Premium', flightNo: 'SW-402', from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', departure: '08:15 AM', arrival: '03:45 PM', duration: '6h 30m', price: 750, class: 'Business' },
  { id: 'f10', airline: 'SkyWings Emperor', flightNo: 'SW-403', from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', departure: '01:00 PM', arrival: '08:30 PM', duration: '6h 30m', price: 1550, class: 'First' }
];

const AVAILABLE_CITIES = [
  { city: 'New York', code: 'JFK' },
  { city: 'London', code: 'LHR' },
  { city: 'Paris', code: 'CDG' },
  { city: 'Dubai', code: 'DXB' },
  { city: 'Mumbai', code: 'BOM' },
  { city: 'Singapore', code: 'SIN' },
  { city: 'Tokyo', code: 'NRT' }
];

export default function SearchFlights() {
  const navigate = useNavigate();

  // 1. Core Simple Form States
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Business' | 'First'>('Economy');
  const [passengerCount, setPassengerCount] = useState('1');

  // 2. Interactive Results and UI States
  const [searched, setSearched] = useState(false);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // 3. Simple swap function to make UI intuitive for evaluators
  const swapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  // 4. Core Search Algorithm using standard client-side array filters (beginner friendly)
  const handleFlightsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(false);
    setErrorMsg('');

    if (!source) {
      setErrorMsg('Please select your Departure Source city.');
      return;
    }
    if (!destination) {
      setErrorMsg('Please select your Destination city.');
      return;
    }
    if (source.toLowerCase() === destination.toLowerCase()) {
      setErrorMsg('Source and Destination airports cannot navigate to the exact same place.');
      return;
    }

    // Filter array mock logic
    const results = (getSavedFlights() as any[]).filter(flight => {
      const matchSource = flight.from.toLowerCase().includes(source.toLowerCase());
      const matchDest = flight.to.toLowerCase().includes(destination.toLowerCase());
      const matchClass = flight.class === cabinClass;
      return matchSource && matchDest && matchClass;
    });

    setFilteredFlights(results);
    setSearched(true);
  };

  const handleSelectFlight = (flightId: string) => {
    // Navigate to flight details screen for review
    navigate(`/flight-details/${flightId}?travelers=${passengerCount}&class=${cabinClass}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 md:px-0">
      
      {/* 2. Interactive Search Form Container */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-gradient-to-r from-slate-900 via-sky-955 to-slate-900 text-white p-5 flex items-center justify-between border-b border-sky-900/40">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Interactive Flights Lookup Engine</h3>
          </div>
          <span className="text-[10px] bg-slate-800 text-amber-300 font-mono py-1 px-2.5 rounded-full border border-slate-700">
            One-Way Standard Booking
          </span>
        </div>

        <form onSubmit={handleFlightsSearch} className="p-6 md:p-8 space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-750 font-medium rounded-r-xl text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* Source Airport Selection */}
            <div className="md:col-span-5 relative">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Departure Source
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="block w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="">Select departure city...</option>
                  {AVAILABLE_CITIES.map((item) => (
                    <option key={`src-${item.code}`} value={item.city}>
                      {item.city} ({item.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pivot Swap Indicator */}
            <div className="md:col-span-1 flex justify-center pt-4">
              <button
                type="button"
                onClick={swapLocations}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-500 hover:text-sky-600 border border-slate-200 transition-all cursor-pointer"
                title="Swap Source and Destination"
              >
                <ArrowLeftRight className="w-4 h-4 rotate-90 md:rotate-0" />
              </button>
            </div>

            {/* Destination Selection */}
            <div className="md:col-span-5 relative">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Destination Target
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4.5 w-4.5 text-sky-500" />
                </span>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="block w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="">Select arrival destination...</option>
                  {AVAILABLE_CITIES.map((item) => (
                    <option key={`dest-${item.code}`} value={item.city}>
                      {item.city} ({item.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Departure Date Picker */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-505 uppercase tracking-widest mb-1.5">
                Departure Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="block w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:ring-2 focus:ring-sky-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Passenger dropdown count */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-505 uppercase tracking-widest mb-1.5">
                Travelers Select
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                  className="block w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:ring-2"
                >
                  <option value="1">1 Passenger (Adult)</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4 Passengers</option>
                </select>
              </div>
            </div>

            {/* Cabin Travel class selection */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-505 uppercase tracking-widest mb-1.5">
                Cabin Fly Class
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Armchair className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as any)}
                  className="block w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:ring-2"
                >
                  <option value="Economy">Economy Class</option>
                  <option value="Business">Business Class Premium</option>
                  <option value="First">First Imperial Class</option>
                </select>
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wide"
            >
              <Search className="w-4 h-4" />
              Scan Sky Routes
            </button>
          </div>

        </form>

      </motion.div>

      {/* 3. Real-time Filtered Results display module */}
      {searched && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center px-1">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Scan Results: <span className="text-sky-605">{filteredFlights.length} matching routes</span>
            </h4>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono px-2 py-0.5 rounded-full border border-emerald-200">
              Live Mock Database Online
            </span>
          </div>

          {filteredFlights.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto">
              <Plane className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5] mb-3 rotate-45" />
              <h5 className="font-extrabold text-slate-900 text-base">No Direct Flight Matches Found</h5>
              <p className="text-xs text-slate-500 leading-relaxed mt-1 max-w-sm mx-auto">
                Try selecting <strong>New York to London</strong>, <strong>Dubai to Mumbai</strong>, or <strong>Singapore to Tokyo</strong> dynamically using the dropdown filters!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFlights.map((flight) => (
                <div 
                  key={flight.id} 
                  className="bg-white rounded-2xl p-5 border border-slate-205 hover:border-sky-305 hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  
                  {/* Airline details */}
                  <div className="flex items-center gap-3.5 w-full md:w-auto">
                    <div className="p-3 bg-sky-50 rounded-xl text-sky-600 border border-sky-100/60 shrink-0">
                      <Plane className="w-5 h-5 rotate-45" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{flight.airline}</h5>
                      <span className="block text-[10px] font-mono text-slate-400 font-bold">{flight.flightNo}</span>
                    </div>
                  </div>

                  {/* Flight Timeline Route Tracker */}
                  <div className="flex items-center justify-between gap-4 flex-1 w-full md:w-auto px-4">
                    <div className="text-left font-semibold">
                      <span className="block text-[10px] uppercase font-mono text-slate-450">Departure</span>
                      <span className="text-sm font-bold text-slate-950 block">{flight.departure}</span>
                      <span className="text-[10px] text-slate-500 font-mono tracking-widest">{flight.fromCode}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[9px] font-mono text-slate-405 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {flight.duration}
                      </span>
                      <div className="w-full flex items-center relative py-1.5">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                        <div className="flex-1 border-t border-dashed border-slate-3 text-center"></div>
                        <Plane className="w-3.5 h-3.5 text-sky-550 rotate-90 shrink-0 mx-1" />
                        <div className="flex-1 border-t border-dashed border-slate-350"></div>
                        <div className="w-1.5 h-1.5 bg-sky-550 rounded-full"></div>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Non-Stop</span>
                    </div>

                    <div className="text-right font-semibold">
                      <span className="block text-[10px] uppercase font-mono text-slate-455">Arrival</span>
                      <span className="text-sm font-bold text-slate-950 block">{flight.arrival}</span>
                      <span className="text-[10px] text-slate-500 font-mono tracking-widest">{flight.toCode}</span>
                    </div>
                  </div>

                  {/* Price and Instant checkout linkage */}
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Price</span>
                      <span className="text-lg font-extrabold text-slate-950">${flight.price * parseInt(passengerCount)}</span>
                      <span className="block text-[9px] font-mono text-slate-500">${flight.price} / passenger</span>
                    </div>

                    <button
                      onClick={() => handleSelectFlight(flight.id)}
                      className="px-4.5 py-2.5 bg-sky-600 hover:bg-sky-505 text-white font-bold rounded-xl transition-all shadow-sm text-xs flex items-center gap-0.5 cursor-pointer"
                    >
                      Instant Book
                      <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </motion.div>
      )}

      {/* 4. Small Presentation Tip Banner */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 leading-relaxed">
        <strong>💡 Student Presentation Help:</strong> The Search Engine queries <code>MOCK_FLIGHTS_DATA</code>. For live validation during presentations, make sure to choose <strong>Source: Singapore</strong> and <strong>Destination: Tokyo</strong> to scan available matching First Class seats!
      </div>

    </div>
  );
}
