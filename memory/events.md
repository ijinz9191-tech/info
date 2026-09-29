# 이벤트 프로그래밍과 이벤트 기반 시스템

확인일: 2026-09-30. `이벤트`는 한 가지 기술을 뜻하지 않는다. **사용자 인터페이스의 입력**, **프로세스 안의 알림**, **서비스 사이에 전달하는 사실 기록**, **관측용 로그 이벤트**를 구분해야 설계가 명확해진다.

## 네 가지 이벤트

| 종류 | 예 | 중요한 계약 |
|---|---|---|
| UI 이벤트 | 버튼 클릭, 키 입력 | 리스너 수명, 전파, 중복 입력, 접근성 |
| 프로세스 내부 이벤트 | 파일 감시, EventEmitter, 콜백 | 동기/비동기 실행, 예외 전파, 구독 해제 |
| 도메인/통합 이벤트 | `OrderPlaced`, `PaymentCaptured` | 식별자, 스키마, 발행 시점, 재전달, 순서 |
| 관측 이벤트 | 구조화 로그, trace span event | 타임스탬프, trace ID, 민감 정보 제한 |

이름도 계약이다. 명령(`ShipOrder`)은 어떤 행동을 요청하고, 이벤트(`OrderShipped`)는 이미 일어난 사실을 표현한다. 이벤트를 명령처럼 사용하면 소유 서비스와 실패 처리 경계가 불분명해진다.

## 서비스 간 이벤트의 최소 필드

```json
{
  "id": "unique-event-id",
  "source": "/orders",
  "type": "example.order.placed",
  "time": "2026-09-30T00:00:00Z",
  "subject": "order-123",
  "schemaVersion": 1,
  "data": { "orderId": "order-123" }
}
```

이는 설명용 예제이며 실제 포맷은 사용하는 규약에 맞춘다. [CloudEvents 규격](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md)의 핵심 문맥 속성은 `id`, `source`, `specversion`, `type`이다. `time`, `subject` 등은 선택 속성이다. 위 예시는 CloudEvents 준수 메시지 자체가 아니므로 실제 연동 시 `specversion`과 포맷을 추가한다.

## 발행에서 처리까지

```text
업무 트랜잭션 → 이벤트 기록 → 브로커 전달 → 소비자 검증
    → 멱등 처리 → 결과 커밋 → offset/ack 확정 → 관측
```

1. **원자성:** DB 변경 뒤 발행 전에 프로세스가 죽으면 이벤트가 누락될 수 있다. DB와 발행 기록을 같은 트랜잭션에 저장하는 transactional outbox를 고려한다. 반대로 이벤트만 먼저 발행하면 실제 데이터가 롤백될 수 있다.
2. **중복:** 네트워크 재시도와 소비자 재시작은 중복 전달을 만든다. `event id` 또는 업무 키로 결과를 멱등 처리한다. `exactly once`라는 제품 기능도 외부 DB나 다른 서비스까지 자동으로 한 번만 변경해 주는 뜻은 아니다.
3. **순서:** 파티션 안에서 보장되는 순서를 전체 토픽의 순서로 확대 해석하지 않는다. 같은 엔터티의 이벤트가 같은 파티션 키를 쓰는지, 재처리 시 역전이 가능한지 확인한다.
4. **스키마:** 필드 추가, 필드 삭제, 의미 변경을 구분한다. 소비자를 먼저 배포해야 하는지, 생산자를 먼저 배포해야 하는지 호환성 표를 만든다.
5. **실패:** 일시 오류는 제한된 재시도와 backoff; 영구 오류는 별도 보관과 수동 검토; 독성 메시지는 무한 재시도하지 않는다.
6. **관측:** 대기 시간, 소비 지연, 재시도, 실패 보관, 처리 결과를 측정한다. trace context는 개인정보를 싣는 통로로 쓰지 않는다.

Kafka의 실제 전달·트랜잭션 의미는 [Apache Kafka 설계 문서](https://kafka.apache.org/design/)를 버전과 함께 확인한다. CloudEvents는 [공식 사양](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md)에서 속성·형식을 확인한다.

## UI/프로세스 내부 이벤트 점검

- 리스너를 등록한 쪽이 해제 책임을 갖는다. 화면 교체·컴포넌트 제거·서비스 종료 때 구독을 정리한다.
- 핸들러에서 예외가 발생하면 발행자에게 전파되는지, 비동기 작업의 거부로 남는지 프레임워크별로 확인한다.
- 같은 이벤트를 여러 번 받았을 때 안전한가? UI는 중복 클릭 방지, 서버는 멱등 키가 필요할 수 있다.
- 관측 로그는 `무엇이 발생했는지`를 기록하고, 도메인 이벤트는 다른 컴포넌트가 의존할 수 있는 계약이다. 두 자료의 보존·스키마 기준을 분리한다.

## 테스트 사례

정상 1회, 같은 ID 재전달, 다른 ID의 같은 업무 요청, 순서 역전, 스키마 이전/다음 버전, 소비 중단 뒤 재시작, 발행 직전/직후 장애, 브로커 지연, 잘못된 시간·미래 시간, 실패 보관 뒤 재처리를 각각 검사한다.

근거: [CloudEvents](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md), [Kafka Design](https://kafka.apache.org/design/), [OpenTelemetry 신호](https://opentelemetry.io/docs/concepts/signals/).
