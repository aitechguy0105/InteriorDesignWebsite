import { Test, TestingModule } from '@nestjs/testing';
import { BaseImageService } from './base-image.service';

describe('BaseImageService', () => {
  let service: BaseImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseImageService],
    }).compile();

    service = module.get<BaseImageService>(BaseImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
