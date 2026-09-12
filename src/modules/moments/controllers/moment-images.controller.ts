import {
    Body,
    Controller,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUserEntity } from '../../users/decorators/current-user.decorator';
import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';
import type { CurrentUser } from '../../users/types/current-user.type';

import { MomentImagesService } from '../services/moment-images.service';

import { CreateMomentImageUploadUrlDto } from '../dto/image/req/create-moment-image-upload-url.dto';
import type { MomentImageUploadUrlResponseDto } from '../dto/image/res/moment-image-upload-url-response.dto';
import { MomentImageUploadUrlsResponseDto } from '../dto/image/res/moment-image-upload-urls-response.dto';
import { CreateMomentImageUploadUrlsDto } from '../dto/image/req/create-moment-image-upload-urls.dto';
import { MomentImageListResponseDto } from '../dto/image/res/moment-image-list-response.dto';
import { CompleteMomentImagesDto } from '../dto/image/req/complete-moment-images.dto';
import { UpdateMomentImageOrderDto } from '../dto/image/req/update-moment-image-order.dto';

@ApiTags('Moment Images')
@ApiBearerAuth()
@UseGuards(RegisteredUserGuard)
@Controller('moments/:momentId/images')
export class MomentImagesController {
    constructor(private readonly momentImagesService: MomentImagesService) { }

    /**이미 업로드한 image 조회 과정 */

    @Get()
    @ApiOperation({ summary: '내 Moment 이미지 목록 조회' })
    getMyImages(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
    ): Promise<MomentImageListResponseDto> {
        return this.momentImagesService.getMyImages(user.id, momentId);
    }

     /**image 등록 과정 */

    @Post('upload-url')
    @ApiOperation({ summary: 'Moment 단일 이미지 R2 업로드 URL 발급(추후 삭제 예정)' })
    createUploadUrl(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Body() dto: CreateMomentImageUploadUrlDto,
    ): Promise<MomentImageUploadUrlResponseDto> {
        return this.momentImagesService.createUploadUrl(user.id, momentId, dto);
    }

    @Post('upload-urls')
    @ApiOperation({ summary: 'Moment 이미지 R2 업로드 URL 일괄 발급' })
    createUploadUrls(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Body() dto: CreateMomentImageUploadUrlsDto,
    ): Promise<MomentImageUploadUrlsResponseDto> {
        return this.momentImagesService.createUploadUrls(user.id, momentId, dto);
    }

    @Post()
    @ApiOperation({ summary: 'R2 업로드 완료 이미지 Moment에 등록' })
    completeImages(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Body() dto: CompleteMomentImagesDto,
    ): Promise<MomentImageListResponseDto> {
        return this.momentImagesService.completeImages(user.id, momentId, dto);
    }

    /**이미 업로드한 image 관리 과정 */

    @Patch('order')
    @ApiOperation({ summary: 'Moment 이미지 순서 변경', })
    updateImageOrder(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Body() dto: UpdateMomentImageOrderDto,
    ): Promise<MomentImageListResponseDto> {
        return this.momentImagesService.updateImageOrder(
            user.id,
            momentId,
            dto,
        );
    }

    @Delete(':imageId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Moment 이미지 삭제' })
    deleteImage(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Param('imageId', new ParseUUIDPipe()) imageId: string,
    ): Promise<void> {
        return this.momentImagesService.deleteImage(
            user.id,
            momentId,
            imageId,
        );
    }
}