# Spring 캐시 provider·reactive·SpEL 경계

Topic: frameworks/spring-cache
Version: Current reference; CompletableFuture/reactive adaptation since 6.1; Boot dependency version must match
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html

<!-- evidence-sha256: 3bec3eb94755aacbf8f68fd09aa295ef451bc3da22f60e90dff0e009b190e5ad -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SPRINGCACHE-001 | 동일 miss 계산 중복 | sync·provider 지원 | 기본 잠금 없음 | 지원 provider에서 sync 검토 | 동시 계산 횟수 |
| SYN-SPRINGCACHE-002 | Future 캐시 조회 실패 | provider Future retrieval | provider 계약 불일치 | 비동기 조회 지원 확인 | miss/hit 완료 |
| SYN-SPRINGCACHE-003 | Flux 캐시로 메모리 증가 | 완료까지 list 수집 | coarse-grained 수집 | streaming 요구와 캐시 경계 재설계 | 대량·미완료 stream 검증 |
| SYN-SPRINGCACHE-004 | Optional 조건식 오류 | #result·빈 Optional | result는 unwrap된 값 | null-safe SpEL 사용 | 빈·존재 결과 |
| SYN-SPRINGCACHE-005 | 원하지 않는 값 저장 | condition·unless 시점 | 호출 전후 평가 차이 | 적절한 평가 단계 선택 | 호출 횟수·저장 결과 |
| SYN-SPRINGCACHE-006 | 설정 예외 | cacheManager·cacheResolver | 상호 배타 설정 | 한 선택만 지정 | 기동·resolution 확인 |
| SYN-SPRINGCACHE-007 | CachePut로 항상 실행 | Cacheable 동시 지정 | 호출 강제·생략 충돌 | 메서드 계약 분리 | hit 시 호출·갱신 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
