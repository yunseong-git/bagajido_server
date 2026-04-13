import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  @Get()
  @ApiOperation({ summary: '주문 목록 (Phase 1 스텁)' })
  listStub() {
    return { items: [] };
  }
}
