# NetworkX 3.7 DAG 위상 정렬 계약

Topic: algorithms/graphs/topological-order
Version: Official NetworkX 3.7 docs; local package unavailable
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.dag.topological_sort.html

<!-- evidence-sha256: 92842fe42f66a0ba05bd2f28679ce165c2768b29d6a1d205d8c8560374721ee2 -->

## 공식 계약과 범위

DAG 노드의 유효 순서는 유일하지 않을 수 있다. topological_sort는 generator이므로 예외가 소비 시점에 발생할 수 있다. 순회 중 graph 변경은 피하며 작업이 edge인 모델에는 line_graph 변환의 의미를 검토한다.

## 가상 진단 시나리오

아래는 공식 원문에서 도출한 가상 사례다. 운영 재현·실제 공개 이슈 해결·모델 가중치 학습 결과가 아니다. 모든 행에 Sources와 version 범위가 적용되며 조치·검증은 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-NX-TOPO-001 | 순회 중 Unfeasible | cycle·exception 시점 | DAG 조건 위반 후보 | cycle 점검 | 모든 edge 선후 관계 확인 |
| SYN-NX-TOPO-002 | 호출 성공 뒤 소비에서 실패 | generator 소비 위치 | 지연 exception | 순회까지 exception 처리 | cyclic 입력의 소비 결과 확인 |
| SYN-NX-TOPO-003 | 순회 중 RuntimeError | graph 변경 기록 | iterator 소비 중 graph 변경 | 변경 분리·snapshot 검토 | 고정 graph 순회 확인 |
| SYN-NX-TOPO-004 | 무방향 graph 오류 | graph type | 방향 graph 요구 | 모델 방향성 확인 | directed 입력 검증 |
| SYN-NX-TOPO-005 | 예상 목록 순서와 다름 | edge·동률 node | 정렬 비유일성 | 단일 순서 가정 제거 | 모든 dependency 관계 검증 |
| SYN-NX-TOPO-006 | 작업 순서 의미가 다름 | 작업이 node인지 edge인지 | graph 표현 모델 불일치 | edge 작업이면 line_graph 검토 | 원래 작업 dependency와 대조 |
