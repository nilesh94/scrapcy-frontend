import React from 'react';
import { Calendar, Clock, MapPin, Package } from 'lucide-react';

const AuctionScrollCard = ({ auction, onClick }) => {
  return (
    <div 
      onClick={() => onClick(auction)}
      className="min-w-[300px] bg-white border-b-4 border-orange rounded-xl p-5 shadow-lg hover:translate-y-[-5px] transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
          auction.status === 'LIVE' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'
        }`}>
          {auction.status}
        </span>
        <span className="text-steel font-bold text-xs">#{auction.id}</span>
      </div>
      
      <h3 className="text-navy font-black uppercase text-lg leading-tight mb-4 group-hover:text-orange transition-colors">
        {auction.title}
      </h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-steel text-sm font-semibold">
          <Calendar size={14} className="text-orange" /> {auction.date}
        </div>
        <div className="flex items-center gap-2 text-steel text-sm font-semibold">
          <Clock size={14} className="text-orange" /> {auction.time}
        </div>
        <div className="flex items-center gap-2 text-steel text-sm font-semibold">
          <Package size={14} className="text-orange" /> {auction.quantity}
        </div>
        <div className="flex items-center gap-2 text-steel text-sm font-semibold">
          <MapPin size={14} className="text-orange" /> {auction.location}
        </div>
      </div>
    </div>
  );
};

export default AuctionScrollCard;
