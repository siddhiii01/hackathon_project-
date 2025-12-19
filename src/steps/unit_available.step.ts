import { getPendingEmergenciesInPriorityOrder } from '../utils/queue';

export const config = {
  name: 'UnitAvailableHandler',
  type: 'event',
  subscribes: ['unit.available'],  // NEW EVENT to listen for
  emits: ['unit.assigning']
}

export const handler = async (
  input: { unitId: string }, 
  { state, emit, logger }: any
) => {
  try {
    const { unitId } = input as { unitId: string };
    
    logger.info('Unit became available, checking for pending emergencies', { unitId });

    // Get all pending emergencies sorted by priority
    const pending = await getPendingEmergenciesInPriorityOrder(state);
    
    if (pending.length === 0) {
      logger.info('No pending emergencies to assign', { unitId });
      return;
    }

    logger.info(`Found ${pending.length} pending emergencies for unit ${unitId}`);

    // Emit unit.assigning for the first pending emergency
    // The unit assignment handler will pick the nearest available unit
    await emit({
      topic: 'unit.assigning',
      data: { emergencyId: pending[0].id }
    });

  } catch (error: any) {
    logger.error('Unit available handler failed', { error: error.message });
  }
}