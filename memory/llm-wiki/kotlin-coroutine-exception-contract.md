# Kotlin coroutine 예외·supervision 계약

Topic: kotlin-coroutines
Version: 2026-07-20 공식 문서; 설치 kotlinx.coroutines 버전 대조
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kotlinlang.org/docs/exception-handling.html

<!-- evidence-sha256: c9075c0287d870235c8751d480268e874cbca0c4b2d38e202ab71e04d919817d -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-KOT-001 | async 실패가 handler에 안 보임 | Deferred await·root/child scope 확인 | async 예외는 Deferred에 저장 | await 실패 처리와 부모 실패 경로 점검 | 실패 주입 후 예외 관측 |
| SYN-KOT-002 | handler에서 작업 복구가 안 됨 | handler 호출 시 Job 상태 확인 | handler 시점에는 이미 예외 완료 | 새 작업 수명과 재시작 정책 설계 | 실패 작업 완료·새 작업 구분 |
| SYN-KOT-003 | child handler가 호출 안 됨 | 일반 Job 부모 계층 확인 | 예외 처리 부모 위임 | root 처리와 supervision 계약 선택 | 부모·형제 취소 관측 |
| SYN-KOT-004 | SupervisorJob에서 실패가 묻힘 | 각 child 실패 처리 확인 | child 실패는 부모·형제에 전파 안 됨 | 각 child 예외 처리 명시 | 실패 child와 정상 형제 상태 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
