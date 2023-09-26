import { AddViewingEventEvent } from '@event-participation-trends/api/user/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { Types } from 'mongoose';

@EventsHandler(AddViewingEventEvent)
export class AddViewingEventEventHandler implements IEventHandler<AddViewingEventEvent> {
  constructor(private readonly repository: UserRepository) {}

  async handle(event: AddViewingEventEvent) {
    console.log(`${AddViewingEventEventHandler.name}`);

    const userDoc = await this.repository.getUser(event.request.userEmail || "");

    let userIDObj= new Types.ObjectId();
    if(userDoc && userDoc.length >=0)
        userIDObj = userDoc[0]?._id;
    const eventIDObj = <Types.ObjectId> <unknown> event.request.eventId;

    await this.repository.addViewingEvent(userIDObj,eventIDObj);
  }
}