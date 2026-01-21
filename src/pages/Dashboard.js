import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyDashboard from './CompanyDashboard';
import BuyerDashboard from './BuyerDashboard';
import AdminDashboard from './AdminDashboard';

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
  
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
  
  // Sellers see the Company Dashboard (Management View)
  if (user.role === 'seller') {
    return <CompanyDashboard />;
  }

  // Buyers AND Buyer/Sellers see the Marketplace (Buyer Dashboard)
  // This covers 'buyer', 'buyer_seller', and any fallbacks
  return <BuyerDashboard />;
};

export default Dashboard;
