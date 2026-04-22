import 'package:freezed_annotation/freezed_annotation.dart';

part 'review_dto.freezed.dart';
part 'review_dto.g.dart';

@freezed
class ReviewDto with _$ReviewDto {
  const factory ReviewDto({
    required String id,
    @JsonKey(name: 'user_id') required String userId,
    @JsonKey(name: 'order_id') required String orderId,
    @JsonKey(name: 'menu_id') required String menuId,
    @JsonKey(name: 'value_score', fromJson: _asNullableString) String? valueScore,
    @JsonKey(
      name: 'ai_analysis',
      fromJson: _aiAnalysisFromJson,
      toJson: _aiAnalysisToJson,
    )
    Object? aiAnalysis,
    @JsonKey(name: 'deleted_at') DateTime? deletedAt,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _ReviewDto;

  factory ReviewDto.fromJson(Map<String, dynamic> json) => _$ReviewDtoFromJson(json);
}

String? _asNullableString(Object? value) {
  if (value == null) {
    return null;
  }
  if (value is String) {
    return value;
  }
  return value.toString();
}

Object? _aiAnalysisFromJson(Object? value) => value;

Object? _aiAnalysisToJson(Object? value) => value;

List<ReviewDto> reviewDtoListFromJson(List<dynamic> list) {
  return list
      .map(
        (e) => ReviewDto.fromJson(Map<String, dynamic>.from(e as Map)),
      )
      .toList();
}
