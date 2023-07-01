import { Module } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@event-participation-trends/api/user/feature';
import { UserModule } from '@event-participation-trends/api/user/data-access';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [UserModule,CqrsModule],
  controllers: [],
  providers: [JwtGuard, JwtService, UserService],
  exports: [JwtGuard],
})
export class ApiGuardsModule {}
