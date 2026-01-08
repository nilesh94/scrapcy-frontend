import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyDashboard from './CompanyDashboard';
import BidderDashboard from './BidderDashboard';
import AdminDashboard from './AdminDashboard'; // Import the new dashboard

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get User Data
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      // Not logged in -> Redirect to Login
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-platinum">Loading...</div>;

  // 2. Role Based Routing
  // Assuming your DB user object has a 'role' field: 'admin', 'seller', or 'user' (bidder)
  
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
  
  if (user.role === 'seller') {
    return <CompanyDashboard />;
  }

  // Default to Bidder for 'bidder' role or unknown roles
  return <BidderDashboard />;
};

export default Dashboard;
