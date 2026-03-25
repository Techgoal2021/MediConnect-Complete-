import React from "react";
import { Link } from "react-router-dom";
import Heroimg from "../Image/Hero/home-banner.jpg";

const Hero = () => {
  return (
    <section className="relative w-full overflow-visible mb-32 lg:mb-40">
      {/* 1. Background Wrapper */}
      <div className="relative w-full h-[600px] lg:h-[90vh] bg-medical overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={Heroimg}
            alt="Medical Professional"
            className="w-full h-full object-cover object-center lg:object-right scale-110"
          />
          {/* Subtle Blue Tint Overlay */}
          <div className="absolute inset-0 bg-navy/5 mix-blend-multiply"></div>
          {/* Light to Dark Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        {/* 2. Content Layer */}
        <div className="relative z-10 container mx-auto px-6 lg:px-20 h-full flex items-center">
          <div className="max-w-2xl">
              <h5 className="text-primary font-bold tracking-[0.4em] uppercase mb-6 flex items-center">
                <span className="w-12 h-[2px] bg-primary mr-4"></span>
                We Provide Best Healthcare
              </h5>
              <h1 className="text-5xl lg:text-7xl font-serif font-black text-navy leading-[1.1] mb-8">
                Your Health is Our <br />
                <span className="text-primary italic">Priority</span> & Commitment
              </h1>
              <p className="text-slate-500 text-lg max-w-lg mb-12 leading-relaxed font-medium">
                MediConnect combines world-class medical expertise with cutting-edge technology to bring healthcare directly to your doorstep.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/departments" className="btn-medcare-primary shadow-[0_10px_30px_rgba(44,110,160,0.3)]">
                  Make Appointment
                </Link>
                <Link to="/about" className="btn-medcare-outline">
                  Learn More
                </Link>
              </div>
          </div>
        </div>
      </div>

      {/* 3. Overlapping Feature Boxes */}
      <div className="container mx-auto px-6 lg:px-20 -mt-20 lg:-mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100/50">
          
          {/* Card 1: Emergency */}
          <div className="bg-primary p-12 text-white flex flex-col items-start group">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition duration-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Emergency Cases</h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">Our response team is available 24/7 for critical medical situations and urgent consultations.</p>
            <div className="text-2xl font-black tracking-tighter">+234 812 345 6789</div>
          </div>

          {/* Card 2: Doctors Schedule */}
          <div className="bg-navy p-12 text-white flex flex-col items-start group">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition duration-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Doctors Schedule</h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">Browse our vast network of verified specialists and view their real-time availability for bookings.</p>
            <Link to="/specialists" className="text-primary font-black uppercase tracking-widest border-b-2 border-primary pb-1 group-hover:pl-4 transition-all duration-300">View Specialists ⟶</Link>
          </div>

          {/* Card 3: Online Appointment */}
          <div className="bg-white p-12 text-navy flex flex-col items-start group border-r border-slate-100">
            <div className="w-14 h-14 bg-medical rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition duration-500">
               <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Online Appointment</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Book a consultation instantly by filtering through our specialized medical departments.</p>
            <Link to="/departments" className="text-navy font-black uppercase tracking-widest border-b-2 border-navy pb-1 group-hover:pl-4 transition-all duration-300">Book Now ⟶</Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
