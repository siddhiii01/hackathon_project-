import { UnitStatus, UnitType } from "types/models";

export async function SeedUnits(state: any) {

  //Fuel: 
  function randomFuel(){
    return Math.floor(50 + Math.random() * 50); //50 - 100
  }

  const baseLat = 20.2290432;
  const baseLng = 75.0759331;

  //Location: 
  function randomLocation(){
    return({
      // lat: 32.87 + Math.random() * 0.1,
      // lng: 45.34 + Math.random() * 0.1
      lat: baseLat + (Math.random() - 0.5) * 0.1,
      lng: baseLng + (Math.random() - 0.5) * 0.1
    })
  }

  //Now saving Units in State 

  //Amublance Units: 
  for(let i=1; i<=5; i++) {
    await state.set('units', `AMB_${i}`,{
      id: `AMB_${i}`,
      type: 'ambulance' as UnitType,
      location: randomLocation(),
      status: 'available' as UnitStatus,
      currentEmergencyId: null,
      averageSpeedKmph: 70,
      fuelLevel: randomFuel(),
      lastDispatchTime: null,
      equipmentType: [Math.random() > 0.5 ? "ALS" : "BLS"] 
    })
  }

  //Fire Units
  for(let i=1;i<=5;i++) {
    await state.set('units', `FIRE_${i}`,{
      id: `FIRE_${i}`,
      type: 'fire_truck' as UnitType,
      location: randomLocation(),
      status: 'available' as UnitStatus,
      currentEmergencyId: null,
      averageSpeedKmph: 45,
      fuelLevel: randomFuel(),
      lastDispatchTime: null,
      equipmentType: [Math.random() > 0.5 ? "ladder" : "engine"]
    })
  }

  //Police units
  for(let i=1;i<=5;i++) {
    await state.set('units', `POL_${i}`,{
      id: `POL_${i}`,
      type: 'police_car' as UnitType,
      location: randomLocation(),
      status: 'available' as UnitStatus,
      currentEmergencyId: null,
      averageSpeedKmph: 90,
      fuelLevel: randomFuel(),
      lastDispatchTime: null,
      equipmentType: [Math.random() > 0.66 ? "patrol": Math.random() > 0.5 ? "standard" : "riot"]
    })
  }
}

// the idea was: state.set('units', key, value)
// units:
//   AMB_1 -> {...}
//   AMB_2 -> {...}
//   FIRE_1 -> {...}
//   POL_1 -> {...}