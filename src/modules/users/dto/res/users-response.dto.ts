import { ApiProperty } from '@nestjs/swagger';

export class UserEntityResponseDto {
  @ApiProperty({ example: 'cfb7a63f-9f78-4a9b-a7cc-c53bfefc1b5d' })
  id!: string;

  @ApiProperty({ example: 'USER' })
  role!: string;
}

export class UserProfileResponseDto {
  @ApiProperty({ type: UserEntityResponseDto })
  user!: UserEntityResponseDto;
}

export class UserStoreListItemResponseDto {
  @ApiProperty({ example: 'place_12345' })
  place_id!: string;

  @ApiProperty({ example: '바가지도 맛집' })
  name!: string;
}
