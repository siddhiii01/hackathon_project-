import { ApiRouteConfig, Handler } from "motia";

export const config: ApiRouteConfig = {
  name: "GetAssignments",
  path: "/getAssignments",
  type: "api",
  method: "GET",
  emits: []
}

export const handler = async(req:any,{logger,state}:any) => {
  const assignmentsMap = await state.getGroup("assignments");
  const assigments = Object.values(assignmentsMap);
  return {staus: 200, body: {assigments}};
}