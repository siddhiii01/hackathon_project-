import { getPendingEmergenciesInPriorityOrder } from '../utils/queue';

export const config = {
  type: 'cron',
  name: 'QueueProcessor',
  cron: '*/5 * * * *', 
  emits: ['unit.assigning']
};

export const handler = async ({ state, emit, logger }: any) => {
  logger.info('Queue processor running...');

  // Get pending emergencies in priority order
  const pending = await getPendingEmergenciesInPriorityOrder(state); 
  console.log("All the pending emergencies: ", pending)

  if (pending.length === 0) {
    logger.info('No pending emergencies');
    return;
  }

  logger.info(`Pending emergencies: ${pending.length}`);

  //ssigning per emergency
  for (const emergency of pending) {
    const unitsMap = await state.getGroup('units'); //this return [ 0:{}, 1:{}, {}, ]

    const availableUnits = Object.values(unitsMap).filter((u: any) => u.status === 'available'); //[{}, {}]
    if (availableUnits.length === 0) {
      logger.info('No units available right now');
      return;
    }

    const canAssign = availableUnits.some((u: any) => u.type === emergency.requiredUnitType);
    if (canAssign) {
      logger.info(`Retry assigning: ${emergency.id}`);
      await emit({
        topic: 'unit.assigning',
        data: { emergencyId: emergency.id }
      });
    }
  }
};
