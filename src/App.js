import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- COMPONENTS ---
import SessionTimeout from './components/SessionTimeout'; 

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

// --- E-AUCTION PAGES ---
import RegisterAuction from './e-auction/pages/RegisterAuction';
import MyAuctions from './e-auction/pages/MyAuctions';
import AuctionDetails from './e-auction/pages/AuctionDetails';

// --- ADMIN PAGES ---
import AdminDashboard from './pages/AdminDashboard';
import AdminListings from './pages/AdminListings';

import AdminAuctionDashboard from './e-auction/pages/AdminAuctionDashboard';
import ManageAuctions from './e-auction/pages/ManageAuctions';
import AuditTrail from './e-auction/pages/AuditTrail';

import TermsConditions from './pages/TermsConditions';

function App() {
  return (
    <Router>
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
        <Route path="/e-auction/register" element={<RegisterAuction />} />
        <Route path="/e-auction/my-auctions" element={<MyAuctions />} />
        
        <Route path="/e-auction/auction/:id/manage" element={<AuctionDetails />} />
        
        <Route path="/e-auction/auction/:id" element={<AuctionDetails />} /> 
        <Route path="/e-auction/edit/:id" element={<AuctionDetails />} />

        <Route path="/e-auction/admin/dashboard" element={<AdminAuctionDashboard />} />
        <Route path="/e-auction/admin/manage" element={<ManageAuctions />} />
        <Route path="/e-auction/admin/audit/:auctionId" element={<AuditTrail />} />

        <Route path="/terms-and-conditions" element={<TermsConditions />} />
      </Routes>
    </Router>
  );
}

export default App;
