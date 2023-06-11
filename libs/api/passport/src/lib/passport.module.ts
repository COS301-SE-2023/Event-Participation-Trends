import { Module } from '@nestjs/common';
import { PassportController } from './passport.controller';
import { PassportService } from './passport.service';
import { GoogleOAuthGuard } from '../google-oauth-guard.guard';
import { GoogleStrategy } from './google.strategy';
import { PassportModule as pass } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService, UserModule } from '@event-participation-trends/api/user/feature';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    pass.register({
      defaultStrategy: 'google',
    }),
    JwtModule.register({}), 
    UserModule,
    CqrsModule,
  ],
  controllers: [PassportController],
  providers: [PassportService, GoogleStrategy, GoogleOAuthGuard, JwtService, UserService ],
  exports: [PassportService, GoogleOAuthGuard],
})
export class PassportModule {}
