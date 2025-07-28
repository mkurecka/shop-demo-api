// Chat detail page HTML content as a string
export const chatDetailPageHTML = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat detail - Demo E-shop</title>
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

        .back-button {
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            margin-top: 1rem;
            margin-right: 1rem;
        }

        .back-button:hover {
            background: rgba(255,255,255,0.3);
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
        }

        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .card-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
        }

        .card-body {
            padding: 1.5rem;
        }

        .session-info {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }

        .session-info h3 {
            margin: 0 0 0.5rem 0;
            color: #333;
        }

        .session-info p {
            margin: 0.25rem 0;
            color: #666;
        }

        .messages-container {
            max-height: 600px;
            overflow-y: auto;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .message {
            padding: 1rem;
            margin: 0.5rem 0;
            border-radius: 8px;
            max-width: 80%;
        }

        .message.user {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            margin-left: auto;
            text-align: right;
        }

        .message.bot {
            background: #f1f8e9;
            border-left: 4px solid #4caf50;
            margin-right: auto;
        }

        .message-meta {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .message-content {
            white-space: pre-wrap;
            line-height: 1.4;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            color: #666;
        }

        .error {
            background: #fed7d7;
            border: 1px solid #fc8181;
            color: #c53030;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
        }

        .empty-state {
            text-align: center;
            color: #666;
            padding: 3rem;
            font-style: italic;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .message {
                max-width: 95%;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>💬 Chat detail</h1>
            <p>Detailní zobrazení chat konverzace</p>
            <button class="back-button" onclick="window.location.href='/chats'">← Zpět na seznam chatů</button>
            <button class="back-button" onclick="window.location.href='/'">🏠 Hlavní stránka</button>
        </div>
    </div>

    <div class="container">
        <div class="card">
            <div class="card-header">
                <h2>📋 Session detail</h2>
            </div>
            <div class="card-body">
                <div id="session-info">
                    <div class="loading">Načítání informací o session...</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>💬 Historie zpráv</h2>
            </div>
            <div class="card-body">
                <div id="messages-container">
                    <div class="loading">Načítání historie zpráv...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        const API_BASE = window.location.origin + '/api';
        const sessionId = '{{SESSION_ID}}'; // Will be replaced by server

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadSessionDetail();
            loadChatHistory();
        });

        async function loadSessionDetail() {
            try {
                const response = await fetch(API_BASE + \`/chatbot/sessions/\${sessionId}\`);
                const data = await response.json();
                
                if (data.success) {
                    renderSessionInfo(data.data);
                } else {
                    showError('Session nebyla nalezena');
                }
            } catch (error) {
                console.error('Error loading session detail:', error);
                document.getElementById('session-info').innerHTML = '<div class="error">Chyba při načítání session detailu</div>';
            }
        }

        async function loadChatHistory() {
            try {
                const response = await fetch(API_BASE + \`/chatbot/sessions/\${sessionId}/history\`);
                const data = await response.json();
                
                if (data.success) {
                    renderChatHistory(data.data);
                } else {
                    showError('Chyba při načítání historie: ' + (data.error?.message || 'Neznámá chyba'));
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
                document.getElementById('messages-container').innerHTML = '<div class="error">Chyba při načítání historie zpráv</div>';
            }
        }

        function renderSessionInfo(session) {
            const sessionInfoDiv = document.getElementById('session-info');
            const createdAt = new Date(session.created_at).toLocaleString('cs-CZ');
            const userInfo = session.user_email ? \`👤 \${session.user_email}\` : '👤 Nepřihlášený uživatel';
            const messageCount = session.message_count || 0;
            
            sessionInfoDiv.innerHTML = \`
                <div class="session-info">
                    <h3>Session: \${session.session_id}</h3>
                    <p><strong>Uživatel:</strong> \${userInfo}</p>
                    <p><strong>Vytvořeno:</strong> \${createdAt}</p>
                    <p><strong>Počet zpráv:</strong> \${messageCount}</p>
                    \${session.last_activity ? \`<p><strong>Poslední aktivita:</strong> \${new Date(session.last_activity).toLocaleString('cs-CZ')}</p>\` : ''}
                </div>
            \`;
        }

        function renderChatHistory(data) {
            const messagesContainer = document.getElementById('messages-container');
            
            // Extract messages from the API response structure
            const messages = data?.messages || [];
            
            if (!messages || messages.length === 0) {
                messagesContainer.innerHTML = '<div class="empty-state">Tato session neobsahuje žádné zprávy</div>';
                return;
            }
            
            let messagesHTML = '<div class="messages-container">';
            
            messages.forEach(message => {
                const timestamp = new Date(message.created_at).toLocaleString('cs-CZ');
                const isUser = message.message_type === 'user';
                let content = message.content;
                
                // If it's a bot message and content is JSON, extract the output
                if (!isUser && message.content) {
                    try {
                        const parsed = JSON.parse(message.content);
                        if (parsed.output) {
                            content = parsed.output;
                        }
                    } catch (e) {
                        // Keep original content if JSON parsing fails
                    }
                }
                
                messagesHTML += \`
                    <div class="message \${isUser ? 'user' : 'bot'}">
                        <div class="message-meta">
                            \${isUser ? '👤 Uživatel' : '🤖 Chatbot'} • \${timestamp}
                        </div>
                        <div class="message-content">\${content}</div>
                    </div>
                \`;
            });
            
            messagesHTML += '</div>';
            messagesContainer.innerHTML = messagesHTML;
        }

        function showError(message) {
            const alert = document.createElement('div');
            alert.className = 'error';
            alert.textContent = message;
            alert.style.position = 'fixed';
            alert.style.top = '20px';
            alert.style.right = '20px';
            alert.style.zIndex = '9999';
            document.body.appendChild(alert);
            
            setTimeout(() => {
                if (document.body.contains(alert)) {
                    document.body.removeChild(alert);
                }
            }, 5000);
        }
    </script>
</body>
</html>`;