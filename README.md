# ShopTest - Pet Food E-Commerce Store

A production-quality e-commerce application built with Next.js 14, designed to test Max Pay MCP payment integration in a real-world scenario.

## Features

- 🛍️ Product catalog with 10 premium pet food products
- 🛒 Shopping cart with local storage persistence
- 💳 Checkout flow with Max Pay MCP payment integration
- 📋 Order history and tracking
- 🎨 Shopify-style responsive design
- 📱 Mobile-friendly interface
- 🔒 Session-based cart management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: CSS Modules with responsive design
- **Storage**: Vercel Blob for order persistence, with local JSON fallback
- **Payment**: Hosted-payment-ready checkout for Max Pay MCP testing
- **Deployment**: Vercel

## Project Structure

```
ShopTest/
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── product/       # Product detail page
│   ├── cart.tsx       # Shopping cart
│   ├── checkout.tsx   # Payment & checkout
│   ├── orders.tsx     # Order history
│   ├── index.tsx      # Product listing
│   └── _app.tsx       # App wrapper
├── lib/               # Utilities
│   ├── db.ts         # JSON file operations
│   └── cart.ts       # Cart state management
├── styles/            # CSS Modules
│   ├── Home.module.css
│   ├── Product.module.css
│   ├── Cart.module.css
│   ├── Checkout.module.css
│   ├── Orders.module.css
│   └── globals.css
├── data/              # Data files
│   ├── products.json  # Product catalog
│   └── orders.json    # Order records
└── next.config.js     # Next.js configuration
```

## Products

The store includes 10 curated pet food products:

1. Premium Dog Food - Chicken & Rice (₪45.99)
2. Organic Kitten Formula (₪38.50)
3. Joint Support Supplements (₪32.99)
4. Natural Dog Treats - Beef (₪12.99)
5. Fish Oil Omega-3 Supplement (₪28.50)
6. Grain-Free Cat Food - Salmon (₪42.00)
7. Dental Chews for Dogs (₪15.99)
8. Senior Dog Food - Lamb & Rice (₪49.99)
9. Probiotic Digestive Supplement (₪24.99)
10. Interactive Treat Puzzle Toy (₪19.99)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Local Demo Database

ShopTest uses the smallest possible storage layer for testing checkout and payment integrations:

- Products are loaded from `data/products.json`.
- Orders are read from `data/orders.json` locally.
- When `BLOB_READ_WRITE_TOKEN` exists, order writes are stored in Vercel Blob at:

```text
shoptest-db/orders.json
```

Optional prefix override:

```env
SHOPTEST_DB_PREFIX=shoptest-db
```

This keeps local development simple while letting Vercel deployments persist demo orders outside the serverless filesystem.

## Max Pay MCP Integration

The checkout flow is prepared for a hosted payment provider such as Max Pay MCP:

- **Endpoint**: `/api/checkout`
- **Payment state**: Orders are created as `pending_payment`
- **Sandbox Mode**: Intended for test terminals only
- **Card data**: Not collected by ShopTest

## Deployment

### Deploy to Vercel

```bash
# Login to Vercel CLI
vercel login

# Deploy
vercel
```

The app automatically deploys when pushed to GitHub.

## Testing the Payment Flow

1. Add products to cart
2. Go to checkout
3. Fill in customer and shipping details
4. Create an order
5. View the pending order in Order History or `/admin/orders`

## Notes

- Cart data persists in browser localStorage
- Orders use Vercel Blob when `BLOB_READ_WRITE_TOKEN` is configured
- Without Vercel Blob, local JSON files are used as a development fallback
- Do not commit real payment credentials, card data, or production terminal secrets

## Author

Built to test Max Pay MCP installation and functionality in a real e-commerce context.
