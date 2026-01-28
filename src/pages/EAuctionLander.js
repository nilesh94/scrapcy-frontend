import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, Zap, ShieldCheck, ArrowRight, Timer, Trophy } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const EAuctionLander = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-platinum">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-0 left-0 w-full h-96 bg-navy/5 -skew-y-3 z-0 transform origin-top-left" />

        <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[600px]">
          
          {/* LEFT SIDE: Visual & Headline */}
          <div className="bg-navy w-full md:w-2/5 p-10 md:p-16 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-orange animate-pulse"/>
                  <span className="text-xs font-bold uppercase tracking-widest text-orange">Live Bidding Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                Scrapcy <br/>
                <span className="text-orange">E-Auction</span>
              </h1>
              
              <p className="text-blue-100 text-lg font-medium leading-relaxed max-w-md">
                The high-velocity marketplace for serious industrial players. Secure your scrap supply with our transparent, real-time bidding engine.
              </p>
            </div>

            <div className="relative z-10 mt-12 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="bg-orange/20 p-3 rounded-lg"><Trophy size={24} className="text-orange" /></div>
                  <div>
                    <div className="text-2xl font-black">₹450 Cr+</div>
                    <div className="text-xs uppercase tracking-widest text-white/50">Trade Value Facilitated</div>
                  </div>
               </div>
               <p className="text-xs text-white/40 font-medium">* Powered by Scrapcy Engine™</p>
            </div>
          </div>

          {/* RIGHT SIDE: Features & CTA */}
          <div className="w-full md:w-3/5 p-10 md:p-16 bg-white flex flex-col justify-center">
            <h2 className="text-3xl font-black text-navy uppercase mb-2">
              Why Choose E-Auction?
            </h2>
            <p className="text-steel mb-10">Maximize value with our precision-engineered bidding tools.</p>

            <div className="grid gap-8">
              {/* Feature 1 */}
              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                  <Timer size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-navy uppercase">On-Spot Winner & Instant Close</h4>
                  <p className="text-sm text-steel mt-1 leading-relaxed">
                    No waiting periods. Winners are declared immediately. Use our <span className="font-bold text-orange">Buy Now</span> feature to close deals instantly at a winning bid.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-orange/10 text-orange rounded-2xl group-hover:bg-orange group-hover:text-white transition-colors shadow-sm">
                  <Gavel size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-navy uppercase">Precise Bidding System</h4>
                  <p className="text-sm text-steel mt-1 leading-relaxed">
                    Granular control over your bids with real-time updates. Our engine ensures fair play and accurate price discovery.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-navy uppercase">Verified Network</h4>
                  <p className="text-sm text-steel mt-1 leading-relaxed">
                    Trade safely with 100% verified sellers and a massive database of industrial buyers connecting daily.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100">
              <button 
                onClick={() => navigate('/register')} 
                className="w-full md:w-auto px-8 py-4 bg-navy hover:bg-orange text-white font-black uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
              >
                Register for E-Auction <ArrowRight size={20} />
              </button>
              <p className="text-xs text-slate-400 mt-4 font-medium flex items-center gap-2">
                <ShieldCheck size={14} /> Verification required for bidding eligibility.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EAuctionLander;
