# .NET ThreadPool 고갈·대기 증거

Topic: languages/dotnet
Version: Official tutorial applies .NET 9+; heuristics changed since .NET 6; no workload reproduced
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://learn.microsoft.com/en-us/dotnet/core/diagnostics/debug-threadpool-starvation

<!-- evidence-sha256: 887dacb73d374b6fd33675a33a403f30748a284a3d51eb12ed9ea4d7f1877bcb -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-POOL-001 | 낮은 CPU인데 latency 증가 | thread count 증가·완료율 | thread blocking 가능 | stack으로 blocking 원인 식별 | 동일 부하 지연·thread 비교 |
| SYN-POOL-002 | queue length 0이라 고갈 배제 | thread·CPU 함께 | queue 증가가 항상 아님 | 단일 지표 판정 피함 | 여러 지표와 stack 일치 |
| SYN-POOL-003 | 간헐 문제 stack에 없음 | 수집 시점·빈도 | 순간 snapshot 한계 | 시간 구간 trace 수집 | 실패 구간 wait stack |
| SYN-POOL-004 | 이전 runtime에 wait 이벤트 없음 | runtime 버전 | WaitHandleWait는 .NET 9 도입 | 버전별 진단 도구 선택 | 해당 runtime event 확인 |
| SYN-POOL-005 | 전용 thread wait를 pool 원인으로 셈 | worker stack 시작 | thread 종류 혼동 | pool worker인지 확인 | 원인 stack 분류 |
| SYN-POOL-006 | async API가 thread 차단 | Result·Wait 호출 | sync-over-async | await 경로로 변경 검토 | 처리량·thread·지연 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
