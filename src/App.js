import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- COMPONENTS ---
import SessionTimeout from './components/SessionTimeout'; // <--- Import Session Timeout Logic

// --- PAGES ---
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import BidderDashboard from './pages/BidderDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import About from './pages/About';
import PriceTracker from './components/PriceTracker/PriceTracker';
import AdminListingDetail from './pages/AdminListingDetail';
import AdminMarketPrice from './pages/AdminMarketPrice';
import EAuctionLander from './pages/EAuctionLander';

// --- ADMIN PAGES ---
import AdminDashboard from './pages/AdminDashboard';
import AdminListings from './pages/AdminListings';

function App() {
  return (
    <Router>
      {/* SessionTimeout is placed here (inside Router, outside Routes) 
          so it monitors activity globally across all pages.
      */}
      <SessionTimeout />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tracker" element={<PriceTracker />} />
        <Route path="/about" element={<About />} />

        {/* Protected Dashboard Route (Main Switcher) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Specific Role Dashboards */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/bidder-dashboard" element={<BidderDashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/listings" element={<AdminListings />} />
        <Route path="/admin/listings/:id" element={<AdminListingDetail />} />
        <Route path="/admin/market-prices" element={<AdminMarketPrice />} />
        
        {/* E-AUCTION ROUTES */}
        <Route path="/e-auction" element={<EAuctionLander />} />
      </Routes>
    </Router>
  );
}

export default App;
