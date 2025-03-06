/*
  # Initial Schema Setup

  1. New Tables
    - `players`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `level` (integer)
      - `max_level` (integer)
      - `created_at` (timestamp)
    - `player_stats`
      - `player_id` (uuid, references players)
      - `endurance` (integer)
      - `strength` (integer)
      - `agility` (integer)
      - `speed` (integer)
      - `explosiveness` (integer)
      - `injury_prevention` (integer)
      - `smash` (integer)
      - `defense` (integer)
      - `serve` (integer)
      - `stick` (integer)
      - `slice` (integer)
      - `drop` (integer)
    - `player_equipment`
      - `player_id` (uuid, references players)
      - `equipment_type` (text)
      - `equipment_id` (text)
    - `facilities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `type` (text)
      - `level` (integer)
      - `production_rate` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Players table
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  level integer DEFAULT 1,
  max_level integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own players"
  ON players
  USING (auth.uid() = user_id);

-- Player stats table
CREATE TABLE player_stats (
  player_id uuid REFERENCES players ON DELETE CASCADE,
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
  PRIMARY KEY (player_id)
);

ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their players' stats"
  ON player_stats
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_stats.player_id
    AND players.user_id = auth.uid()
  ));

-- Player equipment table
CREATE TABLE player_equipment (
  player_id uuid REFERENCES players ON DELETE CASCADE,
  equipment_type text NOT NULL,
  equipment_id text NOT NULL,
  PRIMARY KEY (player_id, equipment_type)
);

ALTER TABLE player_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their players' equipment"
  ON player_equipment
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_equipment.player_id
    AND players.user_id = auth.uid()
  ));

-- Facilities table
CREATE TABLE facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  level integer DEFAULT 1,
  production_rate integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own facilities"
  ON facilities
  USING (auth.uid() = user_id);