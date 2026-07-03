# LUXE Jewellery Store 💎

A production-ready, frontend-only Women's Luxury Jewellery e-commerce website built with **React + Vite**.

## Features

- 🏠 **Home** — Cinematic hero, editorial category grid, filtered product grid, testimonials, newsletter
- 🛍️ **Shop** — Filter sidebar (category + price), sort options, pagination
- 💍 **Product Detail** — Image gallery with zoom, size selector, add to cart/wishlist, related products
- 🛒 **Cart** — Item management, quantity control, coupon codes (LUXE10, BRIDE20, FIRST15), order summary
- ❤️ **Wishlist** — Persisted across sessions via localStorage
- 💳 **Checkout** — 3-step flow (Address → Payment → Confirm), order success screen
- 👤 **Login/Register** — Split-screen auth layout
- 🙍 **Profile** — Orders, address, account settings

## Tech Stack

- **React 18** + **Vite 5**
- **React Router v6**
- **Lucide React** icons
- **CSS Custom Properties** design system (no Tailwind, no component libraries)
- **LocalStorage** for cart + wishlist persistence

## Design System

| Token | Value |
|---|---|
| Obsidian | `#0A0A0A` |
| Ivory | `#F8F4EE` |
| Gold | `#C9A84C` |
| Champagne | `#E8D5C4` |
| Display Font | Cormorant Garamond |
| Body Font | Inter |

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Coupon Codes

| Code | Discount |
|---|---|
| `LUXE10` | 10% off |
| `BRIDE20` | 20% off |
| `FIRST15` | 15% off |

## Folder Structure

```
src/
├── assets/           # Images, icons, logo
├── components/
│   ├── layout/       # Navbar, Footer, AnnouncementBar, ScrollToTop
│   ├── home/         # Hero, Categories, FeaturedProducts, Newsletter
│   ├── product/      # ProductCard, ProductGrid, ProductGallery, ProductInfo
│   ├── cart/         # CartItem, CartSummary, Coupon, EmptyCart
│   ├── common/       # Button, Input, Loader, Modal
│   └── ui/           # Badge, Rating, Breadcrumb, Pagination
├── pages/            # Home, Shop, Product, Cart, Wishlist, Checkout, Login, Profile
├── data/             # products.js (8 products, 8 categories, testimonials)
├── hooks/            # useCart (Context + Reducer), useWishlist
├── routes/           # AppRoutes.jsx
├── styles/           # globals.css (design tokens, reset, utilities)
└── utils/            # helpers.js (formatPrice, truncate)
```

## Future Enhancements

- [ ] Connect to real API / Supabase
- [ ] Authentication with JWT
- [ ] Image CDN integration
- [ ] Search with debounce
- [ ] Product reviews system
- [ ] Wishlists sharing
- [ ] WhatsApp chat widget
