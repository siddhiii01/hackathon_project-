export const config = {
  type: 'api',
  name: 'ResetAllUnits',
  path: '/reset-units',
  method: 'POST',
  emits: []
};

const resetUnits = async({state,logger}:any) => {
    const units = await state.getGroup('units');
    for(let un of units) {
      un.status = "available",
      un.currentEmergencyId = null;
      await state.set('units', un.id, un);
    }
     logger.info('All units reset to available', { totalUnits: units.length });
}

export const handler = async (input: any, { state, logger }: any) => {
  await resetUnits({ state, logger });
  return { status: 200, body: { success: true } };
};