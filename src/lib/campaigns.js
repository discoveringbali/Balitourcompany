export const DEFAULT_CAMPAIGNS = {
  scooter: {
    id: "scooter",
    companyName: "The Bike Bali",
    type: "Scooter Rental",
    title: "The Bike Bali",
    subtitle: "Premium automatic scooters delivered directly to your villa or hotel across Bali.",
    tagline: "Official Scooter Rental Partner",
    badge: "Verified Partner",
    externalUrl: "https://thebikebali.com",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    active: true,
    accentColor: "#1c1c1c",
    rating: "4.9",
    reviewsCount: "850+",
    location: "Island-wide Delivery",
    features: [
      "Free villa & hotel delivery across Bali",
      "2 clean sanitized helmets + phone mount",
      "Comprehensive insurance & 24/7 roadside support",
      "No passport hold required"
    ],
    options: [
      { name: "Honda Scoopy 110cc", desc: "Best for beach & cafe trips", price: "$6 / day" },
      { name: "Yamaha NMAX 155cc", desc: "Comfort & power for island exploration", price: "$12 / day", popular: true },
      { name: "Honda PCX 160cc", desc: "Premium touring with large storage", price: "$14 / day" }
    ],
    stats: { clicks: 1420, views: 4850, conversion: "29.2%" }
  },
  spa: {
    id: "spa",
    companyName: "Ubud Tranquility Spa",
    type: "Spa & Wellness",
    title: "Ubud Tranquility Spa",
    subtitle: "Authentic Balinese healing rituals, organic therapies, and luxury wellness sanctuaries.",
    tagline: "Official Wellness Partner",
    badge: "Exclusive Partner",
    externalUrl: "https://ubudtranquilityspa.com",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    active: true,
    accentColor: "#1c1c1c",
    rating: "4.9",
    reviewsCount: "620+",
    location: "Ubud & South Bali",
    features: [
      "Certified master Balinese massage therapists",
      "100% natural organic essential oils & herbal scrubs",
      "Private VIP couple suites & floral open-air baths",
      "Complimentary welcome herbal drink & refreshments"
    ],
    options: [
      { name: "Balinese Deep Tissue Massage", desc: "60-90 min traditional muscle tension relief", price: "$18" },
      { name: "Royal Herbal Scrub & Flower Bath", desc: "120 min signature revitalizing ritual", price: "$32", popular: true },
      { name: "Couples Harmony Sanctuary", desc: "150 min full body scrub, massage & private bath", price: "$58" }
    ],
    stats: { clicks: 960, views: 3200, conversion: "30.0%" }
  }
};

export const getCampaignSettings = () => {
  if (typeof window === 'undefined') return DEFAULT_CAMPAIGNS;
  try {
    const saved = localStorage.getItem('balance_island_campaign_links');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        scooter: { ...DEFAULT_CAMPAIGNS.scooter, ...(parsed.scooter || {}) },
        spa: { ...DEFAULT_CAMPAIGNS.spa, ...(parsed.spa || {}) }
      };
    }
  } catch (e) {
    console.error("Error reading campaign settings", e);
  }
  return DEFAULT_CAMPAIGNS;
};

export const saveCampaignSettings = (campaigns) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('balance_island_campaign_links', JSON.stringify(campaigns));
      window.dispatchEvent(new CustomEvent('balance_island_campaigns_changed', { detail: campaigns }));
    } catch (e) {
      console.error("Error saving campaign settings", e);
    }
  }
};

export const updateSingleCampaign = (campaignId, data) => {
  const current = getCampaignSettings();
  const updated = {
    ...current,
    [campaignId]: {
      ...current[campaignId],
      ...data
    }
  };
  saveCampaignSettings(updated);
  return updated;
};
