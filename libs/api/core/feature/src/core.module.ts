import { UserModule, UserService } from '@event-participation-trends/api/user/feature';
import { UserController } from '../src/controllers/user.controller'
import { Module } from '@nestjs/common';

@Module({
    imports: [UserModule],
    controllers: [UserController],
    exports: [UserService]
})
export class CoreModule {}