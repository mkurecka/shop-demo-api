import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import { productsRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { customersRouter } from './routes/customers';
import { chatbotRouter } from './routes/chatbot';
import { authRouter } from './routes/auth';
import { ticketsRouter } from './routes/tickets';
import { infoRouter } from './routes/info';
import { categoriesRouter } from './routes/categories';
import { homePageHTML } from './home-page';
import { chatsPageHTML } from './chats-page';
import { chatDetailPageHTML } from './chat-detail-page';
import { dashboardPageHTML } from './dashboard-page';
import { customersPageHTML } from './customers-page';
import { customerDetailPageHTML } from './customer-detail-page';
import { ordersPageHTML } from './orders-page';
import { orderDetailPageHTML } from './order-detail-page';
import { infoPageHTML } from './info-page';
import { categoriesPageHTML } from './categories-page';
import { categoryDetailPageHTML } from './category-detail-page';
import { productsPageHTML } from './products-page';
import { productDetailPageHTML } from './product-detail-page';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Serve home page for root path
app.get('/', (c) => {
  return c.html(homePageHTML);
});

// Serve product detail page
app.get('/products/:id', (c) => {
  const productId = c.req.param('id');
  return c.html(productDetailPageHTML);
});

// Serve chats overview page
app.get('/chats', (c) => {
  return c.html(chatsPageHTML);
});

// Serve chat detail page
app.get('/chats/:id', (c) => {
  const sessionId = c.req.param('id');
  const htmlWithSessionId = chatDetailPageHTML.replace('{{SESSION_ID}}', sessionId);
  return c.html(htmlWithSessionId);
});

// Serve dashboard page
app.get('/dashboard', (c) => {
  return c.html(dashboardPageHTML);
});

// Serve customers page
app.get('/customers', (c) => {
  return c.html(customersPageHTML);
});

// Serve customer detail page
app.get('/customers/:id', (c) => {
  const customerId = c.req.param('id');
  const htmlWithCustomerId = customerDetailPageHTML.replace('{{CUSTOMER_ID}}', customerId);
  return c.html(htmlWithCustomerId);
});

// Serve orders page
app.get('/orders', (c) => {
  return c.html(ordersPageHTML);
});

// Serve order detail page
app.get('/orders/:orderNumber', (c) => {
  const orderNumber = c.req.param('orderNumber');
  const htmlWithOrderNumber = orderDetailPageHTML.replace('{{ORDER_NUMBER}}', orderNumber);
  return c.html(htmlWithOrderNumber);
});

// Serve products page
app.get('/products', (c) => {
  return c.html(productsPageHTML);
});

// Serve info page
app.get('/info', (c) => {
  return c.html(infoPageHTML);
});

// Serve categories page
app.get('/categories', (c) => {
  return c.html(categoriesPageHTML);
});

// Serve category detail page
app.get('/categories/:categoryId', (c) => {
  const categoryId = c.req.param('categoryId');
  const htmlWithCategoryId = categoryDetailPageHTML
    .replace('{{CATEGORY_ID}}', categoryId)
    .replace('{{CATEGORY_NAME}}', categoryId.charAt(0).toUpperCase() + categoryId.slice(1));
  return c.html(htmlWithCategoryId);
});

// API info endpoint
app.get('/api', (c) => {
  return c.json({
    success: true,
    message: 'Shop Demo API v1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      customers: '/api/customers',
      chatbot: '/api/chatbot',
      auth: '/api/auth',
      tickets: '/api/tickets',
      info: '/api/info',
      categories: '/api/categories'
    }
  });
});

// API routes
app.route('/api/products', productsRouter);
app.route('/api/orders', ordersRouter);
app.route('/api/customers', customersRouter);
app.route('/api/chatbot', chatbotRouter);
app.route('/api/auth', authRouter);
app.route('/api/tickets', ticketsRouter);
app.route('/api/info', infoRouter);
app.route('/api/categories', categoriesRouter);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint nebyl nalezen'
    }
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Nastala neočekávaná chyba'
    }
  }, 500);
});

export default app;
