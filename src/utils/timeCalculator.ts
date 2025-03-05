export function calculateUpgradeTime(facilityLevel: number): number {
  // Base time is 60000ms (1 minute)
  // Each level adds 30 seconds more than the previous level
  // Level 1: 60s
  // Level 2: 90s
  // Level 3: 120s
  // etc.
  return 60000 + ((facilityLevel - 1) * 30000);
}

export function calculateTrainingTime(statLevel: number): number {
  // Base time is 30000ms (30 seconds)
  // Each level adds 15 seconds more than the previous level
  // Level 0: 30s
  // Level 1: 45s
  // Level 2: 60s
  // etc.
  return 30000 + (statLevel * 15000);
}