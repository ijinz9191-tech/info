# Scala 3 명시적 null과 흐름 분석

Topic: scala3-explicit-null-flow-contracts
Version: Scala 3 experimental -Yexplicit-nulls reference snapshot 2026-10-02
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.scala-lang.org/scala3/reference/experimental/explicit-nulls.html

<!-- evidence-sha256: 2d214cfed9ccc24bec564f5df240592eab613e66b0be4958e73fcc77900ade82 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SCALA-NULL-001 | .nn 호출 NPE | nullable 값·실제 null | assertion으로 null 제거를 가정 | 확인된 분기에서 non-null 값 확보 | null과 값 있는 입력 비교 |
| SYN-SCALA-NULL-002 | null 확인 후 타입 좁혀지지 않음 | 지역 변수·closure 대입 | closure가 수정하는 변수는 추적 불가 | 불변 지역 값으로 실행 조건 확보 | 좁혀진 타입의 컴파일 결과 확인 |
| SYN-SCALA-NULL-003 | 중첩 함수에서 좁혀진 타입 사라짐 | 정의 메서드·사용 위치 | 다른 메서드 사용에는 같은 flow 사실 미적용 | 중첩 사용에서 별도 값과 조건 확보 | 외부·중첩 사용을 따로 컴파일 |
| SYN-SCALA-NULL-004 | null 허용 코드가 통과 | unsafeNulls 범위·옵션 | 안전하지 않은 마이그레이션 범위 | 적용 범위를 의도에 맞게 제한 | 엄격 범위에서 nullable 사용 검사 |
| SYN-SCALA-NULL-005 | Java generic 반환 타입 불일치 | T·T와 Null 결합·Java API | T의 참조 타입 여부를 추론할 수 없음 | 실제 null 계약을 확인한 변환 설계 | null 가능 입력과 일반 반환 검사 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
