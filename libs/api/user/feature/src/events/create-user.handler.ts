import { CreateUserEvent } from '@event-participation-trends/api/user/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserRepository } from '@event-participation-trends/api/user/data-access';

@EventsHandler(CreateUserEvent)
export class CreateUserEventHandler implements IEventHandler<CreateUserEvent> {
  constructor(private readonly repository: UserRepository) {}

  async handle(event: CreateUserEvent) {
    console.log(`${CreateUserEventHandler.name}`);

    await this.repository.createUser(event.user);
  }
}