import { Module } from '@nestjs/common';
import { PassportController } from './passport.controller';
import { PassportService } from './passport.service';
import { GoogleOAuthGuard } from '../google-oauth-guard.guard';
import { GoogleStrategy } from './google.strategy';
import { PassportModule as pass } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    pass.register({
      defaultStrategy: 'google',
    }),
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PassportController],
  providers: [PassportService, GoogleStrategy, GoogleOAuthGuard, JwtService],
  exports: [PassportService, GoogleOAuthGuard],
})
export class PassportModule {}
