import { Test } from '@nestjs/testing';
import { PassportService } from './passport.service';
import { JwtService } from '@nestjs/jwt';

describe('PassportService', () => {
  let service: PassportService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PassportService, JwtService],
    }).compile();

    service = module.get(PassportService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
