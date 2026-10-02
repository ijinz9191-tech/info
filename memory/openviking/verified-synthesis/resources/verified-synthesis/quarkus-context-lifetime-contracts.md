# Quarkus 비동기 context와 요청 수명

Topic: quarkus-context-lifetime-contracts
Version: Quarkus current guide snapshot 2026-10-02; deployed version separately
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://quarkus.io/guides/context-propagation/

<!-- evidence-sha256: 1de0f8a2e8422525c03404dc9f076f05f2e2d52f88216876a98110253926b61a -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-QUARKUS-CTX-001 | 비동기 구간 context 없음 | thread·확장 | ThreadLocal 실행 구간 변경 | context propagation 구성 확인 | 전환 전후 context 비교 |
| SYN-QUARKUS-CTX-002 | CompletionStage 트랜잭션 소실 | capture·executor | 수동 전파 누락 | ThreadContext·ManagedExecutor 검토 | 같은 transaction 유지 확인 |
| SYN-QUARKUS-CTX-003 | Mutiny 전파 미동작 | 설치 확장 | context propagation 확장 누락 | SmallRye 확장 확인 | ArC·transaction 접근 확인 |
| SYN-QUARKUS-CTX-004 | 요청 종료 후 bean 접근 이상 | 요청 종료·작업 수명 | RequestScoped 종료 뒤 접근 | 작업이 요청보다 오래 살지 않게 설계 | 종료와 bean 사용 순서 확인 |
| SYN-QUARKUS-CTX-005 | Dependent context 자동 전파 없음 | scope 선언 | 지원 scope 오인 | scope 수명과 전달 설계 | 지원 scope별 접근 비교 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
