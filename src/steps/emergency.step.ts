import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { Emergency } from '../../types/models';
// import { getPendingEmergenciesInPriorityOrder } from '../utils/queue';

const emergencySchema = z.object({
  type: z.enum(['medical', 'fire', 'police']),
  location: z.object({lat:z.number(), lng:z.number()}),
  // severity: z.number().min(1).max(10),
  description: z.string()
})


 
export const config: ApiRouteConfig = {
  name: 'Emergency',
  type: 'api',
  path: '/emergency',
  method: 'POST',
  emits: ['emergency.created'] 
}
 
export const handler = async (req:any, { logger, state,emit }: any) => {
  //Create emergency (pending)
  const parsed = emergencySchema.safeParse(req.body);
  if(!parsed.success){
    return {
      status: 400,
      body: { success: false, message: 'Invalid data' }
    }
  }
  const {type, location, description} = parsed.data
  const emergency: Emergency = {
    id: crypto.randomUUID(),
    type: type,
    location:location,
    severity: null,    
    description: description,
    status: 'pending',
    createdAt: new Date(),
    assignedUnitId: null,
    aireasoning: null,
    requiredUnits: 1 , 
  } 
  //Save to state  
  await state.set('emergencies', emergency.id,emergency);
  logger.info('New Emergency Created with Pending State', {
    emergencyId: emergency.id,
    assignedUnit: emergency.assignedUnitId
  });

  //Emit: 'emergency.created'
  await emit({
    topic: 'emergency.created',
    data: {
      emergencyId: emergency.id,
      description: emergency.description,
      userProvidedType: emergency.type,
      // userProvidedSeverity: emergency.severity 
    }
  });
  return {
    status: 201,
    message: "Emergency Created and Emitted",
    body: {
      success: true,
      emergencyId: emergency.id,
      status: emergency.status,
      assignedUnitId: emergency.assignedUnitId
    }
  }
}

