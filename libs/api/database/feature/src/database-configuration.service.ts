import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    
    return <MongooseModuleOptions> {
      uri: process.env['NODE_ENV'] === 'development' ? 
           process.env['MONGO_ALTALS_CONNECTION_URL_DEV'] : 
           process.env['MONGO_ALTALS_CONNECTION_URL_TEST'],
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
  }
}
