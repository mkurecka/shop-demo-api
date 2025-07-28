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
