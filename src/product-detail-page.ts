import { createUnifiedPage } from './shared/layout';

const PRODUCT_DETAIL_STYLES = `
    .product-detail {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        margin-bottom: 3rem;
    }

    .product-image-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .main-image {
        width: 100%;
        height: 400px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        color: #adb5bd;
        border: 2px solid #e2e8f0;
    }

    .image-thumbnails {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
    }

    .thumbnail {
        width: 80px;
        height: 80px;
        background: #f8f9fa;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.3s;
        flex-shrink: 0;
    }

    .thumbnail:hover,
    .thumbnail.active {
        border-color: #667eea;
    }

    .product-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .product-header {
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .product-category {
        font-size: 0.9rem;
        text-transform: uppercase;
        color: #667eea;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .product-title {
        font-size: 2rem;
        font-weight: 700;
        color: #333;
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    .product-description {
        color: #666;
        line-height: 1.6;
        font-size: 1.1rem;
    }

    .price-section {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }

    .current-price {
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 0.5rem;
    }

    .price-note {
        font-size: 0.9rem;
        color: #666;
    }

    .variant-section {
        padding: 1.5rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .variant-group {
        margin-bottom: 1.5rem;
    }

    .variant-label {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.75rem;
        display: block;
    }

    .variant-options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .variant-option {
        padding: 0.75rem 1rem;
        border: 2px solid #e2e8f0;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    }

    .variant-option:hover {
        border-color: #667eea;
        background: #f0f4ff;
    }

    .variant-option.selected {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    .variant-option.unavailable {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f5f5f5;
    }

    .color-swatch {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid #ccc;
    }

    .stock-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .stock-indicator {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .stock-indicator.in-stock {
        background: #c6f6d5;
        color: #276749;
    }

    .stock-indicator.low-stock {
        background: #faf089;
        color: #744210;
    }

    .stock-indicator.out-of-stock {
        background: #fed7d7;
        color: #c53030;
    }

    .actions-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .quantity-selector {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .quantity-input {
        width: 80px;
        padding: 0.5rem;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        text-align: center;
        font-size: 1rem;
    }

    .btn-primary {
        background: #667eea;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 6px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-primary:hover {
        background: #5a67d8;
        transform: translateY(-1px);
    }

    .btn-primary:disabled {
        background: #a0aec0;
        cursor: not-allowed;
        transform: none;
    }

    .btn-secondary {
        background: white;
        color: #667eea;
        border: 2px solid #667eea;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-secondary:hover {
        background: #f0f4ff;
    }

    .related-products {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid #e2e8f0;
    }

    .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 1.5rem;
    }

    .related-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .related-item {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        cursor: pointer;
        transition: transform 0.3s;
    }

    .related-item:hover {
        transform: translateY(-2px);
    }

    .breadcrumb {
        margin-bottom: 2rem;
        color: #666;
        font-size: 0.9rem;
    }

    .breadcrumb a {
        color: #667eea;
        text-decoration: none;
    }

    .breadcrumb span {
        margin: 0 0.5rem;
    }

    @media (max-width: 768px) {
        .product-detail {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .product-title {
            font-size: 1.5rem;
        }

        .current-price {
            font-size: 1.5rem;
        }

        .variant-options {
            flex-direction: column;
        }

        .variant-option {
            justify-content: center;
        }

        .actions-section {
            position: sticky;
            bottom: 0;
            z-index: 10;
            margin: 0 -1rem;
            border-radius: 0;
        }
    }
`;

const PRODUCT_DETAIL_SCRIPTS = `
    let currentProduct = null;
    let selectedVariant = null;
    let availableVariants = [];
    let selectedAttributes = {};

    async function loadProductDetail() {
        try {
            showLoading();
            
            const productId = getProductIdFromUrl();
            if (!productId) {
                showError('Neplatné ID produktu');
                return;
            }

            const response = await fetch(API_BASE + '/products/' + productId + '?variants=true');
            const data = await response.json();
            
            if (data.success) {
                currentProduct = data.data;
                availableVariants = currentProduct.variants || [];
                displayProductDetail(currentProduct);
                hideLoading();
            } else {
                showError('Produkt nebyl nalezen');
                setTimeout(() => {
                    window.location.href = '/products';
                }, 2000);
            }
        } catch (error) {
            console.error('Error loading product:', error);
            showError('Chyba při načítání produktu');
        }
    }

    function getProductIdFromUrl() {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    }

    function displayProductDetail(product) {
        document.getElementById('product-category').textContent = product.category;
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('current-price').textContent = new Intl.NumberFormat('cs-CZ').format(product.price) + ' Kč';
        
        // Update breadcrumb
        document.getElementById('product-name-breadcrumb').textContent = product.name;
        
        // Display variants if available
        if (availableVariants.length > 0) {
            displayVariants();
            document.getElementById('variant-section').style.display = 'block';
        } else {
            document.getElementById('variant-section').style.display = 'none';
        }
        
        // Update stock info
        updateStockInfo(product.stock);
        
        // Show content
        document.getElementById('product-content').style.display = 'block';
    }

    function displayVariants() {
        if (!currentProduct.available_attributes) return;
        
        const variantContainer = document.getElementById('variant-options');
        variantContainer.innerHTML = '';
        
        Object.keys(currentProduct.available_attributes).forEach(attributeName => {
            const attribute = currentProduct.available_attributes[attributeName];
            
            const groupDiv = document.createElement('div');
            groupDiv.className = 'variant-group';
            
            const label = document.createElement('label');
            label.className = 'variant-label';
            label.textContent = attribute.display_name;
            groupDiv.appendChild(label);
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'variant-options';
            
            attribute.values.forEach(value => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'variant-option';
                optionDiv.dataset.attribute = attributeName;
                optionDiv.dataset.value = value.value;
                optionDiv.onclick = () => selectVariantOption(attributeName, value.value, optionDiv);
                
                if (attribute.attribute_type === 'color' && value.hex_color) {
                    const swatch = document.createElement('div');
                    swatch.className = 'color-swatch';
                    swatch.style.backgroundColor = value.hex_color;
                    optionDiv.appendChild(swatch);
                }
                
                const textSpan = document.createElement('span');
                textSpan.textContent = value.display_value;
                optionDiv.appendChild(textSpan);
                
                optionsDiv.appendChild(optionDiv);
            });
            
            groupDiv.appendChild(optionsDiv);
            variantContainer.appendChild(groupDiv);
        });
    }

    function selectVariantOption(attributeName, value, element) {
        // Remove selection from other options in same attribute
        document.querySelectorAll(\`.variant-option[data-attribute="\${attributeName}"]\`).forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select this option
        element.classList.add('selected');
        selectedAttributes[attributeName] = value;
        
        // Find matching variant
        updateSelectedVariant();
    }

    function updateSelectedVariant() {
        selectedVariant = availableVariants.find(variant => {
            return variant.attributes.every(attr => 
                selectedAttributes[attr.attribute_name] === attr.value
            );
        });
        
        if (selectedVariant) {
            const finalPrice = currentProduct.price + (selectedVariant.price_adjustment || 0);
            document.getElementById('current-price').textContent = new Intl.NumberFormat('cs-CZ').format(finalPrice) + ' Kč';
            updateStockInfo(selectedVariant.stock);
        } else {
            document.getElementById('current-price').textContent = new Intl.NumberFormat('cs-CZ').format(currentProduct.price) + ' Kč';
            updateStockInfo(currentProduct.stock);
        }
    }

    function updateStockInfo(stock) {
        const indicator = document.getElementById('stock-indicator');
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        
        indicator.className = 'stock-indicator';
        
        if (stock === 0) {
            indicator.classList.add('out-of-stock');
            indicator.textContent = 'Není skladem';
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Nedostupné';
        } else if (stock <= 5) {
            indicator.classList.add('low-stock');
            indicator.textContent = \`Pouze \${stock} ks skladem\`;
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = 'Přidat do košíku';
        } else {
            indicator.classList.add('in-stock');
            indicator.textContent = \`Skladem: \${stock} ks\`;
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = 'Přidat do košíku';
        }
    }

    function addToCart() {
        const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
        
        // Demo functionality
        showNotification(\`Přidáno do košíku: \${quantity}× \${currentProduct.name}\`);
    }

    function addToWishlist() {
        showNotification(\`Přidáno do oblíbených: \${currentProduct.name}\`);
    }

    function goBackToProducts() {
        window.location.href = '/products';
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

    function showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('product-content').style.display = 'none';
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    document.addEventListener('DOMContentLoaded', function() {
        loadProductDetail();
    });
`;

const PRODUCT_DETAIL_CONTENT = `
    <div class="page-content">
        <div class="breadcrumb">
            <a href="/">Domů</a>
            <span>›</span>
            <a href="/products">Produkty</a>
            <span>›</span>
            <span id="product-name-breadcrumb">Produkt</span>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Načítání produktu...</p>
        </div>

        <div id="product-content" style="display: none;">
            <div class="product-detail">
                <div class="product-image-section">
                    <div class="main-image" id="main-image">
                        📦
                    </div>
                    <div class="image-thumbnails">
                        <div class="thumbnail active">📦</div>
                        <div class="thumbnail">📸</div>
                        <div class="thumbnail">🖼️</div>
                    </div>
                </div>

                <div class="product-info">
                    <div class="product-header">
                        <div class="product-category" id="product-category">Kategorie</div>
                        <h1 class="product-title" id="product-title">Název produktu</h1>
                        <div class="product-description" id="product-description">
                            Popis produktu bude načten...
                        </div>
                    </div>

                    <div class="price-section">
                        <div class="current-price" id="current-price">0 Kč</div>
                        <div class="price-note">Cena včetně DPH</div>
                    </div>

                    <div id="variant-section" class="variant-section" style="display: none;">
                        <h3>Vyberte variantu:</h3>
                        <div id="variant-options">
                            <!-- Variant options will be loaded here -->
                        </div>
                    </div>

                    <div class="stock-info">
                        <div id="stock-indicator" class="stock-indicator">
                            Načítání...
                        </div>
                    </div>

                    <div class="actions-section">
                        <div class="quantity-selector">
                            <label>Množství:</label>
                            <input type="number" id="quantity-input" class="quantity-input" value="1" min="1" max="10">
                        </div>
                        
                        <button id="add-to-cart-btn" class="btn-primary" onclick="addToCart()">
                            🛒 Přidat do košíku
                        </button>
                        
                        <button class="btn-secondary" onclick="addToWishlist()">
                            ❤️ Přidat do oblíbených
                        </button>
                        
                        <button class="btn-secondary" onclick="goBackToProducts()">
                            ← Zpět na produkty
                        </button>
                    </div>
                </div>
            </div>

            <div class="related-products">
                <h2 class="section-title">💡 Související produkty</h2>
                <div class="related-grid">
                    <div class="related-item">
                        <div>📱 Demo produkt 1</div>
                        <div>1 200 Kč</div>
                    </div>
                    <div class="related-item">
                        <div>💻 Demo produkt 2</div>
                        <div>2 500 Kč</div>
                    </div>
                    <div class="related-item">
                        <div>🎧 Demo produkt 3</div>
                        <div>800 Kč</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

export const productDetailPageHTML = createUnifiedPage(
    'Detail produktu',
    '📦 Detail produktu',
    'Podrobné informace o produktu',
    'products',
    PRODUCT_DETAIL_CONTENT,
    PRODUCT_DETAIL_STYLES,
    PRODUCT_DETAIL_SCRIPTS
);