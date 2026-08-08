// Client-side persistent favorites management (localStorage + reactive events)

const FAVORITES_STORAGE_KEY = "balance_island_saved_trips";

export function getSavedTrips() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading saved trips:", err);
    return [];
  }
}

export function isTripSaved(tripId) {
  if (typeof window === "undefined" || !tripId) return false;
  try {
    const saved = getSavedTrips();
    return saved.some(item => String(item.id) === String(tripId));
  } catch (err) {
    return false;
  }
}

export function toggleSaveTrip(item) {
  if (typeof window === "undefined" || !item || !item.id) return false;
  try {
    const saved = getSavedTrips();
    const existingIndex = saved.findIndex(s => String(s.id) === String(item.id));
    let newSaved;
    let isNowSaved = false;

    if (existingIndex >= 0) {
      newSaved = saved.filter(s => String(s.id) !== String(item.id));
      isNowSaved = false;
    } else {
      // Normalize item to ensure all needed display fields exist
      const tripData = {
        id: item.id,
        title: item.title || item.name || "Bali Tour",
        price: item.price || item.basePrice || 0,
        image: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
        location: item.location || "Bali",
        rating: item.rating || 4.9,
        reviews: item.reviews || 24,
        category: item.category || item.service || "Tour",
        data: item.data || item,
        savedAt: new Date().toISOString()
      };
      newSaved = [tripData, ...saved];
      isNowSaved = true;
    }

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: { id: item.id, isSaved: isNowSaved, all: newSaved } }));
    return isNowSaved;
  } catch (err) {
    console.error("Error saving trip:", err);
    return false;
  }
}

export function removeSavedTrip(tripId) {
  if (typeof window === "undefined" || !tripId) return;
  try {
    const saved = getSavedTrips();
    const newSaved = saved.filter(s => String(s.id) !== String(tripId));
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: { id: tripId, isSaved: false, all: newSaved } }));
  } catch (err) {
    console.error("Error removing saved trip:", err);
  }
}
