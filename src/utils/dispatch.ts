import { Location, Emergency, Unit } from '../../types/models';
import { calculateRadialDistanceBetweenCoordinates } from './distance';



// const EMERGENCY_UNIT_MAP = {
//   medical: 'ambulance',
//   fire: 'fire_truck',
//   police: 'police_car'
// } as const;

//given one emergency and many units pick the closet units
export const findNearestAvailableUnit  = (
    emergency: Emergency,
    units: Unit[]): {unit:Unit | null, distancekm:number} => { //this function return units and distance?

    let shortestDistance = Infinity
    let closetUnit: Unit | null = null;
    

    for(const unit of units){
        if(unit.status !== "available") continue;
        if (unit.type !== emergency.requiredUnitType) continue; 
        const distancekm = calculateRadialDistanceBetweenCoordinates(
            emergency.location, unit.location)

        //why do we even need this comparison give an eg 
        if(distancekm < shortestDistance){
            shortestDistance = distancekm
            closetUnit = unit;
        }

    }
 
    return {
        unit: closetUnit, 
        distancekm: shortestDistance
    };
}
