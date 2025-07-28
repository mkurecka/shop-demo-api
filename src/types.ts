export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  WEBHOOK_AUTH_USER?: string;
  WEBHOOK_AUTH_PASS?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_email: string;
  customer_phone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shipping_address: string;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}
