import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttController } from './mqtt.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MQTT_SERVICE",
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL,
          username: process.env.MQTT_USERNAME,
          password: process.env.MQTT_PASSWORD,
        }
      }
    ]),
  ],
  controllers: [AppController, MqttController],
  providers: [AppService],
})
export class AppModule {}
