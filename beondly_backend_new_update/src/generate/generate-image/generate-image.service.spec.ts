import { Test, TestingModule } from '@nestjs/testing';
import { GenerateImageService } from './generate-image.service';

describe('GenerateImageService', () => {
  let service: GenerateImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateImageService],
    }).compile();

    service = module.get<GenerateImageService>(GenerateImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
