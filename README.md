# 🛍️ Shop Demo API

Advanced e-commerce demo API built with Cloudflare Workers, featuring user simulation system and comprehensive chatbot integration.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Create D1 database
```bash
npx wrangler d1 create shop-demo-db
```

Copy the database ID from output and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "shop-demo-db"
database_id = "your-database-id-here"
```

### 3. Run migrations
```bash
# Apply all migrations in order
npx wrangler d1 execute shop-demo-db --local --file=./migrations/0001_initial_schema.sql
npx wrangler d1 execute shop-demo-db --local --file=./migrations/seed.sql
npx wrangler d1 execute shop-demo-db --local --file=./migrations/0002_chatbot_sessions.sql
npx wrangler d1 execute shop-demo-db --local --file=./migrations/0003_users_auth.sql
npx wrangler d1 execute shop-demo-db --local --file=./migrations/0004_fix_passwords.sql
npx wrangler d1 execute shop-demo-db --local --file=./migrations/0008_tickets_system.sql
npx wrangler d1 execute shop-demo-db --local --file=./migrations/0009_product_variants.sql
npx wrangler d1 execute shop-demo-db --local --file=./migrations/0010_variant_sample_data.sql
```

### 5. Start development server
```bash
npm run dev
```

The API will be available at `http://localhost:8787`

## 📋 API Endpoints

### Products
- `GET /api/products` - List all products with advanced filtering
- `GET /api/products?q=search&category=cat&color=red&size=L&min_price=100&max_price=500&in_stock=true&sort_by=price&sort_order=ASC&limit=12&offset=0` - Advanced product filtering
- `GET /api/products/filters` - Get available filter options (categories, price ranges, attribute values)
- `GET /api/products/search?q=query&category=cat` - Search products (legacy endpoint)
- `GET /api/products/:id` - Product details
- `GET /api/products/:id?variants=true` - Product details with variants
- `GET /api/products/:id/variants` - List all variants for a product
- `GET /api/products/:id/variants/:variantId` - Specific variant details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Orders
- `GET /api/orders` - List all orders (supports filtering)
- `GET /api/orders?email=x` - Filter orders by email
- `GET /api/orders?orderNumber=x` - Filter by order number
- `GET /api/orders?phone=x` - Filter by phone
- `GET /api/orders?email=x&orderNumber=y` - Combine filters
- `GET /api/orders/:orderNumber?email=x&phone=y` - Order details (with verification)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:orderNumber/status` - Update order status (admin)

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Register customer
- `GET /api/customers/:id` - Customer profile
- `PUT /api/customers/:id` - Update customer profile

### Chatbot
- `POST /api/chatbot/webhook` - Send message to chatbot (supports user simulation)
- `GET /api/chatbot/sessions` - List chat sessions
- `GET /api/chatbot/sessions/:sessionId` - Session details
- `GET /api/chatbot/sessions/:sessionId/history` - Chat history
- `POST /api/chatbot/sessions` - Create new session
- `POST /api/chatbot/sessions/:sessionId/messages` - Add message to session
- `GET /api/chatbot/analytics` - Chat analytics

### Authentication (for user simulation)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Current user info

### Store Information
- `GET /api/info` - Complete store information (delivery, payment, returns, etc.)
- `GET /api/info/delivery` - Delivery methods and pricing
- `GET /api/info/payment` - Payment methods and security
- `GET /api/info/returns` - Return policies and warranty information
- `GET /api/info/contact` - Contact and customer service information
- `GET /api/info/legal` - Legal and privacy information
- `GET /api/info/company` - Company details and business information

### Categories
- `GET /api/categories` - List all categories with product counts
- `GET /api/categories/:categoryId` - Category details with products (supports pagination & sorting)
- `GET /api/categories/:categoryId/stats` - Category statistics (price ranges, stock levels)
- `GET /api/categories/search?q=query` - Search categories by name or keywords

## ✨ Key Features

### 🔍 Advanced Product Filtering System
- **URL-based filters** - All filters accessible via URL parameters for sharing
- **Multi-attribute filtering** - Color, size, memory, material, price range
- **Real-time filtering** - Instant results without page reload
- **Shareable URLs** - Bookmark and share filtered product views
- **Visual color swatches** - Interactive color selection with hex values
- **Price range sliders** - Min/max price filtering
- **Stock availability** - Filter for in-stock items only
- **Advanced sorting** - By price, name, date, category

### 🎭 User Simulation System
- **No authentication required** - Choose from existing customers
- **Fake session tokens** - `fake_session_for_[email]` for testing
- **Context switching** - Chat as different users instantly
- **Homepage chat** - Anonymous user experience

### 🛍️ Product Variant System
- **Flexible attributes** - Size, color, memory, storage, etc.
- **Price variations** - Per-variant price adjustments
- **Stock management** - Individual stock tracking per variant
- **Visual variants** - Color swatches with hex codes
- **SKU support** - Optional SKU for each variant

### 🔗 Complete Product Navigation
- **Product detail pages** - Full product information with variant selection
- **Interactive variant picker** - Visual selection of colors, sizes, memory
- **Real-time price updates** - Pricing changes based on selected variants
- **Stock level indicators** - Visual stock status (In Stock, Low Stock, Out of Stock)
- **Breadcrumb navigation** - Easy navigation between pages
- **Mobile-responsive design** - Optimized for all device sizes

### 🤖 Advanced Chatbot Integration
- **n8n webhook support** - Real chatbot responses
- **Context awareness** - Logged vs anonymous users
- **Session tracking** - Complete conversation history
- **Multiple response formats** - Flexible webhook parsing

### 🎨 Unified Admin Interface
- **Consistent layout** - All admin pages use unified design system
- **Professional styling** - Modern, responsive design across all pages
- **Interactive filtering** - Advanced search and filter capabilities
- **Dashboard analytics** - Comprehensive overview with real-time data
- **Mobile-first design** - Fully responsive on all devices

### 📊 Comprehensive Data Management
- **Product management** - Add, edit, view products with variants
- **Order tracking** - Filter by email, phone, order number with advanced search
- **Customer overview** - Complete customer database with search functionality
- **Chat analytics** - Session statistics and detailed conversation tracking

## 🧪 Testing

### Test advanced product filtering:
```bash
# Get all products with filters
curl "http://localhost:8787/api/products?color=red&size=L&min_price=100&max_price=1000&in_stock=true"

# Get available filter options
curl "http://localhost:8787/api/products/filters"

# Search with multiple filters and sorting
curl "http://localhost:8787/api/products?q=phone&category=elektronika&color=black&sort_by=price&sort_order=ASC"

# Filter by price range and memory
curl "http://localhost:8787/api/products?min_price=500&max_price=2000&memory=128GB"
```

### Test product variants:
```bash
# Get product with variants
curl "http://localhost:8787/api/products/1?variants=true"

# Get specific variant details
curl "http://localhost:8787/api/products/9/variants/10"

# Get all variants for a product
curl "http://localhost:8787/api/products/1/variants"
```

### Test store information:
```bash
# Get complete store info
curl "http://localhost:8787/api/info"

# Get delivery methods and pricing
curl "http://localhost:8787/api/info/delivery"

# Get payment methods
curl "http://localhost:8787/api/info/payment"

# Get return policies
curl "http://localhost:8787/api/info/returns"
```

### Test categories:
```bash
# Get all categories with product counts
curl "http://localhost:8787/api/categories"

# Get electronics category with products
curl "http://localhost:8787/api/categories/elektronika"

# Get category with sorting and pagination
curl "http://localhost:8787/api/categories/obleceni?sort=price&order=ASC&limit=10"

# Search categories
curl "http://localhost:8787/api/categories/search?q=elektronika"

# Get category statistics
curl "http://localhost:8787/api/categories/sport/stats"
```

### Test order filtering:
```bash
curl "http://localhost:8787/api/orders?email=jan.novak@email.cz"
curl "http://localhost:8787/api/orders?orderNumber=ORD-2024010001"
curl "http://localhost:8787/api/orders?email=jan.novak@email.cz&phone=+420776123456"
```

### Test user simulation:
```bash
curl -X POST "http://localhost:8787/api/chatbot/webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake_session_for_jan.novak@email.cz" \
  -d '{"message": "Potřebuji pomoc s mojí objednávkou"}'
```

### Test anonymous chat:
```bash
curl -X POST "http://localhost:8787/api/chatbot/webhook" \
  -H "Content-Type: application/json" \
  -d '{"message": "Jaké jsou vaše nejprodávanější produkty?"}'
```

### Create new order:
```bash
curl -X POST "http://localhost:8787/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "test@example.com",
    "customer_phone": "+420123456789",
    "items": [
      {"product_id": 1, "quantity": 1}
    ],
    "shipping_address": "Test address 123"
  }'
```

## 🎯 Demo Data

### Sample Products
- **iPhone 15 Pro** (35,999 CZK) - 3 memory variants: 128GB, 256GB (+4,000), 512GB (+8,000)
- **T-shirt Basic** (599 CZK) - 9 variants: S/M/L × Black/White/Red (+50 for red)
- **MacBook Air M3** (42,999 CZK) - 3 storage variants: 256GB, 512GB (+6,000), 1TB (+12,000)
- Samsung Galaxy S24 (29,999 CZK)
- Various clothing, household items, and sports equipment

### Sample Orders
- Order numbers: ORD-2024010001 to ORD-2024010010
- Different statuses: pending, processing, shipped, delivered, cancelled
- Associated with demo customers

### Sample Customers
- jan.novak@email.cz / +420776123456
- marie.svoboda@email.cz / +420605987654
- petr.dvorak@email.cz / +420724567890
- And more...

## 🔒 Security Features

### Order Verification
- Requires email + phone number to access order details
- Input sanitization to prevent XSS/injection attacks
- Access logging for audit purposes

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- No sensitive data leakage

## 🚀 Deployment

### Production Deployment
```bash
# Apply migrations to remote database
npx wrangler d1 execute shop-demo-db --remote --file=./migrations/0009_product_variants.sql
npx wrangler d1 execute shop-demo-db --remote --file=./migrations/0010_variant_sample_data.sql

# Deploy to Cloudflare Workers
npm run deploy
```

Your API will be available at `https://your-api.example.com`

### Live Demo
The API is currently deployed at: **https://shop-demo-api.kureckamichal.workers.dev**

Try these endpoints:
- Product with variants: `https://shop-demo-api.kureckamichal.workers.dev/api/products/1?variants=true`
- Store information: `https://shop-demo-api.kureckamichal.workers.dev/api/info`
- Categories: `https://shop-demo-api.kureckamichal.workers.dev/api/categories`
- Electronics category: `https://shop-demo-api.kureckamichal.workers.dev/api/categories/elektronika`

Frontend pages:
- **Products with filtering**: `https://shop-demo-api.kureckamichal.workers.dev/products`
- **Advanced filters**: `https://shop-demo-api.kureckamichal.workers.dev/products?color=red&size=L&min_price=500&max_price=2000`
- **Product detail page**: `https://shop-demo-api.kureckamichal.workers.dev/products/9`
- **Categories page**: `https://shop-demo-api.kureckamichal.workers.dev/categories`
- **Electronics category**: `https://shop-demo-api.kureckamichal.workers.dev/categories/elektronika`
- **Dashboard**: `https://shop-demo-api.kureckamichal.workers.dev/dashboard`
- **Orders management**: `https://shop-demo-api.kureckamichal.workers.dev/orders`
- **Customers overview**: `https://shop-demo-api.kureckamichal.workers.dev/customers`
- **Chat sessions**: `https://shop-demo-api.kureckamichal.workers.dev/chats`
- **Info page**: `https://shop-demo-api.kureckamichal.workers.dev/info`

## 🔧 N8N Integration

Update your N8N chatbot workflow to use this API:

1. **Product Search Tool URL:**
   ```
   https://your-api.example.com/api/products/search?q={query}&limit=5
   ```

2. **Order Verification in Code Tool:**
   ```javascript
   const response = await $http.request({
     method: 'GET',
     url: `https://your-api.example.com/api/orders/${orderNumber}?email=${email}&phone=${phone}`
   });
   ```

## 📊 API Response Examples

### Product with Variants
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "price": 35999,
    "variants": [
      {
        "id": 1,
        "sku": "IPHONE15PRO-128GB-BLACK",
        "price_adjustment": 0,
        "stock": 5,
        "is_default": true,
        "attributes": [
          {
            "attribute_name": "memory",
            "attribute_display_name": "Paměť",
            "value": "128GB",
            "display_value": "128 GB"
          }
        ]
      }
    ],
    "available_attributes": {
      "memory": [
        {
          "id": 14,
          "value": "128GB",
          "display_value": "128 GB",
          "sort_order": 2
        },
        {
          "id": 15,
          "value": "256GB",
          "display_value": "256 GB",
          "sort_order": 3
        }
      ]
    }
  }
}
```

### Specific Variant Details
```json
{
  "success": true,
  "data": {
    "id": 10,
    "product_id": 9,
    "product_name": "Pánské tričko Basic",
    "sku": "TRICKO-BASIC-S-RED",
    "price_adjustment": 50,
    "final_price": 649,
    "stock": 8,
    "attributes": [
      {
        "attribute_name": "size",
        "attribute_display_name": "Velikost",
        "value": "S",
        "display_value": "S"
      },
      {
        "attribute_name": "color",
        "attribute_display_name": "Barva",
        "value": "red",
        "display_value": "Červená",
        "hex_color": "#FF0000"
      }
    ]
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VARIANT_NOT_FOUND",
    "message": "Varianta nebyla nalezena"
  }
}
```

## 🗄️ Database Schema

### Product Variants Structure
- **`product_attributes`** - Defines attribute types (size, color, memory, etc.)
- **`product_attribute_values`** - Possible values for each attribute with display names and hex colors
- **`product_variants`** - Specific product variants with SKU, price adjustments, and stock
- **`product_variant_attributes`** - Links variants to their attribute values
- **`order_items`** - Updated to support variant_id for specific variant orders

### Key Features
- **Flexible schema** supports any attribute type
- **Hex color support** for visual color swatches
- **Price adjustments** can be positive or negative
- **Individual stock tracking** per variant
- **Default variant** designation for initial selection

## 🆕 Latest Updates (v2.0)

### 🔍 Advanced Product Filtering System
- **Complete filtering overhaul** - All filters now accessible via URL parameters
- **Shareable filter URLs** - Users can bookmark and share specific filtered views
- **Real-time filtering** - Instant updates without page reloads
- **Advanced filter UI** - Toggle between basic and advanced filter options
- **Visual attribute selection** - Color swatches, size badges, memory options
- **Price range filtering** - Min/max price inputs with dynamic validation

### 🔗 Product Detail Pages
- **Complete product detail implementation** - Fixed navigation from product list to detail pages
- **Interactive variant selection** - Visual color swatches, size options, memory configurations
- **Real-time price updates** - Pricing changes based on selected variant attributes
- **Stock level indicators** - Visual status for stock availability
- **Breadcrumb navigation** - Intuitive navigation structure
- **Mobile-responsive design** - Optimized for all screen sizes

### 🎨 Unified Admin Interface
- **Layout consistency** - All admin pages now use the same unified design system
- **Professional styling** - Modern, cohesive design across orders, customers, chats, and dashboard
- **Enhanced navigation** - Consistent sidebar navigation and page headers
- **Responsive design** - Mobile-first approach for all admin pages
- **Interactive components** - Improved loading states, filters, and data display

### 📊 Enhanced API Capabilities
- **Filter options endpoint** - `/api/products/filters` provides all available filter options
- **Advanced product queries** - Support for complex filtering with multiple attributes
- **Pagination support** - Built-in pagination with total count and has_more indicators
- **Performance optimization** - Efficient SQL queries with proper indexing

## 🛠️ Development

- **Framework:** Hono.js (lightweight, fast)
- **Database:** Cloudflare D1 (SQLite-based)
- **TypeScript:** Full type safety
- **CORS:** Enabled for chatbot integration
- **Frontend:** Vanilla JavaScript with modern ES6+ features
- **Styling:** Custom CSS with responsive design principles

## 📝 Notes

- This is a demo API for testing purposes
- Contains realistic Czech product data
- Optimized for AI chatbot integration
- No authentication required for demo purposes
- All new features are fully deployed and functional