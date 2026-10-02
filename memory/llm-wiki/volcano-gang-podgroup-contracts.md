# Volcano gang·Queue·PodGroup 배치 계약

Topic: cncf/volcano/gang-scheduling
Version: Gang Latest and PodGroup v1.9.0 docs updated 2026-05-26; scopes differ; deployed version unverified
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://volcano.sh/docs/scheduler/plugins/gang/
- https://volcano.sh/docs/v1.9.0/concepts/podgroup/

<!-- evidence-sha256: 7ce17feda84e7b61d48cc98d6e538ab02f03455d4b3440d1175cd2c78673fe24 -->

## 공식 계약과 범위

minAvailable/minMember는 gang 최소 요구다. Queue Open과 minResources도 대조한다. schedulerName과 gang plugin 활성 경로를 확인한다. 최신 gang 설명과 v1.9 PodGroup 설명을 최신 설치 버전 보장으로 합치지 않는다. Unknown 같은 phase는 모든 task 완료를 의미하지 않는다. gang이 동시 자원 배치를 다룬다고 application-level 분산 deadlock 부재가 증명되는 것은 아니다. scheduler 실행은 수행하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-VOLCANO-GANG-001 | 일부 자원 있는데 Pending | minMember·가용 자원 | 최소 gang 미충족 | aggregate 요청 비교 | 조건·배치 전이 관찰 |
| SYN-VOLCANO-GANG-002 | queue job 미배치 | queue state | Open 아님 | queue lifecycle 확인 | Open·job 상태 대조 |
| SYN-VOLCANO-GANG-003 | Pod 수 충분한데 대기 | minResources | CPU·memory 최소 부족 | resource 조건 확인 | 조건 충족 fixture 비교 |
| SYN-VOLCANO-GANG-004 | gang 동작 안 함 | schedulerName·gang plugin | 선택 경로 불일치 | 실제 scheduler 경로 확인 | PodGroup·scheduler 이벤트 |
| SYN-VOLCANO-GANG-005 | Unknown을 완료로 해석 | running·conditions | 일부 task 미배치 상태 | phase 의미 확인 | 복구 후 running·failed 대조 |
