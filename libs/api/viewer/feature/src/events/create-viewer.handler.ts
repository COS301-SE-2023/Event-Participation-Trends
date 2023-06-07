import { CreateViewerEvent } from '@event-participation-trends/api/viewer/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ViewerRepository } from '@event-participation-trends/api/viewer/data-access';

@EventsHandler(CreateViewerEvent)
export class CreateViewerEventHandler implements IEventHandler<CreateViewerEvent> {
  constructor(private readonly repository: ViewerRepository) {}

  async handle(event: CreateViewerEvent) {
    console.log(`${CreateViewerEventHandler.name}`);

    await this.repository.createViewer(event.user);
  }
}