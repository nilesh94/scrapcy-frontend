import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component Imports
import Navbar from './components/Navbar';

// Page Imports
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CompanyDashboard from './pages/CompanyDashboard';
import PriceTracker from './components/PriceTracker/PriceTracker'; 
import Auction from './pages/Auction';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-platinum font-sans text-navy flex flex-col">
        <Navbar />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracker" element={<PriceTracker />} /> 
            <Route path="/auction" element={<Auction />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
          </Routes>
        </div>
        
        {/* UPDATED FOOTER */}
        <footer className="bg-black py-12 text-center border-t-4 border-orange">
          <p className="text-steel font-bold tracking-widest text-xs mb-3">
            © 2025 SCRAPCY PLATFORM • ALL RIGHTS RESERVED
          </p>
          <p className="text-gray-600 text-[10px] tracking-wider uppercase flex items-center justify-center gap-1">
            POWERED BY <span className="text-orange font-black">METANEXUS</span>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
