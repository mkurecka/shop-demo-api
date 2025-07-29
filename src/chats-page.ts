import { createUnifiedPage } from './shared/layout';

const CHATS_STYLES = `
    .sessions-table {
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

    .sessions-list {
        max-height: 600px;
        overflow-y: auto;
    }

    .session-item {
        padding: 1.5rem;
        border-bottom: 1px solid #f1f3f4;
        transition: background-color 0.3s;
        cursor: pointer;
    }

    .session-item:hover {
        background-color: #f8f9fa;
    }

    .session-item:last-child {
        border-bottom: none;
    }

    .session-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .session-id {
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
    }

    .session-status {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        background: #c6f6d5;
        color: #276749;
    }

    .session-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .session-detail {
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

    .session-preview {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 6px;
        margin-top: 1rem;
        border-left: 3px solid #667eea;
    }

    .preview-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .preview-content {
        font-size: 0.9rem;
        color: #666;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
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
        .session-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .session-details {
            grid-template-columns: 1fr;
        }
        
        .stats-overview {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;

const CHATS_SCRIPTS = `
    let allSessions = [];

    async function loadChatSessions() {
        try {
            showLoading();
            
            const response = await fetch(API_BASE + '/chatbot/sessions');
            const data = await response.json();
            
            if (data.success) {
                allSessions = data.data || [];
                updateStats();
                displaySessions();
                hideLoading();
                document.getElementById('chats-content').style.display = 'block';
            } else {
                showError('Nepodařilo se načíst chat sessions');
            }
        } catch (error) {
            console.error('Error loading chat sessions:', error);
            showError('Chyba při načítání chat sessions');
        }
    }

    function displaySessions() {
        const sessionsList = document.getElementById('sessions-list');
        
        if (allSessions.length === 0) {
            sessionsList.innerHTML = \`
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>Žádné chat sessions nenalezeny</h3>
                    <p>Zatím neproběhly žádné konverzace s chatbotem</p>
                </div>
            \`;
            return;
        }

        sessionsList.innerHTML = allSessions.map(session => \`
            <div class="session-item" onclick="openSessionDetail('\${session.session_id}')">
                <div class="session-header">
                    <div class="session-id">💬 Session #\${session.session_id}</div>
                    <div class="session-status">Aktivní</div>
                </div>
                
                <div class="session-details">
                    <div class="session-detail">
                        <div class="detail-label">Uživatel</div>
                        <div class="detail-value">\${session.user_email || 'Nepřihlášený uživatel'}</div>
                    </div>
                    <div class="session-detail">
                        <div class="detail-label">Vytvořeno</div>
                        <div class="detail-value">\${formatDate(session.created_at)}</div>
                    </div>
                    <div class="session-detail">
                        <div class="detail-label">Zprávy</div>
                        <div class="detail-value">\${session.message_count || 0} zpráv</div>
                    </div>
                    <div class="session-detail">
                        <div class="detail-label">Poslední aktivita</div>
                        <div class="detail-value">\${formatDate(session.updated_at || session.created_at)}</div>
                    </div>
                </div>

                <div class="session-preview">
                    <div class="preview-title">🔍 Náhled konverzace</div>
                    <div class="preview-content">
                        \${session.last_message || 'Žádné zprávy k zobrazení'}
                    </div>
                </div>
            </div>
        \`).join('');
    }

    function updateStats() {
        const totalSessions = allSessions.length;
        const activeSessions = allSessions.filter(s => s.status === 'active' || !s.status).length;
        const totalMessages = allSessions.reduce((sum, session) => sum + (session.message_count || 0), 0);

        document.getElementById('total-sessions').textContent = totalSessions;
        document.getElementById('active-sessions').textContent = activeSessions;
        document.getElementById('total-messages').textContent = totalMessages;
    }

    function openSessionDetail(sessionId) {
        window.location.href = \`/chats/\${sessionId}\`;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('cs-CZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('chats-content').style.display = 'none';
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    document.addEventListener('DOMContentLoaded', loadChatSessions);
`;

const CHATS_CONTENT = `
    <div class="page-content">
        <div class="section-header">
            <h2>💬 Chat Sessions</h2>
            <button class="btn btn-success" onclick="loadChatSessions()">
                🔄 Obnovit data
            </button>
        </div>

        <div class="stats-overview">
            <div class="overview-card">
                <div class="overview-value" id="total-sessions">-</div>
                <div class="overview-label">Celkem sessions</div>
            </div>
            <div class="overview-card">
                <div class="overview-value" id="active-sessions">-</div>
                <div class="overview-label">Aktivních sessions</div>
            </div>
            <div class="overview-card">
                <div class="overview-value" id="total-messages">-</div>
                <div class="overview-label">Celkem zpráv</div>
            </div>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Načítání chat sessions...</p>
        </div>

        <div id="chats-content" style="display: none;">
            <div class="sessions-table">
                <div class="table-header">
                    <h3 class="table-title">Seznam chat sessions</h3>
                </div>
                <div class="sessions-list" id="sessions-list">
                    <!-- Sessions will be loaded here -->
                </div>
            </div>
        </div>
    </div>
`;

export const chatsPageHTML = createUnifiedPage(
    'Chaty',
    '💬 Chat Sessions',
    'Přehled a správa chatbot konverzací',
    'chats',
    CHATS_CONTENT,
    CHATS_STYLES,
    CHATS_SCRIPTS
);