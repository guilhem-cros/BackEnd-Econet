import { Test, TestingModule } from '@nestjs/testing';
import { EcospotController } from './ecospot.controller';

describe('EcoSpotController', () => {
  let controller: EcospotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcospotController],
    }).compile();

    controller = module.get<EcospotController>(EcospotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
