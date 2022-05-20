import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventService } from '../services';
import { CreateEventDto, UpdateEventDto } from '../dto';
import { event as EventModel } from '@prisma/client';

type CreateData = CreateEventDto;
type UpdateData = UpdateEventDto;

@Controller('event')
export class EventController {
  constructor(private readonly modelService: EventService) {}

  private async getInstanceOr404(id: number): Promise<EventModel> {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<EventModel | null> {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(): Promise<EventModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createEventDto: CreateData): Promise<EventModel> {
    const eventModel: EventModel = await this.modelService.create(
      createEventDto,
    );
    if (!eventModel) throw new BadRequestException('Invalid event!');
    return this.modelService.create(createEventDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateData,
  ): Promise<EventModel> {
    return this.modelService.update(+id, updateEventDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<EventModel> {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.delete(+id);
  }
}
