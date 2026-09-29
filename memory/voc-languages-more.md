# 언어별 추가 VOC 20건

확인일: 2026-09-30. [대표 55건](voc-languages.md)과 [추가 55건](voc-languages-extra.md)에 없는 실패 경로를 더한다. 각 행은 실제 접수가 아닌 **가능한 개발 장애 시나리오**이며, 사용한 구현·버전에 맞춰 재현과 근거를 확인한다.

| ID | 언어 | 증상·확인할 증거 → 가설·조치·검증 | 공식 확인 입구 |
|---|---|---|---|
| L3-001 | C | 함수가 끝난 뒤 반환한 포인터를 읽을 때 값이 흔들림; 포인터의 저장 수명 확인 → 자동 저장 객체 주소 반환 제거; sanitizer로 호출 후 접근 시험 | [WG14](https://open-std.org/jtc1/sc22/wg14/) |
| L3-002 | C++ | vector에 push한 뒤 저장해 둔 iterator가 잘못됨; 재할당 전후 capacity 확인 → iterator 재취득/인덱스 사용; 재할당 경계 시험 | [C++ working draft](https://eel.is/c++draft/vector) |
| L3-003 | Rust | 락이 `await`를 가로질러 지연/교착을 유발; guard 수명 확인 → 비동기 대기 전에 락 해제; 동시 작업 완료 시간 시험 | [Async book](https://rust-lang.github.io/async-book/) |
| L3-004 | Go | map 동시 접근에서 race/panic; 읽기·쓰기 goroutine 추적 → mutex/단일 소유 구조로 보호; race detector 부하 시험 | [Go memory model](https://go.dev/ref/mem) |
| L3-005 | Zig | allocator 교체 후 잘못된 해제로 오류; allocate/free 주체 추적 → 같은 allocator로 수명 관리; 누수·이중 해제 시험 | [Zig language reference](https://ziglang.org/documentation/master/) |
| L3-006 | D | GC가 관리하는 버퍼의 주소를 외부 코드가 오래 보관; FFI 수명 확인 → 고정/명시적 소유 경계로 변경; 강제 GC 뒤 데이터 시험 | [D spec](https://dlang.org/spec/spec.html) |
| L3-007 | Nim | 매크로 확장 뒤 예상과 다른 이름 충돌; 생성 AST와 scope 확인 → hygienic 심볼 사용; 두 모듈에서 같은 매크로 컴파일 시험 | [Nim macros](https://nim-lang.org/docs/manual.html#macros) |
| L3-008 | Assembly (x86) | 함수 호출 뒤 레지스터 값이 바뀜; ABI의 caller/callee-saved 규칙 확인 → 보존 계약에 맞게 저장·복원; 다른 최적화 옵션으로 호출 시험 | [Intel manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) |
| L3-009 | CUDA C++ | kernel은 성공처럼 보이나 출력 일부가 이전 값; 비동기 오류와 stream 동기화 확인 → 동기화 지점에서 오류 검사; 반복 입력 결과 비교 | [CUDA runtime](https://docs.nvidia.com/cuda/cuda-runtime-api/) |
| L3-010 | WebAssembly | 메모리 확장 뒤 호스트가 가진 view가 오래됨; `memory.grow` 전후 버퍼 확인 → 새 view 재생성; 확장 뒤 읽기·쓰기 시험 | [Wasm JS API](https://webassembly.github.io/spec/js-api/) |
| L3-011 | Ada | 범위 검사 예외가 운영 입력에서 발생; subtype 제약과 입력 경계 확인 → 입력 검증/타입 범위 수정; 최소·최대·초과 값 시험 | [AdaCore](https://docs.adacore.com/live/wave/) |
| L3-012 | Fortran | C 함수에 전달한 배열 결과가 뒤집힘; column-major·stride·인터페이스 확인 → 배열 레이아웃을 계약에 맞춤; 비대칭 행렬로 왕복 시험 | [Fortran interoperability](https://fortran-lang.org/learn/intrinsics/iso_c_binding/) |
| L3-013 | Pascal / Object Pascal | DLL 호출 뒤 문자열이 깨짐; 컴파일러별 문자열 ABI·호출 규약 확인 → 명시적 길이/인코딩 경계 사용; 서로 다른 빌드로 왕복 시험 | [Free Pascal](https://www.freepascal.org/docs.html) |
| L3-014 | VHDL | 시뮬레이션 파형은 정상인데 합성 회로가 다름; 합성 불가 구문·클럭 경계 확인 → 합성 가능 RTL로 표현; 합성 후 시뮬레이션 비교 | [GHDL](https://ghdl.github.io/ghdl/using/Synthesis.html) |
| L3-015 | Java | 대량 객체 생성 뒤 응답 지연이 주기적으로 튐; GC pause·heap allocation 확인 → 할당 경로와 heap 설정 점검; 부하에서 P99·GC 시간 비교 | [Java GC](https://docs.oracle.com/en/java/javase/25/gctuning/) |
| L3-016 | Kotlin | 코루틴 취소 후에도 블로킹 I/O가 남음; 호출 스택과 cancellation 전파 확인 → 취소 가능한 API/실행 경계 사용; 취소 후 작업 수 복귀 검사 | [Cancellation](https://kotlinlang.org/docs/cancellation-and-timeouts.html) |
| L3-017 | Scala | 컬렉션 변환이 지연되어 부작용 실행 시점이 예상과 다름; strict/lazy 타입 확인 → 평가 경계를 명시; 부작용 횟수·순서 시험 | [Scala collections](https://docs.scala-lang.org/overviews/collections-2.13/overview.html) |
| L3-018 | Clojure | lazy sequence의 외부 자원 읽기가 닫힌 뒤 실행됨; realization 시점 확인 → 열린 범위에서 결과 구체화; 닫힘 이후 접근 시험 | [Clojure sequences](https://clojure.org/reference/sequences) |
| L3-019 | Groovy | DSL 표현식이 동적 메서드로 해석되어 실행 시 실패; 메서드 resolution·컴파일 모드 확인 → 명시적 타입/정적 검사 경계 설정; 같은 DSL 입력 회귀 시험 | [Groovy semantics](https://groovy-lang.org/semantics.html) |
| L3-020 | C# | 취소 토큰을 전달했지만 HTTP 요청이 계속됨; 토큰 전달 체인 확인 → 각 비동기 API에 같은 token 전달; 취소 후 연결·작업 종료 시험 | [Cancellation](https://learn.microsoft.com/en-us/dotnet/standard/threading/cancellation-in-managed-threads) |

새 사례를 발견하면 항목의 증거, 공식 출처, 재현 조건을 먼저 남긴 후 이어서 누적한다.
