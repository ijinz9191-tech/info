# Crossplane 조건·이벤트·reconciliation 계약

Topic: crossplane24-reconciliation-evidence
Version: Crossplane v2.4 guide snapshot 2026-10-02
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.crossplane.io/latest/guides/troubleshoot-crossplane/

<!-- evidence-sha256: a60431595fd8b11742e8a4006f12e22fda78f83d89d4b3ea0c15a2c395710e4a -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CROSSPLANE-RECON-001 | 설치 API resource not found | CLI·API 버전 | 오래된 CLI가 승격 API 미인지 | CLI 호환성 검토 | 같은 package 설치 확인 |
| SYN-CROSSPLANE-RECON-002 | Provider 연결 실패 | CannotConnectToProvider event | 참조 ProviderConfig 없음 | 참조명·존재 확인 | 이벤트·Ready 변화 확인 |
| SYN-CROSSPLANE-RECON-003 | XR 이벤트가 안 보임 | cluster scope·namespace | 이벤트는 default namespace | 올바른 namespace 조회 | XR 이벤트 발견 확인 |
| SYN-CROSSPLANE-RECON-004 | 삭제 후 외부 리소스 잔존 | finalizer 제거·cloud 상태 | 수동 제거는 외부 삭제 보장 안 함 | 외부 상태·정리 책임 확인 | Kubernetes와 cloud 각각 확인 |
| SYN-CROSSPLANE-RECON-005 | reconciliation이 제한됨 | Responsive False·WatchCircuitOpen | controller 충돌·circular update | 원인 loop 먼저 제거 | watch 빈도·Responsive 복구 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
