import { ApiProperty } from '@nestjs/swagger';

import { MomentCommentResponseDto } from './moment-comment-response.dto';

export class MomentCommentListResponseDto {
    @ApiProperty({ type: [MomentCommentResponseDto] })
    items!: MomentCommentResponseDto[];
}