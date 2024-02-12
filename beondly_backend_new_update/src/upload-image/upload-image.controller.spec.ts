import { Test, TestingModule } from '@nestjs/testing';
import { UploadImageController } from './upload-image.controller';
import { UploadImageService } from './upload-image.service';

describe('UploadImageController', () => {
  let controller: UploadImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadImageController],
      providers: [UploadImageService],
    }).compile();

    controller = module.get<UploadImageController>(UploadImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
