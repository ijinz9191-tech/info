# Falco 이벤트 손실과 경보 관측 한계

Topic: falco-dropped-event-observation
Version: Falco guide snapshot 2026-10-02; v0.15+ dropped events; v0.33 throttling change
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://falco.org/docs/concepts/event-sources/kernel/dropped-events/

<!-- evidence-sha256: cf90d1d710f1f50b1e9c0c889ce57cd07680963941753753bc6a5414bf239a48 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-FALCO-DROP-001 | 규칙 메타데이터 불완전 | drop 수·프로세스 정보 | 이벤트 손실로 내부 상태 불완전 | 손실 신호와 관련 규칙 신뢰도 검토 | 손실 구간과 메타데이터 누락 비교 |
| SYN-FALCO-DROP-002 | 손실인데 경보 없음 | syscall_event_drops actions | ignore 또는 빈 actions 목록 | 의도한 log·alert 행동 설정 확인 | 통제된 입력에서 설정별 신호 확인 |
| SYN-FALCO-DROP-003 | Falco 비정상 종료 | 종료 코드·drop 로그·exit 설정 | 손실 시 exit 행동 선택 | 재시작 정책과 손실 처리 의도 검토 | 종료 전 drop 증거와 재시작 관찰 |
| SYN-FALCO-DROP-004 | 경보 수와 손실 수 불일치 | 출력 throttling·원본 drop 계수 | 출력 제한과 수집 손실 계수 혼동 | 배포 버전과 출력 제한을 함께 확인 | 경보 건수와 drop 계수 분리 비교 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
