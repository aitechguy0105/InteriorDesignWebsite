import { Test, TestingModule } from '@nestjs/testing';
import { BaseImageController } from './base-image.controller';
import { BaseImageService } from './base-image.service';

describe('BaseImageController', () => {
  let controller: BaseImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseImageController],
      providers: [BaseImageService],
    }).compile();

    controller = module.get<BaseImageController>(BaseImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
