# Celery 작업 확인·worker 손실 진단

Topic: frameworks/python
Version: 5.6.3; 현재 stable 5.6 문서
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.celeryq.dev/en/stable/userguide/tasks.html

<!-- evidence-sha256: cdf3871e63fe53b52711d18aa0a00a3f005bcb37c8f8bf25c6114704b7a0ac07 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CELERY-001 | 작업 시작 후 실패했는데 재전달 안 됨 | 기본 ack 시점 확인 | 실행 전에 ack | 멱등 작업에 acks_late 검토 | 실패 지점별 재전달 |
| SYN-CELERY-002 | acks_late인데 child 종료 후 ack | child signal·exit 확인 | worker child 손실도 기본 ack | reject_on_worker_lost 조건 검토 | 반복 실패 루프 포함 검증 |
| SYN-CELERY-003 | worker가 장시간 멈춤 | 실행 task·I/O timeout 확인 | 무제한 network 대기 | connect/read timeout 적용 | timeout 후 자원 정리 |
| SYN-CELERY-004 | time limit 뒤 정리 실패 | 강제 종료 기록 확인 | process kill 경계 | I/O timeout 우선 설계 | 종료·중간 결과 처리 |
| SYN-CELERY-005 | 긴 작업이 짧은 작업 지연 | worker routing 확인 | 작업 시간 분포 혼재 | 전용 worker로 routing | 짧은 작업 지연 측정 |
| SYN-CELERY-006 | task 이름 충돌 | registered 목록·name 확인 | 고유 namespace 부재 | module namespace 명시 | 등록·실행 대상 일치 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
