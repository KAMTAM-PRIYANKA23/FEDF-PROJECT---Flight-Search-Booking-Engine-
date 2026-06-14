import { Flight, Booking } from '../App';

const INITIAL_FLIGHTS: Flight[] = [
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

export const getSavedFlights = (): Flight[] => {
  const data = localStorage.getItem('skywings_flights');
  if (!data) {
    localStorage.setItem('skywings_flights', JSON.stringify(INITIAL_FLIGHTS));
    return INITIAL_FLIGHTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_FLIGHTS;
  }
};

export const saveFlights = (flights: Flight[]) => {
  localStorage.setItem('skywings_flights', JSON.stringify(flights));
};

export const getSavedBookings = (): Booking[] => {
  const data = localStorage.getItem('skywings_bookings');
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem('skywings_bookings', JSON.stringify(bookings));
};

// Help helper for Admin seat map blocks if we track seat blocks
export const getSeatMapBlockedSeats = (flightId: string): string[] => {
  const data = localStorage.getItem(`skywings_blocked_seats_${flightId}`);
  return data ? JSON.parse(data) : [];
};

export const saveSeatMapBlockedSeats = (flightId: string, seats: string[]) => {
  localStorage.setItem(`skywings_blocked_seats_${flightId}`, JSON.stringify(seats));
};
