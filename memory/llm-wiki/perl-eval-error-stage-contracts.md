# Perl eval 파싱·경고·오류 계약

Topic: perl-eval-error-stage-contracts
Version: Perldoc eval snapshot 2026-10-02; deployed Perl version separately
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://perldoc.perl.org/functions/eval

<!-- evidence-sha256: fd2aa0a0097a95f3ed975095a06a4c37c7d04a8c6a88cbec92e4bfedc14b1295 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-PERL-EVAL-001 | eval 안 경고가 stderr 출력 | warning·$@ | eval은 경고를 포착하지 않음 | warning 처리 별도 설계 | warning과 die 구분 검사 |
| SYN-PERL-EVAL-002 | 반복 eval 느림 | string vs block | string은 매번 파싱 | 고정 코드는 block 검토 | 동일 코드 반복 비용 비교 |
| SYN-PERL-EVAL-003 | block 문법 오류 포착 안 됨 | compile 시점 | block은 주변 코드와 함께 파싱 | 파싱·실행 오류를 분리 | 두 eval 형태 오류 시점 확인 |
| SYN-PERL-EVAL-004 | error 메시지가 변함 | __DIE__ hook | hook이 die 재호출 | 라이브러리 trap scope 검토 | hook 전후 $@ 비교 |
| SYN-PERL-EVAL-005 | locale 숫자 eval 파싱 실패 | 문자열 숫자·locale | 소수 구분자 또는 NaN 텍스트 | 문자열 코드 생성 대신 값 처리 | 특수 숫자·locale 입력 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
