# Argo CD apply migration 장애와 3.3.2 수정 근거

Topic: cncf/argocd/csa-migration
Version: Reported 3.3.0; official release identifies 3.3.0 and 3.3.1 affected, fix in 3.3.2; no local cluster reproduction
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/argoproj/argo-cd/issues/26279
- https://github.com/argoproj/argo-cd/pull/26289/files
- https://github.com/argoproj/argo-cd/releases/tag/v3.3.2
- https://argo-cd.readthedocs.io/en/release-3.3/user-guide/sync-options/

<!-- evidence-sha256: e01a3c384af9c8b6e2a37cb8849612e8013ecd833f675c2d5e7237f9a1c53168 -->

## 보고된 증상과 증거

2026-02-05 보고는 self-managed upgrade의 CSA→SSA migration에서 큰 ApplicationSet CRD가 annotation 262144-byte 제한에 걸려 sync 실패한다고 제시한다. 보고자의 ClientSideApplyMigration=false는 임시 우회 후보이며 field ownership 영향까지 해결됐다는 뜻은 아니다. Replace=true는 SSA보다 우선하고 재생성 위험이 있어 보편적 우회책으로 추천하지 않는다.

## 실제 읽은 수정 코드와 릴리스

공개 GitHub API로 PR #26289의 merge metadata와 gitops-engine/pkg/sync/sync_context.go patch를 읽었다. 2026-02-19 master merge commit은 7180deb93712ab2f43ec27e42e607567b648cf72다. patch는 Update operation manager만 migration 대상으로 판정하고, fresh object를 다시 얻어 csaupgrade.UpgradeManagedFieldsPatch 및 JSONPatch로 ownership을 옮긴다. Conflict는 RetryOnConflict가 식별하도록 원 error를 돌려준다. 이전 annotation 생성 경로를 대체한다.

3.3.2 공개 release metadata는 2026-02-22 공개 및 #26516 cherry-pick commit 67c23193c4dc23defb4cad555ba975cf501ba1b0를 기록하고 3.3.0·3.3.1 문제 해결을 명시한다. 이는 공식 수정 릴리스 근거이며 배포 환경 성공 증거는 아니다.

## 적용 및 해결 검증

현재 설치 version, sync options, annotation 크기, managedFields manager와 operation을 확인한다. 해당 수정이 포함된 지원 버전으로 변경할 때 ownership을 보존하는 검증 환경에서 시험한다. 같은 CRD sync 성공, annotation 크기 오류 소실, intended field 소유권과 이후 변경·삭제 동작을 함께 검증한다. 클러스터 실행과 upgrade는 수행하지 않았다.
