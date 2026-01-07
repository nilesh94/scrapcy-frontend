import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompanyDashboard from './pages/CompanyDashboard'; // Optional if handled by wrapper
import BidderDashboard from './pages/BidderDashboard';   // Optional if handled by wrapper

// Import Components
import PriceTracker from './components/PriceTracker/PriceTracker'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Market Price Route */}
        <Route path="/tracker" element={<PriceTracker />} /> 

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Direct routes if needed for debugging, though Dashboard.js wrapper handles this */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/bidder-dashboard" element={<BidderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
