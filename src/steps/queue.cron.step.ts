import { getPendingEmergenciesInPriorityOrder } from '../utils/queue';

export const config = {
  type: 'cron',
  name: 'QueueProcessor',
  cron: '*/5  * * * *',
  emits: ['unit.assigning.requested'],
};

export const handler = async ({ state, emit, logger }: any) => {
  logger.info('Queue processor running...');

  try {
    const pending = await getPendingEmergenciesInPriorityOrder(state);

    if (!pending || pending.length === 0) {
      logger.info('No pending emergencies to process');
      return;
    }

    logger.info(`Found ${pending.length} pending emergencies to retry`);

    const unitsMap = await state.getGroup('units') || {};
    const availableUnits = Object.values(unitsMap).filter(
      (u: any) => u?.status === 'available'
    );

    if (availableUnits.length === 0) {
      logger.info('No units available - skipping queue processing');
      return;
    }

    logger.info(`${availableUnits.length} units available for assignment`);

    let retriedCount = 0;

    for (const emergency of pending) {
      const requiredType =
        emergency.requiredUnitType ||
        {
          medical: 'ambulance',
          fire: 'fire_truck',
          police: 'police_car',
        }[emergency.type] ||
        emergency.type;

      const matchingUnit = availableUnits.some(
        (u: any) => u.type === requiredType
      );

      if (!matchingUnit) {
        logger.debug(`No matching unit type for emergency ${emergency.id}`, {
          emergencyId: emergency.id,
          requiredType,
        });

        continue;
      }

      await emit({
        topic: 'unit.assigning.requested',
        data: {
          emergencyId: emergency.id,
          classification: {
            classifiedType: emergency.type,
            severity: emergency.severity || 5,
            requiredUnits: emergency.requiredUnits || 1,
            requiredUnitType: requiredType,
            reasoning: 'Retry from queue processor',
          },
        },
      });

      retriedCount++;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    logger.info(`Queue processing complete: ${retriedCount} emergencies retried`);
  } catch (error: any) {
    logger.error('Queue processor error', {
      error: error.message,
      stack: error.stack,
    });
  }
};
