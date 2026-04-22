import 'package:freezed_annotation/freezed_annotation.dart';

part 'menu_dto.freezed.dart';
part 'menu_dto.g.dart';

@freezed
class MenuDto with _$MenuDto {
  const factory MenuDto({
    required String id,
    @JsonKey(name: 'store_id') required String storeId,
    required String name,
    @JsonKey(name: 'reference_image_url') required String referenceImageUrl,
    @JsonKey(name: 'portion_grams') int? portionGrams,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _MenuDto;

  factory MenuDto.fromJson(Map<String, dynamic> json) => _$MenuDtoFromJson(json);
}

List<MenuDto> menuDtoListFromJson(List<dynamic> list) {
  return list
      .map(
        (e) => MenuDto.fromJson(Map<String, dynamic>.from(e as Map)),
      )
      .toList();
}
