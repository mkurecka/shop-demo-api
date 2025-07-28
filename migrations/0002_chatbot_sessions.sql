-- Migration to add chatbot sessions functionality

-- Chatbot sessions table
CREATE TABLE IF NOT EXISTS chatbot_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  status TEXT DEFAULT 'active',
  total_messages INTEGER DEFAULT 0,
  total_cost REAL DEFAULT 0.0,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chatbot messages table
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  message_type TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  token_count INTEGER DEFAULT 0,
  cost REAL DEFAULT 0.0,
  response_time_ms INTEGER DEFAULT 0,
  model_used TEXT,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chatbot_sessions (session_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbot_sessions_id ON chatbot_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_sessions_email ON chatbot_sessions(customer_email);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_session ON chatbot_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created ON chatbot_messages(created_at);