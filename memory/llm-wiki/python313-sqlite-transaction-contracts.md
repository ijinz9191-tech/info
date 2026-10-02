# Python SQLite transaction·thread 경계

Topic: languages/python
Version: Python 3.13; 실행 3.13.13 / SQLite 3.51.2
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.python.org/3.13/library/sqlite3.html

<!-- evidence-sha256: 700420d18523c9f8522569fc756150eee57deaad6375ee3141a670f53413582d -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-PYSQLITE-001 | rollback으로 insert 취소 안 됨 | autocommit 값 확인 | True는 이미 자동 commit | 명시 transaction 정책 선택 | True·False 비교 |
| SYN-PYSQLITE-002 | with connection 후 connection 남음 | with exit·close 호출 확인 | context는 close 안 함 | close 또는 closing 수명 관리 | 종료 후 접근 실패 |
| SYN-PYSQLITE-003 | 다른 thread에서 ProgrammingError | 생성·사용 thread 확인 | 기본 check_same_thread 제한 | thread별 connection 검토 | thread 경계 검증 |
| SYN-PYSQLITE-004 | check_same_thread False면 안전하다고 판단 | SQLite threading mode·쓰기 동시성 확인 | Python guard와 DB 안전성 혼동 | 쓰기 직렬화·정확한 mode 적용 | 동시성·데이터 일관성 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
