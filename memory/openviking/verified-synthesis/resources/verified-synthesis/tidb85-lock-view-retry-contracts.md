# TiDB 8.5 Lock View와 deadlock 재시도 경계

Topic: data/tidb-tikv
Version: Stable pages identify TiDB v8.5; Lock View introduced v5.1; no database execution
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.pingcap.com/tidb/stable/troubleshoot-lock-conflicts/
- https://docs.pingcap.com/tidb/stable/information-schema-deadlocks/

<!-- evidence-sha256: 9248b95c6e71b1c8a37c89754c40bf6f717df4b9e97d6e98385b49e2d48271f7 -->

## 공식 계약과 범위

Lock View는 pessimistic lock의 충돌·대기 정보이며 모든 optimistic 충돌의 전체 기록이 아니다. SQL digest text는 normalized query이고 여러 표를 join한 값은 동일 시점 snapshot이 아닐 수 있다. DEADLOCK_ID 여러 행은 하나의 대기 cycle이며 행 수를 사건 수로 세지 않는다. retryable statement deadlock은 내부 재시도로 client 오류가 없을 수 있고 기본 deadlock history에서 수집하지 않는다.

## 가상 진단 시나리오

아래는 공식 문서에서 도출한 가상 사례다. 실제 운영 재현이나 해결 완료가 아니다. Sources와 버전 범위는 모든 행에 적용된다. 조치와 검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-TIDB85-001 | DEADLOCKS가 비었는데 deadlock retry 로그 존재 | collect-retryable 설정과 statement retry 로그 | 기본 history가 retryable 사건 제외 | 수집 정책과 retry 분류를 대조 | history·로그·latency 관계 확인 |
| SYN-TIDB85-002 | 같은 오류를 여러 장애로 집계 | DEADLOCK_ID와 transaction waiting edges | cycle의 여러 행을 다른 사건으로 계산 | ID별 사건과 edge별 관계 구분 | cycle 수와 행 수 별도 집계 확인 |
| SYN-TIDB85-003 | Lock View join에 blocking transaction 없음 | 표 조회 시각과 transaction 완료 시각 | 비동시 live snapshot 또는 완료 transaction | 좁은 반복 조회와 시각 증거 보존 | 동일 key·transaction의 시간 관계 비교 |
| SYN-TIDB85-004 | pessimistic lock retry limit reached | 동일 hot key·max-retry-count·wait 추세 | 높은 동시 lock 충돌 | application lock 경합과 transaction 수명 조사 | retry·wait·처리량을 함께 확인 |
| SYN-TIDB85-005 | lock wait timeout을 deadlock으로 처리 | error type·innodb_lock_wait_timeout·cycle evidence | statement lock 대기와 cycle 혼동 | blocking transaction과 대기 budget 구분 | 대기 해소와 deadline 내 응답 확인 |
| SYN-TIDB85-006 | digest text에서 실제 인수 추정 실패 | normalized SQL와 digest metadata | 정규화된 text를 원 query로 오인 | 인수가 제거된 증거 범위를 유지 | query shape와 실제 승인된 원 증거를 별도 대조 |
