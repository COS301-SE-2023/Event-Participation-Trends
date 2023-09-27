import { Test, TestingModule } from '@nestjs/testing';
import { SocketGateway } from './socket.gateway';
import { SocketServiceService } from './socket-service.service';
import { EventService } from '@event-participation-trends/api/event/feature';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

describe('SocketGateway', () => {
  let gateway: SocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketGateway, SocketServiceService, EventService, CommandBus, QueryBus],
    }).compile();

    gateway = module.get<SocketGateway>(SocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
