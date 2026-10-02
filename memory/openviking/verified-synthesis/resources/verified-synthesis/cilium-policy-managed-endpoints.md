# Cilium 관리 endpoint·policy rendering·map 압력

Topic: Cilium networking
Version: 공식 1.20.2 문서; datapath·identity mode별 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.cilium.io/en/stable/operations/troubleshooting/

<!-- evidence-sha256: ebf3319b6d27c0d21a01b088489cbb800501fa60f8d9640dc7436e1d5f7cc4b2 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CILIUM-001 | 정책이 특정 Pod에 적용되지 않음 | managed Pod 수·hostNetwork·Pod 시작 시점 | Cilium이 관리하지 않는 networking | 관리 대상 여부와 host policy 필요성을 검토 | 허용·차단 두 경로에서 실제 적용 확인 |
| SYN-CILIUM-002 | 예상과 다른 통신이 허용·거부됨 | realized ingress·egress·derived-from-rules | 여러 정책의 합성 결과를 놓침 | 실현된 정책과 의도를 비교 | policy verdict와 실제 요청 결과를 대조 |
| SYN-CILIUM-003 | 정책 map 압력이 계속 증가 | selector별 선택 identity 수와 map 사용 | 광범위 selector나 identity 폭증 | 필요한 selector와 identity 범위를 검토 | 정책 의도 유지와 map·메모리 변화 확인 |
| SYN-CILIUM-004 | 동일 노드는 되는데 노드 간 통신 실패 | 양쪽 cilium-health와 endpoint 경로 | 노드 경로·kvstore·datapath 일부 장애 | 건강 검사로 실패 구간을 분리 | 양쪽 노드·endpoint 연결 회복 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
