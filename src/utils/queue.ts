
import { Emergency } from "types/models"
export const getPendingEmergenciesInPriorityOrder = async (state:any): Promise<Emergency[]> => {
    // Read emergencies group from state
    const emergenciesMap = await state.getGroup("emergencies"); //this is [ {}, {}, {}]
    if (!emergenciesMap) return [];
    const emergencies = Object.values(emergenciesMap)as Emergency[]; 
    //filtering the pending emergencies
    const pending = emergencies.filter(e => (e as any).status === "pending");
    //sort descending severity
    pending.sort((a,b) => (b as any).severity - (a as any).severity)
    return pending 
}
