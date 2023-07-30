import { AddEventToAdminEvent } from '@event-participation-trends/api/user/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { Types } from 'mongoose';

@EventsHandler(AddEventToAdminEvent)
export class AddEventToAdminEventHandler implements IEventHandler<AddEventToAdminEvent> {
  constructor(private readonly repository: UserRepository) {}

  async handle(event: AddEventToAdminEvent) {
    console.log(`${AddEventToAdminEventHandler.name}`);

    const eventIDObj = <Types.ObjectId> <unknown> event.request.eventId;
    await this.repository.addEventToAdmin(eventIDObj);

  }
}