import { getPendingEmergenciesInPriorityOrder } from '../utils/queue';

// This runs automatically every 30 seconds as a background job
export const config = {
  type: 'cron',  // Motia background job type -> cron
  name: 'QueueProcessor',
  cron: '*/5 * * * * *', // Every 30 seconds (cron format)
  emits: ['unit.assigning']
}

export const handler = async (req: any, { state, emit, logger }: any) => {
  logger.info('Queue processor running...');

  // Get all pending emergencies sorted by priority
  const pending = await getPendingEmergenciesInPriorityOrder(state);
  if (pending.length === 0) {
    logger.info('No pending emergencies');
    return;
  }

  logger.info(`Found ${pending.length} pending emergencies`);

  // Try to dispatch each pending emergency
  for (const emergency of pending) {
    logger.info(`Retrying dispatch for emergency ${emergency.id}`);

    // Emit dispatch event (skip AI, emergency already classified) -> retry the emergency dispatch
    await emit({
      topic: 'unit.assigning',  //  Go straight to unit assignment
      data: { emergencyId: emergency.id }
    });
  }
}