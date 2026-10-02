# Envoy 연결·요청·재시도 circuit breaker

Topic: Envoy upstream circuit breaking
Version: 고정 원문 commit 4f2ca41dd775e2d9e2d278224238a4c365a541ba
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://github.com/envoyproxy/envoy/blob/4f2ca41dd775e2d9e2d278224238a4c365a541ba/docs/root/intro/arch_overview/upstream/circuit_breaking.rst

<!-- evidence-sha256: ade058ba404f50a2f749749af1b3870c51a9eb5226bcd5a1bcfc1b4352be639d -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-ENVOY-001 | 연결 상한을 넘은 듯한 active 연결 수 | upstream_cx_active·overflow·endpoint·pool 수 | 호스트별 최소 연결과 pool·eventual consistency 고려 누락 | 연결 수의 공식 상한 관계와 부하를 검토 | endpoint·pool 변화별 수치 해석 확인 |
| SYN-ENVOY-002 | HTTP2 요청 증가가 pending 상한과 다르게 작동 | 연결·stream 제한·pending·active 요청 metric | multiplexing과 pending queue 계약 혼동 | protocol별 connection·stream·request를 구분 | 연결 없음·stream 포화 상태의 metric 검사 |
| SYN-ENVOY-003 | 장애 시 재시도가 증폭됨 | active retry와 retry overflow | 실패 요청의 과도한 재시도가 추가 부하 생성 | retry budget과 공격적 재시도 제한 검토 | 실패 주입에서 총 시도 수와 backend 부하 확인 |
| SYN-ENVOY-004 | pool 상한에서 연결 여유가 있어도 실패 | pool overflow와 idle pool·연결 수 | connection pool 상한과 connection 상한 혼동 | pool 생성 원인과 별도 상한 검토 | pool·connection별 회복과 요청 성공 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
