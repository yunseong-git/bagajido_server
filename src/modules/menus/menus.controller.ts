import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { CreateMenuDto } from './dto/create-menu.dto';
import { FindMenuQueryDto } from './dto/find-menu-query.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenusService } from './menus.service';

@ApiTags('menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '메뉴 생성' })
  create(@Body() body: CreateMenuDto) {
    return this.menusService.create(body);
  }

  @Patch(':menuId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '메뉴 수정' })
  update(@Param('menuId') menuId: string, @Body() body: UpdateMenuDto) {
    return this.menusService.update(menuId, body);
  }

  @Get(':menuId')
  @ApiOperation({ summary: '메뉴 단건 조회' })
  findOne(@Param('menuId') menuId: string) {
    return this.menusService.findOne(menuId);
  }

  @Get()
  @ApiOperation({ summary: '메뉴 목록 조회' })
  list(@Query() query: FindMenuQueryDto) {
    return this.menusService.findMany(query);
  }
}
