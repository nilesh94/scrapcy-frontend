import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, TrendingUp, Clock, CheckCircle, XCircle, 
  AlertTriangle, Users, DollarSign, FileText, Eye, Edit, Archive, Trash2
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { auctionAPI } from '../../services/eAuctionAPI';

const AdminAuctionDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch statistics
      const statsData = await auctionAPI.getAuctionStats();
      setStats(statsData);

      // Fetch recent auctions
      const auctionsData = await auctionAPI.getAuctions({ page: 1, page_size: 5 });
      setRecentAuctions(auctionsData.items || auctionsData);

      // Fetch pending approvals (admin only)
      try {
        const approvalsData = await auctionAPI.getPendingApprovals({ page: 1, page_size: 5 });
        setPendingApprovals(approvalsData.items || approvalsData);
      } catch (error) {
        // User might not have admin permissions
        console.log('No admin access for approvals');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, link }) => (
    <Link to={link} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs uppercase text-steel font-bold mb-1">{title}</p>
          <h3 className="text-3xl font-black text-navy">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {change && (
        <div className="flex items-center text-xs">
          <TrendingUp size={14} className="text-green-600 mr-1" />
          <span className="text-green-600 font-bold">{change}</span>
          <span className="text-steel ml-1">vs last month</span>
        </div>
      )}
    </Link>
  );

  const getStatusBadge = (status) => {
    const colors = {
      DRAFT: 'bg-gray-200 text-gray-800',
      PENDING: 'bg-yellow-200 text-yellow-800',
      SCHEDULED: 'bg-blue-200 text-blue-800',
      LIVE: 'bg-green-200 text-green-800',
      CLOSED: 'bg-red-200 text-red-800',
      CANCELLED: 'bg-red-300 text-red-900',
      ARCHIVED: 'bg-gray-300 text-gray-700'
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      {/* Header */}
      <div className="bg-navy text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                E-Auction Admin Dashboard
              </h1>
              <p className="text-orange text-sm font-bold uppercase tracking-widest">
                Comprehensive Auction Management System
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/e-auction/admin/manage"
                className="px-6 py-3 bg-orange text-white rounded hover:bg-white hover:text-navy transition-all font-bold uppercase text-sm"
              >
                Manage Auctions
              </Link>
              <Link
                to="/e-auction/admin/approvals"
                className="px-6 py-3 bg-white text-navy rounded hover:bg-orange hover:text-white transition-all font-bold uppercase text-sm"
              >
                Approvals
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        
        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-steel">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Auctions"
                value={stats?.total_auctions || 0}
                change="+12%"
                icon={LayoutDashboard}
                color="bg-blue-600"
                link="/e-auction/admin/manage?status=all"
              />
              <StatCard
                title="Live Now"
                value={stats?.live_auctions || 0}
                icon={TrendingUp}
                color="bg-green-600"
                link="/e-auction/admin/manage?status=LIVE"
              />
              <StatCard
                title="Pending Approval"
                value={stats?.pending_approval || 0}
                icon={Clock}
                color="bg-yellow-600"
                link="/e-auction/admin/approvals"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${(stats?.total_revenue || 0).toLocaleString()}`}
                change="+8%"
                icon={DollarSign}
                color="bg-orange"
                link="/e-auction/admin/reports"
              />
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs uppercase text-steel font-bold mb-1">Total Bids</p>
                    <h4 className="text-2xl font-black text-navy">{stats?.total_bids || 0}</h4>
                  </div>
                  <Users size={32} className="text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs uppercase text-steel font-bold mb-1">Active Bidders</p>
                    <h4 className="text-2xl font-black text-navy">{stats?.active_bidders || 0}</h4>
                  </div>
                  <Users size={32} className="text-green-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs uppercase text-steel font-bold mb-1">Avg. Bid Value</p>
                    <h4 className="text-2xl font-black text-navy">₹{(stats?.avg_bid_value || 0).toLocaleString()}</h4>
                  </div>
                  <DollarSign size={32} className="text-orange" />
                </div>
              </div>
            </div>

            {/* Pending Approvals Section */}
            {pendingApprovals.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg mb-8">
                <div className="p-6 border-b border-platinum">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-navy uppercase flex items-center gap-2">
                      <AlertTriangle className="text-yellow-600" size={24} />
                      Pending Approvals
                    </h2>
                    <Link
                      to="/e-auction/admin/approvals"
                      className="text-orange hover:text-navy font-bold text-sm uppercase"
                    >
                      View All →
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {pendingApprovals.map((auction) => (
                      <div key={auction.id} className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex-grow">
                          <h3 className="font-bold text-navy">{auction.auction_title}</h3>
                          <p className="text-xs text-steel">ID: {auction.id} • Created by: User #{auction.created_by}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/e-auction/admin/approve/${auction.id}`}
                            className="px-4 py-2 bg-orange text-white rounded hover:bg-navy transition-colors text-sm font-bold"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Auctions */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-platinum">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black text-navy uppercase flex items-center gap-2">
                    <FileText size={24} className="text-orange" />
                    Recent Auctions
                  </h2>
                  <Link
                    to="/e-auction/admin/manage"
                    className="text-orange hover:text-navy font-bold text-sm uppercase"
                  >
                    View All →
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-navy text-white">
                    <tr>
                      <th className="p-4 text-left text-xs uppercase">Auction</th>
                      <th className="p-4 text-left text-xs uppercase">Category</th>
                      <th className="p-4 text-left text-xs uppercase">Start Date</th>
                      <th className="p-4 text-left text-xs uppercase">Status</th>
                      <th className="p-4 text-left text-xs uppercase">Bids</th>
                      <th className="p-4 text-center text-xs uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAuctions.map((auction) => (
                      <tr key={auction.id} className="border-b hover:bg-platinum/30">
                        <td className="p-4">
                          <div className="font-bold text-navy">{auction.auction_title}</div>
                          <div className="text-xs text-steel">ID: {auction.id}</div>
                        </td>
                        <td className="p-4 text-sm">{auction.category || '-'}</td>
                        <td className="p-4 text-sm">
                          {new Date(auction.scheduled_start_time).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(auction.status)}`}>
                            {auction.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-bold">{auction.total_bids || 0}</td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/e-auction/admin/view/${auction.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </Link>
                            <Link
                              to={`/e-auction/admin/edit/${auction.id}`}
                              className="p-2 text-green-600 hover:bg-green-100 rounded"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              className="p-2 text-orange hover:bg-orange/10 rounded"
                              title="Archive"
                            >
                              <Archive size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Link
                to="/e-auction/admin/manage"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
              >
                <LayoutDashboard size={48} className="mx-auto mb-4 text-blue-600" />
                <h3 className="font-black text-navy mb-2 uppercase">Manage Auctions</h3>
                <p className="text-sm text-steel">View, edit, delete, and archive auctions</p>
              </Link>
              <Link
                to="/e-auction/admin/approvals"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
              >
                <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
                <h3 className="font-black text-navy mb-2 uppercase">Approval Workflow</h3>
                <p className="text-sm text-steel">L1/L2 approval management</p>
              </Link>
              <Link
                to="/e-auction/admin/audit"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
              >
                <FileText size={48} className="mx-auto mb-4 text-orange" />
                <h3 className="font-black text-navy mb-2 uppercase">Audit Trail</h3>
                <p className="text-sm text-steel">Complete history and change logs</p>
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminAuctionDashboard;
