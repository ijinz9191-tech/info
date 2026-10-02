# Clojure STM 충돌·불변식 계약

Topic: clojure-stm-ref-contracts
Version: Clojure official reference snapshot 2026-10-02; deployed version separately
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://clojure.org/reference/refs

<!-- evidence-sha256: cec84e55f65e7ef2b7aefe3ead2a23471331416fb81487dce0f96c3e4a4ea781 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CLOJURE-STM-001 | 외부 효과 중복 | transaction 재시도·I/O | 충돌 재시도에 부작용 포함 | 효과 분리·io! 검토 | 충돌 시 효과 횟수 확인 |
| SYN-CLOJURE-STM-002 | commute 결과 불일치 | 함수·적용 순서 | 비가환 연산 사용 | 가환성 확인 또는 alter 검토 | 순서 교환 결과 비교 |
| SYN-CLOJURE-STM-003 | 참조 간 불변식 위반 | 읽기 Ref·동시 수정 | 변경하지 않는 의존 Ref 미보호 | ensure 적용 검토 | 동시 충돌 불변식 검사 |
| SYN-CLOJURE-STM-004 | Ref 내부 값이 몰래 변경 | 값 타입·외부 mutation | mutable 객체를 저장 | 불변 persistent collection 사용 | 외부 변경과 snapshot 비교 |
| SYN-CLOJURE-STM-005 | 유효하지 않은 값 commit | validator·입력 | 값 검증 계약 누락 | Ref validator 설계 | 허용·거부 입력 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
