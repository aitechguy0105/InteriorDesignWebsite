import { Test, TestingModule } from '@nestjs/testing';
import { PromptController } from './prompt.controller';
import { PromptService } from './prompt.service';

describe('PromptController', () => {
  let controller: PromptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromptController],
      providers: [PromptService],
    }).compile();

    controller = module.get<PromptController>(PromptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
