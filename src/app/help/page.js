import React from "react";
import Link from "next/link";
import { ChevronLeft, LifeBuoy, CreditCard, CalendarClock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Help Center | Balance Island",
  description: "Get assistance with your Bali tour bookings, payments, and itineraries."
};

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-10">
      <div className="max-w-5xl mx-auto w-full px-6 py-12 flex-grow">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-[32px] md:text-[40px] font-black text-gray-900 mb-4 tracking-tight">Help Center</h1>
        <p className="text-gray-500 mb-10 max-w-2xl text-[16px]">How can we assist you with your Bali adventure? Browse our most common topics below.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <div className="bg-blue-50 p-3 rounded-full h-fit text-blue-600"><LifeBuoy size={24} /></div>
            <div>
              <h3 className="font-bold text-gray-900 text-[18px] mb-2">Booking & Reservations</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">Learn how to book a tour, hire a driver, or modify an existing reservation with our local operators.</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <div className="bg-green-50 p-3 rounded-full h-fit text-green-600"><CreditCard size={24} /></div>
            <div>
              <h3 className="font-bold text-gray-900 text-[18px] mb-2">Payments & Pricing</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">We offer transparent, fixed pricing with no hidden fees. All major credit cards are securely accepted.</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <div className="bg-orange-50 p-3 rounded-full h-fit text-orange-600"><CalendarClock size={24} /></div>
            <div>
              <h3 className="font-bold text-gray-900 text-[18px] mb-2">Cancellations & Refunds</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">Most tours offer a full refund if canceled 24 hours in advance. Review specific policy terms.</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <div className="bg-purple-50 p-3 rounded-full h-fit text-purple-600"><ShieldCheck size={24} /></div>
            <div>
              <h3 className="font-bold text-gray-900 text-[18px] mb-2">Safety & Standards</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">All drivers and guides are rigorously vetted by PT BALANCE ISLAND INDONESIA for your peace of mind.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gray-900 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-[24px] font-bold mb-3">Still need help?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">Our local Bali-based support team is available 24/7 to help you plan the perfect trip.</p>
          <Link href="/contact" className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
