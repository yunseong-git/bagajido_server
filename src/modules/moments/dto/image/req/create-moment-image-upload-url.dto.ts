import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, Max, Min } from 'class-validator';

export class CreateMomentImageUploadUrlDto {
    @ApiProperty({
        example: 'image/jpeg',
        enum: ['image/jpeg', 'image/png', 'image/webp'],
    })
    @IsIn(['image/jpeg', 'image/png', 'image/webp'])
    contentType!: string;

    @ApiProperty({
        example: 3145728,
        description: '파일 크기(byte)',
        minimum: 1,
        maximum: 20 * 1024 * 1024,
    })
    @IsInt()
    @Min(1)
    @Max(20 * 1024 * 1024)
    sizeBytes!: number;
}