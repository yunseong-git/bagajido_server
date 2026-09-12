import { ApiProperty } from '@nestjs/swagger';

export class MomentImageUploadItemDto {
    @ApiProperty()
    objectKey!: string;

    @ApiProperty()
    uploadUrl!: string;
}

export class MomentImageUploadUrlsResponseDto {
    @ApiProperty({
        type: [MomentImageUploadItemDto],
    })
    items!: MomentImageUploadItemDto[];

    @ApiProperty({
        example: 300,
    })
    expiresIn!: number;
}