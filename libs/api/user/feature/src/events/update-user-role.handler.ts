import { UpdateUserRoleEvent } from '@event-participation-trends/api/user/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserRepository } from '@event-participation-trends/api/user/data-access';

@EventsHandler(UpdateUserRoleEvent)
export class UpdateUserRoleEventHandler implements IEventHandler<UpdateUserRoleEvent> {
  constructor(private readonly repository: UserRepository) {}

  async handle(event: UpdateUserRoleEvent) {
    console.log(`${UpdateUserRoleEventHandler.name}`);

    await this.repository.updateUserRole(event.request.UserEmail || "",event.request.UpdateRole || "");
  }
}