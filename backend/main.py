import hashlib
import random
import uuid
from datetime import datetime, timedelta

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Agent Evaluation Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Auth (mock, in-memory) ----------

def hash_password(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()


MOCK_USERS = {
    "admin": {
        "password_hash": hash_password("admin123"),
        "name": "Agent Evals Admin",
        "email": "admin@agentevals.dev",
    }
}

SESSIONS: dict[str, str] = {}  # token -> username


def public_user(username: str) -> dict:
    u = MOCK_USERS[username]
    return {"username": username, "name": u["name"], "email": u["email"]}


def get_current_user(authorization: str = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    username = SESSIONS.get(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return public_user(username)


class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/api/auth/login")
def login(payload: LoginRequest):
    user = MOCK_USERS.get(payload.username)
    if not user or hash_password(payload.password) != user["password_hash"]:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = str(uuid.uuid4())
    SESSIONS[token] = payload.username
    return {"token": token, "user": public_user(payload.username)}


@app.post("/api/auth/logout")
def logout(authorization: str = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
        SESSIONS.pop(token, None)
    return {"status": "logged out"}


@app.get("/api/auth/me")
def me(current_user: dict = Depends(get_current_user)):
    return current_user


# ---------- Mock Dashboard Data ----------

def generate_chart_data():
    data = []
    base_date = datetime.now() - timedelta(days=13)
    accuracy = 82
    latency = 450
    for i in range(14):
        accuracy += random.uniform(-2, 3)
        accuracy = max(70, min(98, accuracy))
        latency += random.uniform(-30, 40)
        latency = max(200, min(900, latency))
        data.append({
            "date": (base_date + timedelta(days=i)).strftime("%b %d"),
            "accuracy": round(accuracy, 1),
            "latency": round(latency, 0),
        })
    return data


MOCK_STATS = {
    "avg_ttft": {"label": "Avg. Latency (TTFT)", "value": "412ms", "delta": -6.2, "trend": "down"},
    "total_runs": {"label": "Total Runs", "value": "8,204", "delta": 12.4, "trend": "up"},
    "api_cost": {"label": "API Cost (24h)", "value": "$18.42", "delta": 3.1, "trend": "up"},
    "schema_pass_rate": {"label": "Schema Pass Rate", "value": "96.8%", "delta": 1.4, "trend": "up"},
}

MOCK_RECENT_RUNS = [
    {"id": 1, "model": "Claude 3.5 Sonnet", "task": "Schema Extraction", "status": "success", "time": "2m ago"},
    {"id": 2, "model": "GPT-4o", "task": "Lead Routing", "status": "success", "time": "5m ago"},
    {"id": 3, "model": "Gemini 1.5 Pro", "task": "Customer Support", "status": "fail", "time": "9m ago"},
    {"id": 4, "model": "Claude 3.5 Sonnet", "task": "Lead Routing", "status": "success", "time": "14m ago"},
    {"id": 5, "model": "GPT-4o Mini", "task": "Schema Extraction", "status": "fail", "time": "22m ago"},
    {"id": 6, "model": "Gemini 1.5 Pro", "task": "Customer Support", "status": "success", "time": "31m ago"},
]

MOCK_AGENTS = [
    {"id": "schema-extraction", "name": "Schema Extraction Agent", "description": "Structured JSON extraction from unstructured docs", "success_rate": 97, "runs": 2140, "color": "#5E4B8B"},
    {"id": "lead-routing", "name": "Lead Routing Agent", "description": "Classifies and routes inbound leads to the right team", "success_rate": 91, "runs": 1875, "color": "#FF758F"},
    {"id": "customer-support", "name": "Customer Support Agent", "description": "Handles tier-1 support tickets end to end", "success_rate": 88, "runs": 4189, "color": "#8B7FD1"},
]

MOCK_MODELS = [
    {"id": "claude-3.5-sonnet", "name": "Claude 3.5 Sonnet", "provider": "Anthropic", "avg_accuracy": 94.2, "avg_latency_ms": 380, "total_runs": 3120, "cost_per_1k": 3.00, "status": "active"},
    {"id": "gpt-4o", "name": "GPT-4o", "provider": "OpenAI", "avg_accuracy": 91.8, "avg_latency_ms": 410, "total_runs": 2680, "cost_per_1k": 2.50, "status": "active"},
    {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "provider": "Google", "avg_accuracy": 89.5, "avg_latency_ms": 520, "total_runs": 1740, "cost_per_1k": 1.75, "status": "active"},
    {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "provider": "OpenAI", "avg_accuracy": 85.1, "avg_latency_ms": 210, "total_runs": 664, "cost_per_1k": 0.15, "status": "active"},
]


def generate_eval_runs():
    models = ["Claude 3.5 Sonnet", "GPT-4o", "Gemini 1.5 Pro", "GPT-4o Mini"]
    tasks = ["Schema Extraction", "Lead Routing", "Customer Support"]
    runs = []
    for i in range(20):
        status = random.choices(["success", "fail"], weights=[85, 15])[0]
        runs.append({
            "id": i + 1,
            "model": random.choice(models),
            "task": random.choice(tasks),
            "status": status,
            "accuracy": round(random.uniform(78, 99), 1) if status == "success" else round(random.uniform(40, 70), 1),
            "latency_ms": random.randint(180, 900),
            "cost": round(random.uniform(0.002, 0.08), 4),
            "timestamp": (datetime.now() - timedelta(minutes=i * 7)).strftime("%b %d, %H:%M"),
        })
    return runs


def generate_logs():
    endpoints = ["/v1/evaluate", "/v1/extract", "/v1/route", "/v1/support-reply"]
    statuses = [200, 200, 200, 200, 429, 500]
    logs = []
    for i in range(25):
        code = random.choice(statuses)
        logs.append({
            "id": i + 1,
            "timestamp": (datetime.now() - timedelta(minutes=i * 3)).strftime("%b %d, %H:%M:%S"),
            "endpoint": random.choice(endpoints),
            "status_code": code,
            "duration_ms": random.randint(90, 1200),
            "level": "error" if code >= 400 else "info",
        })
    return logs


# ---------- Protected Dashboard Endpoints ----------

@app.get("/api/stats")
def get_stats(current_user: dict = Depends(get_current_user)):
    return MOCK_STATS


@app.get("/api/chart")
def get_chart_data(current_user: dict = Depends(get_current_user)):
    return generate_chart_data()


@app.get("/api/recent-runs")
def get_recent_runs(current_user: dict = Depends(get_current_user)):
    return MOCK_RECENT_RUNS


@app.get("/api/agents")
def get_agents(current_user: dict = Depends(get_current_user)):
    return MOCK_AGENTS


@app.get("/api/models")
def get_models(current_user: dict = Depends(get_current_user)):
    return MOCK_MODELS


@app.get("/api/eval-runs")
def get_eval_runs(current_user: dict = Depends(get_current_user)):
    return generate_eval_runs()


@app.get("/api/logs")
def get_logs(current_user: dict = Depends(get_current_user)):
    return generate_logs()


@app.get("/api/health")
def health_check():
    return {"status": "ok"}