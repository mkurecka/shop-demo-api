// Chats page HTML content as a string
export const chatsPageHTML = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat přehled - Demo E-shop</title>
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
        }

        .back-button:hover {
            background: rgba(255,255,255,0.3);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
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
        }

        .btn:hover {
            background: #5a67d8;
            transform: translateY(-1px);
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
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-body {
            padding: 1.5rem;
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

        .chat-session {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
        }

        .session-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .session-info h3 {
            margin: 0;
            font-size: 1.1rem;
            color: #333;
        }

        .session-info p {
            margin: 0.5rem 0 0 0;
            color: #666;
            font-size: 0.9rem;
        }

        .chat-history {
            display: none;
            padding: 1rem;
            border-top: 1px solid #e2e8f0;
            background: #f8f9fa;
            max-height: 400px;
            overflow-y: auto;
        }

        .message {
            padding: 10px;
            margin: 5px 0;
            border-radius: 8px;
        }

        .message.user {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
        }

        .message.bot {
            background: #f5f5f5;
            border-left: 4px solid #4caf50;
        }

        .message-meta {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 5px;
        }

        .message-content {
            white-space: pre-wrap;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .session-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>💬 Chat přehled</h1>
            <p>Přehled všech chat konverzací pro hodnocení</p>
            <button class="back-button" onclick="window.location.href='/'">← Zpět na hlavní stránku</button>
        </div>
    </div>

    <div class="container">
        <div class="card">
            <div class="card-header">
                <h2>💬 Chat sessions</h2>
                <button class="btn" onclick="loadChatSessions()">🔄 Načíst znovu</button>
            </div>
            <div class="card-body">
                <div id="chat-sessions-list">
                    <div class="loading">Načítání chat sessionů...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        const API_BASE = window.location.origin + '/api';

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadChatSessions();
        });

        async function loadChatSessions() {
            try {
                const response = await fetch(API_BASE + '/chatbot/sessions');
                const data = await response.json();
                
                if (data.success) {
                    renderChatSessions(data.data);
                } else {
                    showError('Chyba při načítání chat sessionů: ' + (data.error?.message || 'Neznámá chyba'));
                }
            } catch (error) {
                console.error('Error loading chat sessions:', error);
                document.getElementById('chat-sessions-list').innerHTML = '<div class="error">Chyba při načítání chat sessionů</div>';
            }
        }

        function renderChatSessions(sessions) {
            const chatList = document.getElementById('chat-sessions-list');
            
            if (!sessions || sessions.length === 0) {
                chatList.innerHTML = '<div style="text-align: center; color: #666; padding: 2rem;">Žádné chat sessions k zobrazení</div>';
                return;
            }
            
            let chatHTML = '';
            
            sessions.forEach(session => {
                const createdAt = new Date(session.created_at).toLocaleString('cs-CZ');
                const userInfo = session.user_email ? \`👤 \${session.user_email}\` : '👤 Nepřihlášený uživatel';
                const messageCount = session.message_count || 0;
                
                chatHTML += \`
                    <div class="chat-session">
                        <div class="session-header">
                            <div class="session-info">
                                <h3>💬 Session: \${session.session_id}</h3>
                                <p>\${userInfo} • \${createdAt} • \${messageCount} zpráv</p>
                            </div>
                            <button class="btn" onclick="window.location.href='/chats/\${session.session_id}'" style="font-size: 0.9rem;">
                                📋 Zobrazit detail
                            </button>
                        </div>
                    </div>
                \`;
            });
            
            chatList.innerHTML = chatHTML;
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
                document.body.removeChild(alert);
            }, 5000);
        }
    </script>
</body>
</html>`;