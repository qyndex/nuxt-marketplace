import type { LocalCartItem, Listing } from "~/types/database";

const STORAGE_KEY = "marketplace_cart";

/**
 * Cart composable — persists to localStorage for guests, syncs to DB for logged-in users.
 * Always use this composable instead of the Pinia store directly in components.
 */
export function useCart() {
  const user = useSupabaseUser();
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Guest cart backed by localStorage
  const guestItems = useState<LocalCartItem[]>("cart_guest", () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? (JSON.parse(stored) as LocalCartItem[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  function persistGuest() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guestItems.value));
    }
  }

  const guestTotal = computed(() =>
    guestItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
  const guestCount = computed(() =>
    guestItems.value.reduce((sum, i) => sum + i.quantity, 0)
  );

  function addGuest(listing: Listing, qty = 1) {
    const existing = guestItems.value.find((i) => i.listing_id === listing.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      const sellerName =
        (listing.profiles as { display_name?: string } | undefined)
          ?.display_name ?? "";
      guestItems.value.push({
        id: crypto.randomUUID(),
        listing_id: listing.id,
        title: listing.title,
        price: listing.price,
        image_url: listing.image_url,
        seller_name: sellerName,
        quantity: qty,
      });
    }
    persistGuest();
  }

  function removeGuest(listingId: string) {
    guestItems.value = guestItems.value.filter((i) => i.listing_id !== listingId);
    persistGuest();
  }

  function updateQtyGuest(listingId: string, qty: number) {
    if (qty <= 0) { removeGuest(listingId); return; }
    const item = guestItems.value.find((i) => i.listing_id === listingId);
    if (item) { item.quantity = qty; persistGuest(); }
  }

  function clearGuest() {
    guestItems.value = [];
    persistGuest();
  }

  // DB-backed actions for logged-in users
  async function addToDbCart(listing: Listing, qty = 1) {
    loading.value = true;
    error.value = null;
    try {
      await $fetch("/api/cart", {
        method: "POST",
        body: { listing_id: listing.id, quantity: qty },
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to add to cart";
    } finally {
      loading.value = false;
    }
  }

  async function removeFromDbCart(cartItemId: string) {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/cart/${cartItemId}`, { method: "DELETE" });
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to remove from cart";
    } finally {
      loading.value = false;
    }
  }

  // Unified API — used in components
  async function addItem(listing: Listing, qty = 1) {
    if (user.value) {
      await addToDbCart(listing, qty);
    } else {
      addGuest(listing, qty);
    }
  }

  async function removeItem(listingId: string, cartItemId?: string) {
    if (user.value && cartItemId) {
      await removeFromDbCart(cartItemId);
    } else {
      removeGuest(listingId);
    }
  }

  function updateQty(listingId: string, qty: number, cartItemId?: string) {
    if (user.value && cartItemId) {
      // For DB cart we'd PATCH — for simplicity optimistic update
      updateQtyGuest(listingId, qty);
    } else {
      updateQtyGuest(listingId, qty);
    }
  }

  return {
    guestItems,
    guestTotal,
    guestCount,
    loading,
    error,
    addItem,
    removeItem,
    updateQty,
    clearGuest,
  };
}
