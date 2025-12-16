import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import {findNearestAvailableUnit} from "../utils/dispatch"
import { Emergency } from '../../types/models';
import { UNIT_STORE } from '../services/unitStore';



console.log("UNIT_STORE",UNIT_STORE )
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
 
export const handler = async (req:any, { logger, state }: any) => {
  const units = Array.from(UNIT_STORE.values())
  console.log("units ", units)
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

  const nearestUnit = findNearestAvailableUnit(emergency, units)

    if (nearestUnit) {
      nearestUnit.status = "dispatched";
      nearestUnit.currentEmergencyId = emergency.id;

      emergency.status = "dispatched";
      emergency.assignedUnitId = nearestUnit.id;

      UNIT_STORE.set(nearestUnit.id, nearestUnit);
      
    }

    // ALWAYS persist emergency
    await state.set('emergencies', emergency.id, emergency)

    logger.info('emergency created', {
      emergencyId: emergency.id,
      assignedUnit: emergency.assignedUnitId
    })

    
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