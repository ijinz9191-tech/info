# OPA Rego 파싱·컴파일·평가 오류 분리

Topic: opa-rego-error-stage-contracts
Version: OPA Errors Guide snapshot 2026-10-02; record deployed OPA version separately
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://www.openpolicyagent.org/docs/errors

<!-- evidence-sha256: b81f88c66b966da7a3fdf58bff72fbd369a9862246461ac78a6b0452e767158c -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-OPA-STAGE-001 | 정책 파싱 불가 | 오류 위치·문자열 종료 | 문법 오류 | 표시 위치의 문법 수정 | 동일 정책 파싱 성공 확인 |
| SYN-OPA-STAGE-002 | unsafe variable 오류 | 변수 정의·참조 | 정의되지 않은 값 참조 | 정의 또는 참조 경로 수정 | 컴파일 성공 확인 |
| SYN-OPA-STAGE-003 | 완전 규칙 출력 충돌 | input 조합·eval_conflict_error | 서로 다른 출력 동시 성립 | 분기 조건을 배타적으로 설계 | 경계 입력별 단일 출력 확인 |
| SYN-OPA-STAGE-004 | 잘못된 입력인데 명시 오류 없음 | 입력 타입·builtin·undefined | 런타임 builtin 오류가 undefined 처리 | strict-builtin-errors로 원인 조사 | 잘못된 타입과 정상 타입 비교 |
| SYN-OPA-STAGE-005 | 불필요 변수 누락 탐지 안 됨 | 컴파일 옵션·unused 항목 | 추가 strict 검사 비활성 | --strict로 정책 검사 | 경고 후보와 수정 후 결과 확인 |
| SYN-OPA-STAGE-006 | 오류 발생 경로 불명확 | 평가 스택·builtin 오류 설정 | 위치만 보고 규칙 호출 흐름 놓침 | eval/test 스택과 builtin 오류 함께 조사 | 실패 규칙의 입력 경로 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
