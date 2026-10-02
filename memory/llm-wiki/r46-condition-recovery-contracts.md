# R condition handler·restart 계약

Topic: r46-condition-recovery-contracts
Version: R-devel base 4.6.0 reference snapshot; not stable release claim
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://stat.ethz.ch/R-manual/R-devel/library/base/html/conditions.html

<!-- evidence-sha256: fa00580086070e288720518913c14435631dbe58d3f7cfbcf50b889178634b10 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-R-CONDITION-001 | finally 오류가 잡히지 않음 | handler scope | 현재 tryCatch handler는 finally에서 비활성 | 정리 오류를 별도 처리 | 본문·finally 실패 분리 검사 |
| SYN-R-CONDITION-002 | handler가 기대 순서로 실행 안 됨 | 등록 순서·condition class | 가장 최근 일치 handler 선택 | 구체 handler 순서 검토 | 복수 class 입력 결과 확인 |
| SYN-R-CONDITION-003 | warning handler 후 실행 지속 | calling vs exiting handler | withCallingHandlers 반환 계약 | 원하는 복구 protocol 선택 | 반환 후 실행 경로 관찰 |
| SYN-R-CONDITION-004 | muffleWarning restart 없음 | 발신 protocol·findRestart | 외부 condition에 restart 가정 | tryInvokeRestart 검토 | restart 유무 각각 검사 |
| SYN-R-CONDITION-005 | interrupt가 error handler 우회 | condition class | interrupt는 error 하위형 아님 | interrupt 처리 의도 별도 명시 | 사용자 중단·정리 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
