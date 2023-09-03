/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app/app.module';
import cookieParser = require('cookie-parser');
import { MqttModule } from './app/mqtt.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //change maximum size of requests
  const expressApp = app.getHttpAdapter().getInstance() as express.Application;
  expressApp.use(express.json({ limit: '16mb' }));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  const mqtt_app = await NestFactory.createMicroservice(MqttModule, {
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_URL,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    },
  });
  mqtt_app.listen();
  Logger.log("💥 MQTT Microservice is listening");
}

bootstrap();
