import 'package:freezed_annotation/freezed_annotation.dart';

part 'store_map_item.freezed.dart';
part 'store_map_item.g.dart';

/// `GET /stores/map` — 아이템(클러스터 1그룹 1row + 단일 가게 1row).
@freezed
class StoreMapItem with _$StoreMapItem {
  const factory StoreMapItem({
    /// `"cluster"` | `"store"`
    required String type,
    @JsonKey(name: 'store_id') String? storeId,
    String? name,
    required double longitude,
    required double latitude,
    /// 클러스터면 2 이상, 단일 매장 셀이면 1
    required int count,
    @JsonKey(name: 'avg_value_score') String? avgValueScore,
    @JsonKey(name: 'review_count') int? reviewCount,
    @JsonKey(name: 'like_count') int? likeCount,
    @JsonKey(name: 'pick_count') int? pickCount,
  }) = _StoreMapItem;

  factory StoreMapItem.fromJson(Map<String, dynamic> json) => _$StoreMapItemFromJson(json);
}

/// 응답 body가 `List<dynamic>`일 때(프레픽스 없이 배열만 옴).
List<StoreMapItem> storeMapItemListFromJson(List<dynamic> list) {
  return list
      .map(
        (e) => StoreMapItem.fromJson(Map<String, dynamic>.from(e as Map)),
      )
      .toList();
}

extension StoreMapItemX on StoreMapItem {
  bool get isCluster => type == 'cluster' && count > 1;
  bool get isSingleStoreMarker => type == 'store' && count == 1;
}
