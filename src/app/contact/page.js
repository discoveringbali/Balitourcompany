import React from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Balance Island",
  description: "Get in touch with Balance Island for support and inquiries."
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-10">
      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex-grow">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-[32px] md:text-[40px] font-black text-gray-900 mb-6 tracking-tight">Contact Us</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-100">
            <h2 className="text-[20px] font-bold text-gray-900 mb-2">PT BALANCE ISLAND INDONESIA</h2>
            <p className="text-gray-500 mb-8">We are a registered tourism company operating natively in Bali, Indonesia. Reach out to us through any of the channels below.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <MapPin className="text-gray-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Headquarters</h4>
                  <p className="text-gray-500 text-[14px]">Denpasar, Bali<br/>Indonesia</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-gray-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">WhatsApp Support</h4>
                  <p className="text-gray-500 text-[14px]">+62 (0) 812-3456-7890<br/>Available 24/7</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="text-gray-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-500 text-[14px]">support@balanceisland.com<br/>partnerships@balanceisland.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="text-gray-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Operating Hours</h4>
                  <p className="text-gray-500 text-[14px]">Online Support: 24/7<br/>Office: 09:00 - 18:00 (WITA)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 md:p-12 bg-gray-50">
            <h3 className="font-bold text-gray-900 mb-4">Send us a message</h3>
            <form className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-gray-900" />
                <input type="email" placeholder="Email Address" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-gray-900" />
              </div>
              <textarea placeholder="How can we help you?" rows="4" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-gray-900 resize-none"></textarea>
              <button type="button" className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl w-fit hover:bg-black transition-colors">Submit Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
