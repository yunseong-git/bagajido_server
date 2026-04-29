import { IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'ChIJ...', description: '외부 API place_id' })
  @IsString()
  @MaxLength(255)
  place_id: string;

  @ApiProperty({ example: 'b5a1...' })
  @IsUUID()
  owner_id: string;

  @ApiProperty({ example: '바가지 없는 떡볶이집' })
  @IsString()
  name: string;

  @ApiProperty({ example: 127.0276 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 37.4979 })
  @IsNumber()
  latitude: number;
}
