import { getPendingEmergenciesInPriorityOrder } from '../utils/queue';

// This runs automatically every 30 seconds as a background job
export const config = {
  type: 'cron',  // Motia background job type -> cron
  name: 'QueueProcessor',
  cron: '*/5  * * * *', // Every 30 seconds (cron format)
  emits: ['unit.assigning.retry']
}
//here the state is undefined
export const handler = async (req: any, { state, emit, logger }: any) => {
  logger.info('Queue processor running...');

  // Get all pending emergencies sorted by priority
  const pending = await getPendingEmergenciesInPriorityOrder(state);
  if (pending.length === 0) {
    logger.info('No pending emergencies');
    return;
  }

  //Check if ANY units are available first
  const unitsMap = await state.getGroup('units');
  const availableUnits = Object.values(unitsMap).filter(
    (u: any) => u.status === 'available'
  );
  
  if (availableUnits.length === 0) {
    logger.info('No units available, skipping queue processing');
    return;
  }

  logger.info(`Found ${pending.length} pending emergencies`);

  // Try to dispatch each pending emergency
  for (const emergency of pending) {
     const canAssign = availableUnits.some(
      (u: any) => u.type === emergency.requiredUnitType
    );
    
    if (canAssign) {
      await emit({
        topic: 'unit.assigning.retry', // Skip AI, go straight to assignment
        data: { emergencyId: emergency.id }
      });
    }
  }
}