# Django atomic·on_commit·테스트 트랜잭션

Topic: Django database transactions
Version: Django 5.2 문서; DB backend·isolation 별도 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.djangoproject.com/en/5.2/topics/db/transactions/

<!-- evidence-sha256: bba4ef2f35e328f38bbc0b1dd571f8e0a0472b93faa7630182b8d99efbfdc98d -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-DJANGO-001 | atomic 내부 예외를 잡은 뒤 다음 SQL도 실패 | 예외·savepoint·transaction 경계 | DB 실패를 내부에서 숨겨 broken transaction 유지 | atomic 바깥의 적절한 경계에서 처리 | 실패 주입 후 rollback 범위와 후속 SQL 확인 |
| SYN-DJANGO-002 | DB rollback 후 외부 작업은 이미 실행 | 부작용 실행 시각과 DB commit | 외부 작업을 commit 이전에 호출 | 적합한 부작용을 on_commit으로 미룸 | rollback이면 실행되지 않고 commit이면 실행 확인 |
| SYN-DJANGO-003 | on_commit 후속 작업 실패에도 DB 데이터 남음 | commit 완료 시각과 callback 예외 | callback을 DB 트랜잭션 일부로 오해 | 후속 작업의 복구·재시도 계약을 따로 설계 | DB 성공·후속 실패의 복구 경로 검사 |
| SYN-DJANGO-004 | TestCase에서 callback이 실행되지 않음 | 테스트 transaction과 종료 rollback | 실제 commit 없는 TestCase 계약 | captureOnCommitCallbacks 또는 맞는 테스트 범위 | 등록·순서·실행 조건을 명시적으로 검사 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
