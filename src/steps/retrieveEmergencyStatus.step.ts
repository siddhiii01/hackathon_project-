import { ApiRouteConfig, Handler } from "motia";
import { Assignment } from "types/models";

export const config: ApiRouteConfig = {
  name: "GetEmergencyStatus",
  path: "/emergency/:id/status",
  type: "api",
  method: "GET",
  emits: []
}

export const handler = async(req:any,{logger,state}:any) => {
  const id = req.pathParams.id;
  console.log("status id",id);
  const emergency =  await state.get("emergencies",id);
  
  const assignmentsMap = await state.getGroup("assignments") as Assignment[];
  const assigments = Object.values(assignmentsMap);

  const assigment = assigments.find((a) => (a.emergencyId === id));
 
  let unit = null;
  if(assigment) unit = await state.get("units",assigment.unitId);

  return {status: 200, body: {emergency,unit,assigment}};
}