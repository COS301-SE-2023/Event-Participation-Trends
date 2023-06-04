import { Module } from '@nestjs/common';
import { PassportController } from './passport.controller';
import { PassportService } from './passport.service';
import { GoogleOAuthGuard } from '../google-oauth-guard.guard';
import { GoogleStrategy } from './google.strategy';
import { PassportModule as pass } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    pass.register({
      defaultStrategy: 'google',
    }),
  ],
  controllers: [PassportController],
  providers: [PassportService, GoogleStrategy, GoogleOAuthGuard, JwtService],
  exports: [PassportService, GoogleOAuthGuard],
})
export class PassportModule {}
