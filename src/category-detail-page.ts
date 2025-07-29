// Category detail page HTML content
export const categoryDetailPageHTML = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{CATEGORY_NAME}} - Demo E-shop</title>
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
            line-height: 1.6;
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

        .nav-bar {
            background: white;
            padding: 1rem 2rem;
            margin-bottom: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .nav-bar a {
            text-decoration: none;
            color: #667eea;
            margin-right: 2rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .nav-bar a:hover {
            background-color: #f0f2ff;
        }

        .category-header {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .category-icon {
            font-size: 4rem;
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--category-color, #667eea) 0%, var(--category-color-dark, #5a67d8) 100%);
        }

        .category-info h1 {
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 0.5rem;
        }

        .category-info p {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 1rem;
        }

        .category-stats {
            display: flex;
            gap: 2rem;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--category-color, #667eea);
        }

        .stat-label {
            font-size: 0.9rem;
            color: #666;
        }

        .controls-section {
            background: white;
            padding: 1.5rem 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .sort-controls {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .sort-select {
            padding: 0.5rem 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            background: white;
            cursor: pointer;
        }

        .sort-select:focus {
            outline: none;
            border-color: #667eea;
        }

        .view-toggle {
            display: flex;
            gap: 0.5rem;
        }

        .view-btn {
            padding: 0.5rem 1rem;
            border: 2px solid #e2e8f0;
            background: white;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.3s;
        }

        .view-btn.active {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .products-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .product-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        }

        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .product-image {
            width: 100%;
            height: 200px;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: #ccc;
        }

        .product-info {
            padding: 1.5rem;
        }

        .product-info h3 {
            font-size: 1.2rem;
            color: #333;
            margin-bottom: 0.5rem;
        }

        .product-info p {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            line-height: 1.4;
        }

        .product-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .product-price {
            font-size: 1.3rem;
            font-weight: bold;
            color: #667eea;
        }

        .product-stock {
            font-size: 0.8rem;
            color: #666;
        }

        .product-stock.in-stock {
            color: #48bb78;
        }

        .product-stock.low-stock {
            color: #ed8936;
        }

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 2rem;
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

        .loading {
            text-align: center;
            padding: 3rem;
            color: #666;
        }

        .loading-spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error {
            background: #ffe6e6;
            color: #c33;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .category-header {
                flex-direction: column;
                text-align: center;
            }
            
            .category-stats {
                justify-content: center;
            }
            
            .controls-section {
                flex-direction: column;
                align-items: stretch;
            }
            
            .sort-controls {
                justify-content: center;
            }
            
            .products-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 id="category-title">📦 Kategorie</h1>
        <p id="category-subtitle">Procházejte produkty v této kategorii</p>
    </div>

    <div class="container">
        <div class="nav-bar">
            <a href="/">🏠 Domů</a>
            <a href="/categories">🏷️ Kategorie</a>
            <a href="/products/1">📦 Produkty</a>
            <a href="/orders">📋 Objednávky</a>
            <a href="/info">ℹ️ Informace</a>
        </div>

        <div id="category-header" class="category-header" style="display: none;">
            <!-- Category header will be loaded here -->
        </div>

        <div class="controls-section">
            <div class="sort-controls">
                <label for="sort-select">Řadit podle:</label>
                <select id="sort-select" class="sort-select" onchange="changeSorting()">
                    <option value="created_at-DESC">Nejnovější</option>
                    <option value="created_at-ASC">Nejstarší</option>
                    <option value="name-ASC">Název A-Z</option>
                    <option value="name-DESC">Název Z-A</option>
                    <option value="price-ASC">Cena vzestupně</option>
                    <option value="price-DESC">Cena sestupně</option>
                    <option value="stock-DESC">Skladem nejvíce</option>
                </select>
            </div>
            <div class="view-toggle">
                <button class="view-btn active" onclick="setView('grid')">🔲 Mřížka</button>
                <button class="view-btn" onclick="setView('list')">📋 Seznam</button>
            </div>
        </div>

        <div id="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>Načítání produktů...</p>
        </div>

        <div id="error-message" class="error" style="display: none;">
            <p>Chyba při načítání produktů. Zkuste to prosím znovu.</p>
        </div>

        <div id="products-container" style="display: none;">
            <div id="products-content" class="products-grid">
                <!-- Products will be loaded here -->
            </div>
            
            <div id="pagination" class="pagination">
                <!-- Pagination will be loaded here -->
            </div>
        </div>
    </div>

    <script>
        const API_BASE = window.location.origin + '/api';
        const categoryId = '{{CATEGORY_ID}}';
        let currentPage = 1;
        let currentSort = 'created_at';
        let currentOrder = 'DESC';
        let currentView = 'grid';
        const itemsPerPage = 12;
        
        async function loadCategoryData() {
            try {
                const offset = (currentPage - 1) * itemsPerPage;
                const response = await fetch(
                    \`\${API_BASE}/categories/\${categoryId}?limit=\${itemsPerPage}&offset=\${offset}&sort=\${currentSort}&order=\${currentOrder}\`
                );
                const data = await response.json();
                
                if (data.success) {
                    displayCategoryHeader(data.data.category);
                    displayProducts(data.data.products);
                    displayPagination(data.data.pagination);
                    
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('category-header').style.display = 'flex';
                    document.getElementById('products-container').style.display = 'block';
                } else {
                    showError('Nepodařilo se načíst produkty kategorie');
                }
            } catch (error) {
                console.error('Error loading category:', error);
                showError('Chyba při načítání kategorie');
            }
        }

        function displayCategoryHeader(category) {
            document.getElementById('category-title').textContent = category.icon + ' ' + category.name;
            document.getElementById('category-subtitle').textContent = category.description;
            
            document.getElementById('category-header').innerHTML = \`
                <div class="category-icon" style="--category-color: \${category.color}; --category-color-dark: \${darkenColor(category.color)};">
                    \${category.icon}
                </div>
                <div class="category-info">
                    <h1>\${category.name}</h1>
                    <p>\${category.description}</p>
                    <div class="category-stats">
                        <div class="stat-item">
                            <div class="stat-value" id="product-count">-</div>
                            <div class="stat-label">Produkty</div>
                        </div>
                    </div>
                </div>
            \`;
        }

        function displayProducts(products) {
            const container = document.getElementById('products-content');
            container.className = currentView === 'grid' ? 'products-grid' : 'products-list';
            
            document.getElementById('product-count').textContent = products.length;
            
            container.innerHTML = products.map(product => \`
                <div class="product-card" onclick="openProduct(\${product.id})">
                    <div class="product-image">📦</div>
                    <div class="product-info">
                        <h3>\${product.name}</h3>
                        <p>\${product.description.substring(0, 100)}\${product.description.length > 100 ? '...' : ''}</p>
                        <div class="product-meta">
                            <div class="product-price">\${new Intl.NumberFormat('cs-CZ').format(product.price)} Kč</div>
                            <div class="product-stock \${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : ''}">
                                \${product.stock > 0 ? \`Skladem: \${product.stock} ks\` : 'Není skladem'}
                            </div>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function displayPagination(pagination) {
            const container = document.getElementById('pagination');
            
            container.innerHTML = \`
                <button onclick="changePage(\${pagination.page - 1})" \${pagination.page <= 1 ? 'disabled' : ''}>
                    ← Předchozí
                </button>
                <span class="page-info">
                    Stránka \${pagination.page} z \${pagination.total_pages} 
                    (celkem \${pagination.total} produktů)
                </span>
                <button onclick="changePage(\${pagination.page + 1})" \${!pagination.has_more ? 'disabled' : ''}>
                    Další →
                </button>
            \`;
        }

        function changePage(page) {
            if (page < 1) return;
            currentPage = page;
            document.getElementById('loading').style.display = 'block';
            document.getElementById('products-container').style.display = 'none';
            loadCategoryData();
        }

        function changeSorting() {
            const sortSelect = document.getElementById('sort-select');
            const [sort, order] = sortSelect.value.split('-');
            currentSort = sort;
            currentOrder = order;
            currentPage = 1;
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('products-container').style.display = 'none';
            loadCategoryData();
        }

        function setView(view) {
            currentView = view;
            
            // Update button states
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(\`[onclick="setView('\${view}')"]\`).classList.add('active');
            
            // Re-render products with new view
            const container = document.getElementById('products-content');
            container.className = view === 'grid' ? 'products-grid' : 'products-list';
        }

        function openProduct(productId) {
            window.location.href = \`/products/\${productId}\`;
        }

        function darkenColor(color) {
            const colorMap = {
                '#667eea': '#5a67d8',
                '#48bb78': '#38a169',
                '#ed8936': '#dd6b20',
                '#38b2ac': '#319795'
            };
            return colorMap[color] || color;
        }

        function showError(message) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('category-header').style.display = 'none';
            document.getElementById('products-container').style.display = 'none';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').innerHTML = \`<p>\${message}</p>\`;
        }

        // Load category data on page load
        document.addEventListener('DOMContentLoaded', loadCategoryData);
    </script>
</body>
</html>`;