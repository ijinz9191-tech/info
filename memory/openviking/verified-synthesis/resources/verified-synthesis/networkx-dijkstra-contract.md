# NetworkX 최단 경로 입력 계약

Topic: networkx
Version: 3.7
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.shortest_paths.weighted.single_source_dijkstra.html

<!-- evidence-sha256: 07fc51208740064ad25ed211cf5dac3e1ee30059c6fb42847238dbbc023011ad -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-DIJK-001 | 음수 가중치 결과 불신 | edge 최소값·알고리즘 확인 | Dijkstra 보장 범위 밖 | 음수 지원 알고리즘 계약 검토 | 작은 그래프 기준 결과 대조 |
| SYN-DIJK-002 | 가중치 누락으로 예상 거리 불일치 | edge 속성 키 확인 | 누락 속성의 기본값 1 | 필수 속성 검증 | 경로 거리 수동 합산 |
| SYN-DIJK-003 | cutoff 밖 노드 결과 없음 | cutoff와 경로 가중치 합 확인 | 검색 중단 계약 | 필요 범위에 맞게 cutoff 설정 | 경계 안팎 노드 비교 |
| SYN-DIJK-004 | 일부 edge 경로에서 제외 | weight 함수 반환값 확인 | None은 숨김 edge | 필터 조건 명시 | 필터 전후 경로 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
