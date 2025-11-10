import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PetsService } from './pets.service';

@Controller('pets')
@UseGuards(AuthGuard('jwt'))
export class PetsController {
  constructor(private petsService: PetsService) {}

  @Post()
  create(@Body() petData: any, @Request() req: any) {
    return this.petsService.create(petData, req.user.userId);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.petsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() petData: any) {
    return this.petsService.update(id, petData);
  }

  @Put(':id/lost')
  markAsLost(@Param('id') id: string) {
    return this.petsService.markAsLost(id);
  }
}
