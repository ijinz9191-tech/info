# Spring Boot metric registry·tag 계약

Topic: springboot411-metric-registry-contracts
Version: Spring Boot current metrics reference snapshot; 4.1.1 external config sibling
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-boot/reference/actuator/metrics.html

<!-- evidence-sha256: 1d221c1e19f50129c93e9ea77f4ca718ba166d0c1567b7f40054e6043c472a42 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-BOOT-METER-001 | MeterFilter가 metric에 미적용 | registry 등록 경로 | static global registry 사용 | Spring-managed registry 주입 | 필터 결과 확인 |
| SYN-BOOT-METER-002 | Graphite tag 순서 변화 | common tags 순서 | properties 순서 보장 안 됨 | custom MeterFilter 검토 | 같은 tag 순서 확인 |
| SYN-BOOT-METER-003 | 일부 metric 전체 누락 | enable prefix | 해당 prefix filter false | 목적에 맞는 prefix 조정 | 다른 ID와 함께 확인 |
| SYN-BOOT-METER-004 | percentile을 여러 instance 합산 | 설정·aggregation | 로컬 percentile과 histogram 혼동 | aggregable histogram 검토 | 집계 질의·bucket 확인 |
| SYN-BOOT-METER-005 | histogram bucket 범위 과다 | expected min·max | 실제 범위보다 넓은 설정 | 관측 범위로 clamp 검토 | bucket 수·관측 범위 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
