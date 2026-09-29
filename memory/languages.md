# 프로그래밍 언어 지도

확인일: 2026-09-30. 언어를 바꿀 때 가장 많이 틀리는 지점은 **값·소유권·오류·동시성·빌드 단위**다. 문법을 옮기기 전에 이 다섯 가지를 확인한다.

## 주요 언어 빠른 비교

| 언어 | 확인할 핵심 | 일반적인 실행·검증 | 공식 근거 |
|---|---|---|---|
| Python | 가변 객체 별칭, 예외, 패키지 환경, `asyncio` | `python -m unittest` 또는 `pytest`; 의존성 버전 고정 | [Python 문서](https://docs.python.org/3/) |
| Java | 참조·값, 제네릭, 컬렉션, JVM, 스레드 | JDK 버전 고정, Gradle/Maven 테스트 | [Dev.java](https://dev.java/learn/) |
| C | 포인터 수명, 정수 범위, 미정의 동작, ABI | 경고 활성화, sanitizer, 플랫폼별 빌드 | [WG14](https://open-std.org/jtc1/sc22/wg14/) |
| C++ | 객체 수명, RAII, 이동, 템플릿, 예외 안전성 | 표준 버전 명시, 컴파일러별 테스트 | [Standard C++](https://isocpp.org/std/the-standard) |
| C# | 값/참조 형식, nullable, `Task`, `IDisposable` | SDK 버전 고정, `dotnet test` | [C# 참조](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/) |
| JavaScript | 동적 타입, 프로토타입, 이벤트 루프, Promise | 런타임/브라우저 버전 고정, 자동 테스트 | [ECMAScript 명세](https://tc39.es/ecma262/) |
| TypeScript | 구조적 타입, narrowing, 런타임 검증의 부재 | `tsc --noEmit`, JS 런타임 테스트 | [TS Handbook](https://www.typescriptlang.org/docs/handbook/) |
| Go | 값 복사, 인터페이스, 오류 반환, goroutine | `go test ./...`, race detector | [Go 문서](https://go.dev/doc/) |
| Rust | 소유권·빌림·수명, `Result`, trait | `cargo test`, `cargo clippy` | [Rust Book](https://doc.rust-lang.org/book/) |
| SQL | 집합 연산, NULL, 트랜잭션 격리, 실행 계획 | 실제 DB 엔진에서 테스트·계획 확인 | [PostgreSQL 문서](https://www.postgresql.org/docs/current/) |

## 작업별 메모

### Python

- 리스트·딕셔너리 같은 가변 객체를 여러 이름이 참조하면 한쪽의 수정이 다른 쪽에 보인다. 함수 기본 인수에 가변 객체를 두지 않는다.
- `try`는 예상 가능한 좁은 범위에 둔다. 구체적인 예외를 처리하고 예상 못 한 예외는 원인과 스택을 남긴 뒤 전파한다.
- `async def` 함수 호출은 코루틴 객체를 만든다. 실행은 `await` 또는 태스크 예약이 필요하다. CPU 계산을 비동기로 선언해도 자동 병렬화되지는 않는다.
- 환경을 재현할 때 인터프리터 버전, 가상환경, 잠금 파일, 운영체제 의존 패키지를 함께 기록한다. [튜토리얼](https://docs.python.org/3/tutorial/), [예외](https://docs.python.org/3/tutorial/errors.html).

### Java

- `List`는 순서와 중복, `Set`은 중복 제거, `Map`은 키 조회의 계약을 먼저 고른다. 구체 구현의 동시성·순서 보장은 별도 확인한다.
- `equals`와 `hashCode`의 일관성은 해시 기반 컬렉션의 키에 필수다. 키 객체의 해시 관련 상태를 삽입 뒤 변경하지 않는다.
- 공유 가변 상태는 `synchronized`, lock, 불변 값, `java.util.concurrent` 중 하나의 명확한 동기화 전략을 선택한다. 스레드가 많아도 I/O·DB 제한은 그대로 남는다.
- JVM 문제는 애플리케이션 예외, 스레드 덤프, 힙/GC, JFR 자료를 나눠 본다. [언어 기초](https://dev.java/learn/language-basics/), [컬렉션](https://dev.java/learn/api/collections-and-streams/collections-framework/intro/).

### C와 C++

- C에서는 포인터의 유효 범위와 소유자를 명시한다. 할당·해제 경로마다 중복 해제, 사용 후 해제, 범위 밖 접근을 검사한다. 입력 크기와 정수 산술의 오버플로 가능성을 별도로 본다.
- C++에서는 리소스를 객체 수명에 묶고(RAII), 가능하면 소유권을 표현하는 표준 컨테이너와 스마트 포인터를 사용한다. 참조·iterator 무효화 규칙은 컨테이너 연산마다 다르다.
- 두 언어 모두 컴파일 성공이 미정의 동작 부재를 뜻하지 않는다. 경고, sanitizer, 정적 분석, 경계·실패 테스트를 함께 사용한다.
- C23과 C++23의 표준 상태는 각각 [WG14](https://open-std.org/jtc1/sc22/wg14/)와 [Standard C++](https://isocpp.org/std/the-standard)에서 확인했다. 특정 컴파일러 지원 범위는 구현 문서에서 다시 확인한다.

### C#과 .NET

- `Task<T>`는 비동기 작업의 결과다. `await`는 대기 중 호출자에게 제어를 돌려주며, 기본적으로 새 스레드를 뜻하지 않는다.
- 취소는 `CancellationToken`을 호출 경계로 전달한다. 네트워크·파일·DB 호출에서 취소가 실제로 지원되는지 확인한다.
- `IDisposable`/`IAsyncDisposable`은 자원 수명 계약이다. `using`/`await using`으로 핸들, 스트림, 연결을 정리한다.
- nullable 분석을 켜도 외부 JSON·DB 값은 런타임 검증이 필요하다. [언어 참조](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/), [`await`](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/await).

### JavaScript와 TypeScript

- 브라우저 DOM API와 Node API는 ECMAScript 언어 자체와 구별한다. 같은 JS 코드라도 호스트 환경에서 제공하는 기능이 다르다.
- Promise 거부와 동기 예외는 호출 경계에서 모두 다뤄야 한다. 이벤트 리스너·타이머·구독은 해제 시점을 설계한다.
- TypeScript 타입은 빌드 뒤 사라진다. HTTP, 파일, 메시지 입력을 타입 선언만으로 신뢰하지 말고 런타임에서 검증한다.
- `strict` 모드를 기준으로 타입 오류를 줄이고, `any` 대신 명시적 경계에서 `unknown`을 좁힌다. [ECMAScript](https://tc39.es/ecma262/), [TypeScript](https://www.typescriptlang.org/docs/handbook/intro).

### Go와 Rust

- Go는 오류를 값으로 반환하므로 호출 단계에서 맥락을 보존해 전파한다. goroutine의 종료 조건과 `context.Context` 취소 전파를 설계한다.
- Go의 map 동시 접근, 데이터 경합, 채널 닫기 주체를 점검한다. `go test -race ./...`는 실제 경로를 실행해야 경합을 찾는다.
- Rust는 소유권과 빌림을 통해 많은 수명 오류를 컴파일 때 거른다. `Result` 오류 경로를 버리지 말고, `unsafe`에는 불변식과 테스트를 남긴다.
- [Go 공식 문서](https://go.dev/doc/), [Rust Book](https://doc.rust-lang.org/book/). Go의 [Effective Go](https://go.dev/doc/effective_go)는 유용하지만 공식 페이지 자체가 최신 기능을 모두 다루지 않는다고 밝힌다.

## 추가 언어와 공식 입구

| 영역 | 언어와 공식 문서 | 먼저 확인할 것 |
|---|---|---|
| 모바일 | [Kotlin](https://kotlinlang.org/docs/reference/), [Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/guidedtour/) | null/optional, 비동기, 플랫폼 API |
| 웹 서버 | [PHP](https://www.php.net/manual/en/manual.php), [Ruby](https://www.ruby-lang.org/en/documentation/) | 런타임 버전, 패키지, 요청 수명 |
| 셸 | [Bash](https://www.gnu.org/software/bash/manual/) | 인용, 종료 코드, 파이프라인 오류 |
| 데이터 | [R](https://cran.r-project.org/manuals.html), [Julia](https://docs.julialang.org/) | 벡터화, 패키지 환경, 수치 정확도 |
| 함수형 | [Elixir](https://elixir-lang.org/docs.html), [Haskell](https://www.haskell.org/documentation/) | 불변 데이터, 오류 모델, 런타임 |

위 표는 각 언어의 전체 명세를 담는 대신, 오프라인 개발에서 오류를 피할 핵심 판단과 공식 문서의 입구를 남긴다. 새 언어가 필요한 경우 [갱신 절차](maintenance.md)에 따라 별도 문서를 추가한다.
