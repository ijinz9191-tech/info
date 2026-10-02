# Kafka 소비자 poll·offset·수명 경계

Topic: kafka
Version: 4.0.2 Java API
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kafka.apache.org/40/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html

<!-- evidence-sha256: b2098bbfe489b7c023fdded46a8efe7d6ac9b51e6e7c06e5f154c228b7d71a4a -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-KAFKA-001 | heartbeat가 있어도 commit 실패 | poll 간격·max.poll.interval·CommitFailedException 확인 | 진행성 제한 초과로 그룹 이탈 | 배치 크기와 처리 시간 조정 | 느린 배치에서 poll·rebalance 검증 |
| SYN-KAFKA-002 | 재시작 후 예상보다 앞뒤에서 읽음 | position과 committed offset 비교 | 메모리 위치와 저장 위치 혼동 | 처리 완료와 commit 정책 일치 | 실패·재시작 데이터 대조 |
| SYN-KAFKA-003 | offset 숫자에 공백 | 압축·transaction 기록 확인 | offset 연속성 보장 없음 | 차이를 누락 메시지 증거로 단정하지 않기 | 실제 기록·consumer 결과 대조 |
| SYN-KAFKA-004 | 여러 thread 공유 소비자 오류·연결 누수 | 공유 호출·close 경로 확인 | consumer는 thread-safe가 아님·미종료 연결 | 소유 thread와 종료 수명 명시 | 동시 호출과 종료 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
