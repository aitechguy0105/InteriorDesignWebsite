import { Test, TestingModule } from '@nestjs/testing';
import { UploadImageService } from './upload-image.service';

describe('UploadImageService', () => {
  let service: UploadImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadImageService],
    }).compile();

    service = module.get<UploadImageService>(UploadImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
