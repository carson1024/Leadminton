-- Optimize indexes
DROP INDEX IF EXISTS player_training_history_player_id_idx;
DROP INDEX IF EXISTS facility_upgrades_facility_id_idx;
DROP INDEX IF EXISTS player_equipment_history_player_id_idx;
DROP INDEX IF EXISTS resource_transactions_user_id_idx;
DROP INDEX IF EXISTS resource_transactions_created_at_idx;

-- Create more efficient composite indexes
CREATE INDEX player_training_history_player_completed_idx 
  ON player_training_history(player_id, completed_at)
  WHERE completed_at IS NULL;

CREATE INDEX facility_upgrades_facility_completed_idx 
  ON facility_upgrades(facility_id, completed_at) 
  WHERE completed_at IS NULL;

CREATE INDEX resource_transactions_user_type_idx 
  ON resource_transactions(user_id, resource_type, created_at DESC);

-- Add materialized view for resource balances
CREATE MATERIALIZED VIEW user_resource_balances AS
SELECT 
  user_id,
  resource_type,
  SUM(amount) as balance
FROM resource_transactions
GROUP BY user_id, resource_type;

CREATE UNIQUE INDEX user_resource_balances_idx 
  ON user_resource_balances(user_id, resource_type);

-- Create function to refresh resource balances
CREATE OR REPLACE FUNCTION refresh_resource_balances()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_resource_balances;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh balances
CREATE TRIGGER refresh_resource_balances_trigger
  AFTER INSERT ON resource_transactions
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_resource_balances();

-- Add partial indexes for active players and facilities
CREATE INDEX active_players_idx ON players(user_id)
  WHERE level < max_level;

CREATE INDEX active_facilities_idx ON facilities(user_id, type)
  WHERE level < 10;

-- Add function for batch resource updates
CREATE OR REPLACE FUNCTION batch_resource_transactions(
  p_user_id uuid,
  p_transactions jsonb
)
RETURNS void AS $$
BEGIN
  INSERT INTO resource_transactions (
    user_id,
    resource_type,
    amount,
    source,
    source_id
  )
  SELECT
    p_user_id,
    (tx->>'resource_type')::text,
    (tx->>'amount')::integer,
    (tx->>'source')::text,
    (tx->>'source_id')::uuid
  FROM jsonb_array_elements(p_transactions) AS tx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;