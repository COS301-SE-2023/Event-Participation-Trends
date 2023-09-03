import { IImageUploadResponse, UploadImageCommand } from "@event-participation-trends/api/event/util";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { Image } from "../models";
import { Status } from "@event-participation-trends/api/user/util";
import { Types } from "mongoose";

@CommandHandler(UploadImageCommand)
export class UploadImageHandler implements ICommandHandler<UploadImageCommand, IImageUploadResponse> {
    constructor(
        private readonly publisher: EventPublisher,
    ) {}

    async execute(command: UploadImageCommand) {
        console.log(`${UploadImageHandler.name}`);

        const request = command.request;
        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;

        //check if of the correct format
        if(request.floorlayoutImg != undefined && request.floorlayoutImg != null){
            
            let validFormat =false;

            const validTypeArr: string[] = [
                'data:image/jpeg;base64',
                'data:image/png;base64',
                'data:image/gif;base64',
                'data:image/svg+xml;base64',
                'data:image/svg+xml;base64',
                'data:image/vnd.adobe.photoshop;base64',
                'data:image/webp;base64',
                'data:image/tiff;base64',
            ];

            const temp = request.floorlayoutImg.substring(0,37);

            validTypeArr.forEach(str=>{
                if(temp.indexOf(str) != -1)
                    validFormat = true;
            })

            if(validFormat){

                const data = {
                    eventId: eventIdObj,
                    imageBase64: request.floorlayoutImg,
                    imageScale: request.imageScale,
                    imageType: request.imageType,
                }
        
                const event = this.publisher.mergeObjectContext(Image.fromData(data));
                event.add();
                event.commit();
        
                return { status : Status.SUCCESS };
            }else{
                return { status : Status.FAILURE };    
            }

        }else{
            return { status : Status.FAILURE };
        }
    }
}