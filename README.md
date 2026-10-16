# Threadline: responsive React clothing store with admin panel

A mobile-first e-commerce store with a customer storefront, a Node.js API with a SQLite database, and an admin panel for managing products and orders.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Zustand · React Hook Form + Zod · Express · SQLite (built into Node)

## Getting started

Requires **Node.js 22.18 or newer** (Node runs the TypeScript server directly and provides SQLite).

```bash
npm install
cp .env.example .env     # then set ADMIN_EMAIL and ADMIN_PASSWORD
npm run dev              # storefront http://localhost:5173 · API on port 3001
```

- **Store:** http://localhost:5173
- **Admin:** http://localhost:5173/admin. Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

On first start the server creates `data/store.db`, loads 35 demo products, and creates the admin account. To change the admin password, edit `.env` and restart the server.

### Production

```bash
npm run build   # type-checks everything and builds the storefront into dist/
npm start       # one Node process serves the API and the built site on PORT (default 3001)
```

Deploy to any host that runs Node (e.g. Render, Railway, a VPS). Make these persistent:
- the `data/` folder (database and uploaded photos)
- the environment variables from `.env`

Serve the site over HTTPS; session cookies are then marked `Secure` automatically.

## Features

**Storefront**
- Home page: animated hero, collections, best sellers, sale banner, new arrivals, newsletter
- Shop: search, filters (category, men/women, price, on sale), sorting, pagination. Filters live in the URL, so results can be shared.
- Product page: swipeable gallery, size and colour selection, stock status, related products
- Bag: slide-out drawer and full page, free-shipping progress, GST and shipping totals
- Wishlist, customer accounts, checkout (card, UPI or cash on delivery; payment is simulated), order history with delivery status

**Admin panel** (`/admin`)
- Dashboard: total sales, orders, orders awaiting delivery, low-stock alerts, recent orders
- Products: search and filter; edit price, sale price and stock right in the list; add or edit products with photo upload, sizes, colours and details; delete products
- Orders: every customer's orders, filter by Pending/Delivered, search; mark as delivered (customers see the update); delete orders. Deleting a pending order puts its items back in stock.

**Security**
- Passwords are hashed with scrypt
- Sessions use a random token in an httpOnly, SameSite cookie; only its hash is stored
- Admin API routes check the admin role on the server
- Sign-in locks for 15 minutes after 10 failed attempts
- The server recalculates prices, stock and totals itself and ignores prices sent from the browser; stock is reserved in a database transaction
- Cross-site POST/PATCH/DELETE requests are rejected
- Uploads must be JPG, PNG, WebP or AVIF images under 5 MB, and are saved under random file names
- Only the last 4 digits of a card are sent to the server

## Project structure

```
server/             API server (Express)
  index.ts          entry point: middleware, routes, serving the built site
  db.ts             SQLite schema
  auth.ts           password hashing, sessions, admin guard, sign-in rate limit
  products.ts       product queries
  orders.ts         order placement, status changes, stats
  routes/           /api/auth, /api (store), /api/admin
  seed-products.ts  demo catalog loaded on first start
shared/             code used by both browser and server
  types.ts          Product, Order, User…
  schemas.ts        validation rules (Zod) for forms and API
  store-rules.ts    currency, shipping, tax, categories, totals
src/                React storefront and admin panel
  components/       layout, product, cart, admin, ui
  pages/            storefront pages; pages/admin/ for the admin panel
  store/            Zustand stores: catalog, cart, wishlist, auth, toasts
  lib/api.ts        API client
data/               database and uploaded photos (created at runtime, git-ignored)
```

## Customising

- **Store name, contact details, social links:** `src/config.ts`
- **Currency, free-shipping threshold, tax rate, categories:** `shared/store-rules.ts`
- **Colours and animations:** `src/index.css` (brand scale, `bg-sunset` gradients, keyframes). Motion is disabled automatically for visitors who turn on "reduce motion".
- **Products:** manage them in `/admin`. The initial demo catalog is in `server/seed-products.ts`.

## Before going live

- **Photos and products:** the demo photos and product data come from the free [dummyjson.com](https://dummyjson.com) demo API, and some items carry real brand names. Replace them with your own through the admin panel.
- **Payments:** payment is simulated. Integrate a payment gateway (e.g. Razorpay or Stripe) on the server; never collect raw card numbers yourself.
- **Emails:** order confirmation and newsletter emails aren't sent. Connect an email provider.
- **Backups:** back up `data/` regularly.
- **Admin password:** use a long, unique `ADMIN_PASSWORD`.
