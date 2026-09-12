import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsIn,
    IsInt,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

export class MomentImageUploadFileDto {
    @ApiProperty({
        example: 'image/jpeg',
        enum: ['image/jpeg', 'image/png', 'image/webp'],
    })
    @IsIn(['image/jpeg', 'image/png', 'image/webp'])
    contentType!: string;

    @ApiProperty({
        example: 3145728,
    })
    @IsInt()
    @Min(1)
    @Max(20 * 1024 * 1024)
    sizeBytes!: number;
}

export class CreateMomentImageUploadUrlsDto {
    @ApiProperty({
        type: [MomentImageUploadFileDto],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @ValidateNested({ each: true })
    @Type(() => MomentImageUploadFileDto)
    files!: MomentImageUploadFileDto[];
}