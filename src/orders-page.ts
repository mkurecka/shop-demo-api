// Orders page HTML content as a string
export const ordersPageHTML = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Objednávky - Demo E-shop</title>
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
        }

        .back-button:hover {
            background: rgba(255,255,255,0.3);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
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
            <h1>📦 Objednávky</h1>
            <p>Přehled všech objednávek v systému</p>
            <button class="back-button" onclick="window.location.href='/'">← Zpět na hlavní stránku</button>
        </div>
    </div>

    <div class="container">
        <div class="card">
            <div class="card-header">
                <h2>📦 Seznam objednávek</h2>
                <button class="btn" onclick="loadOrders()">🔄 Načíst znovu</button>
            </div>
            <div class="card-body">
                <div id="orders-table">
                    <div class="loading">Načítání objednávek...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        const API_BASE = window.location.origin + '/api';

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadOrders();
        });

        async function loadOrders() {
            try {
                const response = await fetch(API_BASE + '/orders');
                const data = await response.json();
                
                if (data.success) {
                    renderOrdersTable(data.data);
                } else {
                    showError('Chyba při načítání objednávek: ' + (data.error?.message || 'Neznámá chyba'));
                }
            } catch (error) {
                console.error('Error loading orders:', error);
                document.getElementById('orders-table').innerHTML = '<div class="error">Chyba při načítání objednávek</div>';
            }
        }

        function renderOrdersTable(orders) {
            const table = document.getElementById('orders-table');
            
            if (!orders || orders.length === 0) {
                table.innerHTML = '<div style="text-align: center; color: #666; padding: 2rem;">Žádné objednávky k zobrazení</div>';
                return;
            }
            
            let tableHTML = '<table class="table"><thead><tr><th>Číslo objednávky</th><th>Zákazník</th><th>Datum</th><th>Stav</th><th>Celkem</th></tr></thead><tbody>';
            
            orders.forEach(order => {
                const date = new Date(order.created_at).toLocaleDateString('cs-CZ');
                const total = new Intl.NumberFormat('cs-CZ').format(order.total) + ' Kč';
                const statusClass = \`status-\${order.status}\`;
                const statusText = getStatusText(order.status);
                
                tableHTML += \`<tr onclick="window.location.href='/orders/\${order.order_number}'" style="cursor: pointer;">
                    <td><strong>\${order.order_number}</strong></td>
                    <td>\${order.customer_email}</td>
                    <td>\${date}</td>
                    <td><span class="status-badge \${statusClass}">\${statusText}</span></td>
                    <td><strong>\${total}</strong></td>
                </tr>\`;
            });
            
            tableHTML += '</tbody></table>';
            table.innerHTML = tableHTML;
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