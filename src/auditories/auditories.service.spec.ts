import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriesService } from './auditories.service';

describe('AuditoriesService', () => {
  let service: AuditoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditoriesService],
    }).compile();

    service = module.get<AuditoriesService>(AuditoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
