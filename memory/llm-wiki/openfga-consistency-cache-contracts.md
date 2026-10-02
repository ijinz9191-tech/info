# OpenFGA 인가 캐시·일관성 계약

Topic: openfga-consistency-cache-contracts
Version: OpenFGA official guide snapshot 2026-10-02; cache configuration and deployed version required
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://openfga.dev/docs/interacting/consistency

<!-- evidence-sha256: 07152e888c16f8392911e662d6ac3d375f8f37687d6c1dd7f977452373788f8e -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-OPENFGA-CACHE-001 | tuple 변경 직후 이전 인가 결과 | 캐시 활성·consistency | MINIMIZE_LATENCY cache hit | 필요 구간 HIGHER_CONSISTENCY 검토 | 변경 직후 두 모드 비교 |
| SYN-OPENFGA-CACHE-002 | 모든 조회 latency 증가 | consistency·DB 지연 | 항상 cache 우회 | 필요 시점에 모드 결정 | 일관성 요구·부하 함께 확인 |
| SYN-OPENFGA-CACHE-003 | 캐시 모드인데 cache 효과 없음 | 실제 caching 설정 | 기본 caching 비활성 | 배포 설정과 run help 확인 | 캐시 활성 전후 조회 비교 |
| SYN-OPENFGA-CACHE-004 | subproblem 결과 지연 갱신 | query TTL·write 시간 | subproblem cache 유지 | TTL·invalidation 계약 검토 | tuple 변경 후 결과 시간 관찰 |
| SYN-OPENFGA-CACHE-005 | invalidation 부하 증가 | controller TTL·datastore query | 최근 write 확인 비용 | TTL와 fresh 요구 조정 | 오래된 결과·DB 부하 함께 측정 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
