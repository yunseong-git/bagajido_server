import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsString, MaxLength } from 'class-validator';

export class FindStoreMetricsByIdsDto {
  @ApiProperty({
    type: [String],
    description: '조회할 매장 place_id 목록',
    example: ['id1', 'id2', 'id3'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(500)
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  place_ids!: string[];
}
