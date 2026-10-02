# Elixir TCP supervision 경계

Topic: languages/elixir
Version: 1.20.4 공식 학습 예제; production server 아님
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://elixir.hexdocs.pm/task-and-gen-tcp.html

<!-- evidence-sha256: 1f59e0baf2c28b6369fd23b1e5c6a497c164d718ca49ef205d61119f00c9cc3e -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-ELIXIR-001 | client 종료에 MatchError | recv 반환 tuple 확인 | closed를 ok로만 매칭 | error closed 분기 처리 | 종료 client와 새 연결 |
| SYN-ELIXIR-002 | 두 번째 client 응답 없음 | acceptor와 serve process 확인 | 같은 process에서 순차 serve | 연결별 supervised task | 동시 client 응답 |
| SYN-ELIXIR-003 | 한 연결 오류로 전체 종료 | link·supervision tree 확인 | task가 acceptor와 linked | Task.Supervisor.start_child 적용 | 한 task 실패 격리 |
| SYN-ELIXIR-004 | acceptor 종료가 client socket 종료 | controlling process 확인 | socket 소유자가 acceptor | 연결 task로 소유권 이동 | acceptor 실패 시 기존 연결 |
| SYN-ELIXIR-005 | supervised acceptor 재시작 안 됨 | child_spec restart 확인 | Task 기본 temporary | critical acceptor permanent 지정 | 실패 후 accept 재개 |
| SYN-ELIXIR-006 | 시작 순간 task supervisor 못 찾음 | children 순서 확인 | acceptor가 의존성보다 먼저 시작 | 의존성 뒤 acceptor 시작 | 시작·역순 종료 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
