import 'package:freezed_annotation/freezed_annotation.dart';

part 'requests.freezed.dart';
part 'requests.g.dart';

// --- 쿼리(주소창) — GET 시 null 필드는 제외

@freezed
class FindMenuQuery with _$FindMenuQuery {
  @JsonSerializable(includeIfNull: false)
  const factory FindMenuQuery({
    @JsonKey(name: 'store_id') String? storeId,
  }) = _FindMenuQuery;

  factory FindMenuQuery.fromJson(Map<String, dynamic> json) => _$FindMenuQueryFromJson(json);
}

@freezed
class FindOrderQuery with _$FindOrderQuery {
  @JsonSerializable(includeIfNull: false)
  const factory FindOrderQuery({
    @JsonKey(name: 'user_id') String? userId,
    @JsonKey(name: 'store_id') String? storeId,
  }) = _FindOrderQuery;

  factory FindOrderQuery.fromJson(Map<String, dynamic> json) => _$FindOrderQueryFromJson(json);
}

@freezed
class FindReviewQuery with _$FindReviewQuery {
  @JsonSerializable(includeIfNull: false)
  const factory FindReviewQuery({
    @JsonKey(name: 'user_id') String? userId,
    @JsonKey(name: 'order_id') String? orderId,
    @JsonKey(name: 'menu_id') String? menuId,
    @JsonKey(name: 'include_deleted') bool? includeDeleted,
  }) = _FindReviewQuery;

  factory FindReviewQuery.fromJson(Map<String, dynamic> json) => _$FindReviewQueryFromJson(json);
}

@freezed
class FindStoreMapQuery with _$FindStoreMapQuery {
  const factory FindStoreMapQuery({
    required double xmin,
    required double ymin,
    required double xmax,
    required double ymax,
    required int zoom,
  }) = _FindStoreMapQuery;

  factory FindStoreMapQuery.fromJson(Map<String, dynamic> json) => _$FindStoreMapQueryFromJson(json);
}

@freezed
class FindStoreBoundsQuery with _$FindStoreBoundsQuery {
  const factory FindStoreBoundsQuery({
    required double xmin,
    required double ymin,
    required double xmax,
    required double ymax,
  }) = _FindStoreBoundsQuery;

  factory FindStoreBoundsQuery.fromJson(Map<String, dynamic> json) => _$FindStoreBoundsQueryFromJson(json);
}

// --- Body ---

@freezed
class CreateMenuBody with _$CreateMenuBody {
  @JsonSerializable(includeIfNull: false)
  const factory CreateMenuBody({
    @JsonKey(name: 'store_id') required String storeId,
    required String name,
    @JsonKey(name: 'reference_image_url') required String referenceImageUrl,
    @JsonKey(name: 'portion_grams') int? portionGrams,
  }) = _CreateMenuBody;

  factory CreateMenuBody.fromJson(Map<String, dynamic> json) => _$CreateMenuBodyFromJson(json);
}

@freezed
class UpdateMenuBody with _$UpdateMenuBody {
  @JsonSerializable(includeIfNull: false)
  const factory UpdateMenuBody({
    String? name,
    @JsonKey(name: 'reference_image_url') String? referenceImageUrl,
    @JsonKey(name: 'portion_grams') int? portionGrams,
  }) = _UpdateMenuBody;

  factory UpdateMenuBody.fromJson(Map<String, dynamic> json) => _$UpdateMenuBodyFromJson(json);
}

@freezed
class CreateOrderItem with _$CreateOrderItem {
  const factory CreateOrderItem({
    @JsonKey(name: 'menu_id') required String menuId,
    required int quantity,
    @JsonKey(name: 'unit_price') required num unitPrice,
  }) = _CreateOrderItem;

  factory CreateOrderItem.fromJson(Map<String, dynamic> json) => _$CreateOrderItemFromJson(json);
}

@freezed
class CreateOrderBody with _$CreateOrderBody {
  @JsonSerializable(explicitToJson: true, includeIfNull: false)
  const factory CreateOrderBody({
    @JsonKey(name: 'store_id') required String storeId,
    @JsonKey(name: 'total_amount') required num totalAmount,
    required String currency,
    @JsonKey(name: 'payment_status') required String paymentStatus,
    @JsonKey(name: 'external_payment_id') String? externalPaymentId,
    required List<CreateOrderItem> items,
  }) = _CreateOrderBody;

  factory CreateOrderBody.fromJson(Map<String, dynamic> json) => _$CreateOrderBodyFromJson(json);
}

@freezed
class UpdateOrderBody with _$UpdateOrderBody {
  @JsonSerializable(includeIfNull: false)
  const factory UpdateOrderBody({
    @JsonKey(name: 'payment_status') String? paymentStatus,
    @JsonKey(name: 'external_payment_id') String? externalPaymentId,
  }) = _UpdateOrderBody;

  factory UpdateOrderBody.fromJson(Map<String, dynamic> json) => _$UpdateOrderBodyFromJson(json);
}

@freezed
class CreateReviewBody with _$CreateReviewBody {
  @JsonSerializable(includeIfNull: false)
  const factory CreateReviewBody({
    @JsonKey(name: 'order_id') required String orderId,
    @JsonKey(name: 'menu_id') required String menuId,
    @JsonKey(name: 'value_score') num? valueScore,
    @JsonKey(name: 'ai_analysis') Map<String, dynamic>? aiAnalysis,
  }) = _CreateReviewBody;

  factory CreateReviewBody.fromJson(Map<String, dynamic> json) => _$CreateReviewBodyFromJson(json);
}

@freezed
class UpdateReviewBody with _$UpdateReviewBody {
  @JsonSerializable(includeIfNull: false)
  const factory UpdateReviewBody({
    @JsonKey(name: 'value_score') num? valueScore,
    @JsonKey(name: 'ai_analysis') Map<String, dynamic>? aiAnalysis,
  }) = _UpdateReviewBody;

  factory UpdateReviewBody.fromJson(Map<String, dynamic> json) => _$UpdateReviewBodyFromJson(json);
}
