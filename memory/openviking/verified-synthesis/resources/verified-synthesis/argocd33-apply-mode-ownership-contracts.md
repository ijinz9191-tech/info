# Argo CD 3.3 apply 모드와 field ownership 계약

Topic: cncf/argocd/apply-options
Version: Official release-3.3 documentation read 2026-10-02; original 3.3.0 implementation differed before migration fix
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://argo-cd.readthedocs.io/en/release-3.3/user-guide/sync-options/

<!-- evidence-sha256: af2aa5394acede7777bf8e22786b12dc109c99aa9b7f0da95406ea6d9d74cdca -->

## 공식 계약과 가상 진단

현재 release-3.3 원문은 migration을 managedFields patch 경로로 설명한다. 3.3.0 공개 이슈의 이전 구현과 구분한다. 다음은 공식 계약에서 도출한 가상 사례이며 운영 실행 결과가 아니다. Sources와 버전이 모든 행에 적용된다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-ARGO-APPLY-001 | SSA 켰는데 replace/create 경로 실행 | Replace·ServerSideApply 설정 | Replace=true 우선 계약 | resource별 적용 모드 의도 대조 | 실제 verb·재생성 여부 확인 |
| SYN-ARGO-APPLY-002 | partial manifest schema 검증 거절 | SSA 옵션과 필수 필드 | partial apply와 full schema 검증 혼동 | 의도한 partial apply 조건의 Validate 옵션 검토 | 소유 필드만 변경되고 객체 유효함을 확인 |
| SYN-ARGO-APPLY-003 | shared field 삭제가 기대와 다름 | live managedFields와 manager operations | migration 비활성 또는 공동 소유 | owner별 field 계약과 migration 상태 검토 | 이후 변경·삭제와 남은 owner 확인 |
| SYN-ARGO-APPLY-004 | migration을 여러 sync에서 반복 기대 | manager의 Update·Apply operation | 이미 migrated Apply manager와 CSA 혼동 | 현재 managedFields 기준 필요성 대조 | 필요한 migration만 실행됐는지 확인 |
