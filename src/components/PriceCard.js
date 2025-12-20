import React from 'react';
import { Lock, ShieldCheck, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const PriceCard = ({ item, averagePrice, isUnlocked, onUnlock, className = "" }) => {

  // --- INTERNAL LOGIC: Determine Status ---
  // This logic remains the same to determine where the needle points.
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
        color: '#dc2626', // Red for badge
        icon: <ArrowUpRight size={16} strokeWidth={3} />,
        angle: 30 // Point Right (Green section)
      };
    }
    if (diff < -threshold) {
      return {
        status: 'Low',
        color: '#16a34a', // Green for badge
        icon: <ArrowDownRight size={16} strokeWidth={3} />,
        angle: 150 // Point Left (Red section)
      };
    }
    return {
      status: 'Avg',
      color: '#6b7280', // Gray for badge
      icon: <Minus size={16} strokeWidth={3} />,
      angle: 90 // Point Up (Yellow section)
    };
  };

  const { status, color, icon, angle } = getPriceComparison();

  // --- SVG GAUGE SETUP ---
  const radius = 35;
  const centerX = 50;
  const centerY = 45;
  const strokeWidth = 8;

  // Helper function to calculate the SVG path for an arc segment
  // Angles: 180=Left, 90=Up, 0=Right
  const describeArc = (startAngle, endAngle) => {
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate start and end points (using -sin for SVG coordinate system)
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY - radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY - radius * Math.sin(endRad);

      // Create the arc path: Move to start, Arc to end.
      // 0,0,1 means no large arc, draw clockwise.
      return [
          "M", x1, y1,
          "A", radius, radius, 0, 0, 1, x2, y2
      ].join(" ");
  };

  // Define the 5 colored segments for the gauge
  const segments = [
      { color: '#dc2626', start: 180, end: 144 }, // Red
      { color: '#f97316', start: 144, end: 108 }, // Orange
      { color: '#eab308', start: 108, end: 72 },  // Yellow
      { color: '#84cc16', start: 72, end: 36 },   // Light Green
      { color: '#16a34a', start: 36, end: 0 }     // Dark Green
  ];

  // Calculate Needle Position based on angle
  const needleRad = (angle * Math.PI) / 180;
  const needleLength = 30;
  const needleX = centerX + needleLength * Math.cos(needleRad);
  const needleY = centerY - needleLength * Math.sin(needleRad);
  const needleColor = "#1f2937"; // Dark gray for a realistic look

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

        {/* Status Badge (Kept for clarity in addition to the gauge) */}
        <div
          className="flex items-center gap-1 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-sm text-white"
          style={{ backgroundColor: color }}
        >
            {icon} {status}
        </div>
      </div>

      {/* 2. SVG GAUGE VISUALIZATION (Multi-Colored) */}
      <div className="flex justify-center my-4">
          {/* Increased viewBox height to fit the new label below */}
          <svg width="140" height="85" viewBox="0 0 100 65" className="overflow-visible">
            {/* Draw each colored segment */}
            {segments.map((seg, i) => (
                <path
                    key={i}
                    d={describeArc(seg.start, seg.end)}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt" // "butt" ensures sharp transitions between colors
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

            {/* Center Pivot Dot */}
            <circle cx={centerX} cy={centerY} r="4" fill={needleColor} />

            {/* Status Label below gauge, matching the reference image */}
            <text x={centerX} y={centerY + 20} textAnchor="middle" fontSize="11" fontWeight="800" fill="#4b5563" className="uppercase">
                {status}
            </text>
          </svg>
      </div>

      {/* 3. PRICE DISPLAY */}
      <div className="text-center mb-4">
        <p className="text-4xl font-black text-navy tracking-tighter">₹{item.price.toLocaleString()}</p>
        {/* Display Average Price below, as seen in image_1.png */}
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
