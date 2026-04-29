import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '../auth/types/user-role.type';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoresService } from './stores.service';
import { FindStoreMetricsByIdsDto } from './dto/find-store-metrics-by-ids.dto';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequireOwner } from '../auth/decorators/require-owner.decorator';
import {
  AdminOnlyResponseDto,
  OwnerNoteResponseDto,
  StoreActionResponseDto,
  StoreSummaryResponseDto,
} from './dto/res/stores-response.dto';
import {
  MockSeedResponseDto,
  StoreMetricsListResponseDto,
  StoreWithDetailResponseDto,
} from './dto/res/store-with-detail.res.dto';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) { }
  @Post()
  @ApiOperation({ summary: '매장 생성' })
  @ApiCreatedResponse({ type: StoreSummaryResponseDto })
  create(@Body() body: CreateStoreDto) {
    return this.storesService.createWithLngLat(body);
  }

  @Get()
  @ApiOperation({
    summary:
      '전체 매장 목록 (각 항목: store=`stores`, store_detail=`store_details`)',
  })
  @ApiOkResponse({ type: [StoreWithDetailResponseDto] })
  async getAll() {
    return await this.storesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: '이름으로 매장 검색' })
  @ApiOkResponse({ type: [StoreSummaryResponseDto] })
  async search(@Query('name') name: string) {
    return await this.storesService.searchByName(name);
  }

  @Get('metrics')
  @ApiOperation({
    summary: '매장 통계·요약 목록 (`stores` 테이블 컬럼, 구 store_stats 대체)',
  })
  @ApiOkResponse({ type: StoreMetricsListResponseDto })
  async listMetrics() {
    const items = await this.storesService.findMetricsFromStores();
    return { items };
  }

  @Post('metrics/by-ids')
  @ApiOperation({ summary: 'place_id 목록으로 매장 metrics 조회' })
  @ApiOkResponse({ type: StoreMetricsListResponseDto })
  async listMetricsByIds(@Body() body: FindStoreMetricsByIdsDto) {
    const items = await this.storesService.findMetricsByPlaceIds(body.place_ids);
    return { items };
  }

  @Post('dev/seed-mock')
  @ApiOperation({
    summary:
      '개발용 목업 매장 삽입 (stores + store_details). production 에서는 403',
  })
  @ApiOkResponse({ type: MockSeedResponseDto })
  async seedMock() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('mock_seed_disabled_in_production');
    }
    return await this.storesService.seedMockStores();
  }

  @Get(':id')
  @ApiOperation({
    summary: '매장 상세 (store: `stores` 요약·통계 + store_detail: `store_details`)',
  })
  @ApiOkResponse({ type: StoreWithDetailResponseDto })
  async getOne(@Param('id') id: string) {
    return await this.storesService.findOne(id);
  }

  @Post(':storeId/likes')
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '가게 좋아요' })
  @ApiCreatedResponse({ type: StoreActionResponseDto })
  async likeStore(
    @Req() req: Request & { userEntity: { id: string } },
    @Param('storeId') storeId: string,
  ) {
    return await this.storesService.likeStore(req.userEntity.id, storeId);
  }

  @Delete(':storeId/likes')
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '가게 좋아요 해제' })
  @ApiOkResponse({ type: StoreActionResponseDto })
  async unlikeStore(
    @Req() req: Request & { userEntity: { id: string } },
    @Param('storeId') storeId: string,
  ) {
    return await this.storesService.unlikeStore(req.userEntity.id, storeId);
  }

  @Post(':storeId/picks')
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '가게 찜하기' })
  @ApiCreatedResponse({ type: StoreActionResponseDto })
  async pickStore(
    @Req() req: Request & { userEntity: { id: string } },
    @Param('storeId') storeId: string,
  ) {
    return await this.storesService.pickStore(req.userEntity.id, storeId);
  }

  @Delete(':storeId/picks')
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '가게 찜 해제' })
  @ApiOkResponse({ type: StoreActionResponseDto })
  async unpickStore(
    @Req() req: Request & { userEntity: { id: string } },
    @Param('storeId') storeId: string,
  ) {
    return await this.storesService.unpickStore(req.userEntity.id, storeId);
  }

  @Post(':storeId/owner-note')
  @UseGuards(JwtAccessAuthGuard)
  @RequireOwner()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '오너 전용 메모 작성 예시' })
  @ApiOkResponse({ type: OwnerNoteResponseDto })
  ownerOnlyExample(
    @Req() req: Request & { owner: { id: string } },
    @Param('storeId') storeId: string,
    @Body('note') note?: string,
  ) {
    return {
      place_id: storeId,
      owner_id: req.owner.id,
      note: note ?? '',
      message: 'RequireOwner() 인가 통과 예시',
    };
  }

  @Delete(':storeId/admin-only')
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '관리자 전용 예시 API' })
  @ApiOkResponse({ type: AdminOnlyResponseDto })
  adminOnlyExample(@Param('storeId') storeId: string) {
    return { place_id: storeId, message: 'Roles(ADMIN) 인가 통과 예시' };
  }
}
