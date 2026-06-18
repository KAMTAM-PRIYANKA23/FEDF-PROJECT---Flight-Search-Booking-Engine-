import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  User, 
  MapPin, 
  Clock, 
  Armchair, 
  Download, 
  CheckCircle, 
  QrCode, 
  Sparkles,
  Info,
  Calendar,
  Shield,
  FileText
} from 'lucide-react';
import { Booking } from '../App';

interface ETicketProps {
  booking: Booking;
}

export default function ETicket({ booking }: ETicketProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStep, setDownloadStep] = useState(0);
  const [showStatusNotification, setShowStatusNotification] = useState(false);

  // Generate modern simulated QR styling parameters
  const moduleGrid = Array.from({ length: 15 }).map(() => 
    Array.from({ length: 15 }).map(() => Math.random() > 0.4)
  );

  const triggerDownloadSimulation = () => {
    setIsDownloading(true);
    setDownloadStep(1);
    
    // Step 1: compile asset
    setTimeout(() => {
      setDownloadStep(2);
      
      // Step 2: sign encryption keys
      setTimeout(() => {
        setDownloadStep(3);
        
        // Step 3: transmit & trigger browser download
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadStep(0);
          setShowStatusNotification(true);
          
          // Generate realistic blob download or call print
          const ticketContent = `
=============================================
          SKYWINGS ELECTRONIC TICKET
=============================================
TICKET ID/PNR: ${booking.bookingId}
BOOKING STATUS: CONFIRMED
ISSUED DATE: ${booking.bookingDate}

PASSENGER DETAILS:
------------------
Name: ${booking.passengerName}
Age: ${booking.passengerAge}
Email: ${booking.passengerEmail}
Passport: ${booking.passportNumber}

FLIGHT DETAILS:
---------------
Airline: ${booking.flight.airline}
Flight Number: ${booking.flight.flightNo}
Departure: ${booking.flight.from} (${booking.flight.fromCode})
Arrival: ${booking.flight.to} (${booking.flight.toCode})
Schedule Departure: ${booking.flight.departure}
Schedule Arrival: ${booking.flight.arrival || 'Scheduled'}
Duration: ${booking.flight.duration}
Cabin Class: ${booking.flight.class}

ASSIGNED SEAT(S):
-----------------
Seats: ${booking.seatNumber}
Meal Preference: ${booking.mealOption || 'Standard'}
Baggage Upgrade: ${booking.extraBaggage ? 'Included (+30kg)' : 'Standard Allowance'}

---------------------------------------------
Thank you for flying with SkyWings. Safe travels!
=============================================
`;
          const blob = new Blob([ticketContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `SkyWings_Ticket_${booking.bookingId}.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Hide status banner automatically after several seconds
          setTimeout(() => {
            setShowStatusNotification(false);
          }, 4000);

        }, 1200);
      }, 1000);
    }, 850);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Status Notification Toast */}
      <AnimatePresence>
        {showStatusNotification && (
          <motion.div 
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 animate-bounce" />
              <div>
                <strong className="block font-bold">E-Ticket downloaded successfully!</strong>
                <span className="text-[10px] text-emerald-650 font-medium">Original file: SkyWings_Ticket_{booking.bookingId}.txt has been pushed to your system files.</span>
              </div>
            </div>
            <button 
              onClick={() => setShowStatusNotification(false)}
              className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Premium E-Ticket Body */}
      <div className="relative bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-3xl mx-auto">
        
        {/* Dynamic header row with neon line accent */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-xl">
              <Plane className="w-5 h-5 text-sky-400 rotate-45" />
            </div>
            <div>
              <span className="text-[8px] font-mono tracking-widest text-slate-455 uppercase block">OFFICIAL ELECTRONIC TICKET</span>
              <h3 className="text-sm font-black tracking-tight text-white">{booking.flight.airline} flight confirmation</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/10 tracking-widest uppercase">
              Confirmed
            </span>
          </div>
        </div>

        {/* Diagonal perforation pattern simulating classical aviation tickets */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 relative">
          
          {/* Main Flight metadata Column */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Sector details */}
            <div className="flex items-start justify-between bg-slate-950/45 p-5 rounded-2xl border border-slate-800/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <div className="z-10">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">DEPARTURE</span>
                <strong className="text-base font-black text-white block mt-1">{booking.flight.fromCode}</strong>
                <span className="text-[11px] text-slate-300 block truncate max-w-[170px] mt-0.5">{booking.flight.from}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono font-bold mt-2 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/15">
                  <Clock className="w-3 h-3" /> {booking.flight.departure}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center flex-1 px-4 text-center py-2">
                <span className="text-[9px] font-mono font-extrabold text-slate-455 mb-1 bg-slate-850 px-2 py-0.5 rounded-full">
                  {booking.flight.duration}
                </span>
                <div className="w-full flex items-center relative py-1">
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                  <div className="flex-1 border-t border-dashed border-slate-700"></div>
                  <Plane className="w-4 h-4 text-sky-400 rotate-90 shrink-0 mx-1.5" />
                  <div className="flex-1 border-t border-dashed border-slate-700"></div>
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                </div>
                <span className="text-[8px] text-sky-400 font-mono font-bold uppercase tracking-wider mt-1.5">
                  FLIGHT {booking.flight.flightNo}
                </span>
              </div>

              <div className="text-right z-10">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold text-right">ARRIVAL</span>
                <strong className="text-base font-black text-white block mt-1 text-right">{booking.flight.toCode}</strong>
                <span className="text-[11px] text-slate-300 block truncate max-w-[170px] mt-0.5 text-right">{booking.flight.to}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 font-mono font-bold mt-2 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/15 text-right ml-auto">
                  Scheduled
                </span>
              </div>
            </div>

            {/* Passenger & Comfort Specifications mapping grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 bg-slate-950/20 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span>Passenger Profile</span>
                </div>
                <div className="space-y-1">
                  <strong className="text-xs text-white block truncate">{booking.passengerName}</strong>
                  <div className="text-[10px] text-slate-400 font-medium space-x-2 block">
                    <span>Age: <strong>{booking.passengerAge}</strong></span>
                    <span>•</span>
                    <span>Passport: <strong className="font-mono uppercase">{booking.passportNumber}</strong></span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block truncate">{booking.passengerEmail}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950/20 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                  <Armchair className="w-3.5 h-3.5 text-amber-400" />
                  <span>Seating Allocation</span>
                </div>
                <div className="space-y-1">
                  <strong className="text-sm font-mono text-amber-400 font-black block">
                    {booking.seatNumber}
                  </strong>
                  <div className="text-[10px] text-slate-400 font-medium space-x-1.5 flex flex-wrap items-center">
                    <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-semibold text-[9px] uppercase">
                      {booking.flight.class} Class
                    </span>
                    <span>•</span>
                    <span className="text-[10px]">Meal: <strong>{booking.mealOption || 'Standard'}</strong></span>
                  </div>
                  <span className="text-[9px] text-emerald-450 block font-semibold">
                    {booking.extraBaggage ? '✓ 30KG Luggage Extension active' : '✓ Normal luggage weight limit'}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Symmetrical Coupon Separator Tear Line */}
          <div className="hidden md:flex md:col-span-1 items-center justify-center relative">
            <div className="absolute top-0 -translate-y-6 w-5 h-5 bg-slate-950 rounded-full border border-slate-950 -mt-1 z-20"></div>
            <div className="h-full border-l border-dashed border-slate-800"></div>
            <div className="absolute bottom-0 translate-y-6 w-5 h-5 bg-slate-950 rounded-full border border-slate-950 -mb-1 z-20"></div>
          </div>

          {/* Right Coupon Area with QR Code & PNR Block */}
          <div className="md:col-span-3 flex flex-col justify-between items-center text-center space-y-5">
            
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">BOARDING PASS PNR</span>
              <span className="inline-block px-4 py-2 bg-slate-950 text-sky-400 border border-slate-800 font-mono text-lg font-black tracking-wider rounded-xl shadow-inner">
                {booking.bookingId}
              </span>
            </div>

            {/* HIGH FIDELITY RENDERED QR CODE PLACEHOLDER */}
            <div className="bg-white p-3.5 rounded-2xl shadow-lg border border-slate-200 relative group flex flex-col items-center justify-center shrink-0 w-36 h-36">
              
              {/* Abstract decorative corners */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-sky-600 rounded-tl"></div>
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-sky-600 rounded-tr"></div>
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-sky-600 rounded-bl"></div>
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-sky-600 rounded-br"></div>

              {/* QR Pattern logic layout */}
              <div className="grid grid-cols-15 gap-[1.5px] w-28 h-28 bg-white shrink-0">
                {moduleGrid.map((row, rIdx) => 
                  row.map((active, cIdx) => {
                    // Force standard finder patterns in 3 corners of the grid
                    const isFinder = 
                      (rIdx < 4 && cIdx < 4) || 
                      (rIdx < 4 && cIdx > 10) || 
                      (rIdx > 10 && cIdx < 4);
                    
                    // Finder pattern visual representation
                    if (isFinder) {
                      const isBorder = rIdx === 0 || rIdx === 3 || cIdx === 0 || cIdx === 3 ||
                                       rIdx === 0 || rIdx === 3 || cIdx === 11 || cIdx === 14 ||
                                       rIdx === 11 || rIdx === 14 || cIdx === 0 || cIdx === 3;
                      const isInnerDot = (rIdx === 1.5 || rIdx === 1 || rIdx === 2) && (cIdx === 1 || cIdx === 2) ||
                                         (rIdx === 1.5 || rIdx === 1 || rIdx === 2) && (cIdx === 12 || cIdx === 13) ||
                                         (rIdx === 12 || rIdx === 13) && (cIdx === 1 || cIdx === 2);
                      
                      return (
                        <div 
                          key={`qr-${rIdx}-${cIdx}`} 
                          className="rounded-[1px]"
                          style={{ 
                            backgroundColor: isBorder || isInnerDot ? '#0f172a' : '#ffffff' 
                          }}
                        />
                      );
                    }

                    return (
                      <div 
                        key={`qr-${rIdx}-${cIdx}`} 
                        className="rounded-[0.5px]"
                        style={{ 
                          backgroundColor: active ? '#0f172a' : '#ffffff' 
                        }}
                      />
                    );
                  })
                )}
              </div>
              <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                <QrCode className="w-8 h-8 text-sky-605" />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono tracking-tight text-center leading-normal">
              <span>Security Decryption:</span>
              <span className="block font-bold mt-0.5 text-slate-350">SHA-256 SECURED VERIFICATION</span>
            </div>

          </div>

        </div>

        {/* 3. Dynamic Progress Loader overlay when downloading */}
        <AnimatePresence>
          {isDownloading && (
            <motion.div 
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center z-40 p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-xs space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-sky-400 border-t-transparent animate-spin"></div>
                  <Sparkles className="absolute inset-0 w-5 h-5 text-amber-400 m-auto animate-pulse" />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {downloadStep === 1 && 'Compiling digital ticket...'}
                    {downloadStep === 2 && 'Signing cryptographic credentials...'}
                    {downloadStep === 3 && 'Transmitting official file...'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Please do not refresh or close SkyWings</p>
                </div>

                {/* Simulated progress slider bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-sky-400 to-amber-400"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: downloadStep === 1 ? '35%' : downloadStep === 2 ? '70%' : '100%' 
                    }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 4. Action toolbar below the ticket */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
        <button 
          type="button"
          onClick={triggerDownloadSimulation}
          className="w-full sm:w-auto px-7 py-3.5 bg-sky-650 hover:bg-sky-505 active:bg-sky-700 text-white font-black rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md hover:shadow-sky-600/10 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download E-Ticket (.TXT Format)
        </button>
        
        <button 
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-205 font-bold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          Print / Save PDF alternative
        </button>
      </div>

    </div>
  );
}
