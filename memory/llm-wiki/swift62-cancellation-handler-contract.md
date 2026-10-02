# Swift 취소 handler 실행 경계

Topic: swift
Version: swift-6.2-RELEASE 공식 소스 주석
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://github.com/swiftlang/swift/blob/swift-6.2-RELEASE/stdlib/public/Concurrency/TaskCancellation.swift

<!-- evidence-sha256: 659fa9a246a56c5b6297068d36371ad2f351896dd401099b3bdf29be6885ad2b -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SWIFT-001 | 취소된 작업에서도 operation 실행 | 등록 시 취소 상태·operation 시작 확인 | operation은 취소 상태에도 호출 | operation 자체 취소 검사 | 사전 취소에서 부작용 여부 검사 |
| SYN-SWIFT-002 | 취소 handler와 operation 데이터 경합 | 공유 상태·동시 호출 확인 | handler는 operation과 동시 실행 가능 | 공유 상태 동기화 설계 | 취소 시점 경합 검증 |
| SYN-SWIFT-003 | 취소 중 deadlock | handler 잠금·cancel·continuation 경로 확인 | 내부 잠금과 사용자 잠금 순환 | 동일 잠금 보유 중 cancel·resume 피하기 | 취소 경합에서 종료 확인 |
| SYN-SWIFT-004 | 취소 후 다시 작업하려는데 취소 상태 유지 | isCancelled 확인 | 취소 상태는 복구되지 않음 | 새 작업 수명 설계 | 새 task와 기존 task 상태 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
