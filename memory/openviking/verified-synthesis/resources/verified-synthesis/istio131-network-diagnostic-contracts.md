# Istio 1.31 네트워크 장애 진단

Topic: cncf/istio
Version: 1.31.1 sidecar; 조건별 적용
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://istio.io/latest/docs/ops/common-problems/network-issues/

<!-- evidence-sha256: faddc06657270e941df58211326fb6043369420326f2f714dff2ace4c19731b5 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SYN-ISTIO-001 | 503 발생 | access log RESPONSE_FLAGS 확인 | NR=route, UO=overflow, UF=connection | 플래그별 경로·한도·연결 조사 | 동일 요청 성공과 플래그 소멸 |
| SYN-SYN-ISTIO-002 | DestinationRule 이후 503 | 자동 mTLS 비활성 조건과 TLS 설정 확인 | 클라이언트·서버 TLS 불일치 | 서버 정책에 맞는 TLS 설정 | 암호화 경로와 응답 확인 |
| SYN-SYN-ISTIO-003 | Gateway subset 미적용 | 외부 host의 VirtualService 확인 | 내부 서비스 규칙만 수정 | Gateway에 연결된 규칙에 subset 지정 | 실제 대상 workload 확인 |
| SYN-SYN-ISTIO-004 | HTTP 포트에 HTTPS 요청 실패 | port protocol과 DPE 확인 | 프로토콜 선언 불일치 | 포트와 요청 프로토콜 정합화 | 요청 및 TLS 경계 확인 |
| SYN-SYN-ISTIO-005 | SIMPLE Gateway에서 TLS route 404 | Gateway 종료 모드 확인 | 종료 후 HTTP와 TLS 규칙 불일치 | 종료 후 HTTP 규칙 사용 | 대상 HTTP route 확인 |
| SYN-SYN-ISTIO-006 | PASSTHROUGH에서 HTTP route 무효 | SNI와 Gateway 모드 확인 | 복호화하지 않은 트래픽 | TLS/SNI 규칙 구성 | SNI별 대상 확인 |
| SYN-SYN-ISTIO-007 | TLS origination 오류 | 애플리케이션·sidecar TLS 확인 | 이중 TLS | origination 경계의 앱 요청 조정 | 목적지 TLS와 응답 확인 |
| SYN-SYN-ISTIO-008 | 두 번째 host에서 HTTP/2 404 | 공유 인증서·Gateway 확인 | 연결 재사용과 Gateway 분리 | wildcard Gateway 바인딩 정리 | 두 host 반복 요청 |
| SYN-SYN-ISTIO-009 | Host 지정에도 TLS 라우팅 실패 | SNI 확인 | Host와 SNI 혼동 | DNS 또는 curl --resolve 사용 | SNI·Host 함께 확인 |
| SYN-SYN-ISTIO-010 | EnvoyFilter 순서 의존 실패 | 실제 filter chain 확인 | 상대 삽입 순서 의존 | 명시 priority 검토 | 배포 후 chain 재확인 |
| SYN-SYN-ISTIO-011 | fault injection과 retry 기대 불일치 | 같은 VirtualService 설정 확인 | 지원되지 않는 조합 | 프록시 경계 분리 설계 | 주입·재시도 각각 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
