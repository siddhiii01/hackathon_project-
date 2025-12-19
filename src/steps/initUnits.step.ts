import { ApiRouteConfig, Handlers } from "motia";
import { SeedUnits } from '../services/unitStore';

export const config: ApiRouteConfig = {
  name: 'InitUnits',
  type: 'api',
  path: '/units',
  method: 'POST', 
  emits: []
}

export const handler = async (_req:any, { state, logger }:any) => {
  let units = await state.getGroup('units'); //this returns Array of Objects 
  // let emergency = await state.getGroup('emrgencies'); //this returns Array of Objects 
  // if(units && emergency){
  //   await state.clear('units')
  //   await state.clear('emergencies')
  // }

  // return { status: 200,body: {units, emergency}}
  if (!units || units.length === 0) {
    await SeedUnits(state); //initialize units
    units = await state.getGroup('units');   // fetch seeded values
  }
  return { status: 200, body:{ success:true, units }};
};

