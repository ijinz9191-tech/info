# Flux HelmRelease 전략·재시도·test·CRD

Topic: Flux helm-controller
Version: 현재 공식 HelmRelease 문서; controller feature gate 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://fluxcd.io/flux/components/helm/helmreleases/

<!-- evidence-sha256: eac68e1c97dca9296a9fe1db6a4e3963b0c0508aa4f0002b41c573bd4ad9f2b3 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-FLUX-001 | 실패 upgrade가 rollback하지 않고 재시도만 함 | strategy.name·retryInterval·remediation | RetryOnFailure와 RemediateOnFailure 혼동 | 필요한 재시도·복구 전략을 명시 | 실패 주입 후 rollback·retry 행위 확인 |
| SYN-FLUX-002 | 첫 실패 후 재시도가 끝남 | remediation.retries와 남은 시도 | 기본 retries 0이나 최종 복구 정책 오해 | 허용하는 시도 수와 마지막 복구를 명시 | 시도 횟수·남은 자원·조건 확인 |
| SYN-FLUX-003 | test 실패인데 Ready로 보임 | ignoreFailures·action별 override·test 결과 | 무시된 test 실패가 Ready에 영향 없음을 놓침 | test 성공 기준과 ignore 정책을 분리 | 실패 test의 조건과 운영 승인 근거 확인 |
| SYN-FLUX-004 | chart upgrade 뒤 CRD가 기대대로 갱신 안 됨 | upgrade.crds·생성된 CRD·버전 | Skip·Create·CreateReplace 계약 혼동 | CRD lifecycle을 별도로 검토 | 기존 데이터·schema·controller 호환 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
