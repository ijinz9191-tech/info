# Dapr 기본 정책 우선순위·재시도 계층

Topic: cncf
Version: Dapr docs v1.18; built-in/default interaction depends on operation
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.dapr.io/operations/resiliency/policies/default-policies/

<!-- evidence-sha256: 909a5dedac67c132770f7db1f01a2982eebce2f07a1d510b02398e3b19fbc58b -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-DAPR-DEFAULT-001 | 기본 정책 변경이 효과 없음 | named target·세부 default·global | 더 구체적인 정책 우선 | 해당 target의 해석 순서 점검 | 최종 선택된 정책 비교 |
| SYN-DAPR-DEFAULT-002 | 실패 호출 횟수 예상보다 많음 | 내장/default·연결 실패·호출 계수 | 일부 조건에서 재시도 계층 추가 | 각 계층과 작업별 설정 추적 | 실제 횟수·지연 측정; named 전환 효과 일반화 금지 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
