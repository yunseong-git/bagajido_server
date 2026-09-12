import { ApiProperty } from '@nestjs/swagger';

import { MomentResponseDto } from './moment-response.dto';

export class MomentListResponseDto {
    @ApiProperty({ type: [MomentResponseDto] })
    items!: MomentResponseDto[];

    @ApiProperty()
    page!: number;

    @ApiProperty()
    limit!: number;

    @ApiProperty()
    total!: number;

    @ApiProperty()
    totalPages!: number;
}