import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Info } from 'lucide-react';

interface SeatMapProps {
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
  maxSelectable: number;
  cabinClass: string;
}

// Exactly 30 seats defined statically with realistic mock attributes
export interface SeatInfo {
  id: string; // e.g. 1A, 2C, etc.
  row: number;
  col: string;
  type: 'Window' | 'Middle' | 'Aisle';
  isOccupied: boolean;
  extraLegroom: boolean;
  isExitRow: boolean;
}

export const MOCK_30_SEATS: SeatInfo[] = [
  // Row 1 - Imperial Premium Wing (First / Business)
  { id: '1A', row: 1, col: 'A', type: 'Window', isOccupied: false, extraLegroom: true, isExitRow: false },
  { id: '1B', row: 1, col: 'B', type: 'Middle', isOccupied: true, extraLegroom: true, isExitRow: false },
  { id: '1C', row: 1, col: 'C', type: 'Aisle', isOccupied: false, extraLegroom: true, isExitRow: false },
  { id: '1D', row: 1, col: 'D', type: 'Aisle', isOccupied: false, extraLegroom: true, isExitRow: false },
  { id: '1E', row: 1, col: 'E', type: 'Middle', isOccupied: false, extraLegroom: true, isExitRow: false },
  { id: '1F', row: 1, col: 'F', type: 'Window', isOccupied: true, extraLegroom: true, isExitRow: false },

  // Row 2 - Classic Travel Cabin
  { id: '2A', row: 2, col: 'A', type: 'Window', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '2B', row: 2, col: 'B', type: 'Middle', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '2C', row: 2, col: 'C', type: 'Aisle', isOccupied: true, extraLegroom: false, isExitRow: false },
  { id: '2D', row: 2, col: 'D', type: 'Aisle', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '2E', row: 2, col: 'E', type: 'Middle', isOccupied: true, extraLegroom: false, isExitRow: false },
  { id: '2F', row: 2, col: 'F', type: 'Window', isOccupied: false, extraLegroom: false, isExitRow: false },

  // Row 3 - Emergency Exit Row (Max legroom)
  { id: '3A', row: 3, col: 'A', type: 'Window', isOccupied: false, extraLegroom: true, isExitRow: true },
  { id: '3B', row: 3, col: 'B', type: 'Middle', isOccupied: false, extraLegroom: true, isExitRow: true },
  { id: '3C', row: 3, col: 'C', type: 'Aisle', isOccupied: false, extraLegroom: true, isExitRow: true },
  { id: '3D', row: 3, col: 'D', type: 'Aisle', isOccupied: true, extraLegroom: true, isExitRow: true },
  { id: '3E', row: 3, col: 'E', type: 'Middle', isOccupied: false, extraLegroom: true, isExitRow: true },
  { id: '3F', row: 3, col: 'F', type: 'Window', isOccupied: false, extraLegroom: true, isExitRow: true },

  // Row 4 - Standard Passenger Cabin
  { id: '4A', row: 4, col: 'A', type: 'Window', isOccupied: true, extraLegroom: false, isExitRow: false },
  { id: '4B', row: 4, col: 'B', type: 'Middle', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '4C', row: 4, col: 'C', type: 'Aisle', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '4D', row: 4, col: 'D', type: 'Aisle', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '4E', row: 4, col: 'E', type: 'Middle', isOccupied: true, extraLegroom: false, isExitRow: false },
  { id: '4F', row: 4, col: 'F', type: 'Window', isOccupied: false, extraLegroom: false, isExitRow: false },

  // Row 5 - Quiet Tail Cabin
  { id: '5A', row: 5, col: 'A', type: 'Window', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '5B', row: 5, col: 'B', type: 'Middle', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '5C', row: 5, col: 'C', type: 'Aisle', isOccupied: true, extraLegroom: false, isExitRow: false },
  { id: '5D', row: 5, col: 'D', type: 'Aisle', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '5E', row: 5, col: 'E', type: 'Middle', isOccupied: false, extraLegroom: false, isExitRow: false },
  { id: '5F', row: 5, col: 'F', type: 'Window', isOccupied: false, extraLegroom: false, isExitRow: false }
];

export default function SeatMap({ selectedSeats, onSeatToggle, maxSelectable, cabinClass }: SeatMapProps) {
  
  // Arrange seats by Rows for standard HTML formatting convenience
  const rows = [1, 2, 3, 4, 5];
  const leftCols = ['A', 'B', 'C'];
  const rightCols = ['D', 'E', 'F'];

  const { flightId } = useParams();
  const blockedList = React.useMemo(() => {
    if (!flightId) return [];
    try {
      const data = localStorage.getItem(`skywings_blocked_seats_${flightId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, [flightId]);

  const getSeat = (rowNum: number, colLetter: string): SeatInfo | undefined => {
    const seat = MOCK_30_SEATS.find(s => s.row === rowNum && s.col === colLetter);
    if (!seat) return undefined;
    return {
      ...seat,
      isOccupied: seat.isOccupied || blockedList.includes(seat.id)
    };
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Decorative Cockpit / Front Indicator at top of standard fuse */}
      <div className="max-w-xs mx-auto text-center mb-8 relative">
        <div className="w-16 h-8 bg-slate-800 border-t-4 border-sky-500/40 rounded-t-full mx-auto flex items-center justify-center">
          <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase">COCKPIT</span>
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent my-2"></div>
        <span className="text-[10px] font-mono text-slate-455 tracking-wider uppercase">
          Front Cabin Area - Class: {cabinClass} Mode
        </span>
      </div>

      {/* Grid Layout Container simulating actual Airplane Fuselage walls */}
      <div className="relative border-l-2 border-r-2 border-slate-750/70 px-4 py-8 rounded-[40px] bg-slate-950/40 max-w-sm mx-auto">
        
        {/* Row Header Indicator Label */}
        <div className="grid grid-cols-7 gap-3 mb-4 text-center text-[10px] font-mono text-slate-500 font-extrabold uppercase">
          <div>A</div>
          <div>B</div>
          <div>C</div>
          <div className="text-[8px] text-sky-400/70 font-semibold self-center">Aisle</div>
          <div>D</div>
          <div>E</div>
          <div>F</div>
        </div>

        {/* Dynamic map rows loop */}
        <div className="space-y-4 font-mono">
          {rows.map((rowNum) => (
            <div key={`row-${rowNum}`} className="grid grid-cols-7 gap-3 items-center text-center">
              
              {/* Left Wing Colums (A, B, C) */}
              {leftCols.map((col) => {
                const seat = getSeat(rowNum, col);
                if (!seat) return <div key={`empty-${rowNum}-${col}`} />;
                
                const isSelected = selectedSeats.includes(seat.id);
                
                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={seat.isOccupied}
                    onClick={() => onSeatToggle(seat.id)}
                    className={`
                      w-10 h-10 rounded-xl flex flex-col items-center justify-center relative transition-all border text-xs font-bold shrink-0 cursor-pointer
                      ${seat.isOccupied 
                        ? 'bg-slate-800 border-slate-750 text-slate-600 cursor-not-allowed' 
                        : isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.5)] scale-105'
                          : seat.extraLegroom
                            ? 'bg-sky-950/80 text-sky-300 border-sky-800/80 hover:bg-sky-900/60'
                            : 'bg-slate-855 text-slate-300 border-slate-700 hover:bg-slate-800/80'
                      }
                    `}
                    title={`${seat.id} (${seat.type}) - ${seat.isOccupied ? 'Occupied' : seat.extraLegroom ? 'Extra Legroom Exit Row seat' : 'Standard seat'}`}
                  >
                    {/* Micro dot representation on layout */}
                    <span className="text-[10px]">{seat.id}</span>
                    {seat.extraLegroom && !seat.isOccupied && !isSelected && (
                      <span className="absolute -bottom-0.5 right-0.5 w-1.5 h-1.5 bg-sky-450 rounded-full"></span>
                    )}
                  </button>
                );
              })}

              {/* Central Walking Alley Waypoint */}
              <div className="text-[11px] font-bold text-slate-650 font-sans self-center select-none pointer-events-none">
                {rowNum}
              </div>

              {/* Right Wing Colums (D, E, F) */}
              {rightCols.map((col) => {
                const seat = getSeat(rowNum, col);
                if (!seat) return <div key={`empty-${rowNum}-${col}`} />;
                
                const isSelected = selectedSeats.includes(seat.id);
                
                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={seat.isOccupied}
                    onClick={() => onSeatToggle(seat.id)}
                    className={`
                      w-10 h-10 rounded-xl flex flex-col items-center justify-center relative transition-all border text-xs font-bold shrink-0 cursor-pointer
                      ${seat.isOccupied 
                        ? 'bg-slate-800 border-slate-750 text-slate-600 cursor-not-allowed' 
                        : isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.5)] scale-105'
                          : seat.extraLegroom
                            ? 'bg-sky-950/80 text-sky-300 border-sky-800/80 hover:bg-sky-900/60'
                            : 'bg-slate-855 text-slate-300 border-slate-700 hover:bg-slate-800/80'
                      }
                    `}
                    title={`${seat.id} (${seat.type}) - ${seat.isOccupied ? 'Occupied' : seat.extraLegroom ? 'Extra Legroom Exit Row Seat' : 'Standard Seat'}`}
                  >
                    <span className="text-[10px]">{seat.id}</span>
                    {seat.extraLegroom && !seat.isOccupied && !isSelected && (
                      <span className="absolute -bottom-0.5 right-0.5 w-1.5 h-1.5 bg-sky-450 rounded-full"></span>
                    )}
                  </button>
                );
              })}

            </div>
          ))}
        </div>

      </div>

      {/* Interactive Legend Board */}
      <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4.5 h-4.5 rounded-lg bg-slate-855 border border-slate-705"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4.5 h-4.5 rounded-lg bg-amber-400 border border-amber-300"></div>
          <span className="text-amber-300 font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4.5 h-4.5 rounded-lg bg-slate-800 border border-slate-755"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4.5 h-4.5 rounded-lg bg-sky-950 border border-sky-800 relative">
            <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-sky-450 rounded-full"></span>
          </div>
          <span>Legroom Seat</span>
        </div>
      </div>

    </div>
  );
}
