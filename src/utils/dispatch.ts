import { Location, Emergency, Unit } from '../../types/models';
import { calculateRadialDistanceBetweenCoordinates } from './distance';



const EMERGENCY_UNIT_MAP = {
  medical: 'ambulance',
  fire: 'fire_truck',
  police: 'police_car'
} as const;




//given one emergency and many units pick the closet units
export const findNearestAvailableUnit  = (
    emergency: Emergency,
    units: Unit[]): Unit | null => {
        
    const requiredUnitType = EMERGENCY_UNIT_MAP[emergency.type];

    let shortestDistance = Infinity
    let nearestUnit: Unit | null = null;
    

    for(const unit of units){
        if(unit.status !== "available") continue;
        if (unit.type !== requiredUnitType) continue;

        const distance = calculateRadialDistanceBetweenCoordinates(
            emergency.location, unit.location)

        if(distance< shortestDistance){
            shortestDistance = distance
            nearestUnit = unit;
        }
    }
    return nearestUnit;
}
