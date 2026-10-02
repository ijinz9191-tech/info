# Vitess 24 query·transaction·topology 장애 경계

Topic: cncf/vitess
Version: Official Vitess 24.0 troubleshooting updated 2026-05-04 and vtgate guide updated 2025-10-29; no deployment
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://vitess.io/docs/24.0/user-guides/configuration-basic/troubleshooting/
- https://vitess.io/docs/24.0/user-guides/configuration-basic/vtgate/

<!-- evidence-sha256: b3435aedb9b30ca70625f84581295461c53b1e4b084560c33af8df5e618bd002 -->

## 공식 계약과 범위

요청은 application→vtgate→vttablet→MySQL로 흐른다. latency·pool 대기·MySQL 부하와 topology discovery는 다른 증거로 구분한다. topo 단기 중단 때 기존 cache가 query를 계속 처리하더라도 유지보수 성공을 보장하지 않는다. errant GTID는 데이터 권위와 백업을 먼저 결정해야 하는 복구 경로다.

공식 설명 충돌: troubleshooting은 topo polling 빈도 감소에 interval 값 감소를 제안하지만 vtgate guide는 interval 감소가 빈도를 증가시킨다고 명시한다. 후자의 시간 간격 해석을 근거로 충돌을 보존하고, 설치 버전 실제 timer 동작 확인 전 tuning 정답으로 넣지 않는다. 운영 명령을 실행한 것은 아니다.

## 가상 진단 시나리오

아래는 공식 문서에서 도출한 가상 사례다. 실제 운영 재현이나 해결 완료가 아니다. Sources와 버전 범위는 모든 행에 적용된다. 조치와 검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-VITESS24-001 | MySQL errno 1040 연결 실패 | max_connections와 각 tablet pool 총량 | MySQL 연결 한도 초과 | 연결 budget 내 pool·서버 한도 검토 | 연결 실패와 MySQL 부하 모두 비교 |
| SYN-VITESS24-002 | pool 증설 후 latency 지속 | pool wait 감소와 MySQL 지연 증가 | 병목이 MySQL로 이동 | 증설 rollback 후보와 MySQL 용량·query 조사 | 같은 부하의 양쪽 대기·latency 비교 |
| SYN-VITESS24-003 | transaction ended exceeded timeout | transaction duration과 열린 transaction 로그 | 장기 transaction 또는 application 정지 | transaction 수명 단축과 timeout budget 대조 | 완료율·pool 점유·transaction latency 확인 |
| SYN-VITESS24-004 | replica tablet에 query 없음 | Health Check Cache의 red 또는 absent | 건강 실패와 미발견을 혼동 | red는 연결·health, absent는 topo·record 조사 | discovery와 serving query를 각각 확인 |
| SYN-VITESS24-005 | topo 중단 중 query 정상인데 reparent 실패 | topo 접근·cache와 maintenance 로그 | cached serving을 control-plane 정상으로 오인 | topo 복구 확인 후 유지보수 검토 | topo 가용성과 정상 query를 분리 검증 |
| SYN-VITESS24-006 | failover 뒤 GTID 집합 분기 | replica GTID가 primary subset인지와 데이터 비교 | errant transaction 또는 이전 primary 복구 분기 | 권위 데이터 결정과 백업 후 복구 계획 | GTID 포함 관계와 실제 데이터 일치 확인 |
