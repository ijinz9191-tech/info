# Python heapq 우선순위·정렬·빈 큐 경계

Topic: algorithms/python-heapq
Version: Python 3.13 documentation; runtime 3.13.13
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.python.org/3.13/library/heapq.html

<!-- evidence-sha256: fc6b7e17adcdd7d39ef9e904b1866519324f13ee159740dae909ecebc9f32712 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-HEAP-001 | 빈 큐 pop 실패 | heap 길이와 IndexError | 빈 heap | 빈 큐 계약 처리 | 빈·단일 원소 검사 |
| SYN-HEAP-002 | 최댓값을 기대했는데 최솟값 반환 | heap[0] 값 | min heap 계약 | 우선순위 표현 확인 | 정렬 기준 확인 |
| SYN-HEAP-003 | 고정 크기 heap 결과가 기대와 다름 | replace와 pushpop 선택 | 두 API 반환 계약 차이 | 작은 입력으로 계약 비교 | 새 값이 작고 큰 경우 확인 |
| SYN-HEAP-004 | merge 결과가 정렬되지 않음 | 각 입력 정렬 상태 | merge 입력 전제 위반 | 각 입력을 같은 방향으로 정렬 | 전체 출력 정렬 검증 |
| SYN-HEAP-005 | 동일 우선순위 객체에서 TypeError | tuple의 비교 대상 | 비교 불가능 task끼리 비교 | 고유 counter를 tie-breaker로 사용 | 동일 우선순위 순서 검사 |
| SYN-HEAP-006 | 우선순위 변경 뒤 pop 순서 오류 | heap 내부 원소 직접 변경 | heap 불변식 훼손 | 삭제 표시와 새 entry 등 소유 계약 | 변경·삭제 후 순서 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
