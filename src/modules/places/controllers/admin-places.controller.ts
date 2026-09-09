import { Body, Controller, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { Roles } from '../../users/decorators/roles.decorator';
import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';
import { RolesGuard } from '../../users/guards/roles.guard';

import { ArchivePlaceDto } from '../dto/req/archive-place.dto';
import { CreateExternalSourceDto } from '../dto/req/create-external-source.dto';
import { CreatePlaceCategoryDto } from '../dto/req/create-place-category.dto';
import { CreatePlaceDto } from '../dto/req/create-place.dto';
import { UpdatePlaceDto } from '../dto/req/update-place.dto';

import { PlacesCommandService } from '../services/places-command.service';

@ApiTags('admin-places')
@ApiBearerAuth('access-token')
@UseGuards(RegisteredUserGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/places')
export class AdminPlacesController {
    constructor(private readonly placesCommandService: PlacesCommandService) {}

    @Post()
    @ApiOperation({ summary: '장소 생성' })
    createPlace(@Body() dto: CreatePlaceDto) {
        return this.placesCommandService.createPlace(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: '장소 수정' })
    updatePlace(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdatePlaceDto) {
        return this.placesCommandService.updatePlace(id, dto);
    }

    @Post(':id/archive')
    archivePlace(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: ArchivePlaceDto) {
        return this.placesCommandService.archivePlace(id, dto);
    }

    @Post(':id/restore')
    restorePlace(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.placesCommandService.restorePlace(id);
    }

    @Post(':id/external-sources')
    addExternalSource(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: CreateExternalSourceDto,
    ) {
        return this.placesCommandService.addExternalSource(id, dto);
    }

    @Post('categories')
    createCategory(@Body() dto: CreatePlaceCategoryDto) {
        return this.placesCommandService.createCategory(dto);
    }
}
