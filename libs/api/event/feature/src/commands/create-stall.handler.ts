import { EventRepository } from "@event-participation-trends/api/event/data-access";
import { CreateStallCommand, ICreateStallResponse, IStall } from "@event-participation-trends/api/event/util";
import { UserRepository } from "@event-participation-trends/api/user/data-access";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { Stall } from "../models";
import { Status } from "@event-participation-trends/api/user/util";

@CommandHandler(CreateStallCommand)
export class CreateStallHandler implements ICommandHandler<CreateStallCommand, ICreateStallResponse>{
    constructor(
        private readonly publisher: EventPublisher,
        private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository,
    ) {}

    async execute(command: CreateStallCommand) {
        console.log(`${CreateStallHandler.name}`);

        const request = command.request;
        if(request.Stall != null && request.Stall != undefined){
            //check if event exists
            const eventIdObj = <Types.ObjectId> <unknown> request.EventId;

            let eventExists = false;
            const eventDoc = await this.eventRepository.getEventById(eventIdObj);
            if(eventDoc.length != 0) {
                eventExists = true;
            }

            if(eventExists){
                const data: IStall = {
                    Name: request.Stall.Name,
                    x_coordinate: request.Stall.x_coordinate,
                    y_coordinate: request.Stall.y_coordinate,
                    width: request.Stall.width,
                    height: request.Stall.height                    
                };

                const stall = this.publisher.mergeObjectContext(Stall.fromData(data));
                stall.create();
                stall.commit();

                return { status : Status.SUCCESS };
            } else {
                return { status : Status.FAILURE };
            }
        } else {
            return { status : Status.FAILURE };
        }
    }
}