export const DEFAULT_CAMPAIGNS = {
  scooter: {
    id: "scooter",
    type: "Scooter Rental",
    title: "Scooter & Motorbike Rental",
    subtitle: "Direct booking for premium automatic scooters with 2 sanitized helmets & free island-wide delivery.",
    badge: "Official Partner",
    externalUrl: "https://thebikebali.com",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    active: true,
    accentColor: "#1c1c1c",
    features: [
      "Free delivery & pickup to your villa / hotel in Bali",
      "2 clean sanitized helmets + phone holder + surf rack upon request",
      "Comprehensive insurance & 24/7 island roadside support"
    ],
    options: [
      { name: "Honda Scoopy 110cc", desc: "Best for town & beach cruising", price: "$6 / day" },
      { name: "Yamaha NMAX 155cc", desc: "Comfortable power for long island rides", price: "$12 / day", popular: true },
      { name: "Honda PCX 160cc", desc: "Smooth luxury touring with large storage", price: "$14 / day" }
    ],
    stats: { clicks: 1420, views: 4850, conversion: "29.2%" }
  },
  spa: {
    id: "spa",
    type: "Spa & Wellness",
    title: "Luxury Spa & Authentic Massage",
    subtitle: "Connect directly to authentic Balinese healing rituals, luxury day spa treatments & holistic wellness.",
    badge: "Exclusive Partner",
    externalUrl: "https://ubudtranquilityspa.com",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    active: true,
    accentColor: "#1c1c1c",
    features: [
      "Authentic certified Balinese therapists & ancient pressure techniques",
      "100% natural organic essential oils, herbal scrubs & floral baths",
      "VIP private treatment suites & romantic couple wellness rituals"
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
      return { ...DEFAULT_CAMPAIGNS, ...JSON.parse(saved) };
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
