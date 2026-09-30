# InventoryManager — NimbusTech Demo Store

A full-stack portfolio demo: a fictional consumer electronics storefront
("NimbusTech") with a public shop and an authenticated admin area for
managing inventory and orders. Built with Next.js (App Router), Sanity (CMS),
Prisma + PostgreSQL, and NextAuth.

## Content vs. transactional data

| Data | Lives in | Edited via |
| --- | --- | --- |
| Products (name, slug, description, price, images, visibility), categories | Sanity (`o5hhr4br` / `production`) | Sanity Studio (`../SanityCMS/studio`) |
| Stock levels | PostgreSQL (`Product`: `sku` + `stock`) | `/admin/products` → Update stock |
| Orders, order items, admin users | PostgreSQL | Checkout, `/admin/orders` |

Sanity products and Postgres inventory rows are joined on **SKU**. A product
published in Sanity without an inventory row shows as out of stock until its
stock is set in the admin. Checkout reads prices and visibility straight from
the Sanity API (not the CDN) and decrements stock in a Postgres transaction;
each order item stores a snapshot of the product name and unit price.

## Features

- **Public storefront** — browse products by category, search, view product
  detail pages, add items to a cart (persisted in `localStorage`), and check
  out.
- **Checkout flow** — placing an order validates stock, creates the order and
  order items, and decrements product stock in a single database
  transaction.
- **Admin area** (`/admin`, requires login) — dashboard with revenue/order
  stats and low-stock alerts, stock management with links into Sanity Studio
  for content edits, and order status management.
- **Auth** — credentials-based admin login (NextAuth.js), route-protected via
  middleware.
- **API routes** — REST endpoints for products and orders, validated with
  Zod.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, React 19)
- [Sanity](https://www.sanity.io) for catalog content (`next-sanity`, `@sanity/image-url`)
- [Prisma 7](https://www.prisma.io) + PostgreSQL (via the `pg` driver
  adapter)
- [NextAuth.js v5](https://authjs.dev) (Credentials provider, JWT sessions)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Zod](https://zod.dev) for input validation

## Getting started

Requires a PostgreSQL database and the Sanity catalog (import it with
`npx sanity exec scripts/import-fullstack.ts --with-user-token` from
`../SanityCMS/studio`). Also requires a PostgreSQL database (e.g. a free [Neon](https://neon.tech) or
[Vercel Postgres](https://vercel.com/storage/postgres) instance). Copy
`.env.example` to `.env` and set `DATABASE_URL` to its connection string,
then:

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm install` automatically generates the Prisma client (`postinstall`
script). `npm run dev` starts the app at `http://localhost:3000`.

### Demo admin login

Seeded by `prisma/seed.ts` (credentials configurable via `.env`):

```
Email:    admin@nimbustech.demo
Password: NimbusAdmin123!
```

Sign in at `/login`, then manage inventory at `/admin`.

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable         | Purpose                                              |
| ---------------- | ----------------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string                          |
| `AUTH_SECRET`    | Secret used by NextAuth to sign session tokens         |
| `ADMIN_EMAIL`    | Email for the demo admin user created by the seed script |
| `ADMIN_PASSWORD` | Password for the demo admin user created by the seed script |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (`o5hhr4br`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (`production`) |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Studio URL used by the admin "Edit in Studio" links |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Useful scripts

| Command              | Description                                  |
| --------------------- | --------------------------------------------- |
| `npm run dev`          | Start the dev server                          |
| `npm run build`        | Production build                              |
| `npm run lint`         | Run ESLint                                    |
| `npm run db:migrate`   | Create/apply a Prisma migration               |
| `npm run db:seed`      | Re-seed demo data (stock levels, admin user)   |
| `npm run db:reset`     | Drop, re-migrate, and re-seed the database    |
| `npm run db:studio`    | Open Prisma Studio to browse the database     |

## Project structure

```
prisma/               Prisma schema, migrations, seed script
src/
  app/                 Routes (App Router)
    products/          Storefront: listing + product detail
    cart/, checkout/    Client-side cart and checkout flow
    orders/[id]/        Order confirmation page
    login/              Admin login (server action + NextAuth)
    admin/              Auth-gated admin dashboard, products, orders
    api/                REST routes for products, orders, and NextAuth
  components/
    storefront/         Header, cart provider/button, product cards, filters
    admin/               Product form, data tables, status controls
    ui/                  Small shared primitives (Button, Input, Badge)
  lib/                  Prisma client, auth config, Zod schemas, formatting
  proxy.ts              Route protection for /admin/* (Next.js middleware)
```

## Notes

This is a demo project: no real payments are processed and there is no email
delivery. Product images are stored as Sanity assets (originally imported
from Unsplash/Pexels). Scope is intentionally
kept to what's needed to demonstrate a working full-stack CRUD app with
auth.
