# Shuffling Smiles | Memories, Printed.

A pixel-accurate, fully functional frontend replica of the **Shuffling Smiles** custom wedding favor and stationery store design system from Google Stitch. 

The application is built with **React**, **TypeScript**, and **Tailwind CSS**, compiled with **Vite** and configured for a completely responsive desktop, tablet, and mobile experience.

---

## 🎨 Creative North Star & Brand Aesthetic

This frontend replica is styled on the **Modern Heritage** design system, combining the opulent warmth of traditional Indian wedding stationery with the clean lines of modern minimalism.

*   **Primary Accent (Deep Burgundy)**: `#4e0816` - Used for actions, luxury elements, and headings.
*   **Secondary Accent (Muted Gold)**: `#755b00` - Used for highlight details, star ratings, and CTA flourishes.
*   **Neutral Base (Cream)**: `#fff8f5` - Warm stationery-like background that is easy on the eyes.
*   **Neutral Text (Charcoal)**: `#1e1b18` - Dark, legible text replacing harsh pure blacks.
*   **Typography**: *Playfair Display* for Artsy headlines & *Inter* for functional UI elements.
*   **Tactility**: Uses Diffused drop shadows and shifted tonal layers instead of heavy 1px borders to mimic paper layers sitting on a desk.

---

## 🚀 Simulated Interactive Features

This application implements a complete e-commerce checkout loop with no backend dependencies:

1.  **Reactive Navigation**: A central state router navigates seamlessly across all pages without layout refresh.
2.  **Catalog Sorting & Filtering**: The **Shop All** collection page allows sorting (Featured, New, Price) and filtering (Collections checkbox categories, Aesthetics chips) in real-time, plus interactive wishlist favorites that persist inside `localStorage`.
3.  **Dynamic Customizer & Price Calculator**: The **Product Detail** page allows users to enter custom typography or monogram details, adjust order sets of 50, and watch checkout price totals calculate instantly on the button.
4.  **Persistent Shopping Bag**: The **Cart** page allows line-item adjustments (+/- quantity increments, product removals), displaying crossed-out original prices and computed subtotals.
5.  **Checkout & Order Confirmation**: Users can checkout via the Checkout Form modal. Submitting an order generates a unique Order ID, logs a timestamp, and routes to the **Order Confirmation** invoice.
6.  **Admin Panel Sync**: Placing an order dynamically updates the **Admin Dashboard**! Placed orders append to the top of the management table under `#SS-xxxxxxx` with processing status badges. The admin orders table also features real-time search filtering.

---

## 📂 Project Structure

```
shuffling-smiles/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── components/         # Reusable structural components
│   │   ├── Navbar.tsx      # Responsive header, bag badge, search modal
│   │   └── Footer.tsx      # Standard footer navigation links
│   ├── context/
│   │   └── AppContext.tsx  # Cart, placed orders database, and page routing state
│   ├── mock/
│   │   └── mockData.ts     # Products catalog, review statements, initial order logs
│   ├── pages/              # Reconstructed Stitch mock screen views
│   │   ├── Homepage.tsx    # Hero cover, collections preview, testimonials grid
│   │   ├── ShopPage.tsx    # Sidebar tag filters, sorted catalog list
│   │   ├── ProductDetailPage.tsx # Custom notes textareas, quantity adjusters
│   │   ├── CartPage.tsx    # Cart lists, checkout modal forms
│   │   ├── OrderConfirmedPage.tsx # Success invoice and delivery logs
│   │   └── AdminDashboardPage.tsx # Management sidebar, active order statuses
│   ├── App.tsx             # Main view selector routing page layouts
│   ├── index.css           # Tailwind v4 imports and custom scrollbar/shadows
│   └── main.tsx            # DOM root mounting script
├── tailwind.config.js      # Custom theme color codes and font weights
├── postcss.config.js       # PostCSS Tailwind CSS v4 processor setup
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build plugin definitions
```

---

## 🛠️ Local Development Setup

To compile and launch the project on your local machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### 1. Install Dependencies
Navigate to the root project folder and install required packages:
```bash
npm install
```

### 2. Run Development Server
Start the local server with hot module replacement:
```bash
npm run dev
```
Once started, open your web browser and navigate to the address shown (usually [http://localhost:5173](http://localhost:5173)).

### 3. Build for Production
To bundle the application for production deployment, run:
```bash
npm run build
```
This generates optimized static files inside the `dist/` directory.
