import { Module } from '@nestjs/common';
import { ViewerRepository } from './viewer.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, EventSchema } from '../schemas';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'User', schema: "UserSchema" },
    {name: 'Event', schema: "EventSchema" },
    ])],
  providers: [ViewerRepository],
  exports: [ViewerRepository],
})
export class ViewerModule {}
