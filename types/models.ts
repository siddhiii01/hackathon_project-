export interface Location {
    lat: number,
    lng: number
}

export type EmergencyType = 'medical' | 'fire' | 'police';
export type EmergencyStatus = 'pending' | 'classified' | 'assigned' | 'active' | 'resolved';

export type UnitType = "ambulance" | "fire_truck" | "police_car";
export type UnitStatus = "available" | 'selected'| "dispatched" | "busy" | "available again";

export type Severity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;


//how the emergecny should look like
export interface Emergency  {
    id: string,
    type: EmergencyType,
    location: Location,
    severity?: Severity, //how sever is the emergency 
    description: string,

    status: EmergencyStatus, //what is the status
    createdAt: string,
    assignedUnitId: string[],
    aireasoning?: string,
    requiredUnits: number,
    specialEquipment? : string[],
    requiredUnitType?: UnitType //which unit is most suitable

}

//which are the units are assigned
export interface Unit {
    id: string,
    type: UnitType,
    location: Location,
    status:  UnitStatus,
    currentEmergencyId: string | null;
    averageSpeedKmph: number;
    fuelLevel: number, //-> if fuel is low assign another unit
    lastDispatchTime: Date | null, //-> when was the last time the unit was dispacthed
    equipmentType: string[] //-> what equipment should the unit have
}

//Assignments is the lifecycle record between 1 emergency and N units
export interface Assignment {
    id: string,
    emergencyId: string, //should save the same of current emegerncy
    unitId: string, //should save the same of current unit 
    etaMinutes: number //estimated time until arrival
    dispatchTime: Date | null //when unit left station
    arrivalTime: Date | null //when unit reached emergency
    completionTime: Date | null //when unit finished handling
}