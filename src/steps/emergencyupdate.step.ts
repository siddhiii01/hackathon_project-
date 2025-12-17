import { ApiRouteConfig, Handlers } from 'motia';
 
export const config = {
  name: 'EmergencyUpdate',
  type: 'event',
  subscribes: ['emergency.updated'],
  emits: ['emergency.dispatch'],
  flows: ['emergency-created']
};
 
export const handler = async (input:any, { logger,state,emit }:any) => {
    //console.log('ai class: ',input)
    const {classification } = input 
    const emergencyId = input.emergencyId
    //console.log('ai class: ',classification)

    const { classifiedType, severity, requiredUnits, reasoning} = classification

   
    const emergency = await state.get('emergencies', emergencyId)

    if (!emergency) {
        logger.error("Emergency not found:", emergencyId)
        return
    }

    
    emergency.type = classifiedType     // override user guess
    emergency.severity = severity
    emergency.aireasoning = reasoning
    emergency.requiredUnits = requiredUnits

    
    await state.set('emergencies', emergencyId, emergency)

    logger.info("Emergency updated from AI", {
        emergencyId,
        classifiedType,
        severity,
        requiredUnits
    });

    await emit({
        topic: 'emergency.dispatch',
        data: {
            emergencyId
        }
    })

    //console.log("new emergency: ", emergency)
}

