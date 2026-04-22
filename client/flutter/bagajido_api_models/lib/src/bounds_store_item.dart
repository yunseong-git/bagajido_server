import 'package:freezed_annotation/freezed_annotation.dart';

part 'bounds_store_item.freezed.dart';
part 'bounds_store_item.g.dart';

/// `GET /stores/bounds` — raw row 한 덩어리(배열 요소)
@freezed
class BoundsStoreItem with _$BoundsStoreItem {
  const factory BoundsStoreItem({
    required String id,
    required String name,
    required double longitude,
    required double latitude,
    @JsonKey(name: 'avg_value_score') String? avgValueScore,
    @JsonKey(name: 'review_count') int? reviewCount,
    @JsonKey(name: 'like_count') required int likeCount,
    @JsonKey(name: 'pick_count') required int pickCount,
  }) = _BoundsStoreItem;

  factory BoundsStoreItem.fromJson(Map<String, dynamic> json) => _$BoundsStoreItemFromJson(json);
}

List<BoundsStoreItem> boundsStoreItemListFromJson(List<dynamic> list) {
  return list
      .map(
        (e) => BoundsStoreItem.fromJson(Map<String, dynamic>.from(e as Map)),
      )
      .toList();
}
