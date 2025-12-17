import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

import { Emergency } from '../../types/models';
import { getPendingEmergenciesInPriorityOrder } from '../utils/queue';

const emergencySchema = z.object({
  type: z.enum(['medical', 'fire', 'police']),
  location: z.object({lat:z.number(), lng:z.number()}),
  // severity: z.number().min(1).max(10),
  description: z.string()
})

// flow -> emergency -> ai_clasfier -> update -> unit -> reached -> resolved
 
export const config: ApiRouteConfig = {
  name: 'Emergency',
  type: 'api',
  path: '/emergency',
  method: 'POST',
  emits: ['emergency.created',"emergencies.pending.enqueued"] 
  // flows: ['emergency-created']  jab multiple emits karna hoga to flow use karte h
}
 
export const handler = async (req:any, { logger, state,emit }: any) => {
  const parsed = emergencySchema.safeParse(req.body);

  if(!parsed.success){
    return {
      status: 400,
      body: { success: false, message: 'Invalid data' }
    }
  }

  // mere papa aye mai khana dekhe aati hu mummynhi h
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
    requiredUnits: 1       
  } 

  // ALWAYS persist emergency
  await state.set('emergencies', emergency.id,emergency)

  logger.info('emergency created', {
    emergencyId: emergency.id,
    assignedUnit: emergency.assignedUnitId
  });

    // await emit ({
    //   topic: 'emergency.created',
    //   data: {emergencyId: emergency.id} //passing emergencyId to event subscriber
    // });

    await emit({
      topic: 'emergency.created',
      data: {
        emergencyId: emergency.id,
        description: emergency.description,
        userProvidedType: emergency.type,
        // userProvidedSeverity: emergency.severity 
      }
    })

 setInterval(async () => {

  const pending = await getPendingEmergenciesInPriorityOrder(state);

  if (pending.length === 0) return; // nothing to enqueue

  await emit({
    topic: "emergencies.pending.enqueued",
    data: {
      enqueuedAt: Date.now(),
      pending,     // full array of emergency objects
    }
  });

}, 30_000); // 30 sec


  return {
    status: 201,
    message: "data",
    body: {
      success: true,
      emergencyId: emergency.id,
      status: emergency.status,
      assignedUnitId: emergency.assignedUnitId
    }
  }
}

