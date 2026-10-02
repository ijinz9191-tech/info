# Spring Boot probe와 의존성 장애 경계

Topic: Spring Boot Kubernetes probes
Version: Spring Boot 3.5 문서; 2026-10-02 열람
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-boot/3.5/reference/actuator/endpoints.html

<!-- evidence-sha256: da1625ace802c924f3f2e29ba8aac5811306d7eea0df7a4c39806f25dfcdaf8f -->

## 원리
ApplicationAvailability와 실제 HTTP probe는 별개다. liveness는 재시작, readiness는 트래픽 수신 결정에 연결된다. 다른 health indicator가 기본 그룹에 자동 포함된다고 가정하지 않는다.

## 진단 시나리오
- 관리 포트만 정상: management context가 정상이어도 주 포트나 연결 풀이 실패할 수 있다. 주 포트 요청과 probe를 함께 비교한다. add-additional-paths로 /livez·/readyz 노출을 검토한다.
- DB 장애 때 전체 재시작: liveness의 외부 의존성을 조사한다. 공유 DB·캐시 장애를 liveness에 연결하지 않는다. 의존성 실패 주입 후 재시작 폭증 없이 복구되는지 확인한다.
- 전체 readiness 탈락: 업무 중요도·격리·fallback에 따라 외부 시스템 포함 여부를 결정한다. endpoint 제거와 상위 호출자의 실패 동작을 검증한다.
- 느린 시작: readiness 실패는 트래픽을 막지만 liveness 종료를 막지 않는다. 시작 시간과 probe 이벤트를 비교하고 startupProbe를 검토한다.

## 근거 수준
공식 문서에서 도출한 진단 시나리오다. 회사 장애나 운영 재현 완료 기록이 아니다. Boot 버전·웹 스택·ingress별 동작은 별도 확인한다.
