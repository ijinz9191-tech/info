# RabbitMQ DLX 유실·설정·순환 경계

Topic: frameworks/rabbitmq
Version: RabbitMQ 4.3 documentation; classic/quorum delivery differences
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://www.rabbitmq.com/docs/dlx

<!-- evidence-sha256: 14964cd5edfe8fe729d30529ddda1a14c99253c2b30bf359f52e155445059c54 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-DLX-001 | queue 만료 후 DLX에 없음 | queue expiry 여부 | 전체 queue 만료는 dead-letter 아님 | message TTL과 구분 | 조건별 메시지 추적 |
| SYN-DLX-002 | 정책 변경이 적용 안 됨 | queue x-arguments | arguments가 policy 우선 | 선언·정책 계약 정리 | 실효 설정 확인 |
| SYN-DLX-003 | DLX 메시지 유실 | dead-letter 시 exchange 존재 | 없는 exchange로 전송 | 동일 vhost exchange 준비 | 거절 메시지 추적 |
| SYN-DLX-004 | 선언 권한 오류 | queue read·exchange write | DLX 권한 부족 | 필요 권한 확인 | 선언과 DLX 처리 |
| SYN-DLX-005 | 예상 queue로 전달 안 됨 | 원래/설정 routing key | routing key 우선 계약 | binding과 key 정합성 | 알려진 key 전달 |
| SYN-DLX-006 | 순환 메시지 소실 | 동일 queue 재진입·rejection | 거절 없는 cycle 감지 | 순환 routing 제거 | 유한한 전달 경로 |
| SYN-DLX-007 | 대상 장애 중 DLX 유실 | queue 타입·확인 모드 | 기본 내부 confirms 없음 | 지원되는 at-least-once 조건 검토 | target 장애 복구 전달 |
| SYN-DLX-008 | quorum target으로 전달 실패 | target online quorum·broker 로그 | quorum 미충족 | quorum 복구 | 대기·전달과 중복 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
