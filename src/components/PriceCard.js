import React from 'react';
import { 
  Lock, ShieldCheck, ArrowUpRight, ArrowDownRight, Minus 
} from 'lucide-react';

const PriceCard = ({ item, averagePrice, isUnlocked, onUnlock, className = "" }) => {
  
  // --- INTERNAL LOGIC: Determine Status & Colors ---
  const getPriceComparison = () => {
    // If no average is provided (fallback), treat as Avg
    if (!averagePrice) return { 
        status: 'Avg', badgeClass: 'bg-gray-500 text-white', icon: <Minus size={16} strokeWidth={3} />, needle: '0deg', gaugeColor: 'bg-gray-500' 
    };

    const diff = item.price - averagePrice;
    const threshold = averagePrice * 0.02; // 2% buffer

    if (diff > threshold) {
      return { 
        status: 'High', 
        badgeClass: 'bg-red-600 text-white', 
        icon: <ArrowUpRight size={16} strokeWidth={3} />, 
        needle: '45deg',
        gaugeColor: 'bg-red-600'
      };
    }
    if (diff < -threshold) {
      return { 
        status: 'Low', 
        badgeClass: 'bg-green-600 text-white', 
        icon: <ArrowDownRight size={16} strokeWidth={3} />, 
        needle: '-45deg',
        gaugeColor: 'bg-green-600'
      };
    }
    return { 
      status: 'Avg', 
      badgeClass: 'bg-gray-500 text-white', 
      icon: <Minus size={16} strokeWidth={3} />, 
      needle: '0deg',
      gaugeColor: 'bg-gray-500'
    };
  };

  const { status, badgeClass, icon, needle, gaugeColor } = getPriceComparison();

  return (
    <div className={`relative group border-4 border-platinum p-8 bg-white transition-all hover:border-navy hover:shadow-xl rounded-xl ${className}`}>
      
      {/* 1. Header with SOLID COLOR BADGE */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-black uppercase text-navy">{item.material}</h3>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-1 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-sm ${badgeClass}`}>
            {icon} {status}
        </div>
      </div>
      
      {/* Sub-header */}
      <p className="text-sm font-bold text-steel uppercase mb-6">
        {item.location} • {item.type}
      </p>
      
      {/* 2. Gauge Visualization */}
      <div className="flex justify-center mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="relative w-28 h-14 overflow-hidden">
            {/* Gauge Background (Gray Arc) */}
            <div className="absolute top-0 left-0 w-28 h-28 rounded-full border-[8px] border-platinum border-b-transparent"></div>
            
            {/* Needle */}
            <div 
                className="absolute bottom-0 left-1/2 w-1.5 h-14 bg-navy origin-bottom transition-transform duration-700 ease-out z-10"
                style={{ transform: `translateX(-50%) rotate(${needle})` }}
            ></div>
            
            {/* Center Dot (Color Coded) */}
            <div className={`absolute bottom-0 left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 translate-y-1/2 z-20 border-2 border-white ${gaugeColor}`}></div>
          </div>
      </div>

      {/* Price Display */}
      <div className="text-center mb-4">
        <p className="text-5xl font-black text-navy tracking-tighter">₹{item.price.toLocaleString()}</p>
        <p className="text-xs text-steel font-bold mt-2">
           Daily Change: <span className={item.change > 0 ? "text-green-600" : "text-red-600"}>{item.change > 0 ? '+' : ''}{item.change}</span>
        </p>
      </div>
      
      {/* 3. Unlock Section */}
      {isUnlocked ? (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600 rounded">
          <p className="text-[10px] font-black uppercase text-green-700 flex items-center gap-1">
             <ShieldCheck size={12}/> Verified Contact:
          </p>
          <p className="text-sm font-bold text-navy mt-1">{item.contact}</p>
        </div>
      ) : (
        <div className="mt-6">
          <button 
            onClick={() => onUnlock(item.id)}
            className="bg-orange hover:bg-navy text-white w-full py-3 font-black uppercase text-xs transition-colors flex items-center justify-center gap-2 rounded shadow-md hover:shadow-lg"
          >
            <Lock size={14} /> Unlock ($5)
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceCard;
