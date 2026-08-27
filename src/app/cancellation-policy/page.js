"use client";

import React from 'react';
import Footer from '@/components/Footer';
import { ShieldCheck, Clock, CloudRain, CreditCard } from 'lucide-react';

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col pt-32 pb-16">
      <div className="container mx-auto px-6 flex-grow max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#1c1c1c] tracking-tight mb-4">Cancellation Policy</h1>
          <p className="text-gray-500 font-medium">Clear, fair, and flexible cancellation guidelines for our guests.</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-10">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1c1c1c] mb-2">Standard Cancellation</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                You can cancel or modify your booking free of charge up to 24 hours before the scheduled tour start time. 
                Cancellations made within 24 hours of the tour may be subject to a nominal cancellation fee to cover pre-arranged logistics.
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black shrink-0">
              <CloudRain size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1c1c1c] mb-2">Weather Conditions</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Bali weather can be unpredictable. If a tour or activity is canceled by our team due to unsafe weather conditions, 
                you will be offered an alternative date or a full refund without any penalty.
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1c1c1c] mb-2">No-Shows & Late Arrivals</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                If you fail to show up at the designated pickup point without prior notice, the booking will be considered a "No-Show" 
                and no refund will be issued. Please contact your driver or our support team if you expect to be delayed.
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1c1c1c] mb-2">Refund Processing</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                For pre-paid bookings eligible for a refund, processing times generally take 3-7 business days depending on your bank or payment provider. 
                Refunds will be issued to the original payment method.
              </p>
            </div>
          </div>

        </div>

      </div>
      
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
