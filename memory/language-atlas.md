# 프로그래밍 언어 확장 지도

확인일: 2026-09-30. 이 문서는 오프라인에서 **언어를 처음 만났을 때 무엇을 확인할지** 찾는 색인이다. [주요 언어의 상세 판단](languages.md)과 함께 사용한다. 표의 문서는 각 언어 또는 구현의 공식 입구다. 언어 명세, 특정 구현, 프레임워크 API는 서로 다르며 실제 작업에는 버전과 구현을 고정한다.

## 시스템·저수준·하드웨어

| 언어 | 핵심 모델과 점검점 | 공식 입구 |
|---|---|---|
| C | 포인터 수명, 메모리 배치, 정수 범위, ABI, 미정의 동작 | [WG14](https://open-std.org/jtc1/sc22/wg14/) |
| C++ | 객체 수명, RAII, 템플릿, 이동, iterator 무효화 | [Standard C++](https://isocpp.org/std/the-standard) |
| Rust | 소유권·빌림, `Result`, trait, `unsafe` 경계 | [Rust Book](https://doc.rust-lang.org/book/) |
| Go | 값 복사, interface, 오류 반환, goroutine 종료와 경합 | [Go 문서](https://go.dev/doc/) |
| Zig | 명시적 allocator와 오류 집합, 타깃·빌드 설정 | [Zig Learn](https://ziglang.org/learn/) |
| D | GC·수동 관리 경계, 템플릿, `@safe` 적용 범위 | [D 명세](https://dlang.org/spec/spec.html) |
| Nim | 참조/값 의미, 메모리 관리 모드, 매크로 생성 코드 | [Nim 매뉴얼](https://nim-lang.org/docs/manual.html) |
| Assembly (x86) | ISA·호출 규약·레지스터 보존·스택 정렬 | [Intel 소프트웨어 개발자 매뉴얼](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) |
| CUDA C++ | host/device 메모리, kernel 경계, 동기화와 전송 비용 | [CUDA 문서](https://docs.nvidia.com/cuda/) |
| WebAssembly | 모듈·메모리·호스트 import, 언어와 런타임의 경계 | [Wasm 핵심 명세](https://webassembly.github.io/spec/core/) |
| Ada | 강한 타입·범위 제약, 태스크, 컴파일러별 런타임 | [AdaCore 문서](https://docs.adacore.com/live/wave/) |
| Fortran | 배열 차원·열 우선 배치, 수치 정밀도, 병렬 라이브러리 | [Fortran-lang](https://fortran-lang.org/learn/) |
| Pascal / Object Pascal | 타입·유닛·객체 확장, 컴파일러와 런타임 호환성 | [Free Pascal 문서](https://www.freepascal.org/docs.html) |
| VHDL | 신호 갱신과 시뮬레이션 시간, 합성 가능 코드의 차이 | [GHDL 문서](https://ghdl.github.io/ghdl/quick_start/index.html) |

## JVM·.NET·기업 시스템

| 언어 | 핵심 모델과 점검점 | 공식 입구 |
|---|---|---|
| Java | 객체·제네릭·컬렉션 계약, 스레드, JVM/GC | [Dev.java](https://dev.java/learn/) |
| Kotlin | null 안전성, 코루틴 취소, JVM·Android·멀티플랫폼 차이 | [Kotlin 문서](https://kotlinlang.org/docs/home.html) |
| Scala | JVM 위 함수형·객체형 혼합, 타입 추론, 버전별 API | [Scala 문서](https://docs.scala-lang.org/) |
| Clojure | 불변 데이터, 시퀀스 지연 평가, 참조·상태 관리 | [Clojure 참조](https://clojure.org/reference/) |
| Groovy | 동적/정적 컴파일, Java 상호운용, DSL 평가 경계 | [Groovy 문서](https://groovy-lang.org/documentation.html) |
| C# | 값·참조, nullable, `Task`, 자원 수명 | [C# 참조](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/) |
| F# | 식·불변 값·패턴 매칭, .NET 상호운용과 예외 | [F# 문서](https://learn.microsoft.com/en-us/dotnet/fsharp/) |
| Visual Basic .NET | .NET 타입·이벤트·비동기, 언어별 문법 차이 | [VB 문서](https://learn.microsoft.com/en-us/dotnet/visual-basic/) |
| COBOL | 고정된 데이터 형식, 파일/트랜잭션, 플랫폼·방언 | [IBM Enterprise COBOL 문서](https://www.ibm.com/support/pages/enterprise-cobol-zos-documentation-library) |

## 웹·스크립트·셸

| 언어 | 핵심 모델과 점검점 | 공식 입구 |
|---|---|---|
| JavaScript | 이벤트 루프, Promise, 동적 타입, 브라우저/Node 호스트 차이 | [ECMAScript](https://tc39.es/ecma262/) |
| TypeScript | 구조적 타입과 타입 소거, 외부 입력의 런타임 검증 | [TS Handbook](https://www.typescriptlang.org/docs/handbook/) |
| Python | 별칭·가변 값, 예외, 가상환경, coroutine 실행 | [Python 문서](https://docs.python.org/3/) |
| Ruby | 객체·블록, 동적 dispatch, gem·런타임 버전 | [Ruby 문서](https://www.ruby-lang.org/en/documentation/) |
| PHP | 요청 수명, 타입 변환, 확장·패키지와 배포 환경 | [PHP 매뉴얼](https://www.php.net/manual/en/manual.php) |
| Perl | 스칼라·배열·해시 문맥, 정규식, 모듈 버전 | [perldoc](https://perldoc.perl.org/) |
| Lua | 테이블·메타테이블, 임베딩 호스트, 버전별 API | [Lua 5.4 매뉴얼](https://www.lua.org/manual/5.4/) |
| Bash | 인용·확장 순서, 종료 코드, 파이프라인, 파일명 안전성 | [GNU Bash 매뉴얼](https://www.gnu.org/software/bash/manual/) |
| PowerShell | 객체 파이프라인, 오류 스트림, 자동 변수, 버전/플랫폼 | [PowerShell 문서](https://learn.microsoft.com/en-us/powershell/scripting/overview) |
| AWK / gawk | 입력을 레코드·필드로 나누고 패턴/동작 규칙을 적용; 구현 확장 구별 | [GNU Awk 매뉴얼](https://www.gnu.org/software/gawk/manual/gawk.html) |
| Tcl | 문자열·명령 평가와 인용 규칙, 확장과 이벤트 루프 | [Tcl/Tk 매뉴얼](https://www.tcl-lang.org/man/index.html) |
| Crystal | 컴파일 시 타입 추론, 매크로, 메모리 관리와 C 바인딩 | [Crystal 참조](https://crystal-lang.org/reference/) |
| Raku | 문법·다중 dispatch·동시성 기능과 Perl과의 차이 | [Raku 문서](https://docs.raku.org/) |
| Dart | sound null safety, async, Flutter/VM/web 타깃 차이 | [Dart 문서](https://dart.dev/guides) |
| Swift | 값 타입·optional·actor, Apple SDK 버전 | [Swift 언어 안내](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/guidedtour/) |
| Objective-C | 메시지 전송, ARC, Swift 상호운용, Apple SDK | [Objective-C 문서](https://developer.apple.com/documentation/objectivec) |

## 함수형·동시성·논리

| 언어 | 핵심 모델과 점검점 | 공식 입구 |
|---|---|---|
| Haskell | 순수 함수·지연 평가, effect 경계, 타입 클래스 | [Haskell 문서](https://www.haskell.org/documentation/) |
| OCaml | 대수적 자료형·패턴 매칭, module, 가변 상태의 범위 | [OCaml 문서](https://ocaml.org/docs) |
| Elixir | 불변 값·프로세스·메시지, OTP supervision | [Elixir 문서](https://elixir-lang.org/docs.html) |
| Erlang | 경량 프로세스, mailbox, supervisor, 분산 노드 | [Erlang 문서](https://www.erlang.org/docs) |
| Racket | 언어 확장·매크로, module·phase 구분 | [Racket 문서](https://docs.racket-lang.org/) |
| Gleam | 정적 타입·불변 값, Erlang/JavaScript 대상별 상호운용 | [Gleam 문서](https://gleam.run/documentation/) |
| Elm | 메시지·update·view 구조, JS 상호운용 경계 | [Elm 가이드](https://guide.elm-lang.org/) |
| Prolog | 사실·규칙·질의, unification, backtracking 비용 | [SWI-Prolog 문서](https://www.swi-prolog.org/pldoc/) |

## 데이터·과학·특수 목적

| 언어 | 핵심 모델과 점검점 | 공식 입구 |
|---|---|---|
| SQL | 집합·NULL의 3값 논리, 조인·트랜잭션·실행 계획 | [PostgreSQL SQL 문서](https://www.postgresql.org/docs/current/) |
| R | 벡터 재활용·결측값, 패키지·재현성 | [R 매뉴얼](https://cran.r-project.org/manuals.html) |
| Julia | 다중 dispatch, 타입 안정성, 첫 실행 컴파일 비용 | [Julia 문서](https://docs.julialang.org/) |
| MATLAB | 배열·행렬 연산, 차원과 묵시적 확장, toolbox 의존성 | [MATLAB 문서](https://www.mathworks.com/help/matlab/) |
| Solidity | 저장소·가스·외부 호출, 재진입과 권한 | [Solidity 문서](https://docs.soliditylang.org/) |
| Haxe | 여러 타깃으로 컴파일, 타깃별 API와 조건부 코드 | [Haxe 문서](https://haxe.org/documentation/introduction/) |
| ABAP | SAP 데이터·트랜잭션, 플랫폼 버전별 언어 범위 | [SAP ABAP 키워드 문서](https://help.sap.com/docs/abap-cloud/abap-keyword/abap-syntax-elements-of-abap-program) |
| Apex | Salesforce 트랜잭션·실행 제한, 권한과 데이터 접근 | [Salesforce Apex 개발 안내](https://developer.salesforce.com/docs/platform/aura-platform/guide/apex-intro.html) |

## 어떤 언어든 먼저 확인할 8가지

1. **명세와 구현:** 언어 버전, 컴파일러/인터프리터, 표준 라이브러리, OS와 CPU를 구분한다.
2. **값과 수명:** 값 복사인지 참조인지, 객체·자원 해제 주체가 누구인지 확인한다.
3. **오류:** 예외·반환 값·프로세스 종료 코드 중 무엇을 쓰는지, 실패가 유실되는 경계를 찾는다.
4. **동시성:** 태스크·스레드·프로세스·이벤트 루프의 진행 및 취소 규칙을 확인한다.
5. **입출력:** 인코딩, 시간대, 파일 경로, 네트워크 타임아웃을 명시한다.
6. **외부 입력:** 파서·직렬화·타입 주석의 보장 범위를 검증한다.
7. **재현:** 의존성 잠금, 빌드 플래그, 최소 입력, 테스트 명령을 남긴다.
8. **운영:** 프로파일러·디버거·로그·트레이스에서 확인 가능한 신호를 정한다.

이 표의 폭은 언어별 문법/API의 완전한 사본을 뜻하지 않는다. 후속 작성 우선순위와 깊이는 [범위 장부](coverage.md)에 기록한다.
