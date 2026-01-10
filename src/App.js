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
import PriceTracker from './components/PriceTracker/PriceTracker';
import AdminListingDetail from './pages/AdminListingDetail';

// Import Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminListings from './pages/AdminListings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tracker" element={<PriceTracker />} />
        <Route path="/about" element={<About />} />

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Helper Routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/bidder-dashboard" element={<BidderDashboard />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/listings" element={<AdminListings />} />
        <Route path="/admin/listings/:id" element={<AdminListingDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
