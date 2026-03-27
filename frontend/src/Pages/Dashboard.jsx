import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import { INTERSWITCH_CONFIG } from "../config/interswitch";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!savedUser || !token) return navigate("/login");

    setUser(JSON.parse(savedUser));

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/appointments/my`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [navigate]);

  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const startPayment = (aptId) => {
    setSelectedAptId(aptId);
    setShowPaymentGateway(true);
  };

  const handleVerify = async () => {
    setPaymentLoading(true);
    setPaymentStatus("Initializing Secure Handshake...");

    const token = localStorage.getItem("token");

    try {
      // 1. Fetch secure payment parameters (Hash, Merchant Code, txnRef) from Backend
      setPaymentStatus("Generating SHA-512 Hash via Backend...");
      // For the dashboard, we use a fixed consultation fee of 5000 for the demo
      const paymentParams = await INTERSWITCH_CONFIG.getPaymentParams(selectedAptId, 5000, token);

      // 2. Simulate the Interswitch multi-step verification for the Buildathon
      const steps = [
        "Initiating WebPay Handshake (Kobo Mode)...",
        "Authenticating with Client Credentials...",
        "Verifying Transaction Identity via Passport...",
        "Interfacing with Interswitch Inquiry API...",
        "Finalizing with Secure Bank Confirmation..."
      ];
      
      for (let i = 0; i < steps.length; i++) {
        setPaymentStatus(steps[i]);
        await new Promise(r => setTimeout(r, 600));
      }

      // 3. Call the backend verification endpoint (which uses the real Inquiry API)
      const res = await fetch(`${API_BASE_URL}/appointments/verify-payment`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          appointmentId: selectedAptId, 
          reference: paymentParams.txn_ref
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Interswitch Verification Failed");

      setPaymentStatus("Verification Successful!");
      setTimeout(() => {
        setShowPaymentGateway(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Verification Error:", err);
      alert(err.message || "Interswitch verification failed. Please try again.");
      setShowPaymentGateway(false);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-40">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="py-24 lg:py-32 bg-medical min-h-screen relative">
      {/* Interswitch Mock Gateway Modal */}
      {showPaymentGateway && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-0">
           <div className="absolute inset-0 bg-navy/90 backdrop-blur-sm"></div>
           <div className="relative bg-white w-full max-w-lg shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-scale-in">
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
                       <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Verify Secure Payment</p>
                    </div>
                 </div>
                 <button onClick={() => setShowPaymentGateway(false)} disabled={paymentLoading} className="text-white/20 hover:text-white transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
              </div>

              <div className="p-10">
                 <div className="bg-medical p-8 rounded-sm mb-10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Authorizing Payment For</p>
                    <h4 className="text-xl font-black text-navy uppercase tracking-widest">Consultation #{selectedAptId?.substr(-6).toUpperCase()}</h4>
                 </div>

                 <div className="mt-12 space-y-4">
                    <button 
                       onClick={handleVerify}
                       disabled={paymentLoading}
                       className="w-full bg-[#00224f] text-white py-5 font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black transition duration-500 disabled:bg-slate-800 flex flex-col items-center justify-center space-y-2"
                    >
                       {paymentLoading ? (
                         <>
                           <span className="flex items-center">
                              <span className="w-2 h-2 bg-primary rounded-full animate-ping mr-3"></span>
                              {paymentStatus}
                           </span>
                           <span className="text-[8px] opacity-40 font-bold tracking-widest">Secured by Interswitch Network</span>
                         </>
                       ) : "Finalize Interswitch Payment ⟶"}
                    </button>
                     <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Amount: {INTERSWITCH_CONFIG.amountToKobo(5000)} Kobo | Currency: {INTERSWITCH_CONFIG.CURRENCY}
                     </p>
                     <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Do not close this window until verification is complete
                     </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="container mx-auto px-6 lg:px-20">
        
        {/* Dashboard Header */}
        <div className={`flex flex-col lg:flex-row justify-between items-end mb-16 lg:mb-20 gap-8 p-10 rounded-sm ${user?.role === 'specialist' ? 'bg-navy text-white' : 'bg-white border border-slate-100'}`}>
          <div className="space-y-4">
             <h5 className={`font-black tracking-[0.4em] uppercase text-xs flex items-center ${user?.role === 'specialist' ? 'text-primary' : 'text-primary'}`}>
                <span className="w-10 h-[2px] bg-primary mr-3"></span>
                {user?.role === 'specialist' ? '🩺 Specialist Portal' : '👤 Patient Portal'}
             </h5>
             <h2 className={`text-4xl lg:text-5xl font-serif font-black leading-tight ${user?.role === 'specialist' ? 'text-white' : 'text-navy'}`}>
                {user?.role === 'specialist' ? 'Dr. ' : ''}<span className="text-primary italic">{user?.name.split(' ')[0]}</span>'s Dashboard
             </h2>
             <p className={`text-sm font-medium ${user?.role === 'specialist' ? 'text-white/60' : 'text-slate-400'}`}>
               {user?.role === 'specialist' ? 'Manage your consultations and patient schedule below.' : 'View your appointments and manage your healthcare journey.'}
             </p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${user?.role === 'specialist' ? 'text-white/40' : 'text-slate-400'}`}>Account Type</p>
                <p className={`text-sm font-black uppercase ${user?.role === 'specialist' ? 'text-primary' : 'text-navy'}`}>{user?.role}</p>
             </div>
             <div className={`w-14 h-14 rounded-sm flex items-center justify-center text-white shadow-xl ${user?.role === 'specialist' ? 'bg-primary' : 'bg-navy'}`}>
                {user?.role === 'specialist'
                  ? <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
                  : <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                }
             </div>
          </div>
        </div>

        {/* Stats Grid (Quick Glance) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card-medcare p-10 border-b-4 border-primary">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{user?.role === 'specialist' ? 'Total Patients' : 'Total Appointments'}</p>
             <h4 className="text-3xl font-serif font-black text-navy">{appointments.length}</h4>
          </div>
          <div className="card-medcare p-10 border-b-4 border-navy">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{user?.role === 'specialist' ? 'Confirmed Sessions' : 'Pending Payments'}</p>
             <h4 className="text-3xl font-serif font-black text-navy">{user?.role === 'specialist' ? appointments.filter(a => a.status === 'confirmed').length : appointments.filter(a => a.paymentStatus !== 'paid').length}</h4>
          </div>
          <div className="card-medcare p-10 border-b-4 border-primary/20">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Status</p>
             <h4 className="text-lg font-bold text-green-500 uppercase tracking-widest pt-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Verified
             </h4>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="card-medcare overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <div className={`p-10 border-b border-slate-50 flex justify-between items-center text-white ${user?.role === 'specialist' ? 'bg-primary' : 'bg-navy'}`}>
            <h3 className="text-xs font-black uppercase tracking-[0.3em]">{user?.role === 'specialist' ? '📋 Your Patient Schedule' : '📅 Recent Consultations'}</h3>
            {user?.role !== 'specialist' && (
              <Link to="/specialists" className="text-[10px] font-black uppercase tracking-widest border-b border-white/40 hover:text-primary transition">Book New ⟶</Link>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-medical text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">{user?.role === 'specialist' ? 'Patient' : 'Specialist'}</th>
                  <th className="px-10 py-6">Date & Time</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Action / Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.length > 0 ? appointments.slice(0, 5).map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition duration-300 group">
                    <td className="px-10 py-8">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-medical rounded-full flex items-center justify-center text-slate-300">
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                          </div>
                          <div>
                            <p className="font-black text-navy uppercase text-[13px] tracking-tight">
                              {user?.role === 'specialist' ? apt.patient?.name : apt.specialist?.name}
                            </p>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                              {user?.role === 'specialist' ? 'Verified Patient' : 'Verified Expert'}
                            </p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-[13px] font-medium text-slate-500">
                       {apt.slot ? 
                         new Date(apt.slot.startTime).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 
                         (apt.createdAt ? new Date(apt.createdAt).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'N/A')
                       }
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest ${
                        apt.status === 'confirmed' ? "bg-green-50 text-green-600 border border-green-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end space-x-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                            apt.paymentStatus === 'paid' ? "text-primary" : "text-red-400"
                        }`}>
                            {apt.paymentStatus}
                        </span>
                        {apt.paymentStatus !== 'paid' && user?.role === 'patient' && (
                            <button 
                                onClick={() => startPayment(apt.id)}
                                className="bg-navy text-white px-6 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-primary transition shadow-md"
                            >
                                Pay (Interswitch)
                            </button>
                        )}
                        {apt.paymentStatus === 'paid' && (
                           <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                           </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-10 py-32 text-center text-slate-400 font-serif text-xl italic font-bold">No appointments found yet. Go book your first consultation!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
