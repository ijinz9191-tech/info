# 언어별 추가 VOC 55건

확인일: 2026-09-30. [기존 언어별 VOC](voc-languages.md)와 **다른 증상·원인**을 각 언어에 한 건씩 추가했다. 표는 공식 언어/구현 문서를 바탕으로 작성한 **가능한 장애 시나리오**다. 실제 제품 버그나 사용자의 접수 기록이 아니며, 원인 후보는 재현과 관측으로 확인한다.

| ID | 언어 | 증상·확인할 증거 | 원인 후보 → 조치·해결 검증 | 공식 확인 입구 |
|---|---|---|---|---|
| L2-001 | C | 큰 입력에서 길이 계산이 음수/작은 값으로 바뀜; 입력 크기와 중간 산술 기록 | 정수 오버플로 → 연산 전 범위 검사; 최대·초과 크기를 sanitizer와 경계 테스트로 확인 | [WG14](https://open-std.org/jtc1/sc22/wg14/) |
| L2-002 | C++ | Debug/Release 또는 두 라이브러리 조합에서 링크·런타임 결과 차이; 컴파일 플래그와 ABI 비교 | ODR·표준 라이브러리 ABI 불일치 → 같은 표준·컴파일러·플래그로 재빌드; 양 구성 통합 테스트 | [Standard C++](https://isocpp.org/std/the-standard) |
| L2-003 | Rust | 비동기 작업을 스레드 간 이동시키지 못한다는 빌드 오류; `await` 전후 보유 값 확인 | `Send`가 아닌 값/락 가드 보유 → 수명을 줄이거나 로컬 실행으로 구조화; `cargo check`·취소 테스트 | [Rust Book](https://doc.rust-lang.org/book/) |
| L2-004 | Go | 요청 종료 후 goroutine 수가 계속 증가; goroutine dump와 context 취소 확인 | 채널 송수신 대기·취소 전파 누락 → 종료 신호와 대기 해제 설계; 부하 후 goroutine 수 복귀 확인 | [Go 문서](https://go.dev/doc/) |
| L2-005 | Zig | 오류가 발생했는데 자원이 정리되지 않음; 오류 반환 경로 추적 | 성공 경로에만 해제 배치 → 오류 경로 정리 규칙 적용; 각 실패 주입에서 누수 검사 | [Zig Learn](https://ziglang.org/learn/) |
| L2-006 | D | 안전 주석을 붙였지만 외부 바인딩에서 메모리 오류; 경계 호출·컴파일 속성 확인 | 안전 보장 밖의 FFI/시스템 코드 → 경계의 불변식과 소유권 명시; 같은 타깃에서 경계 테스트 | [D 명세](https://dlang.org/spec/spec.html) |
| L2-007 | Nim | C 라이브러리 호출 뒤 값이 깨짐; 구조체 크기·정렬 기록 | FFI 선언과 실제 ABI 불일치 → 타입·정렬·호출 규약을 헤더와 맞추고 왕복 테스트 | [Nim 매뉴얼](https://nim-lang.org/docs/manual.html) |
| L2-008 | Assembly (x86) | 음수/큰 수에서만 연산 결과가 틀림; 레지스터 폭과 플래그 확인 | 부호 확장·operand 크기 혼동 → ISA와 자료형 폭을 명시; 경계 정수 테스트 | [Intel 매뉴얼](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) |
| L2-009 | CUDA C++ | GPU를 써도 처리 시간이 더 길다; 전송·kernel 구간별 시간 측정 | 작은 작업에 비해 host/device 전송 비용이 큼 → 배치·전송 최소화; 전체 경로 지연 비교 | [CUDA 문서](https://docs.nvidia.com/cuda/) |
| L2-010 | WebAssembly | 메모리 확장 뒤 호스트가 옛 데이터를 읽음; `memory.grow` 전후 뷰 확인 | 선형 메모리 뷰/버퍼 수명 가정 → 확장 뒤 뷰를 다시 만들고 크기 경계 테스트 | [Wasm 명세](https://webassembly.github.io/spec/core/) |
| L2-011 | Ada | 여러 태스크가 멈춤; 태스크 상태·보호 객체 호출 순서 확인 | 동기화 순환 대기 → 잠금/진입 순서 재설계; 경쟁 부하에서 진행성 검증 | [AdaCore 문서](https://docs.adacore.com/live/wave/) |
| L2-012 | Fortran | 큰 행렬에서 성능 급감; 인덱스 순서별 메모리 접근 측정 | 열 우선 배열 배치와 루프 순서 불일치 → 접근 순서 조정; 결과 정확도와 실행 시간 비교 | [Fortran-lang](https://fortran-lang.org/learn/) |
| L2-013 | Pascal / Object Pascal | 큰 수 계산이 잘못되거나 예외 발생; 정수 형식과 범위 확인 | 타입 범위 초과·컴파일러 검사 옵션 차이 → 적합한 형식과 범위 검사; 극값 테스트 | [Free Pascal 문서](https://www.freepascal.org/docs.html) |
| L2-014 | VHDL | 시뮬레이션은 통과하지만 합성 회로 동작이 다름; 합성 경고와 파형 비교 | 비합성 구성·불완전 할당으로 래치 추론 → 합성 가능 구조로 변경; 합성 후 시뮬레이션 | [GHDL 문서](https://ghdl.github.io/ghdl/quick_start/index.html) |
| L2-015 | Java | 처리량이 줄고 대기 요청이 늘지만 CPU는 낮음; 스레드 덤프·풀 지표 | 블로킹 호출/풀 고갈 → 대기 원인과 풀 크기·하위 제한을 맞춤; 부하·꼬리 지연 테스트 | [Dev.java](https://dev.java/learn/) |
| L2-016 | Kotlin | Java API에서 null이 들어와 예외; 경계 반환 타입 확인 | 플랫폼 타입을 non-null처럼 신뢰 → 외부 경계에서 null 검증; null 반환 테스트 | [Kotlin 문서](https://kotlinlang.org/docs/home.html) |
| L2-017 | Scala | Future 실패가 사용자 응답까지 전달되지 않음; 실행 context·실패 콜백 확인 | 비동기 오류 전파 누락 → 실패 채널을 반환형/응답에 연결; 시간 초과·예외 테스트 | [Scala 문서](https://docs.scala-lang.org/) |
| L2-018 | Clojure | 상태 갱신이 일부만 보이거나 재시도된다; atom/ref/agent 사용과 함수 부작용 조사 | 상태 모델·재시도 의미 혼동 → 순수 갱신 함수와 적절한 참조 유형 사용; 동시 갱신 테스트 | [Clojure 참조](https://clojure.org/reference/) |
| L2-019 | Groovy | 문자열처럼 보이는 키로 Map 조회 실패; 키의 실제 클래스 확인 | `GString`과 `String` 값/해시 의미 차이 → 경계에서 명시적 변환; 동일 키 왕복 테스트 | [Groovy 문서](https://groovy-lang.org/documentation.html) |
| L2-020 | C# | 요청이 멈추고 스레드가 쌓임; 동기 대기와 비동기 호출 경로 확인 | `Task`를 동기적으로 막아 교착/스레드 고갈 → 끝까지 `await`; 동시 요청·취소 테스트 | [C# 참조](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/) |
| L2-021 | F# | 비동기 실패가 호출자에서 관측되지 않음; `Async`/`Task` 변환 지점 확인 | 계산만 만들고 실행·대기를 누락 → 명시적 실행/await와 실패 반환; 예외 테스트 | [F# 문서](https://learn.microsoft.com/en-us/dotnet/fsharp/) |
| L2-022 | Visual Basic .NET | 문자열 숫자 변환이 지역 설정마다 다름; culture·`Option Strict` 확인 | 묵시적 변환과 문화권 의존 파싱 → 명시적 파서·culture 지정; 다국어 입력 테스트 | [VB 문서](https://learn.microsoft.com/en-us/dotnet/visual-basic/) |
| L2-023 | COBOL | 금액의 부호·소수 자리가 어긋남; 원본/대상 레코드 레이아웃 비교 | PIC·압축 십진수·반올림 규칙 불일치 → 계약에 맞게 변환; 극값·음수·소수 테스트 | [IBM COBOL 문서](https://www.ibm.com/support/pages/enterprise-cobol-zos-documentation-library) |
| L2-024 | JavaScript | 화면을 반복 방문할수록 이벤트가 여러 번 실행됨; listener 수와 등록 위치 확인 | 이벤트 리스너 정리 누락 → 등록 수명과 해제 대칭화; 재방문 후 단일 호출 테스트 | [ECMAScript](https://tc39.es/ecma262/) |
| L2-025 | TypeScript | 로컬 빌드는 되나 배포에서 module import 실패; ESM/CJS 설정과 출력 확인 | 타입 경로와 런타임 모듈 해석 차이 → 실제 출력으로 실행 테스트; 깨끗한 배포 빌드 검증 | [TS Handbook](https://www.typescriptlang.org/docs/handbook/) |
| L2-026 | Python | 개발 환경에서만 import가 된다; 인터프리터·가상환경·설치 목록 비교 | 다른 Python/의존 버전 사용 → 실행 환경 고정; 새 환경 설치·테스트 | [Python 문서](https://docs.python.org/3/) |
| L2-027 | Ruby | 외부 파일/문자열 결합에서 인코딩 예외; 바이트·encoding 확인 | 서로 다른 인코딩의 문자열 혼합 → 입력 디코딩 정책 통일; 비ASCII 표본 테스트 | [Ruby 문서](https://www.ruby-lang.org/en/documentation/) |
| L2-028 | PHP | 같은 사용자 동시 요청이 직렬화되어 느림; 세션 잠금 시간 측정 | 세션 저장소 잠금을 오래 보유 → 필요한 범위만 세션 사용; 동시 요청 부하 테스트 | [PHP 매뉴얼](https://www.php.net/manual/en/manual.php) |
| L2-029 | Perl | 특정 정규식 입력에서 CPU가 급증; 입력 길이별 시간 측정 | 중첩 대안/반복의 과도한 역추적 → 패턴 단순화·길이 제한; 악성 패턴 입력 테스트 | [perldoc](https://perldoc.perl.org/) |
| L2-030 | Lua | coroutine 작업이 중간에서 멈춤; yield/resume 위치와 호스트 호출 확인 | 중단 불가 경계에서 yield 또는 resume 누락 → coroutine 계약 수정; 반복 중단/재개 테스트 | [Lua 매뉴얼](https://www.lua.org/manual/5.4/) |
| L2-031 | Bash | 파이프라인 앞 명령이 실패해도 성공 처리; 각 명령 종료 코드 확인 | 마지막 명령 코드만 확인 → `pipefail` 적용 여부와 명시적 검사; 앞 단계 실패 테스트 | [GNU Bash](https://www.gnu.org/software/bash/manual/) |
| L2-032 | PowerShell | 객체가 문자열로 바뀌어 속성을 못 읽음; 파이프라인 단계별 타입 확인 | 포맷 명령 또는 외부 프로세스 경계에서 형식 변환 → 객체 처리를 먼저 하고 출력 포맷은 마지막; 타입 테스트 | [PowerShell 문서](https://learn.microsoft.com/en-us/powershell/scripting/overview) |
| L2-033 | AWK / gawk | 입력 열 수가 행마다 달라짐; 실제 구분자·행 종료 확인 | 정규식 구분자의 메타문자 또는 빈 필드 오해 → `FS`를 명시하고 대표/경계 행 검사 | [GNU Awk](https://www.gnu.org/software/gawk/manual/gawk.html) |
| L2-034 | Tcl | UI가 작업 중 멈춤; 이벤트 루프와 콜백 실행 시간 측정 | 긴 동기 작업이 이벤트 처리를 차단 → 작업을 분할/비동기화; 입력 반응·취소 테스트 | [Tcl/Tk 매뉴얼](https://www.tcl-lang.org/man/index.html) |
| L2-035 | Crystal | 높은 동시성에서 작업이 정체; Fiber 스케줄·블로킹 호출 확인 | 블로킹 FFI/IO가 진행을 막음 → 경계 분리; 동시 요청 처리량과 지연 비교 | [Crystal 참조](https://crystal-lang.org/reference/) |
| L2-036 | Raku | 복잡한 grammar 입력에서 지연 급증; 입력 길이별 파싱 시간 확인 | 과도한 분기·역추적 → 문법을 좁히고 입력 한도 설정; 최악 사례 테스트 | [Raku 문서](https://docs.raku.org/) |
| L2-037 | Dart | isolate 간 메시지 전달 실패; 전송 객체 타입과 경계 확인 | 전송 가능한 값 계약 위반 → 직렬화/복사 경계 명시; 큰 메시지와 실패 테스트 | [Dart 문서](https://dart.dev/guides) |
| L2-038 | Swift | 동시성 경고/데이터 경합; actor 격리와 호출 위치 확인 | 격리된 상태를 다른 실행 문맥에서 변경 → actor 경계로 이동; 동시 테스트 | [Swift 언어 안내](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/guidedtour/) |
| L2-039 | Objective-C | observer 제거 뒤에도 콜백/상태 오류; 등록·해제 수명 확인 | 관찰자·블록 수명 관리 불일치 → observer 수명 명시; 화면 반복 생성/해제 테스트 | [Objective-C 문서](https://developer.apple.com/documentation/objectivec) |
| L2-040 | Haskell | 무한 입력에서 출력이 끝나지 않음; lazy 소비 범위 확인 | 생산/소비 종료 조건 부재 → 필요한 prefix·상한을 명시; 유한/무한 입력 테스트 | [Haskell 문서](https://www.haskell.org/documentation/) |
| L2-041 | OCaml | 다른 빌드에서 module을 못 찾음; 라이브러리·컴파일 단위 버전 확인 | module 경로·패키지 잠금 불일치 → 빌드 정의 고정; 깨끗한 환경 재현 | [OCaml 문서](https://ocaml.org/docs) |
| L2-042 | Elixir | 공유 ETS 표에서 지연 급증; 읽기/쓰기 비율과 경쟁 확인 | 단일 테이블/프로세스 병목 → 키 분할·소유권 조정; 동시 부하 측정 | [Elixir 문서](https://elixir-lang.org/docs.html) |
| L2-043 | Erlang | 배포 후 일부 노드만 다른 동작; 노드별 코드 버전 확인 | 릴리스/핫 코드 교체 상태 불일치 → 롤아웃·모듈 버전 일치; 노드별 회귀 테스트 | [Erlang 문서](https://www.erlang.org/docs) |
| L2-044 | Racket | 함수 계약 위반이 경계에서 발생; 호출자/제공자 값 확인 | module contract와 실제 값 불일치 → 계약을 입력 경계에서 맞춤; 위반 값 테스트 | [Racket 문서](https://docs.racket-lang.org/) |
| L2-045 | Gleam | 새 오류 값이 조용히 기본값으로 처리됨; `Result` 분기 확인 | 오류 변형을 일반 성공처럼 처리 → 모든 오류를 분기·전파; 실패 변형 테스트 | [Gleam 문서](https://gleam.run/documentation/) |
| L2-046 | Elm | JS port 입력 후 업데이트 실패; 디코더 오류와 payload 확인 | port 데이터 스키마가 예상과 다름 → decoder와 JS 계약 맞춤; 잘못된 payload 테스트 | [Elm 가이드](https://guide.elm-lang.org/) |
| L2-047 | Prolog | 같은 질의에 중복/잘못된 해가 나옴; 바인딩과 절 순서 확인 | 자유 변수·규칙 범위가 너무 넓음 → 목표와 제약을 명시; 참/거짓 사례로 질의 검증 | [SWI-Prolog](https://www.swi-prolog.org/pldoc/) |
| L2-048 | SQL | 동시 쓰기에서 deadlock/직렬화 실패; 잠금 대기 그래프 확인 | 반대 순서로 행 잠금 또는 격리 충돌 → 잠금 순서 통일·제한 재시도; 동시 트랜잭션 테스트 | [PostgreSQL 문서](https://www.postgresql.org/docs/current/) |
| L2-049 | R | 학습/예측 데이터의 범주 값이 달라 실패; factor levels 비교 | 새 데이터에 미학습 수준 등장 → 전처리 계약 고정; 새로운/누락 수준 테스트 | [R 매뉴얼](https://cran.r-project.org/manuals.html) |
| L2-050 | Julia | 특정 인자 조합에서 `MethodError`; 실제 타입과 dispatch 후보 확인 | 정의된 메서드와 전달 타입 불일치 → 타입·변환/메서드 범위 조정; 조합 테스트 | [Julia 문서](https://docs.julialang.org/) |
| L2-051 | MATLAB | 동일 이름 함수가 다른 구현을 호출; 현재 경로와 함수 위치 확인 | path 순서/이름 가림 → 경로를 정리하고 호출 대상 고정; 새 세션 재현 | [MATLAB 문서](https://www.mathworks.com/help/matlab/) |
| L2-052 | Solidity | 정상 거래가 가스 한도에서 실패; 입력 크기와 가스 사용량 확인 | 무한/큰 반복·저장소 쓰기 비용 → 작업을 나누고 비용 상한 검증; 큰 입력 테스트 | [Solidity 문서](https://docs.soliditylang.org/) |
| L2-053 | Haxe | 의존 라이브러리 업그레이드 뒤 빌드 실패; haxelib/컴파일러 버전 확인 | 라이브러리와 컴파일 타깃의 버전 충돌 → 호환 버전 고정; 각 타깃 깨끗한 빌드 | [Haxe 문서](https://haxe.org/documentation/introduction/) |
| L2-054 | ABAP | 업데이트가 성공처럼 보이나 DB에 반영되지 않음; update task와 commit 결과 확인 | 업무 트랜잭션 커밋/오류 처리 누락 → 갱신 결과와 트랜잭션 경계 명시; 롤백·재시도 테스트 | [SAP ABAP 문서](https://help.sap.com/docs/abap-cloud/abap-keyword/abap-syntax-elements-of-abap-program) |
| L2-055 | Apex | 동시 수정에서 잠금 오류; 객체·트랜잭션·재시도 로그 확인 | 같은 레코드에 대한 동시 쓰기 경쟁 → 쓰기 순서/분할·제한 재시도; 동시 배치 테스트 | [Salesforce Apex](https://developer.salesforce.com/docs/platform/aura-platform/guide/apex-intro.html) |

**적용 순서:** 버전·최소 재현을 고정하고 표의 원인 후보를 반증할 증거를 먼저 찾는다. 원인이 확인되면 한 번에 하나의 조치를 적용하고 기존 성공 경로와 실패 경로를 회귀 테스트한다.
