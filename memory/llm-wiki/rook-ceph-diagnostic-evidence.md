# Rook Ceph 상태·설정 장애 진단

Topic: cncf/rook
Version: latest-release 문서; 역사적 예제 포함, 설치 버전 재확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://rook.io/docs/rook/latest-release/Troubleshooting/ceph-common-issues/

<!-- evidence-sha256: cf968c1f09c89656823110ca3882516dbc86a65bf1cb8c4e9d01ddc17320b6bc -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-ROOK-001 | MON만 뜨고 나머지 없음 | quorum·operator 연결 확인 | quorum 형성 실패 | network·firewall·MTU 조사 | quorum·daemon 생성 |
| SYN-ROOK-002 | authentication error 110 | timeout·MON 상태 확인 | 연결 timeout이 auth처럼 표시 | operator-MON 연결 조사 | 연결·mon_status |
| SYN-ROOK-003 | PVC 계속 Pending | OSD up/in·pool replica 확인 | 필요 OSD 부족 | 원인별 OSD 구성 복구 | pool 조건·PVC Bound |
| SYN-ROOK-004 | OSD prepare Completed인데 OSD 없음 | prepare 로그·device 선택 확인 | 사용 중 device 제외 | device 선택 수정; 데이터 보존 | device·OSD 일치 |
| SYN-ROOK-005 | 재설치 MON keyring 불일치 | 기존 dataDirHostPath 확인 | 이전 cluster 상태 잔류 | 재초기화 목적·보존 요구 확인 | cluster identity·quorum |
| SYN-ROOK-006 | 환경변수 설정 안 먹음 | operator ConfigMap·로그 확인 | ConfigMap 우선순위 | 충돌 설정 정합화 | 최종 설정·reconcile |
| SYN-ROOK-007 | v1.6.0–1.6.7 phantom partition | 버전·partition·OSD 확인 | Atari 판별 문제 | 1.6.8 이상 경로·단계 복구 검토 | 복제·OSD 건강 |
| SYN-ROOK-008 | 기존 LV mode OSD metadata 불일치 | LV tag·host 변경 확인 | 동시 LVM 변경 | 동시 변경 회피·raw 전환 검토 | OSD·복제 상태 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
