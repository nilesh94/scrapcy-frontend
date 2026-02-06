import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Clock, User, Edit, Trash2, Archive, Send, 
  CheckCircle, XCircle, FileText, AlertCircle
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AuditTrail = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAuditTrail();
  }, [auctionId]);

  const fetchAuditTrail = async () => {
    setLoading(true);
    try {
      // Fetch auction details
      const auctionRes = await axios.get(`${API_URL}/api/v1/e-auction/auctions/${auctionId}`);
      setAuction(auctionRes.data);

      // Fetch audit logs
      const auditRes = await axios.get(`${API_URL}/api/v1/e-auction/admin/audit/${auctionId}`);
      setAuditLogs(auditRes.data);
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      alert('Error loading audit trail');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      CREATED: <FileText size={20} className="text-blue-600" />,
      UPDATED: <Edit size={20} className="text-green-600" />,
      DELETED: <Trash2 size={20} className="text-red-600" />,
      ARCHIVED: <Archive size={20} className="text-orange" />,
      SUBMITTED: <Send size={20} className="text-purple-600" />,
      APPROVED_L1: <CheckCircle size={20} className="text-green-600" />,
      APPROVED_L2: <CheckCircle size={20} className="text-green-700" />,
      REJECTED: <XCircle size={20} className="text-red-600" />,
      PUBLISHED: <CheckCircle size={20} className="text-blue-600" />,
      CLOSED: <Clock size={20} className="text-gray-600" />,
      CANCELLED: <XCircle size={20} className="text-red-700" />
    };
    return icons[action] || <AlertCircle size={20} className="text-gray-600" />;
  };

  const getActionColor = (action) => {
    const colors = {
      CREATED: 'bg-blue-100 border-blue-300',
      UPDATED: 'bg-green-100 border-green-300',
      DELETED: 'bg-red-100 border-red-300',
      ARCHIVED: 'bg-orange/10 border-orange',
      SUBMITTED: 'bg-purple-100 border-purple-300',
      APPROVED_L1: 'bg-green-100 border-green-300',
      APPROVED_L2: 'bg-green-200 border-green-400',
      REJECTED: 'bg-red-100 border-red-300',
      PUBLISHED: 'bg-blue-100 border-blue-300',
      CLOSED: 'bg-gray-100 border-gray-300',
      CANCELLED: 'bg-red-200 border-red-400'
    };
    return colors[action] || 'bg-gray-100 border-gray-300';
  };

  const filteredLogs = filter === 'all' 
    ? auditLogs 
    : auditLogs.filter(log => log.action === filter);

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      {/* Header */}
      <div className="bg-navy text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/e-auction/admin/manage"
            className="mb-4 flex items-center gap-2 text-orange hover:text-white transition-colors inline-flex"
          >
            <ArrowLeft size={20} /> Back to Manage Auctions
          </Link>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            Audit Trail
          </h1>
          <p className="text-orange text-sm font-bold uppercase tracking-widest">
            Complete History & Change Log
          </p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        
        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-steel">Loading audit trail...</p>
          </div>
        ) : (
          <>
            {/* Auction Info Card */}
            {auction && (
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-black text-navy mb-4">Auction Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs uppercase text-steel font-bold mb-1">Title</p>
                    <p className="font-bold text-navy">{auction.auction_title}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-steel font-bold mb-1">ID</p>
                    <p className="font-mono">{auction.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-steel font-bold mb-1">Status</p>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-200 text-blue-800">
                      {auction.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-steel font-bold mb-1">Created By</p>
                    <p>User #{auction.created_by}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-steel font-bold mb-1">Created At</p>
                    <p>{new Date(auction.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-steel font-bold mb-1">Last Updated</p>
                    <p>{new Date(auction.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Buttons */}
            <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded font-bold text-sm ${
                    filter === 'all' ? 'bg-navy text-white' : 'bg-gray-200 text-steel'
                  }`}
                >
                  All Events ({auditLogs.length})
                </button>
                <button
                  onClick={() => setFilter('UPDATED')}
                  className={`px-4 py-2 rounded font-bold text-sm ${
                    filter === 'UPDATED' ? 'bg-green-600 text-white' : 'bg-gray-200 text-steel'
                  }`}
                >
                  Updates
                </button>
                <button
                  onClick={() => setFilter('APPROVED_L1')}
                  className={`px-4 py-2 rounded font-bold text-sm ${
                    filter === 'APPROVED_L1' ? 'bg-green-600 text-white' : 'bg-gray-200 text-steel'
                  }`}
                >
                  L1 Approvals
                </button>
                <button
                  onClick={() => setFilter('APPROVED_L2')}
                  className={`px-4 py-2 rounded font-bold text-sm ${
                    filter === 'APPROVED_L2' ? 'bg-green-700 text-white' : 'bg-gray-200 text-steel'
                  }`}
                >
                  L2 Approvals
                </button>
                <button
                  onClick={() => setFilter('REJECTED')}
                  className={`px-4 py-2 rounded font-bold text-sm ${
                    filter === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-gray-200 text-steel'
                  }`}
                >
                  Rejections
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-black text-navy mb-6 flex items-center gap-2">
                <Clock className="text-orange" size={24} />
                Activity Timeline
              </h2>

              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-steel">No audit logs found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredLogs.map((log, index) => (
                    <div key={log.id || index} className={`relative pl-10 pb-6 border-l-4 ${
                      index === filteredLogs.length - 1 ? 'border-transparent' : 'border-gray-200'
                    }`}>
                      {/* Icon */}
                      <div className="absolute left-0 -ml-3 bg-white">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getActionColor(log.action)}`}>
                          {getActionIcon(log.action)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`p-4 rounded-lg border-2 ${getActionColor(log.action)}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-black text-navy text-lg uppercase">
                              {log.action.replace('_', ' ')}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-steel mt-1">
                              <span className="flex items-center gap-1">
                                <User size={14} />
                                {log.performed_by_name || `User #${log.performed_by}`}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          {log.action_type && (
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-bold">
                              {log.action_type}
                            </span>
                          )}
                        </div>

                        {/* Changes Made */}
                        {log.changes && Object.keys(log.changes).length > 0 && (
                          <div className="mt-3 p-3 bg-white rounded">
                            <p className="text-xs uppercase text-steel font-bold mb-2">Changes Made:</p>
                            <div className="space-y-2">
                              {Object.entries(log.changes).map(([field, change]) => (
                                <div key={field} className="text-sm">
                                  <span className="font-bold text-navy">{field}:</span>
                                  <div className="ml-4 mt-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-red-600 line-through">{change.old_value || 'null'}</span>
                                      <span className="text-steel">→</span>
                                      <span className="text-green-600 font-bold">{change.new_value || 'null'}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reason/Comments */}
                        {log.reason && (
                          <div className="mt-3 p-3 bg-white rounded">
                            <p className="text-xs uppercase text-steel font-bold mb-1">Reason:</p>
                            <p className="text-sm text-navy">{log.reason}</p>
                          </div>
                        )}

                        {/* Remarks */}
                        {log.remarks && (
                          <div className="mt-3 p-3 bg-white rounded">
                            <p className="text-xs uppercase text-steel font-bold mb-1">Remarks:</p>
                            <p className="text-sm text-navy">{log.remarks}</p>
                          </div>
                        )}

                        {/* IP Address & Metadata */}
                        <div className="mt-3 flex gap-4 text-xs text-steel">
                          {log.ip_address && (
                            <span>IP: {log.ip_address}</span>
                          )}
                          {log.user_agent && (
                            <span className="truncate max-w-xs">Device: {log.user_agent}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  // Export audit trail to CSV/PDF
                  const csv = [
                    ['Timestamp', 'Action', 'Performed By', 'Reason', 'Changes'].join(','),
                    ...filteredLogs.map(log => [
                      new Date(log.timestamp).toISOString(),
                      log.action,
                      log.performed_by_name || `User #${log.performed_by}`,
                      log.reason || '',
                      JSON.stringify(log.changes || {})
                    ].join(','))
                  ].join('\n');

                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `audit_trail_${auctionId}_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                }}
                className="px-6 py-3 bg-navy text-white rounded hover:bg-orange transition-colors font-bold uppercase text-sm"
              >
                Export Audit Trail
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AuditTrail;
