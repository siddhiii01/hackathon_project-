import { ApiRouteConfig, Handlers } from "motia";
import { UNIT_STORE } from "../services/unitStore";

export const config: ApiRouteConfig = {
  name: 'FetchUnits',
  type: 'api',
  path: '/units',
  method: 'GET',
  emits: []
}

export const handler = async(req:any,{logger}:any) => {
  //Array.from = Just converts the iterator into a normal array.
  const units = Array.from(UNIT_STORE.values()); 
  logger.info(`Units fetched: ${units.length}`);

  return {status: 200, body: units}
}
