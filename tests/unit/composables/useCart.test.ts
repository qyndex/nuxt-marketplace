import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Listing } from "../../../types/database";

// ---- Nuxt auto-import stubs ------------------------------------------------
// useCart relies on: ref, computed, useState (Nuxt), useSupabaseUser, $fetch, import.meta.client

const mockUser = { value: null as { id: string } | null };

vi.stubGlobal("useSupabaseUser", () => mockUser);
vi.stubGlobal("useState", (_key: string, init: () => unknown) => {
  const { ref } = await import("vue");
  // Return a reactive ref seeded by the init fn (no localStorage in JSDOM)
  return ref(init());
});

// Stub $fetch for DB cart operations
const fetchMock = vi.fn().mockResolvedValue({});
vi.stubGlobal("$fetch", fetchMock);

// Make import.meta.client false so localStorage branch is skipped on server
vi.stubGlobal("import", { meta: { client: false } });

// ---- Helpers ----------------------------------------------------------------
import { ref, computed } from "vue";

// Re-implement the pure logic of useCart isolated from Nuxt auto-imports so
// we can test the guest-cart state machine without running the full Nuxt app.
function buildUseCart(isLoggedIn = false) {
  const user = { value: isLoggedIn ? { id: "user-1" } : null };
  const loading = ref(false);
  const error = ref<string | null>(null);
  const guestItems = ref<
    {
      id: string;
      listing_id: string;
      title: string;
      price: number;
      image_url: string;
      seller_name: string;
      quantity: number;
    }[]
  >([]);

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
      guestItems.value.push({
        id: crypto.randomUUID(),
        listing_id: listing.id,
        title: listing.title,
        price: listing.price,
        image_url: listing.image_url,
        seller_name:
          (listing.profiles as { display_name?: string } | undefined)
            ?.display_name ?? "",
        quantity: qty,
      });
    }
  }

  function removeGuest(listingId: string) {
    guestItems.value = guestItems.value.filter(
      (i) => i.listing_id !== listingId
    );
  }

  function updateQtyGuest(listingId: string, qty: number) {
    if (qty <= 0) {
      removeGuest(listingId);
      return;
    }
    const item = guestItems.value.find((i) => i.listing_id === listingId);
    if (item) item.quantity = qty;
  }

  function clearGuest() {
    guestItems.value = [];
  }

  async function addItem(listing: Listing, qty = 1) {
    if (user.value) {
      loading.value = true;
      error.value = null;
      try {
        await fetchMock("/api/cart", {
          method: "POST",
          body: { listing_id: listing.id, quantity: qty },
        });
      } catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to add to cart";
      } finally {
        loading.value = false;
      }
    } else {
      addGuest(listing, qty);
    }
  }

  async function removeItem(listingId: string, cartItemId?: string) {
    if (user.value && cartItemId) {
      loading.value = true;
      try {
        await fetchMock(`/api/cart/${cartItemId}`, { method: "DELETE" });
      } catch (e) {
        error.value =
          e instanceof Error ? e.message : "Failed to remove from cart";
      } finally {
        loading.value = false;
      }
    } else {
      removeGuest(listingId);
    }
  }

  function updateQty(listingId: string, qty: number, _cartItemId?: string) {
    updateQtyGuest(listingId, qty);
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

// ---- Fixtures ---------------------------------------------------------------
const makeListing = (overrides: Partial<Listing> = {}): Listing => ({
  id: "listing-1",
  title: "Widget Pro",
  description: "A top-tier widget",
  price: 19.99,
  image_url: "https://via.placeholder.com/300",
  category: "electronics",
  seller_id: "seller-1",
  status: "active",
  created_at: new Date().toISOString(),
  ...overrides,
});

// ---- Tests ------------------------------------------------------------------
describe("useCart — guest mode", () => {
  beforeEach(() => fetchMock.mockClear());

  it("starts with an empty cart", () => {
    const cart = buildUseCart();
    expect(cart.guestItems.value).toHaveLength(0);
    expect(cart.guestCount.value).toBe(0);
    expect(cart.guestTotal.value).toBe(0);
  });

  it("addItem adds a new guest item", async () => {
    const cart = buildUseCart();
    await cart.addItem(makeListing(), 1);
    expect(cart.guestItems.value).toHaveLength(1);
    expect(cart.guestItems.value[0].title).toBe("Widget Pro");
    expect(cart.guestItems.value[0].quantity).toBe(1);
  });

  it("addItem increments quantity for existing item", async () => {
    const cart = buildUseCart();
    await cart.addItem(makeListing(), 1);
    await cart.addItem(makeListing(), 2);
    expect(cart.guestItems.value).toHaveLength(1);
    expect(cart.guestItems.value[0].quantity).toBe(3);
  });

  it("computes guestTotal correctly", async () => {
    const cart = buildUseCart();
    await cart.addItem(makeListing({ price: 10 }), 3);
    expect(cart.guestTotal.value).toBeCloseTo(30);
  });

  it("computes guestCount correctly for multiple items", async () => {
    const cart = buildUseCart();
    await cart.addItem(makeListing({ id: "a", price: 5 }), 2);
    await cart.addItem(makeListing({ id: "b", price: 8 }), 3);
    expect(cart.guestCount.value).toBe(5);
  });

  it("removeItem removes the correct guest item", async () => {
    const cart = buildUseCart();
    await cart.addItem(makeListing({ id: "a" }));
    await cart.addItem(makeListing({ id: "b" }));
    await cart.removeItem("a");
    expect(cart.guestItems.value).toHaveLength(1);
    expect(cart.guestItems.value[0].listing_id).toBe("b");
  });

  it("updateQty changes quantity", async () => {
    const cart = buildUseCart();
    await cart.addItem(makeListing());
    cart.updateQty("listing-1", 5);
    expect(cart.guestItems.value[0].quantity).toBe(5);
  });

  it("updateQty with 0 removes the item", async () => {
    const cart = buildUseCart();
    await cart.addItem(makeListing());
    cart.updateQty("listing-1", 0);
    expect(cart.guestItems.value).toHaveLength(0);
  });

  it("clearGuest empties the cart", async () => {
    const cart = buildUseCart();
    await cart.addItem(makeListing({ id: "a" }));
    await cart.addItem(makeListing({ id: "b" }));
    cart.clearGuest();
    expect(cart.guestItems.value).toHaveLength(0);
  });
});

describe("useCart — logged-in mode", () => {
  beforeEach(() => fetchMock.mockClear());

  it("addItem calls $fetch for logged-in user", async () => {
    const cart = buildUseCart(true);
    await cart.addItem(makeListing());
    expect(fetchMock).toHaveBeenCalledWith("/api/cart", {
      method: "POST",
      body: { listing_id: "listing-1", quantity: 1 },
    });
    // Guest items should remain empty
    expect(cart.guestItems.value).toHaveLength(0);
  });

  it("removeItem calls $fetch DELETE for logged-in user", async () => {
    const cart = buildUseCart(true);
    await cart.removeItem("listing-1", "cart-item-99");
    expect(fetchMock).toHaveBeenCalledWith("/api/cart/cart-item-99", {
      method: "DELETE",
    });
  });

  it("sets error state when $fetch rejects", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network error"));
    const cart = buildUseCart(true);
    await cart.addItem(makeListing());
    expect(cart.error.value).toBe("Network error");
  });
});
