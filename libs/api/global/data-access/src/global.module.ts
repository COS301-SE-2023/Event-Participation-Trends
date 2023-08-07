import { Module } from '@nestjs/common';
import { GlobalRepository } from './global.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalSchema
} from '../schemas';

@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Global', schema: GlobalSchema },
        ])],
  providers: [GlobalRepository],
  exports: [GlobalRepository],
})
export class GlobalModule {} 