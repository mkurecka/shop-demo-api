// Customer detail page HTML content as a string
export const customerDetailPageHTML = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail zákazníka - Demo E-shop</title>
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

        .customer-info {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }

        .customer-info h3 {
            margin: 0 0 0.5rem 0;
            color: #333;
        }

        .customer-info p {
            margin: 0.25rem 0;
            color: #666;
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

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .status-pending { background: #fef3c7; color: #92400e; }
        .status-processing { background: #dbeafe; color: #1e40af; }
        .status-shipped { background: #d1fae5; color: #065f46; }
        .status-delivered { background: #dcfce7; color: #166534; }
        .status-cancelled { background: #fecaca; color: #991b1b; }

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
            
            .table {
                font-size: 0.9rem;
            }
            
            .table th,
            .table td {
                padding: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>👤 Detail zákazníka</h1>
            <p>Detailní zobrazení zákazníka a jeho objednávek</p>
            <button class="back-button" onclick="window.location.href='/customers'">← Zpět na seznam zákazníků</button>
            <button class="back-button" onclick="window.location.href='/'">🏠 Hlavní stránka</button>
        </div>
    </div>

    <div class="container">
        <div class="card">
            <div class="card-header">
                <h2>📋 Informace o zákazníkovi</h2>
            </div>
            <div class="card-body">
                <div id="customer-info">
                    <div class="loading">Načítání informací o zákazníkovi...</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>📦 Objednávky zákazníka</h2>
            </div>
            <div class="card-body">
                <div id="customer-orders">
                    <div class="loading">Načítání objednávek zákazníka...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        const API_BASE = window.location.origin + '/api';
        const customerId = '{{CUSTOMER_ID}}'; // Will be replaced by server

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadCustomerDetail();
            loadCustomerOrders();
        });

        async function loadCustomerDetail() {
            try {
                const response = await fetch(API_BASE + \`/customers/\${customerId}\`);
                const data = await response.json();
                
                if (data.success) {
                    renderCustomerInfo(data.data);
                } else {
                    showError('Zákazník nebyl nalezen');
                }
            } catch (error) {
                console.error('Error loading customer detail:', error);
                document.getElementById('customer-info').innerHTML = '<div class="error">Chyba při načítání detailu zákazníka</div>';
            }
        }

        async function loadCustomerOrders() {
            try {
                // Load orders filtered by customer email first we need to get customer email
                const customerResponse = await fetch(API_BASE + \`/customers/\${customerId}\`);
                const customerData = await customerResponse.json();
                
                if (customerData.success) {
                    const ordersResponse = await fetch(API_BASE + \`/orders?email=\${customerData.data.email}\`);
                    const ordersData = await ordersResponse.json();
                    
                    if (ordersData.success) {
                        renderCustomerOrders(ordersData.data);
                    } else {
                        document.getElementById('customer-orders').innerHTML = '<div class="empty-state">Tento zákazník nemá žádné objednávky</div>';
                    }
                }
            } catch (error) {
                console.error('Error loading customer orders:', error);
                document.getElementById('customer-orders').innerHTML = '<div class="error">Chyba při načítání objednávek zákazníka</div>';
            }
        }

        function renderCustomerInfo(customer) {
            const customerInfoDiv = document.getElementById('customer-info');
            const registrationDate = new Date(customer.created_at).toLocaleString('cs-CZ');
            
            customerInfoDiv.innerHTML = \`
                <div class="customer-info">
                    <h3>\${customer.first_name} \${customer.last_name}</h3>
                    <p><strong>Email:</strong> \${customer.email}</p>
                    <p><strong>Telefon:</strong> \${customer.phone}</p>
                    <p><strong>Adresa:</strong> \${customer.address}</p>
                    <p><strong>Město:</strong> \${customer.city}</p>
                    <p><strong>PSČ:</strong> \${customer.postal_code}</p>
                    <p><strong>Registrace:</strong> \${registrationDate}</p>
                </div>
            \`;
        }

        function renderCustomerOrders(orders) {
            const ordersDiv = document.getElementById('customer-orders');
            
            if (!orders || orders.length === 0) {
                ordersDiv.innerHTML = '<div class="empty-state">Tento zákazník nemá žádné objednávky</div>';
                return;
            }
            
            let tableHTML = '<table class="table"><thead><tr><th>Číslo objednávky</th><th>Datum</th><th>Stav</th><th>Celkem</th></tr></thead><tbody>';
            
            orders.forEach(order => {
                const date = new Date(order.created_at).toLocaleDateString('cs-CZ');
                const total = new Intl.NumberFormat('cs-CZ').format(order.total) + ' Kč';
                const statusClass = \`status-\${order.status}\`;
                const statusText = getStatusText(order.status);
                
                tableHTML += \`<tr onclick="window.location.href='/orders/\${order.order_number}'" style="cursor: pointer;">
                    <td><strong>\${order.order_number}</strong></td>
                    <td>\${date}</td>
                    <td><span class="status-badge \${statusClass}">\${statusText}</span></td>
                    <td><strong>\${total}</strong></td>
                </tr>\`;
            });
            
            tableHTML += '</tbody></table>';
            ordersDiv.innerHTML = tableHTML;
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