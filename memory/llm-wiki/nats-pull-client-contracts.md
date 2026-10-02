# NATS pull consumer 언어별 빈 결과 진단

Topic: cncf/nats
Version: 현재 공식 pull guide; client 버전 별도 검증
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.nats.io/learn/jetstream/pull-consumers

<!-- evidence-sha256: 7e209804dcdac43bafc02921b6f7483d083a06716ec07ec1df545c44cfe4050a -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-NATS-001 | 조용한 stream에서 worker 종료 | 408·empty batch·client 예외 확인 | 빈 pull을 장애로 판단 | SDK별 정상 빈 결과 처리 | 대기 후 새 메시지 처리 |
| SYN-NATS-002 | Python fetch timeout 미처리 | nats.errors.TimeoutError 확인 | Python 예외 계약 무시 | 해당 timeout 처리 후 반복 | 빈 stream·새 메시지 확인 |
| SYN-NATS-003 | Go 일부 batch 후 오류 누락 | Messages 종료 후 Error 확인 | batch 오류 별도 전달 | msgs.Error 검사 | 부분 결과와 오류 처리 |
| SYN-NATS-004 | C timeout의 부분 결과 누락 | status·list.Count 확인 | timeout이어도 수신분 존재 가능 | NATS_TIMEOUT 결과 목록 처리 | partial batch·메모리 해제 |
| SYN-NATS-005 | CLI count 전체 대기 예상 불일치 | 단일 pull별 timeout 확인 | count는 순차 단일 pull | SDK batch와 CLI 동작 구분 | 실측 전체 대기 시간 |
| SYN-NATS-006 | 단발 fetch 뒤 소비 중단 | fetch 호출 횟수 확인 | fetch는 유한 batch | 다음 fetch 또는 SDK consume 사용 | 후속 메시지 처리 |
| SYN-NATS-007 | 연속 소비 중 resource 누수 | consume stop·scope 확인 | 지속 소비 lifecycle 미종료 | SDK stop/dispose 적용 | 종료 후 소비·참조 해제 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
