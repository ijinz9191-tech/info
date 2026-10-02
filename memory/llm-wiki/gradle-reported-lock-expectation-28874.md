# Gradle 8.7 잠금 기대 불일치와 문서 수정

Topic: tooling/gradle/reported-lock-expectation
Version: Reported Gradle 8.7; documentation-only PR merged 2025-07-08; explanation verified in 9.1.0; no local build
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/gradle/gradle/issues/28874
- https://github.com/gradle/gradle/pull/33999
- https://github.com/gradle/gradle/commit/c775ae12b5e236db2a2ea852947be53326fcdc1c
- https://docs.gradle.org/9.1.0/userguide/dependency_locking.html

<!-- evidence-sha256: a93faf77931555f2dd1161bb7c2853a407ac610c38fbb8fcd2555f5208cf4ac7 -->

## 실제 공개 보고와 원인 경계

2024-04-18 #28874는 Gradle8.7에서 잠금1.2.0을 둔 채 선언만1.0.0으로 내리면 build가 성공하고 반대 방향은 실패한다고 보고했다. 모든 version 불일치가 오류라는 기대와 strictly 잠금의 선택 계약이 달랐다. 낮은 선언은 높은 잠금을 유지할 수 있고 높은 선언은 낮은 잠금과 충돌한다.

## 실제 읽은 변경과 배포 근거

공개 GitHub API의 PR metadata와 file patch를 읽었다. #33999는 2025-07-08 merge됐고 불변 commit은 c775ae12b5e236db2a2ea852947be53326fcdc1c다. 변경 파일은 dependency_locking.adoc 하나이며 Documentation change ONLY다. 9.1.0 고정 공식 문서에서 해당 설명이 배포된 것을 확인했다. runtime resolver 수정도, 9.1.0 버그 수정도 아니다.

## 조치와 해결 검증

설치 version·선언 요구·lock version·resolved graph를 함께 확인한다. 의도한 version 변경은 잠금 갱신의 diff와 해석 결과로 검증한다. 같은 공식 계약의 가상 진단을 별개 실제 해결 건수로 더하지 않는다. Gradle 실행과 로컬 재현은 수행하지 않았다.
