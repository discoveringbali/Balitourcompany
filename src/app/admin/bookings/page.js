"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, PackageOpen, MoreVertical, CheckCircle, Clock, XCircle, Trash2, X, Users, Newspaper } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BookingsManagement() {
  const [activeTab, setActiveTab] = useState("Tour");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState({ Tour: [], Activities: [], Transport: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState("List"); // "List" | "Calendar"
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchBookings();
    
    // Fallback to polling instead of Realtime listener to safely bypass RLS
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
    
      if (data) {
        const grouped = { Tour: [], Activities: [], Transport: [] };
        data.forEach(b => {
           const mapped = {
              id: b.id,
              user: b.customer_name,
              contact: b.contact_info,
              tour: b.service_name,
              date: b.booking_date,
              amount: b.amount,
              status: b.status,
              details: b.details,
              category: b.category
           };
           if (grouped[b.category]) {
              grouped[b.category].push(mapped);
           } else {
              grouped[b.category] = [mapped];
           }
        });
        setBookings(grouped);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoaded(true);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    const updated = {
      ...bookings,
      [activeTab]: bookings[activeTab].map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    };
    setBookings(updated);
    setOpenDropdown(null);
    if(selectedBooking) {
        setSelectedBooking({...selectedBooking, status: newStatus});
    }
    
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bookingId, status: newStatus })
    });
  };

  const handleDelete = async (bookingId) => {
    if (confirm("Permanently delete this booking?")) {
      const updated = {
        ...bookings,
        [activeTab]: bookings[activeTab].filter(b => b.id !== bookingId)
      };
      setBookings(updated);
      setSelectedBooking(null);
      setOpenDropdown(null);
      
      await fetch('/api/admin/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId })
      });
    }
  };

  if (!isLoaded) return null;

  const tabs = ["Tour", "Activities", "Transport"];
  const currentItems = (bookings[activeTab] || []).filter(b => 
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.tour.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = (e, id) => {
    e.stopPropagation(); // prevent modal from opening when clicking dropdown
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto scroll-smooth">
      <div className="space-y-8 pb-24"> {/* Extra padding for mobile bottom nav */}
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1c1c1c] tracking-tight">Booking Management</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Review, manage, and execute customer booking actions.</p>
          </div>
          <div className="flex bg-[#f9f9f9] p-1 rounded-xl overflow-x-auto no-scrollbar shadow-sm border border-[#eaeaea]">
            <button
              onClick={() => setViewMode("List")}
              className={`flex-1 min-w-[80px] px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${viewMode === "List" ? 'bg-white text-[#1c1c1c] shadow-sm' : 'text-gray-500 hover:text-[#1c1c1c]'}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("Calendar")}
              className={`flex-1 min-w-[80px] px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${viewMode === "Calendar" ? 'bg-white text-[#1c1c1c] shadow-sm' : 'text-gray-500 hover:text-[#1c1c1c]'}`}
            >
              Calendar
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-2.5 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-2">
          <div className="flex bg-[#f9f9f9] p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setOpenDropdown(null); }}
                className={`flex-1 min-w-[80px] px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all ${activeTab === tab ? 'bg-[#1c1c1c] text-white shadow-sm' : 'text-gray-500 hover:text-[#1c1c1c]'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden md:block w-px bg-[#eaeaea] mx-2"></div>

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Booking ID, name, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1c1c1c] pl-11 pr-4 py-3 md:py-2 outline-none placeholder:text-gray-400 placeholder:font-medium"
            />
          </div>
        </div>

        {/* Table View */}
        {viewMode === "List" && (
        <div className="bg-white border border-[#eaeaea] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse cursor-pointer">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-[#eaeaea]">
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4">Ref ID</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 hidden md:table-cell">Customer Info</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 w-full md:w-auto">Service Hook</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 hidden sm:table-cell">Transaction</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 hidden lg:table-cell">Status</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 text-right hidden lg:table-cell">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaea]">
                {currentItems.length > 0 ? currentItems.map((booking, i) => (
                  <tr key={i} onClick={() => setSelectedBooking(booking)} className="hover:bg-[#f9f9f9] active:bg-gray-100 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-[#1c1c1c]">{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                       <p className="text-sm font-extrabold text-[#1c1c1c]">{booking.user}</p>
                       <p className="text-[11px] text-gray-500 font-bold">{booking.contact}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap truncate max-w-[200px] md:max-w-none">
                       <p className="text-sm font-bold text-[#1c1c1c] truncate">{booking.tour}</p>
                       <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1 mt-0.5"><Calendar size={10} /> {booking.date}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-[#1c1c1c] hidden sm:table-cell">{booking.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest
                        ${booking.status === 'Confirmed' ? 'bg-black text-white text-[#1c1c1c]' : ''}
                        ${booking.status === 'Pending' ? 'bg-gray-100 text-black' : ''}
                        ${booking.status === 'Completed' ? 'bg-[#f9f9f9] text-gray-600' : ''}
                        ${booking.status === 'Cancelled' ? 'bg-gray-50 text-black' : ''}
                      `}>
                         {booking.status === 'Confirmed' && <CheckCircle size={12} />}
                         {booking.status === 'Pending' && <Clock size={12} />}
                         {booking.status === 'Completed' && <CheckCircle size={12} />}
                         {booking.status === 'Cancelled' && <XCircle size={12} />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right relative hidden lg:table-cell">
                       <button onClick={(e) => toggleDropdown(e, booking.id)} className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent text-gray-400 hover:bg-gray-100 hover:text-[#1c1c1c] ml-auto focus:outline-none transition-colors">
                         <MoreVertical size={16} />
                       </button>
                       {openDropdown === booking.id && (
                         <div className="absolute right-6 top-10 mt-1 w-48 bg-white shadow-2xl border border-[#eaeaea] rounded-2xl overflow-hidden z-20">
                            {(booking.status === 'Pending') && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(booking.id, 'Confirmed'); }} className="w-full text-left px-5 py-3 text-xs font-bold text-[#1c1c1c] hover:bg-[#f9f9f9] border-b border-gray-50 text-black">Mark Confirmed</button>}
                            {(booking.status === 'Confirmed') && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(booking.id, 'Completed'); }} className="w-full text-left px-5 py-3 text-xs font-bold text-[#1c1c1c] hover:bg-[#f9f9f9] border-b border-gray-50">Mark Completed</button>}
                            {(booking.status !== 'Cancelled' && booking.status !== 'Completed') && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(booking.id, 'Cancelled'); }} className="w-full text-left px-5 py-3 text-xs font-bold text-[#1c1c1c] hover:bg-[#f9f9f9] border-b border-gray-50 text-black">Cancel Booking</button>}
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(booking.id); }} className="w-full text-left px-5 py-3 text-xs font-bold text-black hover:bg-gray-50 flex items-center gap-2"><Trash2 size={14}/> Delete Record</button>
                         </div>
                       )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6">
                       <div className="text-center py-24 bg-white rounded-b-3xl">
                          <div className="w-16 h-16 bg-[#f9f9f9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                             <PackageOpen size={24} className="text-gray-300" />
                          </div>
                          <h3 className="text-lg font-black text-[#1c1c1c] mb-1">No bookings found</h3>
                          <p className="text-sm font-medium text-gray-400">Try adjusting your active filters.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Calendar View */}
        {viewMode === "Calendar" && (
          <div className="bg-white border border-[#eaeaea] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden mt-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#1c1c1c] capitalize">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 bg-[#f9f9f9] rounded-lg hover:bg-gray-200">
                  <span className="font-bold text-gray-500">&larr;</span>
                </button>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 bg-[#f9f9f9] rounded-lg hover:bg-gray-200">
                  <span className="font-bold text-gray-500">&rarr;</span>
                </button>
              </div>
            </div>
            <div className="w-full">
              <div 
                className="grid gap-px bg-[#eaeaea] border border-[#eaeaea] rounded-xl overflow-hidden"
                style={{ gridTemplateColumns: 'auto auto auto auto auto auto auto' }}
              >
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-[#f9f9f9] text-center py-3 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  {day}
                </div>
              ))}
              {(() => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const firstDayIndex = new Date(year, month, 1).getDay();
                
                const days = [];
                for (let i = 0; i < firstDayIndex; i++) {
                  days.push(<div key={`empty-${i}`} className="bg-white min-h-[100px] p-2"></div>);
                }
                for (let i = 1; i <= daysInMonth; i++) {
                  const dateStr = new Date(Date.UTC(year, month, i)).toISOString().split('T')[0];
                  // Format the bookings to match dateStr
                  const dayBookings = currentItems.filter(b => {
                     try {
                        return new Date(b.date).toISOString().split('T')[0] === dateStr;
                     } catch(e) {
                        return b.date === dateStr; // fallback
                     }
                  });
                  days.push(
                    <div key={`day-${i}`} className="bg-white min-h-[90px] p-1 sm:p-2 border-t border-transparent hover:border-black transition-colors flex flex-col overflow-hidden">
                      <span className={`text-[10px] sm:text-xs font-bold inline-block w-5 h-5 sm:w-6 sm:h-6 text-center leading-5 sm:leading-6 rounded-full mb-1 shrink-0 ${dayBookings.length > 0 ? 'bg-primary text-white' : 'text-gray-400'}`}>{i}</span>
                      <div className="flex flex-col gap-1 mt-0.5 sm:mt-1 flex-1">
                        {dayBookings.slice(0, 3).map((bk, idx) => (
                          <div key={idx} onClick={() => setSelectedBooking(bk)} className={`text-[8px] sm:text-[9px] font-bold p-1 sm:p-1.5 rounded w-full break-words whitespace-normal leading-[1.1] cursor-pointer hover:bg-opacity-80
                            ${bk.status === 'Confirmed' ? 'bg-black text-white text-[#1c1c1c]' : 'bg-[#f9f9f9] text-[#1c1c1c]'}`}>
                            {bk.user}
                          </div>
                        ))}
                        {dayBookings.length > 3 && (
                          <div className="text-[8px] sm:text-[9px] font-bold text-gray-400 pl-1">+{dayBookings.length - 3}</div>
                        )}
                      </div>
                    </div>
                  );
                }
                return days;
              })()}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Tap-to-Expand Mobile Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center pt-20 sm:pt-4 px-0 sm:px-4 pb-0 sm:pb-4">
          <div className="fixed inset-0 bg-[#1c1c1c]/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 pb-12 sm:pb-6 z-10 animate-slideUp sm:animate-scaleIn overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#1c1c1c]">{selectedBooking.id}</h3>
                  <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">Booking Reference</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="w-10 h-10 bg-[#f9f9f9] rounded-full flex items-center justify-center text-[#1c1c1c] hover:bg-gray-200 transition-colors">
                  <X size={18} strokeWidth={2.5} />
                </button>
             </div>
             
             <div className="space-y-5 mb-8 border-y border-[#eaeaea] py-6">
               <div>
                 <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Users size={12}/> Customer Profile</p>
                 <p className="text-[15px] font-bold text-[#1c1c1c]">{selectedBooking.user}</p>
                 <p className="text-sm font-bold text-black mt-0.5">{selectedBooking.contact}</p>
               </div>
               <div>
                 <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><PackageOpen size={12}/> Product Selected</p>
                 <p className="text-[15px] font-bold text-[#1c1c1c]">{selectedBooking.tour}</p>
                 <p className="text-sm font-bold text-gray-500 mt-0.5">Category: {activeTab}</p>
               </div>
               <div className="flex justify-between bg-[#f9f9f9] p-4 rounded-2xl">
                 <div>
                   <p className="text-[10px] font-extrabold text-[#1c1c1c] uppercase tracking-widest mb-1">Timestamp</p>
                   <p className="text-sm font-bold text-[#1c1c1c] flex items-center gap-1.5"><Calendar size={14} className="text-[#dcdcdc]"/> {selectedBooking.date}</p>
                 </div>
                 <div className="text-right border-l border-[#eaeaea] pl-4">
                   <p className="text-[10px] font-extrabold text-[#1c1c1c] uppercase tracking-widest mb-1">Transaction</p>
                   <p className="text-sm font-black text-[#1c1c1c]">{selectedBooking.amount}</p>
                 </div>
               </div>
               
               {selectedBooking.details && (
                 <div className="mt-4 p-5 bg-[#f9f9f9] rounded-[24px] border border-[#eaeaea]">
                   <p className="text-[10px] font-extrabold text-[#1c1c1c] uppercase tracking-widest mb-4 flex items-center gap-1.5"><Newspaper size={12}/> Form Details</p>
                   <div className="grid grid-cols-2 gap-4">
                     {Object.entries(selectedBooking.details).map(([key, value]) => {
                        if (key.toLowerCase() === 'image' || key.toLowerCase() === 'duration') return null; // Hide image and duration
                        
                        let displayValue = typeof value === 'object' ? JSON.stringify(value) : value;

                        // Determine if it should span full width
                        const isLongValue = String(displayValue).length > 20 || key.toLowerCase().includes('location') || key.toLowerCase().includes('email') || key.toLowerCase().includes('message');

                        return (
                          <div key={key} className={isLongValue ? "col-span-2" : "col-span-1"}>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight mb-1">{key.replace(/_/g, ' ')}</div>
                            <div className="text-[13px] font-bold text-[#1c1c1c] leading-snug break-words">{displayValue || '-'}</div>
                          </div>
                        );
                      })}
                   </div>
                 </div>
               )}

             </div>

             <div className="space-y-3">
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Management Actions</p>

               <div className="grid grid-cols-2 gap-3 mb-4">
                  <span className={`col-span-2 inline-flex items-center justify-center py-2.5 rounded-xl text-sm font-black uppercase tracking-widest border
                    ${selectedBooking.status === 'Confirmed' ? 'bg-gray-200 text-black border-black' : ''}
                    ${selectedBooking.status === 'Pending' ? 'bg-gray-50 text-black border-gray-300' : ''}
                    ${selectedBooking.status === 'Completed' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                    ${selectedBooking.status === 'Cancelled' ? 'bg-gray-50 text-black border-gray-300' : ''}
                  `}>
                      Current Status: {selectedBooking.status}
                  </span>
               </div>

                {(selectedBooking.status === 'Pending') && <button onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')} className="w-full py-3.5 bg-black text-white text-[#1c1c1c] font-black rounded-xl hover:bg-[#c9c9c9] transition-colors shadow-sm">Mark as Confirmed</button>}
                {(selectedBooking.status === 'Confirmed') && <button onClick={() => handleStatusChange(selectedBooking.id, 'Completed')} className="w-full py-3.5 bg-[#1c1c1c] text-white font-black rounded-xl hover:bg-black transition-colors shadow-sm">Mark as Completed</button>}
                {(selectedBooking.status !== 'Cancelled' && selectedBooking.status !== 'Completed') && <button onClick={() => handleStatusChange(selectedBooking.id, 'Cancelled')} className="w-full py-3 bg-white border border-[#eaeaea] text-[#1c1c1c] font-extrabold rounded-xl hover:bg-gray-50 transition-colors">Cancel Booking</button>}
                <button onClick={() => handleDelete(selectedBooking.id)} className="w-full py-3 bg-gray-50 border border-gray-300 text-black font-extrabold rounded-xl hover:bg-gray-100 transition-colors mt-4">Delete Record</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
