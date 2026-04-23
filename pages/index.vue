<template>
  <div>
    <MarketplaceHero />
    <main class="container">
      <div class="layout">
        <aside>
          <FilterPanel
            :categories="categories"
            v-model:selected-category="selectedCategory"
            v-model:price-range="priceRange"
          />
        </aside>
        <section>
          <div class="toolbar">
            <p class="results-count">{{ filteredListings.length }} listings</p>
            <select v-model="sortBy" aria-label="Sort listings" class="sort-select">
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div v-if="pending" class="loading" role="status">Loading listings…</div>
          <div v-else class="listings-grid" aria-label="Product listings">
            <ListingCard
              v-for="listing in filteredListings"
              :key="listing.id"
              :listing="listing"
              @add-to-cart="cart.add(listing)"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { Listing } from "~/server/api/listings.get";
import { useCartStore } from "~/stores/cart";

useHead({ title: "Browse — Marketplace" });

const cart = useCartStore();
const selectedCategory = ref("all");
const priceRange = ref<[number, number]>([0, 1000]);
const sortBy = ref("relevance");

const { data: listings, pending } = useLazyFetch<Listing[]>("/api/listings");

const categories = computed(() => [
  "all",
  ...new Set((listings.value ?? []).map((l) => l.category)),
]);

const filteredListings = computed(() => {
  let items = listings.value ?? [];
  if (selectedCategory.value !== "all")
    items = items.filter((l) => l.category === selectedCategory.value);
  items = items.filter(
    (l) => l.price >= priceRange.value[0] && l.price <= priceRange.value[1]
  );
  if (sortBy.value === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
  if (sortBy.value === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
  if (sortBy.value === "rating") items = [...items].sort((a, b) => b.rating - a.rating);
  return items;
});
</script>

<style scoped>
.container { max-width: 80rem; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
.layout { display: grid; grid-template-columns: 220px 1fr; gap: 2rem; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.results-count { font-size: 0.875rem; color: #64748b; }
.sort-select { padding: 0.375rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem; background: white; }
.listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
.loading { text-align: center; padding: 4rem; color: #94a3b8; }
</style>
