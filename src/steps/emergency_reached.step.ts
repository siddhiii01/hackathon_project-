
export const config = {
  name: 'EmergencyReached',
  type: "event",
  subscribes: ['emergency.dispatched'],
  emits: ['emergency.active']
}

export const handler = async(input: { emergencyId: string, unitId:string }, {state,logger,emit}:any) => {
  const {emergencyId,unitId} = input as {emergencyId:string,unitId:string}
  
  await new Promise(r => setTimeout(r,8000)); // pause for 8 sec to simulate travel
  
  const emergency = await state.get('emergencies',emergencyId);
  const unit = await state.get('units',unitId);

  emergency.status='active';
  unit.status='busy';

  await state.set('emergencies',emergency.id,emergency);
  await state.set('units',unit.id,unit);
  
  await emit({
    topic: "emergency.active",
    data: {emergencyId,unitId}
  })

  logger.info('Unit reached', { emergencyId, unitId });
}