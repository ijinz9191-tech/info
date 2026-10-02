# Angular forms 비동기 검증 계약

Topic: angular-form-validation-contracts
Version: Angular reactive/template forms guide snapshot 2026-10-02; not Signal Forms
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://angular.dev/guide/forms/form-validation

<!-- evidence-sha256: 47384db8ae427dbadfee0a7fdd9e537913d9b4bff5c95e12fe3167ecc8531c1c -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-ANGULAR-FORM-001 | async validator 실행 없음 | sync errors | 동기 검증 실패로 비동기 미실행 | 동기 오류 먼저 확인 | 동기 통과 후 호출 확인 |
| SYN-ANGULAR-FORM-002 | PENDING 지속 | Observable 완료 여부 | 완료하지 않는 validator | 유한 완료 스트림 설계 | 최종 errors·status 확인 |
| SYN-ANGULAR-FORM-003 | 입력 전 오류 노출 | dirty·touched | 상호작용 전 메시지 표시 | 상호작용 상태 반영 | 입력·blur 전후 비교 |
| SYN-ANGULAR-FORM-004 | custom validator 인식 안 됨 | directive provider | NG_VALIDATORS 등록 누락 | 공식 provider 계약 확인 | 허용·거부 입력 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
