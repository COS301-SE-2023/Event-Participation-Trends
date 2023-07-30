import { Test } from '@nestjs/testing';
import { SensorlinkingController } from './sensorlinking.controller';

describe('SensorlinkingController', () => {
  let controller: SensorlinkingController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [SensorlinkingController],
    }).compile();

    controller = module.get(SensorlinkingController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
