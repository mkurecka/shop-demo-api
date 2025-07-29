import { createUnifiedPage } from './shared/layout';

const CATEGORIES_STYLES = `
    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .category-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        cursor: pointer;
        border: 2px solid transparent;
    }

    .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .category-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }

    .category-icon {
        font-size: 3rem;
        margin-right: 1rem;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--category-color, #667eea) 0%, var(--category-color-dark, #5a67d8) 100%);
    }

    .category-info h3 {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .category-info .product-count {
        color: #666;
        font-size: 0.9rem;
    }

    .category-description {
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }

    .category-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }

    .stat-item {
        text-align: center;
    }

    .stat-value {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--category-color, #667eea);
    }

    .stat-label {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
    }

    .search-section {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        border: 1px solid #e2e8f0;
    }

    .search-box {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .search-input {
        flex: 1;
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

    @media (max-width: 768px) {
        .categories-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .category-card {
            padding: 1.5rem;
        }
        
        .category-header {
            flex-direction: column;
            text-align: center;
        }
        
        .category-icon {
            margin-right: 0;
            margin-bottom: 1rem;
        }
        
        .category-stats {
            flex-direction: column;
            gap: 1rem;
        }
        
        .search-box {
            flex-direction: column;
            align-items: stretch;
        }
    }
`;

const CATEGORIES_SCRIPTS = `
    let allCategories = [];
    
    async function loadCategories() {
        try {
            const response = await fetch(API_BASE + '/categories');
            const data = await response.json();
            
            if (data.success) {
                allCategories = data.data;
                displayCategories(allCategories);
                hideLoading();
                document.getElementById('categories-content').style.display = 'block';
            } else {
                showError('Nepodařilo se načíst kategorie');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            showError('Chyba při načítání kategorií');
        }
    }

    function displayCategories(categories) {
        const grid = document.getElementById('categories-grid');
        
        if (categories.length === 0) {
            document.getElementById('categories-content').style.display = 'none';
            document.getElementById('empty-state').style.display = 'block';
            return;
        }

        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('categories-content').style.display = 'block';
        
        grid.innerHTML = categories.map(category => \`
            <div class="category-card" onclick="openCategory('\${category.id}')" 
                 style="--category-color: \${category.color}; --category-color-dark: \${darkenColor(category.color)};">
                <div class="category-header">
                    <div class="category-icon">
                        \${category.icon}
                    </div>
                    <div class="category-info">
                        <h3>\${category.name}</h3>
                        <div class="product-count">\${category.product_count} produktů</div>
                    </div>
                </div>
                <div class="category-description">
                    \${category.description}
                </div>
                <div class="category-stats">
                    <div class="stat-item">
                        <div class="stat-value">\${category.product_count}</div>
                        <div class="stat-label">Produkty</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">→</div>
                        <div class="stat-label">Zobrazit</div>
                    </div>
                </div>
            </div>
        \`).join('');
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

    async function searchCategories() {
        const query = document.getElementById('search-input').value.trim();
        
        if (!query) {
            displayCategories(allCategories);
            return;
        }

        try {
            showLoading();
            document.getElementById('categories-content').style.display = 'none';
            
            const response = await fetch(API_BASE + '/categories/search?q=' + encodeURIComponent(query));
            const data = await response.json();
            
            hideLoading();
            
            if (data.success) {
                displayCategories(data.data);
            } else {
                showError('Chyba při vyhledávání kategorií');
            }
        } catch (error) {
            console.error('Error searching categories:', error);
            hideLoading();
            showError('Chyba při vyhledávání kategorií');
        }
    }

    function openCategory(categoryId) {
        window.location.href = \`/categories/\${categoryId}\`;
    }

    function showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('categories-content').style.display = 'none';
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    function clearSearch() {
        document.getElementById('search-input').value = '';
        displayCategories(allCategories);
    }

    // Handle Enter key in search input
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('search-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchCategories();
            }
        });
        
        loadCategories();
    });
`;

const CATEGORIES_CONTENT = `
    <div class="page-content">
        <div class="section-header">
            <h2>🏷️ Kategorie produktů</h2>
            <button class="btn btn-success" onclick="alert('Demo: Přidání kategorie')">
                ➕ Přidat kategorii
            </button>
        </div>

        <div class="search-section">
            <div class="search-box">
                <input type="text" id="search-input" class="search-input" placeholder="Hledat v kategoriích..." />
                <button onclick="searchCategories()" class="btn">🔍 Hledat</button>
                <button onclick="clearSearch()" class="btn btn-secondary">✖️ Vymazat</button>
            </div>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Načítání kategorií...</p>
        </div>

        <div id="error-message" class="error" style="display: none;">
            <p>Chyba při načítání kategorií. Zkuste to prosím znovu.</p>
        </div>

        <div id="categories-content" style="display: none;">
            <div id="categories-grid" class="categories-grid">
                <!-- Categories will be loaded here -->
            </div>
        </div>

        <div id="empty-state" class="empty-state" style="display: none;">
            <div class="empty-state-icon">🔍</div>
            <h3>Žádné kategorie nenalezeny</h3>
            <p>Zkuste změnit vyhledávací dotaz</p>
        </div>
    </div>
`;

export const categoriesPageHTML = createUnifiedPage(
    'Kategorie',
    '🏷️ Kategorie produktů',
    'Procházejte naše produkty podle kategorií',
    'categories',
    CATEGORIES_CONTENT,
    CATEGORIES_STYLES,
    CATEGORIES_SCRIPTS
);