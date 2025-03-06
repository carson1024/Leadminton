-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_player ON auth.users;
DROP FUNCTION IF EXISTS create_initial_facilities();
DROP FUNCTION IF EXISTS create_initial_player();

-- Simplify the initial setup function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create single trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();