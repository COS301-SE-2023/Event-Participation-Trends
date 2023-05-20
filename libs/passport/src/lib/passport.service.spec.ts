import { Test } from '@nestjs/testing';
import { PassportService } from './passport.service';

describe('PassportService', () => {
  let service: PassportService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PassportService],
    }).compile();

    service = module.get(PassportService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
