# Spring Security CSRF 연동 경계

Topic: spring-security
Version: 현재 Servlet 공식 문서
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html

<!-- evidence-sha256: 740aad0fadbd1cdafbe1294a8e06d9c101f7d7a2648d828881e796989479eefb -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CSRF-001 | POST 403 | 누락·유효·무효 토큰 대조 | CSRF 토큰 누락 또는 불일치 | 서버 계약 헤더에 토큰 제출 | MockMvc 세 경우 검증 |
| SYN-CSRF-002 | SPA 쿠키 있는데 거부 | plain 토큰과 요청 handler 확인 | BREACH 인코딩 연동 불일치 | 설치 버전에 맞는 SPA handler 구성 | 실제 브라우저 POST 검증 |
| SYN-CSRF-003 | 로그인·로그아웃 후 POST 실패 | 회전 전후 쿠키 확인 | 기존 토큰 제거 후 새 토큰 미취득 | 인증 전환 후 토큰 새로 취득 | 전환 이후 POST 확인 |
| SYN-CSRF-004 | 매 GET 세션 로드 증가 | 전역 ControllerAdvice 토큰 접근 확인 | deferred 로딩 이점 소실 | 필요 시 토큰 endpoint 사용 | 세션 로드와 토큰 발급 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
