import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttController } from './mqtt.controller';
import { JwtModule } from '@nestjs/jwt';
import {
  PassportController,
  PassportService,
  PassportModule as Wow,
} from '@event-participation-trends/api/passport';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
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
        ],
        controllers: [AppController, MqttController, PassportController],
        providers: [AppService, PassportService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
