import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact Us | My Bali Driver",
};

export default function Contact() {
  return (
    <div className="w-full pt-32 pb-20 container mx-auto px-4 lg:max-w-7xl min-h-[60vh] flex flex-col items-center justify-center text-center font-sans">
      <h1 className="text-4xl md:text-5xl font-black mb-4 text-primary tracking-tight">Contact Us</h1>
      <p className="text-gray-500 font-medium max-w-lg mx-auto mb-10">Have questions about our tours or need assistance with your booking? We're here to help.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <a 
          href="https://wa.me/6285174119423" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:shadow-md transition-shadow group"
        >
          <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-extrabold text-lg text-primary">WhatsApp</h3>
            <p className="text-gray-500 font-bold">+62 851 7411 9423</p>
          </div>
        </a>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-50 text-black rounded-2xl flex items-center justify-center">
            <MapPin size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-extrabold text-lg text-primary">Headquarters</h3>
            <p className="text-gray-500 font-bold">Bali, Indonesia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
