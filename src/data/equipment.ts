import { Equipment, EquipmentType } from '../types/equipment';

export const EQUIPMENT_DATA: Equipment[] = [
  // Shoes
  {
    id: 'speed-elite',
    name: 'Speed Elite',
    type: 'shoes',
    rarity: 'epic',
    stats: {
      speed: 5,
      agility: 3
    },
    price: {
      coins: 2000,
      diamonds: 10
    },
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
  },
  {
    id: 'power-max',
    name: 'Power Max',
    type: 'shoes',
    rarity: 'rare',
    stats: {
      explosiveness: 4,
      strength: 2
    },
    price: {
      coins: 1500,
      diamonds: 5
    },
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5'
  },
  // Rackets
  {
    id: 'thunder-pro',
    name: 'Thunder Pro',
    type: 'racket',
    rarity: 'legendary',
    stats: {
      smash: 6,
      strength: 4
    },
    price: {
      coins: 3000,
      diamonds: 15
    },
    imageUrl: 'https://images.unsplash.com/photo-1617083934555-ac7d4fee8909'
  },
  {
    id: 'control-master',
    name: 'Control Master',
    type: 'racket',
    rarity: 'epic',
    stats: {
      defense: 5,
      serve: 3
    },
    price: {
      coins: 2500,
      diamonds: 12
    },
    imageUrl: 'https://images.unsplash.com/photo-1617083934555-ac7d4fee8909'
  },
  // Strings
  {
    id: 'power-string',
    name: 'Power String',
    type: 'strings',
    rarity: 'rare',
    stats: {
      smash: 3,
      strength: 2
    },
    price: {
      coins: 1000,
      diamonds: 5
    },
    imageUrl: 'https://images.unsplash.com/photo-1617083934555-ac7d4fee8909'
  },
  // Shirts
  {
    id: 'pro-jersey',
    name: 'Pro Jersey',
    type: 'shirt',
    rarity: 'epic',
    stats: {
      endurance: 4,
      agility: 2
    },
    price: {
      coins: 1500,
      diamonds: 8
    },
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27'
  },
  // Shorts
  {
    id: 'flex-shorts',
    name: 'Flex Shorts',
    type: 'shorts',
    rarity: 'rare',
    stats: {
      speed: 3,
      agility: 2
    },
    price: {
      coins: 1200,
      diamonds: 6
    },
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b'
  },
];