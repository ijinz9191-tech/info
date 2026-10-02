# Kubernetes PV·PVC 소유권과 회수

Topic: cncf/kubernetes/persistent-volume-lifecycle
Version: Living Kubernetes docs menu v1.37 read 2026-10-02; deployed controller version unknown; no volume operation performed
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kubernetes.io/docs/concepts/storage/persistent-volumes/

<!-- evidence-sha256: d3e1ee9b9da5adf67cefdc569513bc3f9b34fb8e273bb7872f0536e90bbed8ab -->

## 공식 계약과 범위

PV 수명은 Pod와 독립적이고 PV/PVC는 일대일 바인딩이다. 명시적으로 빈 storageClassName은 동적 생성을 사용하지 않는다. 사용 중 보호 finalizer와 claimRef는 데이터 소유 관계를 반영한다. Retain은 자동 재사용이 아니고 Delete는 지원 plugin에서 외부 storage도 제거한다. 먼저 backup·소유권·복원 계획을 확인한다. 이 문서의 절차를 storage 삭제나 finalizer 강제 제거를 실행한 결과로 해석하지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-K8S-PV-001 | PVC Pending | 용량·access mode·PV 목록 | 일치 PV 없음 | 요청·제공 조건 비교 | Bound·실제 mount 확인 |
| SYN-K8S-PV-002 | 동적 생성 없음 | storageClassName 빈 문자열 | 동적 생성 명시 해제 | 의도한 class 확인 | provisioner 이벤트 검사 |
| SYN-K8S-PV-003 | 기존 PV 재바인딩 안 됨 | claimRef·기존 PVC | 독점 바인딩 | 소유 관계 조사 | 일대일 대응 확인 |
| SYN-K8S-PV-004 | PVC Terminating | Pod 참조·protection finalizer | 사용 중 보호 | 참조 수명 확인 | 미사용 후 정상 처리 관찰 |
| SYN-K8S-PV-005 | Retain PV Released 유지 | reclaimPolicy·잔존 데이터 | 수동 회수 필요 | backup·재사용 계획 검토 | 새 claim·데이터 접근 검증 |
| SYN-K8S-PV-006 | PVC 삭제 후 storage 손실 | StorageClass·Delete 정책 | 외부 자산 삭제 계약 | 삭제 전 정책·backup 검토 | 복원 가능한 backup 검사 |
