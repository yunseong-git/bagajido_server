import 'package:freezed_annotation/freezed_annotation.dart';

part 'pick_result.freezed.dart';
part 'pick_result.g.dart';

/// `POST/DELETE /stores/:storeId/picks` — `{ "picked": true | false }`
@freezed
class PickResult with _$PickResult {
  const factory PickResult({
    required bool picked,
  }) = _PickResult;

  factory PickResult.fromJson(Map<String, dynamic> json) => _$PickResultFromJson(json);
}
