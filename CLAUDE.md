# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt Marketplace — Multi-vendor marketplace with product listings, Pinia cart store, category and price filters, and server-side listing API.

Built with Nuxt 3, Vue 3, TypeScript, and Tailwind CSS.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run preview          # Preview production build
npm run typecheck        # Nuxt type check (nuxi typecheck)
npm run lint             # ESLint

# Testing
npm run test             # Vitest unit tests (run once)
npm run test:watch       # Vitest in watch mode
npm run test:coverage    # Vitest with v8 coverage report
npm run test:e2e         # Playwright E2E tests (requires dev server)
```

## Architecture

- `pages/` — File-based routing (`.vue` files)
  - `pages/auth/login.vue` — Sign-in page (layout: false)
  - `pages/auth/signup.vue` — Registration page (layout: false)
- `components/` — Auto-imported Vue components
  - `ListingCard.vue` — Marketplace listing tile with add-to-cart
  - `MarketplaceHero.vue` — Hero banner for the home page
- `composables/` — Vue composables (auto-imported)
  - `useCart.ts` — Guest + DB-backed cart (localStorage for guests, API for auth users)
- `middleware/` — Route middleware
  - `auth.ts` — Redirects unauthenticated users to `/auth/login`; apply with `definePageMeta({ middleware: "auth" })`
- `server/api/` — Nitro server routes with Supabase queries
- `stores/` — Pinia stores
- `types/database.ts` — Shared TypeScript types (Listing, CartItem, Order, Profile, …)
- `tests/unit/` — Vitest unit tests (`components/`, `composables/`)
- `tests/e2e/` — Playwright E2E tests
- `supabase/` — Migration SQL + seed data

## Rules

- Use Composition API (`<script setup>`) — no Options API
- TypeScript strict mode — no `any` types
- Auto-imports for components, composables, and utils (Nuxt resolves `~` and `@` to root)
- Use `useFetch` / `useAsyncData` for data fetching in pages/components
- Server routes: use `serverSupabaseClient` from `#supabase/server`
- Auth: `useSupabaseUser()` for reactive user state; `useSupabaseClient()` for auth actions
- Protected pages: add `definePageMeta({ middleware: "auth" })` — middleware redirects to `/auth/login`
- ARIA labels required on all interactive elements
- Error and loading states required on all data-fetching components
