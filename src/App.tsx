import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import SearchFlights from './components/SearchFlights';
import FlightDetails from './components/FlightDetails';
import SeatSelection from './components/SeatSelection';
import BookingSummary from './components/BookingSummary';
import Payment from './components/Payment';
import ETicket from './components/ETicket';
import Dashboard from './components/Dashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ManageFlights from './components/ManageFlights';
import ManageSeats from './components/ManageSeats';
import ViewBookings from './components/ViewBookings';
import { getSavedFlights, getSavedBookings, saveBookings } from './utils/flightStorage';
import { 
  Plane, 
  Calendar, 
  Users, 
  MapPin, 
  Search, 
  ChevronRight, 
  User, 
  Mail, 
  CreditCard, 
  Ticket, 
  CheckCircle, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  ArrowLeftRight, 
  Filter, 
  ArrowRight, 
  Armchair, 
  XCircle,
  Plus,
  Menu,
  X,
  Compass,
  Award,
  DollarSign
} from 'lucide-react';

// ==========================================
// 1. DATA STORES AND INTERFACES (MOCK DATA)
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

export interface Booking {
  bookingId: string;
  flight: Flight;
  passengerName: string;
  passengerAge: string;
  passengerEmail: string;
  passportNumber: string;
  seatNumber: string;
  extraBaggage: boolean;
  mealOption: string;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled';
}

const POPULAR_DESTINATIONS = [
  { name: 'London', code: 'LHR', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&q=80&w=400', tagline: 'The royal British experience', price: 450 },
  { name: 'Tokyo', code: 'NRT', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400', tagline: 'Future meets timeless legacy', price: 750 },
  { name: 'Dubai', code: 'DXB', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=400', tagline: 'Luxe oasis in golden sands', price: 420 },
  { name: 'Singapore', code: 'SIN', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=400', tagline: 'Sleek metropolitan paradise', price: 320 }
];

const MOCK_FLIGHTS: Flight[] = [
  // New York (JFK) -> London (LHR)
  { id: 'f1', airline: 'SkyWings Premium', flightNo: 'SW-101', from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', departure: '08:00 AM', arrival: '08:20 PM', duration: '7h 20m', price: 450, class: 'Economy' },
  { id: 'f2', airline: 'SkyWings Shuttle', flightNo: 'SW-102', from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', departure: '02:30 PM', arrival: '02:50 AM', duration: '7h 20m', price: 390, class: 'Economy' },
  { id: 'f3', airline: 'SkyWings Royale', flightNo: 'SW-103', from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', departure: '10:00 PM', arrival: '10:20 AM', duration: '7h 20m', price: 950, class: 'Business' },
  
  // London (LHR) -> Paris (CDG)
  { id: 'f4', airline: 'SkyWings Express', flightNo: 'SW-201', from: 'London', fromCode: 'LHR', to: 'Paris', toCode: 'CDG', departure: '09:15 AM', arrival: '10:30 AM', duration: '1h 15m', price: 85, class: 'Economy' },
  { id: 'f5', airline: 'SkyWings Express', flightNo: 'SW-202', from: 'London', fromCode: 'LHR', to: 'Paris', toCode: 'CDG', departure: '04:00 PM', arrival: '05:15 PM', duration: '1h 15m', price: 195, class: 'Business' },
  
  // Dubai (DXB) -> Mumbai (BOM)
  { id: 'f6', airline: 'SkyWings Premium', flightNo: 'SW-301', from: 'Dubai', fromCode: 'DXB', to: 'Mumbai', toCode: 'BOM', departure: '03:15 AM', arrival: '08:00 AM', duration: '3h 15m', price: 210, class: 'Economy' },
  { id: 'f7', airline: 'SkyWings Royale', flightNo: 'SW-302', from: 'Dubai', fromCode: 'DXB', to: 'Mumbai', toCode: 'BOM', departure: '09:45 PM', arrival: '02:30 AM', duration: '3h 15m', price: 420, class: 'Business' },
  
  // Singapore (SIN) -> Tokyo (NRT)
  { id: 'f8', airline: 'SkyWings Shuttle', flightNo: 'SW-401', from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', departure: '11:30 PM', arrival: '07:00 AM', duration: '6h 30m', price: 320, class: 'Economy' },
  { id: 'f9', airline: 'SkyWings Premium', flightNo: 'SW-402', from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', departure: '08:15 AM', arrival: '03:45 PM', duration: '6h 30m', price: 750, class: 'Business' },
  { id: 'f10', airline: 'SkyWings Emperor', flightNo: 'SW-403', from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', departure: '01:00 PM', arrival: '08:30 PM', duration: '6h 30m', price: 1550, class: 'First' },
  
  // Tokyo (NRT) -> Sydney (SYD)
  { id: 'f11', airline: 'SkyWings Premium', flightNo: 'SW-501', from: 'Tokyo', fromCode: 'NRT', to: 'Sydney', toCode: 'SYD', departure: '10:15 PM', arrival: '08:45 AM', duration: '9h 30m', price: 580, class: 'Economy' },
  
  // Mumbai (BOM) -> Singapore (SIN)
  { id: 'f12', airline: 'SkyWings Shuttle', flightNo: 'SW-601', from: 'Mumbai', fromCode: 'BOM', to: 'Singapore', toCode: 'SIN', departure: '01:05 PM', arrival: '09:15 PM', duration: '5h 40m', price: 190, class: 'Economy' }
];

const AVAILABLE_AIRPORTS = [
  { name: 'New York (JFK)', city: 'New York', code: 'JFK' },
  { name: 'London Heathrow (LHR)', city: 'London', code: 'LHR' },
  { name: 'Paris Charles de Gaulle (CDG)', city: 'Paris', code: 'CDG' },
  { name: 'Dubai Intl (DXB)', city: 'Dubai', code: 'DXB' },
  { name: 'Mumbai Chhatrapati (BOM)', city: 'Mumbai', code: 'BOM' },
  { name: 'Singapore Changi (SIN)', city: 'Singapore', code: 'SIN' },
  { name: 'Tokyo Narita (NRT)', city: 'Tokyo', code: 'NRT' },
  { name: 'Sydney Kingsford (SYD)', city: 'Sydney', code: 'SYD' }
];

// Managed dynamic localStorage storage functions imported from flightStorage utility


// ==========================================
// 2. LAYOUT COMPONENT (NAVBAR & FOOTER)
// ==========================================

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Integrated Modular Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Integrated Modular Footer */}
      <Footer />
    </div>
  );
}


// ==========================================
// 3. PAGE COMPONENT: HOME / SEARCH ENGINE
// ==========================================

function HomePage() {
  return (
    <div className="relative pb-16">
      
      {/* Decorative Brand Hero Header banner with animated airplane */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 text-white py-20 px-4 text-center">
        {/* Sky Ambient Stars & Clouds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/40 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Animated Airplane Track */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-sky-500/20 pointer-events-none">
          <motion.div 
            className="absolute -top-3 left-0 select-none pointer-events-none"
            animate={{ 
              x: ['-50px', '110vw'],
              y: [0, -15, 5, -20, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="flex items-center gap-2">
              <Plane className="w-7 h-7 text-amber-400 rotate-45 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <div className="h-0.5 w-16 bg-gradient-to-l from-amber-400/50 to-transparent"></div>
            </div>
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto z-10 animate-fade-in">
          <span className="px-3 py-1 bg-sky-500/15 text-sky-300 font-mono text-xs rounded-full border border-sky-500/30 uppercase tracking-widest inline-flex items-center gap-1.5 justify-center mb-4">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping"></span>
            Fly Premium, Save Smart
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Elevate Your Travel with Sky<span className="text-amber-400">Wings</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Exquisite sky flight reservations with responsive matching and interactive seat configurations. Search mock fly maps below.
          </p>
        </div>
      </div>

      {/* Interactive Search Portal Component */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <SearchFlights />
      </div>

      {/* Featured Travel Value propositions */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Why Academic Evaluators Love SkyWings</h3>
          <p className="text-slate-500 text-sm mt-1">Key functional and code patterns demonstrated in this template</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start gap-3">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-500">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">Router State Management</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Demonstrates URL Search Params parsing to deliver fully reactive dynamic page states. State-bound router endpoints can be verified in real time.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start gap-3">
            <div className="p-3 bg-sky-50 rounded-lg text-sky-505">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">LocalStorage CRUD Sync</h4>
            <p className="text-xs text-slate-505 leading-relaxed">
              Simulates authentic database operations completely local to the visitor's client machine. Seamless state updates on ticket cancellation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">Responsive UI Mocking</h4>
            <p className="text-xs text-slate-505 leading-relaxed">
              Elegant multi-step booking pipelines with seat choosing simulators, pricing breakdowns, baggage declarations, and fully structured form fields.
            </p>
          </div>
        </div>
      </div>

      {/* Premium On-board Services Section */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Premium On-Board Services</h3>
          <p className="text-slate-505 text-sm mt-1">Five-star luxury amenities with authentic local mock features</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-xs hover:shadow-md transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-lg group-hover:bg-orange-500 group-hover:text-white transition-all">
              🍽️
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Gourmet Catering</h4>
            <p className="text-xs text-slate-550 leading-relaxed">
              Exquisite multi-cuisine meals and complimentary refreshments served hot at 30,000 feet.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-xs hover:shadow-md transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-550 flex items-center justify-center font-bold text-lg group-hover:bg-purple-500 group-hover:text-white transition-all">
              💼
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Priority Baggage</h4>
            <p className="text-xs text-slate-550 leading-relaxed">
              Hassle-free heavy baggage options with standard tracked checked items secured under priority labels.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-xs hover:shadow-md transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-lg group-hover:bg-pink-500 group-hover:text-white transition-all">
              🎬
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Sky Studio Media</h4>
            <p className="text-xs text-slate-550 leading-relaxed">
              Unlimited high-speed 4K movies, interactive 3D travel maps, and direct audio channels in every cabin seat.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-xs hover:shadow-md transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-lg group-hover:bg-cyan-500 group-hover:text-white transition-all">
              🌐
            </div>
            <h4 className="font-bold text-slate-900 text-sm">True Satellite Wi-Fi</h4>
            <p className="text-xs text-slate-550 leading-relaxed">
              Stay connected high above with our fast satellite high-bandwidth complimentary messaging network.
            </p>
          </div>
        </div>
      </div>

      {/* Stunning Destinations Carousel Cards */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-600" />
          Popular Routes & Special Pricing
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div key={dest.name} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200/60 transition-all flex flex-col">
              <div className="relative h-40">
                <img 
                  referrerPolicy="no-referrer"
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 py-1 px-2.5 bg-slate-950/85 backdrop-blur-xs text-amber-400 font-mono text-xs font-bold rounded-lg leading-none border border-slate-800">
                  From ${dest.price}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{dest.name} ({dest.code})</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dest.tagline}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Direct Route</span>
                  <button 
                    onClick={() => {
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-0.5"
                  >
                    Explore
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


// ==========================================
// 4. PAGE COMPONENT: FLIGHTS SEARCH RESULTS
// ==========================================

function FlightsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromQuery = searchParams.get('from') || '';
  const toQuery = searchParams.get('to') || '';
  const dateQuery = searchParams.get('date') || '';
  const travelersQuery = searchParams.get('travelers') || '1';
  const classQuery = searchParams.get('class') || 'Economy';

  // Filters state
  const [airlineFilter, setAirlineFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(1600);
  const [sortBy, setSortBy] = useState('price-low');

  // Filter flights matching Search Query
  const matchesSearch = (flight: Flight) => {
    const sFrom = fromQuery.toLowerCase().trim();
    const sTo = toQuery.toLowerCase().trim();
    
    // If no search query, return everything
    if (!sFrom && !sTo) return true;

    return (
      flight.from.toLowerCase().includes(sFrom) &&
      flight.to.toLowerCase().includes(sTo) &&
      flight.class.toLowerCase() === classQuery.toLowerCase()
    );
  };

  const filteredFlights = getSavedFlights().filter((flight) => {
    const queryMatch = matchesSearch(flight);
    const airlineMatch = airlineFilter ? flight.airline === airlineFilter : true;
    const priceMatch = flight.price <= maxPrice;
    return queryMatch && airlineMatch && priceMatch;
  });

  // Sort logic
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'duration') {
      const aMin = parseInt(a.duration.split('h')[0]) * 60 + (parseInt(a.duration.split('h')[1]?.replace('m', '')) || 0);
      const bMin = parseInt(b.duration.split('h')[0]) * 60 + (parseInt(b.duration.split('h')[1]?.replace('m', '')) || 0);
      return aMin - bMin;
    }
    return 0;
  });

  const uniqueAirlines = Array.from(new Set(getSavedFlights().map(f => f.airline)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top indicator of active search */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-850">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Search Itinerary Details</span>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-lg font-bold">
            <span className="text-sky-400">{fromQuery || 'Anywhere'}</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-sky-400">{toQuery || 'Anywhere'}</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-sm font-medium text-slate-300 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-amber-400" />
              {dateQuery || 'Flexible'}
            </span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-sm font-medium text-slate-300 flex items-center gap-1">
              <Users className="w-4 h-4 text-emerald-400" />
              {travelersQuery} Traveler(s)
            </span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-xs font-mono uppercase bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
              {classQuery}
            </span>
          </div>
        </div>
        <Link 
          to="/" 
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700"
        >
          Modify Selection
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs h-fit">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Filter className="w-4.5 h-4.5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm">Refine Flight Search</h3>
          </div>

          {/* Sort selection */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Sort Options
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 font-medium cursor-pointer"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Travel Time: Shortest</option>
            </select>
          </div>

          {/* Filter by Airline */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Airlines Fleet
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-755 hover:text-slate-900">
                <input
                  type="radio"
                  name="airline"
                  checked={airlineFilter === ''}
                  onChange={() => setAirlineFilter('')}
                  className="w-4 h-4 text-sky-600 bg-slate-100 border-slate-300 focus:ring-sky-500"
                />
                All Carriers
              </label>
              {uniqueAirlines.map((airline) => (
                <label key={airline} className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-755 hover:text-slate-900">
                  <input
                    type="radio"
                    name="airline"
                    checked={airlineFilter === airline}
                    onChange={() => setAirlineFilter(airline)}
                    className="w-4 h-4 text-sky-600 bg-slate-100 border-slate-300 focus:ring-sky-500"
                  />
                  {airline}
                </label>
              ))}
            </div>
          </div>

          {/* Cost Slider */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Max Flight Cost
              </label>
              <span className="text-xs font-mono font-bold text-sky-600">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="2200"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>$50</span>
              <span>$1100</span>
              <span>$2200</span>
            </div>
          </div>

        </div>

        {/* Right Flight Offers List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-bold text-slate-900">
              Matches Found: <span className="text-sky-600">{sortedFlights.length} flights</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time matching active</span>
          </div>

          {sortedFlights.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
              <Plane className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5] mb-4 rotate-45" />
              <h4 className="text-lg font-bold text-slate-900">No Matching Routes Flight Offers Found</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto leading-relaxed">
                Try selecting alternative destinations or adjust filters. Standard mock datasets match JFK to LHR, SIN to NRT, DXB to BOM, BOM to SIN, and CDG routes.
              </p>
              <button 
                onClick={() => {
                  setAirlineFilter('');
                  setMaxPrice(2200);
                }}
                className="mt-4 px-4 py-2 bg-slate-100 font-bold hover:bg-slate-200 text-xs text-slate-700 rounded-lg border border-slate-200"
              >
                Clear Active Filters
              </button>
            </div>
          ) : (
            sortedFlights.map((flight) => (
              <div 
                key={flight.id} 
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-6"
              >
                {/* Airline designator */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="p-3 bg-sky-50 rounded-xl text-sky-600 border border-sky-100">
                    <Plane className="w-5 h-5 rotate-45" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-sm leading-tight">{flight.airline}</h4>
                    <span className="text-xs font-mono text-slate-400 font-bold">{flight.flightNo}</span>
                  </div>
                </div>

                {/* Direct flight duration visualizer bar */}
                <div className="flex items-center justify-between gap-4 flex-1 w-full md:w-auto px-4">
                  <div className="text-right">
                    <h5 className="font-bold text-base text-slate-900">{flight.departure}</h5>
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase">{flight.fromCode}</span>
                  </div>
                  
                  {/* Timeline progress line */}
                  <div className="flex-1 max-w-xs relative flex flex-col items-center">
                    <span className="text-[10px] font-mono font-semibold text-slate-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {flight.duration}
                    </span>
                    <div className="w-full flex items-center relative py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-450"></div>
                      <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                      <Plane className="w-4 h-4 text-sky-600 rotate-90 mx-1 shrink-0" />
                      <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-600"></div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none mt-1">Non-Stop</span>
                  </div>

                  <div>
                    <h5 className="font-bold text-base text-slate-900">{flight.arrival}</h5>
                    <span className="text-xs font-mono text-slate-505 font-bold uppercase">{flight.toCode}</span>
                  </div>
                </div>

                {/* Price and Action Card wrapper */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Gross Cost</span>
                    <span className="text-xl font-extrabold text-slate-950">${flight.price * parseInt(travelersQuery)}</span>
                    <span className="block text-[9px] text-slate-500 font-mono mt-0.5">${flight.price} per seat</span>
                  </div>

                  <button
                    onClick={() => navigate(`/flight-details/${flight.id}?travelers=${travelersQuery}&class=${classQuery}`)}
                    className="px-5 py-3 bg-sky-600 hover:bg-sky-505 text-white font-bold rounded-xl transition-all shadow-md shadow-sky-600/20 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    Select Flight
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}


// ==========================================
// 5. PAGE COMPONENT: FLIGHT CHECKOUT FORM
// ==========================================

function CheckoutPage() {
  const { flightId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const travelersCount = parseInt(searchParams.get('travelers') || '1');
  const selectedClass = searchParams.get('class') || 'Economy';

  // Find targeted flight details
  const flight = getSavedFlights().find(f => f.id === flightId);

  // Guest inputs state
  const [passengerName, setPassengerName] = useState('');
  const [passengerAge, setPassengerAge] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [seatPreference, setSeatPreference] = useState('Window');
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [extraBaggage, setExtraBaggage] = useState(false);
  const [mealOption, setMealOption] = useState('Standard Hot Meal');

  // Field error state triggers
  const [errorMsg, setErrorMsg] = useState('');

  if (!flight) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Flight Route Unresolved</h3>
        <p className="text-slate-500 text-sm mt-1">Please selection valid flights from search interface.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-sky-600 text-white font-bold rounded-xl text-xs">Back Home</Link>
      </div>
    );
  }

  // Calculated extra cost options
  const baseCost = flight.price * travelersCount;
  const baggageCostExtra = extraBaggage ? 35 : 0;
  const taxCost = Math.round(baseCost * 0.08); // 8% mock airport fees
  const totalCostCombined = baseCost + baggageCostExtra + taxCost;

  const validatePassengerDetails = (): boolean => {
    if (!passengerName.trim()) {
      setErrorMsg('Passenger first and last name is mandatory.');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return false;
    }
    const ageNum = Number(passengerAge);
    if (!passengerAge.trim() || isNaN(ageNum) || ageNum <= 0 || ageNum > 115) {
      setErrorMsg('Fill in a valid passenger age.');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return false;
    }
    if (!passengerEmail.trim() || !passengerEmail.includes('@')) {
      setErrorMsg('Input a valid communication electronic mail address.');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return false;
    }
    if (!passportNumber.trim()) {
      setErrorMsg('Passport details are required for international custom validation.');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return false;
    }
    if (selectedSeatIds.length < travelersCount) {
      setErrorMsg(`Please select exactly ${travelersCount} seat(s) from the interactive seat map.`);
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleBookingSuccess = (cardNumberUsed: string) => {
    const generatedPnr = 'SW' + Math.floor(100000 + Math.random() * 900000).toString() + 'X';
    const newBooking: Booking = {
      bookingId: generatedPnr,
      flight: { ...flight, class: selectedClass as any },
      passengerName,
      passengerAge,
      passengerEmail,
      passportNumber,
      seatNumber: selectedSeatIds.join(', '),
      extraBaggage,
      mealOption,
      bookingDate: new Date().toLocaleDateString(),
      status: 'Confirmed'
    };

    // Push to LocalStorage repository
    const currentRecords = getSavedBookings();
    currentRecords.push(newBooking);
    saveBookings(currentRecords);

    navigate(`/success/${generatedPnr}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Interactive Checkout Inputs container */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600" />
              Passenger Information
            </h3>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold mb-6">
                {errorMsg}
              </div>
            )}

            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Passenger's Full Name (As in Passport)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4.5 w-4.5 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyankan Reddy"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Email Address (For Boarding Pass)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4.5 w-4.5 text-slate-400" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="e.g. kamtampriyankareddy@gmail.com"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 text-xs"
                    />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-505 uppercase tracking-widest mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Input age"
                    min="1"
                    max="110"
                    value={passengerAge}
                    onChange={(e) => setPassengerAge(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-505 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-505 uppercase tracking-widest mb-1.5">
                    Passport / Travel ID Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IND92840P"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-505 text-xs"
                  />
                </div>

              </div>

              {/* Preferences section */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-t border-slate-100 pt-4 mb-3">
                  Travel & Seat Comfort Preferences
                </h4>
                
                {/* Brand new interactive Seat Map selection block */}
                <div className="mb-6">
                  <SeatSelection 
                    travelersCount={travelersCount}
                    cabinClass={selectedClass}
                    selectedSeats={selectedSeatIds}
                    onChange={(seats) => setSelectedSeatIds(seats)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Meal Selection
                    </label>
                    <select
                      value={mealOption}
                      onChange={(e) => setMealOption(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:ring-2"
                    >
                      <option value="Standard Hot Meal">Standard Hot Meal</option>
                      <option value="Vegetarian Asian Meal">Vegetarian Asian Meal</option>
                      <option value="Gluten Free Low Cal">Gluten Free Low Cal</option>
                      <option value="No Gourmet Dining">No Dining Requested</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={extraBaggage}
                        onChange={(e) => setExtraBaggage(e.target.checked)}
                        className="w-4.5 h-4.5 text-sky-600 bg-slate-50 rounded border-slate-300 focus:ring-sky-505"
                      />
                      Add Extra Luggage Bag (+ $35)
                    </label>
                  </div>

                </div>
              </div>

              {/* Symmetrical Mock payment */}
              <div className="border-t border-slate-100 pt-6">
                <Payment 
                  totalAmount={totalCostCombined}
                  flightAirline={flight.airline}
                  flightNo={flight.flightNo}
                  onBeforeSubmit={validatePassengerDetails}
                  onSuccess={handleBookingSuccess}
                />
              </div>

            </div>

          </div>
        </div>

        {/* Right Cost Summary Layout block */}
        <div className="space-y-6">
          <BookingSummary
            passenger={{
              name: passengerName,
              age: passengerAge,
              email: passengerEmail,
              passportNumber: passportNumber,
              mealOption: mealOption,
              extraBaggage: extraBaggage
            }}
            flight={{
              airline: flight.airline,
              flightNo: flight.flightNo,
              from: flight.from,
              fromCode: flight.fromCode,
              to: flight.to,
              toCode: flight.toCode,
              departure: flight.departure,
              arrival: flight.arrival,
              duration: flight.duration,
              price: flight.price,
              class: selectedClass
            }}
            selectedSeats={selectedSeatIds}
            totalAmount={totalCostCombined}
            baseFare={baseCost}
            taxesAmount={taxCost}
            baggageAmount={baggageCostExtra}
          />

          <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-450" />
              Viva Preparation Notes
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-400">
              <li>Form validations check inputs and enforce non-empty patterns manually.</li>
              <li>State transitions are managed securely through functional standard hooks.</li>
              <li>Calculations adapt instantly according to passenger luggage selections dynamically.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}


// ==========================================
// 6. PAGE COMPONENT: BOARDING PASS CONFIRMATION
// ==========================================

function ConfirmationPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const list = getSavedBookings();
    const targeted = list.find(b => b.bookingId === bookingId);
    if (targeted) {
      setBooking(targeted);
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Ticket PNR Unresolved</h3>
        <p className="text-slate-505 text-sm mt-1">Please try again. Your PNR might have format issues.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-sky-600 text-white font-bold rounded-xl text-xs">Back Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="p-3 bg-emerald-50 text-emerald-505 rounded-full inline-block mb-3.5 border border-emerald-100">
          <CheckCircle className="w-10 h-10 stroke-[1.8]" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-950">Flight Ticket Booked Successfully!</h2>
        <p className="text-slate-505 text-xs mt-1">Your flight confirmation has been saved. Safe flights with SkyWings.</p>
      </div>

      {/* Modular High Fidelity Electronic Ticket Component */}
      <div className="mb-8">
        <ETicket booking={booking} />
      </div>

      {/* Primary Navigation actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-200/60 max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          Book another flight
        </button>
        <button 
          onClick={() => navigate('/bookings')}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          View Bookings History
        </button>
      </div>

    </div>
  );
}


// ==========================================
// 7. PAGE COMPONENT: MANAGE BOOKINGS HISTORY
// ==========================================

function BookingsHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showStatusType, setShowStatusType] = useState<'All' | 'Confirmed' | 'Cancelled'>('All');

  // Load from local db
  useEffect(() => {
    setBookings(getSavedBookings());
  }, []);

  const handleCancelTicket = (id: string) => {
    const consent = window.confirm('Are your sure you want to cancel this flight reservation ticket?');
    if (consent) {
      const updatedList = bookings.map((item) => {
        if (item.bookingId === id) {
          return { ...item, status: 'Cancelled' as const };
        }
        return item;
      });
      setBookings(updatedList);
      saveBookings(updatedList);
    }
  };

  const handlePurgeBooking = (id: string) => {
    const consent = window.confirm('Are your sure you want to completely erase this ticket receipt from device storage history?');
    if (consent) {
      const updatedList = bookings.filter(b => b.bookingId !== id);
      setBookings(updatedList);
      saveBookings(updatedList);
    }
  };

  const displayedList = bookings.filter((item) => {
    if (showStatusType === 'All') return true;
    return item.status === showStatusType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-sky-505" />
            Your Saved Flights Bookings
          </h2>
          <p className="text-slate-500 text-xs mt-1">Manage, inspect, or cancel reservation boarding passes saved locally in this browser.</p>
        </div>

        {/* Tab filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['All', 'Confirmed', 'Cancelled'].map((type) => (
            <button
              key={type}
              onClick={() => setShowStatusType(type as any)}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                showStatusType === type 
                  ? 'bg-white text-sky-600 shadow-sm' 
                  : 'text-slate-505 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {displayedList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-2xl mx-auto">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5] mb-4" />
          <h4 className="text-lg font-extrabold text-slate-900">No Reservations Found</h4>
          <p className="text-slate-505 text-sm mt-1 max-w-sm mx-auto leading-relaxed">
            There are current no local bookings synchronised in this sandbox device for status type: <strong>{showStatusType}</strong>. Choose new destinations to search.
          </p>
          <div className="mt-5">
            <Link to="/" className="px-5 py-3 bg-sky-600 hover:bg-sky-505 text-white font-bold rounded-xl text-xs inline-block">
              Begin Search Pipeline
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedList.map((booking) => (
            <div 
              key={booking.bookingId} 
              className={`bg-white rounded-2xl border ${
                booking.status === 'Cancelled' ? 'border-slate-205/60 opacity-80' : 'border-slate-200/80 shadow-xs hover:shadow-md'
              } overflow-hidden transition-all flex flex-col justify-between`}
            >
              {/* Card Header banner */}
              <div className="bg-slate-90 sm:bg-slate-50 px-4 py-3 border-b border-slate-150 flex justify-between items-center flex-wrap gap-2">
                <span className="font-mono text-xs font-extrabold text-slate-600">
                  PNR: <span className="text-sky-605">{booking.bookingId}</span>
                </span>
                
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  {booking.status === 'Cancelled' ? (
                    <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded leading-none text-[9px] border border-red-100 flex items-center gap-0.5">
                      <XCircle className="w-3 h-3" /> Cancelled
                    </span>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded leading-none text-[9px] border border-emerald-105 flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Confirmed
                    </span>
                  )}
                </div>
              </div>

              {/* Booking Segment Info body */}
              <div className="p-4 sm:p-5 flex-1 space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{booking.flight.from} ({booking.flight.fromCode})</h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Depart: {booking.flight.departure}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Plane className={`w-4.5 h-4.5 ${booking.status === 'Cancelled' ? 'text-slate-400' : 'text-sky-600'} rotate-90`} />
                    <span className="text-[9px] font-mono text-slate-400 font-medium leading-none mt-1">{booking.flight.duration}</span>
                  </div>

                  <div className="text-right">
                    <h4 className="font-extrabold text-sm text-slate-900">{booking.flight.to} ({booking.flight.toCode})</h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Carrier: {booking.flight.airline}</span>
                  </div>
                </div>

                {/* Traveler profile */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] tracking-wider text-slate-455 font-bold uppercase block">Passenger</span>
                    <span className="font-bold text-slate-950 mt-0.5 block truncate">{booking.passengerName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-wider text-slate-455 font-bold uppercase block">Seat Assigned</span>
                    <span className="font-bold text-amber-500 mt-0.5 block font-mono">{booking.seatNumber}</span>
                  </div>
                </div>

              </div>

              {/* Action Toolbar */}
              <div className="bg-slate-50 px-4 py-3.5 border-t border-slate-150 flex items-center justify-between gap-2.5 flex-wrap">
                <Link
                  to={`/success/${booking.bookingId}`}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                >
                  <Ticket className="w-4 h-4 text-sky-600" />
                  Show Passes
                </Link>

                <div className="flex items-center gap-2">
                  {booking.status === 'Confirmed' ? (
                    <button
                      onClick={() => handleCancelTicket(booking.bookingId)}
                      className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-all border border-red-200/50"
                      title="Cancel Flight"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Flight
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurgeBooking(booking.bookingId)}
                      className="px-3 py-1.5 bg-slate-200/80 hover:bg-slate-200 text-slate-600 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-all"
                      title="Erase Trace"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Trace
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}


// ==========================================
// 8. APP ROOT ENTRY AND ROUTER SWITCH
// ==========================================

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/book/:flightId" element={<CheckoutPage />} />
          <Route path="/success/:bookingId" element={<ConfirmationPage />} />
          <Route path="/bookings" element={<BookingsHistoryPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/flight-details/:flightId" element={<FlightDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/flights" element={<ManageFlights />} />
          <Route path="/admin/seats" element={<ManageSeats />} />
          <Route path="/admin/bookings" element={<ViewBookings />} />
        </Routes>
      </Layout>
    </Router>
  );
}