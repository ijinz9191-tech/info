# Gateway API namespace 간 참조와 권한 계약

Topic: cncf/kubernetes-gateway
Version: Living official ReferenceGrant and implementer documents read 2026-10-02; deployed CRD/controller version must be checked
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://gateway-api.sigs.k8s.io/reference/api-types/referencegrant/
- https://gateway-api.sigs.k8s.io/guides/implementers-guide/

<!-- evidence-sha256: 33dd2542190b258ab5b76d02b97fc93e113a9f525b96529ac1f6ab35d479b9f5 -->

## 공식 계약과 범위

ReferenceGrant는 참조 대상 namespace에 두고 from group/kind/namespace와 to group/kind를 대조한다. Route→Gateway 연결의 listener handshake는 별도 경로다. Grant가 없으면 대상 존재 여부도 상태로 누출하면 안 된다. controller는 grant 변경·삭제 시 다시 판단해야 한다. API bundle과 구현의 conformance는 버전별이다.

## 가상 진단 시나리오

공식 계약에서 도출한 가상 사례다. 실제 공개 이슈 해결·운영 재현으로 세지 않는다. 모든 행에 위 버전과 Sources가 적용된다. 조치 후 검증은 수행해야 할 절차이며 실행 결과가 아니다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-GATEWAY-GRANT-001 | 다른 namespace backend가 거절됨 | backend namespace와 grant 배치·from·to | 대상 namespace의 grant 부재 또는 불일치 | 대상 owner가 정확한 참조만 허용 | 참조 상태와 실제 해당 backend 요청을 비교 |
| SYN-GATEWAY-GRANT-002 | grant 삭제 뒤 이전 backend 경로 유지 | 삭제 시각, controller watch·reconcile, data plane | 참조 재판정 지연 또는 구현 결함 후보 | watch·reconcile 증거와 현재 구현 버전 조사 | 허용 상태 철회와 이전 경로 차단을 각각 확인 |
| SYN-GATEWAY-GRANT-003 | Route가 Gateway에 attach 안 됨 | parentRef, listener namespace 허용, hostname | backend용 grant를 attach handshake와 혼동 | listener 허용 조건을 별도로 대조 | 해당 parent의 Accepted 및 요청 경로 확인 |
| SYN-GATEWAY-GRANT-004 | grant 없이 타 namespace 객체 존재가 노출됨 | status message와 grant 유무 | 구현의 정보 노출 후보 | 참조 불허를 우선 설명하는 status 처리 검토 | 존재·미존재 대상에 대한 정보 누출 비교 |
| SYN-GATEWAY-GRANT-005 | 구현 업그레이드 후 기능 조합 실패 | bundle-version, channel, supportedFeatures, conformance | 이전 버전 통과를 현재 조합 지원으로 오인 | 현재 버전의 조합별 conformance 확인 | 해당 route·backend 정책 조합 fixture로 검증 |
