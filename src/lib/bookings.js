// Client-side persistent booking history management (localStorage)

const BOOKINGS_STORAGE_KEY = "balance_island_saved_bookings";

export function getSavedBookings() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading saved bookings:", err);
    return [];
  }
}

export function saveBooking(bookingId) {
  if (typeof window === "undefined" || !bookingId) return false;
  try {
    const saved = getSavedBookings();
    if (!saved.includes(bookingId)) {
      const newSaved = [bookingId, ...saved];
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(newSaved));
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error saving booking:", err);
    return false;
  }
}

export function removeBooking(bookingId) {
  if (typeof window === "undefined" || !bookingId) return;
  try {
    const saved = getSavedBookings();
    const newSaved = saved.filter(id => id !== bookingId);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(newSaved));
  } catch (err) {
    console.error("Error removing saved booking:", err);
  }
}
