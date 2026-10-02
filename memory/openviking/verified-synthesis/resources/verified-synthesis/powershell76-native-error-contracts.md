# PowerShell native exit와 오류 계약

Topic: powershell76-native-error-contracts
Version: PowerShell 7.6 preference reference snapshot
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables?view=powershell-7.6

<!-- evidence-sha256: 97156ab282c1991600c7bb7c916c8f909065960a0e0e3b56f0ee53ed8245b81b -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-PWSH-NATIVE-001 | native 실패가 Stop에 반응 없음 | native preference·exit | 기본 native error preference false | 종료 코드·preference 계약 확인 | 통제된 실패 처리 관찰 |
| SYN-PWSH-NATIVE-002 | 정보용 nonzero가 오류 처리 | 도구별 코드 명세 | 모든 nonzero를 실패로 해석 | 해당 도구의 성공 코드 분리 | 코드별 의도한 처리 확인 |
| SYN-PWSH-NATIVE-003 | 다른 호출 오류 설정 변경 | 변수 scope | 공유 scope preference 변경 | 제한 scriptblock에서 변경 | 종료 후 이전 값 확인 |
| SYN-PWSH-NATIVE-004 | Windows 인자 해석 차이 | argument passing·파일 종류 | Windows mode 일부 Legacy 경로 | 대상별 mode 확인 | 공백·따옴표 인자 readback |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
