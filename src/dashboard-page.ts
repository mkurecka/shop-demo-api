// Dashboard page HTML content as a string
export const dashboardPageHTML = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Demo E-shop</title>
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

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>📊 Dashboard</h1>
            <p>Přehled statistik e-shopu</p>
            <button class="back-button" onclick="window.location.href='/'">← Zpět na hlavní stránku</button>
        </div>
    </div>

    <div class="container">
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

    <script>
        const API_BASE = window.location.origin + '/api';

        document.addEventListener('DOMContentLoaded', function() {
            loadDashboardData();
        });

        async function loadDashboardData() {
            try {
                const [productsRes, customersRes, ordersRes] = await Promise.all([
                    fetch(API_BASE + '/products'),
                    fetch(API_BASE + '/customers'),
                    fetch(API_BASE + '/orders')
                ]);

                const [productsData, customersData, ordersData] = await Promise.all([
                    productsRes.json(),
                    customersRes.json(),
                    ordersRes.json()
                ]);

                if (productsData.success) {
                    document.getElementById('total-products').textContent = productsData.data.length;
                }

                if (customersData.success) {
                    document.getElementById('total-customers').textContent = customersData.data.length;
                }

                if (ordersData.success) {
                    document.getElementById('total-orders').textContent = ordersData.data.length;
                    const totalRevenue = ordersData.data.reduce((sum, order) => sum + (order.total || 0), 0);
                    document.getElementById('total-revenue').textContent = new Intl.NumberFormat('cs-CZ').format(totalRevenue) + ' Kč';
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }
    </script>
</body>
</html>`;