import { ApiRouteConfig } from "motia"
export const config: ApiRouteConfig = {
  name: "ListEmergencies",
  type: "api",
  path: "/all/emergencies",
  method: "GET",
  emits: []
}

export const handler = async (req: any, { state, logger }: any) => {
  const status = req.query?.status;
  
  //getting all emeregencies from satte
  const emergenciesMap = await state.getGroup('emergencies');
  
  if (!emergenciesMap || emergenciesMap.length === 0) {
    return {
      status: 200,
      body: {
        success: true,
        emergencies: [],
        total: 0
      }
    };
  }

  let emergencies = Array.from(emergenciesMap);

  if (status) {
    emergencies = emergencies.filter((e:any) => e.status === status);
  }

  emergencies.sort((a, b) => 
    new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime()
  );
  logger.info('Returned All Emergencies: ', {emergencies})

  return {
    status: 200,
    body: {
      success: true,
      emergencies: emergencies,
      total: emergencies.length
    }
  };
}

