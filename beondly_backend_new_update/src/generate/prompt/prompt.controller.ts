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
import { PromptService } from './prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/util/guards/accessToken.guard';
import { PromptEntity } from './entities/prompt.entity';

@Controller('prompt')
@ApiTags('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PromptEntity, isArray: true })
  async create(@Body() createPromptDto: CreatePromptDto) {
    return await this.promptService.create(createPromptDto);
  }

  @Get()
  async findAll() {
    return await this.promptService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: PromptEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.promptService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PromptEntity })
  update(@Param('id') id: string, @Body() updatePromptDto: UpdatePromptDto) {
    return this.promptService.update(+id, updatePromptDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.promptService.remove(+id);
  }
}
