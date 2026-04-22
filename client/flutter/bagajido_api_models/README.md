# bagajido_api_models

Nest 서버(`bagajido_server`) API 응답/요청과 맞춘 Freezed + `json_serializable` 모델입니다.

## 사용 방법

1. Flutter 앱 `pubspec.yaml`에 path 의존성을 추가합니다.

```yaml
dependencies:
  bagajido_api_models:
    path: ../../client/flutter/bagajido_api_models # 실제 상대 경로에 맞게 조정
```

2. 이 디렉터리에서 코드 생성을 실행합니다.

```bash
cd client/flutter/bagajido_api_models
dart pub get
dart run build_runner build -d
```

3. 앱 코드에서 import 합니다.

```dart
import 'package:bagajido_api_models/bagajido_api_models.dart';
```

## 예시

- `GET /stores/map` → `storeMapItemListFromJson(jsonDecode(body) as List<dynamic>)`
- `GET /users/me/liked-stores` → `likedStoreItemListFromJson(...)`
- `GET /users/me/picked-stores` → `pickedStoreItemListFromJson(...)`
