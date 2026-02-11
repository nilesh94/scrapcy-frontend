import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Gavel, DollarSign, Shield, Truck, AlertTriangle, 
  Scale, ArrowLeft, Info 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />

      {/* --- HERO SECTION --- */}
      <div className="bg-navy text-white pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-orange hover:text-white transition-colors mb-6 font-bold uppercase text-xs tracking-widest">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Terms & <span className="text-orange">Conditions</span>
          </h1>
          <p className="text-platinum/80 text-lg max-w-2xl leading-relaxed">
            Please read these terms carefully. By registering or bidding on Scrapcy, you agree to be bound by these rules governing auctions, payments, and logistics.
          </p>
        </div>
        {/* Decorative Element */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="flex-grow w-full max-w-5xl mx-auto px-4 -mt-12 mb-20 relative z-20">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-orange">
          
          <div className="p-8 md:p-12 space-y-12">

            {/* 1. SCOPE */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-platinum pb-3 mb-4">
                <div className="p-2 bg-navy/10 rounded text-navy"><FileText size={24} /></div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">1. Auction Scope & Eligibility</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-navy mb-2">1.1 Scope of Material</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our platform deals exclusively in specified scrap categories including <strong>ferrous metals, non-ferrous metals, and plastic scrap</strong>. Materials are sourced directly from industries and factories.
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-navy mb-2">1.2 "As-Is" Sale</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    All materials are sold on an <strong>"As-Is, Where-Is"</strong> basis. The Platform does not guarantee quality, weight, or grade. Buyers are strongly advised to inspect materials at the seller's location before bidding.
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 pl-2 border-l-4 border-orange">
                <strong>Eligibility:</strong> All users must register with valid details (Company Name, GST Number). Failure to verify GST will result in denial of service.
              </p>
            </section>

            {/* 2. AUCTION MECHANISM */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-platinum pb-3 mb-4">
                <div className="p-2 bg-navy/10 rounded text-navy"><Gavel size={24} /></div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">2. Auction Mechanism</h2>
              </div>
              <ul className="space-y-3 text-gray-700 list-disc pl-5">
                <li><strong>Formats:</strong> We support Forward Auctions and Reverse Auctions strictly following government-standard bidding flows.</li>
                <li><strong>Binding Bids:</strong> All bids placed are final. Any malpractice (e.g., artificial inflation) will lead to account restriction.</li>
                <li><strong>Soft Close:</strong> The platform may enforce a "Soft Close" rule, extending the end time briefly if bids are placed near closing to ensure fair price discovery.</li>
                <li><strong>Sale Order:</strong> A deal is finalized only when the Seller issues a <strong>Sale Order</strong> (typically within 7 days of H1 finalization). The H1 bidder must e-sign the auction catalog upon winning.</li>
              </ul>
            </section>

            {/* 3. EMD & FEES */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-platinum pb-3 mb-4">
                <div className="p-2 bg-navy/10 rounded text-navy"><DollarSign size={24} /></div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">3. EMD & Financials</h2>
              </div>

              {/* Warning Box */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r flex gap-4 items-start">
                <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-red-800 text-sm uppercase">Important Payment Warning</h4>
                  <p className="text-xs text-red-700 mt-1">
                    EMD must be transferred to the <strong>Scrapcy Company Account</strong>. If a bidder transfers EMD directly to a seller, the platform is not responsible for refunds, and the bidder remains ineligible to participate.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-bold text-navy mb-2">Processing Fees & Refunds</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Unsuccessful bidders will receive refunds within <strong>1-2 working days</strong>.</li>
                    <li>• A processing fee of <strong>0.1%</strong> of the EMD amount is deducted from refunds.</li>
                    <li className="text-xs italic text-gray-400">(e.g., For ₹3,00,000 EMD, ₹300 is deducted).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-2">Forfeiture Policy</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    If a winning bidder fails to pay or violates the contract, <strong>100% of the EMD is forfeited</strong>.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold bg-platinum px-3 py-2 rounded">
                    <span className="text-navy">Split:</span>
                    <span className="text-green-600">75% to Seller</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-orange">25% to Platform</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. PAYMENTS */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-platinum pb-3 mb-4">
                <div className="p-2 bg-navy/10 rounded text-navy"><Shield size={24} /></div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">4. Payments</h2>
              </div>
              <p className="text-gray-700">
                The winning buyer must transfer the full transaction amount <strong>directly to the Seller's bank account</strong>. 
                The Platform acts solely as a facilitator and does not collect, hold, or disburse auction proceeds.
              </p>
              <p className="text-sm text-gray-500 italic">
                * The Platform assumes no liability for non-payment or delays. Such disputes are strictly between the Buyer and Seller.
              </p>
            </section>

            {/* 5. LOGISTICS */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-platinum pb-3 mb-4">
                <div className="p-2 bg-navy/10 rounded text-navy"><Truck size={24} /></div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">5. Logistics & Delivery</h2>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><strong>Buyer Responsibility:</strong> The Buyer must arrange and pay for transportation, labor, loading, equipment, and insurance.</p>
                <p><strong>No Platform Liability:</strong> Scrapcy does not provide logistics services. We are not responsible for delays, damage during transit, or vehicle detention charges.</p>
                <p><strong>Risk Transfer:</strong> All risk of loss or damage transfers to the Buyer the moment goods are taken into possession at the Seller's facility.</p>
              </div>
            </section>

            {/* 6. DISPUTES & GENERAL */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-platinum pb-3 mb-4">
                <div className="p-2 bg-navy/10 rounded text-navy"><Scale size={24} /></div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">6. Disputes & General</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-navy mb-2 flex items-center gap-2"><Info size={16}/> Resolution</h4>
                  <p className="text-sm text-gray-600">
                    The Platform may act as a neutral mediation help desk to facilitate communication but is <strong>not a decision-maker</strong> in commercial disputes regarding quality or payments.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-2 flex items-center gap-2"><Info size={16}/> Platform Charges</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Seller Commission:</strong> 0.5% to 0.75% (deducted from H1 EMD).<br/>
                    <strong>Taxes:</strong> All charges are exclusive of GST.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                Governing Law: These terms are governed by the laws of India. Jurisdiction: [Insert City/State Courts].
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsConditions;
