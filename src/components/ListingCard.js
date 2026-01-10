import React, { useState } from 'react';
import { 
  LayoutDashboard, MapPin, Phone, Trash2, ExternalLink, 
  Calendar, Package, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ListingCard = ({ item, onDelete }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const nextImage = (e) => {
    e.preventDefault();
    if (item.images?.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    if (item.images?.length > 1) {
      setCurrentImgIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border-t-4 border-orange group flex flex-col h-full">
      
      {/* --- IMAGE SLIDER --- */}
      <div className="h-48 bg-gray-200 relative overflow-hidden group-image">
        {item.images && item.images.length > 0 ? (
            <>
                <img 
                    src={item.images[currentImgIndex].image_url} 
                    alt="Scrap" 
                    className="w-full h-full object-cover transition-transform duration-500"
                />
                
                {item.images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={20} /></button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={20} /></button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {item.images.map((_, idx) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentImgIndex ? 'bg-orange' : 'bg-white/60'}`} />
                            ))}
                        </div>
                    </>
                )}
            </>
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400"><LayoutDashboard size={40} /></div>
        )}
        
        {/* --- BADGES (UPDATED) --- */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {/* Level 1: Generic Type (e.g. Metal Scrap) */}
            <span className="bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-sm">
                {item.scrap_type}
            </span>
            {/* Level 3: Specific Material (e.g. Copper) - We saved this in 'grade' column for backward compatibility */}
            <span className="bg-orange text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow">
                {item.grade ? item.grade.split('(')[0] : 'Unknown'}
            </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-black text-navy leading-tight mb-1">
                    {item.quantity} {item.unit}
                </h3>
                <p className="text-sm text-steel font-medium">
                    ₹{item.price_per_unit} {item.price_unit}
                </p>
            </div>
            <div className="text-right">
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">ACTIVE</span>
            </div>
        </div>
        
        <div className="mb-3">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                🔄 Monthly Capacity: {item.monthly_capacity || "N/A"}
            </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex items-start gap-2">
                <Package size={16} className="text-orange mt-1 flex-shrink-0" />
                <span className="line-clamp-2">{item.description || "No description provided."}</span>
            </div>
            <div className="flex items-center gap-2">
                <MapPin size={16} className="text-orange flex-shrink-0" />
                <span className="truncate">{item.address}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-orange flex-shrink-0" />
                <span>Added: {formatDate(item.created_at)}</span>
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 p-4 pt-0 border-t border-gray-100 mt-auto">
          <Link to={`/admin/listings/${item.id}`} className="flex justify-center items-center gap-2 text-xs font-bold uppercase py-2 bg-platinum hover:bg-gray-200 text-navy rounded transition-colors">
              <ExternalLink size={14} /> View
          </Link>
          <button onClick={() => onDelete(item.id)} className="flex justify-center items-center gap-2 text-xs font-bold uppercase py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors">
              <Trash2 size={14} /> Delete
          </button>
      </div>
    </div>
  );
};

export default ListingCard;
