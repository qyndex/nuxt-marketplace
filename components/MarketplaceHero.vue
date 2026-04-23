<template>
  <section class="hero">
    <div class="content">
      <h1>Discover Unique Products</h1>
      <p>Handmade, vintage, and original goods from independent creators worldwide.</p>
      <form class="search-form" role="search" @submit.prevent="search">
        <input
          v-model="query"
          type="search"
          placeholder="Search for handmade treasures…"
          aria-label="Search marketplace"
          class="search-input"
        />
        <button type="submit" class="search-btn" aria-label="Search">Search</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const query = ref("");
const router = useRouter();
function search() {
  if (query.value.trim()) router.push(`/search?q=${encodeURIComponent(query.value)}`);
}
</script>

<style scoped>
.hero { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 5rem 1.5rem; text-align: center; }
.content { max-width: 40rem; margin: 0 auto; }
h1 { font-size: 2.75rem; font-weight: 800; margin-bottom: 1rem; }
p { font-size: 1.125rem; opacity: 0.9; margin-bottom: 2rem; }
.search-form { display: flex; max-width: 32rem; margin: 0 auto; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
.search-input { flex: 1; padding: 0.875rem 1.25rem; border: none; font-size: 1rem; color: #1e293b; }
.search-btn { padding: 0 1.5rem; background: #1e293b; color: white; border: none; font-weight: 700; cursor: pointer; font-size: 0.9375rem; }
</style>
