import 'package:freezed_annotation/freezed_annotation.dart';

part 'order_dto.freezed.dart';
part 'order_dto.g.dart';

@freezed
class OrderDto with _$OrderDto {
  const factory OrderDto({
    required String id,
    @JsonKey(name: 'user_id') required String userId,
    @JsonKey(name: 'store_id') required String storeId,
    /// Prisma `Decimal` → API에서 문자열
    @JsonKey(name: 'total_amount') required String totalAmount,
    required String currency,
    @JsonKey(name: 'payment_status') required String paymentStatus,
    @JsonKey(name: 'external_payment_id') String? externalPaymentId,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _OrderDto;

  factory OrderDto.fromJson(Map<String, dynamic> json) => _$OrderDtoFromJson(json);
}

List<OrderDto> orderDtoListFromJson(List<dynamic> list) {
  return list
      .map(
        (e) => OrderDto.fromJson(Map<String, dynamic>.from(e as Map)),
      )
      .toList();
}
