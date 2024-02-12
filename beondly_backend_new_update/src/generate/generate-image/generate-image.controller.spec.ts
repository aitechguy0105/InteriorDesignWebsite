import { Test, TestingModule } from '@nestjs/testing';
import { GenerateImageController } from './generate-image.controller';
import { GenerateImageService } from './generate-image.service';

describe('GenerateImageController', () => {
  let controller: GenerateImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateImageController],
      providers: [GenerateImageService],
    }).compile();

    controller = module.get<GenerateImageController>(GenerateImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
