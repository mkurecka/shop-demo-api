import { createUnifiedPage } from './shared/layout';

const DASHBOARD_STYLES = `
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
        border-left: 4px solid;
    }

    .metric-card.products { border-left-color: #667eea; }
    .metric-card.orders { border-left-color: #48bb78; }
    .metric-card.customers { border-left-color: #ed8936; }
    .metric-card.revenue { border-left-color: #38b2ac; }

    .metric-value {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .metric-card.products .metric-value { color: #667eea; }
    .metric-card.orders .metric-value { color: #48bb78; }
    .metric-card.customers .metric-value { color: #ed8936; }
    .metric-card.revenue .metric-value { color: #38b2ac; }

    .metric-label {
        color: #666;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
    }

    .metric-change {
        font-size: 0.8rem;
        font-weight: 500;
    }

    .metric-change.positive { color: #48bb78; }
    .metric-change.negative { color: #f56565; }

    .charts-section {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .chart-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .chart-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .chart-placeholder {
        height: 300px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 1.1rem;
        border: 2px dashed #dee2e6;
    }

    .recent-activity {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow: hidden;
    }

    .activity-header {
        background: #f8f9fa;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .activity-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
        margin: 0;
    }

    .activity-list {
        max-height: 400px;
        overflow-y: auto;
    }

    .activity-item {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #f1f3f4;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .activity-item:last-child {
        border-bottom: none;
    }

    .activity-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        flex-shrink: 0;
    }

    .activity-icon.order { background: #c6f6d5; color: #276749; }
    .activity-icon.product { background: #bee3f8; color: #2c5282; }
    .activity-icon.customer { background: #faf089; color: #744210; }

    .activity-details {
        flex: 1;
    }

    .activity-text {
        color: #333;
        font-weight: 500;
        margin-bottom: 0.25rem;
    }

    .activity-time {
        color: #666;
        font-size: 0.8rem;
    }

    @media (max-width: 768px) {
        .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        
        .charts-section {
            grid-template-columns: 1fr;
        }
        
        .chart-placeholder {
            height: 250px;
        }
    }
`;

const DASHBOARD_SCRIPTS = `
    let dashboardData = {
        metrics: {
            products: 0,
            orders: 0,
            customers: 0,
            revenue: 0
        },
        activities: []
    };

    async function loadDashboardData() {
        try {
            showLoading();
            
            // Load metrics from various APIs
            const [productsRes, ordersRes, customersRes] = await Promise.all([
                fetch(API_BASE + '/products').catch(() => ({ ok: false })),
                fetch(API_BASE + '/orders').catch(() => ({ ok: false })),
                fetch(API_BASE + '/customers').catch(() => ({ ok: false }))
            ]);

            // Update products metric
            if (productsRes.ok) {
                const products = await productsRes.json();
                dashboardData.metrics.products = products.data?.length || 0;
            }

            // Update orders metric
            if (ordersRes.ok) {
                const orders = await ordersRes.json();
                dashboardData.metrics.orders = orders.data?.length || 0;
                
                // Calculate revenue
                if (orders.data) {
                    dashboardData.metrics.revenue = orders.data.reduce((sum, order) => {
                        return sum + (order.total_amount || 0);
                    }, 0);
                }
            }

            // Update customers metric
            if (customersRes.ok) {
                const customers = await customersRes.json();
                dashboardData.metrics.customers = customers.data?.length || 0;
            }

            updateDashboard();
            hideLoading();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            hideLoading();
            showError('Chyba při načítání dashboard dat');
        }
    }

    function updateDashboard() {
        // Update metrics
        document.getElementById('products-count').textContent = dashboardData.metrics.products;
        document.getElementById('orders-count').textContent = dashboardData.metrics.orders;
        document.getElementById('customers-count').textContent = dashboardData.metrics.customers;
        document.getElementById('revenue-count').textContent = 
            new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' })
                .format(dashboardData.metrics.revenue);

        // Show dashboard content
        document.getElementById('dashboard-content').style.display = 'block';
    }

    function showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('dashboard-content').style.display = 'none';
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    function navigateTo(path) {
        window.location.href = path;
    }

    document.addEventListener('DOMContentLoaded', loadDashboardData);
`;

const DASHBOARD_CONTENT = `
    <div class="page-content">
        <div class="section-header">
            <h2>📊 Dashboard</h2>
            <button class="btn btn-success" onclick="loadDashboardData()">
                🔄 Obnovit data
            </button>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Načítání dashboard...</p>
        </div>

        <div id="dashboard-content" style="display: none;">
            <div class="metrics-grid">
                <div class="metric-card products">
                    <div class="metric-value" id="products-count">0</div>
                    <div class="metric-label">Produkty</div>
                    <div class="metric-change positive">📈 Celkem v databázi</div>
                </div>

                <div class="metric-card orders">
                    <div class="metric-value" id="orders-count">0</div>
                    <div class="metric-label">Objednávky</div>
                    <div class="metric-change positive">📋 Celkem objednávek</div>
                </div>

                <div class="metric-card customers">
                    <div class="metric-value" id="customers-count">0</div>
                    <div class="metric-label">Zákazníci</div>
                    <div class="metric-change positive">👥 Registrovaní zákazníci</div>
                </div>

                <div class="metric-card revenue">
                    <div class="metric-value" id="revenue-count">0 Kč</div>
                    <div class="metric-label">Tržby</div>
                    <div class="metric-change positive">💰 Celkové tržby</div>
                </div>
            </div>

            <div class="charts-section">
                <div class="chart-container">
                    <div class="chart-title">
                        📈 Prodeje v čase
                    </div>
                    <div class="chart-placeholder">
                        Graf prodejů - demo data
                        <br><small>V produkční verzi by zde byl interaktivní graf</small>
                    </div>
                </div>

                <div class="recent-activity">
                    <div class="activity-header">
                        <h3 class="activity-title">🔔 Poslední aktivita</h3>
                    </div>
                    <div class="activity-list">
                        <div class="activity-item">
                            <div class="activity-icon order">📋</div>
                            <div class="activity-details">
                                <div class="activity-text">Nová objednávka #ORD-001</div>
                                <div class="activity-time">Před 5 minutami</div>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon product">📦</div>
                            <div class="activity-details">
                                <div class="activity-text">Produkt aktualizován</div>
                                <div class="activity-time">Před 1 hodinou</div>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon customer">👤</div>
                            <div class="activity-details">
                                <div class="activity-text">Nový zákazník registrován</div>
                                <div class="activity-time">Před 2 hodinami</div>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon order">📋</div>
                            <div class="activity-details">
                                <div class="activity-text">Objednávka dokončena</div>
                                <div class="activity-time">Před 3 hodinami</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="page-content">
                <div class="section-header">
                    <h2>🚀 Rychlé akce</h2>
                </div>
                <div class="grid grid-4">
                    <div class="card" onclick="navigateTo('/products')" style="cursor: pointer;">
                        <div class="card-header">
                            <h3>📦 Produkty</h3>
                        </div>
                        <p>Spravovat produkty a varianty</p>
                    </div>
                    <div class="card" onclick="navigateTo('/orders')" style="cursor: pointer;">
                        <div class="card-header">
                            <h3>📋 Objednávky</h3>
                        </div>
                        <p>Sledovat objednávky zákazníků</p>
                    </div>
                    <div class="card" onclick="navigateTo('/customers')" style="cursor: pointer;">
                        <div class="card-header">
                            <h3>👥 Zákazníci</h3>
                        </div>
                        <p>Správa zákaznické databáze</p>
                    </div>
                    <div class="card" onclick="navigateTo('/chats')" style="cursor: pointer;">
                        <div class="card-header">
                            <h3>💬 Chaty</h3>
                        </div>
                        <p>Chatbot konverzace</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

export const dashboardPageHTML = createUnifiedPage(
    'Dashboard',
    '📊 Dashboard',
    'Přehled vašeho e-shopu a klíčové metriky',
    'dashboard',
    DASHBOARD_CONTENT,
    DASHBOARD_STYLES,
    DASHBOARD_SCRIPTS
);