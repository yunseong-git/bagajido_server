import { ApiProperty } from '@nestjs/swagger';

export class StoreSummaryResponseDto {
  @ApiProperty({ example: 'place_12345' })
  place_id!: string;

  @ApiProperty({ example: '바가지도 맛집' })
  name!: string;

  @ApiProperty({ example: '한식', required: false, nullable: true })
  category?: string | null;
}

export class StoreActionResponseDto {
  @ApiProperty({ example: true })
  ok!: boolean;
}

export class OwnerNoteResponseDto {
  @ApiProperty({ example: 'place_12345' })
  place_id!: string;

  @ApiProperty({ example: 'owner-uuid' })
  owner_id!: string;

  @ApiProperty({ example: '오늘은 재료 조기 소진' })
  note!: string;

  @ApiProperty({ example: 'RequireOwner() 인가 통과 예시' })
  message!: string;
}

export class AdminOnlyResponseDto {
  @ApiProperty({ example: 'place_12345' })
  place_id!: string;

  @ApiProperty({ example: 'Roles(ADMIN) 인가 통과 예시' })
  message!: string;
}
