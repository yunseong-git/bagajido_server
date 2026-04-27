import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoreStatsListResponseDto } from './dto/res/store-stats-response.dto';

@ApiTags('store-stats')
@Controller('store-stats')
export class StoreStatsController {
  @Get()
  @ApiOperation({ summary: '매장 통계 (Phase 1 스텁)' })
  @ApiOkResponse({ type: StoreStatsListResponseDto })
  listStub() {
    return { items: [] };
  }
}
