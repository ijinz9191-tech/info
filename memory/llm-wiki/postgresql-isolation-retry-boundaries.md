# PostgreSQL 격리·재시도 경계

Topic: postgresql
Version: 18
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://www.postgresql.org/docs/18/transaction-iso.html

<!-- evidence-sha256: feecba0a19101175c8a5f9a1f4b04f89dad873bbc4f2caef8884e9e64134ad57 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-PG-001 | 같은 트랜잭션 SELECT 결과 변화 | 격리 수준·동시 commit 확인 | Read Committed 문장별 snapshot | 필요 일관성에 맞게 격리 설계 | 동시 두 세션 결과 비교 |
| SYN-PG-002 | 동시 갱신 serialization 실패 | SQLSTATE·전체 트랜잭션 경로 확인 | snapshot 이후 동시 변경 | 전체 트랜잭션 처음부터 재시도 | 경합 후 불변식 확인 |
| SYN-PG-003 | Repeatable Read 업무 규칙 위반 | 동시 read/write 관계 확인 | snapshot isolation의 serialization anomaly | Serializable 또는 필요한 명시 잠금 설계 | 동시 commit 불변식 검증 |
| SYN-PG-004 | 롤백 후 sequence 번호 공백 | sequence 사용과 abort 확인 | sequence 변경 비롤백 | 연속 번호를 sequence 계약으로 가정하지 않기 | abort 후 번호 동작 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
