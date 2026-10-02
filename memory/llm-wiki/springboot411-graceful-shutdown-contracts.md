# Spring Boot 4.1.1 graceful 종료·연결 계약

Topic: frameworks/spring-boot/graceful-shutdown
Version: Spring Boot official 4.1.1 reference; local signal and request-draining test not performed
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html

<!-- evidence-sha256: c083e847924afb90a1a121755d07137d2dd833dd86df0433a0c76921f0e06ff6 -->

## 공식 계약과 범위

이 문서 버전의 Jetty/Netty/Tomcat graceful shutdown은 기본이며 과거 기본과 혼용하지 않는다. 적절한 종료 신호와 timeout-per-shutdown-phase가 필요하다. 서버는 network layer에서 신규 요청을 거절하며 persistent connection은 결과에 영향을 줄 수 있다. phase timeout은 전체 프로세스 종료 시간과 동일하다는 뜻이 아니다. IDE stop이 올바른 SIGTERM을 보낸다고 가정하지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-BOOT-STOP-001 | IDE 종료 즉시 단절 | 종료 방식 | 적절한 종료 신호 미전달 | 정상 종료 경로 검토 | 진행 요청 완료 확인 |
| SYN-BOOT-STOP-002 | 장기 요청 종료 중단 | 처리시간·phase timeout | 유예 부족 | timeout-per-shutdown-phase 검토 | 제한 전후 확인 |
| SYN-BOOT-STOP-003 | graceful 배출 미실행 | server.shutdown | immediate 명시 | 의도한 종료 설정 확인 | 종료 배출 관측 |
| SYN-BOOT-STOP-004 | 종료 때 HTTP 응답 없음 | 서버·연결 이벤트 | network layer 신규 요청 거절 | 서버 계약별 관측 | 신규·기존 요청 분리 확인 |
| SYN-BOOT-STOP-005 | 연결별 결과 차이 | persistent connection | 연결 재사용 영향 | 연결 종류별 검사 | 종료 시나리오 비교 |
