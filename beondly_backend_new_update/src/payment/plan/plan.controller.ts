import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/util/guards/accessToken.guard';
import { PlanEntity } from './entities/plan.entity';
import { PriceEntity } from '../price/entities/price.entity';
import { access } from 'fs';

@Controller('plan')
@ApiTags('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PlanEntity })
  async create(@Body() createPlanDto: CreatePlanDto) {
    return await this.planService.create(createPlanDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PriceEntity, isArray: true })
  async findAll() {
    const plans = await this.planService.findAll();
    return plans.map((plan) => plan);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PlanEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.planService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PlanEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return await this.planService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PlanEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.planService.remove(id);
  }
}
