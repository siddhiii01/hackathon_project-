export type EmergencyType = 'medical' | 'fire' | 'police';
export interface Location {
    lat: number,
    lng: number
}

export interface EmergencyFormData {
  type: EmergencyType,
  description: string,
  location:Location
}