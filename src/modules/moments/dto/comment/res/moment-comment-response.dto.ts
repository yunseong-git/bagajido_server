import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MomentCommentUserResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    username!: string;

    @ApiProperty()
    displayName!: string;

    @ApiPropertyOptional()
    profileImageKey!: string | null;
}

export class MomentCommentResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    momentId!: string;

    @ApiPropertyOptional()
    parentId!: string | null;

    @ApiPropertyOptional()
    content!: string | null;

    @ApiPropertyOptional()
    languageCode!: string | null;

    @ApiProperty()
    isDeleted!: boolean;

    @ApiProperty({
        type: MomentCommentUserResponseDto,
    })
    user!: MomentCommentUserResponseDto;

    @ApiPropertyOptional()
    editedAt!: Date | null;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}