# NetworkX 3.7 최대 유량·용량 계약

Topic: algorithms/graphs/maximum-flow
Version: Official NetworkX 3.7 docs; local package unavailable
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.flow.maximum_flow.html

<!-- evidence-sha256: 2dd3bb86ee8bf0963fb8372e26c7755bfd4250e88c3eb8d5d95145241b9ab765 -->

## 공식 계약과 범위

capacity 속성 누락은 무한 용량이다. default flow algorithm에 버전 독립성을 기대하지 않는다. MultiGraph 계열은 지원하지 않고 flow_func 없이 추가 kwargs를 주면 오류다. 실수 용량은 반올림 오차를 만들 수 있으며 의미·정밀도를 보존할 수 있을 때 integer scaling을 검토한다. 유량 cycle과 source 역유량이 있어도 순유량을 기준으로 해석한다.

## 가상 진단 시나리오

아래는 공식 원문에서 도출한 가상 사례다. 운영 재현·실제 공개 이슈 해결·모델 가중치 학습 결과가 아니다. 모든 행에 Sources와 version 범위가 적용되며 조치·검증은 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-NX-FLOW-001 | Unbounded exception | source→sink 누락 capacity 경로 | 무한 용량 경로 | 필수 capacity 검증 | 유한 입력의 유량·cut 비교 |
| SYN-NX-FLOW-002 | MultiGraph 오류 | graph 클래스 | 다중 graph 미지원 | 의미 보존 변환 검토 | 합산 capacity와 결과 확인 |
| SYN-NX-FLOW-003 | kwargs 입력 오류 | flow_func 지정 여부 | 알고리즘 지정 없이 추가 옵션 | 명시 algorithm 선택 | 해당 함수 옵션 지원 확인 |
| SYN-NX-FLOW-004 | upgrade 후 기본 algorithm 의존 차이 | version·선택 algorithm | default 함수 변경 가능 | flow_func 명시 검토 | 동일 입력의 보존·유량 비교 |
| SYN-NX-FLOW-005 | 미세 오차·cut 차이 | 실수 capacity·필요 precision | 이진 표현 오차 | 허용될 때 integer scaling 검토 | capacity 보존·cut 결과 비교 |
| SYN-NX-FLOW-006 | 역유량을 무조건 오류로 판단 | cycle과 net flow | 순유량과 edge 유량 혼동 | net flow 계약 대조 | 중간 node 유량 보존 확인 |
