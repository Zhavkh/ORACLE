#!/usr/bin/env python3
"""
Генерация реалистичных отзывов и рейтингов для агентов
Минимум 10 verified агентов
"""

import random
import uuid
from datetime import datetime, timedelta

# Реалистичные отзывы для AI агентов
REVIEW_TEMPLATES = {
    "trading": [
        "Отличная стратегия! За неделю +15% к портфелю. Рекомендую.",
        "Хороший анализ рынка, но иногда сигналы запаздывают.",
        "Советую использовать с осторожностью - высокий риск.",
        "Стабильные результаты 3 месяца подряд. 5 звезд!",
        "Лучший трейдинг-бот из всех что я тестировал.",
        "Помог выйти в плюс на флетовом рынке. Спасибо!",
        "Не оправдал ожиданий, много ложных сигналов.",
        "Работает отлично для scalp торговли на 5-минутках.",
    ],
    "chat": [
        "Очень быстрые ответы, понимает контекст разговора.",
        "Помог решить сложный вопрос за 2 минуты. Супер!",
        "Дружелюбный тон, но иногда дает неточную информацию.",
        "Лучший support-бот, экономит массу времени.",
        "Иногда не понимает сложные запросы на русском.",
        "Профессиональный подход, структурированные ответы.",
        "Отвечает мгновенно 24/7, очень удобно.",
    ],
    "analytics": [
        "Глубокий анализ данных, нашел паттерны которые я пропускал.",
        "Отчеты подробные но иногда перегружены информацией.",
        "Точная предиктивная аналитика, помог в планировании.",
        "Хорошие визуализации, легко читать графики.",
        "Интеграция с данными работает без сбоев месяцами.",
        "Экономит 10 часов в неделю на ручном анализе.",
    ],
    "other": [
        "Неожиданно полезный инструмент для автоматизации.",
        "Прост в настройке, работает из коробки.",
        "Хорошая документация и примеры использования.",
        "Интегрируется с множеством сервисов. Рекомендую!",
        "Надежная работа, ни одного сбоя за 2 месяца.",
        "Цена-качество отличное. Окупился за неделю.",
    ]
}

USERS = [
    "alice_near",
    "bob_crypto",
    "trader_pro",
    "defi_whale",
    "nft_collector",
    "dao_member",
    "developer_js",
    "analyst_ai",
    "startup_founder",
    "vc_investor",
    "validator_node",
    "miner_btc",
    "artist_nft",
    "gamer_web3",
    "student_blockchain",
]

def generate_review(agent_id: str, agent_category: str, agent_name: str):
    """Генерирует один реалистичный отзыв"""
    category = agent_category if agent_category in REVIEW_TEMPLATES else "other"
    templates = REVIEW_TEMPLATES[category]
    
    score = random.choices([3, 4, 5], weights=[0.15, 0.35, 0.5])[0]
    comment = random.choice(templates)
    reviewer = random.choice(USERS)
    
    # Рандомная дата за последние 3 месяца
    days_ago = random.randint(1, 90)
    created_at = (datetime.now() - timedelta(days=days_ago)).isoformat()
    
    return {
        "id": str(uuid.uuid4()),
        "agent_id": agent_id,
        "reviewer_wallet": reviewer + ".testnet",
        "score": score,
        "comment": comment,
        "created_at": created_at,
    }

def generate_verified_status(agent_name: str, index: int):
    """Определяет статус verified - первые 10 точно verified"""
    return index < 10  # Первые 10 агентов verified

if __name__ == "__main__":
    # Тест генерации
    print("Пример отзыва:")
    review = generate_review("test-agent", "trading", "Test Agent")
    print(f"Score: {review['score']}")
    print(f"Comment: {review['comment']}")
    print(f"Reviewer: {review['reviewer_wallet']}")
