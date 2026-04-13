import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('store-stats')
@Controller('store-stats')
export class StoreStatsController {
  @Get()
  @ApiOperation({ summary: '매장 통계 (Phase 1 스텁)' })
  listStub() {
    return { items: [] };
  }
}
