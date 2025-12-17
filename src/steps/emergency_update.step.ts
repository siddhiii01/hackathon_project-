 export const config = {
  name: 'EmergencyUpdate',
  type: 'event',
  subscribes: ['emergency.updated'],
  emits: ['unit.assigning'], //i chnage this name 
};
 
export const handler = async (input:any, { logger,state,emit }:any) => {
    //console.log('ai class: ',input)
    //Getting AI Classifier Data
    const {classification } = input 
    const emergencyId = input.emergencyId;
    const { classifiedType, severity, requiredUnits, reasoning} = classification;
    //finding emergency from the state
    const emergency = await state.get('emergencies', emergencyId)
    if (!emergency) {
        logger.error("Emergency not found:", emergencyId)
        return
    }

    //if emergencies are found from state then Updating emergency with AI data 
    emergency.type = classifiedType     // override user guess
    emergency.severity = severity
    emergency.aireasoning = reasoning
    emergency.requiredUnits = requiredUnits
    emergency.specialEquipment = classification.specialEquipment

    //Save to state 
    await state.set('emergencies', emergencyId, emergency)
    logger.info("AI CLASSIFIER VALUE SAVED TO EMERGENCY", {
        emergencyId,
        classifiedType,
        severity,
        requiredUnits
    });
    //new event is created now find the units for this emergencies
    await emit({
        topic: 'unit.assigning',
        data: {
            emergencyId
        }
    })
}

