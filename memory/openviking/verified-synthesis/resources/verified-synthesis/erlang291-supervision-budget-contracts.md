# Erlang supervision 복구 예산

Topic: erlang291-supervision-budget-contracts
Version: Erlang OTP 29.1.1 system documentation snapshot
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://www.erlang.org/doc/system/sup_princ.html

<!-- evidence-sha256: 578a798c94e63f8c85a32bd647023be5843a8e0c6b9df8526743cc7d1fff1364 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-ERLANG-SUP-001 | 형제도 재시작 | strategy | one_for_all 적용 | 결합 복구 의도 확인 | 실패 하나의 재시작 범위 관찰 |
| SYN-ERLANG-SUP-002 | 의존 자식 복구 순서 오류 | child 시작 순서 | rest_for_one 의존 순서 불일치 | 의존 순서로 child 명세 검토 | 실패 전후 child 범위 확인 |
| SYN-ERLANG-SUP-003 | supervisor shutdown | intensity·period·재시작 기록 | 기간 내 재시작 예산 초과 | burst·지속 장애를 구분해 조정 | 예산 경계와 escalation 확인 |
| SYN-ERLANG-SUP-004 | temporary child 복구 안 됨 | restart type | temporary는 재시작하지 않음 | 수명 의도에 맞는 restart 검토 | 정상·비정상 종료 비교 |
| SYN-ERLANG-SUP-005 | 정상 종료가 반복 재시작 | restart type | permanent는 항상 재시작 | transient 등 수명 검토 | 종료 이유별 복구 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
