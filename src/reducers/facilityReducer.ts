import { calculateUpgradeTime } from '@/utils/timeCalculator';
import { Facility } from '../types/game';
import { getUpgradedFacility } from '@/utils/facilityUtils';

type FacilityAction =
  | { type: 'START_FACILITY_UPGRADE'; payload: { facilityId: string } }
  | { type: 'COMPLETE_FACILITY_UPGRADE'; payload: { facilityId: string, upgradedFacility: Partial<Facility> } }
  | { type: 'SPEED_UP_FACILITY'; payload: { facilityId: string, upgradedFacility: Partial<Facility> } };

export function facilityReducer(facilities: Facility[], action: FacilityAction): Facility[] {
  switch (action.type) {
    case 'START_FACILITY_UPGRADE':
      return facilities.map(facility =>
        facility.id === action.payload.facilityId
          ? {
              ...facility,
              upgrading: {
                startTime: Date.now(),
                period: calculateUpgradeTime(facility.level),
              },
            }
          : facility
      );

    case 'COMPLETE_FACILITY_UPGRADE':
    case 'SPEED_UP_FACILITY':
      return facilities.map(facility =>
        facility.id === action.payload.facilityId
          ? ({
            ...facility,
            ...action.payload.upgradedFacility
          })
          : facility
      );

    default:
      return facilities;
  }
}