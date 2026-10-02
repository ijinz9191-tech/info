# OpenTelemetry Collector 단계와 설정 합성 장애 계약

Topic: cncf/opentelemetry
Version: Official troubleshooting last modified 2026-03-01; Windows workaround limited to v0.90.1 and earlier
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://opentelemetry.io/docs/collector/troubleshooting/

<!-- evidence-sha256: 05bff27a166d20770362ab0687660f5ed01c997b3434b9cef12bca845e03e368 -->

## 공식 계약과 범위

debug exporter의 소량 test data로 각 hop의 수신·처리·export를 나눠 본다. 정의만 하고 pipeline에서 활성화하지 않은 receiver는 수신 경로가 아니다. attributes processor와 span-name 처리는 다르다. 합성 config의 뒤쪽 null이 앞쪽 값을 제거할 수 있다. 기존 scaling 페이지와 겹치는 queue 용량 사례는 새 독립 건수로 늘리지 않는다.

## 가상 진단 시나리오

공식 계약에서 도출한 가상 사례다. 실제 공개 이슈 해결·운영 재현으로 세지 않는다. 모든 행에 위 버전과 Sources가 적용된다. 조치 후 검증은 수행해야 할 절차이며 실행 결과가 아니다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-OTEL-STAGE-001 | receiver 설정이 있는데 데이터 없음 | receiver 정의와 service.pipelines 포함 여부 | pipeline 활성화 누락 | 의도한 signal pipeline에 receiver 연결 | 소량 입력의 수신·export evidence 확인 |
| SYN-OTEL-STAGE-002 | span 이름 변경이 적용 안 됨 | attributes processor 대상과 span name | 태그 변환을 이름 변환으로 오인 | 이름을 다루는 span processor 검토 | 동일 span의 name·attributes를 각각 비교 |
| SYN-OTEL-STAGE-003 | config 합성 후 processor 설정 소실 | config 적용 순서와 null·빈 map | 후순위 null의 이전 map 제거 | 불필요 빈 항목 제거 또는 명시 빈 map 사용 | resolved config와 실제 pipeline 동작 확인 |
| SYN-OTEL-STAGE-004 | 구형 Windows Docker Collector 시작 실패 | Collector 버전과 service-controller 오류 | v0.90.1 이하의 Windows service 실행 경로 | 해당 버전에서 NO_WINDOWS_SERVICE=1 경로 검토 | 컨테이너 시작 및 수신·export 확인 |
| SYN-OTEL-STAGE-005 | 앞 hop은 정상인데 다음 hop 데이터 없음 | 각 hop format, logs, receiver·exporter·DNS | 인접 hop protocol 또는 연결 설정 불일치 | 소량 synthetic payload로 경계를 하나씩 조사 | hop별 수신·변환·export와 최종 도착 확인 |
