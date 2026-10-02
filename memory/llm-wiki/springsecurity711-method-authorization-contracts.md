# Spring Security method 권한 검사 경계

Topic: frameworks/spring-security/method-authorization
Version: Spring Security official 7.1.1 reference; no server or method invocation tested
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html

<!-- evidence-sha256: a59c7ed2d584f82508410840b2c86489b1d6925bb8f45add1b1cff5496bcb9f9 -->

## 공식 계약과 범위

starter 추가만으로 method security를 활성화하지 않는다. EnableMethodSecurity가 필요하며 Secured는 별도 활성 조건이다. 여러 권한 annotation은 각 검사를 통과해야 한다. PostAuthorize는 메서드 실행 후 검사하므로 쓰기 부작용을 이미 만든 뒤 거절할 수 있다. 쓰기 전에 권한을 확인할 구조를 검토한다. HTTP 밖 호출의 AccessDeniedException이 자동으로 HTTP403으로 변환된다고 일반화하지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-SEC-METHOD-001 | annotation 권한 미적용 | EnableMethodSecurity | starter만으로 활성 기대 | 명시적 활성화 검토 | 권한별 호출 확인 |
| SYN-SEC-METHOD-002 | Secured 검사 누락 | securedEnabled | 기본 활성화 오인 | 별도 활성 조건 확인 | 비권한 거절 확인 |
| SYN-SEC-METHOD-003 | 복수 annotation 예상보다 거절 | 각 조건 결과 | 모든 검사 통과 요구 | 조건 의도 정리 | 권한 조합 확인 |
| SYN-SEC-METHOD-004 | 거절 전 DB 변경 | PostAuthorize·쓰기 순서 | 후행 검사 부작용 | 승인 확인 후 쓰기 설계 | 거절 시 변경 없음 검사 |
| SYN-SEC-METHOD-005 | 비HTTP 예외 미처리 | 호출 경계·예외 | HTTP 변환 filter 부재 | AccessDeniedException 처리 검토 | 작업 실패 경로 확인 |
