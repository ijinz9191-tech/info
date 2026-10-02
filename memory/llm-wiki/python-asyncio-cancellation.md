# Python asyncio 취소·태스크 수명·예외 전파

Topic: Python asyncio
Version: 공식 Python 3.14.8 문서; 실습 런타임은 별도 표시
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.python.org/3/library/asyncio-task.html

<!-- evidence-sha256: 66fcdc0e677e899fe2406ec9d816d1b4002156034079799ed9f0603856d5613e -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-PY-001 | 코루틴 호출 후 작업이 실행되지 않음 | await·create_task·run 호출 위치 | 코루틴 객체 생성과 실행을 혼동 | 명시적으로 await하거나 태스크로 등록 | 부작용 실행 시점과 결과를 검사 |
| SYN-PY-002 | 취소 후 연결·파일이 남음 | CancelledError 경로와 finally 실행 기록 | 정리 누락 또는 취소 예외 삼킴 | finally에서 정리하고 취소를 전파 | 취소 후 자원 해제와 태스크 종료 확인 |
| SYN-PY-003 | 백그라운드 태스크 수명·예외가 불명확 | 태스크 소유자와 강한 참조·예외 회수 | 참조와 완료 처리를 유지하지 않음 | 참조 집합 또는 TaskGroup으로 소유 | 모든 태스크 종료와 예외 회수 확인 |
| SYN-PY-004 | 일부 작업 실패 뒤 형제 작업의 종료가 예상과 다름 | gather·TaskGroup 선택과 예외 처리 | 실패 전파 계약을 혼동 | TaskGroup의 형제 취소 계약을 고려 | 실패 주입 후 형제 종료·정리 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
