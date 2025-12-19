import { ApiRouteConfig } from "motia";

export const config: ApiRouteConfig = {
  name: 'FetchUnits',
  type: 'api',
  path: '/getUnits',
  method: 'GET',
  emits: []
}

export const handler = async (req:any, { state, logger }:any) => {
  const unitsMap = await state.getGroup('units');
  
  const units =   Object.values(unitsMap);
  logger.info("Units retrieved",{units});
  return {status: 200,body: {units}}
};