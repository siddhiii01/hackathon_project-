export const config = {
  type: 'event',
  name: 'EnqueuedPendingEmergencies',
  description: 'Background job that finds the units for all pending emergencies',
  // Subscribe to the event emitted by CreatePet
  subscribes: ['emergencies.pending.enqueued'],
  emits: [],
  //flows: ['TsPetManagement']
}

export const handler = async (input:any, { emit, logger }:any) => {
  const { enqueuedAt,pending } = input

  if (!Array.isArray(pending) || pending.length === 0)
    return;
 
  logger.info(`Rechecking ${pending.length} pending emergencies`);


 // Trigger the same event unit.step.ts listens to
  for(const emergency of pending){
    logger.info(`Re-attempting dispatch for ${emergency.id}`);

    await emit({
        topic: 'emergency.created',
        data: { emergencyId: emergency.id }
    })
  }
 
}