import { UserModule, UserService } from '@event-participation-trends/api/user/feature';
import { UserController } from '../src/controllers/user.controller'
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [CqrsModule, UserModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class CoreModule {}