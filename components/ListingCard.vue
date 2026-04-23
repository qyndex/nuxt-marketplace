<template>
  <article class="card">
    <span v-if="listing.badge" class="badge">{{ listing.badge }}</span>
    <NuxtLink :href="`/listings/${listing.id}`" class="img-link" :aria-label="listing.name">
      <img :src="listing.image" :alt="listing.name" loading="lazy" width="480" height="360" />
    </NuxtLink>
    <div class="body">
      <p class="vendor">{{ listing.vendor }}</p>
      <h3>
        <NuxtLink :href="`/listings/${listing.id}`">{{ listing.name }}</NuxtLink>
      </h3>
      <div class="meta">
        <span class="rating" :aria-label="`${listing.rating} stars`">★ {{ listing.rating }}</span>
        <span class="reviews">({{ listing.reviews }})</span>
      </div>
      <div class="footer">
        <p class="price">${{ listing.price.toFixed(2) }}</p>
        <button
          class="add-btn"
          :aria-label="`Add ${listing.name} to cart`"
          @click="$emit('addToCart')"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Listing } from "~/server/api/listings.get";
defineProps<{ listing: Listing }>();
defineEmits<{ addToCart: [] }>();
</script>

<style scoped>
.card { position: relative; background: white; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: box-shadow 0.2s; }
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.badge { position: absolute; top: 0.75rem; left: 0.75rem; background: #7c3aed; color: white; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 9999px; text-transform: uppercase; z-index: 1; }
.img-link { display: block; }
img { width: 100%; height: 200px; object-fit: cover; }
.body { padding: 1rem; }
.vendor { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #7c3aed; margin-bottom: 0.25rem; }
h3 { font-size: 0.9375rem; font-weight: 600; margin-bottom: 0.375rem; }
h3 a { text-decoration: none; color: inherit; }
.meta { display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.75rem; }
.rating { color: #f59e0b; font-size: 0.8125rem; }
.reviews { color: #94a3b8; font-size: 0.75rem; }
.footer { display: flex; justify-content: space-between; align-items: center; }
.price { font-size: 1.125rem; font-weight: 700; }
.add-btn { padding: 0.4rem 0.875rem; background: #7c3aed; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.8125rem; font-weight: 600; }
.add-btn:hover { background: #6d28d9; }
</style>
