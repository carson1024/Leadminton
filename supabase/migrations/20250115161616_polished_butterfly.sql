/*
  # Fix Database Schema

  1. Changes
    - Add missing foreign key relationships
    - Add missing indexes for performance
    - Add missing constraints
    - Fix table relationships

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Drop existing tables if they exist to ensure clean state
DROP TABLE IF EXISTS player_equipment CASCADE;
DROP TABLE IF EXISTS player_stats CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- Create players table
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  level integer DEFAULT 1,
  max_level integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_level CHECK (level >= 1 AND level <= max_level)
);

-- Create indexes
CREATE INDEX players_user_id_idx ON players(user_id);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own players"
  ON players FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own players"
  ON players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own players"
  ON players FOR UPDATE
  USING (auth.uid() = user_id);

-- Create player_stats table with proper relationship
CREATE TABLE player_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  endurance integer DEFAULT 50,
  strength integer DEFAULT 50,
  agility integer DEFAULT 50,
  speed integer DEFAULT 50,
  explosiveness integer DEFAULT 50,
  injury_prevention integer DEFAULT 50,
  smash integer DEFAULT 50,
  backhand integer DEFAULT 50,
  serve integer DEFAULT 50,
  stick integer DEFAULT 50,
  slice integer DEFAULT 50,
  drop integer DEFAULT 50,
  CONSTRAINT valid_stats CHECK (
    endurance BETWEEN 0 AND 100 AND
    strength BETWEEN 0 AND 100 AND
    agility BETWEEN 0 AND 100 AND
    speed BETWEEN 0 AND 100 AND
    explosiveness BETWEEN 0 AND 100 AND
    injury_prevention BETWEEN 0 AND 100 AND
    smash BETWEEN 0 AND 100 AND
    backhand BETWEEN 0 AND 100 AND
    serve BETWEEN 0 AND 100 AND
    stick BETWEEN 0 AND 100 AND
    slice BETWEEN 0 AND 100 AND
    drop BETWEEN 0 AND 100
  )
);

-- Create unique index to ensure one stat record per player
CREATE UNIQUE INDEX player_stats_player_id_idx ON player_stats(player_id);

-- Enable RLS
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their players' stats"
  ON player_stats FOR SELECT
  USING (EXISTS (
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

-- Create player_equipment table
CREATE TABLE player_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  equipment_type text NOT NULL,
  equipment_id text NOT NULL,
  CONSTRAINT valid_equipment_type CHECK (
    equipment_type IN ('shoes', 'racket', 'strings', 'shirt', 'shorts')
  )
);

-- Create unique index to ensure one equipment type per player
CREATE UNIQUE INDEX player_equipment_player_type_idx ON player_equipment(player_id, equipment_type);

-- Enable RLS
ALTER TABLE player_equipment ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their players' equipment"
  ON player_equipment FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_equipment.player_id
    AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their players' equipment"
  ON player_equipment FOR ALL
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_equipment.player_id
    AND players.user_id = auth.uid()
  ));

-- Create facilities table
CREATE TABLE facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  level integer DEFAULT 1,
  production_rate integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_facility_type CHECK (
    type IN ('shuttlecock-machine', 'canteen', 'sponsors', 'training-center')
  ),
  CONSTRAINT valid_level CHECK (level >= 1),
  CONSTRAINT valid_production_rate CHECK (production_rate >= 0)
);

-- Create indexes
CREATE INDEX facilities_user_id_idx ON facilities(user_id);

-- Enable RLS
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own facilities"
  ON facilities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own facilities"
  ON facilities FOR ALL
  USING (auth.uid() = user_id);

-- Create initial facilities function
CREATE OR REPLACE FUNCTION create_initial_facilities()
RETURNS TRIGGER AS $$
BEGIN
  -- Create initial facilities for new user
  INSERT INTO facilities (user_id, name, type, level, production_rate)
  VALUES
    (NEW.id, 'Shuttlecock Machine', 'shuttlecock-machine', 1, 1),
    (NEW.id, 'Canteen', 'canteen', 1, 1),
    (NEW.id, 'Sponsors', 'sponsors', 1, 2),
    (NEW.id, 'Training Center', 'training-center', 1, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create initial facilities for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_facilities();

-- Create function to create initial player
CREATE OR REPLACE FUNCTION create_initial_player()
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

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create initial player for new users
DROP TRIGGER IF EXISTS on_auth_user_created_player ON auth.users;
CREATE TRIGGER on_auth_user_created_player
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_player();