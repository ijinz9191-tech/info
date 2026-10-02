# Julia 컴파일 비용·타입·할당 진단

Topic: julia111-performance-evidence-contracts
Version: Julia 1.11.1 performance manual; version pinned
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.julialang.org/en/v1.11.1/manual/performance-tips/

<!-- evidence-sha256: e391e90f81dacb59dfeec9402801d64f7cb2dc2446ef4606dacca5ababdadf3c -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-JULIA-PERF-001 | 첫 실행만 느림 | 초기·반복 시간·컴파일 비율 | JIT 비용을 정상 실행 비용으로 오인 | 워밍업과 반복 측정 분리 | 같은 입력의 이후 실행 비교 |
| SYN-JULIA-PERF-002 | 전역 루프 느림 | global 타입·함수 경계 | 비타입 전역이 최적화 제한 | 핵심 연산을 함수와 인자로 분리 | 반복 시간·할당량 비교 |
| SYN-JULIA-PERF-003 | 숫자 배열 할당 증가 | Real 배열·원소 타입 | 추상 원소가 개별 객체 표현 유발 | 가능한 경우 구체 원소 타입 선택 | 배열 표현과 할당량 비교 |
| SYN-JULIA-PERF-004 | 구조체 필드 연산 느림 | 필드 선언·실제 타입 | 추상 필드로 컴파일 추론 제한 | 타입 매개변수로 구체 타입 보존 | 생성 객체의 추론 결과 확인 |
| SYN-JULIA-PERF-005 | 함수 필드 호출마다 dispatch | Function 필드·호출 타입 | 추상 Function 필드 사용 | callable 타입을 매개변수로 보존 | 같은 호출의 추론과 할당 비교 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
