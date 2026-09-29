"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import ListingCard from "@/components/listing/ListingCard";

export default function DestinationClient({ locationSlug, allListings }) {
  const displayLocation = locationSlug.charAt(0).toUpperCase() + locationSlug.slice(1).replace(/-/g, ' ');
  
  const popularPlaces = {
    ubud: [
      { name: "Sacred Monkey Forest Sanctuary", desc: "A nature reserve and Hindu temple complex.", query: "Sacred+Monkey+Forest+Sanctuary+Ubud" },
      { name: "Tegalalang Rice Terrace", desc: "Stunning terraced rice paddies.", query: "Tegalalang+Rice+Terrace+Ubud" },
      { name: "Campuhan Ridge Walk", desc: "A scenic paved trekking path.", query: "Campuhan+Ridge+Walk+Ubud" },
      { name: "Ubud Palace", desc: "Historical palace of the Ubud royal family.", query: "Ubud+Palace" }
    ],
    uluwatu: [
      { name: "Uluwatu Temple", desc: "A stunning sea temple on a cliff edge.", query: "Uluwatu+Temple" },
      { name: "Suluban Beach", desc: "A unique beach hidden within a cave.", query: "Suluban+Beach" },
      { name: "Padang Padang Beach", desc: "A famous surfing spot and beautiful cove.", query: "Padang+Padang+Beach" },
      { name: "Garuda Wisnu Kencana (GWK)", desc: "A massive cultural park and monument.", query: "Garuda+Wisnu+Kencana+Cultural+Park" }
    ],
    "nusa penida": [
      { name: "Kelingking Beach", desc: "The famous T-Rex shaped cliff and pristine beach.", query: "Kelingking+Beach+Nusa+Penida" },
      { name: "Broken Beach", desc: "A picturesque coastal formation with a natural bridge.", query: "Broken+Beach+Nusa+Penida" },
      { name: "Angel's Billabong", desc: "A stunning natural infinity pool.", query: "Angel's+Billabong+Nusa+Penida" },
      { name: "Crystal Bay", desc: "A beautiful palm-fringed bay perfect for snorkeling.", query: "Crystal+Bay+Nusa+Penida" }
    ],
    kintamani: [
      { name: "Mount Batur", desc: "An active volcano famous for sunrise treks.", query: "Mount+Batur+Kintamani" },
      { name: "Lake Batur", desc: "A beautiful crater lake at the foot of Mount Batur.", query: "Lake+Batur+Kintamani" },
      { name: "Pura Ulun Danu Batur", desc: "One of the most important water temples in Bali.", query: "Pura+Ulun+Danu+Batur" },
      { name: "Kintamani Coffee Shops", desc: "Cafes offering spectacular volcano views.", query: "Kintamani+Coffee" }
    ],
    karangasem: [
      { name: "Lempuyang Temple", desc: "The iconic 'Gateway to Heaven' overlooking Mount Agung.", query: "Lempuyang+Temple+Karangasem" },
      { name: "Tirta Gangga", desc: "A beautiful former royal water palace.", query: "Tirta+Gangga+Karangasem" },
      { name: "Amed Beach", desc: "A tranquil coastal area famous for diving and snorkeling.", query: "Amed+Beach+Karangasem" },
      { name: "Taman Ujung", desc: "A grand water palace built by the King of Karangasem.", query: "Taman+Ujung+Karangasem" }
    ],
    bedugul: [
      { name: "Ulun Danu Beratan Temple", desc: "The iconic floating temple on Lake Beratan.", query: "Ulun+Danu+Beratan+Temple" },
      { name: "Bali Botanic Garden", desc: "Indonesia's largest botanical garden.", query: "Bali+Botanic+Garden+Bedugul" },
      { name: "Handara Gate", desc: "A popular, scenic traditional Hindu gate.", query: "Handara+Gate+Bali" },
      { name: "Jatiluwih Rice Terraces", desc: "A UNESCO World Heritage site featuring vast rice paddies.", query: "Jatiluwih+Rice+Terraces" }
    ]
  };

  const places = popularPlaces[locationSlug.toLowerCase().replace(/-/g, ' ')] || [];
  
  // Find tours matching this location
  const locationTours = allListings.filter(t => t.location?.toLowerCase().includes(displayLocation.toLowerCase()) || t.title?.toLowerCase().includes(displayLocation.toLowerCase()));
  
  // Find a good hero image
  const heroImage = locationTours.length > 0 
    ? (locationTours[0].image || locationTours[0].images?.[0]) 
    : "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=1200&q=80";

  return (
    <>
      {/* Hide the global navbar for this immersive page */}
      <style>{`
        nav { display: none !important; }
        main { padding-top: 0 !important; }
      `}</style>

      <div className="w-full bg-[#faf9f6] min-h-[100dvh] font-sans pb-32">
        {/* Hero Section */}
        <div className="relative w-full h-[50vh] md:h-[60vh] max-h-[600px] min-h-[400px]">
          <Image 
            src={heroImage} 
            alt={displayLocation} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-30">
            <Link href="/" className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors">
              <ArrowLeft size={20} />
            </Link>
          </div>

          <div className="absolute bottom-10 left-6 md:left-12 z-20 pr-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
                Local Guide
              </span>
            </div>
            <h1 className="text-[42px] md:text-[56px] font-serif italic text-white leading-tight drop-shadow-xl max-w-2xl mb-2" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
              {displayLocation}
            </h1>
            <p className="text-white/90 font-medium text-[15px] md:text-[18px] max-w-xl drop-shadow-md">
              The ultimate travel guide to exploring {displayLocation}, Bali. Discover the best things to do, secret spots, and highly-rated tours.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          {/* Left Column: Blog Content */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-12">
            <section className="bg-transparent">
              <h2 className="text-[32px] md:text-[40px] text-gray-900 mb-6 leading-tight" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                Welcome to {displayLocation}
              </h2>
              <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none">
                <p>
                  {displayLocation} is one of Bali's most captivating destinations, offering an unforgettable blend of culture, nature, and adventure. Whether you're a first-time visitor looking to tick off iconic bucket-list spots or a seasoned traveler searching for hidden gems, {displayLocation} has something for everyone.
                </p>
                <p className="mt-4">
                  In this guide, we've hand-picked the best experiences and top-rated tours available in {displayLocation}. Skip the hassle of planning and let our expert local drivers take you on a journey through lush rice terraces, ancient temples, pristine beaches, and breathtaking viewpoints. 
                </p>
                <h3 className="text-[24px] md:text-[28px] text-gray-900 mt-10 mb-4" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>Why visit {displayLocation}?</h3>
                <ul className="space-y-3 mt-4 list-none pl-0">
                  <li className="flex gap-3"><span className="text-primary mt-1">•</span> Stunning natural landscapes and Instagram-worthy photo spots.</li>
                  <li className="flex gap-3"><span className="text-primary mt-1">•</span> Rich cultural heritage with historic temples and traditional ceremonies.</li>
                  <li className="flex gap-3"><span className="text-primary mt-1">•</span> Incredible local cuisine and vibrant beach clubs or cafes.</li>
                  <li className="flex gap-3"><span className="text-primary mt-1">•</span> Seamless connectivity to other popular Bali destinations.</li>
                </ul>
                <p className="mt-8 font-medium text-black">
                  Ready to explore? Browse our curated list of tours below and book your adventure directly!
                </p>
              </div>
            </section>

            {/* Top Places Section */}
            {places.length > 0 && (
              <section className="pt-8 border-t border-gray-200">
                <h2 className="text-[32px] md:text-[40px] text-gray-900 mb-6 leading-tight" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                  Places to Visit in {displayLocation}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {places.map((place, index) => (
                    <a 
                      key={index}
                      href={`https://www.google.com/maps/search/?api=1&query=${place.query}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-1"
                    >
                      <h4 className="text-[16px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {place.name}
                      </h4>
                      <p className="text-[13px] text-gray-500 leading-relaxed">
                        {place.desc}
                      </p>
                      <span className="text-[12px] font-bold text-blue-600 mt-2 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        View on Maps <ArrowLeft size={12} className="rotate-135 transform scale-x-[-1] ml-1" />
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Tours Section */}
            <section id="tours" className="pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[32px] md:text-[40px] text-gray-900 leading-tight" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                  Best Tours in {displayLocation}
                </h2>
              </div>
              
              {locationTours.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                  {locationTours.map(tour => (
                    <div key={tour.id} className="animate-in fade-in zoom-in duration-300">
                      <ListingCard item={tour} linkTo={`/tours/${generateSlug(tour.title)}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900">No Tours Found</h3>
                  <p className="text-gray-500 mt-1">We couldn't find any specific tours for {displayLocation} at the moment. Try browsing all tours!</p>
                  <Link href="/tours" className="inline-block mt-4 bg-black text-white px-6 py-2.5 rounded-full font-bold hover:bg-gray-800 transition-colors">
                    View All Tours
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Widget */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-10 bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-gray-100 flex flex-col gap-6">
              <div>
                <h3 className="text-[18px] font-black text-primary">Need a custom itinerary?</h3>
                <p className="text-[14px] text-gray-500 mt-2 leading-relaxed">
                  Want to explore {displayLocation} at your own pace? Hire one of our private drivers and craft your perfect day.
                </p>
              </div>
              <Link 
                href="/map?service=Transport" 
                className="w-full py-3.5 bg-black text-white text-[15px] font-bold rounded-full text-center hover:bg-black/80 transition-colors active:scale-95 flex items-center justify-center gap-2"
              >
                 Hire a Private Driver
              </Link>

              <hr className="border-gray-100" />
              
              <div>
                <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3">Top Highlights</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <div className="text-[14px] font-bold text-gray-900">Expert Local Guides</div>
                      <div className="text-[12px] text-gray-500">English speaking drivers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <div className="text-[14px] font-bold text-gray-900">Curated Experiences</div>
                      <div className="text-[12px] text-gray-500">Only the best spots</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
