import React from 'react';
import { Lock, ShieldCheck, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const PriceCard = ({ item, averagePrice, isUnlocked, onUnlock, className = "" }) => {
  
  // --- INTERNAL LOGIC: Determine Status ---
  const getPriceComparison = () => {
    // Fallback if no average
    if (!averagePrice) return { 
        status: 'Avg', color: '#6b7280', icon: <Minus size={16} strokeWidth={3} />, angle: 90 
    };

    const diff = item.price - averagePrice;
    const threshold = averagePrice * 0.02; // 2% buffer

    if (diff > threshold) {
      return { 
        status: 'High', 
        color: '#dc2626', // Red Badge
        icon: <ArrowUpRight size={16} strokeWidth={3} />, 
        angle: 30 // Points Right (to Red section)
      };
    }
    if (diff < -threshold) {
      return { 
        status: 'Low', 
        color: '#16a34a', // Green Badge
        icon: <ArrowDownRight size={16} strokeWidth={3} />, 
        angle: 150 // Points Left (to Green section)
      };
    }
    return { 
      status: 'Avg', 
      color: '#6b7280', // Gray Badge
      icon: <Minus size={16} strokeWidth={3} />, 
      angle: 90 // Points Up (Yellow section)
    };
  };

  const { status, color, icon, angle } = getPriceComparison();

  // --- SVG GAUGE SETUP ---
  const radius = 35;
  const centerX = 50;
  const centerY = 45;
  const strokeWidth = 8;

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
  const needleLength = 30;
  const needleX = centerX + needleLength * Math.cos(needleRad);
  const needleY = centerY - needleLength * Math.sin(needleRad);
  const needleColor = "#1f2937"; 

  return (
    <div className={`relative group border-4 border-platinum p-6 bg-white transition-all hover:border-navy hover:shadow-xl rounded-xl ${className}`}>
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-start mb-2">
        <div>
           <h3 className="text-xl font-black uppercase text-navy leading-none">{item.material}</h3>
           <p className="text-xs font-bold text-steel uppercase mt-1">
             {item.location} • {item.type}
           </p>
        </div>
        
        {/* Status Badge */}
        <div 
          className="flex items-center gap-1 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-sm text-white"
          style={{ backgroundColor: color }}
        >
            {icon} {status}
        </div>
      </div>
      
      {/* 2. SVG GAUGE VISUALIZATION */}
      <div className="flex justify-center my-4">
          <svg width="140" height="85" viewBox="0 0 100 65" className="overflow-visible">
            {/* Segments */}
            {segments.map((seg, i) => (
                <path 
                    key={i} 
                    d={describeArc(seg.start, seg.end)} 
                    fill="none" 
                    stroke={seg.color} 
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                />
            ))}
            
            {/* Needle */}
            <line 
              x1={centerX} y1={centerY} 
              x2={needleX} y2={needleY} 
              stroke={needleColor} 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            
            {/* Pivot */}
            <circle cx={centerX} cy={centerY} r="4" fill={needleColor} />
            
            {/* Status Label */}
            <text x={centerX} y={centerY + 20} textAnchor="middle" fontSize="11" fontWeight="800" fill="#4b5563" className="uppercase">
                {status}
            </text>
          </svg>
      </div>

      {/* 3. PRICE DISPLAY */}
      <div className="text-center mb-4">
        <p className="text-4xl font-black text-navy tracking-tighter">₹{item.price.toLocaleString()}</p>
        {averagePrice && (
             <p className="text-xs font-bold text-gray-400 mt-1">
               Avg: ₹{Math.round(averagePrice).toLocaleString()}
             </p>
        )}
      </div>
      
      {/* 4. UNLOCK BUTTON */}
      {isUnlocked ? (
        <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-600 rounded">
          <p className="text-[10px] font-black uppercase text-green-700 flex items-center gap-1">
             <ShieldCheck size={12}/> Verified Contact:
          </p>
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
