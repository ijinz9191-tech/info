# 언어별 오류와 디버깅 출발점

확인일: 2026-09-30. 증상 이름은 원인이 아니다. 오류 메시지의 **첫 발생 위치, 실제 입력, 타입/상태, 직전 변경**을 확인하고 작은 재현 사례를 만든다. 디버거로 멈춰 보는 것과 성능 프로파일링은 서로 다른 도구다.

## 오류 분류

| 현상 | 먼저 묻는 질문 | 확인 자료 |
|---|---|---|
| 빌드 실패 | 컴파일러/SDK/패키지 버전이 맞는가? | 첫 오류, 잠금 파일, 빌드 명령 |
| 타입/값 오류 | 실제 런타임 값과 기대 타입은? | 경계 입력, 직렬화 결과, 스택 |
| 메모리 오류 | 객체 수명·소유권·범위는? | sanitizer, 덤프, 해제 경로 |
| 경합/교착 | 어떤 상태를 누가 언제 쓰는가? | 스레드 덤프, lock/trace, 재현 부하 |
| 성능 저하 | CPU, 대기, I/O, GC 중 어디가 늘었나? | 프로파일, trace, 기준 지표 |
| 간헐 실패 | 입력·시간·순서·리소스 사용량의 차이는? | seed, 시각, 요청 ID, 재시도 기록 |

## 언어별 흔한 출발점

| 언어 | 대표 증상 | 점검 방향 | 도구/원문 |
|---|---|---|---|
| Python | `TypeError`, `KeyError`, `AttributeError` | 실패 직전 값·타입, 누락 필드, `None`, 가변 객체 공유 | [pdb](https://docs.python.org/3/library/pdb.html) |
| Java | `NullPointerException`, 교착, GC 지연 | null 생성 지점, 스레드 상태, 할당·GC 추세 | [JFR](https://dev.java/learn/jvm/jfr/getting-started/) |
| C | segfault, use-after-free, 범위 초과 | 포인터 소유자, 길이·정수 변환, 할당/해제 순서 | [WG14](https://open-std.org/jtc1/sc22/wg14/) |
| C++ | dangling reference, iterator 무효화 | 객체/컨테이너 수명, 이동·예외 경로 | [C++ 표준 안내](https://isocpp.org/std/the-standard) |
| C# | `NullReferenceException`, ThreadPool 지연 | nullable 경계, async 체인, 풀 포화·덤프 | [.NET 진단](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/) |
| JS/TS | `undefined` 접근, 미처리 Promise | 비동기 호출/await, 외부 JSON의 런타임 검증 | [TS Handbook](https://www.typescriptlang.org/docs/handbook/) |
| Go | `nil` 접근, 데이터 경합, goroutine 누수 | 취소 전파, 공유 map, 종료 조건 | [Go 진단](https://go.dev/doc/diagnostics) |
| Rust | borrow/type 오류, panic | 소유권 흐름, `Result` 처리, 경계 인덱스 | [Rust Book](https://doc.rust-lang.org/book/) |

## 최소 재현 절차

1. 실패 입력과 버전, 실행 명령, 환경 변수를 기록한다. 비밀값은 제거한다.
2. 변경 범위를 반으로 줄이거나 기능을 하나씩 끄며 실패가 남는 최소 사례를 찾는다.
3. 같은 입력이 정상·실패할 때 시간을 포함한 로그와 상태를 비교한다.
4. 가설을 세우고 **반증 조건**을 적는다. 예: “DB 풀 고갈이면 대기 시간과 사용 중 연결 수가 함께 증가해야 한다.”
5. 한 번에 한 변수만 바꿔 재실행한다. 수정 전 실패, 수정 후 성공, 회귀 테스트를 각각 보존한다.

## 성능 문제의 자료 선택

- 함수가 CPU를 쓰는지 보려면 CPU 프로파일을 사용한다. 벽시계 지연만으로 CPU 사용을 판단하지 않는다.
- 응답이 느린 구간을 보려면 분산 trace와 DB 실행 계획을 본다. 누락된 span과 샘플링을 확인한다.
- 메모리는 현재 점유와 누적 할당을 구분한다. 캐시 확장, 누수, GC 지연은 다른 문제다.
- 간헐적 경합은 테스트·재현 부하로 실제 경로를 실행해야 한다. 한 번의 무오류 실행은 경합 부재의 증거가 아니다.

## 사후 기록

`증상 → 재현 조건 → 틀린 가설과 반증 → 확인된 원인 → 수정 → 테스트 → 남은 위험`을 남긴다. 운영 장애였다면 [장애 대응](incidents.md)의 타임라인·영향·완화 조치도 함께 기록한다.
