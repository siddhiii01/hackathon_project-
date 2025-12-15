import { Location, Emergency } from '../../types/models';
import { calculateRadialDistanceBetweenCoordinates } from './distance';

export interface DispatchUnit {
    id: string,
    type: string,
    location: Location,
    availabl: boolean
}

export interface EmergencyUnit {
    location: Location,
    type: string
}

//given one emergency and many units pick the closet units
const findNearestAvailableUnit  = (
    emergency: Emergency,
    units: DispatchUnit): DispatchUnit | null => {
        
    let shortestDistance = Number.MAX_SAFE_INTEGER
    let nearestUnit: DispatchUnit | null = null;
    

    for(const unit of units){
        if(!unit.available) continue;
        const distance = calculateRadialDistanceBetweenCoordinates(
            emergency.location, unit.location)

        if(distance< shortestDistance){
            shortestDistance = distance
            nearestUnit = unit;
        }
    }
    return nearestUnit;
}