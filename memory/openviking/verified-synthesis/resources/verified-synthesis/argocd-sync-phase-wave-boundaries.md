# Argo CD hook phase·wave·health 경계

Topic: Argo CD synchronization
Version: 공식 stable 문서; 실제 Argo CD 버전별 hook 지원 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/

<!-- evidence-sha256: 42abeee7e200c9843eb5d0735d41f3c03f7276f1812bed9f5d3d478b70ac85d1 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-ARGO-001 | 일부 자원 sync에서 준비 hook이 실행되지 않음 | selective sync 여부와 hook 로그 | 선택 동기화에서는 hook을 실행하지 않는 계약 | 전체 sync와 hook 필요 경로를 분리 | 선택·전체 sync의 hook 실행 차이 확인 |
| SYN-ARGO-002 | 뒤 wave의 자원이 적용되지 않음 | 첫 out-of-sync·unhealthy wave | 앞 wave가 정상화되지 않아 진행 못 함 | 앞 wave의 적용·health 실패 수정 | 각 wave가 순차적으로 healthy가 됨 |
| SYN-ARGO-003 | PostSync 검사가 시작되지 않음 | Sync hook 완료와 모든 자원 health | 적용 완료만으로 PostSync 실행을 기대 | Sync 성공과 health 조건을 함께 확인 | 정상·불량 health에서 실행 조건 검사 |
| SYN-ARGO-004 | 실패 cleanup도 실패하니 자동 복구를 기대 | SyncFail hook 상태·전체 operation | SyncFail 실패에 추가 조치가 있다고 오해 | 별도 복구와 재실행 절차 명시 | 실패 후 남은 자원과 다음 실행 결과 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
