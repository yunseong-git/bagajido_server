import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class FindReviewQueryDto {
  @ApiPropertyOptional({ description: '작성자 사용자 ID' })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({ description: '주문 ID' })
  @IsUUID()
  @IsOptional()
  order_id?: string;

  @ApiPropertyOptional({ description: '메뉴 ID' })
  @IsUUID()
  @IsOptional()
  menu_id?: string;

  @ApiPropertyOptional({ description: '삭제 리뷰 포함 여부', default: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  include_deleted?: boolean;
}
