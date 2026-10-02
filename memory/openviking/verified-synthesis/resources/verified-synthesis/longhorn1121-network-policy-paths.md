# Longhorn iSCSI·Ambient 복구 경로

Topic: longhorn1121-network-policy-paths
Version: Longhorn 1.12.1 reported KB symptoms; 1.12.2+ Helm migration separate
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://longhorn.io/kb/troubleshooting-volume-attachment-stuck-cni-networkpolicies/

<!-- evidence-sha256: 9b2bf164a5ba2648f5d24efe5a9f415be014d8f4b4f73a3a156e8f6b377e0e99 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-LONGHORN-NET-001 | V1 volume attaching 지속 | host→instance-manager 3260 deny | host origin은 pod selector와 다름 | CNI 실제 source 기준 허용 검토 | iSCSI·attachment 정상화 확인 |
| SYN-LONGHORN-NET-002 | RWX recovery 미완료 | ztunnel 15008 timeout | Ambient tunnel이 application port보다 앞서 차단 | 해당 mesh 경로만 보완 | share-manager Ready·flow 확인 |
| SYN-LONGHORN-NET-003 | 예제 CIDR 적용 후 계속 실패 | CNI translated source | 예제 range가 실제 source와 다름 | 각 failover node source 관찰 | 모든 대상 node flow 확인 |
| SYN-LONGHORN-NET-004 | ingress 허용 뒤 통신 차단 | source egress·labels | egress 또는 selector 불일치 | 양쪽 policy 조건 점검 | deny verdict 제거 확인 |
| SYN-LONGHORN-NET-005 | 업그레이드 중 통신 재차단 | 렌더 policy·supplement 제거 시점 | 동등 Helm 경로 구성 전 제거 | 새 policy 검증 후 이전 supplement 제거 | upgrade·rollback 경로 검사 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
