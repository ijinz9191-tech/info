# Linkerd 프로토콜 감지와 우회 경계

Topic: cncf/linkerd
Version: 2-edge development documentation; stable release equivalence unverified
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://linkerd.io/2-edge/features/protocol-detection/

<!-- evidence-sha256: 331a56ecbc7c250d492421eb49aa386d2c44623784a061a07bc9946a97ab8fef -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-LINKERD-001 | 연결 시작 약 10초 지연 | proxy 감지 timeout과 최초 client 송신 | server-first 또는 늦은 송신 | 실제 프로토콜을 확인해 선언 | 연결 지연과 통신 검증 |
| SYN-LINKERD-002 | HTTP 지표·routing이 없음 | 애플리케이션 TLS와 TCP 분류 | 암호화된 HTTP를 proxy가 해독 불가 | TCP 관측 범위에 맞춰 진단 | HTTP metrics를 보장했다고 판단하지 않음 |
| SYN-LINKERD-003 | HTTPRoutes 정책 예상과 불일치 | 감지 timeout 후 TCP 처리 | HTTP로 분류되지 않아 정책 미적용 | 프로토콜 선언과 정책 검토 | 허용·차단 동작 재확인 |
| SYN-LINKERD-004 | Service 선언했는데 unmeshed client 지연 | 수신 pod의 opaque annotation | client proxy가 Service appProtocol 읽지 않음 | 수신 pod annotation 적용 검토 | unmeshed 경로 별도 확인 |
| SYN-LINKERD-005 | annotation 후 다른 포트 감지 동작 변경 | 기본·설정 opaque 목록 비교 | 설정 목록이 기본값을 대체 | 필요한 전체 포트 목록 검토 | 각 포트 통신·관측 확인 |
| SYN-LINKERD-006 | 우회 후 mesh 기능 사라짐 | source skip-outbound 설정 | skip은 proxy 전체 우회 | opaque와 skip 요구 구별 | 필요 mesh 기능 유지 여부 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
