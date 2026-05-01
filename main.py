import json
import os
import uuid
from contextlib import asynccontextmanager
from time import sleep
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
import re
import secrets
import random
import string

# Forbidden words for agent names
FORBIDDEN_WORDS = {'fuck', 'shit', 'porn', 'sex', 'nazi', 'hate', 'kill', 'bitch',
                   'хуй', 'пизда', 'блять', 'ебать', 'сука', 'мудак'}


_supabase_url: str | None = None
_supabase_headers: dict[str, str] | None = None


def get_supabase_config() -> tuple[str, dict[str, str]]:
    global _supabase_url, _supabase_headers
    if _supabase_url is None or _supabase_headers is None:
        url = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
        key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
        if not url or not key:
            raise RuntimeError(
                "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
            )
        _supabase_url = url
        _supabase_headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }
    return _supabase_url, _supabase_headers


def supabase_request(
    table: str,
    *,
    method: str = "GET",
    query: dict[str, str] | None = None,
    body: dict[str, Any] | None = None,
    prefer: str | None = None,
    retries: int = 3,
) -> Any:
    base_url, headers = get_supabase_config()
    req_headers = dict(headers)
    if prefer:
        req_headers["Prefer"] = prefer

    qs = f"?{urlencode(query)}" if query else ""
    url = f"{base_url}/rest/v1/{table}{qs}"
    payload = json.dumps(body).encode("utf-8") if body is not None else None
    last_error: Exception | None = None

    for attempt in range(retries):
        try:
            req = Request(url=url, data=payload, method=method, headers=req_headers)
            with urlopen(req, timeout=20) as resp:
                text = resp.read().decode("utf-8")
                return json.loads(text) if text else []
        except HTTPError as e:
            detail = e.read().decode("utf-8", "ignore")
            raise HTTPException(status_code=502, detail=detail or "Database error") from e
        except (URLError, OSError, TimeoutError) as e:
            last_error = e
            if attempt < retries - 1:
                sleep(0.3)
                continue
            raise HTTPException(status_code=502, detail="Database connection error") from e

    if last_error is not None:
        raise HTTPException(status_code=502, detail="Database connection error") from last_error
    raise HTTPException(status_code=502, detail="Database error")


def _agent_exists(agent_id: str) -> bool:
    rows = supabase_request(
        "agents",
        query={"select": "id", "id": f"eq.{agent_id}", "limit": "1"},
    )
    return bool(rows)


def _normalize_wallet(value: str | None) -> str | None:
    wallet = (value or "").strip()
    return wallet or None


def _normalize_category(value: str | None) -> str:
    allowed = {"trading", "chat", "analytics", "other"}
    category = (value or "other").strip().lower()
    return category if category in allowed else "other"


def _score_to_reputation(avg_score: float | None) -> float | None:
    if avg_score is None:
        return None
    return round((avg_score / 5.0) * 100.0, 1)


def _is_missing_column(exc: HTTPException, column_name: str) -> bool:
    if exc.status_code != 502:
        return False
    detail = str(exc.detail).lower()
    full = f"column {column_name}".lower()
    short = column_name.split(".")[-1].lower()
    return full in detail or f"'{short}' column" in detail or f"column '{short}'" in detail


def generate_similar_names(name: str, count: int = 5) -> list[str]:
    """Generate similar available names when a name is taken"""
    suggestions = []
    suffixes = ['_ai', '_bot', '_agent', '_pro', '_official', '_app', '_io', '_xyz']
    prefixes = ['my_', 'the_', 'real_', 'official_', 'best_', 'top_']
    
    # Check existing agents
    existing = supabase_request("agents", query={"select": "name"}) or []
    existing_names = {a['name'].lower() for a in existing}
    
    # Try suffixes
    for suffix in suffixes:
        new_name = f"{name}{suffix}"
        if new_name not in existing_names and len(new_name) <= 32:
            suggestions.append(new_name)
            if len(suggestions) >= count:
                return suggestions
    
    # Try prefixes
    for prefix in prefixes:
        new_name = f"{prefix}{name}"
        if new_name not in existing_names and len(new_name) <= 32:
            suggestions.append(new_name)
            if len(suggestions) >= count:
                return suggestions
    
    # Try random suffix
    while len(suggestions) < count:
        random_suffix = ''.join(random.choices(string.digits, k=3))
        new_name = f"{name}_{random_suffix}"
        if new_name not in existing_names and len(new_name) <= 32:
            suggestions.append(new_name)
    
    return suggestions[:count]


def verify_api_key_header(x_api_key: str | None = Header(None)) -> dict | None:
    """Verify API key from header"""
    if not x_api_key:
        return None
    try:
        result = supabase_request("api_keys", query={"select": "*", "key": f"eq.{x_api_key}"})
        if result and len(result) > 0:
            return result[0]
    except Exception:
        pass
    return None


@asynccontextmanager
async def _lifespan(app: FastAPI):
    get_supabase_config()
    yield


app = FastAPI(title="Reputation Oracle", lifespan=_lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AgentRegister(BaseModel):
    name: str = Field(..., min_length=1)
    description: str = ""
    near_wallet_id: str | None = None
    category: str = "other"

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.lower().strip()
        # Check format: only lowercase, numbers, underscore, 3-32 chars
        if not re.match(r'^[a-z0-9_]{3,32}$', v):
            raise ValueError('Name must be 3-32 characters, lowercase letters, numbers, and underscores only')
        # Check forbidden words
        v_lower = v.lower()
        for word in FORBIDDEN_WORDS:
            if word in v_lower:
                raise ValueError(f'Name contains forbidden word')
        return v


class ReviewCreate(BaseModel):
    score: int = Field(..., ge=1, le=5)
    comment: str = ""
    reviewer_wallet_id: str | None = None


class ReviewOut(BaseModel):
    score: int
    comment: str
    reviewer_wallet_id: str | None
    created_at: str | None


class AgentProfile(BaseModel):
    id: str
    name: str
    description: str
    near_wallet_id: str | None
    category: str
    reviews: list[ReviewOut]
    average_score: float | None
    reputation_score: float | None
    is_verified: bool = False
    review_count: int = 0


class ReputationHistoryItem(BaseModel):
    id: str
    agent_id: str
    old_score: int | None
    new_score: int | None
    timestamp: str
    tx_hash: str | None


class StatsResponse(BaseModel):
    total_agents: int
    total_reviews: int
    verified_agents: int
    average_rating: float


class ApiKeyResponse(BaseModel):
    key: str
    owner_wallet: str
    created_at: str


class VerifyRequest(BaseModel):
    tx_hash: str


class AgentListItem(BaseModel):
    id: str
    name: str
    near_wallet_id: str | None
    category: str
    average_score: float | None
    reputation_score: float | None
    is_verified: bool = False
    review_count: int = 0


@app.get("/agents/check")
def check_agent_name(name: str):
    """Check if agent name is available and valid"""
    name = name.lower().strip()
    
    # Validate format
    if not re.match(r'^[a-z0-9_]{3,32}$', name):
        return {
            "available": False,
            "error": "Name must be 3-32 characters, lowercase letters, numbers, and underscores only",
            "suggestions": []
        }
    
    # Check forbidden words
    for word in FORBIDDEN_WORDS:
        if word in name:
            return {
                "available": False,
                "error": "Name contains forbidden word",
                "suggestions": []
            }
    
    # Check if name exists
    try:
        existing = supabase_request("agents", query={"select": "name", "name": f"eq.{name}"})
        if existing and len(existing) > 0:
            suggestions = generate_similar_names(name, 5)
            return {
                "available": False,
                "error": "Name is already taken",
                "suggestions": suggestions
            }
    except Exception as e:
        pass
    
    return {
        "available": True,
        "error": None,
        "suggestions": []
    }


@app.get("/stats", response_model=StatsResponse)
def get_stats():
    """Get public statistics"""
    agents = supabase_request("agents", query={"select": "*"}) or []
    reviews = supabase_request("reviews", query={"select": "*"}) or []
    
    verified_count = 0
    total_rating = 0
    agents_with_rating = 0
    
    for agent in agents:
        if agent.get('is_verified'):
            verified_count += 1
    
    # Calculate average rating from reviews
    scores_by_agent: dict[str, list[float]] = {}
    for review in reviews:
        aid = review.get("agent_id")
        sc = review.get("score")
        if aid and isinstance(sc, (int, float)):
            scores_by_agent.setdefault(aid, []).append(float(sc))
    
    avg_scores = []
    for scores in scores_by_agent.values():
        if scores:
            avg_scores.append(sum(scores) / len(scores))
    
    average_rating = round(sum(avg_scores) / len(avg_scores), 1) if avg_scores else 0.0
    
    return {
        "total_agents": len(agents),
        "total_reviews": len(reviews),
        "verified_agents": verified_count,
        "average_rating": average_rating
    }


@app.get("/agents", response_model=list[AgentListItem])
def list_agents(
    q: str | None = None,
    category: str | None = None,
    min_reputation: float | None = None,
) -> list[AgentListItem]:
    try:
        agents_rows: list[dict[str, Any]] = (
            supabase_request(
                "agents",
                query={"select": "id,name,near_wallet_id,category"},
            )
            or []
        )
    except HTTPException as e:
        if _is_missing_column(e, "agents.near_wallet_id") or _is_missing_column(e, "agents.category"):
            agents_rows = supabase_request("agents", query={"select": "id,name"}) or []
        else:
            raise
    reviews_rows: list[dict[str, Any]] = (
        supabase_request("reviews", query={"select": "agent_id,score"}) or []
    )

    scores_by_agent: dict[str, list[float]] = {}
    for row in reviews_rows:
        aid = row.get("agent_id")
        sc = row.get("score")
        if aid is None or not isinstance(sc, (int, float)):
            continue
        scores_by_agent.setdefault(aid, []).append(float(sc))

    items: list[AgentListItem] = []
    query_text = (q or "").strip().lower()
    normalized_category = _normalize_category(category) if category else None
    for row in agents_rows:
        aid = str(row.get("id") or "")
        if not aid:
            continue
        name = str(row.get("name") or "")
        agent_category = _normalize_category(str(row.get("category") or "other"))
        if normalized_category and agent_category != normalized_category:
            continue
        if query_text and query_text not in name.lower():
            continue
        scores = scores_by_agent.get(aid, [])
        avg = sum(scores) / len(scores) if scores else None
        reputation = _score_to_reputation(avg)
        if min_reputation is not None and min_reputation > 0 and (reputation is None or reputation < min_reputation):
            continue
        items.append(
            AgentListItem(
                id=aid,
                name=name,
                near_wallet_id=_normalize_wallet(row.get("near_wallet_id")),
                category=agent_category,
                average_score=avg,
                reputation_score=reputation,
                is_verified=row.get("is_verified", False),
                review_count=len(scores),
            )
        )
    # Sort: verified first, then by reputation score desc, then by name
    items.sort(key=lambda x: (-int(x.is_verified), -(x.reputation_score or 0), (x.name or "").lower()))
    return items


@app.post("/agents/register", status_code=201)
def register_agent(body: AgentRegister) -> dict:
    agent_id = str(uuid.uuid4())
    near_wallet_id = _normalize_wallet(body.near_wallet_id)
    category = _normalize_category(body.category)
    try:
        supabase_request(
            "agents",
            method="POST",
            body={
                "id": agent_id,
                "name": body.name,
                "description": body.description,
                "near_wallet_id": near_wallet_id,
                "category": category,
            },
            prefer="return=minimal",
        )
    except HTTPException as e:
        if _is_missing_column(e, "agents.near_wallet_id") or _is_missing_column(e, "agents.category"):
            supabase_request(
                "agents",
                method="POST",
                body={"id": agent_id, "name": body.name, "description": body.description},
                prefer="return=minimal",
            )
        else:
            raise
    return {
        "id": agent_id,
        "name": body.name,
        "description": body.description,
        "near_wallet_id": near_wallet_id,
        "category": category,
    }


@app.post("/agents/{agent_id}/review", status_code=201)
def submit_review(agent_id: str, body: ReviewCreate) -> dict:
    if not _agent_exists(agent_id):
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Get current score before adding review
    old_reviews = supabase_request("reviews", query={"select": "score", "agent_id": f"eq.{agent_id}"}) or []
    old_scores = [r["score"] for r in old_reviews if isinstance(r.get("score"), (int, float))]
    old_avg = round(sum(old_scores) / len(old_scores), 1) if old_scores else None
    
    try:
        supabase_request(
            "reviews",
            method="POST",
            body={
                "agent_id": agent_id,
                "score": body.score,
                "comment": body.comment,
                "reviewer_wallet_id": _normalize_wallet(body.reviewer_wallet_id),
            },
            prefer="return=minimal",
        )
    except HTTPException as e:
        if _is_missing_column(e, "reviews.reviewer_wallet_id"):
            supabase_request(
                "reviews",
                method="POST",
                body={"agent_id": agent_id, "score": body.score, "comment": body.comment},
                prefer="return=minimal",
            )
        else:
            raise
    
    # Calculate new score after review
    new_scores = old_scores + [body.score]
    new_avg = round(sum(new_scores) / len(new_scores), 1)
    
    # Track reputation history if score changed significantly (>= 1 point)
    if old_avg is None or abs(new_avg - old_avg) >= 0.5:
        try:
            supabase_request(
                "reputation_history",
                method="POST",
                body={
                    "agent_id": agent_id,
                    "old_score": int(old_avg * 20) if old_avg else None,  # Convert to 0-100 scale
                    "new_score": int(new_avg * 20),  # Convert to 0-100 scale
                    "tx_hash": None
                },
                prefer="return=minimal"
            )
        except Exception:
            pass  # Don't fail if history tracking fails
    
    return {"ok": True, "agent_id": agent_id, "new_average": new_avg}


@app.get("/agents/{agent_id}", response_model=AgentProfile)
def get_agent(agent_id: str) -> AgentProfile:
    try:
        rows = supabase_request(
            "agents",
            query={"select": "id,name,description,near_wallet_id,category", "id": f"eq.{agent_id}"},
        ) or []
    except HTTPException as e:
        if _is_missing_column(e, "agents.near_wallet_id") or _is_missing_column(e, "agents.category"):
            rows = supabase_request(
                "agents",
                query={"select": "id,name,description", "id": f"eq.{agent_id}"},
            ) or []
        else:
            raise
    if not rows:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent = rows[0]

    try:
        reviews_raw = (
            supabase_request(
                "reviews",
                query={
                    "select": "score,comment,reviewer_wallet_id,created_at",
                    "agent_id": f"eq.{agent_id}",
                    "order": "created_at.asc",
                },
            )
            or []
        )
    except HTTPException as e:
        if _is_missing_column(e, "reviews.reviewer_wallet_id"):
            reviews_raw = (
                supabase_request(
                    "reviews",
                    query={
                        "select": "score,comment,created_at",
                        "agent_id": f"eq.{agent_id}",
                        "order": "created_at.asc",
                    },
                )
                or []
            )
        else:
            raise
    reviews = [
        ReviewOut(
            score=int(r["score"]),
            comment=r.get("comment") or "",
            reviewer_wallet_id=_normalize_wallet(r.get("reviewer_wallet_id")),
            created_at=r.get("created_at"),
        )
        for r in reviews_raw
    ]
    scores = [r.score for r in reviews]
    avg = sum(scores) / len(scores) if scores else None

    return AgentProfile(
        id=agent["id"],
        name=agent["name"],
        description=agent.get("description") or "",
        near_wallet_id=_normalize_wallet(agent.get("near_wallet_id")),
        category=_normalize_category(agent.get("category")),
        reviews=reviews,
        average_score=avg,
        reputation_score=_score_to_reputation(avg),
        is_verified=agent.get("is_verified", False),
        review_count=len(reviews),
    )


@app.get("/agents/{agent_id}/reputation-history", response_model=list[ReputationHistoryItem])
def get_reputation_history(agent_id: str):
    """Get reputation history for an agent"""
    if not _agent_exists(agent_id):
        raise HTTPException(status_code=404, detail="Agent not found")
    
    history = supabase_request(
        "reputation_history",
        query={
            "select": "*",
            "agent_id": f"eq.{agent_id}",
            "order": "timestamp.desc"
        }
    ) or []
    
    return [
        ReputationHistoryItem(
            id=h["id"],
            agent_id=h["agent_id"],
            old_score=h.get("old_score"),
            new_score=h.get("new_score"),
            timestamp=h.get("timestamp"),
            tx_hash=h.get("tx_hash")
        )
        for h in history
    ]


@app.post("/agents/{agent_id}/verify")
def verify_agent(agent_id: str, body: VerifyRequest):
    """Verify an agent by paying 0.1 NEAR"""
    if not _agent_exists(agent_id):
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Update agent to verified
    try:
        supabase_request(
            "agents",
            method="PATCH",
            query={"id": f"eq.{agent_id}"},
            body={"is_verified": True}
        )
    except HTTPException as e:
        if _is_missing_column(e, "agents.is_verified"):
            raise HTTPException(status_code=400, detail="Database not migrated. Run SQL migration first.")
        raise
    
    # Log the verification in reputation history
    try:
        supabase_request(
            "reputation_history",
            method="POST",
            body={
                "agent_id": agent_id,
                "old_score": None,
                "new_score": None,
                "tx_hash": body.tx_hash
            },
            prefer="return=minimal"
        )
    except Exception:
        pass
    
    return {"ok": True, "agent_id": agent_id, "is_verified": True}


@app.get("/leaderboard", response_model=list[AgentListItem])
def get_leaderboard(limit: int = 10):
    """Get top agents leaderboard"""
    agents = supabase_request("agents", query={"select": "*"}) or []
    reviews = supabase_request("reviews", query={"select": "agent_id,score"}) or []
    
    scores_by_agent: dict[str, list[float]] = {}
    for review in reviews:
        aid = review.get("agent_id")
        sc = review.get("score")
        if aid and isinstance(sc, (int, float)):
            scores_by_agent.setdefault(aid, []).append(float(sc))
    
    items: list[AgentListItem] = []
    for agent in agents:
        aid = str(agent.get("id") or "")
        if not aid:
            continue
        scores = scores_by_agent.get(aid, [])
        avg = sum(scores) / len(scores) if scores else None
        reputation = _score_to_reputation(avg)
        
        items.append(AgentListItem(
            id=aid,
            name=agent["name"],
            near_wallet_id=_normalize_wallet(agent.get("near_wallet_id")),
            category=_normalize_category(agent.get("category")),
            average_score=avg,
            reputation_score=reputation,
            is_verified=agent.get("is_verified", False),
            review_count=len(scores)
        ))
    
    # Sort by reputation score desc, then verified, then review count
    items.sort(key=lambda x: (-(x.reputation_score or 0), -int(x.is_verified), -x.review_count))
    return items[:limit]


@app.post("/api-keys/generate", response_model=ApiKeyResponse)
def generate_api_key(wallet_id: str):
    """Generate a new API key for a wallet"""
    wallet = _normalize_wallet(wallet_id)
    if not wallet:
        raise HTTPException(status_code=400, detail="Wallet ID required")
    
    # Generate secure random key
    api_key = f"ro_{secrets.token_urlsafe(32)}"
    
    try:
        result = supabase_request(
            "api_keys",
            method="POST",
            body={
                "key": api_key,
                "owner_wallet": wallet
            },
            prefer="return=representation"
        )
        
        if result and len(result) > 0:
            return ApiKeyResponse(
                key=result[0]["key"],
                owner_wallet=result[0]["owner_wallet"],
                created_at=result[0].get("created_at", "")
            )
    except HTTPException as e:
        if "duplicate key" in str(e.detail).lower() or "unique constraint" in str(e.detail).lower():
            raise HTTPException(status_code=409, detail="API key already exists for this wallet")
        if _is_missing_column(e, "api_keys"):
            raise HTTPException(status_code=400, detail="Database not migrated. Run SQL migration first.")
        raise
    
    raise HTTPException(status_code=500, detail="Failed to generate API key")


@app.get("/api-keys/my")
def get_my_api_keys(wallet_id: str):
    """Get all API keys for a wallet"""
    wallet = _normalize_wallet(wallet_id)
    if not wallet:
        raise HTTPException(status_code=400, detail="Wallet ID required")
    
    try:
        keys = supabase_request(
            "api_keys",
            query={"select": "*", "owner_wallet": f"eq.{wallet}"}
        ) or []
        
        return {
            "keys": [
                {
                    "id": k["id"],
                    "key": k["key"][:20] + "...",  # Mask the key
                    "owner_wallet": k["owner_wallet"],
                    "created_at": k.get("created_at")
                }
                for k in keys
            ]
        }
    except HTTPException as e:
        if _is_missing_column(e, "api_keys"):
            raise HTTPException(status_code=400, detail="Database not migrated. Run SQL migration first.")
        raise


# ============================================================================
# NEAR CONTRACT INTEGRATION (Блокчейн интеграция)
# ============================================================================

NEAR_CONTRACT_ID = os.environ.get("NEAR_CONTRACT_ID", "reputation-oracle.testnet")
NEAR_RPC_URL = "https://rpc.testnet.near.org"

def near_view_contract(method: str, args: dict) -> Any:
    """Call a view method on the NEAR contract (бесплатно, без авторизации)"""
    import base64
    
    args_json = json.dumps(args)
    args_base64 = base64.b64encode(args_json.encode()).decode()
    
    payload = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function",
            "account_id": NEAR_CONTRACT_ID,
            "method_name": method,
            "args_base64": args_base64,
            "finality": "optimistic"
        }
    }
    
    req = Request(NEAR_RPC_URL, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
    
    try:
        with urlopen(req) as response:
            data = json.loads(response.read().decode())
            if "error" in data:
                raise HTTPException(status_code=500, detail=f"NEAR contract error: {data['error']}")
            
            result = data.get("result", {})
            if "result" in result:
                # Decode base64 result
                decoded = base64.b64decode("".join([chr(x) for x in result["result"]])).decode()
                return json.loads(decoded) if decoded else None
            return None
    except Exception as e:
        # If contract not deployed yet, return None
        return None


@app.get("/contract/reputation/{agent_id}")
def get_contract_reputation(agent_id: str):
    """Get reputation directly from NEAR contract (из блокчейна)"""
    result = near_view_contract("get_reputation", {"agent_id": agent_id})
    if result is None:
        raise HTTPException(status_code=404, detail="Agent not found in contract or contract not deployed")
    return {"agent_id": agent_id, "reputation_score": result}


@app.get("/contract/agent/{agent_id}")
def get_contract_agent(agent_id: str):
    """Get agent data from NEAR contract (из блокчейна)"""
    result = near_view_contract("get_agent", {"agent_id": agent_id})
    if result is None:
        raise HTTPException(status_code=404, detail="Agent not found in contract")
    return result


@app.get("/contract/agent/{agent_id}/reviews")
def get_contract_reviews(agent_id: str):
    """Get reviews from NEAR contract (из блокчейна)"""
    result = near_view_contract("get_agent_reviews", {"agent_id": agent_id})
    if result is None:
        return {"agent_id": agent_id, "reviews": []}
    return {"agent_id": agent_id, "reviews": result}


@app.get("/contract/exists/{agent_id}")
def check_contract_agent_exists(agent_id: str):
    """Check if agent exists in NEAR contract"""
    result = near_view_contract("agent_exists", {"agent_id": agent_id})
    return {"agent_id": agent_id, "exists": bool(result)}


@app.get("/contract/info")
def get_contract_info():
    """Get NEAR contract information"""
    return {
        "contract_id": NEAR_CONTRACT_ID,
        "network": "testnet",
        "rpc_url": NEAR_RPC_URL,
        "methods": [
            "register_agent",
            "add_review", 
            "verify_agent",
            "get_reputation",
            "get_agent",
            "get_agent_reviews",
            "agent_exists"
        ]
    }
