import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttController } from './mqtt.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PassportController,
  PassportService,
  PassportModule as Wow,
} from '@event-participation-trends/api/passport';
import { MqttService } from './mqtt.service';
import { ViewerService, ViewerModule } from '@event-participation-trends/api/viewer/feature';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    Wow,
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL,
          username: process.env.MQTT_USERNAME,
          password: process.env.MQTT_PASSWORD,
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forRoot(process.env.MONGO_ALTALS_CONNECTION_URL),
    ViewerModule,
    CqrsModule
  ],
  controllers: [AppController, MqttController, PassportController],
  providers: [AppService, MqttService, PassportService, ViewerService],
})
export class AppModule {}
