import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoresService } from './stores.service';
import { FindStoresQueryDto } from './dto/find-store-query.dto';
import { FindStoreMapQueryDto } from './dto/find-store-map-query.dto';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) { }
  @Post()
  @ApiOperation({ summary: '매장 생성' })
  create(@Body() body: CreateStoreDto) {
    return this.storesService.createWithLngLat(body);
  }

  @Get('bounds')
  @ApiOperation({ summary: '지도 범위 내 매장 목록 조회' })
  async listWithinBounds(@Query() query: FindStoresQueryDto) {
    return await this.storesService.findWithinBounds(query);
  }

  @Get('map')
  @ApiOperation({ summary: '지도 클러스터링 데이터 조회' })
  async listMapItems(@Query() query: FindStoreMapQueryDto) {
    return await this.storesService.findMapItems(query);
  }

  @Get()
  @ApiOperation({ summary: '전체 매장 목록 조회' })
  async getAll() {
    return await this.storesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: '이름으로 매장 검색' })
  async search(@Query('name') name: string) {
    return await this.storesService.searchByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: '매장 상세 조회 (ID)' })
  async getOne(@Param('id') id: string) {
    return await this.storesService.findOne(id);
  }

  @Post(':storeId/likes')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '가게 좋아요' })
  async likeStore(
    @Req() req: Request & { user: { id: string } },
    @Param('storeId') storeId: string,
  ) {
    return await this.storesService.likeStore(req.user.id, storeId);
  }

  @Delete(':storeId/likes')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '가게 좋아요 해제' })
  async unlikeStore(
    @Req() req: Request & { user: { id: string } },
    @Param('storeId') storeId: string,
  ) {
    return await this.storesService.unlikeStore(req.user.id, storeId);
  }

  @Post(':storeId/picks')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '가게 찜하기' })
  async pickStore(
    @Req() req: Request & { user: { id: string } },
    @Param('storeId') storeId: string,
  ) {
    return await this.storesService.pickStore(req.user.id, storeId);
  }

  @Delete(':storeId/picks')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '가게 찜 해제' })
  async unpickStore(
    @Req() req: Request & { user: { id: string } },
    @Param('storeId') storeId: string,
  ) {
    return await this.storesService.unpickStore(req.user.id, storeId);
  }
}
