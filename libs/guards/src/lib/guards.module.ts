import { Module } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [JwtGuard, JwtService],
  exports: [JwtGuard],
})
export class GuardsModule {}
