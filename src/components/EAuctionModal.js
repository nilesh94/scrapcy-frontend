import React from 'react';
import { X, Gavel, Zap, ShieldCheck, Users, ArrowRight } from 'lucide-react';

const EAuctionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-navy p-2 rounded-full transition-all"
        >
          <X size={24} />
        </button>

        {/* LEFT SIDE: Visual & Headline */}
        <div className="bg-navy w-full md:w-2/5 p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-orange rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <Gavel size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">
              Scrapcy <br/>
              <span className="text-orange">E-Auction</span>
            </h2>
            <p className="text-blue-100 text-sm font-medium leading-relaxed">
              Experience the future of scrap trading. A high-velocity, transparent marketplace designed for serious industrial players.
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Powered By</p>
            <div className="text-xl font-bold">Scrapcy Engine™</div>
          </div>
        </div>

        {/* RIGHT SIDE: Features & CTA */}
        <div className="w-full md:w-3/5 p-8 md:p-10 bg-white">
          <h3 className="text-xl font-black text-navy uppercase mb-6 flex items-center gap-2">
            Why Choose Our Auction?
          </h3>

          <div className="grid gap-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-navy text-sm uppercase">On-Spot Winner & Instant Close</h4>
                <p className="text-xs text-slate-500 mt-1">No waiting periods. Winners are declared immediately. Use our <span className="font-bold text-orange">Buy Now</span> feature to close deals instantly at a winning bid.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-orange/10 text-orange rounded-lg group-hover:bg-orange group-hover:text-white transition-colors">
                <Gavel size={20} />
              </div>
              <div>
                <h4 className="font-bold text-navy text-sm uppercase">Precise Bidding System</h4>
                <p className="text-xs text-slate-500 mt-1">Granular control over your bids with real-time updates. Our engine ensures fair play and accurate price discovery.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-navy text-sm uppercase">Verified Network</h4>
                <p className="text-xs text-slate-500 mt-1">Trade safely with 100% verified sellers and a massive database of industrial buyers connecting daily.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <button 
              onClick={() => window.location.href = '/register-auction'} 
              className="w-full py-4 bg-navy hover:bg-orange text-white font-black uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              Register for E-Auction <ArrowRight size={18} />
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
              * Verification required for bidding eligibility.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EAuctionModal;
