import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* Module 1 Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* All other routes redirect to Login */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </Layout>
    </Router>
  );
}