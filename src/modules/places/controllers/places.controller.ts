import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Query,
  } from '@nestjs/common';
  
  import {
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
  
  import { GetPlaceListDto } from '../dto/req/get-place-list.dto';
  
  import { PlacesQueryService } from '../services/places-query.service';
  
  @ApiTags('places')
  @Controller('places')
  export class PlacesController {
    constructor(
      private readonly placesQueryService:
        PlacesQueryService,
    ) {}
  
    @Get('categories')
    @ApiOperation({
      summary: '장소 카테고리 목록 조회',
    })
    getCategories() {
      return this.placesQueryService
        .getCategories();
    }
  
    @Get()
    @ApiOperation({
      summary: '장소 목록 조회',
    })
    getPlaces(
      @Query()
      dto: GetPlaceListDto,
    ) {
      return this.placesQueryService
        .getPlaces(dto);
    }
  
    @Get(':id')
    @ApiOperation({
      summary: '장소 상세 조회',
    })
    getPlace(
      @Param(
        'id',
        new ParseUUIDPipe(),
      )
      id: string,
    ) {
      return this.placesQueryService
        .getPlace(id);
    }
  }