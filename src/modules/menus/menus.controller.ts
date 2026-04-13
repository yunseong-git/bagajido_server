import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('menus')
@Controller('menus')
export class MenusController {
  @Get()
  @ApiOperation({ summary: '메뉴 목록 (Phase 1 스텁)' })
  listStub() {
    return { items: [] };
  }
}
