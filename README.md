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
npx wrangler d1 migrations apply shop-demo-db --local
```

### 4. Seed demo data
```bash
npx wrangler d1 execute shop-demo-db --local --file=./migrations/seed.sql
```

### 5. Start development server
```bash
npm run dev
```

The API will be available at `http://localhost:8787`

## 📋 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/search?q=query&category=cat` - Search products
- `GET /api/products/:id` - Product details
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

## ✨ Key Features

### 🎭 User Simulation System
- **No authentication required** - Choose from existing customers
- **Fake session tokens** - `fake_session_for_[email]` for testing
- **Context switching** - Chat as different users instantly
- **Homepage chat** - Anonymous user experience

### 🤖 Advanced Chatbot Integration
- **n8n webhook support** - Real chatbot responses
- **Context awareness** - Logged vs anonymous users
- **Session tracking** - Complete conversation history
- **Multiple response formats** - Flexible webhook parsing

### 📊 Comprehensive Admin Interface
- **Product management** - Add, edit, view products
- **Order tracking** - Filter by email, phone, order number
- **Customer overview** - Complete customer database
- **Chat analytics** - Session statistics and costs

## 🧪 Testing

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
- iPhone 15 Pro (35,999 CZK)
- Samsung Galaxy S24 (29,999 CZK)
- MacBook Air M3 (42,999 CZK)
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

```bash
npm run deploy
```

Your API will be available at `https://your-api.example.com`

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

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## 🛠️ Development

- **Framework:** Hono.js (lightweight, fast)
- **Database:** Cloudflare D1 (SQLite-based)
- **TypeScript:** Full type safety
- **CORS:** Enabled for chatbot integration

## 📝 Notes

- This is a demo API for testing purposes
- Contains realistic Czech product data
- Optimized for AI chatbot integration
- No authentication required for demo purposes