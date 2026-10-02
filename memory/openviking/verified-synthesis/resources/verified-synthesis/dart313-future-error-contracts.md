# Dart Future 오류 전달 진단

Topic: languages/dart
Version: 문서 기본 Dart 3.13.3; callback Future API
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://dart.dev/libraries/async/futures-error-handling

<!-- evidence-sha256: 1e35dcc63510677ff00ff03ef51e9ed8f0cd78abe4f06178cd74e5e16039def1 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-DART-001 | Future 실패가 handler 밖으로 전파 | handler 등록 시점 확인 | 오류 완료 후 늦게 등록 | 생성 직후 handler 연결 | 즉시 실패 Future 처리 |
| SYN-DART-002 | catchError로 동기 예외 못 잡음 | Future 반환 전 throw 확인 | 동기·비동기 오류 혼재 | Future.sync로 반환 계약 통일 | 동기 throw·Future error 각각 |
| SYN-DART-003 | then callback들이 실행 안 됨 | chain 최초 오류 확인 | 오류는 success callback 건너뜀 | 적절한 catchError에서 처리 | 복구 후 후속 callback |
| SYN-DART-004 | whenComplete 뒤 원래 결과 바뀜 | cleanup 예외 확인 | cleanup 오류로 완료 | cleanup 실패 별도 처리 설계 | 원래 실패·cleanup 실패 구분 |
| SYN-DART-005 | 특정 오류 catch가 누락 | catchError test 확인 | predicate 미일치 | 필요한 분기·최종 handler 구성 | 각 오류 타입 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
