"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Footer from '@/components/Footer';

const faqs = [
  {
    question: "What is included in the tour packages?",
    answer: "Our standard tour packages include private air-conditioned transportation, an English-speaking driver/guide, fuel, parking fees, and mineral water. Entrance tickets and meals are generally not included unless specified in the package details."
  },
  {
    question: "How do I make a booking?",
    answer: "You can book directly through our website by selecting your desired tour or activity and clicking the 'Book Now' button. You can also contact us via WhatsApp for custom arrangements."
  },
  {
    question: "Is payment required upfront?",
    answer: "For most tours, we accept payment on the day of the tour directly to your driver in Indonesian Rupiah (IDR). Some specialized activities or large group bookings may require a small deposit to secure the reservation."
  },
  {
    question: "Are your tours private or shared?",
    answer: "All of our sightseeing tours are 100% private. You will only be traveling with your own group, allowing for a flexible itinerary and personalized experience."
  },
  {
    question: "Can I customize the itinerary?",
    answer: "Absolutely! Our itineraries are fully customizable. If you wish to skip a location or add a new one, simply let your driver know. Please note that significant route changes might incur extra fuel charges."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col pt-32 pb-16">
      <div className="container mx-auto px-6 flex-grow max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-400 font-medium">Find answers to common questions about booking, payments, and our tours.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-[#111111] rounded-2xl border border-white/10 overflow-hidden shadow-sm transition-all hover:border-white/30"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-white text-sm md:text-base pr-4">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 pt-1 text-gray-400 text-sm leading-relaxed border-t border-white/10 mx-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 font-medium text-sm mb-4">Still have questions?</p>
          <a 
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg active:scale-95"
          >
            Contact Support
          </a>
        </div>
      </div>
      
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
