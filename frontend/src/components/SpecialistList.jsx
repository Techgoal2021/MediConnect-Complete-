import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import API_BASE_URL from "../config/api";

import DepartmentGrid from "./DepartmentGrid";

const SpecialistList = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterBy = queryParams.get("specialization");

  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [loading, filterBy]);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/specialists`);
        let data = await res.json();
        
        if (filterBy && filterBy !== "all") {
          data = data.filter(s => s.specialization.toLowerCase().trim() === filterBy.toLowerCase().trim());
        }
        
        setSpecialists(data);
      } catch (err) {
        console.error("Error fetching specialists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialists();
  }, [filterBy]);

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setRecLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/specialists/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms })
      });
      const data = await res.json();
      setRecommendation(data.specialist);
    } catch (err) {
      console.error(err);
    } finally {
      setRecLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-40">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // If no specialization selected, show the Department Grid as the entrance
  if (!filterBy) {
    return (
      <div className="pt-20">
        <DepartmentGrid title="Select a Department" showHeader={true} />
        <div className="container mx-auto px-6 lg:px-20 pb-24 text-center">
           <Link to="/specialists?specialization=all" className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition border-b border-slate-200 pb-2">Or Browse All Verified Experts ⟶</Link>
        </div>
      </div>
    );
  }

  // Handle "Browse All" edge case
  const displayedSpecialists = filterBy === "all" ? specialists.slice(0, 12) : specialists;

  return (
    <section className="py-24 lg:py-32 bg-medical">
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* ML Symptom Checker Section */}
        <div className="card-medcare p-10 lg:p-16 mb-24 bg-navy text-white overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/20 transition duration-700"></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <h5 className="text-primary font-black tracking-[0.4em] uppercase mb-4 text-[10px]">AI-Powered Diagnosis</h5>
                 <h2 className="text-3xl lg:text-4xl font-serif font-black mb-6 leading-tight">Not sure which <span className="text-primary italic">specialist</span> you need?</h2>
                 <p className="text-white/60 font-medium mb-10 leading-relaxed text-sm">Describe your symptoms below, and our MediConnect ML engine will recommend the best department for your care.</p>
                 
                 <form onSubmit={handleRecommend} className="relative">
                    <input 
                      type="text" 
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g. I have persistent chest pain and shortness of breath" 
                      className="w-full bg-white/10 border border-white/10 px-8 py-5 rounded-sm text-sm font-bold focus:bg-white/20 focus:outline-none transition-all placeholder:text-white/30 pr-32"
                    />
                    <button 
                      type="submit"
                      disabled={recLoading}
                      className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-navy transition duration-500 disabled:bg-white/10"
                    >
                      {recLoading ? "Analyzing..." : "Diagnose ⟶"}
                    </button>
                 </form>
              </div>

              <div className="bg-white/5 border border-white/10 p-10 rounded-sm relative min-h-[200px] flex flex-col justify-center text-center">
                 {recommendation ? (
                    <div className="animate-fade-in">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                           <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Recommended Department</h4>
                        <div className="text-3xl font-black text-white tracking-tighter mb-6">{recommendation}</div>
                        <Link 
                           to={`/specialists?specialization=${recommendation.split(' ')[0]}`}
                           className="text-primary font-black uppercase text-[10px] tracking-widest border-b border-primary/30 pb-1 hover:text-white hover:border-white transition"
                        >
                           View {recommendation} Experts ⟶
                        </Link>
                    </div>
                 ) : (
                    <div className="opacity-40 flex flex-col items-center">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">Awaiting Symptoms...</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        <div className="text-center mb-16 lg:mb-24 max-w-2xl mx-auto">
          <h5 className="text-primary font-black tracking-[0.4em] uppercase mb-4 text-xs">Medical Specialists</h5>
          <h2 className="text-4xl lg:text-5xl font-serif font-black text-navy mb-6 leading-tight">
            {filterBy === "all" ? <>Our Global <span className="text-primary italic">Expert Network</span></> : <>{filterBy} <span className="text-primary italic">Specialists</span></>}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-slate-500 font-medium">Verified professional medical practitioners available for instant consultation via Interswitch WebPay.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayedSpecialists.map((s) => (
            <div key={s.id} className="card-medcare group hover:border-primary flex flex-col">
              {/* Profile Top */}
              <div className="p-10 pb-0 text-center flex flex-col items-center">
                 <div className="w-28 h-28 bg-medical rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-xl relative overflow-hidden group-hover:scale-105 transition duration-500">
                    <svg className="w-16 h-16 text-slate-200 group-hover:text-primary/20 transition duration-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    {/* Badge */}
                    <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                 </div>
                 <Link to={`/specialist/${s.id}`} className="text-2xl font-black text-navy hover:text-primary transition tracking-tighter mb-2 block">
                   {s.user?.name}
                 </Link>
                 <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <span className="text-primary font-black uppercase text-[10px] tracking-[0.2em] bg-primary/5 px-4 py-1 rounded-full">{s.specialization}</span>
                    {s.trust_score !== null ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        border: '2px solid #34d399',
                        backgroundColor: '#ecfdf5',
                        color: '#065f46',
                        boxShadow: '0 4px 12px rgba(52, 211, 153, 0.2)',
                        gap: '6px'
                      }}>
                        <span style={{fontSize: '12px'}}>🛡️</span> {s.trust_score}% Trust
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        border: '2px solid #818cf8',
                        backgroundColor: '#eef2ff',
                        color: '#3730a3',
                        boxShadow: '0 4px 12px rgba(129, 140, 248, 0.2)',
                        gap: '6px'
                      }}>
                         <span style={{fontSize: '12px'}}>🛡️</span> Pending AI Verification
                      </span>
                    )}
                 </div>
              </div>

              {/* Bio */}
              <div className="px-10 pb-10 flex-grow">
                 <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3 italic">
                   "{s.bio}"
                 </p>
                 <div className="flex flex-col space-y-4 pt-8 border-t border-slate-50">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                       <span className="text-slate-400">Consultation Fee</span>
                       <span className="text-navy">₦{s.consultationFee?.toLocaleString() || "0"}</span>
                    </div>
                    <Link 
                      to={`/specialist/${s.id}`} 
                      className="btn-medcare-outline inline-block text-center w-full py-4"
                    >
                      Book Session ⟶
                    </Link>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {displayedSpecialists.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-xl">
             <p className="text-slate-400 font-serif text-xl font-bold">No specialists found in this department yet.</p>
             <Link to="/specialists" className="text-primary font-black uppercase tracking-widest text-xs mt-4 inline-block underline underline-offset-8">Return to Departments</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialistList;
