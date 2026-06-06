# Nuxt Marketplace
Multi-vendor marketplace with product listings, Pinia cart store, category and price filters, and server-side listing API.

## Stack

- **Framework:** Nuxt
- **Language:** TypeScript
- **Database:** Supabase (Postgres + Auth + Storage)
- **Auth:** Unknown
- **Styling:** Vanilla CSS / framework defaults

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env  # then edit and fill in the keys below

# 3. Apply database migrations
npx supabase db reset --local

# 4. Start the dev server
npm run dev

# Run tests
npm run test
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | yes | Supabase project URL (server-side). |
| `SUPABASE_KEY` | yes | Supabase anon key (alias used by some Nuxt templates). |

## Project structure (top 2 levels)

```
components/
  ListingCard.vue
  MarketplaceHero.vue
composables/
  useCart.ts
layouts/
middleware/
  auth.ts
pages/
  auth/
  index.vue
server/
  api/
stores/
  cart.ts
supabase/
  migrations/
  seed.sql
tests/
  e2e/
  unit/
types/
  database.ts
CLAUDE.md
CONTRIBUTING.md
Dockerfile
LICENSE
README.md
app.vue
docker-compose.yml
eslint.config.mjs
nuxt.config.ts
package.json
playwright.config.ts
postcss.config.js
tsconfig.json
vitest.config.ts
```

## Routes / pages

- `/auth/login`
- `/auth/signup`
- `/`
- `/api/cart/[id].delete`
- `/api/cart.get`
- `/api/cart.post`
- `/api/categories.get`
- `/api/listings/[id].delete`
- `/api/listings/[id].get`
- `/api/listings/[id].put`
- `/api/listings/index.post`
- `/api/listings.get`
- `/api/orders.get`
- `/api/orders.post`
- `/api/profile.get`
- `/api/profile.put`

## Database schema

Tables defined in migrations:

- `profiles`
- `categories`
- `listings`
- `cart_items`
- `orders`
- `order_items`

## Tests

- Unit / integration: `npm run test`
- End-to-end (Playwright): `npm run test:e2e`

## Deploy

This template ships a `Dockerfile` and `docker-compose.yml`. For local end-to-end runs use `docker compose up --build`; for image-based deploys build with `docker build -t <name> .` and ship to your registry.

## Customising for your build

When you ask Qyngent to build on top of this template, mention:

- **Brand & product name** — replace any placeholder copy in this template.
- **Color scheme & typography** — drives Tailwind tokens / theme files.
- **Features beyond the baseline** — this template already ships:
  - 6 database table(s) (profiles, categories, listings, cart_items, orders…)
  - 16 route(s) / screen(s)
- **Integrations** — list any third-party APIs you want wired in.
- **Deployment target** — Qyngent defaults to its hosted platform; tell us if you need a specific cloud.

Built with [Qyngent](https://qyngent.com) — autonomous app generation that uses this template as a starting point.
