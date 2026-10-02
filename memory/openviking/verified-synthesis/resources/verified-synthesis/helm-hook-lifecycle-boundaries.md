# Helm hook 준비·순서·정리 수명

Topic: Helm chart hooks
Version: 공식 페이지 4.3.0 표시; Helm 3·4 차이 별도 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://helm.sh/docs/topics/charts_hooks/

<!-- evidence-sha256: 00fcd96f8a95077ba851e63698699ed6ab0a4709818146d06109467d46e1392f -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-HELM-001 | release 삭제 뒤 hook 자원이 남음 | hook annotation·delete policy·잔존 자원 | hook 자원이 release 관리 자원이 아님 | hook-delete-policy·TTL 등 수명 정책 설계 | upgrade·uninstall 후 예상 잔존만 확인 |
| SYN-HELM-002 | post-install 작업이 실행되지 않음 | wait 옵션과 자원 Ready 상태 | wait가 readiness를 기다린 뒤 hook 실행 | Ready 실패 원인과 hook 순서를 분리 | 정상·불량 Ready에서 hook 동작 확인 |
| SYN-HELM-003 | 여러 hook의 실행 순서가 예상과 다름 | hook weight·kind·name | weight만 같으면 의도 순서를 보장한다고 오해 | 공식 정렬 계약을 반영해 순서 명시 | 동일 weight와 이름 조건에서 순서 확인 |
| SYN-HELM-004 | CRD용 crd-install hook이 동작하지 않음 | Helm 버전과 chart 디렉터리 | Helm 3에서 제거된 hook을 사용 | crds 디렉터리 계약과 업그레이드 전략 검토 | 새 설치·기존 CRD 업그레이드를 분리 검사 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
