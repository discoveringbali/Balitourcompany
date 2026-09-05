import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Users, Star, Compass } from "lucide-react";

export const metadata = {
  title: "About Us | Balance Island - Premier Bali Tour Company",
  description: "Discover the authentic beauty of Bali with Balance Island. We are a trusted local Bali travel agency specializing in premium private tours and curated experiences.",
};

export default function About() {
  return (
    <div className="w-full bg-white pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] mb-16">
        <Image 
          src="https://images.unsplash.com/photo-1554481923-a6918bd997bc?auto=format&fit=crop&q=80&w=2000"
          alt="Beautiful Bali Rice Terraces - Balance Island Tours"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white tracking-tight drop-shadow-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
            About Balance Island
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl font-medium drop-shadow-md">
            Your Trusted Bali Travel Agency for Authentic & Premium Experiences
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:max-w-7xl">
        {/* Our Story / Mission */}
        <div className="flex flex-col items-center mb-24 max-w-4xl mx-auto text-center">
          <span className="text-sm font-extrabold text-gray-500 uppercase tracking-[0.2em] mb-4">Our Story</span>
          <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
            Curating the Best Private Bali Tours
          </h2>
          <div className="space-y-6 text-text-secondary text-base md:text-lg leading-relaxed text-left md:text-center">
            <p>
              We are a premium platform dedicated to curating the best experiences on the island. From hidden temples and pristine beaches to luxury spa retreats and secure rentals, our goal is to streamline your perfect journey in Bali.
            </p>
            <p>
              At <strong>Balance Island</strong>, we believe that traveling should be more than just visiting tourist spots; it should be an immersion into the local culture. As a leading <strong>Bali Tour Company</strong>, we partner with passionate, knowledgeable <strong>local Balinese guides</strong> who are eager to share the true spirit of the Island of Gods.
            </p>
            <p>
              Whether you are looking for an adventurous waterfall trek, a serene yoga retreat, or a customized <strong>private Bali day tour</strong>, our dedicated team ensures every detail is handled with care, providing you with a safe, luxurious, and completely unforgettable holiday.
            </p>
          </div>
        </div>

        {/* Why Choose Us Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Why Travel with Balance Island?
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              We stand out as the most trusted local travel agency in Bali by prioritizing quality, authenticity, and your absolute peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <Compass size={28} />
              </div>
              <h3 className="font-extrabold text-xl text-primary mb-3">Authentic Itineraries</h3>
              <p className="text-text-secondary leading-relaxed">
                Skip the crowded tourist traps. Our customized tours take you off the beaten path to discover the real Bali.
              </p>
            </div>
            <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="font-extrabold text-xl text-primary mb-3">Local Expert Guides</h3>
              <p className="text-text-secondary leading-relaxed">
                Travel with friendly, English-speaking local drivers who treat you like family and ensure your safety at all times.
              </p>
            </div>
            <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-extrabold text-xl text-primary mb-3">Secure & Trusted</h3>
              <p className="text-text-secondary leading-relaxed">
                As a registered Bali travel agency, we guarantee transparent pricing, secure bookings, and no hidden fees.
              </p>
            </div>
            <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <Star size={28} className="fill-white" />
              </div>
              <h3 className="font-extrabold text-xl text-primary mb-3">5-Star Quality</h3>
              <p className="text-text-secondary leading-relaxed">
                From premium vehicles to curated activities, our top-rated experiences guarantee an unforgettable getaway.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-black text-white rounded-[32px] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Ready to Explore Bali?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Browse our exclusive collection of private tours, activities, and transport options to start building your perfect itinerary.
            </p>
            <Link href="/tours" className="inline-block bg-white text-black font-extrabold text-[14px] md:text-base px-6 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:scale-105 active:scale-95 duration-200 whitespace-nowrap">
              View All Tours & Activities
            </Link>
          </div>
          {/* Abstract circles decoration */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
}
