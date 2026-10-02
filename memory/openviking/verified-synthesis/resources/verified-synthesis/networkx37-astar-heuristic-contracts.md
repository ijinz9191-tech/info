# NetworkX A* heuristic·cutoff 계약

Topic: networkx37-astar-heuristic-contracts
Version: NetworkX 3.7 API snapshot 2026-10-02
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.shortest_paths.astar.astar_path.html

<!-- evidence-sha256: d79f141e1828a95230b9e282591679507259472034be9daaece2e037b9d1b4f4 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-NX-ASTAR-001 | 최단 경로가 아닌 결과 | heuristic·실제 남은 비용 | 과대 추정 heuristic | admissible 추정 검토 | 작은 graph 기준 거리 비교 |
| SYN-NX-ASTAR-002 | 동적 heuristic 변경 미반영 | node별 첫 계산 | 첫 heuristic 값 cache | 한 탐색에서 고정 계약 유지 | 같은 node 재평가 가정 제거 |
| SYN-NX-ASTAR-003 | cutoff 안 경로 누락 | g+h·cutoff | inadmissible 추정으로 pruning | heuristic·cutoff 함께 확인 | cutoff 없는 결과와 비교 |
| SYN-NX-ASTAR-004 | 가중치 없는 edge 비용 오인 | weight attribute | 누락 edge는 1 취급 | 필수 weight 검증 | 누락·명시 weight 비교 |
| SYN-NX-ASTAR-005 | 연결 graph인데 NoPath | weight function 반환 | None으로 edge 숨김 | 허용 edge 조건 검토 | 필터 전후 도달성 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
