# OpenTelemetry gateway discovery·routing·관측

Topic: cncf/opentelemetry/gateway-routing
Version: Living Collector gateway reference read 2026-10-02; deployed component version unspecified
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://opentelemetry.io/docs/collector/deploy/gateway/

<!-- evidence-sha256: aee647fe7683ec77508c19c503872b4035c08df85c38f333964e2b3050971273 -->

## 공식 계약과 범위

처리가 필요한 signal을 두 단계 gateway에서 목적에 맞게 routing한다. static/DNS resolver의 backend 집합과 service/trace routing_key 의도를 대조한다. backend 계수·latency metric은 설치 component 버전과 비교한다. metric stream 식별과 writer 충돌을 조사한다. 기존 trace-ID affinity 사례는 재등록하지 않는다. tail-sampling processor·loadbalancer 코드 본문을 읽지 못해 내부 세부 계약을 검증한 것으로 쓰지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-OTEL-GATE-001 | 새 backend 미사용 | resolver 집합·DNS | 발견 대상 누락 | 구성·DNS 비교 | backend 집합·수신 확인 |
| SYN-OTEL-GATE-002 | 처리 목적과 routing 불일치 | routing_key·signal 요구 | service/trace 선택 혼동 | 요구별 routing 계약 확인 | 동일 key 도착지 추적 |
| SYN-OTEL-GATE-003 | backend 감소 미감지 | num_backends | discovery 문제 후보 | backend metric 관찰 | 기대 집합·계수 대조 |
| SYN-OTEL-GATE-004 | gateway 추가 후 지연 | backend_latency·단계 시간 | cascaded 비용 후보 | 각 단계 지연 조사 | 전후 end-to-end 비교 |
| SYN-OTEL-GATE-005 | metric 값 충돌 | stream identity·writer | 다중 writer·비유일 resource | 식별·단일 writer 설계 | stream 중복·값 대조 |
