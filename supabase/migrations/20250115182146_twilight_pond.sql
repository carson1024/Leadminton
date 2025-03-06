-- Add missing tables for core functionality
CREATE TABLE IF NOT EXISTS player_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  stat text NOT NULL,
  level integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_stat CHECK (
    stat IN (
      'endurance', 'strength', 'agility', 'speed', 'explosiveness', 'injuryPrevention',
      'smash', 'backhand', 'serve', 'stick', 'slice', 'drop'
    )
  )
);

ALTER TABLE player_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their players' levels"
  ON player_levels
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_levels.player_id
    AND players.user_id = auth.uid()
  ));

-- Add missing indexes
CREATE INDEX IF NOT EXISTS player_levels_player_stat_idx 
  ON player_levels(player_id, stat);

-- Add functions for atomic operations
CREATE OR REPLACE FUNCTION update_player_stat(
  p_player_id uuid,
  p_stat text,
  p_value integer,
  p_level integer
)
RETURNS void AS $$
BEGIN
  -- Update stat
  UPDATE player_stats 
  SET 
    endurance = CASE WHEN p_stat = 'endurance' THEN p_value ELSE endurance END,
    strength = CASE WHEN p_stat = 'strength' THEN p_value ELSE strength END,
    agility = CASE WHEN p_stat = 'agility' THEN p_value ELSE agility END,
    speed = CASE WHEN p_stat = 'speed' THEN p_value ELSE speed END,
    explosiveness = CASE WHEN p_stat = 'explosiveness' THEN p_value ELSE explosiveness END,
    injury_prevention = CASE WHEN p_stat = 'injuryPrevention' THEN p_value ELSE injury_prevention END,
    smash = CASE WHEN p_stat = 'smash' THEN p_value ELSE smash END,
    backhand = CASE WHEN p_stat = 'backhand' THEN p_value ELSE backhand END,
    serve = CASE WHEN p_stat = 'serve' THEN p_value ELSE serve END,
    stick = CASE WHEN p_stat = 'stick' THEN p_value ELSE stick END,
    slice = CASE WHEN p_stat = 'slice' THEN p_value ELSE slice END,
    drop = CASE WHEN p_stat = 'drop' THEN p_value ELSE drop END
  WHERE player_id = p_player_id;

  -- Update or insert level
  INSERT INTO player_levels (player_id, stat, level)
  VALUES (p_player_id, p_stat, p_level)
  ON CONFLICT (player_id, stat) 
  DO UPDATE SET level = p_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function for atomic facility updates
CREATE OR REPLACE FUNCTION update_facility(
  p_facility_id uuid,
  p_level integer,
  p_production_rate integer
)
RETURNS void AS $$
BEGIN
  UPDATE facilities 
  SET 
    level = p_level,
    production_rate = p_production_rate
  WHERE id = p_facility_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;