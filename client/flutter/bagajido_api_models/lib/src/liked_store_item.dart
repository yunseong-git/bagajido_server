import 'package:freezed_annotation/freezed_annotation.dart';

part 'liked_store_item.freezed.dart';
part 'liked_store_item.g.dart';

/// `GET /users/me/liked-stores` — 배열 한 행
@freezed
class LikedStoreItem with _$LikedStoreItem {
  const factory LikedStoreItem({
    @JsonKey(name: 'store_id') required String storeId,
    required String name,
    required double longitude,
    required double latitude,
    @JsonKey(name: 'liked_at') required DateTime likedAt,
    @JsonKey(name: 'avg_value_score') String? avgValueScore,
    @JsonKey(name: 'review_count') int? reviewCount,
    @JsonKey(name: 'like_count') required int likeCount,
    @JsonKey(name: 'pick_count') required int pickCount,
  }) = _LikedStoreItem;

  factory LikedStoreItem.fromJson(Map<String, dynamic> json) =>
      _$LikedStoreItemFromJson(json);
}

List<LikedStoreItem> likedStoreItemListFromJson(List<dynamic> list) {
  return list
      .map(
        (e) => LikedStoreItem.fromJson(Map<String, dynamic>.from(e as Map)),
      )
      .toList();
}
