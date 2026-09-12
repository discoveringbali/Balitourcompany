// Client-side persistent shopping cart management (localStorage + reactive events)

const CART_STORAGE_KEY = "balance_island_cart";

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading cart:", err);
    return [];
  }
}

export function addToCart(item, options = {}) {
  if (typeof window === "undefined" || !item || !item.id) return false;
  try {
    const cart = getCart();
    
    // Normalize item to ensure all needed display fields exist
    const cartItem = {
      cartItemId: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Unique ID for this specific cart addition
      id: item.id,
      title: item.title || item.name || item.service_name || "Bali Tour",
      price: options.price || item.price || item.basePrice || 0,
      image: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      category: item.category || item.service || "Tour",
      options: options, // Store selected date, pax, time, etc.
      addedAt: new Date().toISOString()
    };
    
    const newCart = [...cart, cartItem];

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { newCart } }));
    return true;
  } catch (err) {
    console.error("Error adding to cart:", err);
    return false;
  }
}

export function removeFromCart(cartItemId) {
  if (typeof window === "undefined" || !cartItemId) return;
  try {
    const cart = getCart();
    const newCart = cart.filter(c => String(c.cartItemId) !== String(cartItemId));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { newCart } }));
  } catch (err) {
    console.error("Error removing from cart:", err);
  }
}

export function clearCart() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { newCart: [] } }));
  } catch (err) {
    console.error("Error clearing cart:", err);
  }
}
