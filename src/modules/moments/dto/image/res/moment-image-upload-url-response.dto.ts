import { ApiProperty } from '@nestjs/swagger';

export class MomentImageUploadUrlResponseDto {
    @ApiProperty()
    objectKey!: string;

    @ApiProperty()
    uploadUrl!: string;

    @ApiProperty({
        example: 300,
        description: 'Presigned URL 유효시간(초)',
    })
    expiresIn!: number;
}