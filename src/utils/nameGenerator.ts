import { PlayerGender } from '../types/game';

const maleFirstNames = [
  "Alex", "Jordan", "Morgan", "Taylor", "Sam", "Chris", "Pat", "Robin", "Jamie",
  "Lin", "Wei", "Chen", "Lee", "Kim", "Park", "Sato", "Tanaka", "Singh",
  "Thomas", "Martin", "Bernard", "Lucas", "Hugo", "Louis", "Nathan", "Gabriel", "Arthur"
];

const femaleFirstNames = [
  "Emma", "Marie", "Sophie", "Alice", "Julie", "Sarah", "Laura", "Clara", "Anna",
  "Mei", "Yuki", "Sakura", "Ji-eun", "Min", "Priya", "Ava", "Isabella", "Sophia",
  "Charlotte", "Amelia", "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Wang", "Li", "Zhang", "Liu", "Chen", "Kim", "Lee", "Park", "Singh", "Patel",
  "Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois",
  "Anderson", "Taylor", "Moore", "Jackson", "Thompson", "White", "Harris", "Clark"
];

export function generateRandomGender(): PlayerGender {
  return Math.random() < 0.5 ? 'male' : 'female';
}

export function generateRandomName(gender: PlayerGender): string {
  const firstNames = gender === 'male' ? maleFirstNames : femaleFirstNames;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}