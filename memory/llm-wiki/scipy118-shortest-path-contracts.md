# SciPy shortest path 입력·복원 계약

Topic: scipy118-shortest-path-contracts
Version: SciPy 1.18.0 API snapshot 2026-10-02
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csgraph.shortest_path.html

<!-- evidence-sha256: 3ec8287a5c1bcf5c54bd8f64ae769af7aa0887bcdc8142e1f17127de9c7a1bcd -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SCIPY-PATH-001 | 큰 sparse graph 메모리 증가 | method FW·N | dense 변환과 cubic 비용 | graph 규모에 맞는 method 검토 | 메모리·시간 비교 |
| SYN-SCIPY-PATH-002 | 음수 cycle 오류 | NegativeCycleError·cycle | 최단 경로 정의 불가능 | cycle 입력·모델 확인 | cycle 제거 여부·의미 검증 |
| SYN-SCIPY-PATH-003 | undirected 결과 부정확 | 반대 edge 비용 | D·J는 비대칭 비용에서 제한 | 방향성·대칭 모델 확인 | 작은 방향 graph 기준 비교 |
| SYN-SCIPY-PATH-004 | 거리 결과가 비용과 다름 | unweighted 설정 | edge 수 최소화 선택 | 목적에 맞는 가중 설정 | hop 수·cost 각각 비교 |
| SYN-SCIPY-PATH-005 | predecessor 복원이 실패 | sentinel -9999 | 경로 없음 index를 사용 | no-path 확인 후 복원 | 도달·미도달 입력 검사 |
| SYN-SCIPY-PATH-006 | FW와 indices 조합 오류 | method·indices | 두 옵션 비호환 | 부분 출발점 지원 method 선택 | 출력 shape·source 대응 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
