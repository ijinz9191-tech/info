# Gateway API CRD 검증과 route 충돌 진단

Topic: cncf/kubernetes-gateway
Version: Living official API design and Kubernetes kind tutorial 2026-01-28; no controller execution
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://gateway-api.sigs.k8s.io/guides/api-design/
- https://kubernetes.io/blog/2026/01/28/experimenting-gateway-api-with-kind/

<!-- evidence-sha256: 020c9a07dd3bfdea2ccab9f9765e6bdbfc88d68f3f15636a04f2617d1f69281d -->

## 공식 계약과 범위

단일 객체 admission은 여러 객체 사이의 참조 성공을 보장하지 않는다. controller status를 통해 비동기 결과를 확인한다. Gateway API 자체 validation webhook은 v1.1.0에서 제거됐지만 구현별 webhook까지 없는 것은 아니다. route별 구체 규칙을 우선하고 일반 conflict 지침은 그 규칙이 없을 때 적용한다.

## 가상 진단 시나리오

공식 계약에서 도출한 가상 사례다. 실제 공개 이슈 해결·운영 재현으로 세지 않는다. 모든 행에 위 버전과 Sources가 적용된다. 조치 후 검증은 수행해야 할 절차이며 실행 결과가 아니다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-GATEWAY-STATUS-001 | apply 성공 뒤 backend 응답 실패 | HTTPRoute 부모별 ResolvedRefs와 BackendNotFound | 참조 Service 이름·namespace 불일치 | 실제 backendRef와 Service를 대조 | ResolvedRefs 변화와 실제 요청 모두 확인 |
| SYN-GATEWAY-STATUS-002 | 동일 path가 다른 팀 backend로 감 | match specificity, 생성 시각, namespace/name | 중복 route의 precedence 적용 | 해당 route 규칙과 충돌 자원을 함께 분석 | 동일 요청의 선택 backend와 status 비교 |
| SYN-GATEWAY-STATUS-003 | CRD upgrade 후 controller 지원 불명 | CRD bundle-version과 GatewayClass SupportedVersion | 설치 bundle과 controller 지원 차이 | 지원 조합과 구현 릴리스 근거 확인 | 지원 condition 및 해당 기능 테스트 확인 |
| SYN-GATEWAY-STATUS-004 | 다른 구현에서 regex match가 달라짐 | controller·regex engine·conformance 범위 | implementation-specific 동작 차이 | 구현별 regex 규칙과 입력 fixture 비교 | 같은 요청 집합의 match 결과 확인 |
| SYN-GATEWAY-STATUS-005 | Accepted와 Programmed가 맞는데 외부 요청 실패 | Gateway address, 네트워크와 실제 응답 | control-plane 상태를 end-to-end 보장으로 오인 | data-plane 노출과 요청 경로 별도 확인 | 외부 연결·라우팅·backend 응답을 각각 검증 |
