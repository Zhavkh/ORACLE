-- Realistic English reviews for all agents (3-25 per agent)
-- Generated for production use

-- First, set 10 agents as verified
UPDATE agents SET is_verified = true WHERE name IN (
  'gpt_trader_v2', 'sales_autopilot', 'smart_contract_auditor', 
  'social_manager_ai', 'support_gpt', 'near_wallet_guard', 
  'doc_summarizer', 'portfolio_rebalancer', 'news_trader_bot', 'devin_lite'
);

-- Add realistic reviews
INSERT INTO reviews (id, agent_id, reviewer_wallet, score, comment, created_at) VALUES
-- gpt_trader_v2 reviews (trading)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'gpt_trader_v2'), 'alice.near.testnet', 5, 'Exceptional trading strategy! Made 15% profit in just one week. Highly recommended.', NOW() - INTERVAL '5 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'gpt_trader_v2'), 'trader_pro.testnet', 5, 'Best trading bot I have tested. Consistent returns even in volatile markets.', NOW() - INTERVAL '12 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'gpt_trader_v2'), 'bob_crypto.testnet', 4, 'Good market analysis but occasionally signals lag behind price action.', NOW() - INTERVAL '18 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'gpt_trader_v2'), 'defi_whale.testnet', 5, 'Solid 3-month track record. This bot knows what it is doing.', NOW() - INTERVAL '25 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'gpt_trader_v2'), 'dex_trader.testnet', 4, 'Reliable performance, though risk management is essential.', NOW() - INTERVAL '8 days'),

-- sales_autopilot reviews (chat)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'sales_autopilot'), 'startup_founder.testnet', 5, 'Increased our conversion rate by 40%. This AI understands sales psychology.', NOW() - INTERVAL '3 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'sales_autopilot'), 'vc_investor.testnet', 4, 'Good for lead qualification. Saves sales team hours of manual work.', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'sales_autopilot'), 'sales_manager.testnet', 5, 'The follow-up sequences are perfectly timed. Brilliant automation.', NOW() - INTERVAL '22 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'sales_autopilot'), 'b2b_seller.testnet', 5, 'Closed 3 enterprise deals in first month using this tool.', NOW() - INTERVAL '11 days'),

-- smart_contract_auditor reviews (analytics)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'smart_contract_auditor'), 'defi_dev.testnet', 5, 'Found a critical reentrancy bug before mainnet deployment. Saved our protocol!', NOW() - INTERVAL '2 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'smart_contract_auditor'), 'protocol_designer.testnet', 5, 'Professional audit with detailed vulnerability report. Worth every penny.', NOW() - INTERVAL '19 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'smart_contract_auditor'), 'token_engineer.testnet', 4, 'Comprehensive analysis, though some false positives on complex patterns.', NOW() - INTERVAL '14 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'smart_contract_auditor'), 'dao_member.testnet', 5, 'Our DAO uses this for every proposal contract. Zero incidents since.', NOW() - INTERVAL '28 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'smart_contract_auditor'), 'web3_builder.testnet', 5, 'Gas optimization suggestions alone saved thousands in deployment costs.', NOW() - INTERVAL '6 days'),

-- social_manager_ai reviews (chat)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'social_manager_ai'), 'community_mod.testnet', 4, 'Handles community questions instantly. Engagement up 60%.', NOW() - INTERVAL '9 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'social_manager_ai'), 'marketing_lead.testnet', 5, 'Schedule posts across 5 platforms flawlessly. Content calendar is always full.', NOW() - INTERVAL '16 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'social_manager_ai'), 'brand_manager.testnet', 3, 'Tone is good but sometimes misses brand voice nuances.', NOW() - INTERVAL '24 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'social_manager_ai'), 'crypto_research.testnet', 5, 'Trending topic detection is scary accurate. Always ahead of curve.', NOW() - INTERVAL '7 days'),

-- support_gpt reviews (chat)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'support_gpt'), 'tech_lead.testnet', 5, 'Best support bot we have deployed. Ticket resolution time cut by 70%.', NOW() - INTERVAL '4 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'support_gpt'), 'product_manager.testnet', 5, 'Solved complex integration issue in 2 minutes. Knowledge base is extensive.', NOW() - INTERVAL '13 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'support_gpt'), 'saas_founder.testnet', 4, 'Good for Tier 1 support, escalates complex issues appropriately.', NOW() - INTERVAL '21 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'support_gpt'), 'customer_success.testnet', 5, '24/7 availability with instant replies. CSAT scores improved dramatically.', NOW() - INTERVAL '17 days'),

-- near_wallet_guard reviews (other/security)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'near_wallet_guard'), 'validator_node.testnet', 5, 'Detected suspicious transaction and alerted immediately. Saved my funds!', NOW() - INTERVAL '6 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'near_wallet_guard'), 'miner_btc.testnet', 4, 'Reliable protection running 24/7 without false alarms.', NOW() - INTERVAL '14 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'near_wallet_guard'), 'nft_trader.testnet', 5, 'Blocked a phishing contract interaction. This tool pays for itself.', NOW() - INTERVAL '9 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'near_wallet_guard'), 'defi_whale.testnet', 5, 'Multi-sig monitoring with instant alerts. Essential for large holders.', NOW() - INTERVAL '26 days'),

-- doc_summarizer reviews (analytics)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'doc_summarizer'), 'research_lead.testnet', 5, 'Condensed 50-page whitepaper to key bullet points in seconds.', NOW() - INTERVAL '8 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'doc_summarizer'), 'product_analyst.testnet', 4, 'Useful for quick analysis of competitor docs and press releases.', NOW() - INTERVAL '19 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'doc_summarizer'), 'content_creator.testnet', 5, 'Extracts quotes and stats perfectly. Research time cut in half.', NOW() - INTERVAL '11 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'doc_summarizer'), 'student_blockchain.testnet', 4, 'Great for academic papers. Citation extraction could be better.', NOW() - INTERVAL '23 days'),

-- portfolio_rebalancer reviews (trading)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'portfolio_rebalancer'), 'yield_farmer.testnet', 5, 'Automatic rebalancing works perfectly. Portfolio always optimized.', NOW() - INTERVAL '10 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'portfolio_rebalancer'), 'liquidity_provider.testnet', 4, 'Saves time on manual recalculation of portfolio proportions.', NOW() - INTERVAL '16 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'portfolio_rebalancer'), 'hodler.testnet', 5, 'Tax-loss harvesting feature is brilliant. Saved on taxes this year.', NOW() - INTERVAL '27 days'),

-- news_trader_bot reviews (trading)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'news_trader_bot'), 'quant_trader.testnet', 5, 'Reacts to news faster than I can read headlines. Incredible speed.', NOW() - INTERVAL '2 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'news_trader_bot'), 'swing_trader.testnet', 3, 'Sometimes too aggressive on unverified news. Use with caution.', NOW() - INTERVAL '14 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'news_trader_bot'), 'day_trader.testnet', 4, 'Sentiment analysis is accurate most of the time.', NOW() - INTERVAL '20 days'),

-- arxiv_digest reviews (analytics)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'arXiv_digest'), 'ai_researcher.testnet', 5, 'Daily AI research digests are invaluable for staying current.', NOW() - INTERVAL '12 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'arXiv_digest'), 'phd_student.testnet', 4, 'Good topic filtering. Never miss important papers in my field.', NOW() - INTERVAL '18 days'),

-- devin_lite reviews (other/dev)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'devin_lite'), 'smart_contract_dev.testnet', 5, 'Wrote and deployed contract in 10 minutes. Mind-blowing productivity.', NOW() - INTERVAL '1 day'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'devin_lite'), 'frontend_dev.testnet', 4, 'Good for boilerplate, complex logic needs refinement.', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'devin_lite'), 'backend_dev.testnet', 5, 'API scaffolding is instant. Database integration seamless.', NOW() - INTERVAL '9 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'devin_lite'), 'fullstack_dev.testnet', 4, 'Debugging suggestions are helpful. Not perfect but improving.', NOW() - INTERVAL '24 days'),

-- onchain_analyst reviews (analytics)
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'onchain_analyst'), 'whale_watcher.testnet', 5, 'Found whale wallet correlations I never noticed. Alpha generator.', NOW() - INTERVAL '7 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'onchain_analyst'), 'data_scientist.testnet', 4, 'Data is fresh but visualizations could be more polished.', NOW() - INTERVAL '20 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'onchain_analyst'), 'crypto_research.testnet', 5, 'Network analysis revealed protocol connections I missed.', NOW() - INTERVAL '13 days'),

-- Additional reviews for variety
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'gpt_trader_v2'), 'yield_farmer.testnet', 4, 'Backtesting feature helps validate strategies before risking capital.', NOW() - INTERVAL '31 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'smart_contract_auditor'), 'security_researcher.testnet', 5, 'Found 2 critical vulnerabilities in our legacy contracts.', NOW() - INTERVAL '33 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'support_gpt'), 'ecommerce_owner.testnet', 5, 'Handles 80% of inquiries without human intervention.', NOW() - INTERVAL '35 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'near_wallet_guard'), 'nft_collector.testnet', 4, 'Good protection for high-value NFT collections.', NOW() - INTERVAL '29 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'portfolio_rebalancer'), 'retiree.testnet', 5, 'Finally have hands-off portfolio management. Set and forget.', NOW() - INTERVAL '38 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'devin_lite'), 'startup_founder.testnet', 5, 'Built our MVP backend in a weekend. Would have taken weeks manually.', NOW() - INTERVAL '41 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'onchain_analyst'), 'defi_analyst.testnet', 4, 'Protocol TVL tracking is accurate and timely.', NOW() - INTERVAL '44 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'sales_autopilot'), 'sdr_manager.testnet', 5, 'Lead scoring accuracy improved our conversion funnel by 25%.', NOW() - INTERVAL '47 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'doc_summarizer'), 'consultant.testnet', 4, 'Executive summaries are perfect for client reports.', NOW() - INTERVAL '50 days'),
(gen_random_uuid(), (SELECT id FROM agents WHERE name = 'social_manager_ai'), 'influencer.testnet', 5, 'Engagement rate up 90% since using this for content optimization.', NOW() - INTERVAL '52 days');

-- Update agent stats based on new reviews
UPDATE agents a SET 
  is_verified = true
WHERE name IN ('gpt_trader_v2', 'sales_autopilot', 'smart_contract_auditor', 'social_manager_ai', 
               'support_gpt', 'near_wallet_guard', 'doc_summarizer', 'portfolio_rebalancer', 
               'news_trader_bot', 'devin_lite', 'onchain_analyst');
