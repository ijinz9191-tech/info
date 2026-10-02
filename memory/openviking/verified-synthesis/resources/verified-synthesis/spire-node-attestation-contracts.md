# SPIRE node attestation·접속 계약

Topic: spire-node-attestation-contracts
Version: SPIRE configuring guide snapshot; SAT removed since 1.12.0
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://spiffe.io/docs/latest/deploying/configuring/

<!-- evidence-sha256: 2c849df31fb149e33ae8bc1b165620fa4f3546eb9d0715da2be5ea9cac9a0930 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SPIRE-ATTEST-001 | Agent identity 발급 실패 | Server·Agent trust_domain | trust domain 불일치 | 동일 trust domain 설정 확인 | 발급 identity 확인 |
| SYN-SPIRE-ATTEST-002 | Server port 변경 후 접속 실패 | bind_port·Agent target | 양쪽 port 불일치 | target port 일치 확인 | 연결·attestation 확인 |
| SYN-SPIRE-ATTEST-003 | SAT 구성 업그레이드 실패 | SPIRE 버전·NodeAttestor | 1.12.0 이후 SAT 미지원 | PSAT 계약 검토 | Token Review·node 인증 확인 |
| SYN-SPIRE-ATTEST-004 | join token 재사용 거부 | 사용 이력 | single-use token 재사용 | 승인된 새 bootstrap 절차 | token 값 없이 성공 상태 확인 |
| SYN-SPIRE-ATTEST-005 | 다중 NodeAttestor Agent 구성 문제 | Agent plugin 수 | Agent는 하나의 node attestor | 의도한 하나의 방식 선택 | Server·Agent plugin 대응 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
