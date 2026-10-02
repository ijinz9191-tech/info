# Cilium 상태·용량·클러스터 연결 진단

Topic: cncf/cilium
Version: 1.20.2 documentation; historical command outputs are examples
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.cilium.io/en/stable/operations/troubleshooting/

<!-- evidence-sha256: 7613a44a1e293bcd208cf09e845e83cf7118f4b5d2baa854d37d97cd807d57c7 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CILIUM-CAPACITY-001 | 연결 추적 삽입 실패 | CT: Map insertion failed, GC 지표 | conntrack 용량 또는 GC 주기 | 메모리·CPU 비용 평가 후 map/GC 조정 | 동일 부하에서 drop과 GC 비교 |
| SYN-CILIUM-CAPACITY-002 | 정책 map 압박 | selector별 identity 수 | 넓은 selector의 identity 증가 | 최소 권한을 유지하며 selector 점검 | 정책 허용·차단과 map 압박 재검증 |
| SYN-CILIUM-CAPACITY-003 | etcd 장애 중 신규 pod 통신 실패 | kvstore 모드, identity와 state 전파 | 신규 identity 등록/전파 의존 | quorum과 agent 연결 복구 | 신규 endpoint 등록·통신 확인 |
| SYN-CILIUM-CAPACITY-004 | etcd 장애인데 기존 통신 정상 | 기존 endpoint와 datapath 상태 | 기존 datapath는 kvstore와 독립 | 제어 상태와 통신을 분리 진단 | 재시작·신규 workload도 별도 확인 |
| SYN-CILIUM-CAPACITY-005 | agent 반복 재시작 | status, 이전 로그, quorum 오류 횟수 | 연속 건강 검사 실패 | etcd 접근성과 heartbeat 점검 | health 회복과 재시작 감소 |
| SYN-CILIUM-CAPACITY-006 | Hubble 일부 노드만 관측 | Relay 연결 node 수 | 개별 agent 관측 범위 또는 Relay 누락 | Relay 연결 상태 점검 | 대상 node flow 관측 |
| SYN-CILIUM-CAPACITY-007 | 연결 테스트 실패 | 시험 namespace의 기존 정책 | 기존/clusterwide 정책 간섭 | 독립 namespace에서 정책 조건 확인 | 조건별 테스트 결과 비교 |
| SYN-CILIUM-CAPACITY-008 | ICMP 정상인데 HTTP health 실패 | L3·HTTP 각 행 | 계층별 대상이 다름 | health agent 경로 별도 조사 | 동일 경로의 HTTP 복구 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
