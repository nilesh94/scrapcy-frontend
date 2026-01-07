import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyDashboard from './CompanyDashboard';
import BidderDashboard from './BidderDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get User Data
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!token || !userString) {
      // Not logged in? Kick them out.
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userString);
      setRole(user.role); // 'seller' or 'user' (bidder)
    } catch (e) {
      // Corrupt data? Kick them out.
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-platinum text-navy font-bold uppercase tracking-widest animate-pulse">
        Loading Dashboard...
      </div>
    );
  }

  // 2. Render the correct Dashboard Component
  if (role === 'seller') {
    return <CompanyDashboard />;
  } else {
    // Default to Bidder for 'user' role
    return <BidderDashboard />;
  }
};

export default Dashboard;
