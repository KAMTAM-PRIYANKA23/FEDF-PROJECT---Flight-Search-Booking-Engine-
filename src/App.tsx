import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import SearchFlights from './components/SearchFlights';
import FlightDetails from './components/FlightDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Flight Search */}
        <Route path="/search-flights" element={<SearchFlights />} />

        {/* Flight Details */}
        <Route path="/flight-details/:flightId" element={<FlightDetails />} />

        {/* Unknown Route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;