import { ApiRouteConfig } from "motia"

export const config:ApiRouteConfig = {
  name: "GetEmergency",
  type: "api",
  path: "/emergency/:id",
  method: "GET",
  emits: []
}
 
export const handler = async(req:any, {state}:any) => {
  const id = req.pathParams.id;
  // if(!id) return {staus};
  const emergency =  await state.get("emergencies",id);
  // console.log(id);
  if(!emergency) return {status: 404, body: {success:false}};

   return {
    status: 200,
    body: {
      id: emergency.id,
      status: emergency.status,
      assignedUnitId: emergency.assignedUnitId,
      type: emergency.type
    }
  };
}