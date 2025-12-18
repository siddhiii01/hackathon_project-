import { SeedUnits } from '../services/unitStore';
import {findNearestAvailableUnit} from "../utils/dispatch";

export const config = {
  name: 'FindAndUnitAssign',
  type: 'event',
  subscribes: ['unit.assigning'], //recieve unit
  //2 emit here 
    //-> when unit found: unit.dispatched
    //-> when unit not found: emergency.pending.enqueued
  emits:['unit.dispatched']  
}

export const handler= async (input: { emergencyId: string },{ logger, state, emit }: any) => {
    try{    
        logger.info('RECEIVED DATA FROM EVENT AI_CLASSIFIER SENT: ', { data: input });
        const { emergencyId } = input as { emergencyId: string };
        if (typeof emergencyId !== 'string') {
            throw new Error('Missing or invalid emergencyId in event data');
        }

        //loading emergency from the State
        const emergency = await state.get('emergencies', emergencyId);
        if(!emergency){
            throw new Error(`Emergency not found: ${emergencyId}`)
        }

        //Loading all the units from the state
        let unitsMap = await state.getGroup('units');
        if(unitsMap.length == 0) {  //when no units are present in state
            await SeedUnits(state);
            unitsMap = await state.getGroup('units') 
        }

        //Finding nearest units 
        const nearestUnit = findNearestAvailableUnit(emergency, unitsMap)
        //console.log("nearest unit",nearestUnit)
        if (nearestUnit) {
            //assigning units to emergency
            nearestUnit.status = "dispatched";
            nearestUnit.currentEmergencyId = emergency.id;
            emergency.status = "dispatched";
            emergency.assignedUnitId = nearestUnit.id;

            //Update state of Emergency and Units
            await state.set('units', nearestUnit?.id, nearestUnit)
            await state.set('emergencies', emergency.id, emergency)
            logger.info(`${emergency.id}, Unit Assigned Successfyly to Emergency`, { emergencyId, unitId: nearestUnit.id });
            
            //Now unit is assigned now Dispatch the Unit
            await emit({
                topic: 'unit.dispatched',
                data: {emergencyId:emergency.id, unitId: nearestUnit.id}
            });  
        } else {
            emergency.status = 'pending'; //No Unit was found Emergency to Pending State
            await state.set('emergencies', emergency.id, emergency);

            // Just log - queue processor will handle retry
            logger.warn('No unit available - emergency remains pending', { 
                emergencyId: emergency.id,
                severity: emergency.severity,
                requiredUnits: emergency.requiredUnits
            });



            logger.warn('No Unit was found Emergency to Pending State', { emergency });
            
        }  
    }catch(error:any){
        logger.error('Unit assignment failed', { error: error.message });
        return { status: 500, body: { success: false, error: error.message } };
    }
}

//here 2 things should happend 
 //-> A. Unit Dispatched : 
         //- If the unit is assigned Successfully
           // - Now New Event should happed from unit assigning -> to unit dispatch
 //-> B. No Unit Available -> this should be a background job

