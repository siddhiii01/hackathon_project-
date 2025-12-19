import { Assignment } from "types/models";

export const config = {
  name: 'EmergencyResolving',
  type: "event",
  subscribes: ['emergency.active'],
  emits: ['emergency.resolved', 'unit.available']
}

export const handler =async(input: { emergencyId: string, unitId:string }, {state,logger,emit}:any) => {
  const {emergencyId,unitId} = input as {emergencyId:string,unitId:string};

  //Current State
  const emergency = await state.get('emergencies',emergencyId);
  const unit = await state.get('units',unitId);

  if (!emergency || !unit) return;

  logger.info('Emergency active, waiting 30s to resolve...', { emergencyId, unitId });
  await new Promise(r => setTimeout(r,30000)); // Simulating waiting for 8 second to reach hospital 
  
  //Now emergency has been resolved -> New State
  emergency.status='resolved';
  unit.status='available';
  unit.currentEmergencyId = null;
  unit.lastDispatchTime = new Date();

  await state.set("emergencies", emergencyId, emergency);
  await state.set("units", unitId, unit);
  
  const assignments = await state.getGroup("assignments");
  const assignment = Object.values(assignments as Record<string, Assignment>).find(
    (a:any)=> a.emergencyId===emergencyId && a.unitId===unitId
  );

  if (assignment) {
    assignment.completionTime = new Date();
    await state.set("assignments", assignment.id, assignment);
  }
  await emit({
    topic:"emergency.resolved",
    data:{emergencyId, unitId}
  });

  await emit({
    topic:"unit.available",
    data:{unitId}
  });

  logger.info("Emergency resolved + Unit available",{ emergencyId, unitId });
  
}

//status = resolved
//unit.status = available