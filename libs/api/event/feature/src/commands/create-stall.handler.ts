import { EventRepository } from "@event-participation-trends/api/event/data-access";
import { CreateStallCommand, ICreateStallResponse, IStall } from "@event-participation-trends/api/event/util";
import { UserRepository } from "@event-participation-trends/api/user/data-access";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { Stall } from "../models";
import { Status } from "@event-participation-trends/api/user/util";
import { HttpException } from "@nestjs/common";

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

            const eventDoc = await this.eventRepository.getEventById(eventIdObj);
            if(eventDoc.length == 0)
                throw new HttpException(`Bad Request: Event with id ${request.EventId} does not exist`, 400);
            
            //check if stall already exists
            let stallExists =false;
            const checkDoc = await this.eventRepository.getStallByName(eventIdObj, request.Stall.Name || "");

            if(checkDoc.length != 0)
                stallExists =true;

            if(!stallExists){
                const data: IStall = {
                    EventId: request.EventId,
                    Name: request.Stall.Name,
                    x_coordinate: request.Stall.x_coordinate,
                    y_coordinate: request.Stall.y_coordinate,
                    width: request.Stall.width,
                    height: request.Stall.height
                }
                
                const stall = this.publisher.mergeObjectContext(Stall.fromData(data));
                stall.create();
                stall.commit();
        
                return { status : Status.SUCCESS };
            }
            else{
                return { status : Status.FAILURE };
            }
        }else{
            return { status : Status.FAILURE };
        }
    }
}