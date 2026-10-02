# Prometheus TSDB WAL·backup·복구 경계

Topic: cncf/prometheus/tsdb-storage-recovery
Version: Latest storage docs read 2026-10-02; exact release unspecified; WAL compression introduced 2.11.0, default 2.20.0
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://prometheus.io/docs/prometheus/latest/storage/

<!-- evidence-sha256: b3d6126ba5d3ee166066399750b2abe0bbd1feb69d083f837e00d00bb56b1bb8 -->

## 공식 계약과 범위

WAL·Head와 compaction은 retention 수치만으로 설명되지 않는 peak 공간을 만든다. snapshot과 최신 구간 포함 여부를 대조한다. 손상 시 원본 storage backup 후 backup에서 복구하는 경로를 우선한다. 손상 block/WAL 삭제는 시간 구간 데이터가 손실되는 최후 수단이며 수행하지 않았다. NFS/EFS는 local TSDB 지원 storage가 아니다. compression된 WAL의 2.11 이전 downgrade 호환을 가정하지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-PROM-TSDB-001 | WAL 크기 증가 | 유입량·WAL segment | raw data 축적 | 디스크·유입량 조사 | replay·용량 관찰 |
| SYN-PROM-TSDB-002 | retention보다 디스크 큼 | compaction·WAL·Head | 일시 공존·삭제 범위 | peak 여유 설계 | cleanup 후 용량 확인 |
| SYN-PROM-TSDB-003 | backup 최근 구간 누락 | snapshot·Head/WAL 포함 | 일관성·최신성 절충 | snapshot·복원 정책 검토 | 시간 범위 조회 비교 |
| SYN-PROM-TSDB-004 | 손상으로 시작 실패 | block·WAL 오류 | storage 손상 후보 | 원본 backup·복구본 계획 | 별도 복원본 시작·조회 검사 |
| SYN-PROM-TSDB-005 | NFS에서 손상 | filesystem 종류 | 미지원 local storage | 지원 storage 설계 검토 | 복원·내구성 검사 |
| SYN-PROM-TSDB-006 | downgrade WAL 비호환 | compression·목표 버전 | 2.11 이전 비호환 | 데이터 보존 migration 검토 | 격리 복원본 compatibility 검사 |
