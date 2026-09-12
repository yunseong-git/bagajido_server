import { ApiProperty } from '@nestjs/swagger';

import { MomentImageResponseDto } from './moment-image-response.dto';

export class MomentImageListResponseDto {
    @ApiProperty({
        type: [MomentImageResponseDto],
    })
    items!: MomentImageResponseDto[];
}