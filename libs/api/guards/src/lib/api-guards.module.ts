import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  imports: [],
  controllers: [],
  providers: [JwtService, JwtGuard],
  exports: [
    JwtGuard
  ],
})
export class ApiGuardsModule {}
