import {
    ICreateViewerRequest,
    ICreateViewerResponse,
    CreateViewerCommand,
} from '@event-participation-trends/api/viewer/util';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class ViewerService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    async createViewer(request: ICreateViewerRequest) {
        return await this.commandBus.execute<CreateViewerCommand, ICreateViewerResponse>(new CreateViewerCommand(request));
    }
}