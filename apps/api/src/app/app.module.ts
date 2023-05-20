import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttController } from './mqtt.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtGenerateService } from '../services/jwt.generate/jwt.generate.service';

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
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController, MqttController],
  providers: [AppService, JwtGenerateService],
})
export class AppModule {}
