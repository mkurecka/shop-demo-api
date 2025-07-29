import { createUnifiedPage } from './shared/layout';

const CUSTOMERS_STYLES = `
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

    .customers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .customer-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        cursor: pointer;
        border: 1px solid #e2e8f0;
    }

    .customer-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    .customer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .customer-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        margin-right: 1rem;
    }

    .customer-info {
        flex: 1;
    }

    .customer-name {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.25rem;
    }

    .customer-email {
        color: #667eea;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }

    .customer-phone {
        color: #666;
        font-size: 0.9rem;
    }

    .customer-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
    }

    .stat-item {
        text-align: center;
    }

    .stat-value {
        font-size: 1.1rem;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 0.25rem;
    }

    .stat-label {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
    }

    .customers-table {
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

    .stats-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .overview-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
    }

    .overview-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 0.5rem;
    }

    .overview-label {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
    }

    @media (max-width: 768px) {
        .search-form {
            grid-template-columns: 1fr;
        }
        
        .customers-grid {
            grid-template-columns: 1fr;
        }
        
        .customer-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .customer-avatar {
            margin-right: 0;
            margin-bottom: 0.5rem;
        }
        
        .stats-overview {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;

const CUSTOMERS_SCRIPTS = `
    let allCustomers = [];
    let filteredCustomers = [];
    let currentPage = 1;
    const customersPerPage = 12;

    async function loadCustomers() {
        try {
            showLoading();
            
            const response = await fetch(API_BASE + '/customers');
            const data = await response.json();
            
            if (data.success) {
                allCustomers = data.data || [];
                filteredCustomers = [...allCustomers];
                updateStats();
                displayCustomers();
                hideLoading();
                document.getElementById('customers-content').style.display = 'block';
            } else {
                showError('Nepodařilo se načíst zákazníky');
            }
        } catch (error) {
            console.error('Error loading customers:', error);
            showError('Chyba při načítání zákazníků');
        }
    }

    function displayCustomers() {
        const container = document.getElementById('customers-container');
        
        if (filteredCustomers.length === 0) {
            container.innerHTML = \`
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <h3>Žádní zákazníci nenalezeni</h3>
                    <p>Zkuste změnit vyhledávací kritéria</p>
                </div>
            \`;
            return;
        }

        const startIndex = (currentPage - 1) * customersPerPage;
        const endIndex = startIndex + customersPerPage;
        const customersToShow = filteredCustomers.slice(startIndex, endIndex);

        container.innerHTML = customersToShow.map(customer => \`
            <div class="customer-card" onclick="openCustomerDetail(\${customer.id})">
                <div class="customer-header">
                    <div style="display: flex; align-items: center; flex: 1;">
                        <div class="customer-avatar">
                            \${getInitials(customer.first_name, customer.last_name)}
                        </div>
                        <div class="customer-info">
                            <div class="customer-name">\${customer.first_name} \${customer.last_name}</div>
                            <div class="customer-email">\${customer.email}</div>
                            <div class="customer-phone">\${customer.phone || 'Telefon neuvedený'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="customer-stats">
                    <div class="stat-item">
                        <div class="stat-value">\${customer.orders_count || 0}</div>
                        <div class="stat-label">Objednávky</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">\${formatDate(customer.created_at)}</div>
                        <div class="stat-label">Registrace</div>
                    </div>
                </div>
            </div>
        \`).join('');

        updatePagination();
    }

    function updateStats() {
        const totalCustomers = allCustomers.length;
        const recentCustomers = allCustomers.filter(c => {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return new Date(c.created_at) > oneWeekAgo;
        }).length;

        document.getElementById('total-customers').textContent = totalCustomers;
        document.getElementById('recent-customers').textContent = recentCustomers;
        document.getElementById('active-customers').textContent = Math.floor(totalCustomers * 0.7); // Demo calculation
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        pageInfo.textContent = \`Stránka \${currentPage} z \${totalPages}\`;
    }

    function searchCustomers() {
        const name = document.getElementById('search-name').value.trim().toLowerCase();
        const email = document.getElementById('search-email').value.trim().toLowerCase();
        const phone = document.getElementById('search-phone').value.trim();

        filteredCustomers = allCustomers.filter(customer => {
            const fullName = \`\${customer.first_name} \${customer.last_name}\`.toLowerCase();
            const matchesName = !name || fullName.includes(name);
            const matchesEmail = !email || customer.email.toLowerCase().includes(email);
            const matchesPhone = !phone || (customer.phone && customer.phone.includes(phone));
            
            return matchesName && matchesEmail && matchesPhone;
        });

        currentPage = 1;
        displayCustomers();
    }

    function clearSearch() {
        document.getElementById('search-name').value = '';
        document.getElementById('search-email').value = '';
        document.getElementById('search-phone').value = '';
        filteredCustomers = [...allCustomers];
        currentPage = 1;
        displayCustomers();
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayCustomers();
        }
    }

    function nextPage() {
        const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayCustomers();
        }
    }

    function openCustomerDetail(customerId) {
        window.location.href = \`/customers/\${customerId}\`;
    }

    function getInitials(firstName, lastName) {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('cs-CZ');
    }

    function showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('customers-content').style.display = 'none';
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    document.addEventListener('DOMContentLoaded', loadCustomers);
`;

const CUSTOMERS_CONTENT = `
    <div class="page-content">
        <div class="section-header">
            <h2>👥 Zákazníci</h2>
            <button class="btn btn-success" onclick="alert('Demo: Nový zákazník')">
                ➕ Nový zákazník
            </button>
        </div>

        <div class="stats-overview">
            <div class="overview-card">
                <div class="overview-value" id="total-customers">-</div>
                <div class="overview-label">Celkem zákazníků</div>
            </div>
            <div class="overview-card">
                <div class="overview-value" id="recent-customers">-</div>
                <div class="overview-label">Nových tento týden</div>
            </div>
            <div class="overview-card">
                <div class="overview-value" id="active-customers">-</div>
                <div class="overview-label">Aktivních zákazníků</div>
            </div>
        </div>

        <div class="search-section">
            <div class="search-form">
                <div class="form-group">
                    <label>Jméno a příjmení</label>
                    <input type="text" id="search-name" class="search-input" placeholder="Hledat podle jména...">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="search-email" class="search-input" placeholder="Hledat podle emailu...">
                </div>
                <div class="form-group">
                    <label>Telefon</label>
                    <input type="text" id="search-phone" class="search-input" placeholder="Telefon...">
                </div>
                <div class="form-group">
                    <label>&nbsp;</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" onclick="searchCustomers()">🔍 Hledat</button>
                        <button class="btn btn-secondary" onclick="clearSearch()">✖️ Vymazat</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Načítání zákazníků...</p>
        </div>

        <div id="customers-content" style="display: none;">
            <div class="customers-table">
                <div class="table-header">
                    <h3 class="table-title">Seznam zákazníků</h3>
                </div>
                <div class="customers-grid" id="customers-container">
                    <!-- Customers will be loaded here -->
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

export const customersPageHTML = createUnifiedPage(
    'Zákazníci',
    '👥 Správa zákazníků',
    'Spravujte zákaznickou databázi a profily',
    'customers',
    CUSTOMERS_CONTENT,
    CUSTOMERS_STYLES,
    CUSTOMERS_SCRIPTS
);