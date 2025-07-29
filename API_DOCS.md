# 📚 Shop Demo API Documentation

## Product Variants API

### Overview
The Shop Demo API now supports a comprehensive product variant system that allows products to have multiple variations based on attributes like size, color, memory, storage, etc.

## Endpoints

### 1. Get Product with Variants
**GET** `/api/products/:id?variants=true`

Returns product details including all variants and available attributes.

#### Parameters
- `id` (path) - Product ID
- `variants` (query) - Set to `true` to include variant data

#### Response Example
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "Pánské tričko Basic",
    "description": "Bavlněné tričko v základních barvách",
    "price": 599,
    "category": "obleceni",
    "stock": 50,
    "image_url": "https://example.com/tricko-basic.jpg",
    "variants": [
      {
        "id": 4,
        "product_id": 9,
        "sku": "TRICKO-BASIC-S-BLACK",
        "price_adjustment": 0,
        "stock": 15,
        "image_url": null,
        "is_default": true,
        "attributes": [
          {
            "attribute_name": "size",
            "attribute_display_name": "Velikost",
            "attribute_type": "text",
            "value": "S",
            "display_value": "S"
          },
          {
            "attribute_name": "color",
            "attribute_display_name": "Barva",
            "attribute_type": "color",
            "value": "black",
            "display_value": "Černá",
            "hex_color": "#000000"
          }
        ]
      }
    ],
    "available_attributes": {
      "size": [
        {
          "id": 2,
          "value": "S",
          "display_value": "S",
          "hex_color": null,
          "sort_order": 2
        },
        {
          "id": 3,
          "value": "M",
          "display_value": "M",
          "hex_color": null,
          "sort_order": 3
        }
      ],
      "color": [
        {
          "id": 7,
          "value": "black",
          "display_value": "Černá",
          "hex_color": "#000000",
          "sort_order": 1
        },
        {
          "id": 8,
          "value": "white",
          "display_value": "Bílá",
          "hex_color": "#FFFFFF",
          "sort_order": 2
        }
      ]
    }
  },
  "message": "Produkt úspěšně načten"
}
```

### 2. Get Product Variants
**GET** `/api/products/:id/variants`

Returns all variants for a specific product with their attributes.

#### Parameters
- `id` (path) - Product ID

#### Response Example
```json
{
  "success": true,
  "data": {
    "variants": [
      {
        "id": 1,
        "product_id": 1,
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
        }
      ]
    }
  },
  "message": "Varianty produktu úspěšně načteny"
}
```

### 3. Get Specific Variant
**GET** `/api/products/:id/variants/:variantId`

Returns detailed information about a specific product variant.

#### Parameters
- `id` (path) - Product ID
- `variantId` (path) - Variant ID

#### Response Example
```json
{
  "success": true,
  "data": {
    "id": 10,
    "product_id": 9,
    "product_name": "Pánské tričko Basic",
    "product_description": "Bavlněné tričko v základních barvách",
    "product_category": "obleceni",
    "sku": "TRICKO-BASIC-S-RED",
    "price_adjustment": 50,
    "final_price": 649,
    "stock": 8,
    "image_url": "https://example.com/tricko-basic.jpg",
    "is_default": false,
    "attributes": [
      {
        "attribute_name": "size",
        "attribute_display_name": "Velikost",
        "attribute_type": "text",
        "value": "S",
        "display_value": "S"
      },
      {
        "attribute_name": "color",
        "attribute_display_name": "Barva",
        "attribute_type": "color",
        "value": "red",
        "display_value": "Červená",
        "hex_color": "#FF0000"
      }
    ],
    "created_at": "2025-07-29 08:36:46",
    "updated_at": "2025-07-29 08:36:46"
  },
  "message": "Varianta úspěšně načtena"
}
```

## Data Models

### Product Variant
```typescript
interface ProductVariant {
  id: number;
  product_id: number;
  sku?: string;                    // Optional SKU for this variant
  price_adjustment: number;        // Price difference from base product
  stock: number;                   // Stock for this specific variant
  image_url?: string;             // Variant-specific image (optional)
  is_default: boolean;            // Is this the default variant?
  created_at: string;
  updated_at: string;
  attributes?: ProductVariantAttribute[];
}
```

### Product Variant Attribute
```typescript
interface ProductVariantAttribute {
  attribute_id: number;
  attribute_name: string;          // e.g., "size", "color", "memory"
  attribute_display_name: string;  // e.g., "Velikost", "Barva", "Paměť"
  attribute_type: string;          // "text", "color", "number"
  value_id: number;
  value: string;                   // e.g., "S", "red", "128GB"
  display_value: string;           // e.g., "S", "Červená", "128 GB"
  hex_color?: string;             // For color attributes, e.g., "#FF0000"
}
```

### Available Attributes
```typescript
interface AvailableAttributes {
  [attributeName: string]: Array<{
    id: number;
    value: string;
    display_value: string;
    hex_color?: string;
    sort_order: number;
  }>;
}
```

## Sample Products with Variants

### iPhone 15 Pro (ID: 1)
- **Base Price**: 35,999 CZK
- **Variants**: 
  - 128GB (default): +0 CZK, 5 in stock
  - 256GB: +4,000 CZK, 3 in stock  
  - 512GB: +8,000 CZK, 2 in stock

### T-shirt Basic (ID: 9)
- **Base Price**: 599 CZK
- **Variants**: 9 combinations of:
  - **Sizes**: S, M, L
  - **Colors**: Black, White, Red (+50 CZK)
- **Stock**: Varies by variant (8-25 pieces)

### MacBook Air M3 (ID: 3)
- **Base Price**: 42,999 CZK
- **Variants**:
  - 256GB (default): +0 CZK, 3 in stock
  - 512GB: +6,000 CZK, 2 in stock
  - 1TB: +12,000 CZK, 1 in stock

## Frontend Integration

The frontend automatically displays variant selection UI when variants are available:

### Color Variants
- Displayed as colored circular buttons using `hex_color` values
- Visual feedback on selection with border changes

### Size/Memory Variants
- Displayed as rectangular buttons with text labels
- Selected state shown with background color change

### Real-time Updates
- Price updates based on `price_adjustment`
- Stock levels from variant `stock` field
- Image updates if variant has `image_url`
- Add to cart button state based on stock availability

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_ID` | Invalid product or variant ID |
| `PRODUCT_NOT_FOUND` | Product does not exist |
| `VARIANT_NOT_FOUND` | Variant does not exist |
| `DATABASE_ERROR` | Internal database error |

## Testing Examples

```bash
# Test iPhone variants
curl "https://shop-demo-api.kureckamichal.workers.dev/api/products/1?variants=true"

# Test t-shirt variants with colors
curl "https://shop-demo-api.kureckamichal.workers.dev/api/products/9?variants=true"

# Get specific red S t-shirt variant
curl "https://shop-demo-api.kureckamichal.workers.dev/api/products/9/variants/10"

# Test MacBook storage variants
curl "https://shop-demo-api.kureckamichal.workers.dev/api/products/3?variants=true"
```

## Store Information API

### Overview
The Store Information API provides comprehensive details about store policies, delivery options, payment methods, return policies, and contact information. All data is hardcoded in the API (no database storage required) and returns up-to-date information for customers.

### Endpoints

#### 1. Get Complete Store Information
**GET** `/api/info`

Returns all store information including company details, delivery methods, payment options, return policies, customer service, and legal information.

#### 2. Get Delivery Information
**GET** `/api/info/delivery`

Returns delivery methods, pricing, delivery zones, and free shipping thresholds.

#### 3. Get Payment Information
**GET** `/api/info/payment`

Returns available payment methods, fees, security information, and supported currencies.

#### 4. Get Return Policies
**GET** `/api/info/returns`

Returns return period, conditions, warranty information, and return address.

#### 5. Get Contact Information
**GET** `/api/info/contact`

Returns company contact details and customer service information.

#### 6. Get Legal Information
**GET** `/api/info/legal`

Returns privacy policy links, GDPR compliance info, and legal documentation.

#### 7. Get Company Information
**GET** `/api/info/company`

Returns company details, business registration information, and contact data.

### Sample Response - Delivery Information
```json
{
  "success": true,
  "data": {
    "methods": [
      {
        "id": "czech_post",
        "name": "Česká pošta - obyčejné",
        "price": 99,
        "currency": "CZK",
        "delivery_time": "3-5 pracovních dnů",
        "description": "Standardní doručení na adresu"
      },
      {
        "id": "express",
        "name": "Expresní doručení",
        "price": 299,
        "currency": "CZK",
        "delivery_time": "Následující pracovní den",
        "description": "Rychlé doručení do 24 hodin"
      }
    ],
    "free_delivery_threshold": 1500,
    "delivery_zones": [
      {
        "name": "Czech Republic",
        "available_methods": ["czech_post", "czech_post_registered", "pickup_point", "courier", "express"]
      },
      {
        "name": "Slovakia",
        "available_methods": ["czech_post", "czech_post_registered"],
        "surcharge": 50
      }
    ]
  },
  "message": "Informace o doručení úspěšně načteny"
}
```

### Frontend Integration
- Info page available at `/info`
- Automatically loads and displays all store information
- Responsive design with organized sections
- Real-time API data loading
- Mobile-friendly interface

## Categories API

### Overview
The Categories API provides organized access to product categories with rich metadata, product filtering, pagination, and sorting capabilities. Categories include visual icons, color schemes, and descriptive information.

### Available Categories
- **📱 Elektronika** - Electronics, phones, computers, and accessories
- **👕 Oblečení** - Fashion clothing for all ages
- **🏠 Domácnost** - Household appliances and kitchen equipment
- **⚽ Sport a volný čas** - Sports equipment, fitness, and outdoor activities

### Endpoints

#### 1. Get All Categories
**GET** `/api/categories`

Returns all categories with metadata and product counts.

```json
{
  "success": true,
  "data": [
    {
      "id": "elektronika",
      "name": "Elektronika",
      "description": "Nejnovější elektronické zařízení, počítače, telefony a příslušenství",
      "icon": "📱",
      "color": "#667eea",
      "keywords": ["telefon", "počítač", "elektronika", "gadget", "tech"],
      "product_count": 8
    }
  ]
}
```

#### 2. Get Category Products
**GET** `/api/categories/:categoryId?limit=20&offset=0&sort=created_at&order=DESC`

Returns category details with paginated and sorted products.

**Parameters:**
- `limit` - Number of products per page (default: 20)
- `offset` - Pagination offset (default: 0)
- `sort` - Sort field: `created_at`, `name`, `price`, `stock`
- `order` - Sort order: `ASC` or `DESC`

#### 3. Get Category Statistics
**GET** `/api/categories/:categoryId/stats`

Returns comprehensive category statistics including price ranges and stock levels.

```json
{
  "success": true,
  "data": {
    "category": {
      "id": "elektronika",
      "name": "Elektronika",
      "icon": "📱",
      "color": "#667eea"
    },
    "statistics": {
      "total_products": 8,
      "in_stock_products": 8,
      "out_of_stock_products": 0,
      "average_price": 22374,
      "min_price": 7999,
      "max_price": 42999,
      "total_stock": 120
    }
  }
}
```

#### 4. Search Categories
**GET** `/api/categories/search?q=query`

Search categories by name, description, or keywords.

### Frontend Pages
- **Categories overview**: `/categories` - Grid view of all categories
- **Category detail**: `/categories/:categoryId` - Products with filtering and sorting
- **Responsive design** with grid/list view toggle
- **Real-time search** and filtering capabilities

## Notes

- Variants inherit the base product's category, description, and default image
- `final_price` in variant details = base product price + price_adjustment
- Stock levels are tracked individually per variant
- One variant per product should be marked as `is_default: true`
- Attribute types support extensibility for future features
- All prices are in Czech Koruna (CZK)
- Store information is hardcoded in the API for demo purposes
- Info endpoints require no authentication and return static data