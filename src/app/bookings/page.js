"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, Navigation, MessageCircle, CalendarCheck, XCircle, LogOut, Send, Compass, Map, Loader2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getSavedBookings } from "@/lib/bookings";

const formatIDR = (num) => {
  if (!num || isNaN(num)) return num;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookings, setBookings] = useState([]);
  
  // AI Trip Planner State (Mobile)
  const [availableTours, setAvailableTours] = useState([]);
  const [plannerStep, setPlannerStep] = useState('prompt'); // 'prompt' | 'thinking' | 'result'
  const [promptText, setPromptText] = useState('');
  const [recommendedTour, setRecommendedTour] = useState(null);

  useEffect(() => {
    fetchBookingsAndTours();
  }, []);

  const fetchBookingsAndTours = async () => {
    setLoadingBookings(true);
    try {
      // 1. Fetch Bookings for Desktop
      const savedIds = getSavedBookings();
      if (savedIds && savedIds.length > 0) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .in('id', savedIds)
          .order('created_at', { ascending: false });
        if (!error) setBookings(data || []);
      }

      // 2. Fetch Tours for AI Planner
      const { data: toursData, error: toursError } = await supabase
        .from('listings')
        .select('*')
        .eq('type', 'Tour')
        .eq('status', 'Active')
        .limit(20);
      if (!toursError) setAvailableTours(toursData || []);
      
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
       const { error } = await supabase
          .from('bookings')
          .update({ status: 'Cancelled' })
          .eq('id', bookingId); 
       
       if (error) throw error;
       setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "Cancelled" } : b));
    } catch (err) {
       alert("Could not cancel booking: " + err.message);
    }
  };

  const getBookingType = (b) => {
    const bookingDate = new Date(b.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (b.status === "Cancelled") return "past";
    return bookingDate < today ? "past" : "upcoming";
  };

  const handleRecommend = (customPrompt = promptText) => {
    if (!customPrompt.trim()) return;
    setPromptText(customPrompt);
    setPlannerStep('thinking');
    
    // Simulate AI thinking and matching
    setTimeout(() => {
      const promptLower = customPrompt.toLowerCase();
      let matchedTour = availableTours[0];
      
      // Simple keyword matching for demo
      const matches = availableTours.filter(tour => {
        const titleMatch = tour.title && tour.title.toLowerCase().includes(promptLower);
        const descMatch = tour.description && tour.description.toLowerCase().includes(promptLower);
        const locMatch = tour.location && tour.location.toLowerCase().includes(promptLower);
        return titleMatch || descMatch || locMatch;
      });

      if (matches.length > 0) {
        // Pick a random match from the filtered results
        matchedTour = matches[Math.floor(Math.random() * matches.length)];
      } else if (availableTours.length > 0) {
        // Fallback to random tour if no keyword match
        matchedTour = availableTours[Math.floor(Math.random() * availableTours.length)];
      }
      
      setRecommendedTour(matchedTour);
      setPlannerStep('result');
    }, 2500); 
  };

  if (loadingBookings) {
     return <div className="min-h-[100dvh] flex items-center justify-center bg-white"><div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div></div>;
  }

  const filteredBookings = bookings.filter(b => getBookingType(b) === activeTab);

  const presetPrompts = [
    "Relaxing beach day",
    "Culture & Temples",
    "Adventurous volcano hike",
    "Romantic sunset dinner"
  ];

  return (
    <div className="min-h-[100dvh] bg-surface pb-32 font-sans -mt-20 md:-mt-24">
      
      {/* ============================================================== */}
      {/* DESKTOP VIEW (Original Bookings Layout) */}
      {/* ============================================================== */}
      <div className="hidden md:block">
        {/* Header & Tabs */}
        <div className="px-6 pt-14 pb-0 bg-surface z-10 sticky top-0 border-b border-gray-100">
          <div className="flex justify-between items-center">
          </div>
          
          <div className="flex gap-6 max-w-6xl mx-auto">
            <button 
              onClick={() => setActiveTab("upcoming")}
              className={`pb-3 text-[15px] font-bold transition-all relative ${activeTab === "upcoming" ? "text-primary" : "text-gray-400"}`}
            >
              Upcoming
              {activeTab === "upcoming" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("past")}
              className={`pb-3 text-[15px] font-bold transition-all relative ${activeTab === "past" ? "text-primary" : "text-gray-400"}`}
            >
              Past
              {activeTab === "past" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Bookings Grid (Airbnb Style) */}
        <div className="px-6 pt-8 max-w-6xl mx-auto">
          {filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredBookings.map((b, index) => {
                const details = b.details || {};
                const cleanAmount = String(b.amount).replace(/[^0-9]/g, '');
                const numericAmount = cleanAmount ? parseInt(cleanAmount) : 0;
                
                let fallbackImage = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80";
                if (b.category === "Spa") fallbackImage = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80";
                if (b.category === "Transport") fallbackImage = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80";
                
                const imageToDisplay = details.image || fallbackImage;

                return (
                <div key={b.id} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  
                  {/* Image Section */}
                  <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden group bg-gray-100">
                    <img src={imageToDisplay} alt={b.service_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    
                    {/* Status Badge Over Image */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                      {b.status === "Confirmed" && <CheckCircle2 size={14} className="text-black" strokeWidth={3} />}
                      {b.status === "Pending" && <Clock size={14} className="text-black" strokeWidth={3} />}
                      {b.status === "Completed" && <CheckCircle2 size={14} className="text-gray-500" strokeWidth={3} />}
                      {b.status === "Cancelled" && <XCircle size={14} className="text-black" strokeWidth={3} />}
                      <span className={`text-[12px] font-bold uppercase tracking-wider ${b.status === "Confirmed" ? "text-black" : b.status === "Completed" ? "text-gray-600" : b.status === "Cancelled" ? "text-black" : "text-black"}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col px-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-extrabold text-[18px] text-primary leading-tight line-clamp-2">
                        {typeof b.service_name === 'object' ? JSON.stringify(b.service_name) : b.service_name}
                      </h3>
                    </div>
                    
                    <p className="text-[15px] text-gray-500 font-medium mt-1">
                      {typeof b.category === 'object' ? JSON.stringify(b.category) : b.category} • {typeof b.booking_date === 'object' ? JSON.stringify(b.booking_date) : b.booking_date}
                    </p>
                    
                    <div className="mt-1 font-semibold text-[15px] text-primary">
                      <span className="font-extrabold text-[15px]">{numericAmount > 0 ? formatIDR(numericAmount) : (typeof b.amount === 'object' ? JSON.stringify(b.amount) : b.amount)}</span>
                    </div>

                    {/* Actions Area */}
                    {activeTab === "upcoming" && (
                      <div key={b.id} className="mt-5 bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm flex gap-3">
                        <a 
                          href={`https://wa.me/6285174119423?text=${encodeURIComponent(`Hello Balance Island, regarding my booking:\n\n*BALANCE ISLAND BOOKING*\n\n*ID:* #${b.id}\n*TITLE:* ${b.service_name.toUpperCase()}\n*DATE:* ${b.booking_date}\n*PRICE:* ${b.amount}\n\nPlease assist me to confirm.`)}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex-1 bg-gray-100 text-primary text-[14px] font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors text-center"
                        >
                          Message
                        </a>
                        {b.status === "Pending" && (
                          <button 
                            onClick={() => handleCancelBooking(b.id)}
                            className="flex-1 bg-white border border-gray-300 text-black text-[14px] font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:border-black transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}

                    {/* Cancelled state label if in past */}
                    {b.status === "Cancelled" && activeTab === "past" && (
                      <div className="mt-4 p-3 bg-gray-50 text-black text-[13px] font-bold rounded-xl text-center">
                        Booking Cancelled
                      </div>
                    )}
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <div className="py-24 md:py-32 flex flex-col items-center justify-center text-center px-4">
               <div className="w-24 h-24 bg-[#111111] rounded-full flex items-center justify-center mb-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white/10">
                  <Navigation className="w-10 h-10 text-gray-500 ml-1 mt-1" strokeWidth={2} />
               </div>
               <h3 className="text-[22px] font-black text-primary mb-3 tracking-tight">No upcoming trips</h3>
               <p className="text-gray-500 text-[15px] max-w-[280px] leading-relaxed mb-8 font-medium">
                 Start exploring our collection of premium tours, transport, and experiences in Bali.
               </p>
               <Link href="/">
                 <button className="px-8 py-4 bg-[#1c1c1c] text-white font-extrabold rounded-full hover:bg-black active:scale-95 shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.18)] transition-all text-[15px] w-full max-w-[240px]">
                   Start Exploring
                 </button>
               </Link>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE VIEW (AI Trip Planner) */}
      {/* ============================================================== */}
      <div className="block md:hidden min-h-[100dvh] pt-20 px-5 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        {plannerStep === 'prompt' && (
          <div className="flex flex-col h-[calc(100vh-120px)] max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pt-4">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white shadow-xl shadow-black/10 mb-6 transform -rotate-3">
                <Sparkles size={22} strokeWidth={2.5} className="text-amber-300" />
              </div>
              <h2 className="text-[32px] font-black text-[#1c1c1c] leading-[1.1] tracking-tight">
                Where should we <br/> take you?
              </h2>
              <p className="text-[15px] text-gray-500 font-medium mt-3 leading-relaxed pr-4">
                Describe your dream Bali experience, and we'll craft the perfect itinerary just for you.
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-8 flex-1 overflow-y-auto hide-scroll pb-4">
              {presetPrompts.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRecommend(preset)}
                  className="bg-white/70 backdrop-blur-md border border-gray-100 hover:border-gray-300 hover:bg-white rounded-2xl px-5 py-4 text-left shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all text-[14px] font-extrabold text-[#1c1c1c] active:scale-[0.98] group flex items-center justify-between"
                >
                  <span>{preset}</span>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-black transition-colors" />
                </button>
              ))}
            </div>

            <div className="relative mt-auto mb-6 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full blur-md opacity-50 translate-y-2 pointer-events-none"></div>
              <input 
                type="text" 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
                placeholder="Or type your own adventure..."
                className="relative w-full bg-white/90 backdrop-blur-xl border border-gray-200 rounded-full pl-6 pr-14 py-4 text-[14px] font-bold text-[#1c1c1c] shadow-lg shadow-black/5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 placeholder:font-medium"
              />
              <button 
                onClick={() => handleRecommend()}
                disabled={!promptText.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 transition-colors shadow-md z-10"
              >
                <Send size={16} strokeWidth={2.5} className="-ml-0.5" />
              </button>
            </div>
          </div>
        )}

        {plannerStep === 'thinking' && (
          <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in duration-500 relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl shadow-black/5 border border-gray-100 flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 rounded-3xl border-[3px] border-amber-300/30 animate-ping" style={{ animationDuration: '2s' }}></div>
              <Sparkles size={36} className="text-amber-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-[#1c1c1c] tracking-tight">Curating your experience</h3>
            <p className="text-[14px] text-gray-500 font-medium mt-2">Searching our exclusive tours...</p>
          </div>
        )}

        {plannerStep === 'result' && recommendedTour && (
          <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10 pt-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block mb-1">Recommended for you</span>
                <h2 className="text-[28px] font-black text-[#1c1c1c] tracking-tight leading-[1.1]">
                  Your perfect <br/>match
                </h2>
              </div>
              <button 
                onClick={() => {
                  setPlannerStep('prompt');
                  setPromptText('');
                  setRecommendedTour(null);
                }}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-500 hover:text-black"
              >
                <XCircle size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="bg-white rounded-[32px] p-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100/50 relative group overflow-hidden flex flex-col flex-1 max-h-[600px]">
              <div className="w-full h-1/2 min-h-[220px] rounded-[24px] overflow-hidden relative mb-4 shrink-0 bg-gray-100">
                <img 
                  src={recommendedTour.images?.[0] || recommendedTour.thumbnail_image || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"} 
                  alt={recommendedTour.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                    <Map size={12} className="text-black" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-black">
                      {recommendedTour.location || "Bali"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-4 pb-4 flex flex-col flex-1">
                <h3 className="font-extrabold text-[22px] text-[#1c1c1c] leading-tight line-clamp-2 mb-2">
                  {recommendedTour.title}
                </h3>
                <p className="text-[13.5px] text-gray-500 font-medium line-clamp-3 leading-relaxed mb-4 flex-1">
                  {recommendedTour.description || "An unforgettable experience tailored just for you. Discover the beauty of Bali with our premium tours and expert guides."}
                </p>
                
                <div className="shrink-0">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Starting from</span>
                    <span className="font-black text-[20px] text-[#1c1c1c]">
                      {formatIDR(recommendedTour.base_price || recommendedTour.price)}
                    </span>
                  </div>
                  
                  <Link href={`/tours/${recommendedTour.slug}`} className="block">
                    <button className="w-full py-4 bg-gradient-to-r from-gray-900 to-black text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-transform">
                      View Itinerary <ArrowRight size={18} strokeWidth={2.5} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
