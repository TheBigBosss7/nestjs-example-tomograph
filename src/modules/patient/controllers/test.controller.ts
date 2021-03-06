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
import { TestService } from '../services';
import {
  CreateTestDto,
  TestPaginationDto,
  TestRelation,
  UpdateTestDto,
} from '../dto';
import { PatientPosition } from '@prisma/client';
import { arrayInclination } from '../dto/test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly modelService: TestService) {}

  private async getInstanceOr404(id: number, params?: TestRelation) {
    const instance = await this.modelService.getById(id, params);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get()
  list(@Query() params: TestPaginationDto) {
    return this.modelService.list(params);
  }

  @Get('positions')
  getListPosition() {
    return PatientPosition;
  }

  @Get('inclinations')
  getInclination() {
    return arrayInclination;
  }

  @Get(':id')
  get(
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: TestRelation,
  ) {
    return this.getInstanceOr404(+id, params);
  }

  @Post()
  async create(@Body() createTestDto: CreateTestDto) {
    const { inclination, position } = createTestDto;
    this.validateTest(inclination, position);
    const testModel = await this.modelService.create(createTestDto);
    if (!testModel) throw new BadRequestException('Invalid test!');
    return testModel;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    const { inclination, position } = updateTestDto;
    this.validateTest(inclination, position);
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateTestDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: string) {
    return this.modelService.delete(+id);
  }

  private validateTest(inclination: number, position: PatientPosition) {
    let message: string | undefined;
    if (
      position === PatientPosition.SENTADO &&
      ![90, 120].includes(inclination)
    )
      message =
        'If the patient is siting down, then the Inclination must be only one of the followings: 90 or 120';

    if (
      (position === PatientPosition.DECUBITO_SUPINO ||
        position === PatientPosition.LATERAL_IZQUIERDO) &&
      ![-20, 0, 20, 30, 45].includes(inclination)
    )
      message =
        'If the patient is facing up or on the left side, then the inclination must be only one of the followings: -20, 0, 20, 30 or 45';

    if (
      position === PatientPosition.DECUBITO_PRONO &&
      ![-20, 0].includes(inclination)
    )
      message =
        'If the patient is facing down, then the inclination must be only one of the followings: -20 or 0';

    if (position === PatientPosition.DE_PIE && ![90].includes(inclination))
      message =
        'If the patient is standing up, then the inclination must be only: -90';

    if (
      position === PatientPosition.LATERAL_DERECHO &&
      ![-20, 0, 20].includes(inclination)
    )
      message =
        'If the patient is on his/her right side, then the inclination must be only one of the followings: -20, 0 or 20';

    if (message) throw new BadRequestException(message);
  }
}
