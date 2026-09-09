import { Transform } from 'class-transformer';
import {
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateUserDto {
    //username(닉네임)을 영문 소문자/숫자/underscore로 제한 -> 나중에 골뱅이 검색 의도
    @ApiProperty({
        example: 'yunseong',
        minLength: 3,
        maxLength: 30,
    })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim().toLowerCase()
            : value,
    )
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @Matches(/^[a-z0-9_]+$/, {
        message:
            'username must contain only lowercase letters, numbers, and underscores',
    })
    username!: string;

    @ApiProperty({
        example: '윤성',
        maxLength: 50,
    })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim()
            : value,
    )
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    displayName!: string;

    @ApiPropertyOptional({
        example: '한국 여기저기를 돌아다니고 있습니다.',
        maxLength: 500,
    })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim()
            : value,
    )
    @IsString()
    @MaxLength(500)
    bio?: string;

    @ApiPropertyOptional({
        example: 'KR',
    })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim().toUpperCase()
            : value,
    )
    @Matches(/^[A-Z]{2}$/)
    nationalityCode?: string;

    @ApiPropertyOptional({
        example: 'KR',
    })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim().toUpperCase()
            : value,
    )
    @Matches(/^[A-Z]{2}$/)
    residenceCountryCode?: string;

    @ApiPropertyOptional({
        example: 'ko-KR',
        default: 'ko-KR',
    })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    @Matches(
        /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/,
    )
    preferredLocale?: string;
}