import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
 ArrowLeft, Edit, Save, X, CheckCircle, AlertTriangle, 
 Calendar, DollarSign, MapPin, FileText, Package, Clock, Shield, Upload, Download, Loader2,
 Trash2, Image as ImageIcon // Added Trash and Image icons
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { auctionAPI, lotAPI } from '../../services/eAuctionAPI';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null); // Ref for document selection
  const lotImageInputRef = useRef(null); // Ref for lot image selection

  // --- Main Auction State ---
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [auction, setAuction] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentUser, setCurrentUser] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null); // Local file state for editing

  // NEW: Workflow state
  const [actionLoading, setActionLoading] = useState(false);

  // --- LOT MODAL STATE ---
  const [selectedLot, setSelectedLot] = useState(null);
  const [isLotEditing, setIsLotEditing] = useState(false);
  const [lotFormData, setLotFormData] = useState({});
  const [lotSaving, setLotSaving] = useState(false);
  
  // NEW: Lot Image Management State
  const [newLotImages, setNewLotImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);

  // New: Modal-specific feedback state
  const [lotSuccessMsg, setLotSuccessMsg] = useState('');
  const [lotError, setLotError] = useState('');

  // --- Helper: Format Filename for Display ---
  const formatFileName = (url) => {
    if (!url) return null;
    // Extract filename from the end of the URL and split by '___'
    const parts = url.split('/').pop().split('___');
    return parts[0];
  };

  // --- Helper: Permission Check Logic ---
  const checkCanEdit = (auctionObj, userObj) => {
    if (!userObj || !auctionObj) return false;
    // v4.0: Strictly block non-management roles from any edit visibility
    const role = userObj.role?.toLowerCase();
    if (role === 'guest' || role === 'buyer') return false;

    // Admin: Can edit anything
    if (role === 'admin') return true;
    // Seller: Can edit ONLY if it belongs to them and NOT approved yet
    if (role === 'seller' && auctionObj.created_by === userObj.id) {
       // Only DRAFT or REJECTED auctions can be edited
       const editableStatuses = ['DRAFT', 'REJECTED'];
       return editableStatuses.includes(auctionObj.approval_status);
    }
    return false;
  };

  // --- 1. Fetch Data ---
  useEffect(() => {
    // Normalized role handling for case sensitivity
    const rawUser = JSON.parse(localStorage.getItem('user'));
    const user = rawUser ? { ...rawUser, role: rawUser.role?.toLowerCase() } : { role: 'guest' };
    setCurrentUser(user);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        let data;
        // Use 'open' endpoint for public viewing by buyers/guests
        const isManagePath = location.pathname.includes('/manage') || location.pathname.includes('/edit');
        const isBuyerOrGuest = user.role === 'guest' || user.role === 'buyer';

        // SECURITY: Prevent unauthorized access to management routes
        if (isManagePath && isBuyerOrGuest) {
            navigate(`/e-auction/auction/${id}`);
            return;
        }
        
        if (isBuyerOrGuest && !isManagePath) {
            data = await auctionAPI.getOpenAuctionDetails(id);
        } else {
            data = await auctionAPI.getAuctionDetails(id); 
        }
        
        setAuction(data);
        setFormData(data);

        // --- AUTO-EDIT LOGIC ---
        if (location.pathname.includes('/edit')) {
            if (checkCanEdit(data, user)) {
                setIsEditing(true);
            } else {
                console.warn("Edit not allowed for this auction status.");
            }
        }

      } catch (err) {
        console.error("Failed to fetch auction:", err);
        setError(err.response?.status === 403 
          ? "Access Denied: You do not have permission to manage this auction." 
          : "Could not load auction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location.pathname, navigate]);

  // --- 2. Handlers (Auction) ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- NEW HANDLER: Update terms file state locally ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    // SECURITY GUARD: Verify permissions before initiating API call
    if (!checkCanEdit(auction, currentUser)) {
      setError("Unauthorized update attempt blocked.");
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMsg('');
    
    try {
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
        extension_trigger_window_minutes: Number(formData.extension_trigger_window_minutes),
        extension_min_total_bids: Number(formData.extension_min_total_bids) 
      };

      // UPDATED: Pass the selectedFile to the updateAuction call
      const updatedAuction = await auctionAPI.updateAuction(id, payload, selectedFile);
      setAuction(updatedAuction);
      setFormData(updatedAuction);
      setIsEditing(false);
      setSelectedFile(null); // Clear local file selection
      setSuccessMsg("Auction updated successfully!");
      
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.detail || "Failed to update auction");
    } finally {
      setSaving(false);
    }
  };

  // NEW: Unified Workflow Action Handler
  const handleWorkflowAction = async (action, comments = "") => {
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await auctionAPI.performApprovalAction(id, { action, comments });
      setSuccessMsg(`Action ${action} successful!`);
      // Refresh all data to reflect new status & logs
      const updatedData = await auctionAPI.getAuctionDetails(id);
      setAuction(updatedData);
      setFormData(updatedData);
    } catch (err) {
      console.error("Workflow action failed:", err);
      setError(err.response?.data?.detail || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  // --- 3. Handlers (Lots) ---
  const openLotModal = (lot) => {
    setSelectedLot(lot);
    setLotFormData(lot); 
    setIsLotEditing(false);
    // Clear previous modal messages
    setLotSuccessMsg('');
    setLotError('');
    // Reset image states
    setNewLotImages([]);
    setDeleteImageIds([]);
  };

  const closeLotModal = () => {
    setSelectedLot(null);
    setLotFormData({});
    setIsLotEditing(false);
    setLotSuccessMsg('');
    setLotError('');
    setNewLotImages([]);
    setDeleteImageIds([]);
  };

  const handleLotChange = (e) => {
    const { name, value } = e.target;
    setLotFormData(prev => ({ ...prev, [name]: value }));
  };

  // NEW: Handler for new lot images
  const handleNewLotImageChange = (e) => {
    const files = Array.from(e.target.files);
    const existingCount = (selectedLot.images?.length || 0) - deleteImageIds.length;
    
    if (existingCount + newLotImages.length + files.length > 5) {
      alert("Maximum 5 images allowed per lot.");
      return;
    }
    
    setNewLotImages(prev => [...prev, ...files]);
  };

  // NEW: Handler to mark existing image for deletion
  const toggleImageDelete = (imageId) => {
    setDeleteImageIds(prev => 
      prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]
    );
  };

  const handleSaveLot = async () => {
    // SECURITY GUARD: Verify permissions before initiating Lot update
    if (!checkCanEdit(auction, currentUser)) {
      setLotError("Unauthorized update attempt blocked.");
      return;
    }

    setLotSaving(true);
    setLotError('');
    setLotSuccessMsg('');

    try {
        // Enforce at least one image remaining
        const remainingCount = (selectedLot.images?.length || 0) - deleteImageIds.length + newLotImages.length;
        if (remainingCount < 1) {
            throw new Error("At least one image is required for the lot.");
        }

        // Prepare payload
        const payload = {
            ...lotFormData,
            quantity: Number(lotFormData.quantity),
            starting_bid_amount: Number(lotFormData.starting_bid_amount),
            reserve_price: Number(lotFormData.reserve_price),
            min_increment_amount: Number(lotFormData.min_increment_amount),
            buy_now_price: Number(lotFormData.buy_now_price),
            condition_rating: Number(lotFormData.condition_rating),
            delete_image_ids: deleteImageIds // Pass IDs to be removed
        };

        // Call API - We need to pass lot_0_ prefix for the index 0 since we open one modal at a time
        // Note: Backend expects files in lot_{index}_ format.
        const updatedLot = await lotAPI.updateLot(selectedLot.id, payload, newLotImages);

        // Update local state list so table refreshes
        const updatedItems = auction.items.map(item => item.id === updatedLot.id ? updatedLot : item);
        setAuction(prev => ({ ...prev, items: updatedItems }));
        
        setSelectedLot(updatedLot); // Update modal view
        setIsLotEditing(false);
        setNewLotImages([]);
        setDeleteImageIds([]);
        setLotSuccessMsg("Lot details updated successfully!");
        
        setTimeout(() => setLotSuccessMsg(''), 3000);

    } catch (err) {
        console.error("Lot Update failed:", err);
        setLotError(err.message || err.response?.data?.detail || "Failed to update lot details.");
    } finally {
        setLotSaving(false);
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

  // Helper for Lot Modal Fields (reusing logic but pointing to lotFormData)
  const renderLotField = (label, name, type = "text", required = false) => {
    if (!isLotEditing) {
        return (
            <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{label}</label>
                <div className="text-navy font-medium text-sm border-b border-gray-200 pb-2">
                    {lotFormData[name] !== null && lotFormData[name] !== undefined ? String(lotFormData[name]) : '-'}
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
                value={lotFormData[name] || ''}
                onChange={handleLotChange}
                className="w-full p-2 border border-gray-300 rounded focus:border-orange outline-none text-sm font-bold"
            />
        </div>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      // v3.0 Combined Statuses
      DRAFT: 'bg-gray-200 text-gray-800',
      PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
      PENDING_L1: 'bg-yellow-100 text-yellow-800',
      PENDING_L2: 'bg-blue-100 text-blue-800',
      PENDING_ADMIN: 'bg-purple-100 text-purple-800',
      APPROVED: 'bg-green-100 text-green-800',
      READY_TO_PUBLISH: 'bg-green-100 text-green-800 font-black',
      PUBLISHED: 'bg-green-600 text-white',
      SCHEDULED: 'bg-indigo-600 text-white',
      REJECTED: 'bg-red-100 text-red-800',
      LIVE: 'bg-green-600 text-white animate-pulse',
      CLOSED: 'bg-red-800 text-white',
      CANCELLED: 'bg-gray-800 text-white',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[status] || 'bg-gray-100'}`}>
            {status?.replace(/_/g, ' ')}
        </span>
    );
  };

  // --- NEW COMPONENT: Workflow Control Bar ---
  const renderWorkflowBar = () => {
    if (!auction || !currentUser) return null;
    
    // v4.0: Strictly hide workflow controls for guest/buyer or non-authorized sellers
    const isPublicUser = currentUser.role?.toLowerCase() === 'guest' || currentUser.role?.toLowerCase() === 'buyer';
    const isOwner = auction.created_by === currentUser.id;
    const isAdmin = currentUser.role?.toLowerCase() === 'admin';
    const isL1 = currentUser.role?.toLowerCase() === 'mgr_l1';
    const isL2 = currentUser.role?.toLowerCase() === 'mgr_l2';

    if (isPublicUser) return null; // Hide completely for public view
    if (!isAdmin && !isOwner && !isL1 && !isL2) return null; // Security gate for bar visibility

    const { approval_status, status: operationalStatus } = auction;
    
    return (
        <div className="bg-navy text-white p-6 rounded shadow-lg border-l-8 border-orange mb-8 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange/10 rounded-full">
                        <Shield size={24} className="text-orange" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-orange">Workflow Engine v3.0</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Operational: {getStatusBadge(operationalStatus)}</p>
                            <span className="text-gray-600">|</span>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Approval: {getStatusBadge(approval_status)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {actionLoading ? (
                        <div className="flex items-center gap-2 text-orange font-bold text-sm">
                            <Loader2 size={20} className="animate-spin" /> Processing Transaction...
                        </div>
                    ) : (
                        <>
                            {/* SELLER: Submit Draft or Resubmit after rejection */}
                            {(approval_status === 'DRAFT' || approval_status === 'REJECTED') && (currentUser.role?.toLowerCase() === 'seller' || isAdmin) && isOwner && (
                                <button onClick={() => handleWorkflowAction(approval_status === 'REJECTED' ? 'RESUBMIT' : 'SUBMIT')} 
                                        className="px-6 py-2 bg-orange text-navy font-black rounded hover:bg-white transition-all shadow-lg text-xs">
                                    {approval_status === 'REJECTED' ? 'RESUBMIT FOR REVIEW' : 'SUBMIT TO MGR L1'}
                                </button>
                            )}

                            {/* MGR_L1 Actions */}
                            {approval_status === 'PENDING_L1' && currentUser.role?.toLowerCase() === 'mgr_l1' && (
                                <>
                                    <button onClick={() => handleWorkflowAction('REJECT', 'L1 Rejection')} className="px-4 py-2 bg-red-600 hover:bg-red-700 font-bold rounded text-xs">REJECT</button>
                                    <button onClick={() => handleWorkflowAction('APPROVE_L1')} className="px-4 py-2 bg-green-600 hover:bg-green-700 font-bold rounded text-xs">APPROVE TO L2</button>
                                </>
                            )}

                            {/* MGR_L2 Actions */}
                            {approval_status === 'PENDING_L2' && currentUser.role?.toLowerCase() === 'mgr_l2' && (
                                <>
                                    <button onClick={() => handleWorkflowAction('REJECT', 'L2 Rejection')} className="px-4 py-2 bg-red-600 hover:bg-red-700 font-bold rounded text-xs">REJECT</button>
                                    <button onClick={() => handleWorkflowAction('APPROVE_L2')} className="px-4 py-2 bg-green-600 hover:bg-green-700 font-bold rounded text-xs">APPROVE TO ADMIN</button>
                                </>
                            )}

                            {/* ADMIN Actions */}
                            {isAdmin && (
                                <>
                                    {approval_status === 'PENDING_ADMIN' && (
                                        <div className="flex gap-3">
                                            <button onClick={() => handleWorkflowAction('REJECT', 'Admin Rejection')} className="px-4 py-2 bg-red-600 hover:bg-red-700 font-bold rounded text-xs">REJECT</button>
                                            <button onClick={() => handleWorkflowAction('APPROVE_ADMIN')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 font-bold rounded text-xs">ADMIN SIGN-OFF</button>
                                        </div>
                                    )}
                                    {approval_status === 'READY_TO_PUBLISH' && (
                                        <button onClick={() => handleWorkflowAction('PUBLISH')} className="px-6 py-2 bg-green-500 text-navy font-black rounded hover:bg-white transition-all shadow-lg text-xs">
                                            PUBLISH & ALLOCATE OCI RESOURCES
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Universal Cancel */}
                            {approval_status !== 'PUBLISHED' && approval_status !== 'CANCELLED' && (isAdmin || (currentUser.role?.toLowerCase() === 'seller' && isOwner)) && (
                                <button onClick={() => handleWorkflowAction('CANCEL', 'Withdrawn by user')} className="px-4 py-2 border border-gray-600 text-gray-400 hover:text-white hover:border-white font-bold rounded text-xs">CANCEL</button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-platinum">Loading...</div>;
  if (error && !auction) return <div className="min-h-screen flex items-center justify-center bg-platinum text-red-600 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-platinum flex flex-col relative">
      <Header />
      
      {/* --- Action Header --- */}
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-navy">
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
                        <button onClick={() => { setIsEditing(false); setFormData(auction); setSelectedFile(null); }} className="px-4 py-2 text-gray-600 font-bold text-sm hover:text-red-600 flex items-center gap-1">
                            <X size={16} /> Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700 flex items-center gap-2 disabled:opacity-50">
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                ) : (
                    // v4.0: Buttons only visible for authorized management users
                    checkCanEdit(auction, currentUser) && (
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

        {/* --- v3.0 Workflow Controller --- */}
        {renderWorkflowBar()}

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
                        {renderField("Auction Type", "auction_type")}
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
                                    {renderField("Min Bids Required", "extension_min_total_bids", "number")}
                                </>
                             )}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">
                            {auction.enable_extension ? (
                                <p>
                                    Auto-extension enabled. Extends by <b>{auction.extension_duration_minutes}m</b> if bid within last <b>{auction.extension_trigger_window_minutes}m</b>.
                                    <br />
                                    <span className="text-xs text-gray-500 mt-1 block">
                                        (Minimum <b>{auction.extension_min_total_bids || 1}</b> bids required to trigger)
                                    </span>
                                </p>
                            ) : (
                                <p className="text-gray-400 italic">Auto-extension disabled</p>
                            )}
                        </div>
                    )}
                </div>

                {/* --- ABSOLUTELY REQUIRED: Auction Document Section --- */}
                <div className="bg-white p-6 rounded shadow border-t-4 border-orange">
                    <h3 className="text-sm font-black text-navy uppercase mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-orange" /> Auction Documents
                    </h3>
                    
                    {isEditing ? (
                        <div className="space-y-4">
                             <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">T&C document (Optional)</label>
                                <input 
                                    type="file" 
                                    accept=".pdf,.doc,.docx" 
                                    onChange={handleFileChange}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange/10 file:text-orange hover:file:bg-orange/20 cursor-pointer"
                                />
                                {selectedFile && (
                                    <p className="text-[10px] text-green-600 font-bold mt-1 italic">✓ Selected: {selectedFile.name}</p>
                                )}
                             </div>
                             <div className="mt-4">
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Current File</label>
                                <div className="text-navy text-xs italic">
                                    {auction.auction_doc_url ? formatFileName(auction.auction_doc_url) : 'No document attached'}
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div>
                            {auction.auction_doc_url ? (
                                <a 
                                    href={auction.auction_doc_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-2 text-sm font-bold text-orange hover:text-navy transition-colors bg-orange/5 p-3 rounded border border-orange/20"
                                >
                                    <FileText size={18} />
                                    <span className="truncate">{formatFileName(auction.auction_doc_url)}</span>
                                    <Download size={16} className="ml-auto" />
                                </a>
                            ) : (
                                <p className="text-xs text-gray-400 italic">No document provided for this auction.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. T&C */}
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-sm font-black text-navy uppercase mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-gray-500" /> T&C Text
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
                                        <button 
                                            onClick={() => openLotModal(lot)}
                                            className="text-blue-600 font-bold text-xs hover:underline uppercase"
                                        >
                                            {/* v4.0: Button text changes to View only for non-management roles */}
                                            {currentUser?.role?.toLowerCase() === 'guest' || currentUser?.role?.toLowerCase() === 'buyer' ? 'View Details' : 'View / Edit'}
                                        </button>
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

        {/* --- LOT DETAILS MODAL --- */}
        {selectedLot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                        <div>
                            <h3 className="text-lg font-black text-navy uppercase">
                                Lot #{selectedLot.lot_number || 'N/A'} - {selectedLot.item_name}
                            </h3>
                            <div className="text-xs text-gray-500 font-bold flex gap-2">
                                Status: {getStatusBadge(selectedLot.lot_status)}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isLotEditing ? (
                                <button onClick={() => { setIsLotEditing(false); setLotFormData(selectedLot); setLotError(''); setLotSuccessMsg(''); setNewLotImages([]); setDeleteImageIds([]); }} className="px-3 py-1 text-xs font-bold text-gray-600 hover:text-red-600 border border-gray-300 rounded">
                                    Cancel
                                </button>
                            ) : (
                                // Management logic applied here too
                                checkCanEdit(auction, currentUser) && (
                                    <button onClick={() => setIsLotEditing(true)} className="px-3 py-1 text-xs font-bold bg-navy text-white rounded hover:bg-orange transition-colors">
                                        <Edit size={14} className="inline mr-1"/> Edit Lot
                                    </button>
                                )
                            )}
                            <button onClick={closeLotModal} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Feedback Messages inside Modal */}
                    {lotSuccessMsg && <div className="mx-6 mt-4 p-3 bg-green-100 text-green-800 rounded font-bold text-sm flex items-center gap-2"><CheckCircle size={16}/> {lotSuccessMsg}</div>}
                    {lotError && <div className="mx-6 mt-4 p-3 bg-red-100 text-red-800 rounded font-bold text-sm flex items-center gap-2"><AlertTriangle size={16}/> {lotError}</div>}

                    {/* Modal Body */}
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Left Col */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase text-orange border-b pb-1 mb-2">Material Info</h4>
                                {renderLotField("Lot Number", "lot_number", "text")}
                                {renderLotField("Item Name", "item_name", "text", true)}
                                {renderLotField("Scrap Type", "scrap_type")}
                                {renderLotField("Category", "category")}
                                {renderLotField("Material", "material")}
                                {renderLotField("Grade", "grade")}
                                {renderLotField("Form", "form")}
                            </div>

                            {/* Right Col */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase text-green-600 border-b pb-1 mb-2">Pricing & Logistics</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {renderLotField("Quantity", "quantity", "number", true)}
                                    {renderLotField("Unit", "unit")}
                                </div>
                                {renderLotField("Starting Bid", "starting_bid_amount", "number", true)}
                                {renderLotField("Reserve Price", "reserve_price", "number")}
                                {renderLotField("Min Increment", "min_increment_amount", "number")}
                                
                                <div className="grid grid-cols-2 gap-2">
                                    {renderLotField("City", "location_city")}
                                    {renderLotField("State", "location_state")}
                                </div>
                            </div>
                            
                            {/* Image Section */}
                            <div className="md:col-span-2 space-y-4 border-t pt-4">
                                <h4 className="text-xs font-black uppercase text-blue-600 border-b pb-1 mb-2 flex items-center gap-2">
                                    <ImageIcon size={14}/> Lot Images
                                </h4>
                                
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                    {/* Existing Images */}
                                    {selectedLot.images?.map((img) => (
                                        <div key={img.id} className="relative group aspect-square bg-gray-100 rounded overflow-hidden border">
                                            <img src={img.image_url} alt="Lot" className={`w-full h-full object-cover ${deleteImageIds.includes(img.id) ? 'opacity-30 grayscale' : ''}`} />
                                            {isLotEditing && (
                                                <button 
                                                    onClick={() => toggleImageDelete(img.id)}
                                                    className={`absolute top-1 right-1 p-1 rounded-full shadow-md transition-colors ${deleteImageIds.includes(img.id) ? 'bg-green-500 text-white' : 'bg-white text-red-500 hover:bg-red-50'}`}
                                                >
                                                    {deleteImageIds.includes(img.id) ? <CheckCircle size={14}/> : <Trash2 size={14}/>}
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {/* New Selected Images */}
                                    {newLotImages.map((file, idx) => (
                                        <div key={idx} className="relative aspect-square bg-orange/5 rounded overflow-hidden border border-orange/20">
                                            <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-orange font-bold text-center p-1">
                                                <ImageIcon size={16} className="mb-1"/>
                                                <span className="truncate w-full px-1">{file.name}</span>
                                                <span className="text-green-600">New Upload</span>
                                            </div>
                                            <button 
                                                onClick={() => setNewLotImages(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow-md hover:bg-red-50"
                                            >
                                                <X size={14}/>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Trigger */}
                                    {isLotEditing && (selectedLot.images?.length || 0) - deleteImageIds.length + newLotImages.length < 5 && (
                                        <button 
                                            onClick={() => lotImageInputRef.current.click()}
                                            className="aspect-square border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:text-orange hover:border-orange transition-all"
                                        >
                                            <Upload size={20}/>
                                            <span className="text-[10px] font-bold mt-1 uppercase">Add Image</span>
                                        </button>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={lotImageInputRef} 
                                    onChange={handleNewLotImageChange} 
                                    accept="image/*" 
                                    multiple 
                                    className="hidden" 
                                />
                                <p className="text-[10px] text-gray-400 italic">Max 5 images allowed. Each must be under 3MB.</p>
                            </div>

                            {/* Full Width */}
                            <div className="md:col-span-2 space-y-4 border-t pt-4">
                                {renderLotField("Full Address", "location_address")}
                                {renderLotField("Pickup Conditions", "pickup_conditions")}
                                
                                <div className="mb-4">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Seller Notes</label>
                                    {isLotEditing ? (
                                        <textarea 
                                            name="seller_notes" 
                                            value={lotFormData.seller_notes || ''} 
                                            onChange={handleLotChange} 
                                            className="w-full p-2 border border-gray-300 rounded text-sm"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="text-sm text-navy bg-gray-50 p-2 rounded border border-gray-100">
                                            {lotFormData.seller_notes || '-'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer (Only if editing) */}
                    {isLotEditing && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 sticky bottom-0">
                            <button onClick={handleSaveLot} disabled={lotSaving} className="px-6 py-2 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700 flex items-center gap-2">
                                <Save size={16} /> {lotSaving ? 'Saving...' : 'Save Lot Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default AuctionDetails;
