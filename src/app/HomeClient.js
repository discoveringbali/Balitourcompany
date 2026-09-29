"use client";

import React, { useState, useEffect } from "react";

import { TreePine, Umbrella, Mountain, Droplets, Search, Plane, Building, Building2, Train, Bus, BriefcaseBusiness, Heart, HeartOff, MapPin, Map, Car, Bike, Wifi, Navigation, Sparkles, Landmark, Camera, Waves, Compass, ChevronDown, ChevronLeft, ChevronRight, Settings2, Star, Zap, Home as HomeIcon, Flower2, Globe, ArrowUpRight, Play, Pause, Volume2, VolumeX, X, ShieldCheck, Users, Clock } from "lucide-react";
import { TourIcon, SpaIcon, TransportIcon, ScooterIcon, ThinSparklesIcon, TowelsIcon, LotusIcon, CreattieTourIcon, CreattieSpaIcon, CreattieScooterIcon, CreattieTransportIcon, CreattieEsimIcon, AirbnbTourIcon, AirbnbSpaIcon, AirbnbScooterIcon, AirbnbTransportIcon, AirbnbEsimIcon } from "@/components/icons/CategoryIcons";
import ListingCard from "@/components/listing/ListingCard";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { generateSlug } from "@/lib/utils";
import { isTripSaved, toggleSaveTrip } from "@/lib/favorites";
import { getCampaignSettings, DEFAULT_CAMPAIGNS } from "@/lib/campaigns";
import CampaignServiceShowcase from "@/components/campaign/CampaignServiceShowcase";
import FlashSaleCard from "@/components/home/FlashSaleCard";

const InstagramIcon = ({ size = 24, className = "", strokeWidth = 2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const BaliGateIcon = ({ className, isActive }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M5 22V10L9 6L9 22H5Z" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M19 22V10L15 6L15 22H19Z" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 14H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 14H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 18H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="7" cy="4" r="1" fill="currentColor" />
    <circle cx="17" cy="4" r="1" fill="currentColor" />
  </svg>
);

const services = [
  { id: "Tour", icon: Map },
  { id: "Activities", icon: Sparkles },
  { id: "eSIM", icon: TowelsIcon },
];

const getCategoriesForService = (service) => {
  if (service === "Tour" || service === "Activities") {
    return [
      { id: "All", icon: Compass },
      { id: "Adventure", icon: Mountain },
      { id: "Water", icon: Waves },
      { id: "Nature", icon: TreePine },
      { id: "Culture", icon: Landmark },
      { id: "Instagram", icon: Camera }
    ];
  }
  return [{ id: "All", icon: Compass }];
};

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/|live\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}?controls=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`
    : null;
};

const campaigns = [
  {
    id: 1,
    title: "Ubud Heritage",
    subtitle: "Experience the lush green beauty of Tegalalang.",
    badge: "Exclusive",
    image: ""
  },
  {
    id: 2,
    title: "Ubud Wellness\nRetreat",
    subtitle: "Complimentary 60-min massage with any villa booking.",
    badge: "Best Deal",
    image: "",
  },
  {
    id: 3,
    title: "Nusa Penida\nIsland Hopper",
    subtitle: "Fast boat & tour package starting at $49.",
    badge: "Limited Time",
    image: "",
  }
];

const popularTrips = [];

const Thumbnails = ({ images, fallbackImage }) => {
  const displayImages = images && images.length > 1 ? images : (fallbackImage ? [fallbackImage] : []);
  return (
    <>
      {displayImages.length > 1 ? (
        <>
          {displayImages.slice(1, 4).map((img, i) => (
            <div key={i} className="w-[52px] h-[52px] rounded-[14px] border-2 border-white/20 overflow-hidden relative bg-black/20 shadow-md shrink-0">
              <Image src={img} alt="thumbnail" fill sizes="52px" className="object-cover" />
            </div>
          ))}
          {displayImages.length > 4 && (
            <div className="w-[52px] h-[52px] rounded-[14px] bg-black/30 backdrop-blur-md flex items-center justify-center border-2 border-transparent shadow-md shrink-0">
              <span className="text-white text-[14px] font-medium">+{displayImages.length - 4}</span>
            </div>
          )}
        </>
      ) : (
        displayImages.length > 0 && (
          <div className="w-[52px] h-[52px] rounded-[14px] border-2 border-white/20 overflow-hidden relative bg-black/20 shadow-md shrink-0">
            <Image src={displayImages[0]} alt="thumbnail" fill sizes="52px" className="object-cover" />
          </div>
        )
      )}
    </>
  );
};

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <h3 className="text-[17px] font-bold text-gray-900 pr-4">{question}</h3>
        <div className={`shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-gray-600" />
        </div>
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-6 pb-6 text-[14px] text-gray-500 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const SEO_FAQS = [
  {
    question: "What are the top things to do in Bali?",
    answer: "The top things to do in Bali include visiting the Sacred Monkey Forest in Ubud, watching the sunset at Uluwatu Temple, swimming with Manta Rays in Nusa Penida, climbing Mount Batur in Kintamani for sunrise, and exploring the Tegalalang Rice Terraces. Balance Island provides private tours and experienced local drivers for all these top-rated Bali attractions."
  },
  {
    question: "How do I hire a private driver in Bali?",
    answer: "Hiring a private driver in Bali is the best way to explore the island safely and comfortably. With Balance Island, you can easily book a verified, English-speaking local driver for half-day or full-day trips. Our drivers know the best hidden gems in Ubud, Canggu, Seminyak, and Uluwatu, ensuring you have a seamless custom itinerary."
  },
  {
    question: "Is Nusa Penida worth visiting?",
    answer: "Absolutely! Nusa Penida is famous for Kelingking Beach (the T-Rex cliff), Broken Beach, and Angel's Billabong. We highly recommend booking a guided Nusa Penida Island Hopper tour with us, as the roads can be challenging. Our all-inclusive packages include fast boat tickets, a private car, and snorkeling."
  },
  {
    question: "Are the tour bookings secure?",
    answer: "Yes. Balance Island is an official brand of PT BALANCE ISLAND INDONESIA. We partner only with 5-star rated, verified local operators. All bookings are secure, and we offer 24/7 customer support via WhatsApp to assist with your Bali travel plans."
  },
  {
    question: "What is the best time to visit Bali?",
    answer: "The best time to visit Bali is during the dry season, from April to October. This period offers sunny days and lower humidity, perfect for beach hopping in Uluwatu, hiking Mount Batur, or exploring the cultural hub of Ubud. However, Bali is a great year-round destination."
  },
  {
    question: "Do you offer airport transfers in Bali?",
    answer: "Yes! Balance Island offers reliable and hassle-free airport transfers from Ngurah Rai International Airport (DPS) to any destination in Bali, including Seminyak, Canggu, Ubud, and Uluwatu. Our professional drivers will track your flight and wait for you at arrivals."
  },
  {
    question: "Where are the best waterfalls in Bali?",
    answer: "The best waterfalls are located in Northern and Central Bali. Sekumpul Waterfall, Gitgit, and Banyumala Twin Waterfalls are famous in the north. Near Ubud, you can visit Tegenungan, Tibumana, and Kanto Lampo waterfalls. You can book our custom waterfall tours to explore them easily."
  },
  {
    question: "Is Bali safe for tourists?",
    answer: "Yes, Bali is generally very safe for tourists. Locals are friendly and hospitable. However, it's always recommended to take standard precautions, like being aware of your belongings in crowded areas (like Canggu or Seminyak) and ensuring you book verified tours through trusted platforms like Balance Island."
  },
  {
    question: "Can I do a Mount Batur Sunrise Trek without a guide?",
    answer: "It is strongly discouraged and often prohibited by local authorities to hike Mount Batur without a local guide. Booking a guided Mount Batur sunrise trek with Balance Island guarantees your safety, includes flashlights and breakfast, and supports the local community."
  },
  {
    question: "What is the best area to stay in Bali?",
    answer: "It depends on your travel style. Seminyak and Canggu are best for beach clubs, surfing, and nightlife. Ubud is the cultural heart, perfect for yoga, rice terraces, and waterfalls. Uluwatu is stunning for clifftop views and surfing, while Nusa Dua offers luxury family resorts."
  },
  {
    question: "Do I need a Visa for Bali (Indonesia)?",
    answer: "Most travelers can obtain a Visa on Arrival (VoA) at Ngurah Rai Airport, which is valid for 30 days and can be extended once. We recommend checking the official Indonesian Immigration website for the most up-to-date e-Visa application options."
  },
  {
    question: "How do I get to the Gili Islands from Bali?",
    answer: "You can reach the Gili Islands (Gili Trawangan, Gili Air, and Gili Meno) by taking a fast boat from Padang Bai, Sanur, or Serangan harbor. The trip takes about 1.5 to 2 hours. Balance Island can help arrange your fast boat tickets with hotel pickup."
  },
  {
    question: "What currency is used in Bali?",
    answer: "The official currency is the Indonesian Rupiah (IDR). While many places accept credit cards, it is highly recommended to carry some cash (IDR) for small purchases, local markets, and tipping. There are many reliable ATMs in tourist hubs like Canggu, Seminyak, and Ubud."
  },
  {
    question: "Can I rent a scooter in Bali?",
    answer: "Yes, renting a scooter is very popular. However, you must have an International Driving Permit (IDP) with a motorcycle endorsement. Traffic in areas like Canggu and Ubud can be intense, so if you're not an experienced rider, hiring a private driver via Balance Island is much safer and stress-free."
  },
  {
    question: "What are the best snorkeling spots in Bali?",
    answer: "The best snorkeling spots include Manta Point in Nusa Penida, the USAT Liberty Shipwreck in Tulamben, Blue Lagoon in Padang Bai, and Menjangan Island in the northwest. Our curated snorkeling tours provide all equipment and expert local guides."
  },
  {
    question: "Are your tours family-friendly?",
    answer: "Absolutely! We offer a wide range of family-friendly tours, including Bali Safari, Waterbom Bali, cultural temple visits, and easy nature walks in Ubud. Our private drivers can provide baby car seats upon request to ensure a safe journey for your family."
  }
];

function PopularTripCard({ trip, priority = false }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (trip?.id) {
      // eslint-disable-next-line
      setIsSaved(isTripSaved(trip.id));
    }
    const handleUpdate = (e) => {
      if (trip?.id && e.detail?.id === trip.id) {
        // eslint-disable-next-line
        setIsSaved(e.detail.isSaved);
      }
    };
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, [trip?.id]);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!trip) return;
    const newState = toggleSaveTrip(trip);
    setIsSaved(newState);
  };

  let basePriceToUse = trip.price;
  const dataObj = trip.data || trip || {};
  let allTiers = [];
  if (dataObj.tourTiers) allTiers = [...allTiers, ...dataObj.tourTiers];
  if (dataObj.allInclusiveTiers) allTiers = [...allTiers, ...dataObj.allInclusiveTiers];
  if (dataObj.groupTiers) allTiers = [...allTiers, ...dataObj.groupTiers];

  const validTiers = allTiers.filter(t => t.price && Number(String(t.price).replace(/[^0-9]/g, '')) > 0);
  const cleanBasePriceVal = Number(String(basePriceToUse || 0).replace(/[^0-9]/g, ''));

  if (validTiers.length > 0) {
      validTiers.sort((a, b) => {
          const aPrice = Number(String(a.price).replace(/[^0-9]/g, '')) / (Number(a.pax) || 1);
          const bPrice = Number(String(b.price).replace(/[^0-9]/g, '')) / (Number(b.pax) || 1);
          return aPrice - bPrice;
      });
      const minTier = validTiers[0];
      const minPricePerPax = Number(String(minTier.price).replace(/[^0-9]/g, '')) / (Number(minTier.pax) || 1);
      if (!basePriceToUse || basePriceToUse == 0 || minPricePerPax < cleanBasePriceVal) {
          basePriceToUse = minPricePerPax;
      }
  } else {
      if (dataObj.pricingType === "Per Group" && dataObj.groupPricingMode === "flat" && dataObj.groupPrice) {
          const flatPrice = Number(String(dataObj.groupPrice).replace(/[^0-9]/g, ''));
          if (!basePriceToUse || basePriceToUse == 0 || flatPrice < cleanBasePriceVal) {
              basePriceToUse = flatPrice;
          }
      } else if (dataObj.allInclusiveSurcharge && (!basePriceToUse || basePriceToUse == 0)) {
          basePriceToUse = Number(String(dataObj.allInclusiveSurcharge).replace(/[^0-9]/g, ''));
      }
  }

  const cleanBasePrice = Number(String(basePriceToUse || 0).replace(/[^0-9]/g, ''));
  const displayPrice = Math.floor(cleanBasePrice > 1000 ? cleanBasePrice : cleanBasePrice * 1000);

  return (
    <Link href={`/tours/${generateSlug(trip.title)}`} className="block relative w-[240px] md:w-[280px] shrink-0 snap-start group cursor-pointer">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden shadow-sm mb-4">
        <Image src={trip.image} fill priority={priority} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-[8s] ease-out group-hover:scale-105" alt={trip.title || "Trip Image"} />
        
        {/* Heart Button */}
        <button 
          onClick={handleSave}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 shadow-xl z-10 transition-transform active:scale-95 hover:text-black hover:scale-110"
        >
          <Heart size={15} strokeWidth={2.5} className={isSaved ? "text-[#1c1c1c] fill-[#1c1c1c]" : ""} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="font-extrabold text-[15px] md:text-[16px] leading-snug text-primary line-clamp-2">
          {trip.title}
        </h3>
        
        <div className="flex items-center gap-1.5 text-[#a1a1aa] mt-0.5">
          <Star size={14} strokeWidth={2.5} className="fill-[#f59e0b] text-[#f59e0b]" />
          <span className="text-[12px] font-bold">
            {Number(trip.rating || 5).toFixed(1)} ({trip.reviews_count || trip.reviews || 0} reviews)
          </span>
        </div>
        
        <div className="mt-1">
          <span className="font-black text-[15px] md:text-[16px] text-primary tracking-tight">
            IDR {displayPrice.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomeClient({ initialListings = [], initialSettings = null, initialBlogs = [], initialCampaigns = null, initialFlashSale = null }) {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState("All");
  const [activeService, setActiveService] = useState("Tour");
  const [currentCampIdx, setCurrentCampIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  // Use initialCampaigns from server or fallback to DEFAULT_CAMPAIGNS
  const [campaigns, setCampaigns] = useState(initialCampaigns || DEFAULT_CAMPAIGNS);
  const [flashSale, setFlashSale] = useState(initialFlashSale || null);

  const [serviceCampaigns, setServiceCampaigns] = useState({
    scooter: { ...DEFAULT_CAMPAIGNS.scooter, ...(campaigns.scooter || {}) },
    spa: { ...DEFAULT_CAMPAIGNS.spa, ...(campaigns.spa || {}) }
  });

  useEffect(() => {
    // Only listen for changes if we're in the admin dashboard preview
    const handleCampaignsChanged = (e) => {
      if (e.detail) setServiceCampaigns(e.detail);
    };
    window.addEventListener('balance_island_campaigns_changed', handleCampaignsChanged);
    return () => window.removeEventListener('balance_island_campaigns_changed', handleCampaignsChanged);
  }, []);

  // New States for Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState([0, 5000000]);
  const [appliedPromoFilter, setAppliedPromoFilter] = useState(null);

  // Custom event listeners to sync with Desktop Navbar.js
  useEffect(() => {
    const handleService = (e) => {
      setActiveService(e.detail);
      setActiveCat("All");
      setSearchQuery("");
    };
    const handleSearch = (e) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener('serviceChanged', handleService);
    window.addEventListener('searchQueryChanged', handleSearch);
    return () => {
      window.removeEventListener('serviceChanged', handleService);
      window.removeEventListener('searchQueryChanged', handleSearch);
    };
  }, []);

  useEffect(() => {
    const handlePromoApplied = (e) => {
      const promo = e.detail;
      if (promo && promo.applicableTours && promo.applicableTours.length > 0) {
        setAppliedPromoFilter(promo);
        setActiveService("Tour");
        setActiveCat("All");
      } else {
        setAppliedPromoFilter(null);
      }
      
      setTimeout(() => {
        const el = document.getElementById("filtered-tours-section");
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };
    
    window.addEventListener('promoApplied', handlePromoApplied);
    return () => window.removeEventListener('promoApplied', handlePromoApplied);
  }, []);

  // Track scroll to categories to show promo modal
  const categoriesRef = React.useRef(null);
  useEffect(() => {
    // Check if they already applied a code
    const hasAppliedCode = localStorage.getItem('savedPromoCode');
    if (hasAppliedCode || appliedPromoFilter) return;
    
    // Check if we already auto-showed it this session
    const hasShownPopup = sessionStorage.getItem('hasAutoShownPromo') === 'true';
    if (hasShownPopup) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // User scrolled to categories
        window.dispatchEvent(new Event('openPromoModal'));
        sessionStorage.setItem('hasAutoShownPromo', 'true');
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    if (categoriesRef.current) {
      observer.observe(categoriesRef.current);
    }

    return () => observer.disconnect();
  }, [appliedPromoFilter]);

  // SWR Fetchers
  const [heroSettings, setHeroSettings] = useState(initialSettings);
  const allListings = initialListings || [];
  const recommendedPlaces = initialBlogs || [];

  const [isDesktop, setIsDesktop] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMobileLabelIdx, setActiveMobileLabelIdx] = useState(0);
  const [showHeroLabel, setShowHeroLabel] = useState(true);
  const [hasShownMidRollLabel, setHasShownMidRollLabel] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const heroMediaRef = React.useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMobileLabelIdx(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      // eslint-disable-next-line
      setShowHeroLabel(true);
      return;
    }

    // When playing starts
    // eslint-disable-next-line
    setShowHeroLabel(false);

    if (!hasShownMidRollLabel) {
      const showTimer = setTimeout(() => {
        if (isPlaying) {
          setShowHeroLabel(true);
          const hideTimer = setTimeout(() => {
            setShowHeroLabel(false);
            setHasShownMidRollLabel(true);
          }, 5000);
          return () => clearTimeout(hideTimer);
        }
      }, 20000);
      return () => clearTimeout(showTimer);
    }
  }, [isPlaying, hasShownMidRollLabel]);

  
  const toggleMute = (e) => {
    e.stopPropagation();
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (heroMediaRef.current) {
      if (heroMediaRef.current.tagName === 'IFRAME') {
        heroMediaRef.current.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: nextMute ? 'mute' : 'unMute',
          args: []
        }), '*');
        if (!nextMute) {
          heroMediaRef.current.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [100]
          }), '*');
        }
      } else if (heroMediaRef.current.tagName === 'VIDEO') {
        heroMediaRef.current.muted = nextMute;
      }
    }
  };

  const togglePlayPause = () => {
    setShowVideo(true);
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (heroMediaRef.current) {
      if (heroMediaRef.current.tagName === 'IFRAME') {
        if (nextState) {
          heroMediaRef.current.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'playVideo',
            args: []
          }), '*');
        } else {
          heroMediaRef.current.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'pauseVideo',
            args: []
          }), '*');
        }
      } else if (heroMediaRef.current.tagName === 'VIDEO') {
        if (nextState) {
          heroMediaRef.current.muted = false;
          heroMediaRef.current.play();
        } else {
          heroMediaRef.current.pause();
        }
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (!desktop) {
        setIsPlaying(false); // Mobile always starts paused due to browser autoplay policies
      }
    };
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for admin changes via local events (for realtime preview)
  useEffect(() => {
    const handleSettingsChange = () => {
      fetch('/api/admin/homepage-settings')
        .then(res => res.json())
        .then(data => {
          if (data && data.metadata) {
            if (data.metadata.campaigns) setCampaigns(data.metadata.campaigns);
            if (data.metadata.flashSale !== undefined) setFlashSale(data.metadata.flashSale);
          }
          if (data) {
             setHeroSettings({
               campaignVideo: data.campaign_video || "",
               campaignYoutubeLink: data.campaign_youtube_link || "",
               campaignRecommendation: data.campaign_recommendation || "",
               campaignIgLink: data.campaign_ig_link || "",
               campaignRecommendation2: data.campaign_recommendation_2 || "",
               campaignIgLink2: data.campaign_ig_link_2 || ""
             });
          }
        })
        .catch(console.error);
    };

    window.addEventListener("homepage_hero_settings_changed", handleSettingsChange);
    return () => window.removeEventListener("homepage_hero_settings_changed", handleSettingsChange);
  }, []);

  // Signal to SplashScreen that content is ready once SWR data has settled
  useEffect(() => {
    if (allListings && allListings.length > 0 && recommendedPlaces) {
      window.dispatchEvent(new Event("app-content-ready"));
    }
  }, [allListings, recommendedPlaces]);

  // Delay video loading to prioritize LCP image
  useEffect(() => {
    if (isDesktop) {
      // eslint-disable-next-line
      setShowVideo(true);
    } else {
      const timer = setTimeout(() => setShowVideo(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [isDesktop]);

  // Track native YouTube play/pause state for Instagram labels
  useEffect(() => {
    if (!showVideo || !heroMediaRef.current || heroMediaRef.current.tagName !== 'IFRAME') return;

    let player;
    const initPlayer = () => {
      try {
        player = new window.YT.Player(heroMediaRef.current, {
          events: {
            'onStateChange': (event) => {
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            }
          }
        });
      } catch (e) {
        console.error("YT Player init error", e);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      
      const checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYT);
          initPlayer();
        }
      }, 100);
      return () => clearInterval(checkYT);
    } else {
      setTimeout(initPlayer, 500);
    }
  }, [showVideo]);




  const nextCamp = () => setCurrentCampIdx((prev) => (prev + 1) % campaigns.length);
  const prevCamp = () => setCurrentCampIdx((prev) => (prev - 1 + campaigns.length) % campaigns.length);

  const currentCategories = getCategoriesForService(activeService);

  const isValidService = (t) => t.service === activeService || (activeService === "Tour" && t.service === "Activities");

  const bestTrips = allListings.filter(t => t.isBestTripPinned && t.service === activeService);
  const displayPopularTrips = bestTrips.length > 0 ? bestTrips : popularTrips;

  let filteredTours = activeCat === "All"
    ? allListings.filter(isValidService)
    : allListings.filter(t => isValidService(t) && (
      t.category === activeCat ||
      t.spaSetting === activeCat ||
      (activeCat === "Day Spa" && t.spaSetting === "Real Spa")
    ));

  // Identify trips that are already shown in the Top Picks section
  const topPickIds = displayPopularTrips.map(t => t.id);

  // Apply Text Search Filter
  if (searchQuery) {
    const lowerQ = searchQuery.toLowerCase();
    filteredTours = filteredTours.filter(t =>
      t.title.toLowerCase().includes(lowerQ) || t.location.toLowerCase().includes(lowerQ)
    );
  }

  // Apply Price Filter
  filteredTours = filteredTours.filter(t => t.price >= priceFilter[0] && t.price <= priceFilter[1]);

  // Apply Promo Filter
  if (appliedPromoFilter && appliedPromoFilter.applicableTours && appliedPromoFilter.applicableTours.length > 0) {
    filteredTours = filteredTours.filter(t => appliedPromoFilter.applicableTours.includes(t.id));
  }

  // Pseudo-randomize the filtered tours based on id and active category,
  // but push items that are in Top Picks to the end of the list.
  filteredTours.sort((a, b) => {
    const aIsTopPick = topPickIds.includes(a.id);
    const bIsTopPick = topPickIds.includes(b.id);
    
    // Top picks go last
    if (aIsTopPick && !bIsTopPick) return 1;
    if (!aIsTopPick && bIsTopPick) return -1;
    
    // Otherwise apply stable pseudo-randomization
    const hash = (str) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = Math.imul(31, h) + str.charCodeAt(i) | 0;
      }
      return h;
    };
    return (hash(String(a.id) + activeCat) % 100) - (hash(String(b.id) + activeCat) % 100);
  });

  const pinnedCampaigns = allListings.filter(t => t.isCampaignPinned).map((t, idx) => ({
    id: t.id || idx,
    title: t.campaignTitle || "",
    subtitle: t.campaignDescription || t.description, // Fallback to regular description
    location: t.location, // Explicitly pass location
    badge: t.campaignLabel !== undefined ? t.campaignLabel : "Featured Deal",
    image: t.image || "",
    images: t.images || [],
    targetId: t.id,
    originalTitle: t.title,
    campaignVideo: t.campaignVideo,
    campaignYoutubeLink: t.campaignYoutubeLink,
    campaignRecommendation: t.campaignRecommendation,
    campaignIgLink: t.campaignIgLink
  }));

  // 1. Build Partner Campaign Cards (Scooter & Spa)
  const scooterCard = serviceCampaigns?.scooter?.active !== false ? {
    id: "campaign-scooter",
    title: serviceCampaigns?.scooter?.title || DEFAULT_CAMPAIGNS.scooter.title,
    subtitle: serviceCampaigns?.scooter?.subtitle || DEFAULT_CAMPAIGNS.scooter.subtitle,
    badge: serviceCampaigns?.scooter?.badge || DEFAULT_CAMPAIGNS.scooter.badge,
    image: serviceCampaigns?.scooter?.image || DEFAULT_CAMPAIGNS.scooter.image,
    externalUrl: serviceCampaigns?.scooter?.externalUrl || DEFAULT_CAMPAIGNS.scooter.externalUrl,
    isExternalCampaign: true,
    location: "Island-wide Delivery"
  } : null;

  const spaCard = serviceCampaigns?.spa?.active !== false ? {
    id: "campaign-spa",
    title: serviceCampaigns?.spa?.title || DEFAULT_CAMPAIGNS.spa.title,
    subtitle: serviceCampaigns?.spa?.subtitle || DEFAULT_CAMPAIGNS.spa.subtitle,
    badge: serviceCampaigns?.spa?.badge || DEFAULT_CAMPAIGNS.spa.badge,
    image: serviceCampaigns?.spa?.image || DEFAULT_CAMPAIGNS.spa.image,
    externalUrl: serviceCampaigns?.spa?.externalUrl || DEFAULT_CAMPAIGNS.spa.externalUrl,
    isExternalCampaign: true,
    location: "Home Service Spa Bali"
  } : null;

  const partnerCards = [scooterCard, spaCard].filter(Boolean);

  const defaultTourCampaigns = [];

  const tourCampaigns = pinnedCampaigns.length > 0 ? pinnedCampaigns : defaultTourCampaigns;

  // Smart logic: Check if admin has configured a YouTube / Video hero link
  const hasYoutubeLink = Boolean(heroSettings?.campaignYoutubeLink && heroSettings.campaignYoutubeLink.trim() !== "");
  const hasDirectVideo = Boolean(heroSettings?.campaignVideo && heroSettings.campaignVideo.trim() !== "");
  const hasConfiguredHeroMedia = hasYoutubeLink || hasDirectVideo;

  let displayCampaigns = [];

  if (hasConfiguredHeroMedia) {
    const customHero = {
      id: 'hero-media-custom',
      isHeroSlide: true,
      campaignVideo: heroSettings?.campaignVideo || "",
      campaignYoutubeLink: heroSettings?.campaignYoutubeLink || "",
      campaignRecommendation: heroSettings?.campaignRecommendation || "Curated & Highly Recommended by Balance Island",
      campaignIgLink: heroSettings?.campaignIgLink || "https://instagram.com/balanceisland",
      campaignRecommendation2: heroSettings?.campaignRecommendation2 || "",
      campaignIgLink2: heroSettings?.campaignIgLink2 || "",
      image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=1200&q=80"
    };
    displayCampaigns = [customHero, ...partnerCards, ...tourCampaigns];
  } else {
    // When admin does not set a YouTube link, Scooter & Spa partner campaigns are displayed as #1 and #2, followed by the trip cards!
    displayCampaigns = [...partnerCards, ...tourCampaigns];
  }

  // Ensure campaigns with the "EXCLUSIVE" badge are displayed first (number one display)
  displayCampaigns.sort((a, b) => {
    const aIsExclusive = a.badge && String(a.badge).toUpperCase() === "EXCLUSIVE";
    const bIsExclusive = b.badge && String(b.badge).toUpperCase() === "EXCLUSIVE";
    if (aIsExclusive && !bIsExclusive) return -1;
    if (!aIsExclusive && bIsExclusive) return 1;
    return 0;
  });

  // Removed defaultTourCampaigns fallback to prevent mock data from showing

  // Suggestions for smart keyboard integration
  const availableSuggestions = Array.from(new Set(
    allListings.filter(t => t.service === activeService).flatMap(t => [t.title, t.location])
  ));

  const searchSuggestions = availableSuggestions
    .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const getPopularTripsTitle = () => {
    if (activeService === "Activities") return "Trending Activities";
    return `Top Picks for ${activeService}`;
  };

  return (
    <div className="w-full bg-white min-h-[100dvh] font-sans pb-0 relative -mt-20 md:-mt-24">
      
      <div className="relative z-10 w-full md:pt-[100px] pb-4">
        {/* Mobile Top Section */}
        <div className="md:hidden bg-transparent pt-[108px] pb-8 relative z-20 w-full">
          {/* Mobile Top Header Search */}
          <div className="relative z-40 px-5">

          {/* Location Filter (Animated Segmented Control Style) */}
          <div className="bg-[#ffffff] shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#eaeaea] rounded-[32px] p-1.5 mb-4">
            <div className="flex items-center overflow-x-auto no-scrollbar hide-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {["All Bali", "Ubud", "Canggu", "Seminyak", "Nusa Penida", "Uluwatu"].map((loc) => {
                const isActive = (searchQuery.toLowerCase() === loc.toLowerCase()) || (searchQuery === "" && loc === "All Bali");
                return (
                  <button
                    key={loc}
                    onClick={() => setSearchQuery(loc === "All Bali" ? "" : loc)}
                    className="relative flex items-center justify-center px-5 py-2.5 rounded-[24px] active:scale-95 outline-none shrink-0"
                  >
                    {/* Animated Sliding Pill */}
                    {isActive && (
                      <motion.div
                        layoutId="locationActiveIndicator"
                        className="absolute inset-0 bg-[#1c1c1c] border border-[#1c1c1c] shadow-[0_2px_10px_rgba(0,0,0,0.08)] rounded-[24px]"
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}

                    {/* Text Label or Icon */}
                    <div className="relative z-10 flex items-center justify-center">
                      {loc === "All Bali" ? (
                        <BaliGateIcon isActive={isActive} className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#717171] hover:text-[#1c1c1c]'}`} />
                      ) : (
                        <span className={`text-[14px] tracking-tight whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-white font-extrabold' : 'text-[#717171] font-bold hover:text-[#1c1c1c]'}`}>
                          {loc}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apple Glass Search Bar */}
          <div className="flex items-center bg-[#ffffff] shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#eaeaea] rounded-full pl-2 pr-2 py-2 relative mb-6">

            {/* Mobile Service Dropdown Trigger inside Search Bar */}
            <button
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full hover:bg-[#f9fafb] text-[#1c1c1c] active:scale-95 transition-all outline-none"
            >
              <span className="font-extrabold text-[14px] tracking-tight">{activeService}</span>
              <ChevronDown size={14} className={`text-[#717171] transition-transform duration-300 ${isServiceDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="h-5 w-[1px] bg-[#f0f0f0] mx-1 shrink-0"></div>

            <Search size={18} className="text-[#717171] shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder={`Search...`}
              className="flex-1 min-w-0 outline-none text-[15px] font-medium bg-transparent text-[#1c1c1c] placeholder:text-[#717171] pr-2"
            />

            {/* Filter Modal Toggle */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all active:scale-95 bg-[#ffffff] border border-[#eaeaea] hover:bg-[#f9fafb] hover:scale-105`}
            >
              <Settings2 size={16} strokeWidth={2.5} className="text-[#1c1c1c]" />
            </button>

            {/* Mobile Service Dropdown */}
            {isServiceDropdownOpen && (
              <div className="absolute top-[60px] left-0 bg-white rounded-2xl p-2 shadow-2xl flex flex-col min-w-[160px] border border-border animate-in fade-in zoom-in-95 duration-200 z-[70]">
                {services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (s.id === "eSIM") {
                          router.push("/esim");
                        } else {
                          setActiveService(s.id);
                          setActiveCat("All");
                          setSearchQuery("");
                        }
                        setIsServiceDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] text-left transition-colors ${activeService === s.id ? 'bg-black text-white' : 'bg-transparent text-text-secondary hover:bg-gray-50 hover:text-primary'} outline-none`}
                    >
                      {Icon && <Icon size={16} className={activeService === s.id ? 'text-white' : 'text-text-secondary'} strokeWidth={2} />}
                      {s.id}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Autocomplete Dropdown */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-[100%] mt-2 left-6 right-6 bg-white rounded-2xl p-2 shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200 z-[60]">
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSearchQuery(loc); setIsSearchFocused(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                  >
                    {allListings.some(t => t.location === loc) ? <MapPin size={16} className="text-secondary" /> : <Search size={16} className="text-secondary" />}
                    <span className="font-bold text-[14px] text-primary truncate block flex-1">{loc}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-[14px] text-text-secondary font-medium text-center">
                  No places found
                </div>
              )}
            </div>
          )}
        </div>
        {/* Apple-style Filter Bottom Sheet */}
        <AnimatePresence>
          {isFilterModalOpen && (
            <div className="fixed inset-0 z-[100] flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsFilterModalOpen(false)}
              />

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
                className="bg-[#ffffff] w-full rounded-t-[32px] p-6 relative flex flex-col pointer-events-auto h-fit pb-[100px]"
              >
                <div className="w-12 h-1.5 bg-[#eaeaea] rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[22px] font-extrabold text-[#1c1c1c] tracking-tight">Filters</h3>
                  <button onClick={() => setPriceFilter([0, 5000000])} className="text-[#717171] font-bold text-[15px] active:scale-95 transition-transform hover:text-[#1c1c1c]">Reset</button>
                </div>

                {/* Price Filter Options */}
                <div className="mb-8">
                  <h4 className="text-[17px] font-extrabold text-[#1c1c1c] mb-4">Price Range</h4>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Any price", min: 0, max: 5000000 },
                      { label: "Under Rp 500k", min: 0, max: 500000 },
                      { label: "Rp 500k - Rp 1M", min: 500000, max: 1000000 },
                      { label: "Over Rp 1M+", min: 1000000, max: 5000000 },
                    ].map((opt, i) => {
                      const isSelected = priceFilter[0] === opt.min && priceFilter[1] === opt.max;
                      return (
                        <label key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all w-full cursor-pointer touch-manipulation active:scale-[0.98] ${isSelected ? 'border-[#1c1c1c] bg-[#1c1c1c] text-[#ffffff] shadow-md' : 'border-[#eaeaea] bg-transparent text-[#1c1c1c] hover:border-[#d1d5db]'}`}>
                          <span className="font-bold text-[15px]">{opt.label}</span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'border-none bg-[#ffffff]' : 'border border-[#d1d5db]'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c]" />}
                          </div>
                          <input type="radio" className="hidden" name="price" checked={isSelected} onChange={() => setPriceFilter([opt.min, opt.max])} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-full bg-[#d2ff00] text-[#1c1c1c] font-extrabold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2 mb-2 hover:bg-[#c4ed00]"
                >
                  Show {filteredTours.length} Results
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Mobile-only Campaign Swipe Carousel */}
        {displayCampaigns.length > 0 && (
        <section className="md:hidden pt-3 pb-4 relative z-10">
          <div
            className="flex overflow-x-auto no-scrollbar gap-4 px-5 scroll-px-5 snap-x snap-mandatory"
            onScroll={(e) => {
              const index = Math.round(e.target.scrollLeft / e.target.clientWidth);
              if (index !== currentCampIdx) setCurrentCampIdx(index);
            }}
          >
            {displayCampaigns.map((camp, idx) => {
              const linkedTour = allListings.find(t => t.id === camp.targetId || t.title === (camp.originalTitle || camp.title));
              const campImages = linkedTour?.images?.length > 1 ? linkedTour.images : camp.images;
              let titleText = camp.title || (camp.location || linkedTour?.location || '').split(',')[0].trim();
              let subtitleText = camp.isExternalCampaign ? (camp.subtitle || 'Bali, Indonesia') : 'Bali, Indonesia';
              if (titleText.includes(',')) {
                titleText = titleText.split(',')[0].trim();
              }

              return (
              <div 
                key={camp.id} 
                className={`relative w-full shrink-0 snap-center aspect-[4/5] sm:aspect-[5/6] md:aspect-[16/9] rounded-[32px] overflow-hidden shadow-sm bg-black select-none ${camp.isExternalCampaign && camp.externalUrl ? 'cursor-pointer' : ''}`}
                onClick={(e) => {
                  if (camp.isExternalCampaign && camp.externalUrl) {
                    if (e.target.closest('a') || e.target.closest('button')) return;
                    window.open(camp.externalUrl, '_blank');
                  }
                }}
              >
                {camp.campaignYoutubeLink && idx === 0 && !isDesktop ? (
                  showVideo ? (
                    <iframe loading="lazy" ref={camp.isHeroSlide ? heroMediaRef : null} src={getYoutubeEmbedUrl(camp.campaignYoutubeLink)} className="absolute inset-0 w-full h-full" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen />
                  ) : camp.image ? (
                    <Image src={camp.image} alt={camp.badge || "Campaign Image"} unoptimized priority={idx === 0} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  ) : null
                ) : camp.campaignVideo && idx === 0 && !isDesktop ? (
                  showVideo ? (
                    <video ref={camp.isHeroSlide ? heroMediaRef : null} src={camp.campaignVideo} autoPlay loop playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                  ) : camp.image ? (
                    <Image src={camp.image} alt={camp.badge || "Campaign Image"} unoptimized priority={idx === 0} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  ) : null
                ) : camp.image ? (
                  <Image src={camp.image} alt={camp.badge || "Campaign Image"} unoptimized priority={idx === 0} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/40 to-transparent z-0 pointer-events-none" />

                {/* Top left badge */}
                <div className="absolute top-5 left-5 z-20 flex flex-col pointer-events-none">
                  {!camp.isHeroSlide && (
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-black px-3.5 py-1.5 rounded-full shadow-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-[11px] font-black uppercase tracking-wider">
                        {camp.badge || "On Going"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile Hero Recommendation Labels (Top and Bottom) */}
                {camp.isHeroSlide && (
                  <>
                    <AnimatePresence>
                      {showHeroLabel && camp.campaignRecommendation && (
                        <motion.div
                          initial={{ opacity: 0, y: -15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] flex justify-center z-20 pointer-events-none"
                        >
                          <a
                            href={camp.campaignIgLink || "#"}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-black text-[#1c1c1c] px-4 py-2 rounded-md shadow-md hover:scale-105 transition-transform pointer-events-auto max-w-full"
                          >
                            <InstagramIcon size={14} className="text-[#1c1c1c] shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-center whitespace-normal leading-tight line-clamp-2">{camp.campaignRecommendation}</span>
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {showHeroLabel && camp.campaignRecommendation2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] flex justify-center z-20 pointer-events-none"
                        >
                          <a
                            href={camp.campaignIgLink2 || "#"}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-[#1c1c1c]/95 backdrop-blur-md border-l-4 border-black text-black px-4 py-2 rounded-md shadow-2xl hover:scale-105 transition-transform pointer-events-auto max-w-full"
                          >
                            <InstagramIcon size={14} className="text-black shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-center whitespace-normal leading-tight line-clamp-2">{camp.campaignRecommendation2}</span>
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}


                {camp.isHeroSlide && (camp.campaignVideo && !camp.campaignYoutubeLink) && (
                  <button
                    onClick={toggleMute}
                    className="absolute bottom-[8%] right-[4%] z-40 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all pointer-events-auto active:scale-95 shadow-xl"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                )}
                {/* Mobile Center Play/Pause */}

                {camp.isHeroSlide && (camp.campaignVideo && !camp.campaignYoutubeLink) && (
                  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <button
                      onClick={togglePlayPause}
                      className={`w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all pointer-events-auto active:scale-95 shadow-2xl ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
                    >
                      {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                    </button>
                  </div>
                )}

                {/* Top Right Arrow Button */}
                {!camp.isHeroSlide && (
                  <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                    {camp.isExternalCampaign ? (
                      <a
                        href={camp.externalUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-[#b4ff4c] text-[#1c1c1c] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                        aria-label="Open partner website"
                      >
                        <ArrowUpRight size={22} strokeWidth={2.5} />
                      </a>
                    ) : (
                      <Link
                        href={camp.targetId ? `/tours/${generateSlug(camp.originalTitle || camp.title)}` : "#"}
                        className="w-12 h-12 rounded-full bg-[#b4ff4c] text-[#1c1c1c] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                        aria-label="View tour details"
                      >
                        <ArrowUpRight size={22} strokeWidth={2.5} />
                      </Link>
                    )}
                  </div>
                )}

                {/* Bottom Content Area */}
                {!camp.isHeroSlide && (
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 flex flex-col justify-end pointer-events-none">
                    <div className="mb-4">
                      {titleText && (
                        <h3 className="text-[48px] sm:text-[56px] text-white leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] max-w-[85%]" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                          {titleText}
                        </h3>
                      )}
                      {subtitleText && (
                        <p className="text-white/80 text-[14px] font-medium mt-1 drop-shadow-md">
                          {subtitleText}
                        </p>
                      )}
                    </div>

                    <div className="flex items-end justify-between w-full mt-2 pointer-events-auto">
                      {/* Thumbnails */}
                      {camp.isExternalCampaign ? (
                        <a href={camp.externalUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform overflow-hidden">
                          <Thumbnails images={campImages} fallbackImage={camp.image} />
                        </a>
                      ) : (
                        <Link href={camp.targetId ? `/tours/${generateSlug(camp.originalTitle || camp.title)}` : "#"} className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform overflow-hidden">
                          <Thumbnails images={campImages} fallbackImage={camp.image} />
                        </Link>
                      )}

                      {/* Route Icon */}
                      {camp.isExternalCampaign ? (
                        <a href={camp.externalUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-white/90 mr-2 opacity-90 cursor-pointer active:scale-95 transition-transform ml-4 shrink-0">
                          <Map size={24} strokeWidth={2} className="mb-1" />
                          <span className="text-[11px] font-medium tracking-wide">Explore</span>
                        </a>
                      ) : (
                        <Link href={camp.targetId ? `/tours/${generateSlug(camp.originalTitle || camp.title)}` : "#"} className="flex flex-col items-center justify-center text-white/90 mr-2 opacity-90 cursor-pointer active:scale-95 transition-transform ml-4 shrink-0">
                          <Map size={24} strokeWidth={2} className="mb-1" />
                          <span className="text-[11px] font-medium tracking-wide">Explore</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )})}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-5 gap-2 items-center">
            {displayCampaigns.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentCampIdx(idx);
                }}
                className={`rounded-full transition-all duration-300 pointer-events-none ${idx === currentCampIdx ? 'w-1.5 h-1.5 bg-[#000000]' : 'w-1.5 h-1.5 bg-gray-300'}`}
              />
            ))}
          </div>

          {/* Trust Badges - Get Your Guide & TripAdvisor */}
          <div className="flex flex-col items-center justify-center mt-12 mb-4 px-4 text-center">
            <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-6">Find Us On</h4>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 max-w-3xl mx-auto">
              {/* Get Your Guide */}
              <a 
                href="https://www.getyourguide.com/balance-island-tour-s252854/?date_from=2026-09-29&date_to=2026-09-29" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-105 active:scale-95 transition-transform drop-shadow-sm flex items-center justify-center"
                aria-label="View our tours on Get Your Guide"
              >
                <img 
                  src="https://cdn.getyourguide.com/tf/assets/static/logos/gyg-logo.svg" 
                  alt="Get Your Guide Logo" 
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </a>
              
              {/* TripAdvisor */}
              <a 
                href="https://www.tripadvisor.com/Attraction_Review-g297701-d34659294-Reviews-Balance_Island_Tour-Ubud_Gianyar_Regency_Bali.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-105 active:scale-95 transition-transform drop-shadow-sm flex items-center justify-center"
                aria-label="View our reviews on TripAdvisor"
              >
                <img 
                  src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" 
                  alt="TripAdvisor Logo" 
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              </a>

              {/* Viator */}
              <a 
                href="https://www.viator.com/tours/Ubud/Ubud-Culture-and-Nature-Rice-Terrace-Water-Temple-and-Waterfalls/d5467-5693830P2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-105 active:scale-95 transition-transform drop-shadow-sm flex items-center justify-center"
                aria-label="View our tours on Viator"
              >
                <img 
                  src="https://wp.logos-download.com/wp-content/uploads/2024/10/Viator_Logo.svg" 
                  alt="Viator Logo" 
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </a>

              {/* Google Business */}
              <a 
                href="https://share.google/sDMPZqgDbfzUIU0Ti" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-105 active:scale-95 transition-transform drop-shadow-sm flex items-center justify-center gap-2"
                aria-label="View our Google Business Listing"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                  alt="Google Logo" 
                  className="h-8 sm:h-9 w-auto object-contain"
                />
                <span className="font-semibold text-gray-700 text-lg leading-none" style={{ fontFamily: 'Product Sans, Helvetica, Arial, sans-serif' }}>Reviews</span>
              </a>
            </div>
          </div>
        </section>
        )}
        </div> {/* End Mobile Top White Section */}

        {/* Desktop/iPad Full-Screen Cinematic Hero */}
        {displayCampaigns.length > 0 && (
        <section className="hidden md:block absolute top-0 left-0 w-full h-[100vh] min-h-[700px] overflow-hidden bg-black group">
          {displayCampaigns.map((camp, idx) => (
            <div
              key={camp.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentCampIdx ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
            >
              {camp.campaignYoutubeLink && idx === 0 && isDesktop ? (
                showVideo ? (
                  <iframe loading="lazy" ref={camp.isHeroSlide ? heroMediaRef : null} src={getYoutubeEmbedUrl(camp.campaignYoutubeLink)} className="absolute inset-0 w-full h-full" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen />
                ) : camp.image ? (
                  <Image src={camp.image} alt={camp.badge || "Hero Image"} unoptimized priority={idx === 0} fill sizes="100vw" className={`object-cover transition-transform duration-[20s] ease-linear ${idx === currentCampIdx ? 'scale-110' : 'scale-100'}`} />
                ) : null
              ) : camp.campaignVideo && idx === 0 && isDesktop ? (
                showVideo ? (
                  <video ref={camp.isHeroSlide ? heroMediaRef : null} src={camp.campaignVideo} autoPlay loop playsInline className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] ease-linear ${idx === currentCampIdx ? 'scale-110' : 'scale-100'} pointer-events-none`} />
                ) : camp.image ? (
                  <Image src={camp.image} alt={camp.badge || "Hero Image"} unoptimized priority={idx === 0} fill sizes="100vw" className={`object-cover transition-transform duration-[20s] ease-linear ${idx === currentCampIdx ? 'scale-110' : 'scale-100'}`} />
                ) : null
              ) : camp.image ? (
                <Image src={camp.image} alt={camp.badge || "Hero Image"} unoptimized priority={idx === 0} fill sizes="100vw" className={`object-cover transition-transform duration-[20s] ease-linear ${idx === currentCampIdx ? 'scale-110' : 'scale-100'}`} />
              ) : null}

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />
              {!camp.isHeroSlide && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background via-background/80 to-transparent z-0 pointer-events-none" />
                </>
              )}

              {/* Left Recommendation Label (Under Text) */}
              {camp.isHeroSlide && camp.campaignRecommendation && (
                <div className="absolute bottom-[18%] left-[4%] z-20 pointer-events-none">
                  <a href={camp.campaignIgLink || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-black text-[#1c1c1c] px-6 py-3 rounded-md shadow-md hover:scale-105 transition-transform duration-300 pointer-events-auto max-w-max">
                    <InstagramIcon size={18} className="text-[#1c1c1c] shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-[12px] xl:text-[14px] font-black uppercase tracking-widest drop-shadow-sm whitespace-nowrap">{camp.campaignRecommendation}</span>
                  </a>
                </div>
              )}

              {/* Right Recommendation Label (Above Numbers) */}
              {camp.isHeroSlide && camp.campaignRecommendation2 && (
                <div className="absolute bottom-[18%] right-[4%] z-20 pointer-events-none">
                  <a href={camp.campaignIgLink2 || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#1c1c1c]/95 backdrop-blur-md border-l-4 border-black text-black px-6 py-3 rounded-md shadow-2xl hover:scale-105 transition-transform duration-300 pointer-events-auto max-w-max">
                    <InstagramIcon size={18} className="text-black shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-[12px] xl:text-[14px] font-black uppercase tracking-widest drop-shadow-sm whitespace-nowrap">{camp.campaignRecommendation2}</span>
                  </a>
                </div>
              )}


              {camp.isHeroSlide && (camp.campaignVideo && !camp.campaignYoutubeLink) && (
                <button
                  onClick={toggleMute}
                  className="absolute bottom-[6%] right-[16%] z-40 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 hover:scale-105 transition-all pointer-events-auto active:scale-95 shadow-xl"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              )}
              {/* Desktop Center Play/Pause Toggle */}

              {camp.isHeroSlide && (camp.campaignVideo && !camp.campaignYoutubeLink) && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                  <button
                    onClick={togglePlayPause}
                    className={`w-24 h-24 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 hover:scale-105 transition-all pointer-events-auto active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 ${!isPlaying ? '!opacity-100' : ''}`}
                    title={isPlaying ? "Pause Video" : "Play Video"}
                  >
                    {isPlaying ? <Pause size={36} className="fill-current" /> : <Play size={36} className="fill-current ml-2" />}
                  </button>
                </div>
              )}

              {/* Desktop Hero Typography for Video Slide (No title) */}
              {camp.isHeroSlide && camp.campaignRecommendation && (
                <div className="absolute bottom-[20%] right-[6%] xl:right-[8%] z-20 pointer-events-none max-w-[320px] text-right">
                  <p className="text-white font-bold drop-shadow-md text-sm xl:text-base leading-tight uppercase tracking-wider">
                    {camp.campaignRecommendation}
                  </p>
                  {camp.campaignIgLink && (
                    <a href={camp.campaignIgLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-white/80 hover:text-white pointer-events-auto">
                      <ArrowUpRight size={20} />
                    </a>
                  )}
                </div>
              )}
              {camp.isHeroSlide && camp.campaignRecommendation2 && (
                <div className="absolute bottom-[20%] left-[6%] xl:left-[8%] z-20 pointer-events-none max-w-[320px] text-left">
                  <p className="text-white font-bold drop-shadow-md text-sm xl:text-base leading-tight uppercase tracking-wider">
                    {camp.campaignRecommendation2}
                  </p>
                  {camp.campaignIgLink2 && (
                    <a href={camp.campaignIgLink2} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-white/80 hover:text-white pointer-events-auto">
                      <ArrowUpRight size={20} />
                    </a>
                  )}
                </div>
              )}

              {/* Desktop Campaign Slide Content (Huge Typography) */}
              {!camp.isHeroSlide && (
                <>
                  {/* Top Left Badge */}
                  <div className="absolute top-[12%] left-[6%] xl:left-[8%] z-20 pointer-events-none">
                    <span className="inline-block flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md text-black text-[12px] font-black uppercase tracking-wider shadow-md rounded-[10px]">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {camp.badge || "OFFICIAL PARTNER"}
                    </span>
                  </div>

                  {/* Left Side: Cinematic Title */}
                  <div className="absolute bottom-[18%] xl:bottom-[20%] left-[6%] xl:left-[8%] z-20 pointer-events-none w-[85%] md:max-w-[65%] lg:max-w-[50%] flex flex-col gap-4">
                    {camp.title ? (
                      <h1 
                        className="text-[48px] md:text-[56px] lg:text-[64px] xl:text-[72px] text-white leading-[1.1] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                        style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", textWrap: 'balance' }}
                      >
                        {camp.title}
                      </h1>
                    ) : null}
                    
                    <div className="flex flex-col gap-4 items-start mt-1">
                      <span className="text-white/80 font-medium tracking-[0.1em] text-[12px] md:text-sm drop-shadow-md">
                        Bali, Indonesia
                      </span>
                      
                      <div className="pointer-events-auto mt-2">
                        {camp.isExternalCampaign ? (
                          <a
                            href={camp.externalUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/30 bg-black/30 hover:bg-white/20 backdrop-blur-md text-white font-bold tracking-[0.1em] text-[10px] uppercase transition-all hover:scale-105 active:scale-95 shadow-xl"
                          >
                            EXPLORE EXPERIENCE
                            <ArrowUpRight size={14} strokeWidth={2.5} />
                          </a>
                        ) : (
                          <Link
                            href={camp.targetId ? `/tours/${generateSlug(camp.originalTitle || camp.title)}` : "#"}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/30 bg-black/30 hover:bg-white/20 backdrop-blur-md text-white font-bold tracking-[0.1em] text-[10px] uppercase transition-all hover:scale-105 active:scale-95 shadow-xl"
                          >
                            EXPLORE EXPERIENCE
                            <ArrowUpRight size={14} strokeWidth={2.5} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Cinematic Description */}
                  <div className="absolute bottom-[18%] xl:bottom-[20%] right-[6%] xl:right-[8%] z-20 pointer-events-none w-full max-w-[300px] lg:max-w-[380px] xl:max-w-[420px] flex items-end">
                     <p className="text-white/80 text-[13px] lg:text-[14px] xl:text-[15px] font-medium leading-[1.6] drop-shadow-md text-right line-clamp-3 md:line-clamp-4 mb-3">
                       {camp.subtitle}
                     </p>
                  </div>
                </>
              )}

            </div>
          ))}



          {/* Bottom Controls */}
          <div className="absolute bottom-[8%] left-[6%] xl:left-[8%] z-20 flex items-center gap-6 xl:gap-8">
            <div className="flex gap-3">
              <button onClick={prevCamp} className="w-12 h-12 rounded-full border border-white/20 bg-black/20 hover:bg-white/10 backdrop-blur-md text-white flex items-center justify-center transition-all active:scale-95">
                <ChevronLeft size={20} strokeWidth={2.5} className="mr-0.5" />
              </button>
              <button onClick={nextCamp} className="w-12 h-12 rounded-full border border-white/20 bg-black/20 hover:bg-white/10 backdrop-blur-md text-white flex items-center justify-center transition-all active:scale-95">
                <ChevronRight size={20} strokeWidth={2.5} className="ml-0.5" />
              </button>
            </div>

            <div className="w-[150px] xl:w-[250px] h-[2px] bg-white/20 relative rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${((currentCampIdx + 1) / displayCampaigns.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Fractional Indicator */}
          <div className="absolute bottom-[6%] right-[4%] z-20 text-white flex items-baseline gap-1 shadow-black drop-shadow-2xl">
            <span className="font-black text-[46px] leading-none tracking-tighter">{(currentCampIdx + 1).toString().padStart(2, '0')}</span>
            <span className="font-bold text-[18px] opacity-60">/ {displayCampaigns.length.toString().padStart(2, '0')}</span>
          </div>
        </section>
        )}

        {/* Invisible spacer to push content down below the absolute hero */}
        {displayCampaigns.length > 0 && (
          <div className="hidden md:block w-full h-[100vh]" />
        )}
      </div>

      <div id="showcase-section" className="max-w-[1400px] mx-auto min-h-screen">
        
        {/* Flash Sale Banner */}
        {flashSale && flashSale.active && (
          <FlashSaleCard data={flashSale} />
        )}

        {/* Popular Trips */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="pt-2 mb-8 relative"
            >
              <div className="px-6 flex justify-between items-end mb-4">
                <h2 className="text-[20px] font-bold text-primary flex items-center gap-2">
                  {getPopularTripsTitle()}
                </h2>
                <Link
                  href={activeService === "Tour" ? "/tours" : "/map?service=Activities"}
                  className="text-[12px] font-extrabold text-white cursor-pointer transition-colors px-4 py-2 rounded-full bg-black hover:bg-black/80"
                >
                  See more
                </Link>
              </div>

              {/* Horizontal Scroll Area */}
              <div className="flex overflow-x-auto no-scrollbar gap-5 px-6 scroll-px-6 pb-6 snap-x snap-mandatory hide-scroll">
                {displayPopularTrips.length > 0 ? displayPopularTrips.map((trip, idx) => (
                  <PopularTripCard key={trip.id} trip={trip} priority={idx < 4} />
                )) : (
                  <div className="w-full text-center py-6 text-gray-400 font-medium text-sm">
                    No items pinned as Best Trips for this category.
                  </div>
                )}
              </div>
            </motion.section>

            {/* Categories */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              id="categories-section" 
              ref={categoriesRef} 
              className="px-6 mb-8 mt-2"
            >
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-[20px] font-bold text-primary">Categories</h2>
                <Link href={activeService === "Tour" ? "/tours" : "/map?service=Activities"} className="text-[12px] font-extrabold text-white cursor-pointer transition-colors px-4 py-2 rounded-full bg-black hover:bg-black/80">See more</Link>
              </div>
              <div className="flex justify-center w-full overflow-hidden">
                <div className="bg-[#ffffff] shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#eaeaea] rounded-[32px] p-1.5 w-fit max-w-full mx-auto">
                  <div className="flex items-center overflow-x-auto no-scrollbar hide-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {currentCategories.map((c) => {
                      const Icon = c.icon;
                      const isActive = activeCat === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setActiveCat(c.id)}
                          className="relative flex items-center justify-center px-4 py-2 rounded-[24px] active:scale-95 outline-none shrink-0"
                        >
                          {isActive && (
                            <motion.div
                              layoutId="categoryActiveIndicator"
                              className="absolute inset-0 bg-[#000000] shadow-[0_2px_10px_rgba(0,0,0,0.08)] rounded-[24px]"
                              transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            />
                          )}
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            {Icon && <Icon size={16} className={`transition-colors duration-300 ${isActive ? 'text-[#ffffff]' : 'text-[#717171]'}`} />}
                            <span className={`text-[13px] tracking-tight whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-[#ffffff] font-extrabold' : 'text-[#717171] font-bold hover:text-[#1c1c1c]'}`}>
                              {c.id}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.section>


            {/* Filtered Experiences */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              id="filtered-tours-section" 
              className="mt-6 mb-12 relative"
            >
              {appliedPromoFilter && (
                <div className="px-6 mb-4 flex justify-center">
                  <div className="inline-flex items-center gap-3 bg-black px-5 py-3 rounded-2xl shadow-lg border border-gray-800">
                    <span className="text-[13px] font-bold text-white">
                      Showing tours valid for <span className="font-black underline decoration-white/40 underline-offset-4">{appliedPromoFilter.code}</span>
                    </span>
                    <button 
                      onClick={() => setAppliedPromoFilter(null)}
                      className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors ml-2"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-5 px-6 scroll-px-6 pb-8 md:grid md:grid-cols-3 md:px-6 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {filteredTours.length > 0 ? (
                  filteredTours.map(tour => (
                    <div key={tour.id} className="flex-none w-[85vw] sm:w-[300px] snap-center md:w-auto md:snap-align-none animate-in fade-in zoom-in duration-300">
                      <ListingCard item={tour} linkTo={`/tours/${generateSlug(tour.title)}`} />
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-10 px-6 text-text-secondary font-medium">
                    No tours found for this category currently.
                  </div>
                )}
              </div>
            </motion.section>

            {/* SEO & Location Keywords Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="px-6 mb-12 mt-12 max-w-7xl mx-auto"
            >
              <div className="mb-6">
                <h2 className="text-[24px] md:text-[28px] font-black text-primary leading-tight">Top Destinations in Bali</h2>
                <p className="text-text-secondary font-medium mt-2 text-[14px] md:text-[15px] max-w-3xl">
                  Discover the beauty of Bali with our curated experiences in the most sought-after locations. From the cultural heart of Ubud to the stunning cliffs of Uluwatu. Dive into deep insights, local guides, and exclusive tours tailored just for you.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from(new Set([...["Ubud", "Uluwatu", "Nusa Penida", "Kintamani", "Karangasem", "Bedugul"], ...allListings.map(t => t.location?.split(',')[0].trim()).filter(Boolean)]))
                  .filter(loc => loc.toLowerCase() !== 'bali' && loc.toLowerCase() !== 'indonesia' && loc.toLowerCase() !== 'seminyak' && loc.toLowerCase() !== 'canggu')
                  .slice(0, 8)
                  .map((loc) => {
                  const toursInLoc = allListings.filter(t => t.location?.toLowerCase().includes(loc.toLowerCase()));
                  const matchingTour = toursInLoc[0];
                  const matchingBlog = recommendedPlaces.find(b => b.title.toLowerCase().includes(loc.toLowerCase()) || b.category?.toLowerCase().includes(loc.toLowerCase()));
                  
                  // Use real image from the tour as requested
                  const imageUrl = matchingTour?.image || matchingTour?.images?.[0] || matchingBlog?.image || "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=600&q=80";
                  
                  // SEO boosting link: direct to the new destination blog/SEO page
                  const linkHref = `/destinations/${generateSlug(loc)}`;
                  const ctaText = `Read Local Guide`;

                  return (
                    <Link href={linkHref} key={loc} className="group block relative w-full aspect-[4/5] sm:aspect-square rounded-[24px] overflow-hidden shadow-sm border border-gray-100">
                      <Image 
                        src={imageUrl} 
                        alt={`Tourism in ${loc}, Bali`}
                        fill 
                        sizes="(max-width: 768px) 50vw, 25vw" 
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0 pointer-events-none" />
                      <div className="absolute bottom-4 left-4 z-10 pointer-events-none pr-4">
                        <span className="text-white font-black text-[18px] drop-shadow-md leading-tight block">{loc}</span>
                        <p className="text-white/90 text-[12px] font-medium mt-1">{ctaText}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.section>

            {/* Why Choose Us Section */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="px-6 mb-20 max-w-7xl mx-auto py-12 border-t border-gray-100 mt-10"
            >
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="lg:w-1/3 text-left">
                  <h2 className="text-[32px] md:text-[40px] text-gray-900 leading-tight mb-4" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>Balance Island?</h2>
                  <p className="text-gray-500 text-[15px] leading-relaxed max-w-md">
                    We make exploring Bali completely effortless. Enjoy peace of mind with curated top-rated experiences, secure bookings, and transparent pricing.
                  </p>
                </div>
                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 w-full pt-2">
                  <div className="flex gap-5 items-start">
                    <div className="text-[20px] font-black text-black border-b-2 border-black pb-1 leading-none mt-1">01</div>
                    <div>
                      <h4 className="text-[17px] font-bold text-gray-900 mb-2">Secure & Trusted</h4>
                      <p className="text-[14px] text-gray-500 leading-relaxed">Guaranteed safe bookings and verified operators for zero hassle.</p>
                    </div>
                  </div>
                  <div className="flex gap-5 items-start">
                    <div className="text-[20px] font-black text-black border-b-2 border-black pb-1 leading-none mt-1">02</div>
                    <div>
                      <h4 className="text-[17px] font-bold text-gray-900 mb-2">Curated Experiences</h4>
                      <p className="text-[14px] text-gray-500 leading-relaxed">We handpick only the highest-rated, most unforgettable tours in Bali.</p>
                    </div>
                  </div>
                  <div className="flex gap-5 items-start">
                    <div className="text-[20px] font-black text-black border-b-2 border-black pb-1 leading-none mt-1">03</div>
                    <div>
                      <h4 className="text-[17px] font-bold text-gray-900 mb-2">Local Expertise</h4>
                      <p className="text-[14px] text-gray-500 leading-relaxed">Connect with English-speaking local guides who know the island inside out.</p>
                    </div>
                  </div>
                  <div className="flex gap-5 items-start">
                    <div className="text-[20px] font-black text-black border-b-2 border-black pb-1 leading-none mt-1">04</div>
                    <div>
                      <h4 className="text-[17px] font-bold text-gray-900 mb-2">24/7 Support</h4>
                      <p className="text-[14px] text-gray-500 leading-relaxed">Our dedicated support team is always here for you, anytime you need help.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* SEO FAQ Section */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="px-6 pb-16 max-w-4xl mx-auto pt-16 border-t border-gray-100"
            >
              <div className="text-center mb-10">
                <h2 className="text-[28px] md:text-[36px] font-black text-gray-900 leading-tight mb-4">FAQ</h2>
                <p className="text-gray-500 text-[14px] md:text-[15px] leading-relaxed">
                  Everything you need to know about booking the best tours, private drivers, and curated travel experiences in Bali, Indonesia.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {SEO_FAQS.slice(0, showAllFaqs ? SEO_FAQS.length : 3).map((faq, idx) => (
                  <FAQItem
                    key={idx}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaq === idx}
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  />
                ))}
              </div>

              {SEO_FAQS.length > 3 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAllFaqs(!showAllFaqs)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 text-[14px] font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {showAllFaqs ? "Show Less" : "Show More FAQs"}
                  </button>
                </div>
              )}
            </motion.section>

            {/* Footer Section */}
            <footer className="bg-gray-50 pt-16 pb-32 px-6 border-t border-gray-200 mt-10">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-16">
                  
                  {/* Brand & Description */}
                  <div className="lg:w-1/3">
                    <Link href="/" className="inline-block mb-4">
                      <h2 className="text-[26px] font-black text-[#1c1c1c] tracking-tight flex items-center gap-2">
                        <Sparkles size={24} className="text-black" />
                        Balance Island
                      </h2>
                    </Link>
                    <p className="text-gray-500 text-[14px] leading-relaxed max-w-sm font-medium">
                      Bali activities and attraction tickets with clear prices and local support. Tour packages available too.
                    </p>
                  </div>

                  {/* Links Columns */}
                  <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                    {/* Explore */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-[15px] mb-6">Explore</h4>
                      <ul className="flex flex-col gap-4">
                        <li><Link href="/activities" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Activities & Attractions</Link></li>
                        <li><Link href="/tours" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Tour packages</Link></li>
                        <li><Link href="/search" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Search experiences</Link></li>
                        <li><Link href="/destinations" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Regions</Link></li>
                        <li><Link href="/blog" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Travel stories</Link></li>
                      </ul>
                    </div>
                    
                    {/* Balance Island */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-[15px] mb-6">Balance Island</h4>
                      <ul className="flex flex-col gap-4">
                        <li><Link href="/about" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">About</Link></li>
                        <li><Link href="/how-it-works" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">How it works</Link></li>
                        <li><Link href="/safety" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Safety & trust</Link></li>
                        <li><Link href="/why-us" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Why Balance Island</Link></li>
                      </ul>
                    </div>

                    {/* Help */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-[15px] mb-6">Help</h4>
                      <ul className="flex flex-col gap-4">
                        <li><Link href="/help" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Help center</Link></li>
                        <li><Link href="/contact" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Contact</Link></li>
                        <li><Link href="/guarantee" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Anti-scam guarantee</Link></li>
                        <li><Link href="/refund" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Refund policy</Link></li>
                      </ul>
                    </div>

                    {/* Legal */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-[15px] mb-6">Legal</h4>
                      <ul className="flex flex-col gap-4">
                        <li><Link href="/terms" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Terms</Link></li>
                        <li><Link href="/privacy" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Privacy</Link></li>
                        <li><Link href="/currency" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Currency rates</Link></li>
                        <li><Link href="/standards" className="text-gray-500 hover:text-gray-900 text-[14px] transition-colors">Operator standards</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-[12px] font-bold tracking-widest text-gray-400 uppercase">
                    A brand of PT BALANCE ISLAND INDONESIA
                  </div>
                  <p className="text-[13px] text-gray-500 font-medium">
                    © {new Date().getFullYear()} Balance Island. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
      </div>
    </div>
  );
}
