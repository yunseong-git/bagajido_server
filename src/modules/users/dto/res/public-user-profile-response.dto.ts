import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicUserProfileResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    username!: string;

    @ApiProperty()
    displayName!: string;

    @ApiPropertyOptional()
    profileImageKey!: string | null;

    @ApiProperty()
    followerCount!: number;

    @ApiProperty()
    followingCount!: number;

    @ApiProperty()
    publicMomentCount!: number;
}