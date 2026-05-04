-- Очищаем старые отзывы
DELETE FROM reviews;

-- Обновляем описания агентов
UPDATE agents SET 
  description = 'Autonomous trading agent for Binance and Bybit. Uses GPT-4 to analyze order flow, detect whale movements and execute positions with dynamic stop-loss management. Avg monthly return: 12-18%.'
WHERE name = 'gpt_trader_v2';

UPDATE agents SET 
  description = 'AI software engineer that reads GitHub issues, writes production-ready code and opens pull requests automatically. Supports Python, TypeScript and Rust. Used by 3 YC startups.'
WHERE name = 'devin_lite';

UPDATE agents SET 
  description = 'Customer support agent trained on your documentation. Handles tickets, escalates edge cases and syncs with Zendesk or Intercom. Reduces support load by 60% on average.'
WHERE name = 'support_gpt';

UPDATE agents SET 
  description = 'Monitors ArXiv daily, summarizes new AI and crypto papers and sends Telegram and Slack digests. Filters by topic, citation count and author reputation.'
WHERE name = 'arxiv_digest';

UPDATE agents SET 
  description = 'Security agent that monitors your NEAR wallet 24/7 for suspicious transactions, phishing attempts and unusual patterns. Sends instant Telegram alerts with risk score.'
WHERE name = 'near_wallet_guard';

UPDATE agents SET 
  description = 'Tracks whale wallets on NEAR and Ethereum in real time. Sends alerts when large transfers occur and generates daily on-chain reports with market impact analysis.'
WHERE name = 'onchain_analyst';

UPDATE agents SET 
  description = 'AI sales agent that qualifies leads from your CRM, writes personalized follow-ups and books meetings automatically. Integrates with HubSpot, Salesforce and Pipedrive.'
WHERE name = 'sales_autopilot';

UPDATE agents SET 
  description = 'Audits Rust and Solidity smart contracts for vulnerabilities. Generates a detailed security report with severity ratings and fix suggestions in under 60 seconds.'
WHERE name = 'smart_contract_auditor';

UPDATE agents SET 
  description = 'Scans crypto news from 50+ sources in real time and executes trades based on sentiment analysis and momentum signals. Supports Binance, OKX and Bybit.'
WHERE name = 'news_trader_bot';

UPDATE agents SET 
  description = 'Reads PDFs, Notion pages, Google Docs and Confluence. Produces concise summaries, action items and key decisions for your team in seconds.'
WHERE name = 'doc_summarizer';

UPDATE agents SET 
  description = 'Generates and schedules posts for Twitter, LinkedIn and Telegram based on your brand voice, trending topics and competitor analysis. Grows following by 20-40% monthly.'
WHERE name = 'social_manager_ai';

UPDATE agents SET 
  description = 'Monitors your crypto portfolio 24/7 and automatically rebalances allocations based on your target strategy, market conditions and risk tolerance.'
WHERE name = 'portfolio_rebalancer';

-- Добавляем реалистичные отзывы
INSERT INTO reviews (agent_id, wallet_id, score, comment) VALUES
((SELECT id FROM agents WHERE name='gpt_trader_v2'), 'trader_joe.near', 5, 'Incredible performance. Made 23% return in first month. Stop-loss management is top notch.'),
((SELECT id FROM agents WHERE name='gpt_trader_v2'), 'defi_king.near', 4, 'Good overall but had 2 bad trades during high volatility. Still profitable long term.'),
((SELECT id FROM agents WHERE name='gpt_trader_v2'), 'crypto_whale.near', 4, 'Solid agent, executes fast. Would love more customization options for position sizing.'),
((SELECT id FROM agents WHERE name='gpt_trader_v2'), 'moon_baker.near', 4, 'Runs 24/7 without issues. Bybit integration works perfectly. Recommended for active traders.'),
((SELECT id FROM agents WHERE name='devin_lite'), 'startup_founder.near', 5, 'Closed 12 GitHub issues in one weekend. Code quality is surprisingly good. Saved us 2 weeks of work.'),
((SELECT id FROM agents WHERE name='devin_lite'), 'senior_dev.near', 5, 'Best AI coding agent I have used. PR descriptions are clear and tests are included automatically.'),
((SELECT id FROM agents WHERE name='devin_lite'), 'vc_backed.near', 4, 'Great for boilerplate and bug fixes. Struggles with complex architectural decisions but getting better.'),
((SELECT id FROM agents WHERE name='support_gpt'), 'saas_ceo.near', 5, 'Handles 80% of our support tickets automatically. Customer satisfaction actually went up after deploying this.'),
((SELECT id FROM agents WHERE name='support_gpt'), 'product_lead.near', 4, 'Zendesk sync works flawlessly. Escalation logic is smart. Saved us from hiring 2 more support agents.'),
((SELECT id FROM agents WHERE name='arxiv_digest'), 'phd_researcher.near', 4, 'Saves me 2 hours daily. Summaries are accurate and the Telegram digest format is clean.'),
((SELECT id FROM agents WHERE name='arxiv_digest'), 'ml_engineer.near', 3, 'Good concept but filtering by topic needs improvement. Too many irrelevant papers sometimes.'),
((SELECT id FROM agents WHERE name='near_wallet_guard'), 'hodler_99.near', 5, 'Caught a suspicious transaction before it went through. Literally saved my wallet. 10/10.'),
((SELECT id FROM agents WHERE name='near_wallet_guard'), 'defi_user.near', 5, 'Alerts are instant and the risk score explanation is very clear. Peace of mind for DeFi users.'),
((SELECT id FROM agents WHERE name='near_wallet_guard'), 'nft_collector.near', 4, 'Works great. Would love iOS push notifications instead of just Telegram.'),
((SELECT id FROM agents WHERE name='onchain_analyst'), 'fund_manager.near', 4, 'Whale tracking is accurate. Daily reports are well structured. Good alpha source.'),
((SELECT id FROM agents WHERE name='onchain_analyst'), 'quant_trader.near', 4, 'Solid data quality. The market impact analysis feature is unique and genuinely useful.'),
((SELECT id FROM agents WHERE name='sales_autopilot'), 'b2b_founder.near', 5, 'Booked 8 meetings in first week. Follow-up emails are personalized and do not feel robotic at all.'),
((SELECT id FROM agents WHERE name='sales_autopilot'), 'growth_hacker.near', 4, 'HubSpot integration is seamless. Lead qualification saves our team hours each week.'),
((SELECT id FROM agents WHERE name='smart_contract_auditor'), 'solidity_dev.near', 5, 'Found a reentrancy bug our team missed. Report was detailed and fixes were clearly explained.'),
((SELECT id FROM agents WHERE name='smart_contract_auditor'), 'rust_builder.near', 3, 'Good for common vulnerabilities but missed a complex logic flaw. Use alongside manual review.'),
((SELECT id FROM agents WHERE name='news_trader_bot'), 'scalper.near', 4, 'Fast execution on news events. Made good profit on FOMC announcements last month.'),
((SELECT id FROM agents WHERE name='news_trader_bot'), 'algo_trader.near', 4, 'Sentiment analysis is better than expected. OKX integration works well.'),
((SELECT id FROM agents WHERE name='news_trader_bot'), 'day_trader.near', 3, 'Profitable overall but had some bad trades on fake news. Needs better source verification.'),
((SELECT id FROM agents WHERE name='doc_summarizer'), 'consultant.near', 5, 'Summarizes 50-page reports in 10 seconds. The action items extraction is genuinely useful for meetings.'),
((SELECT id FROM agents WHERE name='doc_summarizer'), 'pm_lead.near', 4, 'Notion integration works perfectly. Saves me 1-2 hours daily on reading and note-taking.'),
((SELECT id FROM agents WHERE name='social_manager_ai'), 'startup_marketer.near', 4, 'Content quality is good. Grew our Twitter following by 30% in 6 weeks. LinkedIn posts need work.'),
((SELECT id FROM agents WHERE name='social_manager_ai'), 'brand_owner.near', 3, 'Hit or miss with trending topics. Brand voice matching needs more training. Support is responsive.'),
((SELECT id FROM agents WHERE name='portfolio_rebalancer'), 'crypto_investor.near', 5, 'Set it and forget it. Portfolio is always balanced and I sleep better knowing it is automated.'),
((SELECT id FROM agents WHERE name='portfolio_rebalancer'), 'degen.near', 4, 'Rebalancing logic is smart. Saved me from holding too much of a crashing token last month.'),
((SELECT id FROM agents WHERE name='portfolio_rebalancer'), 'long_term_hodl.near', 4, 'Works as advertised. Would love tax loss harvesting feature in the future.');
