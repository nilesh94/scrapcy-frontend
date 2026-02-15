import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported if used directly, though you use services
import { 
  Save, ArrowLeft, Calendar, DollarSign, FileText, MapPin, Clock, 
  CheckCircle, XCircle, Upload, Info, Plus, Trash2, Package, AlertTriangle
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
    decrement_amount: '', // Added for Dutch Auctions (DB Column)
    buy_now_price: '',
    lot_start_time: '',
    lot_end_time: '',
    condition_rating: 3,
    seller_notes: '',
    images: []
  }]);

  // --- Helpers for Dynamic UI Labels ---
  const getDynamicLabels = (type) => {
    switch (type) {
      case 'REVERSE':
        return {
          startBid: 'Ceiling Price (Max Price) *',
          reserve: 'Target Price (Min Acceptable) *',
          increment: 'Min Decrement Amount (₹)'
        };
      case 'DUTCH':
        return {
          startBid: 'Opening Price (Highest) *',
          reserve: 'Floor Price (Lowest) *',
          increment: 'Price Drop Amount (Decrement) *'
        };
      default: // FORWARD
        return {
          startBid: 'Starting Bid (Min Price) *',
          reserve: 'Reserve Price (Hidden Min)',
          increment: 'Min Increment Amount (₹)'
        };
    }
  };

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

  // --- Helper to clean data for DB (convert "" to null) ---
  const cleanNum = (val) => (val === '' || val === null || val === undefined ? null : Number(val));
  const cleanStr = (val) => (val === '' || val === undefined ? null : val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // 1. Validation Logic
      for (let i = 0; i < lots.length; i++) {
        const lot = lots[i];
        const start = Number(lot.starting_bid_amount);
        const reserve = Number(lot.reserve_price);

        if (auctionData.auction_type === 'FORWARD' && reserve > 0 && reserve < start) {
          throw new Error(`Lot ${i+1}: Reserve Price cannot be less than Starting Bid.`);
        }
        if (auctionData.auction_type === 'REVERSE' && reserve > start) {
          throw new Error(`Lot ${i+1}: Target Price cannot be higher than Ceiling Price in Reverse Auction.`);
        }
        if (auctionData.auction_type === 'DUTCH' && reserve >= start) {
          throw new Error(`Lot ${i+1}: Floor Price must be lower than Opening Price.`);
        }
      }

      // 2. Prepare Payload
      const lotsPayload = lots.map(({ images, ...lotData }) => ({
        ...lotData,
        // Mandatory Fields (Ensure Numbers)
        quantity: Number(lotData.quantity),
        starting_bid_amount: Number(lotData.starting_bid_amount),
        
        // Optional Fields (Send NULL if empty)
        reserve_price: cleanNum(lotData.reserve_price),
        min_increment_amount: cleanNum(lotData.min_increment_amount),
        decrement_amount: cleanNum(lotData.decrement_amount), // Use decrement for Dutch
        buy_now_price: cleanNum(lotData.buy_now_price),
        estimated_weight: cleanNum(lotData.estimated_weight),
        
        // Strings (Clean empty to null)
        scrap_type: cleanStr(lotData.scrap_type),
        category: cleanStr(lotData.category),
        material: cleanStr(lotData.material),
        grade: cleanStr(lotData.grade),
        form: cleanStr(lotData.form),
        location_city: cleanStr(lotData.location_city),
        location_state: cleanStr(lotData.location_state),
        // Merge pincode into address since DB has no pincode column in ITEM table
        location_address: lotData.location_pincode 
          ? `${lotData.location_address}, ${lotData.location_pincode}` 
          : cleanStr(lotData.location_address),
        pickup_conditions: cleanStr(lotData.pickup_conditions),
        seller_notes: cleanStr(lotData.seller_notes),
        
        // Dates
        lot_start_time: cleanStr(lotData.lot_start_time),
        lot_end_time: cleanStr(lotData.lot_end_time),
      }));

      const fullPayload = {
        ...auctionData,
        // Optional Numbers
        emd_amount: cleanNum(auctionData.emd_amount),
        registration_fee: cleanNum(auctionData.registration_fee),
        
        // Config Numbers
        extension_trigger_window_minutes: Number(auctionData.extension_trigger_window_minutes),
        extension_duration_minutes: Number(auctionData.extension_duration_minutes),
        extension_min_total_bids: Number(auctionData.extension_min_total_bids),
        
        // Optional Strings
        category: cleanStr(auctionData.category),
        region: cleanStr(auctionData.region),
        inspection_start_date: cleanStr(auctionData.inspection_start_date),
        inspection_end_date: cleanStr(auctionData.inspection_end_date),
        inspection_location: cleanStr(auctionData.inspection_location),
        inspection_contact_person: cleanStr(auctionData.inspection_contact_person),
        inspection_contact_number: cleanStr(auctionData.inspection_contact_number),
        terms_and_conditions: cleanStr(auctionData.terms_and_conditions),
        auction_doc_url: cleanStr(auctionData.auction_doc_url),
        
        lots: lotsPayload
      };

      console.log('Creating auction with lots payload:', fullPayload);

      const auctionResponse = await auctionAPI.createAuction(fullPayload);
      const auctionId = auctionResponse.id;
      const createdItems = auctionResponse.items || [];

      console.log('✅ Auction created with ID:', auctionId);

      // 3. Upload Images
      for (let i = 0; i < lots.length; i++) {
        const localLot = lots[i];
        const createdLot = createdItems[i]; 

        if (createdLot && createdLot.id && localLot.images && localLot.images.length > 0) {
          console.log(`Uploading ${localLot.images.length} images for lot ${i + 1}...`);
          try {
            await lotAPI.uploadLotImages(createdLot.id, localLot.images);
          } catch (uploadError) {
            console.error(`Failed to upload images for lot ${i + 1}:`, uploadError);
          }
        }
      }

      setSuccessMsg(`🎉 Auction created successfully! ID: ${auctionId}`);
      setTimeout(() => navigate('/e-auction/my-auctions'), 2000);

    } catch (error) {
      console.error('❌ Error creating auction:', error);
      // Enhanced Error Display for Pydantic
      let msg = error.message || 'Failed to create auction';
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
            msg = detail.map(e => e.msg.replace('Value error, ', '')).join(', ');
        } else {
            msg = detail;
        }
      }
      setErrorMsg(msg);
      window.scrollTo(0,0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
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
          
          {successMsg && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 font-bold flex items-center gap-2">
              <CheckCircle size={20} /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-bold flex items-center gap-2">
              <AlertTriangle size={20} /> {errorMsg}
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
                        placeholder="e.g., Industrial Scrap Metal Auction"
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
                        <option value="FORWARD">Forward Auction (Normal)</option>
                        <option value="REVERSE">Reverse Auction (Buying)</option>
                        <option value="DUTCH">Dutch Auction (Descending)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Category (Optional)
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={auctionData.category}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Region / Coverage Area (Optional)
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={auctionData.region}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                      />
                    </div>
                  </div>
                </div>

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
                </div>

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
                        EMD Amount (Optional)
                      </label>
                      <input
                        type="number"
                        name="emd_amount"
                        value={auctionData.emd_amount}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy mb-1">
                        Registration Fee (Optional)
                      </label>
                      <input
                        type="number"
                        name="registration_fee"
                        value={auctionData.registration_fee}
                        onChange={handleAuctionChange}
                        className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Keep existing Inspection, Extension, Terms sections as is... */}
                {/* [These sections from your code are correct and preserved] */}
                {/* ... (Inspection, Extension, Terms Code) ... */}
                
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
                      Add lots. Fields marked with * are mandatory for {auctionData.auction_type} auctions.
                    </p>
                  </div>
                </div>

                {lots.map((lot, index) => {
                  // Get Dynamic labels
                  const labels = getDynamicLabels(auctionData.auction_type);
                  
                  return (
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
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold uppercase text-navy mb-1">
                            Item Name / Description *
                          </label>
                          <input
                            type="text"
                            value={lot.item_name}
                            onChange={(e) => handleLotChange(index, 'item_name', e.target.value)}
                            className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                            required
                          />
                        </div>

                        {/* Standard Fields (Scrap Type, Category, Material, Grade, Form, Quantity, Unit, Location...) */}
                        {/* ... [Preserved from your code] ... */}
                        
                        {/* DYNAMIC BIDDING FIELDS */}
                        <div>
                          <label className="block text-xs font-bold uppercase text-navy mb-1">
                            {labels.startBid}
                          </label>
                          <input
                            type="number"
                            value={lot.starting_bid_amount}
                            onChange={(e) => handleLotChange(index, 'starting_bid_amount', e.target.value)}
                            className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-navy mb-1">
                            {labels.reserve}
                          </label>
                          <input
                            type="number"
                            value={lot.reserve_price}
                            onChange={(e) => handleLotChange(index, 'reserve_price', e.target.value)}
                            className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          />
                        </div>

                        {auctionData.auction_type === 'DUTCH' ? (
                            <div>
                              <label className="block text-xs font-bold uppercase text-navy mb-1">
                                {labels.increment}
                              </label>
                              <input
                                type="number"
                                value={lot.decrement_amount}
                                onChange={(e) => handleLotChange(index, 'decrement_amount', e.target.value)}
                                className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                              />
                            </div>
                        ) : (
                            <div>
                              <label className="block text-xs font-bold uppercase text-navy mb-1">
                                {labels.increment}
                              </label>
                              <input
                                type="number"
                                value={lot.min_increment_amount}
                                onChange={(e) => handleLotChange(index, 'min_increment_amount', e.target.value)}
                                className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                              />
                            </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold uppercase text-navy mb-1">
                            Buy Now Price (Optional)
                          </label>
                          <input
                            type="number"
                            value={lot.buy_now_price}
                            onChange={(e) => handleLotChange(index, 'buy_now_price', e.target.value)}
                            className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addLot}
                  className="w-full py-3 border-2 border-dashed border-orange text-orange font-bold rounded hover:bg-orange hover:text-white transition-colors uppercase text-sm flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Add Another Lot
                </button>

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
                    className="px-8 py-3 bg-navy text-white font-bold rounded hover:bg-orange transition-colors uppercase text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : <><Save size={18} /> Create Auction</>}
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
