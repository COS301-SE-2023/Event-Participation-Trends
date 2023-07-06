import {
    ICreateGlobalRequest,
    ICreateGlobalResponse,
    CreateGlobalCommand,
} from '@event-participation-trends/api/global/util';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class GlobalService {
    constructor(
        private readonly commandBus: CommandBus, 
        private readonly queryBus: QueryBus
    ) {}

    async createGlobal(request: ICreateGlobalRequest) {
        return await this.commandBus.execute<CreateGlobalCommand, ICreateGlobalResponse>(new CreateGlobalCommand(request));
    }

}