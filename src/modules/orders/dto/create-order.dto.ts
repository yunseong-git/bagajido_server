import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateOrderItemDto {
  @ApiProperty({ description: '메뉴 ID' })
  @IsUUID()
  menu_id: string;

  @ApiProperty({ description: '수량' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: '단가' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unit_price: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: '매장 place_id' })
  @IsString()
  @MaxLength(255)
  place_id: string;

  @ApiProperty({ description: '총 주문 금액' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total_amount: number;

  @ApiProperty({ description: '통화 코드', example: 'KRW' })
  @IsString()
  @MaxLength(8)
  currency: string;

  @ApiProperty({ description: '결제 상태', example: 'pending' })
  @IsString()
  @MaxLength(32)
  payment_status: string;

  @ApiPropertyOptional({ description: '외부 결제 식별자' })
  @IsString()
  @MaxLength(128)
  @IsOptional()
  external_payment_id?: string;

  @ApiProperty({ type: [CreateOrderItemDto], description: '주문 항목 목록' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
