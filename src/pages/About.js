import React from 'react';
import { Building2, Users, Globe, Award, Anchor, Target, Zap } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />

      {/* --- HERO SECTION --- */}
      <div className="bg-navy text-white py-20 px-6 border-b-8 border-orange relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 opacity-5">
            <Anchor size={400} />
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <span className="text-orange font-black tracking-widest uppercase text-xs mb-2 block">Our Story</span>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
               Revolutionizing <br/>Industrial <span className="text-orange">Scrap.</span>
            </h1>
            <p className="text-xl text-platinum/80 max-w-2xl font-light leading-relaxed">
               Scrapcy is India’s first verified, tech-driven marketplace dedicated to making scrap trading transparent, efficient, and secure.
            </p>
         </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full -mt-12 relative z-20">
         
         {/* Mission Grid */}
         <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card 
               icon={<Target size={32} className="text-white"/>} 
               title="Our Mission" 
               desc="To organize the unorganized scrap sector by providing a digital platform that ensures fair pricing and zero-fraud transactions."
               color="bg-orange"
            />
            <Card 
               icon={<Zap size={32} className="text-white"/>} 
               title="Our Vision" 
               desc="To become the global standard for industrial recycling logistics and material procurement."
               color="bg-blue-600"
            />
            <Card 
               icon={<Globe size={32} className="text-white"/>} 
               title="Our Reach" 
               desc="Connecting over 500+ Mandis and 200+ Steel Mills across 12 states in India."
               color="bg-green-600"
            />
         </div>

         {/* Detailed Section */}
         <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-platinum-dark">
            <div className="grid md:grid-cols-2">
               <div className="p-12 space-y-6">
                  <h2 className="text-3xl font-black uppercase text-navy tracking-tight">Why We Started</h2>
                  <div className="h-1 w-20 bg-orange"></div>
                  <p className="text-steel font-medium leading-relaxed">
                     The industrial scrap market has traditionally been opaque, dominated by middlemen, and plagued by cash-flow issues. We saw an opportunity to bring <strong>trust and technology</strong> to this sector.
                  </p>
                  <p className="text-steel font-medium leading-relaxed">
                     By leveraging real-time data and a strict verification process for every seller, Scrapcy ensures that what you bid for is exactly what you get.
                  </p>
                  
                  <div className="pt-6 grid grid-cols-2 gap-6">
                     <div className="flex items-center gap-3">
                        <Award className="text-orange" size={24} />
                        <span className="text-navy font-bold text-sm uppercase">ISO Certified</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Users className="text-orange" size={24} />
                        <span className="text-navy font-bold text-sm uppercase">10k+ Traders</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Building2 className="text-orange" size={24} />
                        <span className="text-navy font-bold text-sm uppercase">500+ Mills</span>
                     </div>
                  </div>
               </div>
               
               {/* Image Side */}
               <div className="bg-steel/10 min-h-[400px] relative">
                  <img 
                     src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1000" 
                     alt="Industrial Plant" 
                     className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
               </div>
            </div>
         </div>

      </div>

      <Footer />
    </div>
  );
};

// Helper Card Component
const Card = ({ icon, title, desc, color }) => (
   <div className={`${color} text-white p-8 shadow-xl rounded-lg transform hover:-translate-y-2 transition-transform duration-300`}>
      <div className="mb-4 p-3 bg-white/20 w-fit rounded">{icon}</div>
      <h3 className="text-xl font-black uppercase mb-3 tracking-wide">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed font-medium">{desc}</p>
   </div>
);

export default About;
