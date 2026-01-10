import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trash2, MapPin, Phone, Mail, User, Truck, Tag } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AdminListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`https://scrapcy-backend-new-1.onrender.com/scrap/${id}`);
        setListing(res.data);
        if (res.data.images?.length > 0) {
            setSelectedImage(res.data.images[0].image_url);
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if(!window.confirm("Permanently delete this listing and its images?")) return;
    try {
        await axios.delete(`https://scrapcy-backend-new-1.onrender.com/scrap/${id}`);
        alert("Deleted successfully.");
        navigate('/admin/listings');
    } catch (err) {
        alert("Delete failed.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-navy">Loading...</div>;
  if (!listing) return <div className="min-h-screen flex items-center justify-center font-bold text-red-600">Listing Not Found</div>;

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />

      {/* Top Bar */}
      <div className="bg-navy text-white py-6 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
             <Link to="/admin/listings" className="flex items-center gap-2 text-orange hover:text-white font-bold uppercase text-xs tracking-widest transition-colors">
                <ArrowLeft size={16} /> Back to List
             </Link>
             <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Trash2 size={16} /> Delete Entry
             </button>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid md:grid-cols-2 gap-8">
            
            {/* LEFT: Image Gallery */}
            <div className="space-y-4">
                <div className="bg-white p-2 rounded-lg shadow-lg border-2 border-orange h-96">
                    {selectedImage ? (
                        <img src={selectedImage} alt="Main Preview" className="w-full h-full object-contain bg-gray-100 rounded" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No Image</div>
                    )}
                </div>
                {/* Thumbnails */}
                {listing.images?.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {listing.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setSelectedImage(img.image_url)}
                                className={`w-20 h-20 flex-shrink-0 border-2 rounded overflow-hidden transition-all ${selectedImage === img.image_url ? 'border-orange ring-2 ring-orange/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <img src={img.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: Details */}
            <div className="space-y-6">
                
                {/* Header Info */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-navy">
                    <span className="bg-orange/10 text-orange px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2 inline-block">
                        {listing.scrap_type} Scrap
                    </span>
                    
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-navy mb-1">{listing.quantity} {listing.unit}</h1>
                            <p className="text-xl text-gray-600 font-medium">₹{listing.price_per_unit} <span className="text-sm text-gray-400 uppercase">{listing.price_unit}</span></p>
                        </div>

                        {/* --- NEW CAPACITY DISPLAY --- */}
                        {listing.monthly_capacity && (
                            <div className="text-right pl-4 border-l border-gray-100 ml-4">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Monthly Capacity</p>
                                <p className="text-lg font-black text-navy leading-none">{listing.monthly_capacity}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid gap-4">
                    {/* Location Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-black text-steel uppercase mb-4 border-b pb-2">Pickup Location</h3>
                        <div className="space-y-3">
                            <div className="flex gap-3 text-sm text-gray-700">
                                <MapPin className="text-orange flex-shrink-0" size={18} />
                                <p>{listing.address}</p>
                            </div>
                            {listing.pickup_conditions && (
                                <div className="flex gap-3 text-sm text-gray-700">
                                    <Truck className="text-orange flex-shrink-0" size={18} />
                                    <p><span className="font-bold">Access:</span> {listing.pickup_conditions}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seller Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-black text-steel uppercase mb-4 border-b pb-2">Seller Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="text-gray-400" size={16} />
                                <span className="font-bold text-navy">{listing.seller_name}</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <Tag className="text-gray-400" size={16} />
                                <span className="text-gray-600">{listing.company_name}</span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                                <Mail className="text-gray-400" size={16} />
                                <a href={`mailto:${listing.email}`} className="text-orange hover:underline">{listing.email}</a>
                            </div>
                             <div className="flex items-center gap-2 col-span-2">
                                <Phone className="text-gray-400" size={16} />
                                <span className="text-gray-700 font-mono">{listing.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {listing.description && (
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                             <h3 className="text-sm font-black text-steel uppercase mb-2">Description</h3>
                             <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminListingDetail;
