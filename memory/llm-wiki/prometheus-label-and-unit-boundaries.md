# Prometheus label cardinality와 단위 계약

Topic: Prometheus metrics
Version: 현재 공식 naming practices; 배포 버전·부하 별도 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://prometheus.io/docs/practices/naming/

<!-- evidence-sha256: 3ba7b68449064aca5a831e240de2f85e5e3d6ed8ca5dc4b1034c339a1af280a6 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-PROM-001 | 신규 label 뒤 저장·조회 비용 급증 | 시계열 수와 label 조합 수 | user ID 등 무제한 값을 label로 사용 | 유한한 업무 분류로 label 설계 | 기간별 시계열 증가와 쿼리 비용 확인 |
| SYN-PROM-002 | 집계 뒤 metric 이름의 의미가 혼란 | 이름·label·aggregation 결과 | label 차원을 이름에 중복 포함 | label과 metric 의미를 분리 | label 집계 전후 이름과 수치 해석 확인 |
| SYN-PROM-003 | 대시보드 값이 천 배 차이 | exporter 원단위와 metric 접미사 | ms와 seconds 등 단위 불일치 | base unit 계약을 통일 | 알려진 입력에 대한 노출 값 검사 |
| SYN-PROM-004 | 사용량 비율을 퍼센트로 잘못 표시 | metric 값과 대시보드 변환 | 0~1 ratio와 0~100 혼동 | ratio 단위와 표시 변환 명시 | 0·0.5·1의 화면 값 검사 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
