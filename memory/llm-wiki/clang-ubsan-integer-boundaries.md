# C·C++ UBSan 검사 그룹과 정수 계약

Topic: Clang UndefinedBehaviorSanitizer
Version: 현재 Clang 개발 문서; toolchain 지원·옵션 재확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html

<!-- evidence-sha256: b79d97d146de81c8a681d9edac13935f6f235e55eb97f4d3d0342932a5737e4c -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-UBSAN-001 | undefined 검사인데 unsigned wrap을 놓침 | 컴파일 검사 그룹과 입력 범위 | unsigned overflow는 UB가 아니며 기본 그룹 제외 | 의도와 비용에 맞는 unsigned·integer 검사 선택 | 경계값에서 원하는 검사가 작동하는지 확인 |
| SYN-UBSAN-002 | 정수 값이 잘리는데 산술 overflow 보고 없음 | 대입 전후 타입과 변환 옵션 | 산술 overflow와 implicit conversion 혼동 | 손실 변환 검사를 별도로 검토 | 폭 축소·부호 변경 입력에 대한 값 확인 |
| SYN-UBSAN-003 | nullability annotation 위반을 UB라고 단정 | null 검사와 nullability 검사 종류 | 언어 UB와 의도 위반 진단의 범주 혼동 | 적용한 검사와 API 계약을 분리 | null 입력별 기대 진단과 처리 확인 |
| SYN-UBSAN-004 | 오류 stack에서 원인 위치가 불분명 | debug·frame pointer·symbolizer와 runtime 설정 | 심볼화 준비 누락 | 공식 stack trace 설정과 도구를 준비 | fixture의 정확한 발생 위치 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
