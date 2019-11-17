import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CreateCatDto } from './dto'

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This should return all cats';
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get(':id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
  }
}
