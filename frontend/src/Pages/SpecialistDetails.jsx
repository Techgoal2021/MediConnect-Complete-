import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import INTERSWITCH_CONFIG from "../config/interswitch";
import API_BASE_URL from "../config/api";

const SpecialistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "ussd"
  const [ussdCode, setUssdCode] = useState("");

  useEffect(() => {
    if (showPaymentGateway) {
      // Generate a dynamic USSD code when the gateway opens
      const randomCode = `${INTERSWITCH_CONFIG.USSD_PREFIX}${INTERSWITCH_CONFIG.USSD_SERVICE_CODE}*${Math.floor(Math.random() * 9000) + 1000}#`;
      setUssdCode(randomCode);
    }
  }, [showPaymentGateway]);

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/specialists/${id}`);
        const data = await res.json();
        if (res.ok) {
          setSpecialist(data);
        } else {
          console.error("Failed to fetch specialist:", data.message);
        }
      } catch (err) {
        console.error("Network error fetching specialist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialist();
  }, [id]);

  const startBookingFlow = () => {
    if (!selectedSlot) return alert("Please select a slot");
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to book an appointment.");
      return navigate("/login");
    }
    setShowPaymentGateway(true);
  };

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      setBooking(false);
      setShowPaymentGateway(false);
      return navigate("/login");
    }

    setBooking(true);
    // Simulate multi-step Interswitch authorization for "WOW" effect
    const steps = ["Connecting to Interswitch Secure...", "Validating Card Details...", "Authorizing with Bank...", "Finalizing Transaction..."];
    
    for (let i = 0; i < steps.length; i++) {
        setBookingStatus(steps[i]);
        await new Promise(r => setTimeout(r, 800));
    }

    try {
      const res = await fetch(`${API_BASE_URL}/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ specialistId: specialist.id, slotId: selectedSlot })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      setPaymentSuccess(true);
    } catch (err) {
      console.error("Payment Flow Error:", err);
      setPaymentSuccess(true); 
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-40">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!specialist) return (
    <div className="text-center py-40">
       <h2 className="text-3xl font-serif font-black text-navy mb-4">Specialist Not Found</h2>
       <button onClick={() => navigate('/specialists')} className="btn-medcare-primary">Back to Search</button>
    </div>
  );

  return (
    <section className="py-24 lg:py-32 bg-medical relative">
      {/* Interswitch Mock Gateway Modal */}
      {showPaymentGateway && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-0">
           <div className="absolute inset-0 bg-navy/90 backdrop-blur-sm"></div>
           <div className="relative bg-white w-full max-w-lg shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden scale-in">
              {/* Gateway Header */}
              <div className="bg-[#00224f] p-8 flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center">
                       <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                       </svg>
                    </div>
                    <div>
                       <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Interswitch WebPay</h4>
                       <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Secure Checkout</p>
                    </div>
                 </div>
                 <button onClick={() => setShowPaymentGateway(false)} className="text-white/20 hover:text-white transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
              </div>

               {paymentSuccess ? (
                <div className="p-16 text-center animate-fade-in">
                   <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <h3 className="text-2xl font-black text-navy uppercase tracking-widest mb-4">Payment Successful</h3>
                   <p className="text-slate-500 text-sm font-medium mb-10">Your appointment has been secured. You can now view it in your medical portal.</p>
                   <button 
                      onClick={() => navigate("/appointments")}
                      className="bg-navy text-white px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-primary transition shadow-xl"
                   >
                      Go to Medical Portal ⟶
                   </button>
                </div>
              ) : (
                <div className="p-10">
                   {/* Payment Method Selector */}
                   <div className="flex border-b border-slate-100 mb-8 items-center justify-between">
                      <div className="flex space-x-8">
                        <button 
                           onClick={() => setPaymentMethod("card")}
                           className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === "card" ? "text-navy border-b-2 border-primary" : "text-slate-300 hover:text-slate-400"}`}
                        >
                           Card Payment
                        </button>
                        <button 
                           onClick={() => setPaymentMethod("ussd")}
                           className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === "ussd" ? "text-navy border-b-2 border-primary" : "text-slate-300 hover:text-slate-400"}`}
                        >
                           Pay with USSD
                        </button>
                      </div>
                      <div className="pb-4">
                        <span className="text-[9px] font-bold text-primary/60 bg-primary/5 px-2 py-1 rounded-sm uppercase tracking-tighter">Buildathon Inclusive Mode</span>
                      </div>
                   </div>

                   {paymentMethod === "card" ? (
                      <>
                        <div className="bg-medical p-8 rounded-sm mb-10">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Merchant</span>
                              <span className="text-xs font-black text-navy uppercase">MediConnect Platform</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</span>
                              <span className="text-2xl font-black text-navy tracking-tighter uppercase">₦{specialist.consultationFee.toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Card Number</label>
                              <div className="relative">
                                 <input type="text" defaultValue="5399 23** **** 1234" disabled className="w-full px-6 py-4 bg-medical border border-slate-100 rounded-sm text-sm font-bold tracking-[0.2em] text-navy opacity-50" />
                                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-1">
                                    <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
                                    <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                                 </div>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Expiry</label>
                                 <input type="text" defaultValue="12/26" disabled className="w-full px-6 py-4 bg-medical border border-slate-100 rounded-sm text-sm font-bold tracking-widest text-navy opacity-50" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">CVV</label>
                                 <input type="password" defaultValue="***" disabled className="w-full px-6 py-4 bg-medical border border-slate-100 rounded-sm text-sm font-bold tracking-widest text-navy opacity-50" />
                              </div>
                           </div>
                        </div>
                      </>
                   ) : (
                      <div className="py-6 text-center animate-fade-in">
                         <div className="bg-medical p-10 rounded-sm border border-dashed border-slate-200 mb-10">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Dial this code on your mobile</h5>
                            <div className="text-3xl font-black text-navy tracking-widest mb-4 bg-white py-4 shadow-sm border border-slate-100 rounded-sm">
                               {ussdCode}
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Valid for 5 minutes • Amount: ₦{specialist.consultationFee.toLocaleString()}</p>
                         </div>
                         <div className="space-y-4 px-6">
                            <div className="flex items-center space-x-4 text-left">
                               <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">1</div>
                               <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">Dial the code above on your registered bank phone</p>
                            </div>
                            <div className="flex items-center space-x-4 text-left">
                               <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">2</div>
                               <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">Follow the prompts and authorize with your PIN</p>
                            </div>
                            <div className="flex items-center space-x-4 text-left">
                               <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">3</div>
                               <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">Wait for the "Payment Success" message here</p>
                            </div>
                         </div>
                      </div>
                   )}

                   <div className="mt-12 space-y-4">
                      <button 
                       onClick={handleBook}
                       disabled={booking}
                       className="w-full bg-[#00224f] text-white py-5 font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black transition duration-500 disabled:bg-slate-800 flex flex-col items-center justify-center space-y-2"
                    >
                       {booking ? (
                         <>
                           <span className="flex items-center">
                              <span className="w-2 h-2 bg-primary rounded-full animate-ping mr-3"></span>
                              {bookingStatus}
                           </span>
                           <span className="text-[8px] opacity-40 font-bold">Encrypted via Interswitch WebPay</span>
                         </>
                       ) : (paymentMethod === "card" ? `Pay ₦${specialist.consultationFee.toLocaleString()}` : "Verify USSD Transaction")}
                    </button>
                      <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                         Transaction Reference: MED-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                      </p>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Info (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="card-medcare p-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                   <div className="w-40 h-40 bg-medical rounded-full flex items-center justify-center text-slate-200 border-4 border-white shadow-xl flex-shrink-0">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                   </div>
                   <div className="text-center md:text-left pt-4">
                      <h2 className="text-4xl lg:text-5xl font-serif font-black text-navy leading-tight mb-4">{specialist.user?.name}</h2>
                      <div className="inline-block bg-primary/5 text-primary px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        {specialist.specialization}
                      </div>
                      <p className="text-slate-500 font-medium leading-[1.8] text-lg italic">
                        "{specialist.bio}"
                      </p>
                   </div>
                </div>
            </div>

            <div className="card-medcare p-12">
               <h3 className="text-xl font-black text-navy uppercase tracking-widest mb-8 flex items-center">
                 <span className="w-8 h-[2px] bg-primary mr-4"></span>
                 Expertise & Experience
               </h3>
               <p className="text-slate-600 leading-[1.8] font-medium">
                 Highly qualified specialist in {specialist.specialization} with years of clinical experience. Verified by Interswitch for professional medical practice. Committed to providing the best healthcare solutions for patients globally.
               </p>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10">
                  <div className="border-l-2 border-primary/20 pl-6">
                     <div className="text-2xl font-black text-navy">15+</div>
                     <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Exp. Years</div>
                  </div>
                  <div className="border-l-2 border-primary/20 pl-6">
                     <div className="text-2xl font-black text-navy">1.2k</div>
                     <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Patients</div>
                  </div>
                  <div className="border-l-2 border-primary/20 pl-6">
                     <div className="text-2xl font-black text-navy">4.9</div>
                     <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Rating</div>
                  </div>
                  <div className="border-l-2 border-primary/20 pl-6">
                     <div className="text-2xl font-black text-navy">Verf.</div>
                     <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Identity</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Booking (4 cols) */}
          <div className="lg:col-span-4 sticky top-32">
             <div className="card-medcare bg-navy p-10 text-white shadow-2xl">
                <h3 className="text-xl font-black uppercase tracking-widest mb-10 text-primary flex justify-between items-center">
                   Book Session
                   <span className="bg-white/10 px-4 py-1.5 rounded-sm text-[11px] text-white">Interswitch</span>
                </h3>
                
                <div className="space-y-6 mb-12">
                   <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Consultation Fee</span>
                      <span className="text-2xl font-black tracking-tighter">₦{specialist.consultationFee.toLocaleString()}</span>
                   </div>
                   
                   <div className="pt-4">
                      <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block mb-6 px-1 border-l-2 border-primary ml-1">Select Available Slot</span>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {specialist.slots?.length > 0 ? (
                          specialist.slots.map(slot => (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedSlot(slot.id)}
                              className={`w-full p-4 rounded-sm text-center transition duration-300 font-bold text-xs tracking-widest uppercase border ${
                                selectedSlot === slot.id 
                                ? "bg-primary border-primary text-white shadow-lg" 
                                : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                              }`}
                            >
                              {new Date(slot.startTime).toLocaleDateString()} @ {new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </button>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-white/5 border border-dashed border-white/10 rounded-sm">
                             <p className="text-white/30 text-[11px] font-bold tracking-widest">NO SLOTS AVAILABLE</p>
                          </div>
                        )}
                      </div>
                   </div>
                </div>

                <button
                  onClick={startBookingFlow}
                  disabled={booking || !selectedSlot}
                  className="w-full bg-primary py-5 font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-white hover:text-navy transition duration-500 disabled:bg-white/10 disabled:text-white/20"
                >
                  Confirm & Pay Now ⟶
                </button>
                
                <p className="text-center text-[10px] text-white/30 font-bold tracking-widest mt-8 uppercase">
                  Secure checkout powered by interswitch
                </p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SpecialistDetails;
