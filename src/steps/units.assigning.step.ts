import { SeedUnits } from '../services/unitStore';
import {findNearestAvailableUnit} from "../utils/dispatch";

export const config = {
  name: 'FindAndUnitAssign',
  type: 'event', 
  subscribes: ['unit.assigning.requested'],
  emits:['unit.travelling']  
}

export const handler= async (input: { emergencyId: string },{ logger, state, emit }: any) => {
    try{    
        const { emergencyId } = input as { emergencyId: string };
        logger.info("Assignment requested for this emergencuyId", { emergencyId });

        //loading emergency from the State
        const emergency = await state.get('emergencies', emergencyId);
        if(!emergency){
            throw new Error(`Emergency not found: ${emergencyId}`)
        }

        //Loading all the units from the state
        let units = await state.getGroup('units'); //this is Array of Objects [{}, {}]
        if(units.length == 0) {  //when no units are present in state
            await SeedUnits(state);
            units = await state.getGroup('units'); 
        }
        //Finding nearest units and their distance
        const {unit: nearestUnit, distancekm} = findNearestAvailableUnit(emergency, units);
        if (!nearestUnit) {
            emergency.status = "pending"
            await state.set("emergencies", emergency.id, emergency)
            logger.warn(`No available units found - emergency pending`, {
                emergencyId,
                requiredUnitType: emergency.requiredUnitType,
            });
            return;
        }
        
        //Calculating ETA 
        const etaMinutes = Math.round((distancekm/nearestUnit.averageSpeedKmph) * 60)
        nearestUnit.status = "dispatched";
        nearestUnit.currentEmergencyId = emergency.id;
        emergency.status = "assigned";
        emergency.assignedUnitId = nearestUnit.id;

        //Update state of Emergency and Units
        await state.set('units', nearestUnit?.id, nearestUnit)
        await state.set('emergencies', emergency.id, emergency)
        // console.log("new u: ", u)
        // console.log("new e: ", e)
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
        console.log("ASSIGNMENT DETAILS: ", assignment)
        logger.info(assignment.id, "this assigmnet saved in state")
            
        //Now unit is assigned now Dispatch the Unit
        await emit({
            topic: 'unit.travelling',
            data: {emergencyId:emergency.id, unitId: nearestUnit.id}
        });  
        logger.info("Unit successfully assigned + assignment saved", {
            emergencyId,
            unitId: nearestUnit.id,
            etaMinutes,
        });
    }catch(error:any){
        logger.error('Unit assignment failed', { error: error.message });
        return { status: 500, body: { success: false, error: error.message } };
    }
}


//emergency.status = assigned
//unit.status = dispatched