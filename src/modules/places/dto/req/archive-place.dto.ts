import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ArchivePlaceDto {
    @ApiPropertyOptional({ example: '운영 종료' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    reason?: string;
}
