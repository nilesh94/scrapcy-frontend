import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CompanyDashboard from './pages/CompanyDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-platinum font-sans text-navy">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
        </Routes>
        
        {/* Footer stays constant across all pages */}
        <footer className="bg-black py-10 text-center border-t-4 border-orange">
          <p className="text-steel font-bold tracking-widest text-xs">© 2025 SCRAPCY PLATFORM</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
