import { Emergency } from "types/models"
export const getPendingEmergenciesInPriorityOrder = async (state:any):Promise<Emergency[]> => {

    // Read emergencies group from state
    const emergenciesMap = await state.getGroup("emergencies"); 
     // this is Map<string, Emergency>

    if (!emergenciesMap) return [];
    console.log("Emergenices in queue: ",emergenciesMap)

    //extract values from map
    const emergencies = Array.from(emergenciesMap.values()) as Emergency[];

    //filtering the pending emergencies
    const pending = emergencies.filter(e => (e as any).status === "pending");

    //sort descending severity
    pending.sort((a,b) => (b as any).severity - (a as any).severity)

    return pending 

    
}

//call this function with state para in emergency 