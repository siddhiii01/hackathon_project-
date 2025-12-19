import { EventConfig } from 'motia'
export const config: EventConfig  ={
    name: "EventLoggerSystem",
    type: "event",
    //subscribes : ['emergency.created', 'emergency.updated', 'unit.assigning', 
        //'unit.dispatched','emergency.active','emergency.resolved','unit.available' ],
    emits: []
} 

export const handler = async(input: any, ctx:any) => {
    
    const eventId = crypto.randomUUID()
    //const eventType = ctx

    const eventData = {
        id: eventId,
        //type: eventType,//how would i get this,
        data: input, //-> data that event sent 
        timestamp: new Date().toISOString(),
    }

    await ctx.state.set('events',eventId, eventData )
    ctx.logger.info('Event logged:', {  eventId })
}