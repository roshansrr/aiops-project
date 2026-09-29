# ⬡ AIOps Copilot — Intelligent IT Log Analyzer

> AI-powered log analysis, anomaly detection, auto-remediation, and natural language operations assistant.

---

## 🚀 Quick Start (5 Minutes)

### Option A: Manual Setup (Recommended)

**Step 1 — Backend**
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

**Step 2 — Frontend** (new terminal)
```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000
```

**Step 3 — Open browser**
```
http://localhost:3000
```

---

### Option B: Docker (One Command)
```bash
docker-compose up --build
# Opens http://localhost:3000
```

---

## 🔑 Add Free AI Copilot (Optional but Recommended)

1. Go to **https://console.groq.com**
2. Sign up (free, no credit card)
3. Create API key
4. Copy `.env.example` → `.env`
5. Paste your key:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
6. Restart backend

**Works without key** — demo responses built-in.

---

## 📁 Project Structure

```
aiops-project/
├── backend/
│   ├── app.py              # Flask API server
│   ├── anomaly_detector.py # ML anomaly detection (Isolation Forest)
│   ├── log_generator.py    # Realistic log simulation
│   ├── remediator.py       # Auto-fix engine
│   ├── copilot.py          # AI copilot (Groq/demo)
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx    # Live metrics & charts
│       │   ├── Anomalies.jsx    # ML anomaly results
│       │   ├── LogExplorer.jsx  # Live log stream & search
│       │   ├── Servers.jsx      # Server fleet status
│       │   └── Copilot.jsx      # AI chat interface
│       └── components/
│           ├── Sidebar.jsx
│           └── TopBar.jsx
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tech Stack (100% Free)

| Layer | Tool | Cost |
|-------|------|------|
| Log Generation | Python | FREE |
| Anomaly Detection | Scikit-learn (Isolation Forest) | FREE |
| Auto-Remediation | Python/Bash scripts | FREE |
| AI Copilot | Groq API (Llama 3) | FREE |
| Backend API | Flask + Flask-CORS | FREE |
| Charts | Recharts | FREE |
| Frontend | React 18 | FREE |
| Containerization | Docker | FREE |

---

## 🎯 Features

### Dashboard
- Real-time CPU, Memory, Disk, Network charts
- Live alert feed with auto-fix buttons
- System health score
- Revenue saved counter

### Anomaly Detection
- Isolation Forest ML model
- Detects: Memory leaks, CPU spikes, Disk full, Security attacks, Performance degradation
- Radar chart fingerprint per anomaly
- Confidence scoring

### Log Explorer
- Live streaming log feed (updates every 2s)
- Search by server, service, message
- Filter by severity level
- Color-coded log levels

### Server Fleet
- 12-server grid with health indicators
- Per-server CPU/Memory/Disk bars
- Click for detailed view

### AI Copilot
- Natural language queries in plain English
- Demo responses for common questions
- Full AI with Groq key (free)
- Chat history context

---

## 💬 Sample Copilot Queries

```
"Any issues overnight I should know about?"
"Why did the website crash yesterday?"
"What's the database performance like?"
"Any security threats detected?"
"What will fail in the next 24 hours?"
"Show me all server status"
"How much revenue did we save today?"
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Server health check |
| GET | /api/stats | Dashboard statistics |
| GET | /api/metrics | Live system metrics |
| GET | /api/metrics/history | Historical metrics |
| GET | /api/logs/live | Real-time log stream |
| POST | /api/logs/search | Search logs |
| GET | /api/anomalies | ML anomaly results |
| GET | /api/alerts | Active alerts |
| POST | /api/remediate | Trigger auto-fix |
| GET | /api/servers | Server fleet status |
| POST | /api/copilot/chat | AI copilot query |

---

## 🎓 For Demo / Presentation

The project works **fully offline** without any external services:
- Realistic log generation built-in
- ML model trains on startup (< 1 second)
- Demo copilot responses for all common queries
- Charts auto-refresh every 5 seconds

Add Groq key only if you want live AI responses.

