import { Test } from '@nestjs/testing';
import { PassportController } from './passport.controller';
import { PassportService } from './passport.service';
import { JwtService } from '@nestjs/jwt';

describe('PassportController', () => {
  let controller: PassportController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PassportService, JwtService],
      controllers: [PassportController],
    }).compile();

    controller = module.get(PassportController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
