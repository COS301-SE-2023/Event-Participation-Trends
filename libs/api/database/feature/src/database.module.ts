import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { DatabaseConfigService } from "./database-configuration.service";

@Module({
    providers: [DatabaseService, DatabaseConfigService],
    exports: [DatabaseService, DatabaseConfigService],
})
export class DatabaseModule{}