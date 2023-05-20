import { Test, TestingModule } from '@nestjs/testing';
import { JwtGenerateService } from './jwt.generate.service';

describe('JwtGenerateService', () => {
  let service: JwtGenerateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtGenerateService],
    }).compile();

    service = module.get<JwtGenerateService>(JwtGenerateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
