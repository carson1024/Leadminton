export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: EquipmentRarity;
  stats: Partial<Record<StatBonus, number>>;
  price: {
    coins: number;
    diamonds: number;
  };
  imageUrl: string;
}

export type EquipmentType = 'shoes' | 'racket' | 'strings' | 'shirt' | 'shorts';
export type EquipmentRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type StatBonus = 
  | 'endurance' 
  | 'strength' 
  | 'agility' 
  | 'speed' 
  | 'explosiveness' 
  | 'smash' 
  | 'defense' 
  | 'serve';

export interface PlayerEquipment {
  shoes?: Equipment;
  racket?: Equipment;
  strings?: Equipment;
  shirt?: Equipment;
  shorts?: Equipment;
}