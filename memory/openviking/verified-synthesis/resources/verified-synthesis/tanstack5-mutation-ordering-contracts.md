# TanStack Query mutation 순서·callback·복원

Topic: frameworks/tanstack-query/mutation-ordering
Version: TanStack Query v5 latest docs; exact patch and update date unspecified; no client execution
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://tanstack.com/query/latest/docs/framework/react/guides/mutations

<!-- evidence-sha256: 99c3d5d686887a05b36872821b7f2dde976de60259553bf3a0a39d3f6e067060 -->

## 공식 계약과 범위

mutation은 기본 병렬이며 동일 scope.id의 mutation을 직렬화할 수 있다. client scope는 서버 전체 상호배제나 exactly-once 보장이 아니다. mutate에 넘긴 추가 callback은 연속 호출에서 마지막 호출의 observer에 대해 한 번 실행되며 component가 mounted여야 한다. useMutation 옵션 handler는 각 호출마다 실행된다. 마지막 완료가 아니라 마지막 호출이며 완료 순서는 호출 순서와 다를 수 있다. mutation 기본 retry는 없으며 재시도는 멱등성을 고려한다. 상태 persistence가 함수 직렬화를 뜻하지 않으므로 재개에는 default mutationFn이 필요하다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-TAN-MUT-001 | 결과 순서 뒤바뀜 | 호출·완료 순서 | 기본 병렬 실행 | 필요 시 동일 scope.id 검토 | 순서·최종 상태 확인 |
| SYN-TAN-MUT-002 | 연속 호출 callback 누락 | callback 등록 위치 | 마지막 호출 observer 재구독 | 매 호출 작업은 useMutation 옵션 handler 검토 | 호출·완료 순서와 횟수 확인 |
| SYN-TAN-MUT-003 | 이동 후 callback 미실행 | unmount 시점 | 추가 callback 수명 종료 | 필수 처리 위치 재설계 | 이동 중 완료 확인 |
| SYN-TAN-MUT-004 | 오류 자동 재시도 없음 | retry 설정 | mutation 기본 retry 없음 | 멱등성 고려 후 명시 | 오류·횟수 확인 |
| SYN-TAN-MUT-005 | 재시작 후 mutationFn 없음 | 복원 상태·defaults | 함수 직렬화 불가 | default mutationFn 제공 | 복원·재개 확인 |
