#!/usr/bin/env python3
"""
Generate realistic English reviews for AI agents (3-50 per agent)
"""

import random
import uuid
from datetime import datetime, timedelta

REALISTIC_REVIEWS = {
    "trading": [
        (5, "Exceptional trading strategy! Made 15% profit in just one week. Highly recommended."),
        (5, "Best trading bot I've tested. Consistent returns even in volatile markets."),
        (4, "Good market analysis but occasionally signals lag behind price action."),
        (5, "Solid 3-month track record. This bot knows what it's doing."),
        (3, "Aggressive on fake news sometimes. Use with caution."),
        (4, "Helped me stay profitable during flat market conditions. Thanks!"),
        (5, "Perfect for scalping on 5-minute charts. Lightning fast execution."),
        (4, "Reliable performance, though risk management is essential."),
        (5, "Outperformed my manual trading by a wide margin."),
        (2, "Too many false signals in choppy markets. Needs improvement."),
        (4, "Great for crypto pairs, decent for forex."),
        (5, "The backtesting feature alone is worth the subscription."),
    ],
    "chat": [
        (5, "Lightning fast responses with deep contextual understanding."),
        (4, "Friendly tone but occasionally provides slightly inaccurate info."),
        (5, "Solved my complex query in under 2 minutes. Incredible!"),
        (5, "The best support bot I've used. Saves hours every week."),
        (4, "Professional approach with well-structured responses."),
        (3, "Sometimes struggles with complex Russian language nuances."),
        (5, "24/7 instant replies. Customer satisfaction improved dramatically."),
        (4, "Good for FAQs, escalates complex issues appropriately."),
        (5, "Personality is engaging without being annoying. Perfect balance."),
        (4, "Integration with our CRM was seamless."),
    ],
    "analytics": [
        (5, "Deep data analysis found patterns I was completely missing."),
        (4, "Detailed reports, though occasionally information overload."),
        (5, "Accurate predictive analytics helped with quarterly planning."),
        (4, "Good visualizations, easy to read charts and dashboards."),
        (5, "Zero downtime for months. Enterprise-grade reliability."),
        (5, "Saves 10+ hours weekly on manual analysis work."),
        (4, "Custom metrics feature is powerful but has learning curve."),
        (5, "The competitor analysis module is absolutely killer."),
        (3, "Export formats could be more diverse."),
        (5, "Real-time alerts caught market movements instantly."),
    ],
    "other": [
        (5, "Surprisingly useful automation tool for repetitive tasks."),
        (5, "Works out of the box. Minimal setup required."),
        (4, "Good documentation and code examples provided."),
        (5, "Integrates with dozens of services. Swiss army knife of tools."),
        (5, "No crashes in 2 months of heavy usage. Rock solid."),
        (4, "Great value for the price. ROI positive within a week."),
        (5, "The webhook automation saved our team 20 hours/month."),
        (4, "UI could be more polished but functionality is excellent."),
        (5, "Unexpectedly became essential to our workflow."),
        (4, "Regular updates with new features. Active development."),
    ]
}

REVIEWERS = [
    "alice.near", "bob_crypto", "trader_pro", "defi_whale", "nft_collector",
    "dao_member", "developer_js", "analyst_ai", "startup_founder", "vc_investor",
    "validator_node", "miner_btc", "artist_nft", "gamer_web3", "student_blockchain",
    "defi_dev", "nft_trader", "web3_builder", "crypto_research", "ai_enthusiast",
    "blockchain_dev", "token_engineer", "protocol_designer", "smart_contract_dev",
    "dex_trader", "yield_farmer", "liquidity_provider", "governance_voter",
    "community_mod", "tech_lead", "product_manager", "data_scientist",
]

def generate_reviews_for_agent(agent_name: str, category: str, agent_id: str, count: int = None):
    """Generate realistic reviews for an agent"""
    if count is None:
        count = random.randint(3, 12)  # 3-12 reviews per agent
    
    templates = REALISTIC_REVIEWS.get(category, REALISTIC_REVIEWS["other"])
    reviews = []
    
    for i in range(count):
        score, comment = random.choice(templates)
        reviewer = random.choice(REVIEWERS)
        days_ago = random.randint(1, 90)
        created_at = (datetime.now() - timedelta(days=days_ago)).isoformat()
        
        reviews.append({
            "id": str(uuid.uuid4()),
            "agent_id": agent_id,
            "reviewer_wallet": f"{reviewer}.testnet",
            "score": score,
            "comment": comment,
            "created_at": created_at,
        })
    
    return reviews

def generate_all_reviews_sql(agents: list):
    """Generate SQL for all agents"""
    all_reviews = []
    
    for agent in agents:
        reviews = generate_reviews_for_agent(
            agent["name"], 
            agent.get("category", "other"), 
            agent["id"],
            random.randint(5, 25)  # 5-25 reviews per agent
        )
        all_reviews.extend(reviews)
    
    # Generate SQL
    sql_lines = ["-- Generated reviews for all agents\n"]
    sql_lines.append("INSERT INTO reviews (id, agent_id, reviewer_wallet, score, comment, created_at) VALUES")
    
    values = []
    for r in all_reviews:
        values.append(f"\n  ('{r['id']}', '{r['agent_id']}', '{r['reviewer_wallet']}', {r['score']}, '{r['comment']}', '{r['created_at'][:10]}')")
    
    sql_lines.append(",".join(values) + ";\n")
    
    return "\n".join(sql_lines)

if __name__ == "__main__":
    # Example usage
    print("Example review generation:")
    reviews = generate_reviews_for_agent("gpt_trader_v2", "trading", "test-id", 5)
    for r in reviews:
        print(f"Score: {r['score']} | {r['comment'][:50]}...")
