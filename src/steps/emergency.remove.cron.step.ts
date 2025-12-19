import { Emergency } from "types/models";

export const config = {
  type:"cron",
  name:"CleanupOldEmergencies",
  cron:"0 */6 * * *", // every 6h
}

export const handler = async ({state,logger}:any) => {

  const emergencies = await state.getGroup("emergencies");
  const now = Date.now();

  for (const emergency of Object.values(emergencies as Record<string, Emergency>)) {
    if (emergency.status !== "resolved") continue;
    const created = new Date(emergency.createdAt).getTime();
    if (now - created >= 24*60*60*1000) {
      await state.delete("emergencies", emergency.id);
      logger.info(`Deleted emergency after 24h`, emergency.id);
    }
  }
};
