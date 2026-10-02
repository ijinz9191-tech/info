# RabbitMQ 확인·재전달 진단

Topic: frameworks/messaging
Version: 4.3 AMQP 0-9-1
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://www.rabbitmq.com/docs/confirms

<!-- evidence-sha256: 61e60ebede768cbf8e53f16bf26ae9902d7e74ce616c5a7b156fdfd85edc6c22 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SYN-RABBIT-001 | confirm 후 업무 완료로 판단 | consumer 결과 확인 | confirm은 broker 수락 범위 | 업무 결과 별도 추적 | broker·업무 완료 각각 검증 |
| SYN-SYN-RABBIT-002 | unknown delivery tag | 수신·ack channel 확인 | 다른 channel 또는 중복 ack | 원래 channel에서 한 번 ack | channel 종료 없는 처리 |
| SYN-SYN-RABBIT-003 | 메시지 처리 전 유실 | autoAck·종료 시점 확인 | 전송 즉시 ack 처리 | 처리 후 manual ack 설계 | 실패 시 재전달 확인 |
| SYN-SYN-RABBIT-004 | 재전달 CPU 급증 | requeue 반복 확인 | 실패 소비자의 즉시 재큐 | 지연·최대 재시도 설계 | 반복률 감소와 실패 보관 |
| SYN-SYN-RABBIT-005 | prefetch 0에도 메모리 증가 | 미확인 delivery 확인 | 0은 channel 무제한 | 유한 prefetch 조정 | 메모리·처리량 검증 |
| SYN-SYN-RABBIT-006 | basic.get에 prefetch 무효 | pull API 확인 | QoS 적용 범위 밖 | pull 빈도·작업 수 제한 | 동시 작업 상한 확인 |
| SYN-SYN-RABBIT-007 | 연결 복구 후 중복 처리 | 처리 완료·ack 손실 확인 | 미확인 메시지 재큐 | 멱등 처리 설계 | 같은 메시지 재처리 검증 |
| SYN-SYN-RABBIT-008 | confirm인데 미라우팅 | mandatory return 확인 | queue 없는 publish도 confirm | return과 confirm 함께 처리 | 라우팅 실패 감지 |
| SYN-SYN-RABBIT-009 | confirm 순서 불일치 | sequence별 확인 | 비동기 완료 순서 차이 | 순서 대신 sequence 추적 | out-of-order 확인 처리 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
