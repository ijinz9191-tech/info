# Spring Boot 4.1.1 executor 선택 계약

Topic: frameworks/spring
Version: Official Spring Boot 4.1.1; virtual threads require Java 21+ and explicit true; no Spring runtime
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html

<!-- evidence-sha256: 324296cee727463413811a1d41b8d8ada3145d4a6a93f81fdc3ab6a372addd26 -->

## 공식 계약과 범위

사용자 Executor bean은 자동 구성에 영향을 준다. MVC/WebFlux 연동은 applicationTaskExecutor라는 이름과 AsyncTaskExecutor 타입을 요구한다. defaultCandidate=false는 전용 bean과 자동 구성을 공존시키는 경로이며 qualifier가 필요하다. force 모드에서도 AsyncConfigurer는 regular async executor 선택을 바꿀 수 있다. pooling 구현과 가상 구현은 설정 계약이 다르다.

## 가상 진단 시나리오

아래는 공식 원문에서 도출한 가상 사례다. 운영 재현·실제 공개 이슈 해결·모델 가중치 학습 결과가 아니다. 모든 행에 Sources와 version 범위가 적용되며 조치·검증은 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-BOOT-TASK-001 | MVC 비동기 executor 누락 | bean 이름·타입 | 사용자 Executor로 자동 구성 후퇴 | applicationTaskExecutor를 AsyncTaskExecutor로 제공 검토 | 비동기 요청 실행 경로 확인 |
| SYN-BOOT-TASK-002 | 전용 Executor 추가 후 기본 구성 소실 | bean 후보 설정 | default candidate로 등록 | defaultCandidate=false와 Qualifier 검토 | 두 executor 주입·실행 확인 |
| SYN-BOOT-TASK-003 | force에서도 AsyncConfigurer executor 사용 | force 설정·AsyncConfigurer | 명시 configurer의 우선 계약 | 의도에 맞게 configurer 검토 | 실제 실행 thread 확인 |
| SYN-BOOT-TASK-004 | 가상 scheduler pool 설정 무효 | scheduler 클래스·virtual 설정 | SimpleAsyncTaskScheduler pooling 설정 무시 | 실제 구현에 맞는 설정 검토 | 동시 실행과 scheduler type 관측 |
| SYN-BOOT-TASK-005 | max-size 증가에도 queue 대기 누적 | queue-capacity·active threads | queue가 먼저 작업 수용 | 부하 기준 bounded queue 검토 | queue 포화 시 thread 확장·지연 확인 |
