//Here the unit is travellling 

export const config = {
  name: 'UnitDispatched',
  type: "event",
  subscribes: ['unit.dispatched'], 
  emits: ['emergency.active']
}

export const handler = async(input: { emergencyId: string, unitId:string }, {state,logger,emit}:any) => {
  const {emergencyId,unitId} = input as {emergencyId:string,unitId:string}
  await new Promise(r => setTimeout(r,15000)); //simulate travel -> 15 Seconds Travelling
  
  //Getting Emergencies and Units Through their Id from state
  const emergency = await state.get('emergencies',emergencyId);
  const unit = await state.get('units',unitId);

  //updating their status here unit is reached to emergency location
  emergency.status='active'; 
  unit.status='busy'; 

  //Save both to state
  await state.set('emergencies',emergency.id,emergency);
  await state.set('units',unit.id,unit);
  logger.info('Unit Dispatched reaching to Emergency in few minutes', { emergency, unit });

  const assignments = await state.getGroup('assignments');
  const assignment = Object.values(assignments).find(
    (a: any) => a.emergencyId === emergencyId && a.unitId === unitId
  );

  if (assignment) {
    assignment.arrivalTime = new Date();
    await state.set('assignments', assignment.id, assignment);
  }

  //New Event: Active Emergency -> Taking to Hospital 
  await emit({
    topic: "emergency.active",
    data: {emergencyId,unitId}
  });
  
}