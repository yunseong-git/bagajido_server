import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '../auth/types/user-role.type';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrderQueryDto } from './dto/find-order-query.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { OrderResponseDto } from './dto/res/orders-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: '주문 생성' })
  @ApiCreatedResponse({ type: OrderResponseDto })
  create(@Req() req: Request & { userEntity: { id: string } }, @Body() body: CreateOrderDto) {
    return this.ordersService.create(req.userEntity.id, body);
  }

  @Patch(':orderId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '주문 수정' })
  @ApiOkResponse({ type: OrderResponseDto })
  update(@Param('orderId') orderId: string, @Body() body: UpdateOrderDto) {
    return this.ordersService.update(orderId, body);
  }

  @Get(':orderId')
  @ApiOperation({ summary: '주문 단건 조회' })
  @ApiOkResponse({ type: OrderResponseDto })
  findOne(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(orderId);
  }

  @Get()
  @ApiOperation({ summary: '주문 목록 조회' })
  @ApiOkResponse({ type: [OrderResponseDto] })
  list(@Query() query: FindOrderQueryDto) {
    return this.ordersService.findMany(query);
  }
}
