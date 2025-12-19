import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { Emergency } from '../../types/models';

const emergencySchema = z.object({
  type: z.enum(['medical', 'fire', 'police']),
  location: z.object({lat:z.number(), lng:z.number()}),
  // severity: z.number().min(1).max(10),
  description: z.string()
}).strict()

export const config: ApiRouteConfig = {
  name: 'EmergencyCreated',
  type: 'api',
  path: '/emergency',
  method: 'POST',
  emits: ['pending_classification'], 
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
  const {type, location, description} = parsed.data;
  const id= crypto.randomUUID();

  const exists = await state.get('emergencies', id);
  if (exists) {
    logger.error(`ID collision detected for emergency ${id}`);
    return {
      status: 500,
      body: { success: false, message: 'Internal server error' }
    }
  }

  const emergency: Emergency = {
    id,
    type: type,
    location:location,    
    description,
    status: 'pending',
    createdAt: new Date().toISOString(), 
    assignedUnitId: [],
    requiredUnits: 1 ,
  } 

  //Save to state 
  try {
    await state.set('emergencies', emergency.id, emergency);
  } catch (err) {
    logger.error("Failed to persist emergency", { err })
    return {
      status: 500,
      body: { success: false, message: 'Failed to store emergency' }
    }
  }

  logger.info('Emergency created with pending classification', {emergencyId: emergency.id,});   
 try {
    await emit({
      topic: 'pending_classification',
      data: {
        emergencyId: emergency.id,
        description: emergency.description,
        userProvidedType: emergency.type,
      }
    });
  } catch(err){
    logger.error("Failed to emit pending_classification", { err })
    return {
      status: 500,
      body: { success: false, message: 'Failed to emit classification event' }
    }
 }
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

// status : 
  //-> emegency -> pending


  