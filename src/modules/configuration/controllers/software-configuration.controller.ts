import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SoftwareConfigurationService } from '../services';
import {
  CreateSoftwareConfigurationDto,
  SoftwareConfigurationPaginationDto,
  SoftwareConfigurationRelation,
  UpdateSoftwareConfigurationDto,
} from '../dto';
import { softwareConfiguration as SoftwareConfigurationModel } from '@prisma/client';

@Controller('softwareConfiguration')
export class SoftwareConfigurationController {
  constructor(private readonly modelService: SoftwareConfigurationService) {}

  @Get('lastSoftwareConfiguration')
  async lastSoftwareConfiguration(): Promise<SoftwareConfigurationModel> {
    let model = (await this.modelService.getLastSoftwareConfiguration())[0];
    if (!model)
      model = await this.modelService.create({
        language: 'ES',
        brightness: 100,
      });
    return model;
  }

  private async getInstanceOr404(
    id: number,
    params?: SoftwareConfigurationRelation,
  ) {
    const instance: SoftwareConfigurationModel | null =
      await this.modelService.getById(id, params);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: SoftwareConfigurationRelation,
  ) {
    console.log(parseInt(id));
    return this.getInstanceOr404(+id, params);
  }

  @Get()
  list(@Query() params: SoftwareConfigurationPaginationDto) {
    return this.modelService.list(params);
  }

  @Post()
  async create(
    @Body() createSoftwareConfigurationDto: CreateSoftwareConfigurationDto,
  ) {
    const softwareConfigurationModel: SoftwareConfigurationModel =
      await this.modelService.create(createSoftwareConfigurationDto);
    if (!softwareConfigurationModel)
      throw new BadRequestException('Invalid softwareConfiguration!');
    return this.modelService.create(createSoftwareConfigurationDto);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateSoftwareConfigurationDto: UpdateSoftwareConfigurationDto,
  ) {
    return this.modelService.update(+id, updateSoftwareConfigurationDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: string) {
    return this.modelService.delete(+id);
  }
}
