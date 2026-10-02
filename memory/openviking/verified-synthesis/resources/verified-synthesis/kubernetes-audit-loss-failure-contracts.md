# Kubernetes 감사 기록 누락·API 실패 진단

Topic: cncf/kubernetes-audit
Version: current documentation displays v1.37; verify deployed kube-apiserver flags
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/

<!-- evidence-sha256: cdb75a585918ed5d96f9c2538390db3730286153ac0b29a647fec6c2f8d8b338 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-AUDIT-001 | 감사 로그 없음 | policy-file 지정 | flag 누락 | 유효 policy 설정 | 알려진 요청 기록 |
| SYN-AUDIT-002 | 일부 요청 미기록 | rule 순서 | 첫 매칭 우선 | None·Metadata 순서 점검 | 조건별 이벤트 |
| SYN-AUDIT-003 | body 없음 | audit level | Metadata 계약 | 필요 수준 검토 | 민감정보 노출도 점검 |
| SYN-AUDIT-004 | watch 단계 누락 | stage·omitStages | 장기 요청 단계 차이 | stage 정책 확인 | 완료 전후 비교 |
| SYN-AUDIT-005 | 로그 지속 안 됨 | pod mount·쓰기 경로 | 파일 미영속 | policy·log mount 확인 | 재시작 후 보존 |
| SYN-AUDIT-006 | 부하 시 누락 | buffer·audit_error_total | batch overflow | backend·buffer 용량 조정 | 동일 부하 drop |
| SYN-AUDIT-007 | 감사 backend 장애가 API 실패 | blocking-strict·RequestReceived | 동기 엄격 모드 | 감사·가용성 요구 검토 | 실패 주입 영향 |
| SYN-AUDIT-008 | API memory 증가 | 감사 설정·요청 수 | 요청별 context 유지 | 부하와 기록 범위 측정 | 메모리·기록 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
