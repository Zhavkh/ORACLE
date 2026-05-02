-- Добавляем колонку reviewer_wallet_id в таблицу reviews (если её нет)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reviewer_wallet_id TEXT;

-- Обновляем существующие отзывы - извлекаем wallet из comment
UPDATE reviews 
SET reviewer_wallet_id = SPLIT_PART(comment, ':', 1)
WHERE reviewer_wallet_id IS NULL AND comment LIKE '%:%';
