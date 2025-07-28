import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import { productsRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { customersRouter } from './routes/customers';
import { chatbotRouter } from './routes/chatbot';
import { authRouter } from './routes/auth';
import { ticketsRouter } from './routes/tickets';
import { frontendHTML } from './frontend';
import { chatsPageHTML } from './chats-page';
import { chatDetailPageHTML } from './chat-detail-page';
import { dashboardPageHTML } from './dashboard-page';
import { customersPageHTML } from './customers-page';
import { customerDetailPageHTML } from './customer-detail-page';
import { ordersPageHTML } from './orders-page';
import { orderDetailPageHTML } from './order-detail-page';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Serve frontend HTML for root path
app.get('/', (c) => {
  return c.html(frontendHTML);
});

// Serve frontend HTML with product detail
app.get('/products/:id', (c) => {
  const productId = c.req.param('id');
  // Inject product ID into frontend HTML for automatic loading
  const htmlWithProductId = frontendHTML.replace(
    'handleURLParameters();',
    `handleURLParameters(); showProductDetailOnLoad('${productId}');`
  );
  return c.html(htmlWithProductId);
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
      tickets: '/api/tickets'
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
