export type EmergencyType = 'medical' | 'fire' | 'police';

export type EmergencyStatus = 'pending' | 'dispatched' | 'active' | 'resolved';

export type UnitType = "ambulance" | "fire_truck" | "police_car";

export type UnitStatus = "available" | "dispatched" | "busy" | "offline";

export interface Location {
    lat: number,
    lng: number
}

export interface EmergencyFormData {
  id?: string,
  type: EmergencyType,
  description: string,
  location:Location,
  severity?: number
  status: EmergencyStatus
}

export interface UnitFormData {
  id: string,
  type: UnitType,
  status:  UnitStatus
}

export interface DashboardCardProps {
  emergencies: EmergencyFormData[],
  units: UnitFormData[],
  selectedView:string | null,
  onCardClick?: (view:string) => void 
} 

export interface TableProps {
  emergencies: EmergencyFormData[],
  units: UnitFormData[],
  selectedView: string | null;
}