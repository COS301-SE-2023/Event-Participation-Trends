import { Test, TestingModule } from '@nestjs/testing';
import { SocketServiceService } from './socket-service.service';

describe('SocketServiceService', () => {
  let service: SocketServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketServiceService],
    }).compile();

    service = module.get<SocketServiceService>(SocketServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
