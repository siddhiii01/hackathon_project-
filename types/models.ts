export interface Location {
    lat: number,
    lng: number
}

export type EmergencyType = 'medical' | 'fire' | 'police';
export type EmergencyStatus = 'pending' | 'dispatched' | 'active' | 'resolved';

export type UnitType = "ambulance" | "fire_truck" | "police_car";
export type UnitStatus = "available" | "dispatched" | "busy" | "offline";

//how the emergecny should look like
export interface Emergency  {
    id: string,
    type: EmergencyType,
    location: Location,
    severity: number | null,
    description: string,
    status: EmergencyStatus,
    createdAt: Date,
    assignedUnitId: string | null;
    aireasoning: string | null;
    requiredUnits: number
    specialEquipment? : string[]
}

//which are the units are assigned
export interface Unit {
    id: string,
    type: UnitType,
    location: Location,
    status:  UnitStatus,
    currentEmergencyId: string | null;
    averageSpeedKmph: number;
}