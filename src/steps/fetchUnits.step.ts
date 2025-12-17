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
  const unitsMap = await state.getGroup('units');
  if (unitsMap.length === 0) {
    await SeedUnits(state);
    logger.info('Units seeded into Motia state');
  }
  return { status: 200, body: { success: true, unitsMap } };

};

