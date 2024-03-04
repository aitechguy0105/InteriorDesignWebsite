import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PriceController],
  providers: [PriceService],
  imports: [PrismaModule],
})
export class PriceModule {}
