import { createUnifiedPage } from './shared/layout';

const INFO_STYLES = `
    .info-section {
        background: white;
        margin-bottom: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow: hidden;
    }

    .info-section h2 {
        background: #667eea;
        color: white;
        padding: 1rem 2rem;
        margin: 0;
        font-size: 1.5rem;
    }

    .info-content {
        padding: 2rem;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .info-card {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }

    .info-card h3 {
        color: #333;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    .info-card p, .info-card li {
        color: #666;
        margin-bottom: 0.5rem;
    }

    .info-card ul {
        padding-left: 1.5rem;
    }

    .delivery-method {
        background: white;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .method-info h4 {
        color: #333;
        margin-bottom: 0.25rem;
    }

    .method-info p {
        color: #666;
        font-size: 0.9rem;
    }

    .method-price {
        text-align: right;
    }

    .price {
        font-size: 1.2rem;
        font-weight: bold;
        color: #667eea;
    }

    .delivery-time {
        font-size: 0.9rem;
        color: #888;
    }

    .highlight {
        background: #e8f2ff;
        padding: 1rem;
        border-radius: 6px;
        border-left: 4px solid #667eea;
        margin: 1rem 0;
    }

    .contact-info {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: white;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
    }

    .contact-icon {
        background: #667eea;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        font-size: 1.2rem;
    }

    @media (max-width: 768px) {
        .info-grid {
            grid-template-columns: 1fr;
        }
        
        .delivery-method {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .method-price {
            text-align: left;
        }
    }
`;

const INFO_SCRIPTS = `
    async function loadInfoData() {
        try {
            showLoading();
            const response = await fetch(API_BASE + '/info');
            const data = await response.json();
            
            if (data.success) {
                displayInfoData(data.data);
                hideLoading();
                document.getElementById('info-content').style.display = 'block';
            } else {
                showError('Nepodařilo se načíst informace');
            }
        } catch (error) {
            console.error('Error loading info:', error);
            showError('Chyba při načítání informací');
        }
    }

    function showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('info-content').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    function displayInfoData(data) {
        const container = document.getElementById('info-content');
        
        container.innerHTML = \`
            <!-- Company Information -->
            <div class="info-section">
                <h2>🏢 O společnosti</h2>
                <div class="info-content">
                    <div class="info-grid">
                        <div class="info-card">
                            <h3>Kontaktní údaje</h3>
                            <p><strong>\${data.company.legal_name}</strong></p>
                            <p>\${data.company.address.street}</p>
                            <p>\${data.company.address.postal_code} \${data.company.address.city}</p>
                            <p>\${data.company.address.country}</p>
                        </div>
                        <div class="info-card">
                            <h3>Obchodní údaje</h3>
                            <p><strong>IČO:</strong> \${data.company.business_info.ico}</p>
                            <p><strong>DIČ:</strong> \${data.company.business_info.dic}</p>
                            <p><strong>Účet:</strong> \${data.company.business_info.bank_account}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delivery Information -->
            <div class="info-section">
                <h2>🚚 Doprava a doručení</h2>
                <div class="info-content">
                    <div class="highlight">
                        <strong>🎉 Doprava zdarma</strong> při objednávce nad \${new Intl.NumberFormat('cs-CZ').format(data.delivery.free_delivery_threshold)} Kč
                    </div>
                    
                    <h3>Způsoby dopravy:</h3>
                    \${data.delivery.methods.map(method => \`
                        <div class="delivery-method">
                            <div class="method-info">
                                <h4>\${method.name}</h4>
                                <p>\${method.description}</p>
                            </div>
                            <div class="method-price">
                                <div class="price">\${new Intl.NumberFormat('cs-CZ').format(method.price)} \${method.currency}</div>
                                <div class="delivery-time">\${method.delivery_time}</div>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            </div>

            <!-- Payment Information -->
            <div class="info-section">
                <h2>💳 Platební metody</h2>
                <div class="info-content">
                    <div class="info-grid">
                        \${data.payment.methods.map(method => \`
                            <div class="info-card">
                                <h3>\${method.name}</h3>
                                <p>\${method.description}</p>
                                \${method.fee > 0 ? \`<p><strong>Poplatek:</strong> \${method.fee} \${method.currency || 'Kč'}</p>\` : '<p><strong>Bez poplatku</strong></p>'}
                                \${method.security ? \`<p><em>Zabezpečení: \${method.security}</em></p>\` : ''}
                                \${method.payment_term ? \`<p><em>Lhůta splatnosti: \${method.payment_term}</em></p>\` : ''}
                            </div>
                        \`).join('')}
                    </div>
                    <div class="highlight">
                        <strong>🔒 \${data.payment.security_note}</strong>
                    </div>
                </div>
            </div>

            <!-- Return Information -->
            <div class="info-section">
                <h2>↩️ Vrácení zboží a záruka</h2>
                <div class="info-content">
                    <div class="info-grid">
                        <div class="info-card">
                            <h3>Vrácení zboží</h3>
                            <p><strong>Lhůta:</strong> \${data.returns.return_period} \${data.returns.return_period_unit} od doručení</p>
                            <ul>
                                \${data.returns.conditions.map(condition => \`<li>\${condition}</li>\`).join('')}
                            </ul>
                        </div>
                        <div class="info-card">
                            <h3>Záruka</h3>
                            <p><strong>Standardní záruka:</strong> \${data.returns.warranty.standard_period} \${data.returns.warranty.standard_period_unit}</p>
                            <p><strong>Elektronika:</strong> \${data.returns.warranty.electronics_period} měsíců</p>
                            <p><strong>Oblečení:</strong> \${data.returns.warranty.clothing_period} měsíců</p>
                            <p>\${data.returns.warranty.description}</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Adresa pro vrácení zboží</h3>
                        <p><strong>\${data.returns.return_address.name}</strong></p>
                        <p>\${data.returns.return_address.street}</p>
                        <p>\${data.returns.return_address.postal_code} \${data.returns.return_address.city}</p>
                        <p>\${data.returns.return_address.country}</p>
                    </div>
                </div>
            </div>

            <!-- Customer Service -->
            <div class="info-section">
                <h2>🎧 Zákaznická podpora</h2>
                <div class="info-content">
                    <div class="info-grid">
                        <div class="info-card">
                            <h3>Otevírací doba</h3>
                            <p><strong>Pondělí - Pátek:</strong> \${data.customer_service.support_hours.monday_friday}</p>
                            <p><strong>Sobota:</strong> \${data.customer_service.support_hours.saturday}</p>
                            <p><strong>Neděle:</strong> \${data.customer_service.support_hours.sunday}</p>
                        </div>
                        <div class="info-card">
                            <h3>Jazyky</h3>
                            <p>\${data.customer_service.languages.join(', ')}</p>
                        </div>
                    </div>
                    
                    <h3>Kontaktní možnosti:</h3>
                    \${data.customer_service.contact_methods.map(contact => \`
                        <div class="contact-info">
                            <div class="contact-icon">
                                \${contact.type === 'phone' ? '📞' : contact.type === 'email' ? '✉️' : '💬'}
                            </div>
                            <div>
                                <strong>\${contact.value}</strong>
                                <p>\${contact.availability || contact.response_time}</p>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            </div>

            <!-- Legal Information -->
            <div class="info-section">
                <h2>⚖️ Právní informace</h2>
                <div class="info-content">
                    <div class="info-grid">
                        <div class="info-card">
                            <h3>Dokumenty</h3>
                            <p><a href="\${data.legal.terms_conditions_url}">Obchodní podmínky</a></p>
                            <p><a href="\${data.legal.privacy_policy_url}">Zásady ochrany osobních údajů</a></p>
                            <p><a href="\${data.legal.cookie_policy_url}">Zásady používání cookies</a></p>
                        </div>
                        <div class="info-card">
                            <h3>GDPR</h3>
                            <p><strong>Soulad s GDPR:</strong> \${data.legal.gdpr_compliance ? 'Ano' : 'Ne'}</p>
                            <p>\${data.legal.data_retention}</p>
                            <p><strong>Pověřenec pro ochranu osobních údajů:</strong></p>
                            <p>\${data.legal.data_protection_officer}</p>
                        </div>
                    </div>
                </div>
            </div>
        \`;
    }

    document.addEventListener('DOMContentLoaded', loadInfoData);
`;

const INFO_CONTENT = `
    <div class="page-content">
        <div class="section-header">
            <h2>ℹ️ Informace pro zákazníky</h2>
            <button class="btn btn-success" onclick="alert('Demo: Správa informací')">
                ✏️ Upravit informace
            </button>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Načítání informací...</p>
        </div>

        <div id="error-message" class="error" style="display: none;">
            <p>Chyba při načítání informací. Zkuste to prosím znovu.</p>
        </div>

        <div id="info-content" style="display: none;">
            <!-- Content will be loaded here -->
        </div>
    </div>
`;

export const infoPageHTML = createUnifiedPage(
    'Informace',
    'ℹ️ Informace pro zákazníky',
    'Vše co potřebujete vědět o nakupování v našem e-shopu',
    'info',
    INFO_CONTENT,
    INFO_STYLES,
    INFO_SCRIPTS
);