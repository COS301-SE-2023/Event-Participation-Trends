import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas';
import { EmailService } from '@event-participation-trends/api/email/feature';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'User', schema: UserSchema },
    ])],
  providers: [UserRepository, EmailService],
  exports: [UserRepository, EmailService],
})
export class UserModule {}