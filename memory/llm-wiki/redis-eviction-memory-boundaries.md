# Redis 메모리·퇴거 경계

Topic: redis
Version: 현재 공식 가이드; 정책은 설치 버전 대조
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://redis.io/docs/latest/develop/reference/eviction/

<!-- evidence-sha256: 65d25e9bbfb7d727e3a88e2c87673ed1357bb0c6ddfd262c629b0a301841dc55 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-REDIS-001 | 읽기는 되는데 쓰기 오류 | maxmemory·noeviction·메모리 확인 | 한도 초과 신규 저장 거부 | 데이터 용도에 맞는 용량·정책 설계 | 읽기·쓰기 구분 검증 |
| SYN-REDIS-002 | volatile 정책인데 퇴거 없음 | TTL 있는 key 유무 확인 | 퇴거 후보 없음 | TTL 또는 적합한 정책 구성 | 메모리 압박 시 후보 퇴거 확인 |
| SYN-REDIS-003 | RSS가 maxmemory 초과 | INFO memory buffer 값 확인 | 복제·AOF buffer는 퇴거 비교 밖 | buffer 여유 포함 용량 설계 | 전체 메모리와 dataset 분리 확인 |
| SYN-REDIS-004 | 큰 명령에서 순간 메모리 급증 | 명령·피크 메모리 확인 | 한 명령 대량 추가의 일시 초과 | 명령 크기와 여유 용량 조정 | 대표 부하 피크 측정 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
