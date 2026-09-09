import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator';

export class CreatePlaceCategoryDto {
    // key는 사람이 보는 이름이 아니라 프로그램 내부 식별자
    @ApiProperty({ example: 'RESTAURANT' })
    @IsString()
    @MaxLength(50)
    @Matches(/^[A-Z0-9_]+$/)
    key!: string;

    @ApiProperty({ example: '음식점' })
    @IsString()
    @MaxLength(100)
    nameKo!: string;

    @ApiPropertyOptional({ example: 'Restaurant' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    nameEn?: string;

    @ApiPropertyOptional({ format: 'uuid', nullable: true })
    @IsOptional()
    @IsUUID()
    parentId?: string;
}
