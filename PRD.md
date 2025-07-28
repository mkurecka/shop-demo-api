# Shop Demo API - Product Requirements Document

## 🎯 **Cíl projektu**
Vytvořit jednoduchý e-shop API v Cloudflare Workers pro testování AI chatbota. API bude simulovat reálný e-shop s produkty, objednávkami a uživateli.

## 📋 **Funkční požadavky**

### **1. Produkty**
- CRUD operace pro produkty
- Kategorie produktů
- Skladové zásoby
- Vyhledávání podle názvu/kategorie
- Ceny a popisy v češtině

### **2. Uživatelé/Zákazníci**
- Registrace zákazníků
- Autentifikace (optional pro demo)
- Profily s kontaktními údaji

### **3. Objednávky**
- Vytvoření objednávky
- Sledování stavu objednávky
- Historie objednávek
- Bezpečné ověření přístupu (email + telefon)

### **4. API Endpointy**
- RESTful API design
- JSON responses
- Error handling
- CORS podpora

## 🗄️ **Datový model**

### **Products**
```typescript
interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  image_url?: string
  created_at: string
  updated_at: string
}
```

### **Customers**
```typescript
interface Customer {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  postal_code: string
  created_at: string
}
```

### **Orders**
```typescript
interface Order {
  id: number
  order_number: string
  customer_id: number
  customer_email: string
  customer_phone: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  shipping_address: string
  tracking_number?: string
  estimated_delivery?: string
  created_at: string
  updated_at: string
}

interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  price: number
}
```

## 🚀 **API Endpointy**

### **Products API**
- `GET /api/products` - Seznam všech produktů
- `GET /api/products/:id` - Detail produktu
- `GET /api/products/search?q=query&category=cat` - Vyhledávání
- `POST /api/products` - Vytvoření produktu (admin)
- `PUT /api/products/:id` - Aktualizace produktu (admin)
- `DELETE /api/products/:id` - Smazání produktu (admin)

### **Orders API**
- `GET /api/orders/:orderNumber` - Detail objednávky (s ověřením)
- `POST /api/orders` - Vytvoření objednávky
- `PUT /api/orders/:orderNumber/status` - Aktualizace stavu (admin)

### **Customers API**
- `POST /api/customers` - Registrace zákazníka
- `GET /api/customers/:id` - Profil zákazníka

## 🛠️ **Technické požadavky**

### **Stack**
- **Runtime:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **Framework:** Hono.js (lightweight)
- **TypeScript:** Pro type safety
- **Deployment:** Wrangler CLI

### **Database Schema**
```sql
-- Products table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  customer_id INTEGER,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  total REAL NOT NULL,
  shipping_address TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);

-- Order items table
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);
```

## 📊 **Demo data**

### **Produkty**
- 20-30 produktů v různých kategoriích
- Elektronika, oblečení, domácnost
- České názvy a popisy
- Realistické ceny v CZK

### **Zákazníci**
- 5-10 demo zákazníků
- České jména a adresy
- Validní telefony a emaily

### **Objednávky**
- 10-15 demo objednávek
- Různé stavy (pending, shipped, delivered)
- Propojené s reálnými zákazníky

## 🔒 **Bezpečnost**

### **Order Verification**
- Přístup k objednávce pouze s kombinací:
  - Email zákazníka
  - Číslo objednávky  
  - Telefonní číslo
- Logování přístupů
- Sanitizace vstupů

### **Rate Limiting**
- Max 100 requests/min per IP
- Cloudflare built-in protection

## 🎨 **Response formáty**

### **Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Produkt nebyl nalezen"
  }
}
```

## 📈 **Performance požadavky**
- Response time < 200ms pro většinu endpointů
- Podpora 1000+ concurrent requests
- Edge caching pro statická data

## 🚀 **Deployment**
- Automatický deployment přes GitHub Actions
- Environment variables pro DB connection
- CORS nastavení pro chatbot integration

## 📋 **Milestones**

### **Phase 1: Core API** (Den 1)
- [ ] Project setup (Hono + D1)
- [ ] Database schema a migrace
- [ ] Products CRUD API
- [ ] Demo data seeding

### **Phase 2: Orders & Customers** (Den 2)  
- [ ] Orders API s ověřením
- [ ] Customers API
- [ ] Error handling
- [ ] Security measures

### **Phase 3: Integration** (Den 3)
- [ ] N8N chatbot integration
- [ ] Testing s reálnými dotazy
- [ ] Performance optimizations
- [ ] Documentation

## 🔧 **Development Setup**
```bash
npm create cloudflare@latest shop-demo
cd shop-demo
npm install hono
npx wrangler d1 create shop-demo-db
```

## 📖 **API Documentation**
- OpenAPI/Swagger spec
- Postman collection
- cURL examples pro testování

---

## 💡 **Poznámky**
- Projekt je demo/testing účely - ne produkční security
- Focus na rychlost vývoje nad komplexitou
- Optimalizováno pro N8N chatbot integraci
- České lokalizace pro realistické testování