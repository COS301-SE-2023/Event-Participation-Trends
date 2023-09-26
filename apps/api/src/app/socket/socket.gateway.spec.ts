import { Test, TestingModule } from '@nestjs/testing';
import { SocketGateway } from './socket.gateway';
import { SocketServiceService } from './socket-service.service';

describe('SocketGateway', () => {
  let gateway: SocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketGateway, SocketServiceService],
    }).compile();

    gateway = module.get<SocketGateway>(SocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
