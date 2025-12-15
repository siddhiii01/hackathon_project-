import { Unit } from "types/models";

export const UNIT_STORE = new Map<string,Unit>();

function SeedUnits() {
    for(let i=1;i<=5;i++) {
    UNIT_STORE.set(`AMB_${i}`,{
      id: `AMB_${i}`,
      type: 'ambulance',
      location: { lat: 32.87, lng: 45.34 },
      status: 'available',
      currentEmergencyId: null
    })
  }

  for(let i=1;i<=3;i++) {
    UNIT_STORE.set(`FIRE_${i}`,{
      id: `FIRE_${i}`,
      type: 'fire_truck',
      location: { lat: 32.87 + Math.random() * 0.1, lng: 45.34 + Math.random() * 0.1},
      status: 'available',
      currentEmergencyId: null
    })
  }

   for(let i=1;i<=2;i++) {
    UNIT_STORE.set(`POL_${i}`,{
      id: `POL_${i}`,
      type: 'police_car',
      location: { lat: 32.87 + Math.random() * 0.1, lng: 45.34 + Math.random() * 0.1},
      status: 'available',
      currentEmergencyId: null
    })
  }
}

SeedUnits();