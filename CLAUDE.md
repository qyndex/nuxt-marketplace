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
npx nuxi typecheck      # Type check
npm run lint             # ESLint
```

## Architecture

- `pages/` — File-based routing (`.vue` files)
- `components/` — Auto-imported Vue components
- `composables/` — Vue composables (auto-imported)
- `server/` — Server routes and API endpoints
- `layouts/` — Page layouts
- `public/` — Static assets

## Rules

- Use Composition API (`<script setup>`) — no Options API
- TypeScript strict mode
- Auto-imports for components, composables, and utils
- Use `useFetch` / `useAsyncData` for data fetching
