import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHandlerMiddleware implements NestMiddleware {
  jwtService: JwtService;

  constructor(){
    this.jwtService = new JwtService({});
  }

  async use(req: any, res: any, next: () => void) {
    // get jwt from cookie
    const jwt = req.cookies["jwt"];

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
      res.send(401).body("Unauthorized");

    }
  }
}
