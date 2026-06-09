# SmartCart – E-Commerce Application

> A full-stack MERN e-commerce application with smart discount rules, built as a final internship assignment.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env if needed (default: mongodb://localhost:27017/smartcart)
npm run seed         # Seed 12 products + test user
npm run dev          # Start on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev          # Start on http://localhost:5173
```

### Test Account
- **Email:** test@smartcart.com
- **Password:** password123

---

## 🎯 Features Implemented

### Core Features
- ✅ **Product Listing Page** – Grid view with product image, name, price, stock, Add to Cart button
- ✅ **Out of stock** – Products with 0 stock show "Unavailable" badge, cannot be added to cart
- ✅ **Cart Page** – Full cart management with quantity controls (1–10), remove item, totals
- ✅ **Bulk Purchase Badge** – "⚡ Bulk Purchase" badge appears when qty ≥ 5
- ✅ **10% off badge** – Green "10% off applied" badge when qty ≥ 3
- ✅ **Checkout Page** – Full discount breakdown: Product Discount, Cart Discount, Final Amount

### Discount Rules
| Rule | Condition | Discount |
|------|-----------|----------|
| Rule 1 | 3+ units of same product | 10% off that product's subtotal |
| Rule 2 | Cart total > ₹5,000 | 5% off final amount |
| Bonus (Option B) | Always | Cheapest item 50% off |

All discounts are clearly displayed on Checkout page.

### Bonus Features
- ✅ **Search Products** – Debounced search with 400ms delay
- ✅ **Product Filtering** – Filter by category
- ✅ **Sort Products** – Sort by price (asc/desc) and rating
- ✅ **Persistent Cart** – Cart saved to localStorage
- ✅ **Toast Notifications** – Success/error feedback throughout
- ✅ **Auth System** – Register/Login/Logout with JWT
- ✅ **Guest Checkout** – Orders without login supported

### Technical Requirements
- ✅ **React Router** – `/products`, `/cart`, `/checkout` separate routes
- ✅ **Lazy Loading** – `CartPage` and `CheckoutPage` lazy loaded with Suspense
- ✅ **State Management** – Context API (`CartContext` + `AuthContext`)
- ✅ **Reusable Components** – `ProductCard`, `CartItem`, `Navbar`, `Footer`, `Loader`

---

## 🏗 Project Structure

```
smartcart/
├── backend/
│   ├── controllers/      # Business logic
│   │   ├── productController.js
│   │   ├── authController.js
│   │   └── orderController.js  ← Discount rules here
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── middleware/        # JWT auth middleware
│   ├── data/seeder.js    # Seed script
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── common/   # Navbar, Footer, Loader
        │   ├── product/  # ProductCard
        │   └── cart/     # CartItem
        ├── context/      # CartContext, AuthContext
        ├── pages/        # ProductsPage, CartPage, CheckoutPage, etc.
        └── utils/        # api.js, discounts.js
```

---

## 💡 Assumptions Made

1. Currency is Indian Rupees (₹); using `en-IN` locale for formatting.
2. Cheapest item 50% discount (Bonus Rule B) applies to cheapest product in the cart (by unit price).
3. Stock is deducted when order is placed (not reserved).
4. Maximum 10 units per product per cart.
5. Cart persists in `localStorage` across sessions.
6. Users can checkout as guests without registering.
7. Free delivery on all orders.

---

## ⚠️ Known Issues

1. No payment gateway integration (COD assumed).
2. No admin panel to manage products/orders.
3. No image upload (uses Unsplash URLs).

---

## 🔮 Future Improvements

- Add Stripe/Razorpay payment integration
- Admin dashboard for product & order management
- Product reviews and ratings system
- Wishlist feature
- Order tracking with status updates
- Email confirmation on order placement
- Dark mode toggle
- Pagination or infinite scroll for products
- Product detail page with image gallery

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Context API, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Styling | Vanilla CSS with CSS variables |
| Notifications | react-hot-toast |

---

**Deadline:** 09/06/2026 ✅
