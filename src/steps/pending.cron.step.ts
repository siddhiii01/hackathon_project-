// steps/pending-emergency-processor.step.ts
import { Emergency } from '../../types/models'

export const config = {
  name: 'PendingEmergencyProcessor',
  type: 'cron',
  cron: '*/30 * * * * *',  
  emits: ['unit.assigning.requested'],  // Emits retry assignment requests
};

export const handler = async ({ logger, state, emit }: any) => {
  try {
    logger.info('PROCESSOR Starting pending emergency processor');

    // Get all emergencies from state
    const allEmergencies = await state.getGroup('emergencies');  

    if (!allEmergencies || Object.keys(allEmergencies).length === 0) {
      logger.info('No emergencies found in state');
      return;
    }

    const pendingEmergencies = Object.values(allEmergencies).filter((emergency) => (emergency as Emergency).status === 'pending'
    ) as Emergency[];

    if (pendingEmergencies.length === 0) {
      logger.info('No pending emergencies to process');
      return;
    }

    logger.info(`Found ${pendingEmergencies.length} pending emergencies`);

   
    for (const emergency of pendingEmergencies) {
      try {
        await emit({
          topic: 'unit.assigning.requested',
          data: { emergencyId: emergency.id },
        });
        logger.info(`Emitted retry assignment for emergency ${emergency.id}`);
      } catch (emitErr) {
        logger.error(`Failed to emit retry for emergency ${emergency.id}`, { error: emitErr });
      }
    }
  } catch (error: any) {
    logger.error('Pending emergency processor failed', { error: error.message });
  }
};