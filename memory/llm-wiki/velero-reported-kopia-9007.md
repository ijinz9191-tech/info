# Velero 공개 이슈 #9007: Kopia maintenance 소유권

Topic: cncf/velero
Version: 보고자 주장 v1.14.0+; 전체 릴리스 영향 독립 검증 없음
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/velero-io/velero/issues/9007
- https://github.com/velero-io/velero/pull/9039/files

<!-- evidence-sha256: 90d6df6a685042203f1d4593e054d4d8db498c13b366c3f228c63ba616c8709d -->

## 공개 보고와 증거

2025-06-06 공개 보고는 Kopia repository 초기 소유권과 maintenance 실행 문맥의 불일치로 지정 사용자 오류가 발생한다고 설명한다. 보고자의 모든 버전·플랫폼 영향 주장은 독립 재현으로 확인하지 않았다.

## 조치와 검증 경계

연결 시 읽기 전용 및 username/hostname override로 소유권 변경을 피하고, 기존 오류에는 문서의 maintenance owner 정합화 절차를 검토한다. 적용 전 실제 저장소 소유권·maintenance 문맥·백업 상태를 확인하고 적용 후 maintenance 성공과 백업 접근을 함께 검증해야 한다. 이 환경에서 실행하지 않았다.

## Closed와 코드 수정 구분

이슈는 Closed이며 연결 PR #9039는 2025-06-27 main에 병합됐다. Files changed를 직접 읽어 troubleshooting.md 한 파일에 안내 14줄이 추가됐음을 확인했다. 자동 복구 구현이나 특정 릴리스의 런타임 수정으로 해석하지 않는다. 문서 기반 시나리오 velero-main-troubleshooting-contracts의 Kopia 항목과 같은 장애 경로의 증거이므로 별도 신규 장애 총수에 더하지 않는다.
