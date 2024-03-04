import { Test, TestingModule } from '@nestjs/testing';
import { RoomNameService } from './room-name.service';

describe('RoomNameService', () => {
  let service: RoomNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomNameService],
    }).compile();

    service = module.get<RoomNameService>(RoomNameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
