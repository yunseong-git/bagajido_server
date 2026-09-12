import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsUUID,
} from 'class-validator';

export class UpdateMomentImageOrderDto {
    @ApiProperty({
        type: [String],
        example: [
            '11111111-1111-4111-8111-111111111111',
            '22222222-2222-4222-8222-222222222222',
        ],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @IsUUID('4', { each: true })
    imageIds!: string[];
}