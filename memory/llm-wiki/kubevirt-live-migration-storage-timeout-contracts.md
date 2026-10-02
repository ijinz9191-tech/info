# KubeVirt live migration 사전 조건·시간·중단

Topic: cncf/kubevirt/live-migration
Version: Living KubeVirt guide; feature gate needed before 0.56; stall detection 1.9 alpha; default completion timeout disputed
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kubevirt.io/user-guide/compute/live_migration/

<!-- evidence-sha256: 1c1cab00b08d9179851235e82a2dfa12ded65ebb68b0de2615cdae1e7df81a99 -->

## 공식 계약과 범위

LiveMigratable·PVC access mode·network binding과 예약 port·primary NIC 이름을 먼저 대조한다. memory dirty rate와 전송률이 migration 수렴에 영향을 준다. 문서 completionTimeoutPerGiB 예제800과 본문 default150s가 달라 기본 숫자를 단정하지 않고 실제 CR·릴리스를 확인한다. progress와 completion timeout은 같지 않다. v1.9 alpha stall 기능을 일반 stable로 가정하지 않는다. post-copy·disruption 허용은 pause·중단 위험을 바꾼다. VM 이동이나 workload 중단은 수행하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-KUBEVIRT-MIG-001 | migration 거절 | LiveMigratable·PVC access mode | storage 조건 미충족 | RWX 등 실제 조건 확인 | 조건·migration 요청 비교 |
| SYN-KUBEVIRT-MIG-002 | network binding으로 불가 | bridge·49152·49153 | 지원·예약 port 충돌 | binding·port 조건 검토 | 사전 조건·대상 연결 확인 |
| SYN-KUBEVIRT-MIG-003 | target 연결 실패 | 양쪽 primary NIC 이름 | 이름 불일치 | interface 계약 대조 | source·target spec 비교 |
| SYN-KUBEVIRT-MIG-004 | completion timeout | dirty rate·크기·실제 CR | 전송보다 변경이 빠름 | budget·부하 분석 | remaining bytes 추이 |
| SYN-KUBEVIRT-MIG-005 | progress timeout 안 걸림 | bytes 진동·progress reset | 일부 진전이 timer reset | completion·stall 구분 | stuck·oscillating fixture |
| SYN-KUBEVIRT-MIG-006 | 예상 밖 VM pause | disruption·postCopy 설정 | pause fallback 선택 | 허용 중단 정책 검토 | 격리 부하에서 downtime 측정 |
