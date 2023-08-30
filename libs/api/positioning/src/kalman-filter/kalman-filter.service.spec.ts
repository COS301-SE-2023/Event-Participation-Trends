import { Test, TestingModule } from '@nestjs/testing';
import { KalmanFilterService } from './kalman-filter.service';

describe('KalmanFilterService', () => {
  let service: KalmanFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KalmanFilterService],
    }).compile();

    service = module.get<KalmanFilterService>(KalmanFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
