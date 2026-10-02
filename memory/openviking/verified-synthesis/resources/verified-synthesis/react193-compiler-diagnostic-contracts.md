# React Compiler 최적화와 runtime 진단

Topic: frameworks/react/compiler
Version: React documentation v19.3; compiler package version and update date unspecified; no build performed
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://react.dev/learn/react-compiler/debugging

<!-- evidence-sha256: 153b9beb2b3be24bb14e6f6bc336872b8d7ea5ccbd0688a024c382c9ef9ca5b2 -->

## 공식 계약과 범위

compiler는 Rules 위반 가능성이 있는 코드를 최적화에서 건너뛴다. build 오류와 compiled runtime 행동 차이를 분리한다. memoization에 정합성을 의존하면 다른 memo 방식이 문제를 드러낼 수 있다. use no memo는 원인 분리를 위한 임시 제외이며 수정 증명이 아니다. 원인 수정 후 제거하고 DevTools badge와 행동을 함께 확인한다. compiler를 끄고 증상이 사라진 것만으로 compiler 결함을 확정하지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-REACT-COMP-001 | 빌드 실패 | 오류·최소 코드·compiler 버전 | compiler build 결함 후보 | 최소 재현으로 분리 | 동일 입력 빌드 비교 |
| SYN-REACT-COMP-002 | 최적화 누락 | DevTools badge·ESLint | Rules 위반으로 건너뜀 | 위반 조사·수정 | badge와 행동 확인 |
| SYN-REACT-COMP-003 | 활성화 후 행동 변화 | 컴포넌트별 비교 | 미탐지 Rules 위반 후보 | 임시 use no memo로 분리 | 같은 입력 비교 |
| SYN-REACT-COMP-004 | 참조 비교 기반 결과 오류 | 동일성 분기 | memoization에 정합성 의존 | 데이터 의미로 분기 검토 | memo 제거 후 행동 확인 |
| SYN-REACT-COMP-005 | 임시 제외 후 진단 종료 | 제외 목록·미해결 원인 | 우회를 수정으로 오인 | 원인 수정 후 directive 제거 | 행동·컴파일 확인 |
