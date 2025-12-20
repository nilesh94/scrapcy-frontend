import React from 'react';
import { Lock, ShieldCheck, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const PriceCard = ({ item, averagePrice, isUnlocked, onUnlock, className = "" }) => {
  
  // Logic: Compare Current Price vs National Average
  const getPriceComparison = () => {
    if (!averagePrice) return { 
        status: 'Avg', color: '#6b7280', icon: <Minus size={16} strokeWidth={3} />, angle: 90 
    };

    const diff = item.price - averagePrice;
    const threshold = averagePrice * 0.02; // 2% buffer

    if (diff > threshold) {
      return { 
        status: 'High', 
        color: '#dc2626', // Red
        icon: <ArrowUpRight size={16} strokeWidth={3} />, 
        angle: 30 // Needle points Right
      };
    }
    if (diff < -threshold) {
      return { 
        status: 'Low', 
        color: '#16a34a', // Green
        icon: <ArrowDownRight size={16} strokeWidth={3} />, 
        angle: 150 // Needle points Left
      };
    }
    return { 
      status: 'Avg', 
      color: '#6b7280', // Gray
      icon: <Minus size={16} strokeWidth={3} />, 
      angle: 90 // Needle points Up
    };
  };

  const { status, color, icon, angle } = getPriceComparison();

  // SVG Gauge Math
  const radius = 35;
  const centerX = 50;
  const centerY = 45;
  const rad = (angle * Math.PI) / 180;
  const needleLength = 30;
  const needleX = centerX + needleLength * Math.cos(-rad);
  const needleY = centerY + needleLength * Math.sin(-rad);

  return (
    <div className={`relative group border-4 border-platinum p-6 bg-white transition-all hover:border-navy hover:shadow-xl rounded-xl ${className}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
           <h3 className="text-xl font-black uppercase text-navy leading-none">{item.material}</h3>
           <p className="text-xs font-bold text-steel uppercase mt-1">{item.location} • {item.type}</p>
        </div>
        <div 
          className="flex items-center gap-1 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-sm text-white"
          style={{ backgroundColor: color }}
        >
            {icon} {status}
        </div>
      </div>
      
      {/* Gauge */}
      <div className="flex justify-center my-4">
          <svg width="140" height="70" viewBox="0 0 100 50" className="overflow-visible">
            <path d="M 15 45 A 35 35 0 0 1 85 45" fill="none" stroke="#e6e6e6" strokeWidth="8" strokeLinecap="round" />
            <path d="M 15 45 A 35 35 0 0 1 85 45" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
            <line x1={centerX} y1={centerY} x2={needleX} y2={needleY} stroke="#0a192f" strokeWidth="3" strokeLinecap="round" />
            <circle cx={centerX} cy={centerY} r="3" fill="white" stroke={color} strokeWidth="2" />
          </svg>
      </div>

      {/* Price */}
      <div className="text-center mb-4">
        <p className="text-4xl font-black text-navy tracking-tighter">₹{item.price.toLocaleString()}</p>
        <p className="text-xs text-steel font-bold mt-2">
           Daily Change: <span style={{ color: item.change > 0 ? '#16a34a' : (item.change < 0 ? '#dc2626' : '#6b7280') }}>
             {item.change > 0 ? '+' : ''}{item.change}
           </span>
        </p>
      </div>
      
      {/* Unlock Button */}
      {isUnlocked ? (
        <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-600 rounded">
          <p className="text-[10px] font-black uppercase text-green-700 flex items-center gap-1"><ShieldCheck size={12}/> Verified Contact:</p>
          <p className="text-sm font-bold text-navy mt-1">{item.contact}</p>
        </div>
      ) : (
        <div className="mt-4">
          <button 
            onClick={() => onUnlock(item.id)}
            className="w-full py-3 font-black uppercase text-xs text-white transition-colors flex items-center justify-center gap-2 rounded shadow-md hover:shadow-lg hover:bg-navy"
            style={{ backgroundColor: '#ff6b00' }}
          >
            <Lock size={14} /> Unlock ($5)
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceCard;
