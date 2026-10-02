# SQLAlchemy Session 상태 진단

Topic: frameworks/python
Version: 2.0.54 FAQ; legacy Query 항목 명시
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.sqlalchemy.org/en/20/faq/sessions.html

<!-- evidence-sha256: 7926341e6ce7c6b826a3f5b7cc6bf3c7859493466bb2b86393014df09d19b2e6 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SYN-SA-001 | flush 오류 후 Session 재사용 실패 | 예외·rollback 호출 확인 | logical transaction 비활성 | 명시 rollback 또는 close | 새 작업 정상 수행 |
| SYN-SYN-SA-002 | 다른 transaction 변경 안 보임 | identity map·격리 수준 확인 | 이미 읽은 속성 유지 | expire/refresh 또는 새 transaction | DB 격리 조건별 확인 |
| SYN-SYN-SA-003 | legacy Query count와 객체 수 다름 | join 행·primary key 비교 | entity PK 중복 제거 | 행 수와 entity 수 구분 | 각각 예상 개수 검증 |
| SYN-SYN-SA-004 | joinedload alias로 정렬 실패 | SQL alias 확인 | eager join은 익명 | 조회용 join 별도 구성 | 정렬·관련 객체 확인 |
| SYN-SYN-SA-005 | FK 변경 후 관계 객체 그대로 | persistent 상태·loaded 관계 확인 | FK 변경이 즉시 관계 갱신 안 함 | 관계 객체 직접 할당 | flush 후 FK·관계 일치 |
| SYN-SYN-SA-006 | 실패 작업 때문에 전체 transaction 중단 | SAVEPOINT 범위 확인 | DB 실패 상태 지속 | 지원 조건에서 begin_nested 적용 | 부분 rollback·외부 transaction 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
