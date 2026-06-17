# 🌿 FarmConnect — Blockchain-Powered Farm-to-Table Marketplace

> **Connecting Indian farmers directly with urban consumers. Fair prices, full transparency, blockchain verified.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Data Models](#data-models)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [Deployment to Vercel](#deployment-to-vercel)
- [Demo Credentials](#demo-credentials)
- [Screenshots](#screenshots)

---

## 🌾 Overview

FarmConnect is a full-stack web application that eliminates middlemen in the agricultural supply chain. Farmers list their produce directly, consumers browse and buy, and every product's journey from seed to plate is recorded on a simulated blockchain for full transparency.

**Key problems it solves:**
- Farmers typically receive only 20–30% of the final retail price. FarmConnect gives them 90%+.
- Consumers have no visibility into where their food comes from. FarmConnect provides complete traceability via QR codes.
- Food spoilage from long supply chains. FarmConnect enables direct, same-day-delivery logistics.

---

## ✨ Features

### 🛒 Consumer Features
| Feature | Description |
|---------|-------------|
| **Product Browse** | Grid view with freshness scores, filters, and sort options |
| **AI Freshness Score** | Calculated as `100 − (days since harvest × 8)` — shown as coloured progress bar |
| **QR Traceability** | Every product has a public `/qr/:id` page showing the full farm-to-table journey |
| **Smart Cart** | Persistent cart with coupon codes and Razorpay-style checkout |
| **Order Tracking** | Live status stepper from Placed → Confirmed → Packed → Out for Delivery → Delivered |
| **Escrow Payments** | Payment held in smart-contract escrow, released only after delivery confirmation |
| **Subscription Plans** | Weekly baskets (Basic ₹499 / Family ₹899 / Premium ₹1299) with pause/resume |
| **Group Buying** | Join deals with progress bars — price drops when target quantity is reached |
| **AI Meal Planner** | 7-day meal plan generator with auto-cart fill for ingredients |
| **FarmToken Rewards** | Earn tokens per order/review/referral, redeem at checkout |
| **Carbon Tracker** | CO₂ saved per purchase vs supermarket supply chain |

### 👨‍🌾 Farmer Features
| Feature | Description |
|---------|-------------|
| **Farmer Dashboard** | Earnings summary, demand trends, low-stock alerts, recent orders |
| **Product Management** | Add/edit/delete products with photo upload and AI price suggestions |
| **AI Price Suggestion** | Market-based suggested price range shown when adding a product |
| **Order Management** | View incoming orders and advance status (Confirm → Pack → Dispatch) |
| **Public Profile** | Story, certifications, video embed, donation button for consumers |
| **Sales Insights** | Revenue charts, top crops, demand forecast for the district |
| **Notification Centre** | New orders, low stock, payment alerts |

### 🔐 Blockchain & Traceability
| Feature | Description |
|---------|-------------|
| **Blockchain Hash** | Every product gets a unique `0x...` hash on listing |
| **QR Codes** | Generated client-side via `qrcode.react`, links to public trace page |
| **Journey Timeline** | 6-step provenance: Seed → Harvest → Quality Check → Pack → Dispatch → Deliver |
| **Immutable Reviews** | Reviews tagged with blockchain hash — "cannot be edited or deleted" |
| **Organic Certification** | Certificate hash + issue date shown with Verified badge |
| **Transaction Hash** | Each order gets an escrow transaction hash shown after payment |

### ⚙️ Admin Features
| Feature | Description |
|---------|-------------|
| **Farmer Approvals** | Review and approve/reject new farmer registrations |
| **Transaction Monitor** | Paginated table of all orders with escrow status |
| **Dispute Centre** | Resolve disputes: Refund buyer / Release to farmer / Escalate |
| **Analytics Charts** | Daily orders, top products, earnings distribution |
| **NGO Surplus Matching** | Match surplus farmer stock with partner NGOs |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS 3, custom CSS variables, dark mode |
| **State Management** | Zustand (cart + UI) with localStorage persistence |
| **Data Fetching** | TanStack React Query |
| **Authentication** | NextAuth.js v4 (Credentials + Google OAuth) |
| **Database** | MongoDB Atlas via Mongoose ODM |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **QR Codes** | qrcode.react |
| **Dates** | date-fns |
| **Toasts** | react-hot-toast |
| **Icons** | Lucide React |
| **Deployment** | Vercel (Edge Network, Mumbai region) |

---

## 📁 Project Structure

```
farmconnect/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Landing page (/)
│   │   ├── login/page.tsx          # Login (/login)
│   │   ├── register/page.tsx       # Register (/register)
│   │   ├── shop/
│   │   │   ├── page.tsx            # Browse products (/shop)
│   │   │   └── [productId]/page.tsx# Product detail (/shop/:id)
│   │   ├── cart/page.tsx           # Cart & checkout (/cart)
│   │   ├── orders/page.tsx         # Order history (/orders)
│   │   ├── subscription/page.tsx   # Plans (/subscription)
│   │   ├── groupbuy/page.tsx       # Group deals (/groupbuy)
│   │   ├── meal-planner/page.tsx   # AI planner (/meal-planner)
│   │   ├── community/page.tsx      # Forum (/community)
│   │   ├── events/page.tsx         # Events (/events)
│   │   ├── donate/page.tsx         # Surplus donation (/donate)
│   │   ├── qr/[productId]/page.tsx # Public QR trace (/qr/:id)
│   │   ├── farmer/
│   │   │   ├── dashboard/page.tsx  # Farmer home
│   │   │   ├── products/page.tsx   # Product management
│   │   │   ├── orders/page.tsx     # Incoming orders
│   │   │   ├── profile/page.tsx    # Public profile editor
│   │   │   └── insights/page.tsx   # Sales analytics
│   │   ├── admin/page.tsx          # Admin panel (/admin)
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── api/                    # API routes
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts
│   │       │   └── register/route.ts
│   │       ├── products/route.ts
│   │       ├── orders/route.ts
│   │       ├── farmers/route.ts
│   │       └── admin/route.ts
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Navbar.tsx          # Sticky top nav with cart badge
│   │   │   ├── Footer.tsx          # Full footer with links
│   │   │   └── Providers.tsx       # Session + Query + Toast providers
│   │   ├── ui/
│   │   │   ├── ProductCard.tsx     # Product grid card
│   │   │   ├── FreshnessScore.tsx  # Score badge + progress bar
│   │   │   ├── StatCard.tsx        # Dashboard metric card
│   │   │   └── Skeletons.tsx       # Loading skeletons
│   │   └── consumer/
│   │       ├── HeroSection.tsx     # Landing hero
│   │       ├── StatsSection.tsx    # Platform stats
│   │       ├── FeaturesSection.tsx # Feature cards
│   │       ├── HowItWorks.tsx      # 4-step explainer
│   │       ├── FarmerStories.tsx   # Carousel
│   │       └── CTASection.tsx      # Call to action
│   ├── lib/
│   │   ├── mongodb.ts              # Mongoose connection (singleton)
│   │   ├── auth.ts                 # NextAuth config
│   │   └── mockData.ts             # Pre-loaded mock data
│   ├── models/
│   │   ├── User.ts
│   │   ├── FarmerProfile.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Review.ts
│   └── store/
│       └── index.ts                # Zustand stores (cart + UI)
├── scripts/
│   └── seed.js                     # Database seed script
├── public/
├── .env.example                    # Environment variable template
├── .gitignore
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── package.json
```

---

## 🗺️ Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing page with hero, features, farmer stories | Public |
| `/login` | Email/password + Google OAuth login | Public |
| `/register` | Role selector (Farmer / Consumer) registration | Public |
| `/shop` | Product grid with filters, search, sort | Public |
| `/shop/:productId` | Product detail, QR trace, add to cart | Public |
| `/cart` | Cart, checkout, payment method selection | Consumer |
| `/orders` | Order history with live status tracking | Consumer |
| `/subscription` | Weekly basket plans | Consumer |
| `/groupbuy` | Active group buying deals | Consumer |
| `/meal-planner` | AI-generated 7-day meal plan | Consumer |
| `/community` | Farmer community forum | Public |
| `/events` | Local farmer markets & festivals | Public |
| `/donate` | Surplus food → NGO matching | Public |
| `/qr/:productId` | Public blockchain traceability page | **No login** |
| `/farmer/dashboard` | Farmer home with earnings & alerts | Farmer |
| `/farmer/products` | CRUD product management | Farmer |
| `/farmer/orders` | Incoming orders management | Farmer |
| `/farmer/profile` | Edit public profile & story | Farmer |
| `/farmer/insights` | Sales charts & demand forecast | Farmer |
| `/admin` | Admin panel (approvals, disputes, analytics) | Admin |

---

## 🗄️ Data Models

### users
```typescript
{
  name: string;
  email: string;          // unique
  password: string;       // bcrypt hashed
  role: 'farmer' | 'consumer' | 'admin';
  phone: string;
  language: string;       // 'en' | 'hi' | 'te'
  token_balance: number;  // FarmToken balance
  referral_code: string;  // unique 8-char code
  avatar: string;
  created_at: Date;
}
```

### farmer_profiles
```typescript
{
  user_id: ObjectId;        // → users
  district: string;
  state: string;
  farming_type: 'organic' | 'conventional' | 'mixed';
  bio: string;              // max 200 chars
  story: string;            // max 500 chars
  verified: boolean;        // admin must approve
  verification_date: Date;
  certifications: Array<{ name, hash, issue_date }>;
  languages_spoken: string[];
  total_earned: number;
  pending_payout: number;
}
```

### products
```typescript
{
  farmer_id: ObjectId;     // → users
  crop_name: string;
  variety: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'herbs' | 'other';
  quantity_kg: number;     // auto-decrements on order
  original_quantity: number;
  price_per_kg: number;
  harvest_date: Date;
  available_until: Date;
  organic: boolean;
  certification_hash: string;
  blockchain_hash: string; // unique 0x... hash
  photos: string[];        // up to 4 URLs
  status: 'active' | 'sold' | 'donated' | 'expired';
  district: string;
  carbon_saved_per_kg: number;
}
```

### orders
```typescript
{
  consumer_id: ObjectId;
  farmer_id: ObjectId;
  product_id: ObjectId;
  quantity: number;
  total_amount: number;
  payment_method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
  escrow_status: 'held' | 'released' | 'refunded';
  order_status: 'placed' | 'confirmed' | 'packed' | 'pickedup' | 'out_for_delivery' | 'delivered';
  delivery_address: { line1, city, state, pincode };
  delivery_slot: 'morning' | 'evening';
  transaction_hash: string;
  created_at: Date;
}
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier works)
- Google Cloud Console account (for OAuth, optional)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/farmconnect.git
cd farmconnect
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your values (see [Environment Variables](#environment-variables) below).

### 4. Seed the database
```bash
node scripts/seed.js
```
This creates all demo users, farmer profiles, and products.

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file with these values:

```bash
# MongoDB Atlas connection string
# Get this from: https://cloud.mongodb.com → Your Cluster → Connect → Drivers
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/farmconnect?retryWrites=true&w=majority

# NextAuth secret — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-string-here

# Your app URL (use http://localhost:3000 for local dev)
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional — get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Public URL for QR codes
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting MongoDB Atlas URI
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 — always free)
3. Click **Connect** → **Drivers** → Copy the connection string
4. Replace `<username>` and `<password>` with your DB user credentials
5. Replace `myFirstDatabase` with `farmconnect`

---

## 🌱 Database Seeding

The seed script creates:
- 5 users (1 admin, 3 farmers, 1 consumer)
- 3 farmer profiles (all verified)
- 6 products across different categories

```bash
node scripts/seed.js
```

**Demo Credentials** (password for all: `demo1234`):

| Role | Email |
|------|-------|
| Admin | admin@farmconnect.com |
| Farmer | ravi@farm.com |
| Farmer | lakshmi@farm.com |
| Farmer | suresh@farm.com |
| Consumer | priya@consumer.com |

---

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: FarmConnect"
git remote add origin https://github.com/your-username/farmconnect.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js — no configuration needed

### Step 3: Add Environment Variables
In the Vercel dashboard → Your Project → **Settings → Environment Variables**, add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | A random 32+ character string |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |

### Step 4: Deploy
Click **Deploy**. Vercel builds and deploys automatically. Every `git push` triggers a new deployment.

### Step 5: Update Google OAuth (if using)
In Google Cloud Console → Your OAuth app → Authorized redirect URIs, add:
```
https://your-project.vercel.app/api/auth/callback/google
```

### Step 6: Seed production database
After deploying, run the seed script locally pointing to your production MongoDB:
```bash
MONGODB_URI="your-production-mongodb-uri" node scripts/seed.js
```

---

## 🎨 Design System

- **Primary colour**: Farm Green `#2D6A4F`
- **Accent colour**: Warm Amber `#E9C46A`
- **Font**: Playfair Display (headings) + Inter (body)
- **Dark mode**: Supported via Tailwind's `dark:` variant
- **Mobile-first**: Responsive at all breakpoints
- **Animations**: Framer Motion + CSS transitions

---

## 🧪 Key Technical Decisions

### Why MongoDB over SQL?
Product data (photos array, certifications array, nested delivery addresses) fits naturally into MongoDB's document model. No rigid schema needed for variable product attributes.

### Why Zustand over Redux?
Lightweight, no boilerplate, built-in `persist` middleware for cart persistence in localStorage — perfect for a shopping cart.

### Why mock data instead of live API calls everywhere?
Ensures every page loads fully functional on first visit without requiring a populated database. Real API routes are also implemented for full-stack functionality.

### Blockchain simulation approach
Rather than integrating a real blockchain (expensive, complex), we simulate it by generating deterministic `0x...` hashes for products and orders, displaying them in a "blockchain explorer" style UI. The concept is fully demonstrable and production-ready for integration with Ethereum/Polygon.

---

## 📱 Mobile Experience

The app is fully responsive with:
- Mobile-optimized navigation with hamburger menu
- Touch-friendly product cards
- Large tap targets on all interactive elements
- Optimized images with Next.js `<Image />`

---

## 🌍 Internationalization

All string labels are structured for i18n-readiness:
- English (default)
- Hindi (हिन्दी) — ready for integration
- Telugu (తెలుగు) — ready for integration

Language selector in the Navbar switches the `language` preference in the Zustand store.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this project for educational and commercial purposes.

---

## 🙏 Acknowledgements

- [Unsplash](https://unsplash.com) — Farm and produce photography
- [Lucide](https://lucide.dev) — Clean, consistent icon set
- [Recharts](https://recharts.org) — Beautiful composable charts
- [date-fns](https://date-fns.org) — Lightweight date utilities
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework

---

<div align="center">
  Made with 💚 for Indian farmers
  <br />
  <strong>FarmConnect — Fresh. Fair. Traceable.</strong>
</div>
"# FarmConnect" 
