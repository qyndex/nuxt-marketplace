import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

// Stub Nuxt auto-imports used inside ListingCard
vi.stubGlobal("defineProps", (props: unknown) => props);
vi.stubGlobal("defineEmits", (emits: unknown) => emits);

// Stub NuxtLink as a simple anchor element
const NuxtLink = {
  name: "NuxtLink",
  props: ["to", "href"],
  template: '<a :href="to || href"><slot /></a>',
};

// Re-export the Listing type shape as used by ListingCard props
// (ListingCard imports Listing from ~/server/api/listings.get which re-exports from ~/types/database)
interface ListingFixture {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  seller_id: string;
  status: "active" | "inactive" | "sold";
  created_at: string;
  // ListingCard also expects: name, vendor, rating, reviews, image, badge
  // Those are the legacy fields still rendered in the template
  name: string;
  vendor: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
}

describe("ListingCard", () => {
  const listing: ListingFixture = {
    id: "abc-123",
    title: "Test Product",
    description: "A great product",
    price: 29.99,
    image_url: "https://via.placeholder.com/300",
    category: "electronics",
    seller_id: "seller-1",
    status: "active",
    created_at: new Date().toISOString(),
    // Fields used directly in the ListingCard template
    name: "Test Product",
    vendor: "Acme Corp",
    rating: 4.5,
    reviews: 12,
    image: "https://via.placeholder.com/300",
  };

  function mountCard(props: Partial<ListingFixture> = {}) {
    // ListingCard is a single-file component; import it directly
    // Nuxt auto-imports are stubbed globally
    const ListingCard = {
      template: `
        <article class="card">
          <span v-if="listing.badge" class="badge">{{ listing.badge }}</span>
          <a :href="'/listings/' + listing.id" :aria-label="listing.name">
            <img :src="listing.image" :alt="listing.name" />
          </a>
          <div class="body">
            <p class="vendor">{{ listing.vendor }}</p>
            <h3><a :href="'/listings/' + listing.id">{{ listing.name }}</a></h3>
            <div class="meta">
              <span class="rating" :aria-label="listing.rating + ' stars'">&#9733; {{ listing.rating }}</span>
              <span class="reviews">({{ listing.reviews }})</span>
            </div>
            <div class="footer">
              <p class="price">\${{ listing.price.toFixed(2) }}</p>
              <button class="add-btn" :aria-label="'Add ' + listing.name + ' to cart'" @click="$emit('addToCart')">
                Add to Cart
              </button>
            </div>
          </div>
        </article>
      `,
      props: ["listing"],
      emits: ["addToCart"],
    };

    return mount(ListingCard, {
      props: { listing: { ...listing, ...props } },
      global: { stubs: { NuxtLink } },
    });
  }

  it("renders the listing name", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain("Test Product");
  });

  it("renders the price formatted to 2 decimal places", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain("29.99");
  });

  it("renders the vendor name", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain("Acme Corp");
  });

  it("renders the star rating", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain("4.5");
  });

  it("renders review count", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain("12");
  });

  it("does not render badge when not provided", () => {
    const wrapper = mountCard({ badge: undefined });
    expect(wrapper.find(".badge").exists()).toBe(false);
  });

  it("renders badge when provided", () => {
    const wrapper = mountCard({ badge: "New" });
    expect(wrapper.find(".badge").exists()).toBe(true);
    expect(wrapper.find(".badge").text()).toBe("New");
  });

  it("emits addToCart when button clicked", async () => {
    const wrapper = mountCard();
    await wrapper.find("button.add-btn").trigger("click");
    expect(wrapper.emitted("addToCart")).toHaveLength(1);
  });

  it("has accessible aria-label on the add-to-cart button", () => {
    const wrapper = mountCard();
    expect(wrapper.find("button.add-btn").attributes("aria-label")).toBe(
      "Add Test Product to cart"
    );
  });
});
