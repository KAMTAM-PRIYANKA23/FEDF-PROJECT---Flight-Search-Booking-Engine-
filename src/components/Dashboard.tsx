import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Ticket,
  DollarSign,
  TrendingUp,
  Bell,
  Plane,
  ChevronRight,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Info,
  MapPin
} from 'lucide-react';

interface Booking {
  bookingId: string;
  flight: {
    flightNo: string;
    from: string;
    to: string;
    fromCode: string;
    toCode: string;
    price?: number;
    class: string;
    duration: string;
  };
  seatNumber: string;
  status: string;
  bookingDate: string;
}

interface DashboardNotification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [currentUser, setCurrentUser] = useState<{ fullName: string } | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('skywings_logged_in_user');
    if (user) setCurrentUser(JSON.parse(user));

    const rawBookings = localStorage.getItem('skywings_bookings');
    const data = rawBookings ? JSON.parse(rawBookings) : [];
    setBookings(data);

    setNotifications([
      {
        id: 'welcome',
        type: 'info',
        title: 'Welcome to SkyWings',
        message: 'Search flights and explore available routes.',
        time: 'Just now',
        read: false
      }
    ]);
  }, []);

  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');

  const totalSpent = confirmedBookings.reduce((acc, booking) => {
    const price = booking.flight.price || 0;
    return acc + price;
  }, 0);

  const markRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* HEADER */}
      <motion.div
        className="bg-slate-900 text-white rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              Welcome {currentUser?.fullName || "User"}
            </h1>
            <p className="text-sm text-slate-300">
              Flight Booking Dashboard
            </p>
          </div>

          <Link
            to="/search-flights"
            className="bg-sky-600 px-4 py-2 rounded-lg text-sm font-bold"
          >
            New Booking
          </Link>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="p-4 bg-white rounded-xl shadow">
          <Ticket />
          <p>Total Bookings</p>
          <h2>{bookings.length}</h2>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <CheckCircle />
          <p>Confirmed</p>
          <h2>{confirmedBookings.length}</h2>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <XCircle />
          <p>Cancelled</p>
          <h2>{cancelledBookings.length}</h2>
        </div>

      </div>

      {/* BOOKINGS */}
      <div>
        <h2 className="font-bold mb-3">Recent Bookings</h2>

        {bookings.length === 0 ? (
          <div className="p-6 bg-white rounded-xl text-center">
            <Plane />
            <p>No bookings yet</p>
            <Link to="/search-flights" className="text-blue-600">
              Start Booking
            </Link>
          </div>
        ) : (
          bookings.slice(0, 3).map(b => (
            <div key={b.bookingId} className="p-4 bg-white rounded-xl mb-3">
              <p>{b.flight.fromCode} → {b.flight.toCode}</p>
              <p>Status: {b.status}</p>

              <button
                onClick={() => navigate("/search-flights")}
                className="text-sm text-blue-600"
              >
                Book Again
              </button>
            </div>
          ))
        )}
      </div>

      {/* NOTIFICATIONS */}
      <div>
        <h2 className="font-bold mb-3">Notifications</h2>

        {notifications.map(n => (
          <div key={n.id} className="p-3 bg-gray-100 rounded mb-2">
            <p className="font-bold">{n.title}</p>
            <p className="text-sm">{n.message}</p>

            <div className="flex gap-2 mt-2">
              {!n.read && (
                <button onClick={() => markRead(n.id)}>
                  Mark Read
                </button>
              )}
              <button onClick={() => removeNotification(n.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}