# Kubernetes Service 증거 기반 진단

Topic: cncf/kubernetes
Version: 현재 공식 가이드; 구현별 적용
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/

<!-- evidence-sha256: 2074505079f143dbc2abe326241d31ff79ce171257729342f910b1f8a8a5cdaf -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SYN-KSVC-001 | Service endpoint 없음 | EndpointSlice·Pod label 비교 | selector 불일치 | selector·label 정합화 | 주소 목록과 요청 확인 |
| SYN-SYN-KSVC-002 | DNS 정상인데 연결 실패 | port·targetPort·protocol 확인 | 포트 선언 오류 | 실제 Pod 포트로 수정 | Pod IP와 Service IP 각각 확인 |
| SYN-SYN-KSVC-003 | named targetPort 실패 | Pod named port 확인 | 이름 부재 또는 숫자 문자열 | 이름 또는 숫자 타입 수정 | EndpointSlice 포트 확인 |
| SYN-SYN-KSVC-004 | Pod 직접 연결도 실패 | Pod IP·Pod 포트 요청 | 앱 또는 Pod 경로 문제 | 앱 로그·수신 상태 조사 | 각 endpoint 응답 |
| SYN-SYN-KSVC-005 | Service만 실패 | Pod 성공·proxy 구현 확인 | Service 데이터 경로 문제 | 사용 중인 proxy 구현 조사 | Service 경유 요청 |
| SYN-SYN-KSVC-006 | 특정 유입 차단 | NetworkPolicy ingress 확인 | 허용 규칙 불일치 | 필요 흐름만 허용 | 허용·비허용 요청 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
