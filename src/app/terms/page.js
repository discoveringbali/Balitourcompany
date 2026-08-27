"use client";

import React from 'react';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-32 pb-16">
      <div className="container mx-auto px-6 flex-grow max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight mb-4">Terms & Conditions</h1>
          <p className="text-text-secondary font-medium">Please read these terms carefully before booking with us.</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8 text-gray-600 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-lg font-black text-primary mb-3">1. General Overview</h2>
            <p>
              Welcome to Balance Island Tours. By accessing or using our website, booking our services, or interacting with our partners, 
              you agree to comply with and be bound by the following Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-primary mb-3">2. Booking & Pricing</h2>
            <p>
              All prices listed on our website are in Indonesian Rupiah (IDR) unless otherwise stated. Prices are subject to change without prior notice, 
              though any confirmed bookings will be honored at the agreed price. 
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-primary mb-3">3. Liability & Safety</h2>
            <p>
              While we take every precaution to ensure the safety of our guests, Balance Island Tours acts only as an agent for the passengers in all functions pertaining to tours, 
              attractions, and accommodations. We are not liable for any injury, damage, loss, or delay affecting any person or property during our tours. 
              We highly recommend that all guests purchase comprehensive travel insurance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-primary mb-3">4. Intellectual Property</h2>
            <p>
              The content, layout, design, data, and graphics on this website are protected by intellectual property laws and are owned by Balance Island Tours. 
              You may not reproduce, download, transmit, or distribute any part of this website without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-primary mb-3">5. Privacy Policy</h2>
            <p>
              Your privacy is extremely important to us. Any personal information collected during the booking process is used solely for fulfilling your tour requirements 
              and will not be sold or shared with third parties without your consent, except as required by law.
            </p>
          </section>

        </div>
      </div>
      
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
