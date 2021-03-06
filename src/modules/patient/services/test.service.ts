import { Injectable } from '@nestjs/common';
import {
  CreateTestDto,
  TestPaginationDto,
  TestRelation,
  UpdateTestDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { test } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  get test() {
    return this.prisma.test;
  }

  getById(id: number, params?: TestRelation): Promise<test | null> {
    return this.test.findUnique({ where: { id }, ...params });
  }

  async list(params: TestPaginationDto): Promise<WithPagination<test>> {
    const {
      orderBy,
      where,
      inclination,
      patientId,
      peep,
      position,
      ...otherParams
    } = params;

    const data: test[] = await this.test.findMany({
      ...otherParams,
      where: {
        inclination,
        patientId,
        peep,
        position,
      },
      orderBy: { updatedAt: orderBy },
    });
    const count: number = await this.test.count(where);

    return { count, data };
  }

  count() {
    return this.test.count();
  }

  create(createTestDto: CreateTestDto): Promise<test> {
    return this.test.create({
      data: createTestDto,
    });
  }

  async update(id: number, updateTestDto: UpdateTestDto): Promise<test> {
    return this.test.update({
      where: { id },
      data: updateTestDto,
    });
  }

  delete(id: number): Promise<test> {
    return this.test.delete({ where: { id } });
  }
}
