import { Test, TestingModule } from '@nestjs/testing';
import { RoomNameController } from './room-name.controller';
import { RoomNameService } from './room-name.service';

describe('RoomNameController', () => {
  let controller: RoomNameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomNameController],
      providers: [RoomNameService],
    }).compile();

    controller = module.get<RoomNameController>(RoomNameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
