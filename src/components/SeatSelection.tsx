import React, { useState } from 'react';
import { motion } from 'motion/react';
import SeatMap, { MOCK_30_SEATS } from './SeatMap';
import { Plane, Compass, HelpCircle, CheckCircle, ShieldCheck, Info } from 'lucide-react';

interface SeatSelectionProps {
  travelersCount: number;
  cabinClass: string;
  selectedSeats: string[];
  onChange: (seats: string[]) => void;
}

export default function SeatSelection({ 
  travelersCount, 
  cabinClass, 
  selectedSeats, 
  onChange 
}: SeatSelectionProps) {

  const [activeTab, setActiveTab] = useState<'map' | 'tips'>('map');

  const handleSeatToggle = (seatId: string) => {
    // If already selected, deselect it
    if (selectedSeats.includes(seatId)) {
      onChange(selectedSeats.filter(id => id !== seatId));
      return;
    }

    // If max limit reached, remove oldest first (FIFO rotation) to keep experience seamless!
    if (selectedSeats.length >= travelersCount) {
      if (travelersCount === 1) {
        onChange([seatId]);
      } else {
        // Drop first element, append new one
        onChange([...selectedSeats.slice(1), seatId]);
      }
    } else {
      onChange([...selectedSeats, seatId]);
    }
  };

  const getSeatClassBadge = (seatId: string) => {
    const info = MOCK_30_SEATS.find(s => s.id === seatId);
    if (!info) return 'Standard';
    return info.extraLegroom ? 'Extra Legroom (Exit Row)' : 'Standard';
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Selection Header Bar */}
      <div className="flex bg-slate-100 rounded-2xl p-1 border border-slate-205">
        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'map' 
              ? 'bg-white text-sky-655 shadow-xs border border-slate-200/90' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Interactive Seat Map
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tips')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tips' 
              ? 'bg-white text-sky-655 shadow-xs border border-slate-200/90' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Cabin Specifications & Tips
        </button>
      </div>

      {activeTab === 'map' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Seat Layout View (Column Span 7) */}
          <div className="md:col-span-7">
            <SeatMap 
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
              maxSelectable={travelersCount}
              cabinClass={cabinClass}
            />
          </div>

          {/* Quick Selection Status (Column Span 5) */}
          <div className="md:col-span-5 space-y-4">
            
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 animate-bounce" />
                Selected Boarding Seats
              </h4>

              <div className="text-xs text-slate-500 leading-relaxed">
                Choose exactly <strong className="text-slate-905">{travelersCount} seat{travelersCount > 1 ? 's' : ''}</strong> for your flight travelers. Tap any seat in the fuselage map to instantly assign.
              </div>

              {/* Multi Seat badges render list */}
              <div className="space-y-2">
                {Array.from({ length: travelersCount }).map((_, index) => {
                  const seatAssigned = selectedSeats[index];
                  
                  return (
                    <div 
                      key={`assigned-${index}`} 
                      className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                        seatAssigned 
                          ? 'bg-amber-50/55 border-amber-205 text-amber-900' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 border-dashed'
                      }`}
                    >
                      <div>
                        <span className="block text-[10px] font-mono uppercase font-bold text-slate-400">
                          Traveler Seat #{index + 1}
                        </span>
                        <span className="font-extrabold text-xs">
                          {seatAssigned ? `Seat Unit: ${seatAssigned}` : 'No seat assigned yet'}
                        </span>
                      </div>

                      {seatAssigned ? (
                        <div className="text-right">
                          <span className="text-[9px] bg-amber-400/25 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block font-mono text-amber-800">
                            {getSeatClassBadge(seatAssigned).split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Select from map</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary Status check */}
              {selectedSeats.length === travelersCount ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>All traveler seats mapped successfully! Click booking button below to finalize.</span>
                </div>
              ) : (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl text-sky-850 text-[11px] flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-505 shrink-0" />
                  <span>Waiting for {travelersCount - selectedSeats.length} more seat selection{travelersCount - selectedSeats.length > 1 ? 's' : ''}.</span>
                </div>
              )}

            </div>

            {/* Simulated Live Compass tracking radar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-201 text-[11px] text-slate-501 space-y-3">
              <span className="font-bold text-slate-900 block text-xs">💡 Quick Tips for presentation:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-500 text-xs">
                <li>Row 3 configures emergency exit lines featuring extra dynamic workspace legroom.</li>
                <li>Seats in Row 1 are placed directly ahead for Business/First Class passengers.</li>
                <li>Select a window seat (A or F) to capture mock landscape illustrations during travel.</li>
              </ul>
            </div>

          </div>

        </div>
      ) : (
        /* Specifications panel */
        <motion.div 
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-sky-655" />
              Fuselage Cabin Specifications (Standard Boeing 787 Mock Variant)
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              SkyWings maintains highly standardized interior cabin layouts for our student simulation platform. Ensure you explain these spacing specs during your practical exam:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h5 className="font-bold text-slate-900 text-xs mb-1">Standard Seat Specs</h5>
              <ul className="space-y-1 text-[11px] text-slate-500 list-disc pl-4">
                <li>Width: 18.5 inches (47 cm) room</li>
                <li>Pitch: 31 inches (79 cm) tilt</li>
                <li>Recline: Under 6 inches (15 cm) back</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h5 className="font-bold text-slate-900 text-xs mb-1">Business Room Specs</h5>
              <ul className="space-y-1 text-[11px] text-slate-500 list-disc pl-4">
                <li>Width: 21 inches (53 cm) flat</li>
                <li>Pitch: 60 inches (152 cm) tilt</li>
                <li>Recline: Entirely 180 degrees flatbed option</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-800 flex items-start gap-2.5">
            <HelpCircle className="w-4.5 h-4.5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong>Presentation Tip of the Day:</strong> Highlight that the interactive seat map provides real-time state manipulation. When a seat is toggled, React changes the array reference, dynamically re-rendering the cockpit visual node instantly without layout shift.
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
