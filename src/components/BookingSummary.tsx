import React from 'react';
import { motion } from 'motion/react';
import { 
  Plane, 
  User, 
  Mail, 
  FileText, 
  Briefcase, 
  Utensils, 
  MapPin, 
  Clock, 
  Armchair, 
  DollarSign, 
  ChevronRight, 
  ShieldCheck, 
  Tags,
  Calendar
} from 'lucide-react';

export interface PassengerDetails {
  name: string;
  age: string;
  email: string;
  passportNumber: string;
  mealOption?: string;
  extraBaggage?: boolean;
}

export interface FlightDetailsInfo {
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
  class: string;
}

interface BookingSummaryProps {
  passenger: PassengerDetails;
  flight: FlightDetailsInfo;
  selectedSeats: string[];
  totalAmount: number;
  baseFare: number;
  taxesAmount: number;
  baggageAmount: number;
  onProceed?: () => void;
  isSubmitting?: boolean;
}

export default function BookingSummary({
  passenger,
  flight,
  selectedSeats,
  totalAmount,
  baseFare,
  taxesAmount,
  baggageAmount,
  onProceed,
  isSubmitting = false
}: BookingSummaryProps) {
  
  const hasPassengerDetails = passenger.name || passenger.email || passenger.passportNumber;

  return (
    <motion.div 
      className="bg-white rounded-3xl border border-slate-205 shadow-xl overflow-hidden divide-y divide-slate-100"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 1. Header Segment */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-amber-400 rotate-45" />
            <span className="font-extrabold text-xs tracking-wider uppercase font-sans">Booking Receipt Preview</span>
          </div>
          <span className="text-[9px] font-mono bg-sky-500/20 text-sky-305 border border-sky-400/20 px-2.5 py-0.5 rounded-full uppercase tracking-widest font-extrabold">
            Pending Payment
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 font-medium">
          Please review flight details and passenger designations before submitting.
        </p>
      </div>

      {/* 2. Flight Details Segment */}
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs uppercase tracking-widest">
          <Tags className="w-4 h-4 text-sky-600" />
          <span>Flight Information</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 relative overflow-hidden">
          {/* Subtle branding water-mark */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 pointer-events-none">
            <Plane className="w-24 h-24 rotate-45 text-slate-900" />
          </div>

          <div className="z-10 relative">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-3">
              <div>
                <span className="text-xs font-bold text-slate-805 block">{flight.airline}</span>
                <span className="text-[10px] font-mono text-slate-400">Flight No: <strong className="text-slate-700">{flight.flightNo}</strong></span>
              </div>
              <span className="text-[9px] font-mono bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded border border-sky-200 uppercase tracking-wider">
                {flight.class} Class
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] text-slate-400 font-mono block uppercase">FROM</span>
                <strong className="text-slate-900 block text-sm">{flight.fromCode}</strong>
                <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{flight.from}</span>
                <span className="text-[10px] text-amber-600 font-bold font-mono mt-0.5 block">{flight.departure}</span>
              </div>

              <div className="flex flex-col items-center flex-1 px-4 text-center">
                <span className="text-[9px] text-slate-400 font-mono font-bold mb-1">{flight.duration}</span>
                <div className="w-full flex items-center relative py-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="flex-1 border-t border-dashed border-slate-250"></div>
                  <Plane className="w-3.5 h-3.5 text-sky-600 rotate-90 shrink-0 mx-1" />
                  <div className="flex-1 border-t border-dashed border-slate-250"></div>
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                </div>
                <span className="text-[8px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100 mt-1">
                  Non-stop
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-400 font-mono block uppercase text-right">TO</span>
                <strong className="text-slate-900 block text-sm">{flight.toCode}</strong>
                <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{flight.to}</span>
                <span className="text-[10px] text-sky-600 font-bold font-mono mt-0.5 block text-right">{flight.arrival}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Passenger Details Segment */}
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs uppercase tracking-widest">
          <User className="w-4 h-4 text-sky-600" />
          <span>Passenger Details</span>
        </div>

        {hasPassengerDetails ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {passenger.name && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-start gap-2">
                <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase block leading-none mb-0.5">Full Name</span>
                  <strong className="text-slate-900 block truncate max-w-[150px]">{passenger.name}</strong>
                  {passenger.age && <span className="text-[10px] text-slate-500 font-sans block">{passenger.age} Years Old</span>}
                </div>
              </div>
            )}

            {passenger.passportNumber && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-start gap-2">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase block leading-none mb-0.5">Passport ID</span>
                  <strong className="text-slate-900 block font-mono uppercase">{passenger.passportNumber}</strong>
                </div>
              </div>
            )}

            {passenger.email && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-start gap-2 sm:col-span-2">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-slate-400 font-mono uppercase block leading-none mb-0.5">Contact Mail</span>
                  <strong className="text-slate-900 block truncate text-[11px] font-semibold">{passenger.email}</strong>
                </div>
              </div>
            )}

            {passenger.mealOption && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-start gap-2">
                <Utensils className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase block leading-none mb-0.5">Meal Diet</span>
                  <strong className="text-slate-800 text-[11px] block">{passenger.mealOption}</strong>
                </div>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-start gap-2">
              <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase block leading-none mb-0.5">Baggage Upgrade</span>
                <strong className={`text-[11px] block ${passenger.extraBaggage ? 'text-emerald-600 font-bold' : 'text-slate-800'}`}>
                  {passenger.extraBaggage ? 'Included (+30kg)' : 'Standard Allowance'}
                </strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-800 text-xs text-center font-medium">
            No passenger info filled in form as yet. Complete inputs to preview here.
          </div>
        )}
      </div>

      {/* 4. Selected Seats Segment */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs uppercase tracking-widest">
          <Armchair className="w-4 h-4 text-sky-600" />
          <span>Assigned Seats Selection</span>
        </div>

        {selectedSeats.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedSeats.map((seatId) => (
              <span 
                key={`summary-seat-${seatId}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 border border-amber-200 text-amber-900 font-mono font-extrabold rounded-xl text-xs shadow-xs"
              >
                <Armchair className="w-3.5 h-3.5 text-amber-500" />
                Seat {seatId}
              </span>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-amber-800 text-xs text-center font-medium">
            ⚠️ No seats selected from interactive map yet.
          </div>
        )}
      </div>

      {/* 5. Cost & Pricing Summary Segment */}
      <div className="p-5 space-y-4 bg-slate-50">
        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs uppercase tracking-widest">
          <DollarSign className="w-4 h-4 text-sky-600" />
          <span>Fare & Cost Accounting</span>
        </div>

        <div className="space-y-2.5 text-xs font-semibold text-slate-505">
          <div className="flex justify-between">
            <span className="text-slate-500">Base Flight Price</span>
            <span className="font-mono text-slate-900">${baseFare}</span>
          </div>

          {baggageAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-500">Extra Baggage Option</span>
              <span className="font-mono text-slate-900">+${baggageAmount}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-slate-500">Taxes & Airport Surcharges (8%)</span>
            <span className="font-mono text-slate-900">+${taxesAmount}</span>
          </div>

          <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
            <span className="text-slate-900 font-extrabold text-sm">Grand Total Amount</span>
            <div className="text-right">
              <span className="text-2xl font-black text-sky-600 font-mono">${totalAmount}</span>
              <span className="block text-[8px] text-slate-400 font-mono uppercase">All Tax Incl.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Action Button Block (if hook available) */}
      {onProceed && (
        <div className="p-5">
          <button
            type="button"
            onClick={onProceed}
            disabled={isSubmitting || selectedSeats.length === 0 || !hasPassengerDetails}
            className="w-full py-4 bg-sky-600 hover:bg-sky-505 active:bg-sky-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-sky-600/25 text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Pinging Flight Servers...
              </>
            ) : (
              <>
                <span>Complete Booking Reservation</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

    </motion.div>
  );
}
