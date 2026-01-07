import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import BidderDashboard from './pages/BidderDashboard';
import About from './pages/About';

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
        <Route path="/tracker" element={<PriceTracker />} />
        <Route path="/about" element={<About />} /> {/* <--- ADD THIS ROUTE */}

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Helper Routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/bidder-dashboard" element={<BidderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
