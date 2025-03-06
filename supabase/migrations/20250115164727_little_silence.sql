-- Drop and recreate RLS policies with proper permissions
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own players" ON players;
DROP POLICY IF EXISTS "Users can insert their own players" ON players;
DROP POLICY IF EXISTS "Users can update their own players" ON players;

CREATE POLICY "Users can view their own players"
  ON players FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own players"
  ON players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own players"
  ON players FOR UPDATE
  USING (auth.uid() = user_id);

-- Fix player_stats policies
ALTER TABLE player_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their players' stats" ON player_stats;
DROP POLICY IF EXISTS "Users can update their players' stats" ON player_stats;
DROP POLICY IF EXISTS "Users can insert their players' stats" ON player_stats;

CREATE POLICY "Users can view their players' stats"
  ON player_stats FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_stats.player_id
    AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their players' stats"
  ON player_stats FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_stats.player_id
    AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their players' stats"
  ON player_stats FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_stats.player_id
    AND players.user_id = auth.uid()
  ));

-- Fix facilities policies
ALTER TABLE facilities DISABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own facilities" ON facilities;
DROP POLICY IF EXISTS "Users can manage their own facilities" ON facilities;
DROP POLICY IF EXISTS "Users can insert their own facilities" ON facilities;

CREATE POLICY "Users can view their own facilities"
  ON facilities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own facilities"
  ON facilities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own facilities"
  ON facilities FOR UPDATE
  USING (auth.uid() = user_id);

-- Fix player_equipment policies
ALTER TABLE player_equipment DISABLE ROW LEVEL SECURITY;
ALTER TABLE player_equipment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their players' equipment" ON player_equipment;
DROP POLICY IF EXISTS "Users can manage their players' equipment" ON player_equipment;
DROP POLICY IF EXISTS "Users can insert their players' equipment" ON player_equipment;

CREATE POLICY "Users can view their players' equipment"
  ON player_equipment FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_equipment.player_id
    AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their players' equipment"
  ON player_equipment FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_equipment.player_id
    AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their players' equipment"
  ON player_equipment FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_equipment.player_id
    AND players.user_id = auth.uid()
  ));

-- Ensure the trigger function exists and has proper permissions
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  player_id uuid;
BEGIN
  -- Create initial player
  INSERT INTO players (user_id, name, level, max_level)
  VALUES (NEW.id, 'New Player', 1, 150)
  RETURNING id INTO player_id;

  -- Create initial stats
  INSERT INTO player_stats (player_id)
  VALUES (player_id);

  -- Create initial facilities
  INSERT INTO facilities (user_id, name, type, level, production_rate)
  VALUES
    (NEW.id, 'Shuttlecock Machine', 'shuttlecock-machine', 1, 1),
    (NEW.id, 'Canteen', 'canteen', 1, 1),
    (NEW.id, 'Sponsors', 'sponsors', 1, 2),
    (NEW.id, 'Training Center', 'training-center', 1, 0);

  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();