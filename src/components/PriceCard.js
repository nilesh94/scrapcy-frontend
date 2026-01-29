import React from 'react';
import { Lock, ShieldCheck, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const PriceCard = ({ item, averagePrice, isUnlocked, onUnlock, className = "" }) => {
  
  // --- INTERNAL LOGIC: Determine Status ---
  const getPriceComparison = () => {
    // Fallback if no average
    if (!averagePrice) return { 
        status: 'Avg', color: '#6b7280', bgClass: 'bg-gray-500', icon: <Minus size={16} strokeWidth={3} />, angle: 90 
    };

    const diff = item.price - averagePrice;
    const threshold = averagePrice * 0.02; // 2% buffer

    if (diff > threshold) {
      return { 
        status: 'High', 
        color: '#dc2626', // For SVG Stroke
        bgClass: 'bg-red-600', // For Badge
        icon: <ArrowUpRight size={16} strokeWidth={3} />, 
        angle: 30 // Points Right (to Red section)
      };
    }
    if (diff < -threshold) {
      return { 
        status: 'Low', 
        color: '#16a34a', 
        bgClass: 'bg-green-600',
        icon: <ArrowDownRight size={16} strokeWidth={3} />, 
        angle: 150 // Points Left (to Green section)
      };
    }
    return { 
      status: 'Avg', 
      color: '#eab308', 
      bgClass: 'bg-yellow-500',
      icon: <Minus size={16} strokeWidth={3} />, 
      angle: 90 // Points Up (Yellow section)
    };
  };

  const { status, color, bgClass, icon, angle } = getPriceComparison();

  // --- SVG GAUGE SETUP ---
  const radius = 35;
  const centerX = 50;
  const centerY = 45;
  const strokeWidth = 6; // Slightly thinner for cleaner look

  // Helper function to calculate arc path
  const describeArc = (startAngle, endAngle) => {
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY - radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY - radius * Math.sin(endRad);

      return [
          "M", x1, y1,
          "A", radius, radius, 0, 0, 1, x2, y2
      ].join(" ");
  };

  // --- FIXED SEGMENTS (Green -> Red) ---
  const segments = [
      { color: '#16a34a', start: 180, end: 144 }, // Left: Dark Green (Low Price)
      { color: '#84cc16', start: 144, end: 108 }, // Light Green
      { color: '#eab308', start: 108, end: 72 },  // Center: Yellow (Avg)
      { color: '#f97316', start: 72, end: 36 },   // Orange
      { color: '#dc2626', start: 36, end: 0 }     // Right: Red (High Price)
  ];

  // Calculate Needle Position
  const needleRad = (angle * Math.PI) / 180; 
  const needleLength = 28;
  const needleX = centerX + needleLength * Math.cos(needleRad);
  const needleY = centerY - needleLength * Math.sin(needleRad);
  const needleColor = "#1e293b"; // Tailwind slate-800

  return (
    <div className={`relative bg-white rounded-xl border border-platinum shadow-lg hover:shadow-2xl hover:border-orange transition-all duration-300 overflow-hidden flex flex-col ${className}`}>
      
      {/* 1. HEADER */}
      <div className="p-5 pb-0 flex justify-between items-start">
        <div>
           <h3 className="text-lg font-black uppercase text-navy leading-tight tracking-tight">{item.material}</h3>
           <p className="text-xs font-bold text-steel uppercase mt-1 tracking-wider flex items-center gap-1">
             {item.location} <span className="text-orange">•</span> {item.type}
           </p>
        </div>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wide text-white shadow-sm ${bgClass}`}>
            {icon} {status}
        </div>
      </div>
      
      {/* 2. SVG GAUGE VISUALIZATION */}
      <div className="flex justify-center -my-2 relative z-0">
          <svg width="140" height="90" viewBox="0 0 100 65" className="overflow-visible filter drop-shadow-sm">
            {/* Segments */}
            {segments.map((seg, i) => (
                <path 
                    key={i} 
                    d={describeArc(seg.start, seg.end)} 
                    fill="none" 
                    stroke={seg.color} 
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="opacity-90"
                />
            ))}
            
            {/* Needle */}
            <line 
              x1={centerX} y1={centerY} 
              x2={needleX} y2={needleY} 
              stroke={needleColor} 
              strokeWidth="3" 
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
            
            {/* Pivot */}
            <circle cx={centerX} cy={centerY} r="3" fill={needleColor} />
            
            {/* Status Text under Gauge */}
            <text x={centerX} y={centerY + 18} textAnchor="middle" fontSize="9" fontWeight="800" fill="#94a3b8" className="uppercase tracking-widest">
                VS AVG
            </text>
          </svg>
      </div>

      {/* 3. PRICE DISPLAY */}
      <div className="text-center px-5 pb-5 flex-grow">
        <p className="text-3xl font-black text-navy tracking-tighter">₹{item.price.toLocaleString()}</p>
        {averagePrice && (
             <p className="text-xs font-bold text-steel mt-1 uppercase tracking-wide">
               National Avg: <span className="text-navy">₹{Math.round(averagePrice).toLocaleString()}</span>
             </p>
        )}
      </div>
      
      {/* 4. FOOTER / ACTION */}
      <div className="mt-auto border-t border-platinum bg-gray-50/50">
        {isUnlocked ? (
          <div className="p-4 bg-green-50/50">
            <p className="text-[10px] font-black uppercase text-green-600 flex items-center justify-center gap-1 mb-1">
               <ShieldCheck size={12}/> Verified Seller
            </p>
            <p className="text-sm font-bold text-navy text-center uppercase tracking-wide">{item.contact}</p>
          </div>
        ) : (
          <button 
            onClick={() => onUnlock(item.id)}
            className="w-full py-4 font-black uppercase text-xs text-white bg-orange hover:bg-navy transition-colors flex items-center justify-center gap-2 tracking-widest"
          >
            <Lock size={14} /> Unlock Contact
          </button>
        )}
      </div>
    </div>
  );
};

export default PriceCard;
