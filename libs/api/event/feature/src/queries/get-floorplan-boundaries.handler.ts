import { EventRepository } from "@event-participation-trends/api/event/data-access";
import { GetFloorplanBoundariesQuery, IGetFloorplanBoundariesResponse } from "@event-participation-trends/api/event/util";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import Konva from "konva";
import { Types } from "mongoose";

type KonvaTypes = Konva.Line | Konva.Image | Konva.Group | Konva.Text | Konva.Path | Konva.Circle | Konva.Label;

@QueryHandler(GetFloorplanBoundariesQuery)
export class GetFloorplanBoundariesQueryHandler implements IQueryHandler<GetFloorplanBoundariesQuery> {
    constructor(
        private readonly eventRepository: EventRepository,
    ) {}

    async execute(query: GetFloorplanBoundariesQuery) {
        console.log(`${GetFloorplanBoundariesQueryHandler.name}`);
        const request = query.request;

        const ObjectId = <Types.ObjectId> <unknown> request.eventId;

        const eventDocs = await this.eventRepository.getEventFloorlayout(ObjectId); // find the event floorlayout

        // transform string into JSON
        if (eventDocs[0].FloorLayout != null){
            const floorlayout: Konva.Layer = JSON.parse(eventDocs[0].FloorLayout);

            // run through all objects to determine the rightmost, leftmost, topmost and bottommost point
            let rightmost = 0;
            let leftmost = 0;
            let topmost = 0;
            let bottommost = 0;

            if (floorlayout.children != null){
                floorlayout.children.forEach((element) => {
                    if (element.attrs.x != null){
                        if (element.attrs.x > rightmost){
                            rightmost = element.attrs.x;
                        }
                        if (element.attrs.x < leftmost){
                            leftmost = element.attrs.x;
                        }
                    }
                    if (element.attrs.y != null){
                        if (element.attrs.y > bottommost){
                            bottommost = element.attrs.y;
                        }
                        if (element.attrs.y < topmost){
                            topmost = element.attrs.y;
                        }
                    }
                });
                // calculate the center of the floorlayout
                const boundaries: IGetFloorplanBoundariesResponse = {
                    boundaries: {
                        top: topmost,
                        left: leftmost,
                        right: rightmost,
                        bottom: bottommost,
                    },
                };
    
                return boundaries;
            }
            else { // if there are no children, return null
                return null;
            }

        }
        else { // if there is no floorlayout, return null
            return null;
        }        
    }

}