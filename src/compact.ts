import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Types
interface Env { DB: D1Database; ENVIRONMENT: string; }
interface ApiResponse<T> { success: boolean; data?: T; message?: string; error?: { code: string; message: string; }; }

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));

// Utility functions
const sanitize = (input: string): string => input.toString().trim().replace(/[<>"']/g, '');
const generateId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
const simpleHash = (password: string): string => { let hash = 0; for (let i = 0; i < password.length; i++) { hash = ((hash << 5) - hash) + password.charCodeAt(i); hash = hash & hash; } return 'hash_' + Math.abs(hash).toString(16); };

// Auth middleware
const requireAuth = async (c: any, next: any) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Login required' } }, 401);
  try {
    const { results } = await c.env.DB.prepare(`SELECT s.*, u.* FROM user_sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token = ? AND s.expires_at > datetime('now')`).bind(token).all();
    if (results.length === 0) return c.json({ success: false, error: { code: 'INVALID_SESSION', message: 'Invalid session' } }, 401);
    c.set('user', results[0]); await next();
  } catch (error) { return c.json({ success: false, error: { code: 'AUTH_ERROR', message: 'Auth error' } }, 500); }
};

// Frontend HTML
const frontendHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Compact Shop Demo</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:#f5f7fa;color:#333}.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:1rem 2rem}.container{max-width:1200px;margin:0 auto;padding:2rem}.tabs{display:flex;background:white;border-radius:8px;margin-bottom:2rem}.tab{flex:1;padding:1rem;background:white;border:none;cursor:pointer}.tab.active{background:#667eea;color:white}.tab-content{display:none;background:white;border-radius:8px;padding:2rem}.tab-content.active{display:block}.btn{background:#667eea;color:white;border:none;padding:0.75rem 1.5rem;border-radius:6px;cursor:pointer;margin:0.5rem}.form-group{margin-bottom:1rem}.form-group label{display:block;margin-bottom:0.5rem}.form-group input,.form-group select,.form-group textarea{width:100%;padding:0.75rem;border:1px solid #ddd;border-radius:4px}.result{background:#f8f9fa;padding:1rem;border-radius:4px;margin:1rem 0;max-height:400px;overflow-y:auto}</style></head><body><div class="header"><h1>Compact Shop Demo</h1><p>Jednoduchý e-shop API s frontend rozhraním</p></div><div class="container"><div class="tabs"><button class="tab active" onclick="showTab('products')">Produkty</button><button class="tab" onclick="showTab('orders')">Objednávky</button><button class="tab" onclick="showTab('customers')">Zákazníci</button><button class="tab" onclick="showTab('auth')">Autentizace</button><button class="tab" onclick="showTab('chatbot')">Chatbot</button><button class="tab" onclick="showTab('tickets')">Tickety</button></div><div id="products" class="tab-content active"><h2>Produkty</h2><button class="btn" onclick="loadProducts()">Načíst produkty</button><button class="btn" onclick="showProductForm()">Přidat produkt</button><div id="productForm" style="display:none"><h3>Nový produkt</h3><div class="form-group"><label>Název:</label><input type="text" id="productName"></div><div class="form-group"><label>Popis:</label><textarea id="productDescription"></textarea></div><div class="form-group"><label>Cena:</label><input type="number" id="productPrice"></div><div class="form-group"><label>Kategorie:</label><input type="text" id="productCategory"></div><div class="form-group"><label>Skladem:</label><input type="number" id="productStock"></div><button class="btn" onclick="createProduct()">Vytvořit</button></div><div id="productsResult" class="result"></div></div><div id="orders" class="tab-content"><h2>Objednávky</h2><button class="btn" onclick="loadOrders()">Načíst objednávky</button><div id="ordersResult" class="result"></div></div><div id="customers" class="tab-content"><h2>Zákazníci</h2><button class="btn" onclick="loadCustomers()">Načíst zákazníky</button><div id="customersResult" class="result"></div></div><div id="auth" class="tab-content"><h2>Autentizace</h2><div class="form-group"><label>Email:</label><input type="email" id="authEmail"></div><div class="form-group"><label>Heslo:</label><input type="password" id="authPassword"></div><button class="btn" onclick="login()">Přihlásit</button><button class="btn" onclick="register()">Registrovat</button><div id="authResult" class="result"></div></div><div id="chatbot" class="tab-content"><h2>Chatbot</h2><div class="form-group"><label>Zpráva:</label><input type="text" id="chatMessage"></div><button class="btn" onclick="sendMessage()">Odeslat</button><div id="chatResult" class="result"></div></div><div id="tickets" class="tab-content"><h2>Tickety</h2><button class="btn" onclick="loadTickets()">Načíst tickety</button><div id="ticketsResult" class="result"></div></div></div><script>function showTab(tabName){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));event.target.classList.add('active');document.getElementById(tabName).classList.add('active');}function showProductForm(){document.getElementById('productForm').style.display=document.getElementById('productForm').style.display==='none'?'block':'none';}async function apiCall(endpoint,method='GET',data=null){const options={method,headers:{'Content-Type':'application/json'}};if(data)options.body=JSON.stringify(data);const response=await fetch('/api'+endpoint,options);return await response.json();}async function loadProducts(){const result=await apiCall('/products');document.getElementById('productsResult').innerHTML='<pre>'+JSON.stringify(result,null,2)+'</pre>';}async function createProduct(){const data={name:document.getElementById('productName').value,description:document.getElementById('productDescription').value,price:parseFloat(document.getElementById('productPrice').value),category:document.getElementById('productCategory').value,stock:parseInt(document.getElementById('productStock').value)};const result=await apiCall('/products','POST',data);document.getElementById('productsResult').innerHTML='<pre>'+JSON.stringify(result,null,2)+'</pre>';}async function loadOrders(){const result=await apiCall('/orders');document.getElementById('ordersResult').innerHTML='<pre>'+JSON.stringify(result,null,2)+'</pre>';}async function loadCustomers(){const result=await apiCall('/customers');document.getElementById('customersResult').innerHTML='<pre>'+JSON.stringify(result,null,2)+'</pre>';}async function login(){const data={email:document.getElementById('authEmail').value,password:document.getElementById('authPassword').value};const result=await apiCall('/auth/login','POST',data);document.getElementById('authResult').innerHTML='<pre>'+JSON.stringify(result,null,2)+'</pre>';}async function register(){const data={email:document.getElementById('authEmail').value,password:document.getElementById('authPassword').value,first_name:'Test',last_name:'User'};const result=await apiCall('/auth/register','POST',data);document.getElementById('authResult').innerHTML='<pre>'+JSON.stringify(result,null,2)+'</pre>';}async function sendMessage(){const data={message:document.getElementById('chatMessage').value};const result=await apiCall('/chatbot/webhook','POST',data);document.getElementById('chatResult').innerHTML='<pre>'+JSON.stringify(result,null,2)+'</pre>';}async function loadTickets(){const result=await apiCall('/tickets');document.getElementById('ticketsResult').innerHTML='<pre>'+JSON.stringify(result,null,2)+'</pre>';}</script></body></html>`;

// Routes
app.get('/', (c) => c.html(frontendHTML));

// API info
app.get('/api', (c) => c.json({ success: true, message: 'Compact Shop API', endpoints: { products: '/api/products', orders: '/api/orders', customers: '/api/customers', auth: '/api/auth', chatbot: '/api/chatbot', tickets: '/api/tickets' } }));

// Products
app.get('/api/products', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`SELECT * FROM products WHERE stock > 0 ORDER BY created_at DESC`).all();
    return c.json({ success: true, data: results, message: 'Products loaded' } as ApiResponse<any>);
  } catch (error) { return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Error loading products' } }, 500); }
});

app.post('/api/products', async (c) => {
  try {
    const { name, description, price, category, stock } = await c.req.json();
    if (!name || !price || !category) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, price and category required' } }, 400);
    const { results } = await c.env.DB.prepare(`INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?) RETURNING *`).bind(name, description || '', price, category, stock || 0).all();
    return c.json({ success: true, data: results[0], message: 'Product created' }, 201);
  } catch (error) { return c.json({ success: false, error: { code: 'CREATE_ERROR', message: 'Error creating product' } }, 500); }
});

app.get('/api/products/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid product ID' } }, 400);
    const { results } = await c.env.DB.prepare(`SELECT * FROM products WHERE id = ?`).bind(id).all();
    if (results.length === 0) return c.json({ success: false, error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' } }, 404);
    return c.json({ success: true, data: results[0], message: 'Product loaded' });
  } catch (error) { return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Error loading product' } }, 500); }
});

// Orders
app.get('/api/orders', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`SELECT * FROM orders ORDER BY created_at DESC`).all();
    return c.json({ success: true, data: results, message: 'Orders loaded' });
  } catch (error) { return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Error loading orders' } }, 500); }
});

app.post('/api/orders', async (c) => {
  try {
    const { customer_email, customer_phone, items, shipping_address } = await c.req.json();
    if (!customer_email || !customer_phone || !items || !Array.isArray(items) || items.length === 0) {
      return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email, phone and items required' } }, 400);
    }
    const orderNumber = generateId('ORD');
    let total = 0;
    for (const item of items) {
      const { results: products } = await c.env.DB.prepare(`SELECT * FROM products WHERE id = ?`).bind(item.product_id).all();
      if (products.length === 0) return c.json({ success: false, error: { code: 'PRODUCT_NOT_FOUND', message: `Product ${item.product_id} not found` } }, 400);
      total += products[0].price * item.quantity;
    }
    const { results } = await c.env.DB.prepare(`INSERT INTO orders (order_number, customer_email, customer_phone, status, total, shipping_address) VALUES (?, ?, ?, 'pending', ?, ?) RETURNING *`).bind(orderNumber, customer_email, customer_phone, total, shipping_address || '').all();
    return c.json({ success: true, data: results[0], message: 'Order created' }, 201);
  } catch (error) { return c.json({ success: false, error: { code: 'CREATE_ERROR', message: 'Error creating order' } }, 500); }
});

// Customers
app.get('/api/customers', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`SELECT * FROM customers ORDER BY created_at DESC`).all();
    return c.json({ success: true, data: results, message: 'Customers loaded' });
  } catch (error) { return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Error loading customers' } }, 500); }
});

app.post('/api/customers', async (c) => {
  try {
    const { email, first_name, last_name, phone } = await c.req.json();
    if (!email || !first_name || !last_name || !phone) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email, first name, last name and phone required' } }, 400);
    const { results } = await c.env.DB.prepare(`INSERT INTO customers (email, first_name, last_name, phone) VALUES (?, ?, ?, ?) RETURNING *`).bind(email, first_name, last_name, phone).all();
    return c.json({ success: true, data: results[0], message: 'Customer created' }, 201);
  } catch (error) { return c.json({ success: false, error: { code: 'CREATE_ERROR', message: 'Error creating customer' } }, 500); }
});

// Auth
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, first_name, last_name, role = 'customer' } = await c.req.json();
    if (!email || !password || !first_name || !last_name) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'All fields required' } }, 400);
    if (password.length < 6) return c.json({ success: false, error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters' } }, 400);
    const { results } = await c.env.DB.prepare(`INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?) RETURNING id, email, first_name, last_name, role, created_at`).bind(email, simpleHash(password), first_name, last_name, role).all();
    return c.json({ success: true, data: results[0], message: 'User registered' }, 201);
  } catch (error) { return c.json({ success: false, error: { code: 'REGISTER_ERROR', message: 'Registration error' } }, 500); }
});

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password required' } }, 400);
    const { results: users } = await c.env.DB.prepare(`SELECT * FROM users WHERE email = ? AND is_active = 1`).bind(email).all();
    if (users.length === 0 || simpleHash(password) !== users[0].password_hash) return c.json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }, 401);
    const sessionToken = generateId('session');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await c.env.DB.prepare(`INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)`).bind(users[0].id, sessionToken, expiresAt.toISOString()).run();
    return c.json({ success: true, data: { user: { id: users[0].id, email: users[0].email, first_name: users[0].first_name, last_name: users[0].last_name, role: users[0].role }, session_token: sessionToken, expires_at: expiresAt }, message: 'Login successful' });
  } catch (error) { return c.json({ success: false, error: { code: 'LOGIN_ERROR', message: 'Login error' } }, 500); }
});

// Chatbot
app.post('/api/chatbot/webhook', async (c) => {
  try {
    const { message } = await c.req.json();
    if (!message) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Message required' } }, 400);
    const responses = [`Ahoj! Rozumím, že se ptáte na: "${message}". Jak vám mohu pomoci?`, `Děkuji za vaši zprávu: "${message}". Jaká je vaše další otázka?`, `Slyšel jsem: "${message}". Chtěl byste se dozvědět více?`];
    const botResponse = responses[Math.floor(Math.random() * responses.length)];
    const sessionId = generateId('chat');
    return c.json({ success: true, data: { session_id: sessionId, user_message: message, bot_response: botResponse, timestamp: new Date().toISOString() }, message: 'Message sent to chatbot' });
  } catch (error) { return c.json({ success: false, error: { code: 'WEBHOOK_ERROR', message: 'Chatbot error' } }, 500); }
});

// Tickets
app.get('/api/tickets', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`SELECT * FROM tickets ORDER BY created_at DESC LIMIT 50`).all();
    return c.json({ success: true, data: results, message: 'Tickets loaded' });
  } catch (error) { return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Error loading tickets' } }, 500); }
});

app.post('/api/tickets', async (c) => {
  try {
    const { customer_email, subject, description, priority = 'medium', category = 'general' } = await c.req.json();
    if (!subject || !description) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Subject and description required' } }, 400);
    const ticketNumber = generateId('TK');
    const { results } = await c.env.DB.prepare(`INSERT INTO tickets (ticket_number, customer_email, subject, description, priority, category) VALUES (?, ?, ?, ?, ?, ?) RETURNING *`).bind(ticketNumber, customer_email || null, sanitize(subject), sanitize(description), priority, category).all();
    return c.json({ success: true, data: results[0], message: `Ticket ${ticketNumber} created` }, 201);
  } catch (error) { return c.json({ success: false, error: { code: 'CREATE_ERROR', message: 'Error creating ticket' } }, 500); }
});

// Error handlers
app.notFound((c) => c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } }, 404));
app.onError((err, c) => { console.error('API Error:', err); return c.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } }, 500); });

export default app;