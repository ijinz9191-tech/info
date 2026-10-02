# Dragonfly dfdaemon scheduling 시간·cache 수명

Topic: cncf/dragonfly/dfdaemon
Version: Dragonfly v2.5.0 dfdaemon configuration; snapshot 2026-10-02; no download/runtime test
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://d7y.io/docs/reference/configuration/client/dfdaemon/

<!-- evidence-sha256: 2258cf2efc1d9d51b3df503ad09e7eb00a382973af4612daef54c39778411a84 -->

## 공식 계약과 범위

scheduleTimeout은 scheduler 연산뿐 아니라 client piece 다운로드·보고를 포함한 전체 상호작용에 적용된다. enableBackToSource와 실제 source 접근을 대조한다. storage.keep·storage directory·각 task 유형 TTL은 별도 조건이며 persistent/cache라는 명칭이 영구 보존을 뜻하지 않는다. 문서의 timeout 표현과 실제 설치 버전의 필드명을 대조한다. 다운로드·cache 삭제·daemon 재시작을 실행하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-DRAGONFLY-CFG-001 | TokioStreamElapsed | 전체 interaction 시간·timeout | client 처리 포함 제한 초과 | 전체 시간 budget 검토 | 큰 task 전후 완료 비교 |
| SYN-DRAGONFLY-CFG-002 | scheduling 실패 후 download 중단 | enableBackToSource·source 상태 | fallback 비활성 후보 | 정책·source 접근 확인 | scheduling 실패 fixture 비교 |
| SYN-DRAGONFLY-CFG-003 | 재시작 뒤 cache 없음 | storage.keep·storage dir | 보존 정책·배치 불일치 | 실제 저장 수명 확인 | 격리 재시작 cache 비교 |
| SYN-DRAGONFLY-CFG-004 | 장기간 미사용 cache 소실 | access time·taskTTL | GC 수명 초과 | TTL·보존 요구 검토 | 경계 시간 cache 조회 |
| SYN-DRAGONFLY-CFG-005 | persistent cache 예상보다 짧음 | request TTL·기본 TTL | 요청 미지정 fallback | 유형별 TTL 확인 | metadata expiry 대조 |
