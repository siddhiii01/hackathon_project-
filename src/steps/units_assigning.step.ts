import { SeedUnits } from '../services/unitStore';
import {findNearestAvailableUnit} from "../utils/dispatch";

export const config = {
  name: 'FindAndUnitAssign',
  type: 'event',
  subscribes: ['unit.assigning.requested'],
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
        const unitsList = Object.values(unitsMap);
        if(unitsList.length == 0) {  //when no units are present in state
            await SeedUnits(state);
            unitsMap = await state.getGroup('units') 
        }

        //Finding nearest units and their distance
        const {unit:nearestUnit, distancekm} = findNearestAvailableUnit(emergency, unitsMap);
        if (!nearestUnit) {
            emergency.status = "pending"
            await state.set("emergencies", emergency.id, emergency)
            return logger.warn("no unit available")
        }
        
        //Calculating ETA 
        const etaMinutes = Math.round((distancekm/nearestUnit.averageSpeedKmph) * 60)
        nearestUnit.status = "dispatched";
        nearestUnit.currentEmergencyId = emergency.id;
        emergency.status = "dispatched";
        emergency.assignedUnitId = nearestUnit.id;

        //Update state of Emergency and Units
        await state.set('units', nearestUnit?.id, nearestUnit)
        await state.set('emergencies', emergency.id, emergency)
        logger.info(`${emergency.id}, Unit Assigned Successfyly to Emergency`, { emergencyId, unitId: nearestUnit.id });

        //Creating an Assignment Record to save the Unit and assigment details
        const assignment = {
            id: crypto.randomUUID(),
            emergencyId: emergency.id, //here the emergencyId or Type of emergency number?       
            unitId: nearestUnit.id,
            etaMinutes,
            dispatchTime: new Date(),
            arrivalTime: null, 
            completionTime: null
        }

        await state.set('assignments', assignment.id, assignment);
        logger.info("ASSIGNMENT DETAILS: ", {assignment})
            
        //Now unit is assigned now Dispatch the Unit
        await emit({
            topic: 'unit.dispatched',
            data: {emergencyId:emergency.id, unitId: nearestUnit.id}
        });  
        // } else {
        //     emergency.status = 'pending'; //No Unit was found Emergency to Pending State
        //     await state.set('emergencies', emergency.id, emergency);

        //     // Just log - queue processor will handle retry
        //     logger.warn('No unit available - emergency remains pending', { 
        //         emergencyId: emergency.id,
        //         severity: emergency.severity,
        //         requiredUnits: emergency.requiredUnits
        //     });



        //     logger.warn('No Unit was found Emergency to Pending State', { emergency });
            
        // }  
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

