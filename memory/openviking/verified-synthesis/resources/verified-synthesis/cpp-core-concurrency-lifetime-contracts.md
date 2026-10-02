# C++ 동시성 대기·잠금·코루틴 수명

Topic: languages
Version: C++ Core Guidelines 2026-06-14; coroutines C++20
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

<!-- evidence-sha256: dcbfc6eeac69d4463f6f61c8c8d487233d6db56c1f1febce1685f41d7ebaa48e -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CPP-CONCURRENCY-001 | 깨워도 대기 지속 | CP.42·predicate·공유상태 | 알림 유실/허위 깨움 | 잠금 안 조건검사 wait | 알림 전후 상태 검증 |
| SYN-CPP-CONCURRENCY-002 | 임계구역 경합 | CP.44·guard 수명 | 이름 없는 임시 guard 즉시 해제 | 이름 있는 RAII guard | 보호구간 수명 확인 |
| SYN-CPP-CONCURRENCY-003 | 재개 후 메모리 오류 | CP.51·closure 수명 | 코루틴 lambda capture 소멸 | 값 매개변수/명명 함수 | 재개까지 소유권 확인 |
| SYN-CPP-CONCURRENCY-004 | await 중 교착 | CP.52·잠금·suspend | 잠금 보유한 채 정지 | 정지 전 잠금 해제 | 재개 스레드·락 경계 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
