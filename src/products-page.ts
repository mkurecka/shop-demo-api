import { createUnifiedPage } from './shared/layout';

const PRODUCTS_STYLES = `
    .products-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .filter-section {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        border: 1px solid #e2e8f0;
    }

    .filter-header {
        display: flex;
        justify-content: between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .filter-toggle {
        background: #667eea;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s;
    }

    .filter-toggle:hover {
        background: #5a67d8;
    }

    .basic-search {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 1rem;
    }

    .advanced-filters {
        display: none;
        border-top: 1px solid #e2e8f0;
        padding-top: 1.5rem;
        margin-top: 1.5rem;
    }

    .advanced-filters.show {
        display: block;
    }

    .filter-group {
        margin-bottom: 1.5rem;
    }

    .filter-label {
        display: block;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    .filter-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .price-range {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .price-input {
        width: 100px;
        padding: 0.5rem;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        font-size: 0.9rem;
    }

    .attribute-options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .attribute-option {
        padding: 0.5rem 1rem;
        border: 2px solid #e2e8f0;
        background: white;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .attribute-option:hover {
        border-color: #667eea;
        background: #f0f4ff;
    }

    .attribute-option.selected {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    .color-swatch {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #ccc;
    }

    .filter-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
    }

    .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .results-count {
        color: #666;
        font-size: 0.9rem;
    }

    .share-filters {
        background: #48bb78;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s;
    }

    .share-filters:hover {
        background: #38a169;
    }

    .search-input {
        flex: 1;
        min-width: 200px;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        font-size: 1rem;
    }

    .search-input:focus {
        outline: none;
        border-color: #667eea;
    }

    .category-select {
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        background: white;
        cursor: pointer;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .product-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        cursor: pointer;
        border: 1px solid #e2e8f0;
    }

    .product-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .product-image {
        width: 100%;
        height: 200px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: #adb5bd;
        border-bottom: 1px solid #e2e8f0;
    }

    .product-info {
        padding: 1.5rem;
    }

    .product-category {
        font-size: 0.8rem;
        text-transform: uppercase;
        color: #667eea;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .product-name {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
        line-height: 1.3;
    }

    .product-description {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
    }

    .product-price {
        font-size: 1.3rem;
        font-weight: bold;
        color: #667eea;
    }

    .product-stock {
        font-size: 0.85rem;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-weight: 500;
    }

    .product-stock.in-stock {
        background: #c6f6d5;
        color: #276749;
    }

    .product-stock.low-stock {
        background: #faf089;
        color: #744210;
    }

    .product-stock.out-of-stock {
        background: #fed7d7;
        color: #c53030;
    }

    .variants-indicator {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #667eea;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .sort-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .sort-label {
        font-weight: 500;
        color: #4a5568;
    }

    .sort-select {
        padding: 0.5rem;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        background: white;
        cursor: pointer;
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

    .pagination .page-info {
        color: #666;
        font-size: 0.9rem;
    }

    .stats-bar {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .stat-item {
        text-align: center;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #667eea;
    }

    .stat-label {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
    }

    @media (max-width: 768px) {
        .search-form {
            flex-direction: column;
            align-items: stretch;
        }
        
        .products-grid {
            grid-template-columns: 1fr;
        }
        
        .sort-controls {
            flex-direction: column;
            align-items: stretch;
        }
        
        .stats-bar {
            flex-direction: column;
            gap: 1rem;
        }
        
        .pagination {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
`;

const PRODUCTS_SCRIPTS = `
    let currentProducts = [];
    let currentFilters = {
        query: '',
        category: '',
        min_price: '',
        max_price: '',
        color: '',
        size: '',
        memory: '',
        material: '',
        in_stock: false,
        sort_by: 'created_at',
        sort_order: 'DESC'
    };
    let currentPage = 1;
    let totalCount = 0;
    let availableFilters = {};

    // Load filters from URL on page load
    function loadFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        Object.keys(currentFilters).forEach(key => {
            const value = urlParams.get(key);
            if (value !== null) {
                if (key === 'in_stock') {
                    currentFilters[key] = value === 'true';
                } else {
                    currentFilters[key] = value;
                }
            }
        });
        
        // Update UI elements
        updateFilterUI();
    }

    // Update URL with current filters
    function updateURL() {
        const params = new URLSearchParams();
        
        Object.keys(currentFilters).forEach(key => {
            if (currentFilters[key] && currentFilters[key] !== '') {
                params.set(key, currentFilters[key]);
            }
        });
        
        const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.pushState({}, '', newURL);
    }

    // Update filter UI elements
    function updateFilterUI() {
        document.getElementById('search-input').value = currentFilters.query || '';
        document.getElementById('category-select').value = currentFilters.category || '';
        document.getElementById('min-price').value = currentFilters.min_price || '';
        document.getElementById('max-price').value = currentFilters.max_price || '';
        document.getElementById('in-stock-only').checked = currentFilters.in_stock || false;
        
        // Update attribute selections
        updateAttributeSelections();
    }

    function updateAttributeSelections() {
        ['color', 'size', 'memory', 'material'].forEach(attr => {
            const options = document.querySelectorAll(\`.attribute-option[data-attribute="\${attr}"]\`);
            options.forEach(option => {
                if (option.dataset.value === currentFilters[attr]) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
        });
    }

    async function loadProducts() {
        try {
            showLoading();
            
            const params = new URLSearchParams();
            
            // Add all current filters to params
            Object.keys(currentFilters).forEach(key => {
                if (currentFilters[key] && currentFilters[key] !== '') {
                    params.append(key, currentFilters[key]);
                }
            });
            
            // Add pagination
            params.append('limit', '12');
            params.append('offset', ((currentPage - 1) * 12).toString());
            
            const url = API_BASE + '/products?' + params.toString();
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                currentProducts = data.data;
                totalCount = data.pagination?.total || data.data.length;
                displayProducts(currentProducts);
                updateResultsHeader();
                updateStats();
                hideLoading();
            } else {
                showError('Nepodařilo se načíst produkty');
                hideLoading();
            }
        } catch (error) {
            console.error('Error loading products:', error);
            showError('Chyba při načítání produktů');
            hideLoading();
        }
    }

    function displayProducts(products) {
        const grid = document.getElementById('products-grid');
        
        if (products.length === 0) {
            grid.innerHTML = \`
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">📦</div>
                    <h3>Žádné produkty nenalezeny</h3>
                    <p>Zkuste změnit vyhledávací kritéria</p>
                </div>
            \`;
            return;
        }
        
        grid.innerHTML = products.map(product => \`
            <div class="product-card" onclick="openProduct(\${product.id})" style="position: relative;">
                <div class="product-image">📦</div>
                <div class="product-info">
                    <div class="product-category">\${product.category}</div>
                    <h3 class="product-name">\${product.name}</h3>
                    <p class="product-description">\${product.description}</p>
                    <div class="product-footer">
                        <div class="product-price">\${new Intl.NumberFormat('cs-CZ').format(product.price)} Kč</div>
                        <div class="product-stock \${getStockClass(product.stock)}">
                            \${getStockText(product.stock)}
                        </div>
                    </div>
                </div>
            </div>
        \`).join('');
    }

    function getStockClass(stock) {
        if (stock === 0) return 'out-of-stock';
        if (stock <= 5) return 'low-stock';
        return 'in-stock';
    }

    function getStockText(stock) {
        if (stock === 0) return 'Není skladem';
        if (stock <= 5) return \`Pouze \${stock} ks\`;
        return \`Skladem: \${stock} ks\`;
    }

    function updateResultsHeader() {
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = \`Zobrazeno \${currentProducts.length} z \${totalCount} produktů\`;
        }
    }

    function updateStats() {
        const totalProducts = currentProducts.length;
        const inStock = currentProducts.filter(p => p.stock > 0).length;
        const avgPrice = totalProducts > 0 
            ? Math.round(currentProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts)
            : 0;

        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('in-stock').textContent = inStock;
        document.getElementById('avg-price').textContent = new Intl.NumberFormat('cs-CZ').format(avgPrice) + ' Kč';
    }

    function applyFilters() {
        // Get values from form elements
        currentFilters.query = document.getElementById('search-input').value.trim();
        currentFilters.category = document.getElementById('category-select').value;
        currentFilters.min_price = document.getElementById('min-price').value;
        currentFilters.max_price = document.getElementById('max-price').value;
        currentFilters.in_stock = document.getElementById('in-stock-only').checked;
        
        // Get selected attribute values
        ['color', 'size', 'memory', 'material'].forEach(attr => {
            const selected = document.querySelector(\`.attribute-option[data-attribute="\${attr}"].selected\`);
            currentFilters[attr] = selected ? selected.dataset.value : '';
        });
        
        currentPage = 1;
        updateURL();
        loadProducts();
    }

    function clearFilters() {
        // Reset all filters
        Object.keys(currentFilters).forEach(key => {
            if (key === 'in_stock') {
                currentFilters[key] = false;
            } else if (key === 'sort_by') {
                currentFilters[key] = 'created_at';
            } else if (key === 'sort_order') {
                currentFilters[key] = 'DESC';
            } else {
                currentFilters[key] = '';
            }
        });
        
        currentPage = 1;
        updateFilterUI();
        updateURL();
        loadProducts();
    }

    function toggleAdvancedFilters() {
        const advanced = document.getElementById('advanced-filters');
        const button = document.getElementById('filter-toggle');
        
        if (advanced.classList.contains('show')) {
            advanced.classList.remove('show');
            button.textContent = '🔍 Pokročilé filtry';
        } else {
            advanced.classList.add('show');
            button.textContent = '🔼 Skrýt filtry';
        }
    }

    function shareFilters() {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: 'Produkty s filtry',
                url: url
            });
        } else {
            navigator.clipboard.writeText(url).then(() => {
                showNotification('URL zkopírováno do schránky!');
            });
        }
    }

    function selectAttribute(element) {
        const attribute = element.dataset.attribute;
        const value = element.dataset.value;
        
        // Remove selection from other options in same attribute
        document.querySelectorAll(\`.attribute-option[data-attribute="\${attribute}"]\`).forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Toggle this option
        if (currentFilters[attribute] === value) {
            currentFilters[attribute] = '';
        } else {
            element.classList.add('selected');
            currentFilters[attribute] = value;
        }
        
        applyFilters();
    }

    function openProduct(productId) {
        window.location.href = \`/products/\${productId}\`;
    }

    function showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('products-content').style.display = 'none';
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('products-content').style.display = 'block';
    }

    async function loadFilterOptions() {
        try {
            const response = await fetch(API_BASE + '/products/filters');
            const data = await response.json();
            
            if (data.success) {
                availableFilters = data.data;
                renderFilterOptions();
            }
        } catch (error) {
            console.error('Error loading filters:', error);
        }
    }

    function renderFilterOptions() {
        // Render categories
        const categorySelect = document.getElementById('category-select');
        if (categorySelect && availableFilters.categories) {
            categorySelect.innerHTML = '<option value="">Všechny kategorie</option>' +
                availableFilters.categories.map(cat => \`<option value="\${cat}">\${cat}</option>\`).join('');
        }

        // Set price range
        if (availableFilters.price_range) {
            const minPriceInput = document.getElementById('min-price');
            const maxPriceInput = document.getElementById('max-price');
            if (minPriceInput) minPriceInput.placeholder = \`Min: \${availableFilters.price_range.min} Kč\`;
            if (maxPriceInput) maxPriceInput.placeholder = \`Max: \${availableFilters.price_range.max} Kč\`;
        }

        // Render attribute options
        if (availableFilters.attributes) {
            availableFilters.attributes.forEach(attribute => {
                const container = document.getElementById(\`\${attribute.name}-options\`);
                if (container) {
                    container.innerHTML = attribute.options.map(option => \`
                        <div class="attribute-option" 
                             data-attribute="\${attribute.name}" 
                             data-value="\${option.value}"
                             onclick="selectAttribute(this)">
                            \${attribute.attribute_type === 'color' && option.hex_color ? 
                                \`<div class="color-swatch" style="background-color: \${option.hex_color}"></div>\` : ''}
                            \${option.display_value} (\${option.product_count})
                        </div>
                    \`).join('');
                }
            });
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 1rem;
            border-radius: 6px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        \`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    // Load products and filter options on page load
    document.addEventListener('DOMContentLoaded', function() {
        loadFiltersFromURL();
        loadFilterOptions();
        loadProducts();
        
        // Add enter key support for search and price inputs
        ['search-input', 'min-price', 'max-price'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        applyFilters();
                    }
                });
            }
        });
        
        // Add change listeners for category and stock checkbox
        const categorySelect = document.getElementById('category-select');
        const stockCheckbox = document.getElementById('in-stock-only');
        
        if (categorySelect) {
            categorySelect.addEventListener('change', applyFilters);
        }
        
        if (stockCheckbox) {
            stockCheckbox.addEventListener('change', applyFilters);
        }
    });
`;

const PRODUCTS_CONTENT = `
    <div class="page-content">
        <div class="section-header">
            <h2>📦 Produkty</h2>
            <button class="btn btn-success" onclick="alert('Demo: Přidání produktu')">
                ➕ Přidat produkt
            </button>
        </div>

        <div class="stats-bar">
            <div class="stat-item">
                <div class="stat-value" id="total-products">-</div>
                <div class="stat-label">Produkty</div>
            </div>
            <div class="stat-item">
                <div class="stat-value" id="in-stock">-</div>
                <div class="stat-label">Skladem</div>
            </div>
            <div class="stat-item">
                <div class="stat-value" id="avg-price">-</div>
                <div class="stat-label">Průměrná cena</div>
            </div>
        </div>

        <div class="filter-section">
            <div class="filter-header">
                <h3>🔍 Filtry</h3>
                <button id="filter-toggle" class="filter-toggle" onclick="toggleAdvancedFilters()">
                    🔍 Pokročilé filtry
                </button>
            </div>

            <div class="basic-search">
                <input type="text" id="search-input" class="search-input" placeholder="Hledat produkty...">
                <select id="category-select" class="category-select">
                    <option value="">Všechny kategorie</option>
                </select>
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="in-stock-only">
                    <span>Pouze skladem</span>
                </label>
            </div>

            <div id="advanced-filters" class="advanced-filters">
                <div class="filter-group">
                    <label class="filter-label">💰 Cenové rozpětí</label>
                    <div class="price-range">
                        <input type="number" id="min-price" class="price-input" placeholder="Min cena">
                        <span>-</span>
                        <input type="number" id="max-price" class="price-input" placeholder="Max cena">
                        <span>Kč</span>
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">🎨 Barva</label>
                    <div class="attribute-options" id="color-options">
                        <!-- Color options will be loaded here -->
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">📏 Velikost</label>
                    <div class="attribute-options" id="size-options">
                        <!-- Size options will be loaded here -->
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">💾 Paměť</label>
                    <div class="attribute-options" id="memory-options">
                        <!-- Memory options will be loaded here -->
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">🧵 Materiál</label>
                    <div class="attribute-options" id="material-options">
                        <!-- Material options will be loaded here -->
                    </div>
                </div>

                <div class="filter-actions">
                    <button class="btn btn-secondary" onclick="clearFilters()">
                        ✖️ Vymazat filtry
                    </button>
                    <button class="btn" onclick="applyFilters()">
                        🔍 Použít filtry
                    </button>
                </div>
            </div>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Načítání produktů...</p>
        </div>

        <div id="products-content">
            <div class="results-header">
                <div class="results-count" id="results-count">
                    Načítání...
                </div>
                <button class="share-filters" onclick="shareFilters()">
                    🔗 Sdílet filtry
                </button>
            </div>

            <div class="products-grid" id="products-grid">
                <!-- Products will be loaded here -->
            </div>
        </div>
    </div>
`;

export const productsPageHTML = createUnifiedPage(
    'Produkty',
    '📦 Správa produktů',
    'Procházejte a spravujte produkty v e-shopu',
    'products',
    PRODUCTS_CONTENT,
    PRODUCTS_STYLES,
    PRODUCTS_SCRIPTS
);