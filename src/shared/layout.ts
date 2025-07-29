// Shared layout components for all pages

export const SHARED_STYLES = `
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
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .nav-bar a {
        text-decoration: none;
        color: #667eea;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .nav-bar a:hover {
        background-color: #f0f2ff;
    }

    .nav-bar a.active {
        background-color: #667eea;
        color: white;
    }

    .page-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 2rem;
        margin-bottom: 2rem;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
    }

    .section-header h2 {
        font-size: 1.5rem;
        color: #333;
        display: flex;
        align-items: center;
        gap: 0.5rem;
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
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn:hover {
        background: #5a67d8;
        transform: translateY(-1px);
    }

    .btn-secondary {
        background: #e2e8f0;
        color: #4a5568;
    }

    .btn-secondary:hover {
        background: #cbd5e0;
    }

    .btn-success {
        background: #48bb78;
    }

    .btn-success:hover {
        background: #38a169;
    }

    .btn-danger {
        background: #f56565;
    }

    .btn-danger:hover {
        background: #e53e3e;
    }

    .grid {
        display: grid;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .grid-2 {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .grid-3 {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .grid-4 {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .card-header h3 {
        font-size: 1.2rem;
        color: #333;
        display: flex;
        align-items: center;
        gap: 0.5rem;
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
        background: #fed7d7;
        color: #c53030;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border-left: 4px solid #f56565;
    }

    .success {
        background: #c6f6d5;
        color: #276749;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border-left: 4px solid #48bb78;
    }

    .info {
        background: #bee3f8;
        color: #2c5282;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border-left: 4px solid #4299e1;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #4a5568;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #667eea;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
    }

    .table th,
    .table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
    }

    .table th {
        background: #f7fafc;
        font-weight: 600;
        color: #4a5568;
    }

    .table tr:hover {
        background: #f7fafc;
    }

    .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 9999px;
        text-transform: uppercase;
    }

    .badge-success {
        background: #c6f6d5;
        color: #276749;
    }

    .badge-warning {
        background: #faf089;
        color: #744210;
    }

    .badge-danger {
        background: #fed7d7;
        color: #c53030;
    }

    .badge-info {
        background: #bee3f8;
        color: #2c5282;
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
    }

    .empty-state-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }
        
        .nav-bar {
            padding: 1rem;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .nav-bar a {
            justify-content: center;
        }
        
        .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .grid-2,
        .grid-3,
        .grid-4 {
            grid-template-columns: 1fr;
        }
        
        .page-content {
            padding: 1rem;
        }
    }
`;

export function createUnifiedPage(
    title: string,
    headerTitle: string,
    headerSubtitle: string,
    activeNavItem: string,
    content: string,
    additionalStyles: string = '',
    additionalScripts: string = ''
): string {
    return `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Demo E-shop</title>
    <style>
        ${SHARED_STYLES}
        ${additionalStyles}
    </style>
</head>
<body>
    <div class="header">
        <h1>${headerTitle}</h1>
        <p>${headerSubtitle}</p>
    </div>

    <div class="container">
        <nav class="nav-bar">
            <a href="/" ${activeNavItem === 'home' ? 'class="active"' : ''}>
                🏠 Domů
            </a>
            <a href="/products" ${activeNavItem === 'products' ? 'class="active"' : ''}>
                📦 Produkty
            </a>
            <a href="/categories" ${activeNavItem === 'categories' ? 'class="active"' : ''}>
                🏷️ Kategorie
            </a>
            <a href="/orders" ${activeNavItem === 'orders' ? 'class="active"' : ''}>
                📋 Objednávky
            </a>
            <a href="/customers" ${activeNavItem === 'customers' ? 'class="active"' : ''}>
                👥 Zákazníci
            </a>
            <a href="/chats" ${activeNavItem === 'chats' ? 'class="active"' : ''}>
                💬 Chaty
            </a>
            <a href="/dashboard" ${activeNavItem === 'dashboard' ? 'class="active"' : ''}>
                📊 Dashboard
            </a>
            <a href="/info" ${activeNavItem === 'info' ? 'class="active"' : ''}>
                ℹ️ Informace
            </a>
        </nav>

        ${content}
    </div>

    <script>
        const API_BASE = window.location.origin + '/api';
        
        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.innerHTML = '<strong>Chyba:</strong> ' + message;
            document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.container').firstChild.nextSibling);
            setTimeout(() => errorDiv.remove(), 5000);
        }

        function showSuccess(message) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success';
            successDiv.innerHTML = '<strong>Úspěch:</strong> ' + message;
            document.querySelector('.container').insertBefore(successDiv, document.querySelector('.container').firstChild.nextSibling);
            setTimeout(() => successDiv.remove(), 5000);
        }

        function showInfo(message) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info';
            infoDiv.innerHTML = '<strong>Info:</strong> ' + message;
            document.querySelector('.container').insertBefore(infoDiv, document.querySelector('.container').firstChild.nextSibling);
            setTimeout(() => infoDiv.remove(), 5000);
        }

        ${additionalScripts}
    </script>
</body>
</html>`;
}

export const NAV_ITEMS = {
    home: { url: '/', label: '🏠 Domů' },
    products: { url: '/products', label: '📦 Produkty' },
    categories: { url: '/categories', label: '🏷️ Kategorie' },
    orders: { url: '/orders', label: '📋 Objednávky' },
    customers: { url: '/customers', label: '👥 Zákazníci' },
    chats: { url: '/chats', label: '💬 Chaty' },
    dashboard: { url: '/dashboard', label: '📊 Dashboard' },
    info: { url: '/info', label: 'ℹ️ Informace' }
};