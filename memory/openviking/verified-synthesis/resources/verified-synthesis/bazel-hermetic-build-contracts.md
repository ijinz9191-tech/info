# Bazel build 입력·재현·격리 진단

Topic: tooling/bazel/hermeticity
Version: Living Bazel official hermeticity guide read 2026-10-02; exact release unspecified; no build execution
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://bazel.build/basics/hermeticity

<!-- evidence-sha256: 3073963c485e44b27ca63e60006dab4fb3a6452788c3a77ef6b0ccd4bcf75fb5 -->

## 공식 계약과 범위

host tool·시간·비선언 입력·공유 상태가 산출물에 들어가면 같은 소스만으로 재현되지 않는다. 원문은 반복 hash 비교와 최소 환경 및 action sandbox를 진단 경로로 제시한다. generated output이 source tree를 바꾸는지도 조사한다. Bazel 사용만으로 모든 rule의 격리·결정성이 증명되지는 않는다. 아래 build·hash 비교는 제안 검증이며 실행한 결과가 아니다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-BAZEL-HERM-001 | host별 결과 차이 | compiler 경로·버전 | system binary 유입 | 명시 toolchain 검토 | host 간 hash 비교 |
| SYN-BAZEL-HERM-002 | 동일 입력 hash 변동 | timestamp·build ID | 비결정적 생성 | 생성 입력 안정화 | 반복 hash 비교 |
| SYN-BAZEL-HERM-003 | A 뒤 B 빌드 실패 | source tree diff | 빌드가 소스 수정 | generated output 경계 분리 | 양 순서 build 비교 |
| SYN-BAZEL-HERM-004 | 최소 환경에서 실패 | 누락 file·tool | 암묵 system 의존성 | 입력·도구 명시 | 최소 환경 재검증 |
| SYN-BAZEL-HERM-005 | action 간 간섭 | 공유 상태·sandbox 차이 | 상태가 action 경계 초과 | strict sandbox 검토 | 격리 전후 비교 |
