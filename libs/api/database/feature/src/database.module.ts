import { Module } from "@nestjs/common";
import { DatabaseConfigService } from "./database-configuration.service";
import { DatabaseService } from "./database-service";
import { EventModule, EventRepository, EventSchema, ImageSchema, SensorSchema, StallSchema } from "@event-participation-trends/api/event/data-access";
import { UserModule, UserRepository, UserSchema } from "@event-participation-trends/api/user/data-access";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Sensor', schema: SensorSchema },
        {name: 'Stall', schema: StallSchema },
        {name: 'Event', schema: EventSchema },
        {name: 'Image', schema: ImageSchema },
        {name: 'User', schema: UserSchema },
        ]), EventModule, UserModule],
    providers: [DatabaseConfigService, EventRepository, UserRepository, DatabaseService],
    exports: [DatabaseConfigService, DatabaseService],
})
export class DatabaseModule{}