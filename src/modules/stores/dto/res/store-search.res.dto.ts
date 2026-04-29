import { ApiProperty } from '@nestjs/swagger';

export class StoreSearchResDto {
  @ApiProperty({ description: '상점 고유 ID' })
  id: string;

  @ApiProperty({ description: '상점 이름' })
  name: string;

  @ApiProperty({ description: '상점 주소' })
  address: string;

  @ApiProperty({ description: '가성비 평균 점수', nullable: true })
  avg_value_score: number | null;

  @ApiProperty({ description: '일반 리뷰 평점 (유저 별점)', nullable: true })
  avg_review_score: number | null;

  @ApiProperty({ description: '리뷰 개수' })
  review_count: number;

  @ApiProperty({ description: '좋아요 개수' })
  like_count: number;

  @ApiProperty({ description: '찜 개수' })
  pick_count: number;
}