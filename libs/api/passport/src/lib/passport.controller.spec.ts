import { Test } from '@nestjs/testing';
import { PassportController } from './passport.controller';
import { PassportService } from './passport.service';

describe('PassportController', () => {
  let controller: PassportController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PassportService],
      controllers: [PassportController],
    }).compile();

    controller = module.get(PassportController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
