"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, Navigation, MessageCircle, CalendarCheck, XCircle, LogOut } from "lucide-react";
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

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const savedIds = getSavedBookings();
      if (!savedIds || savedIds.length === 0) {
        setBookings([]);
        setLoadingBookings(false);
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .in('id', savedIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
       const { error } = await supabase
          .from('bookings')
          .update({ status: 'Cancelled' })
          .eq('id', bookingId); // Cannot reliably check user_id anymore, so just update.
       
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

  if (loadingBookings) {
     return <div className="min-h-[100dvh] flex items-center justify-center bg-white"><div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div></div>;
  }

  const filteredBookings = bookings.filter(b => getBookingType(b) === activeTab);

  return (
    <div className="min-h-[100dvh] bg-white pb-32 font-sans overflow-x-hidden">
      
      {/* Header & Tabs */}
      <div className="px-6 pt-12 pb-2 bg-white relative z-10 sticky top-0 border-b border-gray-100">
        <div className="flex justify-between items-center">
           <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Trips</h1>
        </div>
        
        <div className="flex mt-6 gap-6">
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
              // Clean amount format
              const cleanAmount = String(b.amount).replace(/[^0-9]/g, '');
              const numericAmount = cleanAmount ? parseInt(cleanAmount) : 0;
              
              // Map placeholder images per category
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
                    <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                      <a 
                        href={`https://wa.me/6282247819449?text=${encodeURIComponent(`Hello Balance Island, regarding my booking:\n\n*BALANCE ISLAND BOOKING*\n\n*ID:* #${b.id}\n*TITLE:* ${b.service_name.toUpperCase()}\n*DATE:* ${b.booking_date}\n*PRICE:* ${b.amount}\n\nPlease assist me to confirm.`)}`} 
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
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <Navigation className="w-10 h-10 text-gray-300 ml-1 mt-1" strokeWidth={2} />
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
  );
}

