# Dapr 복원력 대상·방향·스트리밍 예외

Topic: cncf
Version: Dapr docs v1.18; HTTP service invocation streaming scope
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.dapr.io/operations/resiliency/targets/

<!-- evidence-sha256: 630bc8f6305cc7a43ac811cc615314235be8285d583ff0728deac38b7d06f69a -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-DAPR-TARGET-001 | 다른 서비스 정책 미적용 | targets/apps·대상 app-id | 발신/목적 app-id 혼동 | 목적 서비스 app-id 확인 | 해당 경로에 정책 적용 확인 |
| SYN-DAPR-TARGET-002 | 스트리밍 요청 재시도 없음 | HTTP·Content-Length·실제 retry | 알려진 길이 없는 요청은 retry 우회 | 요청 형태에 맞는 실패 복구 설계 | 스트리밍/고정 길이 호출 비교 |
| SYN-DAPR-TARGET-003 | 구독 delivery timeout 미적용 | pubsub inbound/outbound | 발행과 전달 방향 혼동 | sidecar→app는 inbound 지정 | publish와 delivery 따로 검증 |
| SYN-DAPR-TARGET-004 | 다른 actor까지 차단 영향 | actor type/id·breaker scope | type 범위로 상태 공유 | 의도한 id/type/both 선택 | 여러 actor ID의 실패 영향 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
