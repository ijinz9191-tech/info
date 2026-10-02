# gRPC deadline·취소·전파 계약

Topic: grpc-deadline-cancellation-contracts
Version: gRPC general guide snapshot 2026-10-02; language support varies
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://grpc.io/docs/guides/deadlines/

<!-- evidence-sha256: 86b619448cf150c6441b5f7807324e889211b70221f7d1efaae5b2c6567a45e4 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-GRPC-DEADLINE-001 | 호출 무기한 대기 | 호출별 deadline 설정 | 기본 deadline 없음 | 현실적인 기한을 설정 | 지연 입력에서 기한 종료 확인 |
| SYN-GRPC-DEADLINE-002 | 기한 후 서버 작업 지속 | cancel 상태·생성한 작업 | 애플리케이션 작업 정리 미구현 | 취소 확인과 작업 중단 구현 | 종료 후 자원·작업 잔존 확인 |
| SYN-GRPC-DEADLINE-003 | 하위 호출이 상위 기한 초과 | 언어별 전파·하위 context | 전파 활성 조건 누락 | 사용 SDK의 전파 방식 확인 | 하위 호출의 남은 예산 확인 |
| SYN-GRPC-DEADLINE-004 | 너무 짧은 기한으로 반복 실패 | 부하·처리 시간·deadline | 실제 처리 시간보다 작은 예산 | 부하 시험으로 예산 검토 | 성공률과 종료 지연 비교 |
| SYN-GRPC-DEADLINE-005 | 서비스 시계 차이로 기한 해석 오류 | 상대 timeout·경과 시간 | 절대 기한 수동 전달 | 지원 전파에서 경과 시간 차감 확인 | 서로 다른 시계의 남은 예산 검사 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
