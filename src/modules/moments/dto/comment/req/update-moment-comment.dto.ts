import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMomentCommentDto {
    @ApiPropertyOptional({
        example: '수정된 댓글입니다.',
        maxLength: 1000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content?: string;

    @ApiPropertyOptional({
        example: 'ko',
        maxLength: 10,
    })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    languageCode?: string;
}