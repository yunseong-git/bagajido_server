import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMomentCommentDto {
    @ApiProperty({
        example: '사진 분위기 진짜 좋네요!',
        maxLength: 1000,
    })
    @IsString()
    @MaxLength(1000)
    content!: string;

    @ApiPropertyOptional({
        example: 'ko',
        maxLength: 10,
    })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    languageCode?: string;

    @ApiPropertyOptional({
        description: '답글 대상 댓글 ID. 최상위 댓글이면 생략',
    })
    @IsOptional()
    @IsUUID()
    parentId?: string;
}