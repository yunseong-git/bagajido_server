import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FollowUserResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    username!: string;

    @ApiProperty()
    displayName!: string;

    @ApiPropertyOptional()
    profileImageKey!: string | null;

    @ApiProperty()
    followedAt!: Date;
}