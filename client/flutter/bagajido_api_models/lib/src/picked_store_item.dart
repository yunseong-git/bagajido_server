import 'package:freezed_annotation/freezed_annotation.dart';

part 'picked_store_item.freezed.dart';
part 'picked_store_item.g.dart';

/// `GET /users/me/picked-stores` — 배열 한 행
@freezed
class PickedStoreItem with _$PickedStoreItem {
  const factory PickedStoreItem({
    @JsonKey(name: 'store_id') required String storeId,
    required String name,
    required double longitude,
    required double latitude,
    @JsonKey(name: 'picked_at') required DateTime pickedAt,
    @JsonKey(name: 'avg_value_score') String? avgValueScore,
    @JsonKey(name: 'review_count') int? reviewCount,
    @JsonKey(name: 'like_count') required int likeCount,
    @JsonKey(name: 'pick_count') required int pickCount,
  }) = _PickedStoreItem;

  factory PickedStoreItem.fromJson(Map<String, dynamic> json) =>
      _$PickedStoreItemFromJson(json);
}

List<PickedStoreItem> pickedStoreItemListFromJson(List<dynamic> list) {
  return list
      .map(
        (e) => PickedStoreItem.fromJson(Map<String, dynamic>.from(e as Map)),
      )
      .toList();
}
