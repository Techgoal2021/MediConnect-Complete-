import React from "react";
import img3 from "../Image/About/about-img.png";

const About = () => {
  return (
    <section className="py-24 lg:py-32 overflow-hidden bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column: Image with accent */}
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-navy/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img src={img3} alt="Medical Excellence" className="w-full h-auto transform hover:scale-105 transition duration-700" />
            </div>
            {/* Experience Badge */}
            <div className="absolute bottom-10 -left-6 lg:-left-12 bg-primary text-white p-8 rounded-sm shadow-xl z-20 hidden md:block">
               <div className="text-4xl font-black">25+</div>
               <div className="text-xs font-bold uppercase tracking-widest mt-2">Years of <br/> Experience</div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h5 className="text-primary font-black tracking-[0.4em] uppercase text-xs flex items-center">
                <span className="w-10 h-[2px] bg-primary mr-3"></span>
                About MediConnect
              </h5>
              <h2 className="text-4xl lg:text-5xl font-serif font-black text-navy leading-tight">
                Second to None <span className="text-primary italic">Healthcare</span> Excellence
              </h2>
            </div>
            
            <p className="text-slate-500 text-lg leading-relaxed font-normal italic">
              "Our mission is to bridge the gap between world-class medical specialists and patients who need them most, regardless of where they are."
            </p>
            
            <p className="text-gray-600 leading-[1.8] font-medium">
              We understand that finding the right specialist can be overwhelming. MediConnect simplifies this journey by providing a verified network of medical experts, seamless booking, and secure consultations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="flex items-start space-x-4">
                <div className="text-primary text-2xl font-black">✓</div>
                <div>
                  <h4 className="font-bold text-navy uppercase text-[13px] tracking-widest mb-1">Expert Doctors</h4>
                  <p className="text-xs text-slate-400 font-bold">Only 1% of applicants pass our verification.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-primary text-2xl font-black">✓</div>
                <div>
                  <h4 className="font-bold text-navy uppercase text-[13px] tracking-widest mb-1">Quick Booking</h4>
                  <p className="text-xs text-slate-400 font-bold">Book a slot in under 60 seconds.</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
               <button className="btn-medcare-primary">Read More ⟶</button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
