// Order detail page HTML content as a string
export const orderDetailPageHTML = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail objednávky - Demo E-shop</title>
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

        .back-button {
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            margin-top: 1rem;
            margin-right: 1rem;
        }

        .back-button:hover {
            background: rgba(255,255,255,0.3);
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
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
        }

        .card-body {
            padding: 1.5rem;
        }

        .order-info {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }

        .order-info h3 {
            margin: 0 0 0.5rem 0;
            color: #333;
        }

        .order-info p {
            margin: 0.25rem 0;
            color: #666;
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
            display: inline-block;
        }

        .status-pending { background: #fef3c7; color: #92400e; }
        .status-processing { background: #dbeafe; color: #1e40af; }
        .status-shipped { background: #d1fae5; color: #065f46; }
        .status-delivered { background: #dcfce7; color: #166534; }
        .status-cancelled { background: #fecaca; color: #991b1b; }

        .error {
            background: #fed7d7;
            color: #c53030;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #f56565;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            color: #666;
        }

        .order-items {
            margin-top: 1rem;
        }

        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 0.5rem;
        }

        .item-info {
            flex: 1;
        }

        .item-name {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .item-details {
            color: #666;
            font-size: 0.9rem;
        }

        .item-price {
            font-weight: 600;
            color: #667eea;
        }

        .total-section {
            border-top: 2px solid #e2e8f0;
            padding-top: 1rem;
            margin-top: 1rem;
            text-align: right;
        }

        .total-amount {
            font-size: 1.5rem;
            font-weight: bold;
            color: #667eea;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            color: #666;
        }

        .error {
            background: #fed7d7;
            border: 1px solid #fc8181;
            color: #c53030;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
        }

        .empty-state {
            text-align: center;
            color: #666;
            padding: 3rem;
            font-style: italic;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .item {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>📦 Detail objednávky</h1>
            <p>Detailní zobrazení objednávky</p>
            <button class="back-button" onclick="window.location.href='/orders'">← Zpět na seznam objednávek</button>
            <button class="back-button" onclick="window.location.href='/'">🏠 Hlavní stránka</button>
        </div>
    </div>

    <div class="container">
        <div class="card">
            <div class="card-header">
                <h2>📋 Informace o objednávce</h2>
            </div>
            <div class="card-body">
                <div id="order-info">
                    <div class="loading">Načítání informací o objednávce...</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>🛍️ Položky objednávky</h2>
            </div>
            <div class="card-body">
                <div id="order-items">
                    <div class="loading">Načítání položek objednávky...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        const API_BASE = window.location.origin + '/api';
        const orderNumber = '{{ORDER_NUMBER}}'; // Will be replaced by server

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadOrderDetail();
        });

        async function loadOrderDetail() {
            try {
                // Load order without verification - use skip_phone_check for logged-in user simulation
                const url = API_BASE + \`/orders/\${orderNumber}?email=skip_verification&phone=skip_phone_check\`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    renderOrderInfo(data.data);
                    renderOrderItems(data.data);
                } else {
                    document.getElementById('order-info').innerHTML = '<div class="error">Objednávka nebyla nalezena</div>';
                    document.getElementById('order-items').innerHTML = '<div class="error">Chyba při načítání položek objednávky</div>';
                }
            } catch (error) {
                console.error('Error loading order detail:', error);
                document.getElementById('order-info').innerHTML = '<div class="error">Chyba při načítání detailu objednávky</div>';
                document.getElementById('order-items').innerHTML = '<div class="error">Chyba při načítání položek objednávky</div>';
            }
        }

        function renderOrderInfo(order) {
            const orderInfoDiv = document.getElementById('order-info');
            const createdAt = new Date(order.created_at).toLocaleString('cs-CZ');
            const statusClass = \`status-\${order.status}\`;
            const statusText = getStatusText(order.status);
            
            orderInfoDiv.innerHTML = \`
                <div class="order-info">
                    <h3>Objednávka: \${order.order_number}</h3>
                    <p><strong>Zákazník:</strong> \${order.customer_email}</p>
                    <p><strong>Telefon:</strong> \${order.customer_phone || 'Neuvedeno'}</p>
                    <p><strong>Adresa doručení:</strong> \${order.shipping_address}</p>
                    <p><strong>Vytvořeno:</strong> \${createdAt}</p>
                    <p><strong>Stav:</strong> <span class="status-badge \${statusClass}">\${statusText}</span></p>
                    <p><strong>Celková cena:</strong> <span style="font-size: 1.2em; color: #667eea; font-weight: bold;">\${new Intl.NumberFormat('cs-CZ').format(order.total)} Kč</span></p>
                </div>
            \`;
        }

        function renderOrderItems(order) {
            const orderItemsDiv = document.getElementById('order-items');
            
            if (!order.items || order.items.length === 0) {
                orderItemsDiv.innerHTML = '<div class="empty-state">Tato objednávka neobsahuje žádné položky</div>';
                return;
            }
            
            let itemsHTML = '<div class="order-items">';
            
            order.items.forEach(item => {
                const totalPrice = item.price * item.quantity;
                
                itemsHTML += \`
                    <div class="item">
                        <div class="item-info">
                            <div class="item-name">\${item.product_name}</div>
                            <div class="item-details">
                                Cena za kus: \${new Intl.NumberFormat('cs-CZ').format(item.price)} Kč • 
                                Množství: \${item.quantity} ks
                            </div>
                        </div>
                        <div class="item-price">
                            \${new Intl.NumberFormat('cs-CZ').format(totalPrice)} Kč
                        </div>
                    </div>
                \`;
            });
            
            itemsHTML += \`
                <div class="total-section">
                    <div style="margin-bottom: 0.5rem; color: #666;">Celkem k úhradě:</div>
                    <div class="total-amount">\${new Intl.NumberFormat('cs-CZ').format(order.total)} Kč</div>
                </div>
            \`;
            
            itemsHTML += '</div>';
            orderItemsDiv.innerHTML = itemsHTML;
        }

        function getStatusText(status) {
            const statusMap = {
                'pending': 'Čeká',
                'processing': 'Zpracovává se',
                'shipped': 'Odesláno',
                'delivered': 'Doručeno',
                'cancelled': 'Zrušeno'
            };
            return statusMap[status] || status;
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
                if (document.body.contains(alert)) {
                    document.body.removeChild(alert);
                }
            }, 5000);
        }
    </script>
</body>
</html>`;