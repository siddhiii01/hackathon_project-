export const config = {
  name: 'EmergencyResolving',
  type: "event",
  subscribes: ['emergency.active'],
  emits: ['emergency.resolved', 'unit.available']
}

export const handler =async(input: { emergencyId: string, unitId:string }, {state,logger,emit}:any) => {
  const {emergencyId,unitId} = input as {emergencyId:string,unitId:string};

  logger.info('Emergency active, waiting 30s to resolve...', { emergencyId, unitId });
  await new Promise(r => setTimeout(r,30000)); // Simulating waiting for 8 second to reach hospital 
  
  //Current State
  const emergency = await state.get('emergencies',emergencyId);
  const unit = await state.get('units',unitId);

  //Now emergency has been resolved -> New State
  emergency.status='resolved';
  unit.status='available';

  //on unit available 
  //here the corn should bre excute that is the 'emergency.pending.enqueued' -> this should be run 
  unit.currentEmergencyId=null;
  logger.info('Emergency resolved, Unit avaiable', { emergencyId, unitId});

  //Saving to state that emergency is resolved now unit is available
  await state.set('emergencies', emergencyId, emergency);
  await state.set('units', unitId, unit)

  //New Event: Emergency Resolved
  //  Who Listens:
  // Nobody This is the final event.
  await emit({
    topic: 'emergency.resolved',
    data: {emergencyId, unitId}
  });


  // NEW: Emit unit available event to trigger immediate assignment
  await emit({
    topic: 'unit.available',
    data: { unitId }
  });
  
}