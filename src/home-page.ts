import { createUnifiedPage } from './shared/layout';

const HOME_STYLES = `
    .welcome-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 3rem 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        text-align: center;
    }

    .welcome-section h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .welcome-section p {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
    }

    .quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }

    .action-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        text-align: center;
        transition: transform 0.3s, box-shadow 0.3s;
        cursor: pointer;
        border: 2px solid transparent;
    }

    .action-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-color: #667eea;
    }

    .action-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
    }

    .action-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .action-description {
        color: #666;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .stats-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
    }

    .stat-number {
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 0.5rem;
    }

    .stat-label {
        color: #666;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Chat Widget Styles */
    .chat-widget {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        padding: 2rem;
        margin-top: 2rem;
        border: 2px solid #667eea;
    }

    .chat-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .chat-header h3 {
        color: #667eea;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }

    .chat-header p {
        color: #666;
        font-size: 0.9rem;
    }

    .user-selector {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .user-selector button {
        background: #f0f2ff;
        color: #667eea;
        border: 2px solid #e2e8f0;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s;
    }

    .user-selector button:hover,
    .user-selector button.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    .chat-input-group {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .chat-input {
        flex: 1;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
    }

    .chat-input:focus {
        outline: none;
        border-color: #667eea;
    }

    .chat-send-btn {
        background: #667eea;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s;
    }

    .chat-send-btn:hover {
        background: #5a67d8;
    }

    .chat-send-btn:disabled {
        background: #a0aec0;
        cursor: not-allowed;
    }

    .webhook-settings {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #e2e8f0;
    }

    .webhook-settings h4 {
        color: #333;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    .webhook-url-input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        font-size: 0.8rem;
        font-family: monospace;
        background: white;
    }

    .current-user-info {
        background: #e6fffa;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border-left: 4px solid #38b2ac;
    }

    .current-user-info h4 {
        color: #2c7a7b;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    .user-orders {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(44, 122, 123, 0.2);
    }

    .user-orders h5 {
        color: #2c7a7b;
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .chat-history {
        background: #f8f9fa;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        height: 300px;
        overflow-y: auto;
        padding: 1rem;
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .message {
        max-width: 70%;
        word-wrap: break-word;
    }

    .message.user {
        align-self: flex-end;
    }

    .message.bot {
        align-self: flex-start;
    }

    .message-bubble {
        padding: 0.75rem 1rem;
        border-radius: 18px;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .message.user .message-bubble {
        background: #667eea;
        color: white;
        border-bottom-right-radius: 4px;
    }

    .message.bot .message-bubble {
        background: #e2e8f0;
        color: #333;
        border-bottom-left-radius: 4px;
    }

    .message-time {
        font-size: 0.7rem;
        color: #888;
        margin-top: 0.25rem;
        text-align: right;
    }

    .message.bot .message-time {
        text-align: left;
    }

    .chat-response {
        display: none;
    }


    .orders-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .order-item {
        background: white;
        padding: 0.75rem;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        transition: box-shadow 0.2s;
    }

    .order-item:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .order-header strong {
        color: #667eea;
        font-size: 0.9rem;
    }

    .order-status {
        background: #f0f2ff;
        color: #667eea;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .order-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        color: #666;
    }

    .order-total {
        font-weight: 600;
        color: #333;
    }

    @media (max-width: 768px) {
        .welcome-section h2 {
            font-size: 2rem;
        }
        
        .welcome-section p {
            font-size: 1rem;
        }
        
        .quick-actions {
            grid-template-columns: 1fr;
        }
        
        .action-card {
            padding: 1.5rem;
        }
        
        .chat-widget {
            padding: 1rem;
        }
        
        .chat-input-group {
            flex-direction: column;
        }
        
        .chat-send-btn {
            width: 100%;
        }
        
        .user-selector {
            justify-content: center;
        }
        
        .user-selector button {
            flex: 0 0 auto;
            text-align: center;
        }
    }
`;

const HOME_SCRIPTS = `
    function navigateTo(path) {
        window.location.href = path;
    }

    async function loadStats() {
        try {
            // Load basic stats from API
            const [productsRes, ordersRes, customersRes] = await Promise.all([
                fetch(API_BASE + '/products'),
                fetch(API_BASE + '/orders'),
                fetch(API_BASE + '/customers')
            ]);

            if (productsRes.ok) {
                const products = await productsRes.json();
                document.getElementById('products-count').textContent = products.data?.length || '0';
            }

            if (ordersRes.ok) {
                const orders = await ordersRes.json();
                document.getElementById('orders-count').textContent = orders.data?.length || '0';
            }

            if (customersRes.ok) {
                const customers = await customersRes.json();
                document.getElementById('customers-count').textContent = customers.data?.length || '0';
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    // Chat widget functionality
    let currentUser = null;
    const webhookUrl = 'https://n8n.2d2.cz/webhook/demo-test-chatbot';

    const users = [
        { email: 'jan.novak@email.cz', name: 'Jan Novák', phone: '+420776123456' },
        { email: 'marie.svoboda@email.cz', name: 'Marie Svobodová', phone: '+420605987654' },
        { email: 'petr.dvorak@email.cz', name: 'Petr Dvořák', phone: '+420724567890' },
        { email: 'anna.novotna@email.cz', name: 'Anna Novotná', phone: '+420603456789' },
        { email: 'tomas.prochazka@email.cz', name: 'Tomáš Procházka', phone: '+420777333444' }
    ];

    function initializeChatWidget() {
        // Create user selector buttons
        const userSelector = document.getElementById('user-selector');
        users.forEach(user => {
            const button = document.createElement('button');
            button.textContent = user.name;
            button.onclick = () => selectUser(user);
            userSelector.appendChild(button);
        });

        // Add anonymous user option
        const anonymousBtn = document.createElement('button');
        anonymousBtn.textContent = '👤 Anonymní uživatel';
        anonymousBtn.onclick = () => selectUser(null);
        userSelector.appendChild(anonymousBtn);

        // Set default webhook URL
        document.getElementById('webhook-url').value = webhookUrl;

        // Select anonymous user by default
        selectUser(null);
    }

    async function selectUser(user) {
        currentUser = user;
        
        // Update button states
        document.querySelectorAll('.user-selector button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (user) {
            event.target.classList.add('active');
        } else {
            document.querySelector('.user-selector button:last-child').classList.add('active');
        }

        // Update current user info
        const userInfo = document.getElementById('current-user-info');
        if (user) {
            let userInfoContent = \`
                <h4>👤 Přihlášený jako:</h4>
                <strong>\${user.name}</strong><br>
                <small>\${user.email} | \${user.phone}</small>
            \`;

            // Load and display user's orders
            try {
                const ordersResponse = await fetch(API_BASE + '/orders', {
                    headers: {
                        'Authorization': \`Bearer fake_session_for_\${user.email}\`
                    }
                });

                if (ordersResponse.ok) {
                    const ordersData = await ordersResponse.json();
                    if (ordersData.success && ordersData.data && ordersData.data.length > 0) {
                        userInfoContent += \`
                            <div class="user-orders">
                                <h5>📋 Vaše objednávky:</h5>
                                <div class="orders-list">
                        \`;
                        
                        ordersData.data.slice(0, 5).forEach(order => {
                            const statusEmoji = {
                                'pending': '⏳',
                                'processing': '🔄',
                                'shipped': '🚚',
                                'delivered': '✅',
                                'cancelled': '❌'
                            };
                            
                            userInfoContent += \`
                                <div class="order-item">
                                    <div class="order-header">
                                        <strong>\${order.order_number}</strong>
                                        <span class="order-status">\${statusEmoji[order.status] || '📋'} \${order.status}</span>
                                    </div>
                                    <div class="order-details">
                                        <span class="order-total">\${order.total} Kč</span>
                                        <span class="order-date">\${new Date(order.created_at).toLocaleDateString('cs-CZ')}</span>
                                    </div>
                                </div>
                            \`;
                        });
                        
                        userInfoContent += \`
                                </div>
                            </div>
                        \`;
                    }
                }
            } catch (orderError) {
                console.error('Error loading orders:', orderError);
            }

            userInfo.innerHTML = userInfoContent;
            userInfo.style.display = 'block';
        } else {
            userInfo.innerHTML = \`
                <h4>👤 Anonymní uživatel</h4>
                <small>Nepřihlášený návštěvník</small>
            \`;
            userInfo.style.display = 'block';
        }
    }

    async function sendChatMessage() {
        const messageInput = document.getElementById('chat-message');
        const sendBtn = document.getElementById('chat-send-btn');
        const chatHistory = document.getElementById('chat-history');
        const customWebhookUrl = document.getElementById('webhook-url').value;
        
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessageToChat('user', message);

        // Clear input and disable
        messageInput.value = '';
        messageInput.disabled = true;
        sendBtn.disabled = true;
        sendBtn.textContent = 'Odesílám...';

        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            // Add fake session token for user simulation
            if (currentUser) {
                headers['Authorization'] = \`Bearer fake_session_for_\${currentUser.email}\`;
            }

            const response = await fetch(API_BASE + '/chatbot/webhook', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    message: message,
                    webhookUrl: customWebhookUrl,
                    simulatedUser: currentUser
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Extract the actual message from various possible response formats
                const botResponse = data.data.bot_response;
                let chatbotMessage = '';
                
                if (typeof botResponse === 'string') {
                    chatbotMessage = botResponse;
                } else if (botResponse && typeof botResponse === 'object') {
                    chatbotMessage = botResponse.output || botResponse.message || botResponse.response || botResponse.text || botResponse.content || JSON.stringify(botResponse, null, 2);
                } else {
                    chatbotMessage = 'Odpověď nebyla rozpoznána';
                }

                // Add bot response to chat
                addMessageToChat('bot', chatbotMessage);
            } else {
                addMessageToChat('bot', 'Chyba: ' + data.error.message);
            }
        } catch (error) {
            console.error('Chat error:', error);
            addMessageToChat('bot', 'Chyba při odesílání zprávy');
        } finally {
            // Re-enable input and button
            messageInput.disabled = false;
            sendBtn.disabled = false;
            sendBtn.textContent = '💬 Odeslat';
        }
    }

    function addMessageToChat(type, text) {
        const chatHistory = document.getElementById('chat-history');
        const now = new Date();
        const timeString = now.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = \`message \${type}\`;
        
        messageDiv.innerHTML = \`
            <div class="message-bubble">\${text}</div>
            <div class="message-time">\${timeString}</div>
        \`;
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function clearChatHistory() {
        document.getElementById('chat-history').innerHTML = '';
    }

    // Handle Enter key in chat input
    document.addEventListener('DOMContentLoaded', function() {
        loadStats();
        initializeChatWidget();
        
        document.getElementById('chat-message').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    });
`;

const HOME_CONTENT = `
    <div class="welcome-section">
        <h2>🛍️ Vítejte v Demo E-shopu</h2>
        <p>Moderní správa e-shopu s pokročilými funkcemi pro produkty, objednávky, zákazníky a další.</p>
    </div>

    <div class="page-content">
        <div class="section-header">
            <h2>🚀 Rychlé akce</h2>
        </div>

        <div class="quick-actions">
            <div class="action-card" onclick="navigateTo('/products')">
                <span class="action-icon">📦</span>
                <div class="action-title">Produkty</div>
                <div class="action-description">Spravujte produkty, varianty a skladové zásoby</div>
            </div>

            <div class="action-card" onclick="navigateTo('/orders')">
                <span class="action-icon">📋</span>
                <div class="action-title">Objednávky</div>
                <div class="action-description">Sledujte a spravujte objednávky zákazníků</div>
            </div>

            <div class="action-card" onclick="navigateTo('/customers')">
                <span class="action-icon">👥</span>
                <div class="action-title">Zákazníci</div>
                <div class="action-description">Správa zákaznické databáze a profilů</div>
            </div>

            <div class="action-card" onclick="navigateTo('/categories')">
                <span class="action-icon">🏷️</span>
                <div class="action-title">Kategorie</div>
                <div class="action-description">Organizujte produkty do kategorií</div>
            </div>

            <div class="action-card" onclick="navigateTo('/chats')">
                <span class="action-icon">💬</span>
                <div class="action-title">Chaty</div>
                <div class="action-description">Chatbot konverzace a analytics</div>
            </div>

            <div class="action-card" onclick="navigateTo('/dashboard')">
                <span class="action-icon">📊</span>
                <div class="action-title">Dashboard</div>
                <div class="action-description">Kompletní přehled a statistiky</div>
            </div>
        </div>
    </div>

    <div class="page-content">
        <div class="section-header">
            <h2>📈 Přehled</h2>
        </div>

        <div class="stats-overview">
            <div class="stat-card">
                <div class="stat-number" id="products-count">-</div>
                <div class="stat-label">Produkty</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="orders-count">-</div>
                <div class="stat-label">Objednávky</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="customers-count">-</div>
                <div class="stat-label">Zákazníci</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">4</div>
                <div class="stat-label">Kategorie</div>
            </div>
        </div>
    </div>

    <div class="page-content">
        <div class="chat-widget">
            <div class="chat-header">
                <h3>💬 Chatbot Demo</h3>
                <p>Testujte chatbot s různými uživateli nebo jako anonymní návštěvník</p>
            </div>

            <div class="webhook-settings">
                <h4>🔗 Webhook URL:</h4>
                <input type="text" id="webhook-url" class="webhook-url-input" placeholder="https://n8n.2d2.cz/webhook/demo-test-chatbot">
            </div>

            <div class="user-selector" id="user-selector">
                <!-- User buttons will be generated by JavaScript -->
            </div>

            <div id="current-user-info" class="current-user-info" style="display: none;">
                <!-- User info will be updated by JavaScript -->
            </div>

            <div id="chat-history" class="chat-history">
                <!-- Chat messages will appear here -->
            </div>

            <div class="chat-input-group">
                <input type="text" id="chat-message" class="chat-input" placeholder="Napište svou zprávu..." maxlength="500">
                <button id="chat-send-btn" class="chat-send-btn" onclick="sendChatMessage()">💬 Odeslat</button>
            </div>

            <div style="text-align: center; margin-bottom: 1rem;">
                <button onclick="clearChatHistory()" class="btn btn-secondary" style="margin: 0;">
                    🗑️ Vymazat historii
                </button>
            </div>

            <div id="chat-response" class="chat-response" style="display: none;">
                <!-- Hidden - now using chat history -->
            </div>
        </div>
    </div>
`;

export const homePageHTML = createUnifiedPage(
    'Domů',
    '🏠 Demo E-shop',
    'Moderní správa e-commerce platformy',
    'home',
    HOME_CONTENT,
    HOME_STYLES,
    HOME_SCRIPTS
);