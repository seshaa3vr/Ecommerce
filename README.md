# 🛍️ Threadline — Modern Clothing Store

A modern, responsive full-stack clothing e-commerce application built with **React 19, TypeScript, Tailwind CSS v4, Node.js, Express, and SQLite**.

Threadline provides a seamless online shopping experience with product discovery, shopping cart, wishlist, customer accounts, checkout, order tracking, and a powerful admin dashboard.

## 🌐 Live Demo

🚀 **[Visit Threadline — Live Website](https://threadline-shopping.netlify.app)**

## ✨ Features

### 🛒 Customer Storefront
- Responsive, mobile-first user interface
- Animated homepage with featured collections, best sellers, and new arrivals
- Product search, category filters, price filters, and sorting
- Product pages with image galleries, size and colour selection, and stock status
- Shopping cart with shipping and GST calculations
- Wishlist functionality
- Customer authentication and account management
- Checkout with simulated card, UPI, and cash-on-delivery options
- Order history and delivery status tracking
- Newsletter subscription interface

### ⚙️ Admin Dashboard
- Dashboard with sales statistics and order summaries
- Product creation, editing, and deletion
- Product image uploads
- Inventory and stock management
- Inline price, sale price, and stock updates
- Order search and status management
- Low-stock alerts and recent orders
- Automatic stock restoration when pending orders are deleted

### 🔐 Security
- Password hashing using Node.js `scrypt`
- Random session tokens stored as hashes in the database
- HTTP-only, SameSite session cookies
- Server-side admin role authorization
- Sign-in rate limiting with temporary lockout
- Server-side price, stock, and order-total validation
- Database transactions for stock reservation
- Protection against cross-site mutation requests
- Image upload type and size validation
- Only the last four digits of a payment card are sent to the server

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend UI |
| TypeScript | Type safety |
| Vite | Development and build tooling |
| Tailwind CSS v4 | Responsive styling |
| React Router | Client-side routing |
| Zustand | State management |
| React Hook Form | Form handling |
| Zod | Data validation |
| Node.js | Backend runtime |
| Express | REST API |
| SQLite | Database |

## 🚀 Getting Started

### Prerequisites

- Node.js **22.18 or newer**
- npm

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/threadline.git
cd threadline
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file using the example configuration:

```bash
cp .env.example .env
```

Set your admin credentials in `.env`:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-strong-password
```

Use a strong, unique password and never commit your `.env` file to GitHub.

**4. Start the development server**

```bash
npm run dev
```

Open the application in your browser:

- **Storefront:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin
- **Backend API:** http://localhost:3001

On first startup, the server initializes the SQLite database, loads 35 demo products, and creates the admin account.

## 🏗️ Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The production server serves the built frontend and API from a single Node.js process.

## ☁️ Deployment

The frontend demo is hosted on Netlify.

**Live Website:** https://threadline-shopping.netlify.app

The complete full-stack application can be deployed to a Node.js-compatible hosting provider such as Render, Railway, or a VPS.

For production deployment:
- Configure the required environment variables.
- Connect the frontend to the deployed backend API.
- Enable HTTPS.
- Configure persistent storage for the SQLite database and uploaded images.
- Set up regular database backups.

**Note:** The Netlify demo may provide only the frontend experience unless the backend API is deployed and correctly connected.

## 📁 Project Structure

```text
threadline/
├── server/
│   ├── index.ts
│   ├── db.ts
│   ├── auth.ts
│   ├── products.ts
│   ├── orders.ts
│   ├── seed-products.ts
│   └── routes/
├── shared/
│   ├── types.ts
│   ├── schemas.ts
│   └── store-rules.ts
├── src/
│   ├── components/
│   ├── pages/
│   │   └── admin/
│   ├── store/
│   ├── lib/
│   ├── config.ts
│   └── index.css
├── data/
├── .env.example
└── package.json
```

## 🎨 Customization

- **Store name and contact details:** `src/config.ts`
- **Currency, shipping, tax, and categories:** `shared/store-rules.ts`
- **Colours and animations:** `src/index.css`
- **Demo product catalogue:** `server/seed-products.ts`
- **Products and inventory:** Manage them through the admin dashboard.

## ⚠️ Before Going Live

- Replace demo products and images with authorized product assets.
- Integrate a real payment gateway such as Razorpay or Stripe.
- Configure an email provider for order confirmations and newsletters.
- Use HTTPS and secure production environment variables.
- Configure persistent database and image storage.
- Back up the database regularly.
- Review authentication, authorization, session management, and API security.

**Payment Notice:** Payments are simulated in the current implementation. No real payment is processed.

## 📄 License

This project does not currently specify a license. Add a suitable license before permitting reuse or redistribution.

---

**Built with ❤️ using React, TypeScript, and Node.js.**

⭐ If you like Threadline, consider giving the repository a star!
