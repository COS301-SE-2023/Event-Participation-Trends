/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
<<<<<<< HEAD
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

=======
import { Transport } from '@nestjs/microservices'
>>>>>>> 9136ac98ee5b27a3c19ebb0ba3213ddb9053c197
import { AppModule } from './app/app.module';
import cookieParser = require('cookie-parser');
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  const mqtt_app = await NestFactory.createMicroservice(AppModule, {
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
