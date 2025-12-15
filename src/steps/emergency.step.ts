import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

import { Emergency } from '../../types/models';

 
const emergencySchema = z.object({
  type: z.enum(['medical', 'fire', 'police']),
  location: z.object({lat:z.number(), lng:z.number()}),
  severity: z.number().min(1).max(10),
  description: z.string()
})
 
export const config: ApiRouteConfig = {
  name: 'Emergency',
  type: 'api',
  path: '/emergency',
  method: 'POST',
//   bodySchema: createPetSchema,
//   flows: ['PetManagement'],
  emits: [],
}
 
export const handler: Handlers['Emergency'] = async (req, { logger, state }) => {
  const data = emergencySchema.parse(req.body)
  
  const emergency: Emergency = {
    id: crypto.randomUUID(),
    type: data.type,
    location: data.location,
    severity: data.severity,
    description: data.description,
    status: 'pending',
    createdAt: new Date(),
    assignedUnitId: null
  } 

  await state.set('emergencies', emergency.id, emergency)
 
  logger.info('emergency created', { emergencyId: emergency.id });

  
 
  return { status: 201, body: emergency }
}