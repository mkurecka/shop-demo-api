# Chatbot API Documentation

## Overview

The Chatbot API allows you to create and manage chatbot sessions, track messages, costs, and performance metrics. This is perfect for integrating AI chatbots with your e-commerce platform.

## Base URL
```
https://shop-demo-api.kureckamichal.workers.dev/api/chatbot
```

## API Endpoints

### 1. Create Chatbot Session
**Endpoint:** `POST /sessions`

**Description:** Creates a new chatbot session for tracking conversation history and costs.

**Request Body:**
```json
{
  "customer_email": "user@example.com",
  "customer_phone": "+420777888999",
  "metadata": {
    "user_agent": "Mozilla/5.0...",
    "ip": "192.168.1.1",
    "platform": "web"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "session_id": "session-1753693147176-0PRDCX4M",
    "customer_email": "user@example.com",
    "customer_phone": "+420777888999",
    "status": "active",
    "total_messages": 0,
    "total_cost": 0,
    "metadata": "{\"user_agent\":\"Mozilla/5.0...\"}",
    "created_at": "2025-07-28 08:59:07",
    "updated_at": "2025-07-28 08:59:07"
  },
  "message": "Chatbot session úspěšně vytvořena"
}
```

### 2. Add Message to Session
**Endpoint:** `POST /sessions/{sessionId}/messages`

**Description:** Adds a message (user or assistant) to the chatbot session with cost tracking.

**Request Body:**
```json
{
  "message_type": "user", // "user" or "assistant"
  "content": "Dobrý den, chtěl bych se zeptat na iPhone 15 Pro",
  "token_count": 15,
  "cost": 0.001,
  "response_time_ms": 0, // For assistant messages
  "model_used": "claude-3.5-sonnet", // For assistant messages
  "metadata": {
    "confidence": 0.95,
    "intent": "product_inquiry"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "session_id": "session-1753693147176-0PRDCX4M",
    "message_type": "user",
    "content": "Dobrý den, chtěl bych se zeptat na iPhone 15 Pro",
    "token_count": 15,
    "cost": 0.001,
    "response_time_ms": 0,
    "model_used": null,
    "metadata": null,
    "created_at": "2025-07-28 08:59:17"
  },
  "message": "Zpráva úspěšně přidána"
}
```

### 3. Get Session Details
**Endpoint:** `GET /sessions/{sessionId}`

**Description:** Retrieves complete session details including all messages.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "session_id": "session-1753693147176-0PRDCX4M",
    "customer_email": "user@example.com",
    "customer_phone": "+420777888999",
    "status": "active",
    "total_messages": 2,
    "total_cost": 0.003,
    "metadata": {"user_agent": "Mozilla/5.0..."},
    "created_at": "2025-07-28 08:59:07",
    "updated_at": "2025-07-28 08:59:27",
    "messages": [
      {
        "id": 1,
        "session_id": "session-1753693147176-0PRDCX4M",
        "message_type": "user",
        "content": "Dobrý den, chtěl bych se zeptat na iPhone 15 Pro",
        "token_count": 15,
        "cost": 0.001,
        "response_time_ms": 0,
        "model_used": null,
        "metadata": null,
        "created_at": "2025-07-28 08:59:17"
      },
      {
        "id": 2,
        "session_id": "session-1753693147176-0PRDCX4M",
        "message_type": "assistant",
        "content": "iPhone 15 Pro stojí 35999 Kč.",
        "token_count": 12,
        "cost": 0.002,
        "response_time_ms": 800,
        "model_used": "claude-3.5-sonnet",
        "metadata": null,
        "created_at": "2025-07-28 08:59:27"
      }
    ]
  },
  "message": "Chatbot session úspěšně načtena"
}
```

### 4. List All Sessions
**Endpoint:** `GET /sessions`

**Query Parameters:**
- `limit` (optional): Number of sessions to return (default: 50)
- `offset` (optional): Number of sessions to skip (default: 0)
- `status` (optional): Filter by status ("active", "closed")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "session_id": "session-1753693147176-0PRDCX4M",
      "customer_email": "user@example.com",
      "customer_phone": "+420777888999",
      "status": "active",
      "total_messages": 2,
      "total_cost": 0.003,
      "metadata": {"user_agent": "Mozilla/5.0..."},
      "created_at": "2025-07-28 08:59:07",
      "updated_at": "2025-07-28 08:59:27",
      "message_count": 2
    }
  ],
  "message": "Chatbot sessions úspěšně načteny"
}
```

### 5. Update Session
**Endpoint:** `PUT /sessions/{sessionId}`

**Description:** Updates session status, customer info, or metadata.

**Request Body:**
```json
{
  "status": "closed",
  "customer_email": "updated@example.com",
  "metadata": {
    "resolution": "order_placed",
    "satisfaction": 5
  }
}
```

### 6. Get Analytics
**Endpoint:** `GET /analytics`

**Description:** Provides comprehensive analytics about chatbot usage.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_sessions": 1,
      "total_messages": 2,
      "total_cost": 0.003,
      "avg_messages_per_session": 2,
      "avg_cost_per_session": 0.003
    },
    "by_status": [
      {
        "status": "active",
        "count": 1,
        "total_cost": 0.003
      }
    ],
    "daily_stats": [
      {
        "date": "2025-07-28",
        "sessions_count": 1,
        "messages_count": 2,
        "total_cost": 0.003
      }
    ],
    "top_customers": [
      {
        "customer_email": "user@example.com",
        "session_count": 1,
        "total_messages": 2,
        "total_cost": 0.003
      }
    ]
  },
  "message": "Analytika úspěšně načtena"
}
```

### 7. Delete Session
**Endpoint:** `DELETE /sessions/{sessionId}`

**Description:** Permanently deletes a session and all its messages.

## Usage Example (JavaScript)

```javascript
// Create a new chatbot session
async function createChatbotSession(customerEmail, customerPhone) {
  const response = await fetch('https://shop-demo-api.kureckamichal.workers.dev/api/chatbot/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customer_email: customerEmail,
      customer_phone: customerPhone,
      metadata: {
        user_agent: navigator.userAgent,
        platform: 'web',
        timestamp: new Date().toISOString()
      }
    })
  });
  
  const data = await response.json();
  return data.success ? data.data.session_id : null;
}

// Add user message to session
async function addUserMessage(sessionId, message) {
  const response = await fetch(`https://shop-demo-api.kureckamichal.workers.dev/api/chatbot/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message_type: 'user',
      content: message,
      token_count: message.split(' ').length, // Simple word count
      cost: 0,
      response_time_ms: 0
    })
  });
  
  return await response.json();
}

// Add assistant response to session
async function addAssistantMessage(sessionId, message, tokenCount, cost, responseTime, model) {
  const response = await fetch(`https://shop-demo-api.kureckamichal.workers.dev/api/chatbot/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message_type: 'assistant',
      content: message,
      token_count: tokenCount,
      cost: cost,
      response_time_ms: responseTime,
      model_used: model
    })
  });
  
  return await response.json();
}

// Example chatbot conversation flow
async function handleChatbotConversation() {
  // 1. Create session
  const sessionId = await createChatbotSession('user@example.com', '+420777888999');
  
  if (!sessionId) {
    console.error('Failed to create session');
    return;
  }
  
  // 2. Add user message
  await addUserMessage(sessionId, 'Dobrý den, jaké máte iPhony?');
  
  // 3. Process with AI (your AI integration here)
  const aiResponse = "Dobrý den! Máme iPhone 15 Pro za 35,999 Kč a iPhone 15 za 29,999 Kč.";
  
  // 4. Add assistant response with tracking
  await addAssistantMessage(
    sessionId, 
    aiResponse, 
    25, // token count
    0.003, // cost in USD/CZK
    1200, // response time in ms
    'claude-3.5-sonnet'
  );
  
  console.log(`Conversation session: ${sessionId}`);
}
```

## Cost Tracking

The API automatically tracks:
- **Token usage** for each message
- **API costs** per request
- **Response times** for performance monitoring
- **Total session costs** aggregated automatically

## Analytics & Reporting

Use the analytics endpoint to monitor:
- **Daily usage statistics**
- **Cost trends**
- **Most active customers**
- **Session success rates**
- **Average conversation length**

This data helps optimize your chatbot and manage costs effectively.

## Integration Tips

1. **Session Management**: Create one session per customer conversation
2. **Cost Tracking**: Include actual API costs from your AI provider
3. **Token Counting**: Use proper tokenization for accurate billing
4. **Metadata**: Store useful context (user agent, referrer, etc.)
5. **Analytics**: Regularly review usage patterns and optimize
6. **Cleanup**: Delete old sessions periodically to manage storage