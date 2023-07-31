import { CreateGlobalEvent } from '@event-participation-trends/api/global/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { IGlobal } from "@event-participation-trends/api/global/util";
import { GlobalRepository } from '@event-participation-trends/api/global/data-access';

@EventsHandler(CreateGlobalEvent)
export class CreateGlobalEventHandler implements IEventHandler<CreateGlobalEvent> {
  constructor(
    private readonly globalRepository: GlobalRepository,
    ) {}

  async handle(event: CreateGlobalEvent) {
    console.log(`${CreateGlobalEventHandler.name}`);

    const data: IGlobal= {
        SensorIdToMacs: event.event.SensorIdToMacs,
    }

    const globalDoc = await this.globalRepository.getGlobal();
       
    if(globalDoc.length==0){ //if no instance exists create one
        await this.globalRepository.createGlobal(data);
    }else{  //if instance exists replace it
        await this.globalRepository.replaceGlobal(data);
    }
  }
  
}   