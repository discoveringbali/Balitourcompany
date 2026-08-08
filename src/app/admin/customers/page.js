"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Users, MoreVertical, Trash2, Edit2, ShieldAlert, CircleUser, X, Mail, Phone, Calendar } from "lucide-react";

export default function CustomersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Tap-to-expand modal
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const initialCustomers = [];

  useEffect(() => {
    const saved = localStorage.getItem("bali_customers");
    if (saved) {
      setCustomers(JSON.parse(saved));
    } else {
      setCustomers(initialCustomers);
      localStorage.setItem("bali_customers", JSON.stringify(initialCustomers));
    }
    setIsLoaded(true);
  }, []);

  const saveCustomers = (newData) => {
    setCustomers(newData);
    localStorage.setItem("bali_customers", JSON.stringify(newData));
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = customers.map(c => c.id === id ? { ...c, status: newStatus } : c);
    saveCustomers(updated);
    setOpenDropdown(null);
    if(selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer({...selectedCustomer, status: newStatus});
    }
  };

  const handleDelete = (id) => {
    if (confirm("Permanently delete this customer record?")) {
      const updated = customers.filter(c => c.id !== id);
      saveCustomers(updated);
      setSelectedCustomer(null);
    }
    setOpenDropdown(null);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone });
    setIsModalOpen(true);
    setOpenDropdown(null);
    setSelectedCustomer(null); // Close tap modal if edit is opened
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (editingCustomer) {
      const updated = customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c);
      saveCustomers(updated);
    } else {
      const newCust = {
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name || "Unknown User",
        email: formData.email,
        phone: formData.phone,
        joined: "Just Now",
        ltv: "Rp 0",
        status: "Active"
      };
      saveCustomers([newCust, ...customers]);
    }
    setIsModalOpen(false);
  };

  if (!isLoaded) return null;

  const currentItems = customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto scroll-smooth">
      <div className="space-y-8 pb-24">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1c1c1c] tracking-tight">Customers</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage user profiles and track lifetime value.</p>
          </div>
          <button onClick={openAddModal} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold bg-black text-white hover:bg-neutral-800 transition-all active:scale-95 shadow-sm">
            <Plus size={18} strokeWidth={2.5} /> Add Customer
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-2.5 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1c1c1c] pl-11 pr-4 py-3 md:py-2 outline-none placeholder:text-gray-400 placeholder:font-medium"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white border border-[#eaeaea] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden mt-4">
          <div className="overflow-x-hidden">
            <table className="w-full text-left border-collapse cursor-pointer">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-[#eaeaea]">
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4">Customer</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 hidden md:table-cell">Contact</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 hidden lg:table-cell">Joined Date</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 hidden sm:table-cell">Status</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 text-right">Lifetime Value</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 text-right hidden md:table-cell">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaea]">
                {currentItems.length > 0 ? currentItems.map((cust, i) => (
                  <tr key={i} onClick={() => setSelectedCustomer(cust)} className="hover:bg-[#f9f9f9] active:bg-gray-100 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-2xl bg-[#f9f9f9] border border-[#eaeaea] text-[#1c1c1c] flex items-center justify-center shrink-0 group-hover:bg-[#1c1c1c] group-hover:text-[#dcdcdc] transition-colors">
                            <CircleUser size={20} strokeWidth={2} />
                         </div>
                         <div>
                           <p className="text-sm font-extrabold text-[#1c1c1c]">{cust.name}</p>
                           <p className="text-[11px] text-gray-400 font-bold">{cust.id}</p>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                       <p className="text-sm font-bold text-[#1c1c1c]">{cust.email}</p>
                       <p className="text-[11px] text-gray-500 font-bold mt-0.5">{cust.phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500 hidden lg:table-cell">{cust.joined}</td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest
                        ${cust.status === 'Active' ? 'bg-gray-200 text-[#1c1c1c]' : 'bg-gray-50 text-black'}
                      `}>
                        {cust.status === 'Suspended' && <ShieldAlert size={12} />}
                        {cust.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-[#1c1c1c] text-right">{cust.ltv}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right relative hidden md:table-cell">
                       <button onClick={(e) => toggleDropdown(e, cust.id)} className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent text-gray-400 hover:bg-gray-100 hover:text-[#1c1c1c] ml-auto focus:outline-none transition-colors">
                         <MoreVertical size={16} />
                       </button>
                       {openDropdown === cust.id && (
                         <div className="absolute right-6 top-10 mt-1 w-48 bg-white shadow-2xl border border-[#eaeaea] rounded-2xl overflow-hidden z-20">
                            <button onClick={(e) => { e.stopPropagation(); openEditModal(cust); }} className="w-full text-left px-5 py-3 text-xs font-bold text-[#1c1c1c] hover:bg-[#f9f9f9] border-b border-[#eaeaea] flex items-center gap-2"><Edit2 size={14}/> Edit Details</button>
                            {(cust.status === 'Suspended') ? (
                              <button onClick={(e) => { e.stopPropagation(); handleStatusChange(cust.id, 'Active'); }} className="w-full text-left px-5 py-3 text-xs font-bold text-black hover:bg-[#f9f9f9] border-b border-[#eaeaea]">Unsuspend User</button>
                            ) : (
                              <button onClick={(e) => { e.stopPropagation(); handleStatusChange(cust.id, 'Suspended'); }} className="w-full text-left px-5 py-3 text-xs font-bold text-black hover:bg-[#f9f9f9] border-b border-[#eaeaea]">Suspend User</button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(cust.id); }} className="w-full text-left px-5 py-3 text-xs font-bold text-black hover:bg-gray-50 flex items-center gap-2"><Trash2 size={14}/> Delete User</button>
                         </div>
                       )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6">
                       <div className="text-center py-24 bg-white rounded-b-3xl">
                          <div className="w-16 h-16 bg-[#f9f9f9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                             <Users size={24} className="text-gray-300" />
                          </div>
                          <h3 className="text-lg font-black text-[#1c1c1c] mb-1">No customers found</h3>
                          <p className="text-sm font-medium text-gray-400">Try adjusting your active filters.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Tap-to-Expand Mobile Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center pt-20 px-4 pb-4">
           <div className="fixed inset-0 bg-[#1c1c1c]/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCustomer(null)} />
           <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-6 z-10 animate-slideUp sm:animate-scaleIn overflow-y-auto max-h-[85vh]">
             <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                   <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-[#1c1c1c] shrink-0">
                      <CircleUser size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-[#1c1c1c]">{selectedCustomer.name}</h3>
                     <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">{selectedCustomer.id}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="w-10 h-10 bg-[#f9f9f9] rounded-full flex items-center justify-center text-[#1c1c1c] hover:bg-gray-200 transition-colors">
                  <X size={18} strokeWidth={2.5} />
                </button>
             </div>
             
             <div className="space-y-5 mb-8 border-y border-[#eaeaea] py-6">
                <div>
                   <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Mail size={12}/> Email Address</p>
                   <p className="text-[15px] font-bold text-[#1c1c1c] underline decoration-gray-300">{selectedCustomer.email}</p>
                </div>
                <div>
                   <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Phone size={12}/> Phone Number</p>
                   <p className="text-[15px] font-bold text-[#1c1c1c] underline decoration-gray-300">{selectedCustomer.phone}</p>
                </div>
                <div className="flex justify-between bg-[#f9f9f9] p-4 rounded-2xl">
                   <div>
                     <p className="text-[10px] font-extrabold text-[#1c1c1c] uppercase tracking-widest mb-1">Joined Date</p>
                     <p className="text-sm font-bold text-[#1c1c1c] flex items-center gap-1.5"><Calendar size={14} className="text-[#dcdcdc]"/> {selectedCustomer.joined}</p>
                   </div>
                   <div className="text-right border-l border-[#eaeaea] pl-4">
                     <p className="text-[10px] font-extrabold text-[#1c1c1c] uppercase tracking-widest mb-1">Lifetime Value</p>
                     <p className="text-sm font-black text-[#1c1c1c]">{selectedCustomer.ltv}</p>
                   </div>
                </div>
             </div>

             <div className="space-y-3">
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Management Actions</p>

               <div className="grid grid-cols-2 gap-3 mb-4">
                  <span className={`col-span-2 inline-flex items-center justify-center py-2.5 rounded-xl text-sm font-black uppercase tracking-widest border
                    ${selectedCustomer.status === 'Active' ? 'bg-gray-200 text-black border-black' : 'bg-gray-50 text-black border-gray-300'}
                  `}>
                      Current Status: {selectedCustomer.status}
                  </span>
               </div>
               
               <button onClick={() => openEditModal(selectedCustomer)} className="w-full py-3.5 bg-black text-white text-[#1c1c1c] font-black rounded-xl hover:bg-[#c9c9c9] transition-colors shadow-sm mb-2">Edit Details</button>

               {(selectedCustomer.status === 'Suspended') ? (
                  <button onClick={() => handleStatusChange(selectedCustomer.id, 'Active')} className="w-full py-3.5 bg-[#1c1c1c] text-white font-black rounded-xl hover:bg-black transition-colors shadow-sm">Unsuspend User</button>
               ) : (
                  <button onClick={() => handleStatusChange(selectedCustomer.id, 'Suspended')} className="w-full py-3 bg-white border border-[#eaeaea] text-[#1c1c1c] font-extrabold rounded-xl hover:bg-gray-50 transition-colors">Suspend User</button>
               )}
               <button onClick={() => handleDelete(selectedCustomer.id)} className="w-full py-3 bg-gray-50 border border-gray-300 text-black font-extrabold rounded-xl hover:bg-gray-100 transition-colors mt-4">Delete Record</button>

             </div>
           </div>
        </div>
      )}

      {/* Edit/Add Modal Native Styled */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center font-sans px-4">
          <div className="fixed inset-0 bg-[#1c1c1c]/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-6 md:p-8 z-10 animate-scaleIn">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-[#1c1c1c]">{editingCustomer ? "Edit Customer" : "Add Customer"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="bg-[#f9f9f9] p-2 rounded-full text-[#1c1c1c] hover:bg-gray-200">
                  <X size={18} strokeWidth={2.5} />
                </button>
             </div>
             
             <div className="space-y-5">
                <div>
                   <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                   <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#f9f9f9] text-sm font-bold text-[#1c1c1c] rounded-2xl px-5 py-4 border border-[#eaeaea] outline-none focus:border-[#1c1c1c] transition-colors" placeholder="John Doe" />
                </div>
                <div>
                   <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                   <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#f9f9f9] text-sm font-bold text-[#1c1c1c] rounded-2xl px-5 py-4 border border-[#eaeaea] outline-none focus:border-[#1c1c1c] transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                   <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                   <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#f9f9f9] text-sm font-bold text-[#1c1c1c] rounded-2xl px-5 py-4 border border-[#eaeaea] outline-none focus:border-[#1c1c1c] transition-colors" placeholder="+62..." />
                </div>
             </div>

             <div className="mt-8 flex gap-3">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-[#eaeaea] text-[#1c1c1c] font-extrabold rounded-2xl hover:bg-gray-50 transition-colors">Cancel</button>
               <button onClick={handleSaveModal} className="flex-1 py-4 bg-black text-white text-[#1c1c1c] font-black rounded-2xl hover:bg-[#c9c9c9] transition-colors">Save Details</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
