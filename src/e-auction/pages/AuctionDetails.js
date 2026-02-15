import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Save, X, CheckCircle, AlertTriangle, 
  Calendar, DollarSign, MapPin, FileText, Package, Clock, Shield
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { auctionAPI } from '../../services/eAuctionAPI';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [auction, setAuction] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentUser, setCurrentUser] = useState(null); // Assuming you have a way to get this

  // --- 1. Fetch Data ---
  useEffect(() => {
    // Mock user retrieval - replace with your actual Auth Context/Storage
    const user = JSON.parse(localStorage.getItem('user')) || { role: 'guest' };
    setCurrentUser(user);

    const fetchData = async () => {
      try {
        setLoading(true);
        // Use the 'manage' endpoint for full details including restricted fields
        const data = await auctionAPI.getAuctionDetails(id); 
        setAuction(data);
        setFormData(data);
      } catch (err) {
        console.error("Failed to fetch auction:", err);
        setError("Could not load auction details. You may not have permission.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- 2. Permission Logic ---
  const canEdit = () => {
    if (!currentUser || !auction) return false;
    
    // Admin: Can edit anything
    if (currentUser.role === 'admin') return true;
    
    // Seller: Can edit ONLY if NOT approved yet (Draft/Pending/Rejected)
    if (currentUser.role === 'seller' && auction.created_by === currentUser.id) {
       const lockedStatuses = ['L1_APPROVED', 'L2_APPROVED', 'LIVE', 'CLOSED'];
       return !lockedStatuses.includes(auction.approval_status);
    }
    
    return false;
  };

  // --- 3. Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccessMsg('');
    
    try {
      // Prepare payload - only send updatable fields
      const payload = {
        auction_title: formData.auction_title,
        category: formData.category,
        region: formData.region,
        scheduled_start_time: formData.scheduled_start_time,
        scheduled_end_time: formData.scheduled_end_time,
        emd_amount: Number(formData.emd_amount),
        registration_fee: Number(formData.registration_fee),
        inspection_location: formData.inspection_location,
        inspection_start_date: formData.inspection_start_date,
        inspection_end_date: formData.inspection_end_date,
        terms_and_conditions: formData.terms_and_conditions,
        enable_extension: formData.enable_extension,
        extension_duration_minutes: Number(formData.extension_duration_minutes),
        extension_trigger_window_minutes: Number(formData.extension_trigger_window_minutes)
      };

      const updatedAuction = await auctionAPI.updateAuction(id, payload);
      setAuction(updatedAuction);
      setFormData(updatedAuction);
      setIsEditing(false);
      setSuccessMsg("Auction updated successfully!");
      
      // Auto-hide success message
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.detail || "Failed to update auction");
    } finally {
      setSaving(false);
    }
  };

  // --- 4. Render Helpers ---
  const renderField = (label, name, type = "text", required = false) => {
    if (!isEditing) {
        return (
            <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{label}</label>
                <div className="text-navy font-medium text-sm border-b border-gray-200 pb-2">
                    {formData[name] !== null && formData[name] !== undefined ? String(formData[name]) : '-'}
                </div>
            </div>
        );
    }
    return (
        <div className="mb-4">
            <label className="block text-xs font-bold uppercase text-navy mb-1">{label} {required && '*'}</label>
            <input
                type={type}
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:border-orange outline-none text-sm font-bold"
            />
        </div>
    );
  };

  const getStatusBadge = (status, type = 'status') => {
    const colors = {
      DRAFT: 'bg-gray-200 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      L1_APPROVED: 'bg-blue-100 text-blue-800',
      L2_APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      LIVE: 'bg-green-600 text-white animate-pulse',
      CLOSED: 'bg-red-800 text-white',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[status] || 'bg-gray-100'}`}>
            {status?.replace('_', ' ')}
        </span>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-platinum">Loading...</div>;
  if (error && !auction) return <div className="min-h-screen flex items-center justify-center bg-platinum text-red-600 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      {/* --- Action Header --- */}
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/e-auction/my-auctions')} className="text-gray-500 hover:text-navy">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-black text-navy uppercase flex items-center gap-3">
                        {auction.auction_title}
                        {getStatusBadge(auction.status)}
                    </h1>
                    <div className="text-xs text-gray-500 font-bold flex items-center gap-2">
                        Auction ID: #{auction.id} 
                        <span className="text-gray-300">|</span> 
                        Approval: {getStatusBadge(auction.approval_status)}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {isEditing ? (
                    <>
                        <button onClick={() => { setIsEditing(false); setFormData(auction); }} className="px-4 py-2 text-gray-600 font-bold text-sm hover:text-red-600 flex items-center gap-1">
                            <X size={16} /> Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700 flex items-center gap-2">
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                ) : (
                    canEdit() && (
                        <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-navy text-white font-bold rounded shadow hover:bg-orange transition-all flex items-center gap-2">
                            <Edit size={16} /> Edit Auction
                        </button>
                    )
                )}
            </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {successMsg && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded font-bold flex items-center gap-2"><CheckCircle size={20}/> {successMsg}</div>}
        {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded font-bold flex items-center gap-2"><AlertTriangle size={20}/> {error}</div>}

        <div className="grid md:grid-cols-3 gap-6">
            
            {/* --- LEFT COL: AUCTION INFO --- */}
            <div className="md:col-span-2 space-y-6">
                
                {/* 1. Basic Info */}
                <div className="bg-white p-6 rounded shadow border-l-4 border-orange">
                    <h3 className="text-sm font-black text-navy uppercase mb-4 flex items-center gap-2 border-b pb-2">
                        <FileText size={18} className="text-orange" /> Primary Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {renderField("Title", "auction_title", "text", true)}
                        {renderField("Category", "category")}
                        {renderField("Region", "region")}
                        {renderField("Auction Type", "auction_type")} {/* Type usually shouldn't change after creation */}
                    </div>
                </div>

                {/* 2. Schedule */}
                <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                    <h3 className="text-sm font-black text-navy uppercase mb-4 flex items-center gap-2 border-b pb-2">
                        <Calendar size={18} className="text-blue-500" /> Schedule
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {renderField("Start Time", "scheduled_start_time", "datetime-local", true)}
                        {renderField("End Time", "scheduled_end_time", "datetime-local", true)}
                        
                        {isEditing && (
                            <div className="md:col-span-2 bg-blue-50 p-3 rounded text-xs text-blue-800">
                                ℹ️ Note: Changing dates will update the schedule for all Lots that use default timings.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Inspection */}
                <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
                    <h3 className="text-sm font-black text-navy uppercase mb-4 flex items-center gap-2 border-b pb-2">
                        <MapPin size={18} className="text-purple-500" /> Inspection
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                         <div className="md:col-span-2">
                            {renderField("Location", "inspection_location")}
                         </div>
                         {renderField("Start Date", "inspection_start_date", "datetime-local")}
                         {renderField("End Date", "inspection_end_date", "datetime-local")}
                    </div>
                </div>
            </div>

            {/* --- RIGHT COL: SIDEBAR INFO --- */}
            <div className="space-y-6">
                
                {/* 1. Financials */}
                <div className="bg-white p-6 rounded shadow border-t-4 border-green-600">
                    <h3 className="text-sm font-black text-navy uppercase mb-4 flex items-center gap-2">
                        <DollarSign size={18} className="text-green-600" /> Financials
                    </h3>
                    <div className="space-y-2">
                        {renderField("Currency", "currency")}
                        {renderField("EMD Amount", "emd_amount", "number")}
                        {renderField("Reg. Fee", "registration_fee", "number")}
                    </div>
                </div>

                {/* 2. Extension Config */}
                <div className="bg-white p-6 rounded shadow border-t-4 border-red-500">
                    <h3 className="text-sm font-black text-navy uppercase mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-red-500" /> Extension Rules
                    </h3>
                    {isEditing ? (
                        <div className="space-y-3">
                             <label className="flex items-center gap-2 text-sm font-bold">
                                <input type="checkbox" name="enable_extension" checked={formData.enable_extension || false} onChange={handleChange} />
                                Enable Auto-Extension
                             </label>
                             {formData.enable_extension && (
                                <>
                                    {renderField("Trigger Window (min)", "extension_trigger_window_minutes", "number")}
                                    {renderField("Duration (min)", "extension_duration_minutes", "number")}
                                </>
                             )}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">
                            {auction.enable_extension ? (
                                <p>Auto-extension enabled. Extends by <b>{auction.extension_duration_minutes}m</b> if bid within last <b>{auction.extension_trigger_window_minutes}m</b>.</p>
                            ) : (
                                <p className="text-gray-400 italic">Auto-extension disabled</p>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. T&C */}
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-sm font-black text-navy uppercase mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-gray-500" /> Terms
                    </h3>
                    {isEditing ? (
                         <textarea 
                            name="terms_and_conditions" 
                            value={formData.terms_and_conditions || ''} 
                            onChange={handleChange}
                            rows={5}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                         />
                    ) : (
                        <p className="text-xs text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {auction.terms_and_conditions || 'No specific terms provided.'}
                        </p>
                    )}
                </div>
            </div>

            {/* --- BOTTOM: LOTS LIST --- */}
            <div className="md:col-span-3 mt-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-navy uppercase flex items-center gap-2">
                        <Package className="text-orange" /> Auction Lots ({auction.items?.length || 0})
                    </h2>
                    {/* Future: Add 'Add Lot' button here if needed */}
                </div>
                
                <div className="bg-white shadow rounded overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-navy text-white text-xs uppercase">
                            <tr>
                                <th className="p-4">Lot #</th>
                                <th className="p-4">Item Name</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Starting Bid</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {auction.items?.map((lot, idx) => (
                                <tr key={lot.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold text-gray-500">{idx + 1}</td>
                                    <td className="p-4 font-bold text-navy">{lot.item_name}</td>
                                    <td className="p-4 text-sm font-mono">{lot.quantity} {lot.unit}</td>
                                    <td className="p-4 text-sm font-mono text-green-700">₹ {lot.starting_bid_amount?.toLocaleString()}</td>
                                    <td className="p-4">{getStatusBadge(lot.lot_status)}</td>
                                    <td className="p-4">
                                        <button className="text-blue-600 font-bold text-xs hover:underline">VIEW LOT</button>
                                        {/* Future: Add Edit Lot logic here */}
                                    </td>
                                </tr>
                            ))}
                            {(!auction.items || auction.items.length === 0) && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400 italic">No lots found for this auction.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuctionDetails;
