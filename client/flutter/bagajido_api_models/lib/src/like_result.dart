import 'package:freezed_annotation/freezed_annotation.dart';

part 'like_result.freezed.dart';
part 'like_result.g.dart';

/// `POST/DELETE /stores/:storeId/likes` — `{ "liked": true | false }`
@freezed
class LikeResult with _$LikeResult {
  const factory LikeResult({
    required bool liked,
  }) = _LikeResult;

  factory LikeResult.fromJson(Map<String, dynamic> json) => _$LikeResultFromJson(json);
}
