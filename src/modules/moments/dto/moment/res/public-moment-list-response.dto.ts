import { ApiProperty } from '@nestjs/swagger';

import { PublicMomentResponseDto } from './public-moment-response.dto';

export class PublicMomentListResponseDto {
    @ApiProperty({
        type: [PublicMomentResponseDto],
    })
    items!: PublicMomentResponseDto[];

    @ApiProperty()
    page!: number;

    @ApiProperty()
    limit!: number;

    @ApiProperty()
    total!: number;

    @ApiProperty()
    totalPages!: number;
}