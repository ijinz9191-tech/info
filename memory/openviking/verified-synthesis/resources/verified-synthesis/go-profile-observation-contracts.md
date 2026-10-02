# Go profile 선택·관측 간섭 경계

Topic: languages/go-diagnostics
Version: Official diagnostics overview; runtime/tool version and profiling overhead require measurement
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://go.dev/doc/diagnostics

<!-- evidence-sha256: 50da22b9a51ae6bd8f33bd580ffb028873cb4fb8be7ef7dfe1e1b687a25725f3 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-GOPROFILE-001 | 느린데 CPU profile에 원인 없음 | CPU 활동·I/O 대기 | CPU sampling은 대기 제외 | trace·block 증거 선택 | 대기 구간 확인 |
| SYN-GOPROFILE-002 | block profile 비어 있음 | profile rate | 기본 비활성 | 관측 비용 평가 후 활성 | 동기화 대기 식별 |
| SYN-GOPROFILE-003 | mutex 경합 안 보임 | mutex profile fraction | 기본 비활성 | 적절한 sampling 설정 | lock 경합 비교 |
| SYN-GOPROFILE-004 | heap·CPU 관측 서로 다름 | 동시 profiler 설정 | 관측 간섭 | profile 개별 수집 | 동일 부하 단독 비교 |
| SYN-GOPROFILE-005 | 관측 후 성능 저하 | profiling 전후 비용 | profiler overhead | 먼저 비용 측정 | 목표 허용 overhead |
| SYN-GOPROFILE-006 | goroutine 누수 추정만 있음 | 현재 goroutine stack | 수량만으로 수명 불명확 | 반복 stack·종료 조건 조사 | 부하 종료 후 잔류 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
