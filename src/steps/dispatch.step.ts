import { ApiRouteConfig } from 'motia'
 
// why this file is used??
export const config = {
  type: 'event',
  name: 'EmergencyDispatch',
  subscribes: ['emergency.dispatching'],
  emits: [],
  //flows: ['emergency-dispatch'],
}

export const handler= async (input :{emergencyId: string}, { logger, emit, state }: any) => {
    //console.log(input);
    const {emergencyId} = input

    //console.log('hdjask: ', emergencyId)

    const emergency = await state.get('emergencies', emergencyId)

    const unitsNeeded = emergency.requiredUnits;  
    const emergencyLocation = emergency.location;  
    const type = emergency.type;



    logger.info("Extactred emergency ", {
        unitsNeeded,
        emergencyLocation,
        type,
       
    })

}