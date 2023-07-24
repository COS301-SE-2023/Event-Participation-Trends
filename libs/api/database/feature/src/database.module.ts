import { Module } from "@nestjs/common";
import { DatabaseConfigService } from "./database-configuration.service";

@Module({
    providers: [DatabaseConfigService],
    exports: [DatabaseConfigService],
})
export class DatabaseModule{}