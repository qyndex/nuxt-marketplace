<template>
  <div class="app">
    <header class="topbar">
      <NuxtLink to="/" class="logo">Marketplace</NuxtLink>
      <nav aria-label="Main navigation">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/cart">Cart ({{ cartCount }})</NuxtLink>
      </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
useHead({ htmlAttrs: { lang: "en" } });
const cart = useCartStore();
const cartCount = computed(() => cart.items.length);
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; border-bottom: 1px solid #e2e8f0; }
.logo { font-weight: 800; font-size: 1.25rem; color: #4f46e5; text-decoration: none; }
nav { display: flex; gap: 1.5rem; }
nav a { color: #475569; text-decoration: none; font-weight: 500; }
nav a:hover, nav a.router-link-active { color: #4f46e5; }
</style>
