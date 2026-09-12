import { ApiProperty } from '@nestjs/swagger';

import { FollowUserResponseDto } from './follow-user-response.dto';

export class FollowUserListResponseDto {
    @ApiProperty({
        type: [FollowUserResponseDto],
    })
    items!: FollowUserResponseDto[];

    @ApiProperty()
    page!: number;

    @ApiProperty()
    limit!: number;

    @ApiProperty()
    total!: number;

    @ApiProperty()
    totalPages!: number;
}