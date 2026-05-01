-- Обновление статуса verified для 10 агентов
UPDATE agents SET is_verified = true WHERE id IN (
  SELECT id FROM agents ORDER BY created_at LIMIT 10
);

-- Добавление отзывов для агентов
INSERT INTO reviews (id, agent_id, reviewer_wallet, score, comment, created_at) VALUES
-- Отзывы для агентов (по 2-3 отзыва на каждого)
('review-001', (SELECT id FROM agents WHERE name = 'gpt_trader_v2' LIMIT 1), 'alice_near.testnet', 5, 'Отличная стратегия! За неделю +15% к портфелю. Рекомендую.', NOW() - INTERVAL '5 days'),
('review-002', (SELECT id FROM agents WHERE name = 'gpt_trader_v2' LIMIT 1), 'bob_crypto.testnet', 4, 'Хороший анализ рынка, но иногда сигналы запаздывают.', NOW() - INTERVAL '12 days'),
('review-003', (SELECT id FROM agents WHERE name = 'sales_autopilot' LIMIT 1), 'trader_pro.testnet', 5, 'Стабильные результаты 3 месяца подряд. 5 звезд!', NOW() - INTERVAL '8 days'),
('review-004', (SELECT id FROM agents WHERE name = 'sales_autopilot' LIMIT 1), 'defi_whale.testnet', 4, 'Помог выйти в плюс на флетовом рынке. Спасибо!', NOW() - INTERVAL '15 days'),
('review-005', (SELECT id FROM agents WHERE name = 'smart_contract_auditor' LIMIT 1), 'nft_collector.testnet', 5, 'Нашел критический баг перед деплоем. Спасл проект!', NOW() - INTERVAL '3 days'),
('review-006', (SELECT id FROM agents WHERE name = 'smart_contract_auditor' LIMIT 1), 'dao_member.testnet', 5, 'Профессиональный аудит, подробный отчет.', NOW() - INTERVAL '10 days'),
('review-007', (SELECT id FROM agents WHERE name = 'social_manager_ai' LIMIT 1), 'developer_js.testnet', 4, 'Очень быстрые ответы, понимает контекст разговора.', NOW() - INTERVAL '7 days'),
('review-008', (SELECT id FROM agents WHERE name = 'social_manager_ai' LIMIT 1), 'analyst_ai.testnet', 3, 'Дружелюбный тон, но иногда дает неточную информацию.', NOW() - INTERVAL '20 days'),
('review-009', (SELECT id FROM agents WHERE name = 'support_gpt' LIMIT 1), 'startup_founder.testnet', 5, 'Лучший support-бот, экономит массу времени.', NOW() - INTERVAL '4 days'),
('review-010', (SELECT id FROM agents WHERE name = 'support_gpt' LIMIT 1), 'vc_investor.testnet', 4, 'Помог решить сложный вопрос за 2 минуты. Супер!', NOW() - INTERVAL '18 days'),
('review-011', (SELECT id FROM agents WHERE name = 'near_wallet_guard' LIMIT 1), 'validator_node.testnet', 5, 'Обнаружил подозрительную транзакцию и предупредил. Спас средства!', NOW() - INTERVAL '6 days'),
('review-012', (SELECT id FROM agents WHERE name = 'near_wallet_guard' LIMIT 1), 'miner_btc.testnet', 4, 'Надежная защита, работает 24/7 без ложных тревог.', NOW() - INTERVAL '14 days'),
('review-013', (SELECT id FROM agents WHERE name = 'doc_summarizer' LIMIT 1), 'artist_nft.testnet', 5, 'Сократил 50-страничный документ до ключевых тезисов за секунды.', NOW() - INTERVAL '9 days'),
('review-014', (SELECT id FROM agents WHERE name = 'doc_summarizer' LIMIT 1), 'gamer_web3.testnet', 4, 'Удобно для быстрого анализа новостей и обновлений.', NOW() - INTERVAL '22 days'),
('review-015', (SELECT id FROM agents WHERE name = 'portfolio_rebalancer' LIMIT 1), 'student_blockchain.testnet', 5, 'Автоматическая балансировка портфеля работает идеально.', NOW() - INTERVAL '11 days'),
('review-016', (SELECT id FROM agents WHERE name = 'portfolio_rebalancer' LIMIT 1), 'alice_near.testnet', 4, 'Экономит время на ручном пересчете пропорций.', NOW() - INTERVAL '25 days'),
('review-017', (SELECT id FROM agents WHERE name = 'news_trader_bot' LIMIT 1), 'bob_crypto.testnet', 5, 'Реагирует на новости быстрее чем я успеваю прочитать заголовок!', NOW() - INTERVAL '2 days'),
('review-018', (SELECT id FROM agents WHERE name = 'news_trader_bot' LIMIT 1), 'trader_pro.testnet', 3, 'Иногда слишком агрессивно входит в позиции на фейковых новостях.', NOW() - INTERVAL '16 days'),
('review-019', (SELECT id FROM agents WHERE name = 'arXiv_digest' LIMIT 1), 'defi_whale.testnet', 5, 'Ежедневные дайджесты AI-исследований бесценны для работы.', NOW() - INTERVAL '13 days'),
('review-020', (SELECT id FROM agents WHERE name = 'arXiv_digest' LIMIT 1), 'nft_collector.testnet', 4, 'Хорошая фильтрация по темам, не пропускаю важные статьи.', NOW() - INTERVAL '19 days'),
('review-021', (SELECT id FROM agents WHERE name = 'devin_lite' LIMIT 1), 'dao_member.testnet', 5, 'Написал и задеплоил контракт за 10 минут. Невероятно!', NOW() - INTERVAL '1 day'),
('review-022', (SELECT id FROM agents WHERE name = 'devin_lite' LIMIT 1), 'developer_js.testnet', 4, 'Хорошо справляется с простыми задачами, сложные требуют доработки.', NOW() - INTERVAL '17 days'),
('review-023', (SELECT id FROM agents WHERE name = 'onchain_analyst' LIMIT 1), 'analyst_ai.testnet', 5, 'Нашел взаимосвязи между китами и движением цены которые я не видел.', NOW() - INTERVAL '8 days'),
('review-024', (SELECT id FROM agents WHERE name = 'onchain_analyst' LIMIT 1), 'startup_founder.testnet', 4, 'Данные актуальные, но визуализации можно улучшить.', NOW() - INTERVAL '21 days');
