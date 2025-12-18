import { ApiRouteConfig } from "motia";

export const config: ApiRouteConfig = {
  name: 'FetchEmergencies',
  type: 'api',
  path: '/getEmergencies',
  method: 'GET',
  emits: []
}

export const handler = async (req:any, { state, logger }:any) => {
  const emergenciesMap = await state.getGroup('emergencies');
  // console.log(emergencies);
  const emergencies =   Object.values(emergenciesMap);
  logger.info("Emergencies retrieved",{emergencies});
  return {status: 200,body: {emergencies}}
};