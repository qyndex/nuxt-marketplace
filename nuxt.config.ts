export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxtjs/supabase",
    "@nuxtjs/tailwindcss",
  ],

  typescript: { strict: true, typeCheck: false },

  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/confirm",
      exclude: ["/", "/search", "/listings/*", "/auth/*"],
    },
  },

  runtimeConfig: {
    public: {
      siteName: "Nuxt Marketplace",
      apiBase: "/api",
    },
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Nuxt Marketplace",
      meta: [
        { name: "description", content: "Discover unique products from independent creators worldwide." },
      ],
    },
  },
});
