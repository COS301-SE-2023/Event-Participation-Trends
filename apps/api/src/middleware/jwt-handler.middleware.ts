import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHandlerMiddleware implements NestMiddleware {
  jwtService: JwtService;

  constructor(){
    this.jwtService = new JwtService({});
  }

  async use(req: Request, res: Response, next: () => void) {
    // get jwt from cookie
    const jwt = ((req as unknown) as Request).cookies["jwt"];

    // verify jwt
    try {
      await this.jwtService.verifyAsync(
        jwt,
        {
          secret: process.env.jwtSecret
        }
      );
      
      // if jwt is valid, next()
      next();

    } catch {

      // if jwt is invalid, res.send(401)
      throw new UnauthorizedException('Unauthorized');

    }
  }
}
