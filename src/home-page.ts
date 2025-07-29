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

    document.addEventListener('DOMContentLoaded', loadStats);
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