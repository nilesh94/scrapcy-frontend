import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Save, ArrowLeft, Calendar, DollarSign, FileText, MapPin, Clock, 
  CheckCircle, XCircle, Upload, Info, Plus, Trash2, Package
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { auctionAPI, lotAPI } from '../../services/eAuctionAPI';

const RegisterAuction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // AUCTION DATA - All database fields
  const [auctionData, setAuctionData] = useState({
    auction_title: '',
    auction_type: 'FORWARD',
    category: '',
    region: '',
    scheduled_start_time: '',
    scheduled_end_time: '',
    currency: 'INR',
    emd_amount: '',
    registration_fee: '',
    enable_extension: true,
    extension_trigger_window_minutes: 5,
    extension_duration_minutes: 5,
    extension_min_total_bids: 1,
    inspection_start_date: '',
    inspection_end_date: '',
    inspection_location: '',
    inspection_contact_person: '',
    inspection_contact_number: '',
    terms_and_conditions: '',
    auction_doc_url: '',
  });

  // LOTS DATA - Array of lots with all fields
  const [lots, setLots] = useState([{
    item_name: '',
    scrap_type: 'Ferrous',
    category: '',
    material: '',
    grade: '',
    form: '',
    quantity: '',
    unit: 'MT',
    estimated_weight: '',
    weight_unit: 'KG',
    location_city: '',
    location_state: '',
    location_address: '',
    location_pincode: '',
    pickup_conditions: '',
    starting_bid_amount: '',
    reserve_price: '',
    min_increment_amount: '',
    buy_now_price: '',
    lot_start_time: '',
    lot_end_time: '',
    condition_rating: 3,
    seller_notes: '',
    images: []
  }]);

  const handleAuctionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAuctionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLotChange = (index, field, value) => {
    const updatedLots = [...lots];
    updatedLots[index][field] = value;
    setLots(updatedLots);
  };

  const handleLotFileChange = (index, files) => {
    const updatedLots = [...lots];
    updatedLots[index].images = Array.from(files);
    setLots(updatedLots);
  };

  const addLot = () => {
    setLots([...lots, {
      item_name: '',
      scrap_type: 'Ferrous',
      category: '',
      material: '',
      quantity: '',
      unit: 'MT',
      location_city: '',
      location_state: '',
      starting_bid_amount: '',
      condition_rating: 3,
      images: []
    }]);
  };

  const removeLot = (index) => {
    if (lots.length > 1) {
      setLots(lots.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Step 1: Prepare Combined Payload
      // Extract 'images' from lots as they cannot be sent in JSON
      // Ensure numeric/date fields are null if empty string to match DB requirements
      const lotsPayload = lots.map(({ images, ...lotData }) => ({
        ...lotData,
        quantity: lotData.quantity ? Number(lotData.quantity) : 0,
        starting_bid_amount: lotData.starting_bid_amount ? Number(lotData.starting_bid_amount) : 0,
        reserve_price: lotData.reserve_price ? Number(lotData.reserve_price) : null,
        min_increment_amount: lotData.min_increment_amount ? Number(lotData.min_increment_amount) : null,
        buy_now_price: lotData.buy_now_price ? Number(lotData.buy_now_price) : null,
        lot_start_time: lotData.lot_start_time || null,
        lot_end_time: lotData.lot_end_time || null,
        estimated_weight: lotData.estimated_weight ? Number(lotData.estimated_weight) : null,
      }));

      const fullPayload = {
        ...auctionData,
        emd_amount: auctionData.emd_amount ? Number(auctionData.emd_amount) : null,
        registration_fee: auctionData.registration_fee ? Number(auctionData.registration_fee) : null,
        inspection_start_date: auctionData.inspection_start_date || null,
        inspection_end_date: auctionData.inspection_end_date || null,
        lots: lotsPayload
      };

      console.log('Creating auction with lots payload:', fullPayload);

      // Step 2: Single API Call to Create Auction AND Lots
      const auctionResponse = await auctionAPI.createAuction(fullPayload);
      const auctionId = auctionResponse.id;
      
      // The backend returns the created items with their new IDs in `items` array
      const createdItems = auctionResponse.items || [];

      console.log('✅ Auction created with ID:', auctionId);

      // Step 3: Upload Images 
      // Map local lots to created backend items by index to get the Lot ID
      for (let i = 0; i < lots.length; i++) {
        const localLot = lots[i];
        const createdLot = createdItems[i]; 

        // Only attempt upload if we have images and a valid Lot ID
        if (createdLot && createdLot.id && localLot.images && localLot.images.length > 0) {
          console.log(`Uploading ${localLot.images.length} images for lot ${i + 1}...`);
          try {
            await lotAPI.uploadLotImages(createdLot.id, localLot.images);
            console.log(`Images uploaded for lot ${i + 1}`);
          } catch (uploadError) {
            console.error(`Failed to upload images for lot ${i + 1}:`, uploadError);
            // We do not stop the process here, just log the error
          }
        }
      }

      setSuccessMsg(`🎉 Auction created successfully! ID: ${auctionId}`);
      
      // Redirect to auctions list after 2 seconds
      setTimeout(() => {
        navigate('/e-auction/my-auctions');
      }, 2000);

    } catch (error) {
      console.error('❌ Error creating auction:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create auction';
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      {/* Page Header */}
      <div className="bg-navy text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/admin')}
            className="mb-4 flex items-center gap-2 text-orange hover:text-white transition-colors"
          >
            <ArrowLeft size={20} /> Back to Admin
          </button>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            Register New E-Auction
          </h1>
          <p className="text-orange text-sm font-bold uppercase tracking-widest">
            Create Forward/Reverse/Dutch Auction for Scrap Materials
          </p>
        </div>
      </div>

      <div className="flex-grow max-w-6xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        <div className="bg-white p-8 shadow-2xl rounded-lg border-t-8 border-orange">
          
          {/* Success/Error Messages */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 font-bold flex items-center gap-2">
              <CheckCircle size={20} /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-bold flex items-center gap-2">
              <XCircle size={20} /> {errorMsg}
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-orange' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-orange text-white' : 'bg-gray-300'}`}>
                  1
                </div>
                <span className="font-bold text-sm">Auction Details</span>
              </div>
              <div className="w-12 h-1 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-orange' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-orange text-white' : 'bg-gray-300'}`}>
                  2
                </div>
                <span className="font-bold text-sm">Add Lots</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: AUCTION DETAILS */}
            {currentStep === 1 && (
              <>
                {/* Basic Info */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                  <h3 className="text-lg font-black text-navy uppercase mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-orange" /> Basic Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Auction Title *
                      </label>
                      <input
                        type="text"
                        name="auction_title"
                        value={auctionData.auction_title}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="e.g., Industrial Scrap Metal Auction - February 2025"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Auction Type *
                      </label>
                      <select
                        name="auction_type"
                        value={auctionData.auction_type}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                      >
                        <option value="FORWARD">Forward Auction (Normal - Price Goes Up)</option>
                        <option value="REVERSE">Reverse Auction (Price Goes Down)</option>
                        <option value="DUTCH">Dutch Auction (Descending Price)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={auctionData.category}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="e.g., Ferrous Metals, E-Waste, Plastic"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Region / Coverage Area
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={auctionData.region}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="e.g., Maharashtra, Pan India, Western Region"
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                  <h3 className="text-lg font-black text-navy uppercase mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-orange" /> Auction Schedule
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduled_start_time"
                        value={auctionData.scheduled_start_time}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduled_end_time"
                        value={auctionData.scheduled_end_time}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-2">
                    💡 The auction will auto-publish at start time and auto-close at end time
                  </p>
                </div>

                {/* Financial Terms */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                  <h3 className="text-lg font-black text-navy uppercase mb-4 flex items-center gap-2">
                    <DollarSign size={20} className="text-orange" /> Financial Terms
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={auctionData.currency}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        EMD Amount (₹)
                      </label>
                      <input
                        type="number"
                        name="emd_amount"
                        value={auctionData.emd_amount}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="e.g., 50000"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-600 mt-1">Earnest Money Deposit</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Registration Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="registration_fee"
                        value={auctionData.registration_fee}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="e.g., 1000"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-600 mt-1">One-time registration fee</p>
                    </div>
                  </div>
                </div>

                {/* Inspection Details */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                  <h3 className="text-lg font-black text-navy uppercase mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-orange" /> Inspection Details (Optional)
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Inspection Start Date
                      </label>
                      <input
                        type="datetime-local"
                        name="inspection_start_date"
                        value={auctionData.inspection_start_date}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Inspection End Date
                      </label>
                      <input
                        type="datetime-local"
                        name="inspection_end_date"
                        value={auctionData.inspection_end_date}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Inspection Location
                      </label>
                      <input
                        type="text"
                        name="inspection_location"
                        value={auctionData.inspection_location}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="e.g., Warehouse A, MIDC Taloja, Navi Mumbai, Maharashtra"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        name="inspection_contact_person"
                        value={auctionData.inspection_contact_person}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="e.g., Rajesh Kumar"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Contact Phone Number
                      </label>
                      <input
                        type="tel"
                        name="inspection_contact_number"
                        value={auctionData.inspection_contact_number}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </div>

                {/* Extension Settings */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                  <h3 className="text-lg font-black text-navy uppercase mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-orange" /> Auto-Extension Settings
                  </h3>
                  
                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="enable_extension"
                        checked={auctionData.enable_extension}
                        onChange={handleAuctionChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="font-bold text-sm">Enable Auto-Extension</span>
                    </label>
                    <p className="text-xs text-gray-600 mt-1 ml-7">
                      Automatically extend auction time if bids are placed near closing time (prevents sniping)
                    </p>
                  </div>

                  {auctionData.enable_extension && (
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Trigger Window (minutes)
                        </label>
                        <input
                          type="number"
                          name="extension_trigger_window_minutes"
                          value={auctionData.extension_trigger_window_minutes}
                          onChange={handleAuctionChange}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          min="1"
                          max="30"
                        />
                        <p className="text-xs text-gray-600 mt-1">Extend if bid in last N minutes</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Extension Duration (minutes)
                        </label>
                        <input
                          type="number"
                          name="extension_duration_minutes"
                          value={auctionData.extension_duration_minutes}
                          onChange={handleAuctionChange}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          min="1"
                          max="30"
                        />
                        <p className="text-xs text-gray-600 mt-1">Add N minutes</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Min Bids Required
                        </label>
                        <input
                          type="number"
                          name="extension_min_total_bids"
                          value={auctionData.extension_min_total_bids}
                          onChange={handleAuctionChange}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          min="1"
                        />
                        <p className="text-xs text-gray-600 mt-1">Minimum bids to trigger</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                  <h3 className="text-lg font-black text-navy uppercase mb-4 flex items-center gap-2">
                    <Info size={20} className="text-orange" /> Terms & Conditions
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Auction Terms & Conditions
                      </label>
                      <textarea
                        name="terms_and_conditions"
                        value={auctionData.terms_and_conditions}
                        onChange={handleAuctionChange}
                        rows="6"
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="Enter terms and conditions for this auction..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Document URL (Optional)
                      </label>
                      <input
                        type="url"
                        name="auction_doc_url"
                        value={auctionData.auction_doc_url}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        placeholder="https://example.com/auction-terms.pdf"
                      />
                      <p className="text-xs text-gray-600 mt-1">Link to detailed T&C document</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-3 bg-orange text-white font-bold rounded hover:bg-navy transition-colors uppercase text-sm"
                  >
                    Next: Add Lots →
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: ADD LOTS */}
            {currentStep === 2 && (
              <>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Package className="text-blue-600" size={20} />
                    <p className="text-sm font-bold text-blue-900">
                      Add lots (items) to your auction. Each lot represents individual scrap material that will be bid on separately.
                    </p>
                  </div>
                </div>

                {lots.map((lot, index) => (
                  <div key={index} className="bg-platinum/20 p-6 rounded-lg border-2 border-orange mb-6 relative">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-black text-navy uppercase flex items-center gap-2">
                        <Package size={20} className="text-orange" /> Lot #{index + 1}
                      </h3>
                      {lots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLot(index)}
                          className="text-red-600 hover:text-red-800 font-bold text-sm flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Remove Lot
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Item Name */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Item Name / Description *
                        </label>
                        <input
                          type="text"
                          value={lot.item_name}
                          onChange={(e) => handleLotChange(index, 'item_name', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="e.g., MS Scrap - Turning Boring 500 MT"
                          required
                        />
                      </div>

                      {/* Scrap Type */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Scrap Type *
                        </label>
                        <select
                          value={lot.scrap_type}
                          onChange={(e) => handleLotChange(index, 'scrap_type', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                        >
                          <option value="Ferrous">Ferrous</option>
                          <option value="Non-Ferrous">Non-Ferrous</option>
                          <option value="E-Waste">E-Waste</option>
                          <option value="Plastic">Plastic</option>
                          <option value="Paper">Paper</option>
                          <option value="Glass">Glass</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={lot.category}
                          onChange={(e) => handleLotChange(index, 'category', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="e.g., Metal, Electronics"
                        />
                      </div>

                      {/* Material, Grade, Form */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Material
                        </label>
                        <input
                          type="text"
                          value={lot.material}
                          onChange={(e) => handleLotChange(index, 'material', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="e.g., Mild Steel, Copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Grade
                        </label>
                        <input
                          type="text"
                          value={lot.grade}
                          onChange={(e) => handleLotChange(index, 'grade', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="e.g., A, B, C"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Form
                        </label>
                        <input
                          type="text"
                          value={lot.form}
                          onChange={(e) => handleLotChange(index, 'form', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="e.g., Sheet, Pipe, Wire"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Quantity *
                        </label>
                        <div className="flex">
                          <input
                            type="number"
                            value={lot.quantity}
                            onChange={(e) => handleLotChange(index, 'quantity', e.target.value)}
                            className="w-2/3 p-3 border border-r-0 border-platinum rounded-l focus:border-orange outline-none"
                            placeholder="500"
                            step="0.01"
                            required
                          />
                          <select
                            value={lot.unit}
                            onChange={(e) => handleLotChange(index, 'unit', e.target.value)}
                            className="w-1/3 p-3 border border-platinum rounded-r focus:border-orange outline-none bg-gray-50"
                          >
                            <option value="MT">MT (Metric Ton)</option>
                            <option value="KG">KG</option>
                            <option value="TON">Ton</option>
                            <option value="UNIT">Unit</option>
                            <option value="LOT">Lot</option>
                          </select>
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={lot.location_city}
                          onChange={(e) => handleLotChange(index, 'location_city', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="e.g., Mumbai"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={lot.location_state}
                          onChange={(e) => handleLotChange(index, 'location_state', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="e.g., Maharashtra"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Full Address with Pincode
                        </label>
                        <textarea
                          value={lot.location_address}
                          onChange={(e) => handleLotChange(index, 'location_address', e.target.value)}
                          rows="2"
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="Complete pickup address..."
                        ></textarea>
                      </div>

                      {/* Pickup Conditions */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Pickup Conditions / Access Notes
                        </label>
                        <input
                          type="text"
                          value={lot.pickup_conditions}
                          onChange={(e) => handleLotChange(index, 'pickup_conditions', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="e.g., 24ft truck entry available, weighbridge on-site"
                        />
                      </div>

                      {/* Bidding Details */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Starting Bid Amount (₹) *
                        </label>
                        <input
                          type="number"
                          value={lot.starting_bid_amount}
                          onChange={(e) => handleLotChange(index, 'starting_bid_amount', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="25000"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Reserve Price (₹)
                        </label>
                        <input
                          type="number"
                          value={lot.reserve_price}
                          onChange={(e) => handleLotChange(index, 'reserve_price', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="24000"
                          step="0.01"
                        />
                        <p className="text-xs text-gray-600 mt-1">Minimum acceptable price</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Min Bid Increment (₹)
                        </label>
                        <input
                          type="number"
                          value={lot.min_increment_amount}
                          onChange={(e) => handleLotChange(index, 'min_increment_amount', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="500"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Buy Now Price (₹)
                        </label>
                        <input
                          type="number"
                          value={lot.buy_now_price}
                          onChange={(e) => handleLotChange(index, 'buy_now_price', e.target.value)}
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="30000"
                          step="0.01"
                        />
                        <p className="text-xs text-gray-600 mt-1">Instant purchase price (optional)</p>
                      </div>

                      {/* Condition Rating */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Condition Rating (1-5 stars)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={lot.condition_rating}
                            onChange={(e) => handleLotChange(index, 'condition_rating', e.target.value)}
                            className="flex-grow"
                          />
                          <span className="font-bold text-orange text-lg w-12 text-center">
                            {lot.condition_rating} ⭐
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>Poor</span>
                          <span>Fair</span>
                          <span>Good</span>
                          <span>Very Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>

                      {/* Seller Notes */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-navy mb-1">
                          Seller Notes / Additional Details
                        </label>
                        <textarea
                          value={lot.seller_notes}
                          onChange={(e) => handleLotChange(index, 'seller_notes', e.target.value)}
                          rows="3"
                          className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          placeholder="Provide detailed description, condition notes, special instructions..."
                        ></textarea>
                      </div>

                      {/* Images */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-navy mb-2 flex items-center gap-2">
                          <Upload size={16} className="text-orange" />
                          Upload Images (Max 5, Min 1 Required)
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleLotFileChange(index, e.target.files)}
                          className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-xs file:font-semibold
                            file:bg-orange/10 file:text-orange
                            hover:file:bg-orange/20 cursor-pointer"
                        />
                        {lot.images && lot.images.length > 0 && (
                          <p className="text-xs text-green-600 mt-2 font-bold">
                            ✓ {lot.images.length} image(s) selected
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Another Lot Button */}
                <button
                  type="button"
                  onClick={addLot}
                  className="w-full py-3 border-2 border-dashed border-orange text-orange font-bold rounded hover:bg-orange hover:text-white transition-colors uppercase text-sm flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Add Another Lot
                </button>

                {/* Navigation */}
                <div className="flex justify-between gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-3 bg-gray-300 text-navy font-bold rounded hover:bg-gray-400 transition-colors uppercase text-sm"
                  >
                    ← Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-navy text-white font-bold rounded hover:bg-orange transition-colors uppercase text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Save size={18} /> Create Auction
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterAuction;
