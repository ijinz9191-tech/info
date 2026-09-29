# 프레임워크·런타임 VOC 추가 사례 33건

확인일: 2026-09-30. 각 행은 실제 접수 기록이 아니라 공식 문서의 동작 계약을 바탕으로 만든 **재현 가능한 장애 가설**이다. 증상만으로 원인을 확정하지 말고, 먼저 증거를 모아 최소 재현으로 확인한다. 제품 버전별 차이는 해당 버전의 공식 문서에서 다시 확인한다. [프레임워크 지도](framework-atlas.md), [기존 React·Spring Boot 심화](react-deep-dive.md), [Spring Boot 심화](spring-boot-deep-dive.md)도 참고한다.

| ID | 프레임워크·런타임 | 증상과 먼저 볼 증거 | 원인 가설 → 조치와 해결 검증 | 공식 확인 입구 |
|---|---|---|---|---|
| F2-001 | React | 사용자 입력 후 일부 자식 컴포넌트가 계속 다시 렌더된다. Profiler의 commit과 context 소비 범위를 기록한다. | 자주 변하는 값이 넓은 context에 섞였는지 확인한다 → context를 책임별로 나누거나 값을 필요한 위치로 옮긴다. 같은 입력에서 불필요한 commit이 줄고 화면 값이 유지되는지 확인한다. | [useContext](https://react.dev/reference/react/useContext) |
| F2-002 | Angular | 페이지 이동 후 이전 컴포넌트의 스트림 처리가 계속된다. 구독 수와 destroy 시점을 기록한다. | 구독 정리가 수명과 연결되지 않았는지 확인한다 → `takeUntilDestroyed` 같은 수명 연동을 적용한다. 왕복 이동 후 활성 구독 수가 누적되지 않는지 본다. | [RxJS interop](https://angular.dev/ecosystem/rxjs-interop) |
| F2-003 | Vue | 구조 분해한 값만 변경을 따라가지 않는다. 원본 reactive 객체와 로컬 변수의 갱신을 나란히 기록한다. | 반응형 proxy의 속성을 일반 변수로 분리했는지 확인한다 → `toRefs`/`toRef` 또는 원본 접근을 사용한다. 상태 갱신 후 양쪽 표시가 일치하는지 검증한다. | [Reactivity fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals) |
| F2-004 | Svelte | 서버 렌더에서 브라우저 전용 API 접근으로 페이지가 실패한다. SSR 스택과 브라우저 전용 참조 위치를 찾는다. | 초기화 경로가 서버에서도 실행되는지 확인한다 → 브라우저 수명 단계로 코드를 옮긴다. 서버 렌더와 클라이언트 탐색을 모두 시험한다. | [Lifecycle hooks](https://svelte.dev/docs/svelte/lifecycle-hooks) |
| F2-005 | Next.js | 수정한 서버 데이터가 화면에 늦게 반영된다. 해당 경로의 캐시 설정과 재검증 동작을 기록한다. | 데이터 취득과 경로 캐시 정책이 기대와 다른지 확인한다 → 필요한 경로에서 명시적 재검증 또는 동적 취득을 적용한다. 수정 직후 응답과 이후 캐시 동작을 시험한다. | [Caching guide](https://nextjs.org/docs/app/guides/caching) |
| F2-006 | Nuxt | 새로고침에서만 API 호출이나 상태가 달라진다. 서버 렌더 응답과 클라이언트 탐색의 데이터 요청을 비교한다. | 서버·클라이언트 양쪽에서 중복 호출하거나 키를 달리 쓰는지 확인한다 → `useFetch`/`useAsyncData`의 키와 실행 위치를 정리한다. 직접 URL 진입과 내부 탐색을 비교한다. | [Data fetching](https://nuxt.com/docs/getting-started/data-fetching) |
| F2-007 | Node.js | 대용량 파일 전송 중 메모리가 급증한다. heap과 stream backpressure 지표를 본다. | 스트림을 무제한 버퍼링하거나 쓰기 반환값을 무시하는지 확인한다 → `pipeline`과 backpressure를 사용한다. 동일 부하에서 RSS와 처리량이 안정적인지 시험한다. | [Streams](https://nodejs.org/api/stream.html) |
| F2-008 | Express | 특정 요청의 오류가 공통 오류 처리기에 도달하지 않는다. 미들웨어 등록 순서와 전달된 오류를 기록한다. | 오류 처리 미들웨어의 위치 또는 비동기 오류 전달 방식을 확인한다 → 라우트 뒤에 오류 처리기를 등록하고 사용하는 Express 버전의 비동기 처리 계약에 맞춘다. 실패 요청의 상태 코드와 로그를 확인한다. | [Error handling](https://expressjs.com/en/guide/error-handling.html) |
| F2-009 | NestJS | 일부 엔드포인트만 의존성 주입 오류로 시작하지 못한다. 모듈 import/export 그래프와 provider 토큰을 기록한다. | provider가 올바른 모듈에서 export되지 않았는지 확인한다 → 모듈 경계를 수정한다. 앱 부팅과 해당 라우트 요청을 모두 시험한다. | [Modules](https://docs.nestjs.com/modules) |
| F2-010 | Hono | 런타임을 바꾸자 같은 핸들러의 환경 변수 접근이 실패한다. 배포 런타임과 binding 구성을 확인한다. | 플랫폼별 환경 바인딩 접근 방식이 달라졌는지 확인한다 → Hono의 해당 런타임용 env/bindings 타입과 배포 설정을 맞춘다. 로컬·대상 런타임에서 같은 요청을 시험한다. | [Context](https://hono.dev/docs/api/context) |
| F2-011 | Django | 목록 화면에서 행 수에 비례해 SQL 호출이 늘어난다. Django query 로그와 템플릿의 관계 접근을 본다. | 관계의 지연 로딩으로 N+1이 생겼는지 확인한다 → 관계 형태에 맞춰 `select_related`/`prefetch_related`를 적용한다. 동일 목록의 쿼리 수와 결과를 비교한다. | [QuerySet API](https://docs.djangoproject.com/en/stable/ref/models/querysets/) |
| F2-012 | FastAPI | 요청이 적어도 다른 요청의 응답이 멈춘다. 이벤트 루프 작업과 동기 I/O 호출 시간을 기록한다. | `async def` 안에 차단성 호출이 있는지 확인한다 → 비동기 라이브러리 또는 적절한 스레드 실행 경계를 사용한다. 동시 요청 지연 분포를 비교한다. | [Async](https://fastapi.tiangolo.com/async/) |
| F2-013 | Flask | 비동기 작업 또는 별도 스레드에서 요청 객체 접근이 실패한다. 스택과 context 생성 위치를 확인한다. | request context 수명 밖에서 proxy를 참조했는지 확인한다 → 필요한 값을 요청 중에 복사해 전달한다. 요청 종료 뒤 작업 실행도 시험한다. | [Request context](https://flask.palletsprojects.com/en/stable/reqcontext/) |
| F2-014 | Spring Boot | 시작 시 순환 참조 오류가 난다. bean 생성 그래프와 오류에 나온 주입 경로를 기록한다. | 두 서비스가 서로 생성자 주입하는지 확인한다 → 책임을 분리하거나 의존 방향을 바꾼다. 애플리케이션 시작과 주요 호출 경로를 검증한다. | [Dependency injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html) |
| F2-015 | ASP.NET Core | 요청별 상태가 다른 사용자에게 섞인다. 서비스 등록 수명과 singleton이 참조하는 객체를 살핀다. | singleton이 scoped 서비스 또는 가변 요청 상태를 보관하는지 확인한다 → DI 수명을 맞추고 요청 상태 저장을 분리한다. 동시 사용자 요청에서 값이 격리되는지 시험한다. | [Dependency injection](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection) |
| F2-016 | Rails | 배포 후 일부 서버에서 새 컬럼을 읽지 못한다. schema 버전과 각 프로세스의 배포 순서를 비교한다. | 코드가 데이터베이스 변경보다 먼저 배포됐는지 확인한다 → 확장 후 전환하는 호환 마이그레이션 순서를 만든다. 이전·새 버전 공존 구간의 읽기·쓰기를 검증한다. | [Migrations](https://guides.rubyonrails.org/active_record_migrations.html) |
| F2-017 | Laravel | 작업이 성공 응답을 내지만 큐 작업이 처리되지 않는다. queue connection, failed jobs, worker 상태를 본다. | 작업이 잘못된 연결에 쌓였거나 worker가 실행되지 않는지 확인한다 → 연결 설정과 worker 운영을 맞춘다. 고유 작업 ID로 enqueue부터 완료까지 추적한다. | [Queues](https://laravel.com/docs/queues) |
| F2-018 | Flutter | 페이지를 닫은 뒤 비동기 응답이 돌아오며 상태 갱신 오류가 난다. `dispose` 시각과 callback 시각을 비교한다. | 화면 수명 종료 후 `setState`가 호출되는지 확인한다 → 구독·타이머를 해제하거나 `mounted`를 확인한다. 빠른 화면 왕복에서도 오류가 없는지 시험한다. | [StatefulWidget](https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html) |
| F2-019 | Android Jetpack | 화면 회전 뒤 진행 중인 작업의 결과가 사라지거나 중복된다. Activity 재생성과 ViewModel 수명을 기록한다. | UI 컴포넌트 수명에 작업을 묶었는지 확인한다 → 적절한 ViewModel/state 저장 경계로 옮긴다. 회전 및 프로세스 재생성 시나리오를 따로 시험한다. | [UI state](https://developer.android.com/topic/libraries/architecture/viewmodel) |
| F2-020 | SwiftUI | 목록 항목을 재정렬하자 다른 행의 입력 상태가 붙는다. `ForEach`에 쓴 식별자를 확인한다. | 인덱스처럼 변하는 값을 identity로 썼는지 확인한다 → 데이터의 안정적인 고유 ID를 사용한다. 삽입·삭제·재정렬 후 각 행의 상태를 검증한다. | [ForEach](https://developer.apple.com/documentation/swiftui/foreach) |
| F2-021 | Electron | 렌더러에서 Node API 호출이 차단되거나 임의 페이지가 IPC를 호출한다. `webPreferences`, preload, IPC 채널을 점검한다. | 격리와 bridge 구성이 맞지 않는지 확인한다 → 필요한 기능만 preload의 제한된 API로 노출하고 IPC 입력을 검증한다. 허용·거부 경로를 모두 시험한다. | [Context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation) |
| F2-022 | Qt | 백그라운드 작업 후 UI가 멈추거나 잘못된 스레드 경고가 난다. 객체의 thread affinity와 signal 연결을 확인한다. | worker에서 위젯을 직접 변경하는지 확인한다 → signal/slot으로 UI 스레드에 결과를 전달한다. 작업 중 입력 응답성과 완료 표시를 검증한다. | [Threads and QObjects](https://doc.qt.io/qt-6/threads-qobject.html) |
| F2-023 | Unity | 물리 충돌 결과가 프레임마다 다르다. `Update`/`FixedUpdate`의 힘 적용 위치와 timestep을 확인한다. | 물리 변경을 렌더 프레임에 묶었는지 확인한다 → 물리 처리를 고정 업데이트 경계로 옮긴다. 프레임률을 바꿔 같은 입력 결과를 비교한다. | [FixedUpdate](https://docs.unity3d.com/ScriptReference/MonoBehaviour.FixedUpdate.html) |
| F2-024 | PyTorch | 학습 중 모델 파라미터에 gradient가 쌓이지 않는다. `requires_grad`, `grad_fn`, `no_grad` 범위를 본다. | 그래프를 끊는 변환이나 `no_grad` 범위가 들어갔는지 확인한다 → 손실까지 미분 가능한 연산 경로를 유지한다. 작은 배치에서 gradient가 생기는지 검사한다. | [Autograd](https://pytorch.org/docs/stable/notes/autograd.html) |
| F2-025 | TensorFlow | 입력 배치마다 함수 tracing이 반복되어 지연이 커진다. trace count와 입력 shape·dtype을 기록한다. | 매 호출의 형태나 Python 인자가 바뀌는지 확인한다 → 안정적인 input signature와 tensor 입력을 사용한다. 다른 배치에서도 retracing 횟수와 출력 일치를 확인한다. | [tf.function](https://www.tensorflow.org/guide/function) |
| F2-026 | scikit-learn | 교차 검증 점수는 높지만 배포 점수가 낮다. 전처리 fit 시점과 분할 순서를 기록한다. | 전체 데이터에 변환을 먼저 fit해 정보가 샜는지 확인한다 → Pipeline 안에서 각 fold별로 fit한다. 보류 데이터에서 점수를 다시 측정한다. | [Common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) |
| F2-027 | JAX | JIT 함수가 입력 값에 따라 예상과 다르게 동작하거나 재컴파일된다. static argument와 shape 변화를 기록한다. | Python 제어 흐름이 추적 시점 값에 고정됐는지 확인한다 → 배열 연산과 JAX 제어 흐름을 사용하고 정적 인자를 의도대로 선언한다. 다른 값·shape를 시험한다. | [JIT compilation](https://docs.jax.dev/en/latest/jit-compilation.html) |
| F2-028 | Spark | 일부 task만 오래 남고 executor가 메모리 부족이 된다. stage별 shuffle 읽기량과 partition 크기를 확인한다. | key skew나 과도한 단일 partition을 확인한다 → partition 전략과 skew 처리 방식을 조정한다. 같은 데이터에서 task 지연 분포와 출력 건수를 비교한다. | [SQL performance tuning](https://spark.apache.org/docs/latest/sql-performance-tuning.html) |
| F2-029 | Flink | 장애 복구 후 집계 값이 중복된다. checkpoint 성공 시점과 sink의 전달 보장을 기록한다. | source·state·sink의 보장 수준이 다르거나 비트랜잭션 sink에 재전송되는지 확인한다 → sink의 멱등성 또는 지원되는 트랜잭션 방식을 적용한다. 강제 재시작 후 결과를 비교한다. | [Checkpoints](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/state/checkpoints/) |
| F2-030 | Airflow | DAG 파일을 읽는 것만으로 외부 API가 반복 호출되고 scheduler가 느려진다. parse 시간과 최상위 코드 실행을 측정한다. | DAG 정의 시점에 무거운 작업을 수행하는지 확인한다 → 실행 코드를 task 내부로 옮긴다. scheduler parse 시간과 DAG 실행 결과를 함께 확인한다. | [Best practices](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html) |
| F2-031 | dbt | incremental 모델을 변경했지만 과거 행 값이 그대로 남는다. unique key, incremental 조건, target 테이블을 비교한다. | 증분 조건이 과거 행을 재처리하지 않는지 확인한다 → 대상 범위 재처리 또는 필요한 경우 full refresh를 계획한다. 전체/증분 실행의 행 수와 값이 일치하는지 시험한다. | [Incremental models](https://docs.getdbt.com/docs/build/incremental-models) |
| F2-032 | Kubernetes | 서비스의 일부 트래픽만 실패한다. EndpointSlice의 ready 주소와 Pod readiness 결과를 비교한다. | 준비되지 않은 Pod가 엔드포인트에 포함되거나 readiness 조건이 실제 의존성을 반영하지 않는지 확인한다 → probe와 서비스 selector를 수정한다. 배포 중 성공률과 엔드포인트 변화를 추적한다. | [Service debugging](https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/) |
| F2-033 | Terraform | 같은 코드를 적용해도 매번 변경 계획이 나온다. plan diff와 provider 반환값을 비교한다. | 외부 수정, 계산 속성, 순서가 불안정한 입력을 확인한다 → 원천 설정 또는 리소스 모델을 수정한다. 재실행한 plan이 의도한 변경만 보이는지 확인한다. | [Plan](https://developer.hashicorp.com/terraform/cli/commands/plan) |

## 사용 방식

1. 증상과 버전을 적고 해당 행의 증거를 먼저 수집한다.
2. 공식 문서에서 사용하는 버전의 계약을 확인한 뒤 작은 재현 환경에서 가설을 검증한다.
3. 조치 전후의 수치와 출력 정확성을 비교하고, 재발 감시 조건을 기록한다.

이 33건은 프레임워크 지도의 각 항목에 대한 출발 사례다. 가능한 장애 전부를 열거했다는 뜻은 아니다.
