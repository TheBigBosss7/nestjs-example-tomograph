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
import { EventService } from '../services';
import {
  CreateEventDto,
  EventPaginationDto,
  EventRelation,
  UpdateEventDto,
} from '../dto';
import { event as EventModel } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

type CreateData = CreateEventDto;
type UpdateData = UpdateEventDto;

@Controller('event')
export class EventController {
  constructor(private readonly modelService: EventService) {}

  private async getInstanceOr404(
    id: number,
    params?: EventRelation,
  ): Promise<EventModel> {
    const instance = await this.modelService.getById(id, params);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: EventPaginationDto,
  ): Promise<EventModel | null> {
    return this.getInstanceOr404(+id, params);
  }

  @Get()
  list(
    @Query() params: EventPaginationDto,
  ): Promise<WithPagination<EventModel>> {
    return this.modelService.list(params);
  }

  @Get('event/eventType')
  listByEventType(
    @Query() params: EventPaginationDto,
  ): Promise<WithPagination<EventModel>> {
    return this.modelService.list(params);
  }

  @Post()
  async create(@Body() createEventDto: CreateData): Promise<EventModel> {
    const eventModel: EventModel = await this.modelService.create(
      createEventDto,
    );
    if (!eventModel) throw new BadRequestException('Invalid event!');
    return eventModel;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateEventDto: UpdateData,
  ): Promise<EventModel> {
    return this.modelService.update(+id, updateEventDto);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<EventModel> {
    return this.modelService.delete(+id);
  }
}
