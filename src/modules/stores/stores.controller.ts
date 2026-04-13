import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  @Get()
  @ApiOperation({ summary: '매장 목록 (Phase 1 스텁)' })
  listStub() {
    return { items: [] };
  }
}
