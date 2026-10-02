# C·C++ AddressSanitizer 탐지·링크·심볼화

Topic: Clang AddressSanitizer
Version: 현재 Clang 개발 문서; 컴파일러·OS별 지원 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://clang.llvm.org/docs/AddressSanitizer.html

<!-- evidence-sha256: fa79bc6e4ebed1eb74fb4d6a54ac26f6b1eda6e104e059f04b80dd15da5fc73b -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-ASAN-001 | 해제한 메모리를 읽고 간헐적으로 종료 | ASan의 할당·해제·접근 stack | 포인터 수명이 소유자보다 오래 유지 | 소유권과 마지막 사용 순서를 수정 | 동일 재현에서 보고가 사라지고 기능이 유지됨 |
| SYN-ASAN-002 | Sanitizer 옵션을 넣었는데 최종 링크 실패 | 컴파일·링크 명령과 runtime library | 컴파일만 instrument하거나 직접 ld로 링크 | 최종 executable도 clang sanitizer 옵션으로 링크 | 실행 파일 로딩과 고의 fixture 탐지 확인 |
| SYN-ASAN-003 | 주소만 출력되어 위치를 찾기 어려움 | debug 정보·frame pointer·symbolizer 경로 | 심볼화에 필요한 빌드·도구 누락 | debug 정보와 적합한 llvm-symbolizer 준비 | 접근·할당·해제 위치가 식별되는지 확인 |
| SYN-ASAN-004 | 첫 오류만 보여 다른 오류가 없다고 판단 | 첫 진단과 비정상 종료 코드 | ASan의 첫 오류 종료 계약 오해 | 첫 결함을 고친 뒤 동일 입력 재실행 | 후속 오류까지 반복 조사하고 범위 표시 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
