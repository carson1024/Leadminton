import { Manager } from '../types/game';

type ManagerAction =
  | { type: 'HIRE_MANAGER'; payload: { managerId: string } }
  | { type: 'COMPLETE_MANAGER_DURATION'; payload: { managerId: string } };

export function managerReducer(managers: Manager[], action: ManagerAction): Manager[] {
  switch (action.type) {
    case 'HIRE_MANAGER':
      return managers.map(manager =>
        manager.id === action.payload.managerId
          ? {
              ...manager,
              active: true,
              purchasing: {
                startTime: Date.now(),
                period: (5 * 24 * 60 * 60 * 1000), // 5 days
              }
            }
          : manager
      );

    case 'COMPLETE_MANAGER_DURATION':
      return managers.map(manager =>
        manager.id === action.payload.managerId
          ? {
              ...manager,
              active: false,
              purchasing: undefined,
            }
          : manager
      );

    default:
      return managers;
  }
}