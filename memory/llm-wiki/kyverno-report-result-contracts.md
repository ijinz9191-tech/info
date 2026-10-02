# Kyverno 결과 분류·보고서 수명

Topic: kyverno-report-result-contracts
Version: Kyverno reports guide snapshot 2026-10-02; allowedResults requires 1.17+
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kyverno.io/docs/guides/reports/

<!-- evidence-sha256: 57e3101ad54f50dbcb588d304c8aa78b1559ec03c300e242dc375e11fc3b1b0b -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-KYVERNO-REPORT-001 | skip을 통과로 해석 | preconditions·PolicyException | 평가 생략을 성공으로 오인 | 생략 조건과 예외 확인 | 조건을 만족한 평가 결과와 비교 |
| SYN-KYVERNO-REPORT-002 | 위반인데 warn | scored annotation·result | scored=false에 따른 결과 전환 | 정책의 점수화 설정 확인 | 동일 위반의 설정별 결과 비교 |
| SYN-KYVERNO-REPORT-003 | 변수 관련 error | 치환 로그·규칙 위치 | 패턴 등에서 변수 치환 실패 | 입력과 치환 경로 수정 | error 제거와 기대 패턴 평가 확인 |
| SYN-KYVERNO-REPORT-004 | 보고서에 일부 결과 없음 | 버전·allowedResults | 1.17+ 결과 보관 필터 | 필터와 운영 목적 확인 | 필터 전후 결과 유형 비교 |
| SYN-KYVERNO-REPORT-005 | 삭제 후 과거 위반 사라짐 | 리소스 삭제·보고서 시점 | 현재 상태 보고를 이력으로 오인 | 필요한 이력은 별도 보존 설계 | 삭제 전후 보고 항목 변화 확인 |
| SYN-KYVERNO-REPORT-006 | 리소스 보고서 생성 실패 | reports controller RBAC | get/list/watch 권한 부족 | 대상 리소스 권한 확인 | 권한 확인 후 새 보고 결과 관찰 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
