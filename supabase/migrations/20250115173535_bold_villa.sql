/*
  # Add game actions tracking

  1. New Tables
    - `player_training_history`
      - Records all training sessions
      - Tracks stat improvements and costs
    - `facility_upgrades`
      - Records all facility upgrades
      - Tracks level changes and costs
    - `player_equipment_history`
      - Records equipment changes
      - Tracks purchases and equipping/unequipping
    - `resource_transactions`
      - Records all resource changes
      - Tracks source and amount of changes

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Player Training History
CREATE TABLE player_training_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  stat text NOT NULL,
  old_value integer NOT NULL,
  new_value integer NOT NULL,
  cost_shuttlecocks integer NOT NULL,
  cost_meals integer NOT NULL,
  cost_coins integer NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT valid_stat CHECK (
    stat IN (
      'endurance', 'strength', 'agility', 'speed', 'explosiveness', 'injuryPrevention',
      'smash', 'backhand', 'serve', 'stick', 'slice', 'drop'
    )
  )
);

ALTER TABLE player_training_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their players' training history"
  ON player_training_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_training_history.player_id
    AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their players' training history"
  ON player_training_history FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_training_history.player_id
    AND players.user_id = auth.uid()
  ));

-- Facility Upgrades
CREATE TABLE facility_upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id uuid REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
  old_level integer NOT NULL,
  new_level integer NOT NULL,
  cost_coins integer NOT NULL,
  cost_shuttlecocks integer NOT NULL,
  cost_meals integer NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT valid_levels CHECK (new_level > old_level)
);

ALTER TABLE facility_upgrades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their facility upgrades"
  ON facility_upgrades FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM facilities
    WHERE facilities.id = facility_upgrades.facility_id
    AND facilities.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their facility upgrades"
  ON facility_upgrades FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM facilities
    WHERE facilities.id = facility_upgrades.facility_id
    AND facilities.user_id = auth.uid()
  ));

-- Player Equipment History
CREATE TABLE player_equipment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  equipment_type text NOT NULL,
  equipment_id text NOT NULL,
  action text NOT NULL,
  cost_coins integer,
  cost_diamonds integer,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_equipment_type CHECK (
    equipment_type IN ('shoes', 'racket', 'strings', 'shirt', 'shorts')
  ),
  CONSTRAINT valid_action CHECK (
    action IN ('purchase', 'equip', 'unequip')
  )
);

ALTER TABLE player_equipment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their players' equipment history"
  ON player_equipment_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_equipment_history.player_id
    AND players.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their players' equipment history"
  ON player_equipment_history FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = player_equipment_history.player_id
    AND players.user_id = auth.uid()
  ));

-- Resource Transactions
CREATE TABLE resource_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  resource_type text NOT NULL,
  amount integer NOT NULL,
  source text NOT NULL,
  source_id uuid,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_resource_type CHECK (
    resource_type IN ('shuttlecocks', 'meals', 'coins', 'diamonds')
  ),
  CONSTRAINT valid_source CHECK (
    source IN ('facility_production', 'training_cost', 'upgrade_cost', 'equipment_purchase', 'tournament_reward', 'shop_purchase')
  )
);

ALTER TABLE resource_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their resource transactions"
  ON resource_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their resource transactions"
  ON resource_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX player_training_history_player_id_idx ON player_training_history(player_id);
CREATE INDEX facility_upgrades_facility_id_idx ON facility_upgrades(facility_id);
CREATE INDEX player_equipment_history_player_id_idx ON player_equipment_history(player_id);
CREATE INDEX resource_transactions_user_id_idx ON resource_transactions(user_id);
CREATE INDEX resource_transactions_created_at_idx ON resource_transactions(created_at);