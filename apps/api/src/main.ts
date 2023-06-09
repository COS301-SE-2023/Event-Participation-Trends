/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app/app.module';
import cookieParser = require('cookie-parser');
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  // app.use(helmet({
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       scriptSrc: ["'self'"],
  //       styleSrc: ["'self'"],
  //       imgSrc: ["'self'"],
  //       connectSrc: ["'self'"],
  //       fontSrc: ["'self'"],
  //       objectSrc: ["'none'"],
  //       mediaSrc: ["'self'"],
  //       frameSrc: ["'none'"],
  //       childSrc: ["'none'"],
  //       formAction: ["'self'"],
  //     },
  //   },
  //   frameguard: { action: 'deny' },
  //   hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  //   ieNoOpen: true,
  //   noSniff: true,
  //   xssFilter: true,
  // }));
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
 // mqtt_app.listen();
  Logger.log("💥 MQTT Microservice is listening");
}

bootstrap();
