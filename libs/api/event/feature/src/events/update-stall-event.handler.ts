import { EventRepository } from "@event-participation-trends/api/event/data-access";
import { IStall, IUpdateStall, UpdateStallEvent } from "@event-participation-trends/api/event/util";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

@EventsHandler(UpdateStallEvent)
export class UpdateStallHandler implements IEventHandler<UpdateStallEvent> {
    constructor(
        private readonly eventRepository: EventRepository,
    ) {}

    async handle(event: UpdateStallEvent) {
        console.log(`${UpdateStallHandler.name}`);

        const request = <IUpdateStall> event.stall;

        if(request.EventId != null){
            if(request.Name != null && request.Name != undefined) {
                let nameExists = false;
                const stallNames = await this.eventRepository.getAllStallNames(request.EventId);
                stallNames.forEach((element: IStall) => {
                    if(element.Name==request.Name)
                        nameExists = true;
                })

                if(!nameExists) {
                    await this.eventRepository.updateStallName(request.EventId,request);
                }
                else{
                    //throw error here
                }
            }

            if(request.x_coordinate != null && request.x_coordinate != undefined)
                await this.eventRepository.updateStallXCoordinate(request.EventId,request);

            if(request.y_coordinate != null && request.y_coordinate != undefined)
                await this.eventRepository.updateStallYCoordinate(request.EventId,request);
            
            if(request.width != null && request.width != undefined)
                await this.eventRepository.updateStallWidth(request.EventId,request);

            if(request.height != null && request.height != undefined)
                await this.eventRepository.updateStallHeight(request.EventId,request);            
        }
    }
}