export const config = {
  name: 'EmergencyResolved',
  type: "event",
  subscribes: ['emergency.active'],
  emits: []
}

export const handler =async(input: { emergencyId: string, unitId:string }, {state,logger,emit}:any) => {
  const {emergencyId,unitId} = input as {emergencyId:string,unitId:string};

  await new Promise(r => setTimeout(r,10000)); // pause for 8 sec to simulate travel
  
  const emergency = await state.get('emergencies',emergencyId);
  const unit = await state.get('units',unitId);

  emergency.status='resolved';
  unit.status='available';
  unit.currentEmergencyId=null;

  logger.info('Emergency resolved, Unit avaiable', { emergencyId, unitId});
}