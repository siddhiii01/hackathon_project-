import { Assignment } from "types/models";

export const config = {
  name: 'UnitDispatched',
  type: "event",
  subscribes: ['unit.travelling'], 
  emits: ['emergency.active'] //after unit is dispacted what event should fire
}

export const handler = async(input: { emergencyId: string, unitId:string }, {state,logger,emit}:any) => {
  const {emergencyId,unitId} = input as {emergencyId:string,unitId:string}
  //Getting Emergencies and Units Through their Id from state
  const emergency = await state.get('emergencies',emergencyId);
  const unit = await state.get('units',unitId);

  // validate
  if (!emergency || !unit) {
    logger.error("Invalid emergency or unit id");
    return;
  }

  logger.info(`Unit ${unitId} traveling to emergency ${emergencyId}`);
  await new Promise(r => setTimeout(r,15000)); //simulate travel -> 15 Seconds Travelling
  //updating their status here unit is reached to emergency location
  emergency.status='active'; 
  emergency.assignedUnitId = unitId;


  unit.status='busy'; 
  unit.currentEmergencyId = emergencyId;
  unit.lastDispatchTime = new Date();

  //Save both to state
  await state.set('emergencies',emergencyId,emergency);
  await state.set('units',unitId,unit);
  logger.info('Unit Dispatched reaching to Emergency in few minutes', { emergency, unit });

  // update assignment arrival timestamp
  const assignments = await state.getGroup("assignments");
  const assignment = Object.values(assignments as Record<string, Assignment>).find(
    (a:any)=> a.emergencyId===emergencyId && a.unitId===unitId
  );

  if (assignment) {
    assignment.arrivalTime = new Date();
    await state.set("assignments", assignment.id, assignment);
  }

  await emit({
    topic:"emergency.active",
    data:{emergencyId,unitId}
  });

  logger.info("Unit arrived → emergency active", { emergencyId, unitId });
};
  
//status emergency = active