# .NET TAP 완료 상태·취소·예외 소유

Topic: C# .NET TAP
Version: Microsoft Learn TAP; 사용 SDK 버전별 재확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://learn.microsoft.com/en-us/dotnet/standard/asynchronous-programming-patterns/task-based-asynchronous-pattern-tap

<!-- evidence-sha256: 4d62f0047a8e6899e540f762548e8ee353685c25dfcad1cf14ca3b96ca490a2b -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CS-001 | IsCompleted인데 결과 접근이 실패 | Status·IsCanceled·IsFaulted | 완료와 성공을 동일시 | await로 결과·취소·예외를 처리 | 성공·실패·취소 세 경로 검사 |
| SYN-CS-002 | 취소 요청 후 성공 결과가 반환 | 토큰 요청과 실제 작업 종료 원인 | 취소 요청이 항상 수락된다고 오해 | 토큰 수락과 결과 상태를 구별 | 취소 시점별 최종 상태 확인 |
| SYN-CS-003 | TAP 태스크에 Start 호출 시 예외 | 태스크 생성 경로와 상태 | 이미 활성화된 TAP 태스크를 cold task로 오해 | 반환된 태스크는 await | 반복 호출 없이 정상 완료 확인 |
| SYN-CS-004 | 비동기 API 호출이 UI를 오래 막음 | 태스크 반환 전 동기 작업 시간 | 초기 동기 계산이 너무 큼 | 동기 준비를 최소화하고 실행 위치 결정 | 호출 반환 시간과 UI 반응 측정 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
