CREATE TYPE gender_enum AS ENUM ('male', 'female', 'non_binary', 'other');
ALTER TABLE users ADD COLUMN gender gender_enum;

-- Player strategy table
CREATE TABLE player_strategy (
  player_id uuid REFERENCES players ON DELETE CASCADE,
  physical_commitment integer DEFAULT 5,
  play_style integer DEFAULT 5,
  movement_speed integer DEFAULT 5,
  fatigue_management integer DEFAULT 5,
  rally_consistency integer DEFAULT 5,
  risk_taking integer DEFAULT 5,
  attack integer DEFAULT 5,
  soft_attack integer DEFAULT 5,
  serving integer DEFAULT 5,
  court_defense integer DEFAULT 5,
  mental_toughness integer DEFAULT 5,
  self_confidence integer DEFAULT 5,
  PRIMARY KEY (player_id)
);

ALTER TABLE player_strategy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their players' strategy"
  ON player_strategy
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_strategy.player_id
    AND players.user_id = auth.uid()
  ));