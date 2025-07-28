// Frontend HTML content as a string
export const frontendHTML = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo E-shop - Správa obchodu</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            color: #333;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .header p {
            opacity: 0.9;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .tabs {
            display: flex;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            overflow: hidden;
        }

        .tab {
            flex: 1;
            padding: 1rem 2rem;
            background: white;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            position: relative;
        }

        .tab:hover {
            background: #f8f9fa;
        }

        .tab.active {
            background: #667eea;
            color: white;
        }

        .tab-content {
            display: none;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 2rem;
        }

        .tab-content.active {
            display: block;
        }

        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            margin-right: 1rem;
            margin-bottom: 1rem;
        }

        .btn:hover {
            background: #5a67d8;
            transform: translateY(-1px);
        }

        .btn-success {
            background: #48bb78;
        }

        .btn-success:hover {
            background: #38a169;
        }

        .btn-danger {
            background: #f56565;
        }

        .btn-danger:hover {
            background: #e53e3e;
        }

        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .card-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-body {
            padding: 1.5rem;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }

        .table th,
        .table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        .table th {
            background: #f7fafc;
            font-weight: 600;
        }

        .table tbody tr:hover {
            background: #f7fafc;
        }

        .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1rem;
            margin-bottom: 1rem;
        }

        .form-control:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }

        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 0;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-body {
            padding: 1.5rem;
        }

        .close {
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover {
            color: #000;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            color: #666;
        }

        .success {
            background: #f0fff4;
            border: 1px solid #68d391;
            color: #2f855a;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
        }

        .error {
            background: #fed7d7;
            border: 1px solid #fc8181;
            color: #c53030;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
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
        }

        .stat-label {
            color: #666;
            margin-top: 0.5rem;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .product-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }

        .product-card:hover {
            transform: translateY(-5px);
        }

        .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .product-info {
            padding: 1rem;
        }

        .product-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .product-price {
            font-size: 1.5rem;
            color: #667eea;
            font-weight: bold;
        }

        .select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1rem;
            background: white;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .tabs {
                flex-direction: column;
            }
            
            .tab {
                text-align: center;
            }
            
            .grid {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1>🛍️ Demo E-shop</h1>
                <p>Správa obchodu a simulace uživatelů</p>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div id="webhook-config" style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="btn" onclick="openModal('webhookConfig')" style="padding: 0.5rem 1rem; font-size: 0.9rem;">⚙️ Webhook</button>
                    <span id="webhook-status" style="font-size: 0.8rem; opacity: 0.8;"></span>
                </div>
                <div id="user-section">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <select id="user-picker" onchange="selectUser()" style="padding: 0.5rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white;">
                            <option value="">-- Vyberte uživatele --</option>
                        </select>
                        <span id="selected-user-info" style="color: white; font-size: 0.9rem;"></span>
                        <button class="btn" onclick="clearUserSelection()" style="padding: 0.5rem 1rem; font-size: 0.9rem;">🗑️ Zrušit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="tabs" id="main-tabs">
            <button class="tab active" onclick="showTab('products')">🛍️ Produkty</button>
            <button class="tab" onclick="showTab('dashboard')">📊 Dashboard</button>
            <button class="tab" onclick="showTab('orders')">📦 Objednávky</button>
            <button class="tab" onclick="showTab('customers')">👥 Zákazníci</button>
            <button class="tab" onclick="showTab('user-actions')" id="user-actions-tab" style="display: none;">👤 Akce uživatele</button>
        </div>

        <!-- Produkty Tab -->
        <div id="products" class="tab-content active">
            <div class="card">
                <div class="card-header">
                    <h2>🛍️ Produkty</h2>
                </div>
                <div class="card-body">
                    <div id="products-grid" class="grid">
                        <div class="loading">Načítání produktů...</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dashboard Tab -->
        <div id="dashboard" class="tab-content">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number" id="total-products">0</div>
                    <div class="stat-label">Produkty</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="total-customers">0</div>
                    <div class="stat-label">Zákazníci</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="total-orders">0</div>
                    <div class="stat-label">Objednávky</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="total-revenue">0 Kč</div>
                    <div class="stat-label">Celkový obrat</div>
                </div>
            </div>
        </div>

        <!-- Orders Tab -->
        <div id="orders" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h2>📦 Všechny objednávky</h2>
                    <button class="btn btn-success" onclick="openModal('newOrder')">➕ Nová objednávka</button>
                </div>
                <div class="card-body">
                    <div id="orders-table">
                        <div class="loading">Načítání objednávek...</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Customers Tab -->
        <div id="customers" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h2>👥 Zákazníci</h2>
                </div>
                <div class="card-body">
                    <div id="customers-table">
                        <div class="loading">Načítání zákazníků...</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Actions Tab -->
        <div id="user-actions" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h2 id="user-actions-title">👤 Akce pro vybraného uživatele</h2>
                </div>
                <div class="card-body">
                    <div id="user-actions-content">
                        <p>Vyberte uživatele pro zobrazení dostupných akcí.</p>
                    </div>
                    
                    <div id="user-action-buttons" style="display: none; margin-top: 1rem;">
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button class="btn" onclick="viewUserOrders()">📦 Zobrazit objednávky</button>
                            <button class="btn" onclick="startChatAsUser()">💬 Začít chat jako uživatel</button>
                            <button class="btn btn-success" onclick="createRandomOrder()">➕ Vytvořit náhodnou objednávku</button>
                        </div>
                    </div>
                    
                    <div id="user-orders-section" style="display: none; margin-top: 2rem;">
                        <h3>📦 Objednávky uživatele</h3>
                        <div id="user-orders-table">
                            <div class="loading">Načítání objednávek...</div>
                        </div>
                    </div>
                    
                    <div id="user-chat-section" style="display: none; margin-top: 2rem;">
                        <h3>💬 Chat jako uživatel</h3>
                        <div id="user-chat-widget" style="border: 1px solid #e2e8f0; border-radius: 8px; height: 400px; display: flex; flex-direction: column;">
                            <div style="background: #667eea; color: white; padding: 15px; font-weight: bold;">
                                💬 Chat jako <span id="chat-user-name"></span>
                            </div>
                            <div id="user-chat-messages" style="flex: 1; overflow-y: auto; padding: 10px; background: #f8f9fa;">
                                <div style="text-align: center; color: #666; margin: 20px 0;">
                                    Napište zprávu pro začátek konverzace
                                </div>
                            </div>
                            <div style="padding: 10px; border-top: 1px solid #eee;">
                                <div style="display: flex; gap: 5px;">
                                    <input type="text" id="user-chat-input" placeholder="Napište zprávu..." style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px;" onkeypress="if(event.key==='Enter') sendUserMessage()">
                                    <button onclick="sendUserMessage()" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">
                                        Odeslat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Homepage Chat Widget -->
    <div id="homepage-chat" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
        <div id="chat-toggle" onclick="toggleHomepageChat()" style="background: #667eea; color: white; border-radius: 50px; padding: 15px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 24px;">
            💬
        </div>
        <div id="chat-window" style="display: none; position: absolute; bottom: 70px; right: 0; width: 350px; height: 400px; background: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); overflow: hidden;">
            <div style="background: #667eea; color: white; padding: 15px; font-weight: bold;">
                💬 Chat podpora (nepřihlášený)
                <span onclick="toggleHomepageChat()" style="float: right; cursor: pointer; font-size: 18px;">×</span>
            </div>
            <div id="chat-messages" style="height: 280px; overflow-y: auto; padding: 10px; background: #f8f9fa;">
                <div style="text-align: center; color: #666; margin: 20px 0;">
                    Napište svou zprávu pro začátek konverzace
                </div>
            </div>
            <div style="padding: 10px; border-top: 1px solid #eee;">
                <div style="display: flex; gap: 5px;">
                    <input type="text" id="homepage-chat-input" placeholder="Napište zprávu..." style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px;" onkeypress="if(event.key==='Enter') sendHomepageMessage()">
                    <button onclick="sendHomepageMessage()" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">
                        Odeslat
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <!-- Webhook Configuration -->
    <div id="webhookConfig" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>⚙️ Webhook konfigurace</h3>
                <span class="close" onclick="closeModal('webhookConfig')">&times;</span>
            </div>
            <div class="modal-body">
                <form id="webhookForm">
                    <div class="form-group">
                        <label for="webhook-url">Webhook URL:</label>
                        <input type="url" id="webhook-url" class="form-control" placeholder="https://n8n.2d2.cz/webhook/demo-test-chatbot?token=..." required>
                        <small style="color: #718096; margin-top: 0.5rem; display: block;">
                            Zadejte úplnou URL vašeho n8n webhook endpointu včetně tokenu
                        </small>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button type="submit" class="btn btn-success">💾 Uložit</button>
                        <button type="button" class="btn" onclick="testWebhook()">🧪 Test</button>
                    </div>
                    <div id="webhook-test-result" style="margin-top: 1rem;"></div>
                </form>
            </div>
        </div>
    </div>

    <!-- New Order Modal -->
    <div id="newOrder" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>➕ Nová objednávka</h3>
                <span class="close" onclick="closeModal('newOrder')">&times;</span>
            </div>
            <div class="modal-body">
                <form id="orderForm">
                    <div class="form-group">
                        <label for="order-email">Email zákazníka:</label>
                        <input type="email" id="order-email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="order-phone">Telefon:</label>
                        <input type="tel" id="order-phone" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="order-address">Adresa:</label>
                        <input type="text" id="order-address" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="order-product">Produkt:</label>
                        <select id="order-product" class="form-control" required>
                            <option value="">Vyberte produkt</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="order-quantity">Množství:</label>
                        <input type="number" id="order-quantity" class="form-control" min="1" value="1" required>
                    </div>
                    <button type="submit" class="btn btn-success">✅ Vytvořit objednávku</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        const API_BASE = window.location.origin + '/api';
        let products = [];
        let customers = [];
        let orders = [];
        let selectedUser = null;
        let homepageChatSessionId = null;
        let userChatSessionId = null;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadData();
            setupFormHandlers();
            loadWebhookConfig();
            populateUserPicker();
        });

        // Tab management
        function showTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        }

        // Modal management
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // User selection functions
        async function populateUserPicker() {
            try {
                const response = await fetch(API_BASE + '/customers');
                const data = await response.json();
                
                if (data.success) {
                    customers = data.data;
                    const userPicker = document.getElementById('user-picker');
                    
                    // Clear existing options except the first one
                    userPicker.innerHTML = '<option value="">-- Vyberte uživatele --</option>';
                    
                    // Add customers
                    customers.forEach(customer => {
                        const option = document.createElement('option');
                        option.value = customer.email;
                        option.textContent = \`\${customer.first_name} \${customer.last_name} (\${customer.email})\`;
                        userPicker.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Error loading customers for picker:', error);
            }
        }

        function selectUser() {
            const userPicker = document.getElementById('user-picker');
            const selectedEmail = userPicker.value;
            
            if (selectedEmail) {
                selectedUser = customers.find(c => c.email === selectedEmail);
                updateUserSelectionUI();
                
                // Show user actions tab
                document.getElementById('user-actions-tab').style.display = 'block';
            } else {
                clearUserSelection();
            }
        }

        function clearUserSelection() {
            selectedUser = null;
            document.getElementById('user-picker').value = '';
            updateUserSelectionUI();
            
            // Hide user actions tab
            document.getElementById('user-actions-tab').style.display = 'none';
            
            // Switch to products tab if currently on user actions
            if (document.getElementById('user-actions').classList.contains('active')) {
                showTab('products');
            }
        }

        function updateUserSelectionUI() {
            const selectedUserInfo = document.getElementById('selected-user-info');
            const userActionsTitle = document.getElementById('user-actions-title');
            const userActionButtons = document.getElementById('user-action-buttons');
            const userActionsContent = document.getElementById('user-actions-content');
            
            if (selectedUser) {
                selectedUserInfo.textContent = \`Vybrán: \${selectedUser.first_name} \${selectedUser.last_name}\`;
                userActionsTitle.textContent = \`👤 Akce pro \${selectedUser.first_name} \${selectedUser.last_name}\`;
                userActionButtons.style.display = 'block';
                userActionsContent.innerHTML = \`
                    <p><strong>Email:</strong> \${selectedUser.email}</p>
                    <p><strong>Telefon:</strong> \${selectedUser.phone}</p>
                    <p><strong>Adresa:</strong> \${selectedUser.address}, \${selectedUser.city} \${selectedUser.postal_code}</p>
                \`;
            } else {
                selectedUserInfo.textContent = '';
                userActionsTitle.textContent = '👤 Akce pro vybraného uživatele';
                userActionButtons.style.display = 'none';
                userActionsContent.innerHTML = '<p>Vyberte uživatele pro zobrazení dostupných akcí.</p>';
            }
        }

        // User actions
        async function viewUserOrders() {
            if (!selectedUser) return;
            
            const userOrdersSection = document.getElementById('user-orders-section');
            const userOrdersTable = document.getElementById('user-orders-table');
            
            userOrdersSection.style.display = 'block';
            userOrdersTable.innerHTML = '<div class="loading">Načítání objednávek uživatele...</div>';
            
            try {
                // Filter orders by user email
                const userOrders = orders.filter(order => order.customer_email === selectedUser.email);
                
                if (userOrders.length === 0) {
                    userOrdersTable.innerHTML = '<p>Tento uživatel nemá žádné objednávky.</p>';
                } else {
                    let tableHTML = '<table class="table"><thead><tr><th>Číslo</th><th>Datum</th><th>Stav</th><th>Celkem</th></tr></thead><tbody>';
                    
                    userOrders.forEach(order => {
                        const date = new Date(order.created_at).toLocaleDateString('cs-CZ');
                        const total = new Intl.NumberFormat('cs-CZ').format(order.total) + ' Kč';
                        tableHTML += \`<tr><td>\${order.order_number}</td><td>\${date}</td><td>\${order.status}</td><td>\${total}</td></tr>\`;
                    });
                    
                    tableHTML += '</tbody></table>';
                    userOrdersTable.innerHTML = tableHTML;
                }
            } catch (error) {
                console.error('Error loading user orders:', error);
                userOrdersTable.innerHTML = '<p class="error">Chyba při načítání objednávek uživatele.</p>';
            }
        }

        function startChatAsUser() {
            if (!selectedUser) return;
            
            const userChatSection = document.getElementById('user-chat-section');
            const chatUserName = document.getElementById('chat-user-name');
            const userChatMessages = document.getElementById('user-chat-messages');
            
            userChatSection.style.display = 'block';
            chatUserName.textContent = \`\${selectedUser.first_name} \${selectedUser.last_name}\`;
            
            // Clear previous messages
            userChatMessages.innerHTML = '<div style="text-align: center; color: #666; margin: 20px 0;">Napište zprávu pro začátek konverzace</div>';
            userChatSessionId = null;
        }

        async function sendUserMessage() {
            if (!selectedUser) return;
            
            const input = document.getElementById('user-chat-input');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Add user message to chat
            const chatMessages = document.getElementById('user-chat-messages');
            const userMessage = document.createElement('div');
            userMessage.style.cssText = 'background: #e3f2fd; padding: 8px; margin: 5px 0; border-radius: 8px; text-align: right;';
            userMessage.textContent = message;
            chatMessages.appendChild(userMessage);
            
            input.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            try {
                const response = await fetch(API_BASE + '/chatbot/webhook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Simulate logged in user by providing fake session token
                        'Authorization': 'Bearer fake_session_for_' + selectedUser.email
                    },
                    body: JSON.stringify({
                        message: message,
                        sessionId: userChatSessionId,
                        simulatedUser: selectedUser  // Pass user info for webhook
                    })
                });
                
                const data = await response.json();
                if (data.success) {
                    userChatSessionId = data.data.session_id;
                    
                    // Add bot response
                    const botMessage = document.createElement('div');
                    botMessage.style.cssText = 'background: #f5f5f5; padding: 8px; margin: 5px 0; border-radius: 8px;';
                    
                    // Extract bot response text
                    let botText = 'Zpráva byla zpracována';
                    if (data.data.bot_response) {
                        if (typeof data.data.bot_response === 'string') {
                            botText = data.data.bot_response;
                        } else if (data.data.bot_response.output) {
                            botText = data.data.bot_response.output;
                        } else if (data.data.bot_response.message) {
                            botText = data.data.bot_response.message;
                        } else if (data.data.bot_response.response) {
                            botText = data.data.bot_response.response;
                        } else if (data.data.bot_response.text) {
                            botText = data.data.bot_response.text;
                        } else if (data.data.bot_response.content) {
                            botText = data.data.bot_response.content;
                        }
                    }
                    
                    botMessage.textContent = botText;
                    chatMessages.appendChild(botMessage);
                    
                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            } catch (error) {
                console.error('User chat error:', error);
                
                // Add error message
                const errorMessage = document.createElement('div');
                errorMessage.style.cssText = 'background: #ffebee; padding: 8px; margin: 5px 0; border-radius: 8px; color: #c62828;';
                errorMessage.textContent = 'Chyba při odesílání zprávy';
                chatMessages.appendChild(errorMessage);
            }
        }

        async function createRandomOrder() {
            if (!selectedUser) return;
            
            // Get random product
            if (products.length === 0) {
                showError('Nejprve načtěte produkty');
                return;
            }
            
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const randomQuantity = Math.floor(Math.random() * 3) + 1; // 1-3 pieces
            
            const orderData = {
                customer_email: selectedUser.email,
                customer_phone: selectedUser.phone,
                shipping_address: selectedUser.address + ', ' + selectedUser.city + ' ' + selectedUser.postal_code,
                items: [{
                    product_id: randomProduct.id,
                    quantity: randomQuantity
                }]
            };
            
            try {
                const response = await fetch(API_BASE + '/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });
                
                const data = await response.json();
                if (data.success) {
                    showSuccess(\`Náhodná objednávka vytvořena! Číslo: \${data.data.order_number}\`);
                    loadOrders(); // Refresh orders
                    viewUserOrders(); // Refresh user orders view
                } else {
                    showError('Chyba při vytváření objednávky: ' + (data.error.message || 'Neznámá chyba'));
                }
            } catch (error) {
                console.error('Error creating random order:', error);
                showError('Chyba při vytváření objednávky: ' + error.message);
            }
        }

        // Homepage chat functions
        function toggleHomepageChat() {
            const chatWindow = document.getElementById('chat-window');
            chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
        }

        async function sendHomepageMessage() {
            const input = document.getElementById('homepage-chat-input');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Add user message to chat
            const chatMessages = document.getElementById('chat-messages');
            const userMessage = document.createElement('div');
            userMessage.style.cssText = 'background: #e3f2fd; padding: 8px; margin: 5px 0; border-radius: 8px; text-align: right;';
            userMessage.textContent = message;
            chatMessages.appendChild(userMessage);
            
            input.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            try {
                const response = await fetch(API_BASE + '/chatbot/webhook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        sessionId: homepageChatSessionId
                    })
                });
                
                const data = await response.json();
                if (data.success) {
                    homepageChatSessionId = data.data.session_id;
                    
                    // Add bot response
                    const botMessage = document.createElement('div');
                    botMessage.style.cssText = 'background: #f5f5f5; padding: 8px; margin: 5px 0; border-radius: 8px;';
                    
                    // Extract bot response text
                    let botText = 'Zpráva byla zpracována';
                    if (data.data.bot_response) {
                        if (typeof data.data.bot_response === 'string') {
                            botText = data.data.bot_response;
                        } else if (data.data.bot_response.output) {
                            botText = data.data.bot_response.output;
                        } else if (data.data.bot_response.message) {
                            botText = data.data.bot_response.message;
                        } else if (data.data.bot_response.response) {
                            botText = data.data.bot_response.response;
                        } else if (data.data.bot_response.text) {
                            botText = data.data.bot_response.text;
                        } else if (data.data.bot_response.content) {
                            botText = data.data.bot_response.content;
                        }
                    }
                    
                    botMessage.textContent = botText;
                    chatMessages.appendChild(botMessage);
                    
                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            } catch (error) {
                console.error('Homepage chat error:', error);
                
                // Add error message
                const errorMessage = document.createElement('div');
                errorMessage.style.cssText = 'background: #ffebee; padding: 8px; margin: 5px 0; border-radius: 8px; color: #c62828;';
                errorMessage.textContent = 'Chyba při odesílání zprávy';
                chatMessages.appendChild(errorMessage);
            }
        }

        // Load data from API
        async function loadData() {
            try {
                await Promise.all([
                    loadProducts(),
                    loadCustomers(),
                    loadOrders()
                ]);
                updateDashboard();
            } catch (error) {
                console.error('Error loading data:', error);
                showError('Chyba při načítání dat: ' + error.message);
            }
        }

        async function loadProducts() {
            try {
                const response = await fetch(API_BASE + '/products');
                const data = await response.json();
                
                if (data.success) {
                    products = data.data;
                    renderProductsGrid();
                    populateProductSelect();
                }
            } catch (error) {
                console.error('Error loading products:', error);
                document.getElementById('products-grid').innerHTML = '<div class="error">Chyba při načítání produktů</div>';
            }
        }

        async function loadCustomers() {
            try {
                const response = await fetch(API_BASE + '/customers');
                const data = await response.json();
                
                if (data.success) {
                    customers = data.data;
                    renderCustomersTable();
                }
            } catch (error) {
                console.error('Error loading customers:', error);
                document.getElementById('customers-table').innerHTML = '<div class="error">Chyba při načítání zákazníků</div>';
            }
        }

        async function loadOrders() {
            try {
                const response = await fetch(API_BASE + '/orders');
                const data = await response.json();
                
                if (data.success) {
                    orders = data.data;
                    renderOrdersTable();
                }
            } catch (error) {
                console.error('Error loading orders:', error);
                document.getElementById('orders-table').innerHTML = '<div class="error">Chyba při načítání objednávek</div>';
            }
        }

        // Render functions
        function renderProductsGrid() {
            const grid = document.getElementById('products-grid');
            
            if (products.length === 0) {
                grid.innerHTML = '<div>Žádné produkty k zobrazení</div>';
                return;
            }
            
            grid.innerHTML = products.map(product => \`
                <div class="product-card">
                    <img src="\${product.image_url || 'https://via.placeholder.com/300x200'}" alt="\${product.name}" class="product-image">
                    <div class="product-info">
                        <div class="product-title">\${product.name}</div>
                        <div class="product-price">\${new Intl.NumberFormat('cs-CZ').format(product.price)} Kč</div>
                        <p style="color: #666; margin: 0.5rem 0;">\${product.description}</p>
                        <p style="color: #667eea; font-weight: 600;">Skladem: \${product.stock} ks</p>
                    </div>
                </div>
            \`).join('');
        }

        function renderCustomersTable() {
            const table = document.getElementById('customers-table');
            
            if (customers.length === 0) {
                table.innerHTML = '<div>Žádní zákazníci k zobrazení</div>';
                return;
            }
            
            let tableHTML = '<table class="table"><thead><tr><th>Jméno</th><th>Email</th><th>Telefon</th><th>Město</th></tr></thead><tbody>';
            
            customers.forEach(customer => {
                tableHTML += \`<tr>
                    <td>\${customer.first_name} \${customer.last_name}</td>
                    <td>\${customer.email}</td>
                    <td>\${customer.phone}</td>
                    <td>\${customer.city}</td>
                </tr>\`;
            });
            
            tableHTML += '</tbody></table>';
            table.innerHTML = tableHTML;
        }

        function renderOrdersTable() {
            const table = document.getElementById('orders-table');
            
            if (orders.length === 0) {
                table.innerHTML = '<div>Žádné objednávky k zobrazení</div>';
                return;
            }
            
            let tableHTML = '<table class="table"><thead><tr><th>Číslo</th><th>Zákazník</th><th>Datum</th><th>Stav</th><th>Celkem</th></tr></thead><tbody>';
            
            orders.forEach(order => {
                const date = new Date(order.created_at).toLocaleDateString('cs-CZ');
                const total = new Intl.NumberFormat('cs-CZ').format(order.total) + ' Kč';
                tableHTML += \`<tr>
                    <td>\${order.order_number}</td>
                    <td>\${order.customer_email}</td>
                    <td>\${date}</td>
                    <td>\${order.status}</td>
                    <td>\${total}</td>
                </tr>\`;
            });
            
            tableHTML += '</tbody></table>';
            table.innerHTML = tableHTML;
        }

        function populateProductSelect() {
            const select = document.getElementById('order-product');
            select.innerHTML = '<option value="">Vyberte produkt</option>';
            
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = \`\${product.name} - \${new Intl.NumberFormat('cs-CZ').format(product.price)} Kč\`;
                select.appendChild(option);
            });
        }

        function updateDashboard() {
            document.getElementById('total-products').textContent = products.length;
            document.getElementById('total-customers').textContent = customers.length;
            document.getElementById('total-orders').textContent = orders.length;
            
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
            document.getElementById('total-revenue').textContent = new Intl.NumberFormat('cs-CZ').format(totalRevenue) + ' Kč';
        }

        // Form handlers
        function setupFormHandlers() {
            // Webhook form
            document.getElementById('webhookForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const url = document.getElementById('webhook-url').value;
                localStorage.setItem('webhook_url', url);
                updateWebhookStatus();
                showSuccess('Webhook URL uložena!');
                closeModal('webhookConfig');
            });

            // Order form
            document.getElementById('orderForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const orderData = {
                    customer_email: document.getElementById('order-email').value,
                    customer_phone: document.getElementById('order-phone').value,
                    shipping_address: document.getElementById('order-address').value,
                    items: [{
                        product_id: parseInt(document.getElementById('order-product').value),
                        quantity: parseInt(document.getElementById('order-quantity').value)
                    }]
                };

                try {
                    const response = await fetch(API_BASE + '/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(orderData)
                    });

                    const data = await response.json();
                    if (data.success) {
                        showSuccess('Objednávka úspěšně vytvořena!');
                        closeModal('newOrder');
                        document.getElementById('orderForm').reset();
                        loadOrders();
                    } else {
                        showError('Chyba při vytváření objednávky: ' + (data.error.message || 'Neznámá chyba'));
                    }
                } catch (error) {
                    console.error('Error creating order:', error);
                    showError('Chyba při vytváření objednávky: ' + error.message);
                }
            });
        }

        // Webhook functions
        function loadWebhookConfig() {
            const savedUrl = localStorage.getItem('webhook_url');
            if (savedUrl) {
                document.getElementById('webhook-url').value = savedUrl;
                updateWebhookStatus();
            }
        }

        function updateWebhookStatus() {
            const statusElement = document.getElementById('webhook-status');
            const savedUrl = localStorage.getItem('webhook_url');
            
            if (savedUrl) {
                statusElement.textContent = '✅ Nakonfigurováno';
            } else {
                statusElement.textContent = '⚠️ Nenastaveno';
            }
        }

        async function testWebhook() {
            const url = document.getElementById('webhook-url').value;
            const resultDiv = document.getElementById('webhook-test-result');
            
            if (!url) {
                resultDiv.innerHTML = '<div class="error">Zadejte webhook URL</div>';
                return;
            }
            
            resultDiv.innerHTML = '<div class="loading">Testování webhook...</div>';
            
            try {
                const response = await fetch(API_BASE + '/chatbot/webhook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: 'Test zpráva z demo aplikace',
                        webhookUrl: url
                    })
                });
                
                const data = await response.json();
                if (data.success) {
                    resultDiv.innerHTML = '<div class="success">✅ Webhook je funkční! Odpověď: ' + JSON.stringify(data.data.bot_response) + '</div>';
                } else {
                    resultDiv.innerHTML = '<div class="error">❌ Webhook test selhal: ' + (data.error.message || 'Neznámá chyba') + '</div>';
                }
            } catch (error) {
                console.error('Webhook test error:', error);
                resultDiv.innerHTML = '<div class="error">❌ Chyba při testování webhook: ' + error.message + '</div>';
            }
        }

        // Utility functions
        function showSuccess(message) {
            const alert = document.createElement('div');
            alert.className = 'success';
            alert.textContent = message;
            alert.style.position = 'fixed';
            alert.style.top = '20px';
            alert.style.right = '20px';
            alert.style.zIndex = '9999';
            document.body.appendChild(alert);
            
            setTimeout(() => {
                document.body.removeChild(alert);
            }, 3000);
        }

        function showError(message) {
            const alert = document.createElement('div');
            alert.className = 'error';
            alert.textContent = message;
            alert.style.position = 'fixed';
            alert.style.top = '20px';
            alert.style.right = '20px';
            alert.style.zIndex = '9999';
            document.body.appendChild(alert);
            
            setTimeout(() => {
                document.body.removeChild(alert);
            }, 5000);
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }
    </script>
</body>
</html>`;