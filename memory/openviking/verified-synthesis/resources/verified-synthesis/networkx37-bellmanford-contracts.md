# NetworkX Bellman–Ford 음수 가중치·도달성

Topic: algorithms/networkx
Version: NetworkX 3.7 official docs; installed version not assumed
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.shortest_paths.weighted.bellman_ford_predecessor_and_distance.html

<!-- evidence-sha256: 48fa2bb5d3ddec75fb898bcf47cb062ed7b38706ebffc722ce50dbf8d5229a60 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-BELLMAN-001 | 음수 cycle에서 최단 경로 실패 | NetworkXUnbounded와 cycle | 비용을 계속 낮출 수 있음 | cycle 조사와 모델 제약 수정 | cycle 제거 후 경로 검증 |
| SYN-BELLMAN-002 | 분리 component의 cycle이 감지되지 않음 | source 도달 가능 집합 | source 기반 탐색 범위 | 전체 cycle 점검을 별도 설계 | 각 component 검사 |
| SYN-BELLMAN-003 | 가중치 누락으로 경로 비용이 다름 | edge weight 속성 | 누락 속성 기본값 1 | 가중치 데이터 검증 | 알려진 경로 합 비교 |
| SYN-BELLMAN-004 | 무방향 음수 edge에서 실패 | graph 방향과 edge 부호 | 왕복이 음수 cycle | 업무 모델의 방향·부호 수정 | 동일 조건의 유한 경로 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
