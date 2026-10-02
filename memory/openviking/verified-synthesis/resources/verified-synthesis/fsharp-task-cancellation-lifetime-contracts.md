# F# task 시작·취소·정리·tailcall 계약

Topic: languages/fsharp/task-expressions
Version: Living Microsoft F# reference; task implementation F# 6+, and! task bindings F# 10+; local compiler unavailable
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/task-expressions

<!-- evidence-sha256: 76d1c8cbc44eda58fa674a98a51d765556f4644d55a3a915c859d40931a70b08 -->

## 공식 계약과 범위

task는 만들어질 때 즉시 시작하고 첫 비동기 중단까지 현재 thread에서 실행한다. cancellation token의 암묵 전파·검사는 없다. 취소 지원 overload와 명시 검사가 필요하다. use/use!는 scope 종료 시 정리하며 IAsyncDisposable 정리는 비동기다. with/finally handler 자체는 동기다. task의 return! 재귀는 tailcall이 아니므로 무한 task chain 위험이 있다. and!는 F# 10부터다. 페이지는 last-updated 2025-05-25를 표시하면서 F# 10 내용을 포함하므로 그 날짜를 기능 도입 시점으로 해석하지 않는다. SDK·F# compiler가 발견되지 않아 로컬 실행은 하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-FSHARP-TASK-001 | await 전에 부작용 실행 | task 생성·첫 중단 시각 | 즉시 시작 계약 오해 | 생성 위치와 실행 비용 조사 | 생성·중단·await 순서 fixture 확인 |
| SYN-FSHARP-TASK-002 | token 취소 후 I/O 계속 | 사용 overload·token 전달 | token 전파 누락 | 취소 지원 overload와 명시 검사 | 취소 후 완료·정리 상태 확인 |
| SYN-FSHARP-TASK-003 | 비동기 finally 구현 실패 | handler·정리 형식 | 동기 handler에 await 요구 | IAsyncDisposable use 정리 검토 | 정리 완료와 exception 전파 확인 |
| SYN-FSHARP-TASK-004 | resource 정리 수명 기대 차이 | use! scope·escape된 값 | scope 종료 후 사용 | scope와 자원 소유권 대조 | 성공·실패 종료에서 disposal 확인 |
| SYN-FSHARP-TASK-005 | task 재귀에서 stack·heap 증가 | return! chain·중단 위치 | tailcall 지원 오인 | 명시 loop 또는 async 계약 검토 | 유한 부하에서 결과·메모리 관찰 |
| SYN-FSHARP-TASK-006 | and! task 구문 미지원 | F# compiler version | F# 10 이전 compiler | 실제 언어 버전 대조 | 지원 버전에서 동시 await 검사 |
