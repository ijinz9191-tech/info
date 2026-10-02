# CPython 고정 코드의 list_resize와 메모리 해석

Topic: algorithms/cpython/list-allocation
Version: CPython source commit82fcaf881cddc8c735ed036ba5c1db81c5864276; Objects/listobject.c; not a release-independent ABI guarantee
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://github.com/python/cpython/blob/82fcaf881cddc8c735ed036ba5c1db81c5864276/Objects/listobject.c

<!-- evidence-sha256: f8e257f8aaf98830a157d888b94045ac3d916f5efc51bd0e455d435e0188e913 -->

## 공식 계약과 범위

고정 원문 SHA-256 ae082e295971b1c7cd2156d43421be07c6f4faf5fdf3577c695de22dcc564432의 list_resize를 읽었다. allocated 용량 안이고 새 길이가 절반 이상이면 realloc 없이 길이만 바꾼다. 증가 여유와 4의 배수 rounding, 큰 bulk 증가에서 여유 축소 경로가 있다. shrink allocation 실패는 길이를 줄이고 성공을 반환할 수 있어 메모리 capacity 감소와 논리 길이 감소가 같지 않다. Py_GIL_DISABLED 경로는 새 배열·atomic pointer store를 쓰며 일반 realloc 경로와 구분한다. 이 구현을 모든 Python runtime의 보장으로 일반화하지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-CPYTHON-LIST-ALLOC-001 | append마다 memory가 늘지 않음 | logical length·allocated 경계 | 여유 용량 재사용 | 길이와 capacity 관측 분리 | 증가 구간별 값·크기 대조 |
| SYN-CPYTHON-LIST-ALLOC-002 | 일부 원소 삭제 뒤 capacity 유지 | 새 길이·allocated 절반 | shrink threshold 미도달 | capacity와 참조 해제 구분 | threshold 전후 관측 |
| SYN-CPYTHON-LIST-ALLOC-003 | bulk 증가 때 다른 패턴 | 새 길이 증가량·여유 | 과대 allocation 억제 경로 | append·bulk 경로 구분 | 동일 최종 길이의 capacity 대조 |
| SYN-CPYTHON-LIST-ALLOC-004 | 길이 감소인데 memory 변화 없음 | shrink allocation 실패·기존 capacity | 실패해도 logical shrink 성공 | 반환 값과 retained capacity 구분 | 통제 allocator 실패 경로 검사 |
| SYN-CPYTHON-LIST-ALLOC-005 | 내부 배열 pointer 오래 참조 | resize·ob_item 갱신 | resize 후 pointer 변경 가능 | 공식 C API·소유권 계약 사용 | extension lifetime·resize fixture 검사 |
| SYN-CPYTHON-LIST-ALLOC-006 | free-threaded 분석이 기존과 다름 | Py_GIL_DISABLED·atomic 경로 | 다른 allocation·공유 경로 | build mode와 고정 source 대조 | 해당 build의 수명·memory 관측 |
