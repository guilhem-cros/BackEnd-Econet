import { Test, TestingModule } from '@nestjs/testing';
import { EcospotService } from './ecospot.service';

describe('EcospotService', () => {
  let service: EcospotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EcospotService],
    }).compile();

    service = module.get<EcospotService>(EcospotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
