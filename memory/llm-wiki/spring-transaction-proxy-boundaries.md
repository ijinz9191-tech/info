# Spring 트랜잭션 프록시 경계

Topic: spring
Version: 공식 현재 문서; 가시성 차이는 6.0 이상
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html

<!-- evidence-sha256: 4c3dbca8590cb11ddf158c500db2d9a785f16b53ee00d646ee7819989d14db67 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SPR-TX-001 | 내부 호출에서 롤백 누락 | 호출 경로·프록시 통과 확인 | self invocation | 외부 프록시를 거치는 서비스 경계 설계 | 롤백 통합 검증 |
| SYN-SPR-TX-002 | 초기화 중 트랜잭션 누락 | PostConstruct 호출 시점 확인 | 프록시 초기화 전 의존 | 초기화 이후 작업 경계 분리 | 초기화 이후 롤백 검증 |
| SYN-SPR-TX-003 | 비공개 메서드 적용 차이 | 프록시 종류·가시성·버전 확인 | 인터페이스 프록시의 public 요건 | 프록시 계약에 맞게 공개 서비스 구성 | 실제 프록시 호출 검증 |
| SYN-SPR-TX-004 | 서비스 annotation 무시 | EnableTransactionManagement의 context 위치 확인 | 다른 context 서비스 미검사 | 서비스 context에 인프라 등록 | 서비스 rollback 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
