# Spring 트랜잭션 이벤트의 실행 단계·문맥

Topic: frameworks
Version: Spring Framework 7.0.9 docs; annotation since4.2, reactive support since6.1
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html

<!-- evidence-sha256: 2758e9adbba42fa85a61abb1d7d4c9b5338f261946c3eb78d5d0758235434815 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SPRING-TX-EVENT-001 | 발행했으나 listener 미호출 | 실행중 transaction·fallbackExecution | transaction 부재 | 보장할 의미 결정 후 transaction 또는 fallback 설정 | transaction 유무별 호출 확인 |
| SYN-SPRING-TX-EVENT-002 | rollback에서 성공 후처리 누락 | phase·transaction 결과 | 기본 AFTER_COMMIT | 원하는 AFTER_ROLLBACK/COMPLETION 단계 지정 | commit·rollback 별 실행 |
| SYN-SPRING-TX-EVENT-003 | commit/rollback 구분없이 후처리 | AFTER_COMPLETION 설정 | 완료 단계는 양쪽 포함 | 목적에 맞는 구체 phase 선택 | 두 결과의 부작용 비교 |
| SYN-SPRING-TX-EVENT-004 | reactive listener 문맥 누락 | 6.1+·event source·Reactor context | ThreadLocal로 문맥 기대 | TransactionalEventPublisher 문맥전달 계약 적용 | reactive transaction 문맥 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
