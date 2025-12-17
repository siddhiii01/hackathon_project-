import { ApiRouteConfig, Handlers } from 'motia';
import { SeedUnits } from '../services/unitStore';
import {findNearestAvailableUnit} from "../utils/dispatch";

// Config - when it runs
export const config = {
  name: 'UnitAssigning',
  type: 'event',
  subscribes: ['emergency.created'],
  emits:['emergency.dispatched']
}

// Handler - runs in background automatically
export const handler= async (input: { emergencyId: string },{ logger, state, emit }: any) => {

    try{    
        logger.info('Received event data', { data: input });
        const { emergencyId } = input as { emergencyId: string };
        // logger.info({emergencyId})

       if (typeof emergencyId !== 'string') {
         throw new Error('Missing or invalid emergencyId in event data');
        }

        //console.log(emergencyId, "in emergency.created subscirbe ervent");
        

        //loading data from state 
        const emergency = await state.get('emergencies', emergencyId);
        if(!emergency){
            throw new Error(`Emergency not found: ${emergencyId}`)
        }

        //console.log(emergency, "in emergency.created subscirbe ervent");

        let unitsMap = await state.getGroup('units') //alll the units are loaded from state

        if(unitsMap.length == 0) {            // if its empty we need to initialize all transport
            await SeedUnits(state);
            unitsMap = await state.getGroup('units') 
        }

        const nearestUnit = findNearestAvailableUnit(emergency, unitsMap)
        console.log("nearest unit",nearestUnit)
        //here we should also check if the if this nearestunit is assigned to another emergency or not
        if (nearestUnit) {

            
            nearestUnit.status = "dispatched";
            nearestUnit.currentEmergencyId = emergency.id;

            emergency.status = "dispatched";
            emergency.assignedUnitId = nearestUnit.id;

            //update the states
            await state.set('units', nearestUnit?.id, nearestUnit)
            await state.set('emergencies', emergency.id, emergency)
            
            await emit({
                topic: 'emergency.dispatched',
                data: {emergencyId:emergency.id, unitId: nearestUnit.id}
            })

            logger.info('Unit assigned', { emergencyId, unitId: nearestUnit.id });
        } else {
            emergency.status = 'unassigned'; // Handle no unit available
            await state.set('emergencies', emergency.id, emergency);
            logger.warn('No available unit for emergency', { emergencyId });
        }

        return { status: 200, body: { success: true } }
        
    }catch(error:any){
        logger.error('Unit assignment failed', { error: error.message });
        return { status: 500, body: { success: false, error: error.message } };
    }
  
}

//emit an event from the API handler, then handle the async/background work in a separate event subscriber.