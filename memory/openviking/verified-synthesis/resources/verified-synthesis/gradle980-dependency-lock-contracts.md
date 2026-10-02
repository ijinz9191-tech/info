# Gradle dependency lock 범위·changing artifact

Topic: tooling/gradle/dependency-locking
Version: Gradle official current docs display 9.8.0; update date unspecified; no Gradle invocation
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.gradle.org/current/userguide/dependency_locking.html

<!-- evidence-sha256: b3dfb56efd82ce3c7791a28904359692d7ab95eac4f290b7ad4e81348c42d366 -->

## 공식 계약과 범위

잠금은 configuration별 resolved version을 고정한다. buildscript classpath 잠금은 별도다. locked version의 strictly와 새 선언 요구가 충돌할 수 있다. root dependencies 실행만으로 모든 하위 프로젝트를 resolve하지 않는다. changing/SNAPSHOT은 동일 좌표에서도 artifact 내용이 바뀔 수 있다. 선택 갱신도 resolution 때문에 다른 모듈을 바꿀 수 있다. 잠금은 artifact 진위·완전 offline 저장·모든 build 입력 재현성을 보장하지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-GRADLE-LOCK-001 | 일부 classpath 변동 | lock 설정·resolved configuration | 범위 누락 | 해당 resolvable configuration 활성 검토 | 잠금·해석 결과 비교 |
| SYN-GRADLE-LOCK-002 | plugin classpath 변동 | buildscript 잠금 | lockAllConfigurations 범위 혼동 | buildscript 별도 잠금 검토 | 두 lockfile 확인 |
| SYN-GRADLE-LOCK-003 | 직접 의존성 upgrade 실패 | 선언·잠금 버전 | require와 strictly 충돌 | 검토 후 lock 갱신 | 해석·변경 diff 확인 |
| SYN-GRADLE-LOCK-004 | 하위 프로젝트 lock 없음 | 실행 task 경로 | root dependencies만 실행 | 대상별 resolve 검토 | lock coverage 확인 |
| SYN-GRADLE-LOCK-005 | 잠금 뒤 SNAPSHOT 결과 변동 | 좌표·artifact 내용 | changing dependency | 안정 버전 정책 검토 | 내용·버전 비교 |
