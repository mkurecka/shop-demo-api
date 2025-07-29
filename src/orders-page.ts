import { createUnifiedPage } from './shared/layout';

const ORDERS_STYLES = `
    .search-section {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        border: 1px solid #e2e8f0;
    }

    .search-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        align-items: end;
    }

    .search-input {
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s;
    }

    .search-input:focus {
        outline: none;
        border-color: #667eea;
    }

    .orders-table {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow: hidden;
        margin-bottom: 2rem;
    }

    .table-header {
        background: #f8f9fa;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .table-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
        margin: 0;
    }

    .orders-list {
        max-height: 600px;
        overflow-y: auto;
    }

    .order-item {
        padding: 1.5rem;
        border-bottom: 1px solid #f1f3f4;
        transition: background-color 0.3s;
        cursor: pointer;
    }

    .order-item:hover {
        background-color: #f8f9fa;
    }

    .order-item:last-child {
        border-bottom: none;
    }

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .order-number {
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
    }

    .order-status {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
    }

    .status-pending { background: #faf089; color: #744210; }
    .status-processing { background: #bee3f8; color: #2c5282; }
    .status-shipped { background: #c6f6d5; color: #276749; }
    .status-delivered { background: #c6f6d5; color: #276749; }
    .status-cancelled { background: #fed7d7; color: #c53030; }

    .order-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .order-detail {
        display: flex;
        flex-direction: column;
    }

    .detail-label {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 0.25rem;
    }

    .detail-value {
        font-weight: 500;
        color: #333;
    }

    .order-items {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 6px;
        margin-top: 1rem;
    }

    .items-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .items-list {
        font-size: 0.9rem;
        color: #666;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
        padding: 1rem;
    }

    .pagination button {
        padding: 0.5rem 1rem;
        border: 2px solid #e2e8f0;
        background: white;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.3s;
    }

    .pagination button:hover:not(:disabled) {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .page-info {
        color: #666;
        font-size: 0.9rem;
    }

    .stats-bar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

    .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 0.5rem;
    }

    .stat-label {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
    }

    @media (max-width: 768px) {
        .search-form {
            grid-template-columns: 1fr;
        }
        
        .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .order-details {
            grid-template-columns: 1fr;
        }
        
        .stats-bar {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;

const ORDERS_SCRIPTS = `
    let allOrders = [];
    let filteredOrders = [];
    let currentPage = 1;
    const ordersPerPage = 10;

    async function loadOrders() {
        try {
            showLoading();
            
            const response = await fetch(API_BASE + '/orders');
            const data = await response.json();
            
            if (data.success) {
                allOrders = data.data || [];
                filteredOrders = [...allOrders];
                updateStats();
                displayOrders();
                hideLoading();
                document.getElementById('orders-content').style.display = 'block';
            } else {
                showError('Nepodařilo se načíst objednávky');
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            showError('Chyba při načítání objednávek');
        }
    }

    function displayOrders() {
        const ordersList = document.getElementById('orders-list');
        
        if (filteredOrders.length === 0) {
            ordersList.innerHTML = \`
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>Žádné objednávky nenalezeny</h3>
                    <p>Zkuste změnit vyhledávací kritéria</p>
                </div>
            \`;
            return;
        }

        const startIndex = (currentPage - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        const ordersToShow = filteredOrders.slice(startIndex, endIndex);

        ordersList.innerHTML = ordersToShow.map(order => \`
            <div class="order-item" onclick="openOrderDetail('\${order.order_number}')">
                <div class="order-header">
                    <div class="order-number">#\${order.order_number}</div>
                    <div class="order-status status-\${order.status}">\${getStatusText(order.status)}</div>
                </div>
                
                <div class="order-details">
                    <div class="order-detail">
                        <div class="detail-label">Zákazník</div>
                        <div class="detail-value">\${order.customer_email}</div>
                    </div>
                    <div class="order-detail">
                        <div class="detail-label">Telefon</div>
                        <div class="detail-value">\${order.customer_phone}</div>
                    </div>
                    <div class="order-detail">
                        <div class="detail-label">Celkem</div>
                        <div class="detail-value">\${formatPrice(order.total_amount)} Kč</div>
                    </div>
                    <div class="order-detail">
                        <div class="detail-label">Datum</div>
                        <div class="detail-value">\${formatDate(order.created_at)}</div>
                    </div>
                </div>

                <div class="order-items">
                    <div class="items-title">Položky objednávky:</div>
                    <div class="items-list">
                        \${order.items ? order.items.map(item => 
                            \`\${item.quantity}× \${item.product_name || 'Produkt'}\`
                        ).join(', ') : 'Načítání položek...'}
                    </div>
                </div>
            </div>
        \`).join('');

        updatePagination();
    }

    function updateStats() {
        const totalOrders = allOrders.length;
        const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
        const completedOrders = allOrders.filter(o => o.status === 'delivered').length;
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('pending-orders').textContent = pendingOrders;
        document.getElementById('completed-orders').textContent = completedOrders;
        document.getElementById('total-revenue').textContent = formatPrice(totalRevenue) + ' Kč';
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        pageInfo.textContent = \`Stránka \${currentPage} z \${totalPages}\`;
    }

    function searchOrders() {
        const email = document.getElementById('search-email').value.trim().toLowerCase();
        const orderNumber = document.getElementById('search-order').value.trim().toLowerCase();
        const phone = document.getElementById('search-phone').value.trim();

        filteredOrders = allOrders.filter(order => {
            const matchesEmail = !email || order.customer_email.toLowerCase().includes(email);
            const matchesOrder = !orderNumber || order.order_number.toLowerCase().includes(orderNumber);
            const matchesPhone = !phone || order.customer_phone.includes(phone);
            
            return matchesEmail && matchesOrder && matchesPhone;
        });

        currentPage = 1;
        displayOrders();
    }

    function clearSearch() {
        document.getElementById('search-email').value = '';
        document.getElementById('search-order').value = '';
        document.getElementById('search-phone').value = '';
        filteredOrders = [...allOrders];
        currentPage = 1;
        displayOrders();
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayOrders();
        }
    }

    function nextPage() {
        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayOrders();
        }
    }

    function openOrderDetail(orderNumber) {
        window.location.href = \`/orders/\${orderNumber}\`;
    }

    function getStatusText(status) {
        const statusMap = {
            'pending': 'Čekající',
            'processing': 'Zpracovává se',
            'shipped': 'Odesláno',
            'delivered': 'Doručeno',
            'cancelled': 'Zrušeno'
        };
        return statusMap[status] || status;
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('cs-CZ').format(price || 0);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('cs-CZ');
    }

    function showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('orders-content').style.display = 'none';
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    document.addEventListener('DOMContentLoaded', loadOrders);
`;

const ORDERS_CONTENT = `
    <div class="page-content">
        <div class="section-header">
            <h2>📋 Objednávky</h2>
            <button class="btn btn-success" onclick="alert('Demo: Nová objednávka')">
                ➕ Nová objednávka
            </button>
        </div>

        <div class="stats-bar">
            <div class="stat-card">
                <div class="stat-value" id="total-orders">-</div>
                <div class="stat-label">Celkem objednávek</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="pending-orders">-</div>
                <div class="stat-label">Čekající</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="completed-orders">-</div>
                <div class="stat-label">Dokončené</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="total-revenue">-</div>
                <div class="stat-label">Celkové tržby</div>
            </div>
        </div>

        <div class="search-section">
            <div class="search-form">
                <div class="form-group">
                    <label>Email zákazníka</label>
                    <input type="email" id="search-email" class="search-input" placeholder="Hledat podle emailu...">
                </div>
                <div class="form-group">
                    <label>Číslo objednávky</label>
                    <input type="text" id="search-order" class="search-input" placeholder="Číslo objednávky...">
                </div>
                <div class="form-group">
                    <label>Telefon</label>
                    <input type="text" id="search-phone" class="search-input" placeholder="Telefon...">
                </div>
                <div class="form-group">
                    <label>&nbsp;</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" onclick="searchOrders()">🔍 Hledat</button>
                        <button class="btn btn-secondary" onclick="clearSearch()">✖️ Vymazat</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Načítání objednávek...</p>
        </div>

        <div id="orders-content" style="display: none;">
            <div class="orders-table">
                <div class="table-header">
                    <h3 class="table-title">Seznam objednávek</h3>
                </div>
                <div class="orders-list" id="orders-list">
                    <!-- Orders will be loaded here -->
                </div>
            </div>

            <div class="pagination">
                <button id="prev-page" onclick="prevPage()">← Předchozí</button>
                <span class="page-info" id="page-info">Stránka 1 z 1</span>
                <button id="next-page" onclick="nextPage()">Následující →</button>
            </div>
        </div>
    </div>
`;

export const ordersPageHTML = createUnifiedPage(
    'Objednávky',
    '📋 Správa objednávek',
    'Sledujte a spravujte objednávky zákazníků',
    'orders',
    ORDERS_CONTENT,
    ORDERS_STYLES,
    ORDERS_SCRIPTS
);