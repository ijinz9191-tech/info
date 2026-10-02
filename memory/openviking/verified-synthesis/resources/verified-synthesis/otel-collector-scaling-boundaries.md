# OpenTelemetry Collector 큐·backend·stateful 확장

Topic: OpenTelemetry Collector
Version: 현재 공식 scaling 문서; 컴포넌트 버전별 metric 이름 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://opentelemetry.io/docs/collector/scaling/

<!-- evidence-sha256: 9c38daa43dc644b9f6fd2a927341e89b61e469d590b9539691e7b2bd2b2fdbe9 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-OTEL-001 | exporter 큐가 계속 차며 데이터가 거절됨 | queue size·capacity·enqueue failed | 수신량보다 export가 느림 | worker·backend·네트워크 병목을 먼저 구분 | 큐 회복과 end-to-end 전달을 확인 |
| SYN-OTEL-002 | Collector 증설 후 backend 실패 증가 | send failed와 backend 처리 지연 | backend 포화에 수집 측 부하를 추가 | backend 용량과 전송률을 조정 | 수집·export·backend 지연 동시 비교 |
| SYN-OTEL-003 | tail sampling 확장 후 trace 일부 span 누락 | 동일 trace ID의 Collector 분산 | stateful sampling 상태가 여러 인스턴스로 분리 | trace ID 기반 routing과 sampling 계층 설계 | 완전한 trace 입력의 sampling 일관성 검사 |
| SYN-OTEL-004 | gRPC 트래픽이 한 Collector에만 집중 | 장기 연결과 backend 분포 | L4 연결 분산만으로 요청 분산을 기대 | gRPC 이해하는 L7 분산 검토 | 연결·요청·인스턴스별 부하 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
