# Laravel queue timeout·재전달·commit 경계

Topic: Laravel queues
Version: Laravel 12.x 공식 문서; queue driver·PCNTL 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://laravel.com/framework/docs/12.x/queues

<!-- evidence-sha256: 148a064321c2bc2eb0efde87a14150342c29413bd24dc4cab69f61e8958dc8f9 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-LARAVEL-001 | 같은 job이 겹쳐 실행됨 | timeout·retry_after·시작 종료 로그 | worker가 종료되기 전에 job이 다시 노출 | timeout을 retry_after보다 충분히 짧게 설정 | 긴 작업에서 동시 재실행과 업무 중복 확인 |
| SYN-LARAVEL-002 | I/O가 job timeout을 넘겨 계속 대기 | HTTP·socket별 timeout과 PHP 확장 | 외부 I/O가 worker timeout을 따르지 않음 | API별 연결·요청 timeout과 PCNTL 지원 확인 | 멈춘 외부 시스템에 대한 제한시간 종료 검사 |
| SYN-LARAVEL-003 | SQS에 retry_after를 설정해도 예상과 다름 | 실제 driver와 visibility timeout | SQS 계약과 다른 driver 계약 혼동 | SQS의 visibility timeout을 확인 | 실제 재노출 시간과 재전달을 측정 |
| SYN-LARAVEL-004 | timeout이 났는데 failed 처리 정책이 기대와 다름 | job failOnTimeout·시도 수·failed 기록 | 시간 초과와 업무 실패 정책 혼동 | 실패 처리·재시도·중복 방어를 명시 | timeout 이후 상태와 후속 시도 결과 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
