import { Module } from '@nestjs/common';
import { ViewerRepository } from './viewer.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: "UserSchema" }])],
  providers: [ViewerRepository],
  exports: [ViewerRepository],
})
export class ViewerModule {}
