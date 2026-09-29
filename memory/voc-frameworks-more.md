# 프레임워크·런타임 추가 VOC 67건

확인일: 2026-09-30. [첫 33건](voc-frameworks-extra.md)과 다른 증상·실패 경로를 다룬다. 모두 **가능한 진단 시나리오**이며 실제 VOC 접수나 확정된 제품 결함을 뜻하지 않는다. 공식 문서에서 사용 중인 버전의 계약을 확인하고 증거를 수집한 뒤 조치를 실험한다.

| ID | 대상 | 증상·증거 → 원인 가설·조치·검증 | 공식 확인 입구 |
|---|---|---|---|
| F3-001 | React | 목록 재정렬 후 입력값이 다른 행으로 이동; key와 항목 ID 비교 → 인덱스 key 사용 여부 확인, 안정적 ID 적용; 삽입·재정렬 회귀 시험 | [Rendering lists](https://react.dev/learn/rendering-lists) |
| F3-002 | React | 오류 경계가 클릭 핸들러 예외를 보여주지 않음; 예외 발생 위치 확인 → 경계가 처리하는 렌더 오류와 이벤트 오류를 구분하고 이벤트 실패를 직접 처리; 실패 UI 시험 | [Error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) |
| F3-003 | Angular | SSR 화면을 열 때 hydration mismatch; 서버·클라이언트 DOM 비교 → 직접 DOM 조작/조건부 마크업 차이 제거; 새로고침과 탐색 모두 검증 | [NG0500](https://angular.dev/errors/NG0500) |
| F3-004 | Angular | 특정 lazy route만 provider를 찾지 못함; route injector 구성 확인 → provider 선언 범위 조정; 직접 URL 접근과 내부 탐색 모두 시험 | [DI](https://angular.dev/guide/di) |
| F3-005 | Vue | watcher가 자기 값을 다시 바꿔 반복 실행; dependency와 변경 시각 추적 → 감시 대상과 갱신 대상 분리; 한 입력에 실행 횟수 제한 확인 | [Watchers](https://vuejs.org/guide/essentials/watchers.html) |
| F3-006 | Vue | SSR 첫 화면에서 텍스트가 클라이언트 값으로 바뀜; 서버 HTML과 hydration 입력 비교 → 비결정적 초기값을 동일한 데이터로 전달; 새로고침 시 경고·출력 확인 | [SSR](https://vuejs.org/guide/scaling-up/ssr.html) |
| F3-007 | Svelte | 부모 값은 바뀌는데 자식 복사 상태는 오래됨; props와 로컬 state 비교 → 초기값 복사 후 동기화 누락 확인, 파생 상태로 표현; 변경 시 반영 검사 | [Svelte state](https://svelte.dev/docs/svelte/$state) |
| F3-008 | Svelte | 목록 삭제 후 다른 행의 컴포넌트 상태가 남음; each key 확인 → 안정적 데이터 식별자를 key로 사용; 삽입·삭제 상태 보존 시험 | [Keyed each](https://svelte.dev/docs/svelte/each) |
| F3-009 | Next.js | 서버 컴포넌트에서 브라우저 API 사용 오류; 파일 경계와 import graph 확인 → 상호작용 코드를 client component로 이동; 서버 렌더·탐색 검사 | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) |
| F3-010 | Next.js | 인증 redirect가 반복됨; middleware matcher와 목적지 경로 확인 → 로그인 경로를 검사 대상에서 제외하고 종료 조건 설정; 비로그인·로그인 요청 시험 | [Middleware](https://nextjs.org/docs/app/api-reference/file-conventions/middleware) |
| F3-011 | Nuxt | 서버에서만 runtime config 값이 보이지 않거나 공개 값이 노출됨; public/private 키 위치 확인 → 설정 구획 수정; 서버·브라우저 양쪽 값 점검 | [Runtime config](https://nuxt.com/docs/guide/going-further/runtime-config) |
| F3-012 | Nuxt | 첫 화면 hydration 경고가 나지만 내부 탐색은 정상; 서버 응답·클라이언트 시간/랜덤 값 비교 → 초기 상태를 같은 payload로 전달; 새로고침 회귀 시험 | [Nuxt rendering](https://nuxt.com/docs/guide/concepts/rendering) |
| F3-013 | Node.js | CPU 연산 중 모든 요청 지연이 급증; event-loop delay 측정 → 단일 스레드 차단 작업을 worker/작업 큐로 분리; 지연 분포 재측정 | [Don't block event loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop) |
| F3-014 | Node.js | 작업 실패 후 프로세스가 종료 또는 오류가 묻힘; promise 거부 처리 경로 확인 → 최상위 실패 로깅과 종료/재시도 정책 명시; 실패 주입으로 관측 확인 | [Process errors](https://nodejs.org/api/process.html) |
| F3-015 | Express | 프록시 뒤에서 보안 쿠키·IP 기록이 다름; `trust proxy`와 forwarded 헤더 확인 → 신뢰 프록시 범위를 실제 홉에 맞춤; 위조 헤더 거부 시험 | [Behind proxies](https://expressjs.com/en/guide/behind-proxies.html) |
| F3-016 | Express | 큰 JSON 요청만 413/파싱 실패; body parser 제한·Content-Type 확인 → 합리적 크기 제한과 오류 응답 설정; 경계 크기 요청 시험 | [Express JSON](https://expressjs.com/en/api.html#express.json) |
| F3-017 | NestJS | 인증 가드가 실행되기 전 요청이 거부됨; global/controller/route guard 순서 확인 → 필요한 guard와 공개 라우트 범위 조정; 허용·거부 경로 시험 | [Guards](https://docs.nestjs.com/guards) |
| F3-018 | NestJS | DTO 숫자 필드가 문자열로 남음; ValidationPipe transform 설정 확인 → 변환·검증 옵션 지정; 잘못된/정상 입력 계약 시험 | [Validation](https://docs.nestjs.com/techniques/validation) |
| F3-019 | Hono | 미들웨어 뒤 handler가 실행되지 않음; `next()` 호출과 return 흐름 추적 → 의도한 경로에서 다음 단계 호출; 호출 순서 테스트 | [Middleware](https://hono.dev/docs/guides/middleware) |
| F3-020 | Hono | 배포 플랫폼에서 streaming 응답만 실패; 런타임의 streaming 지원·헤더 확인 → 플랫폼 지원 방식에 맞는 응답 API 사용; chunk 순서·종료 시험 | [Streaming](https://hono.dev/docs/helpers/streaming) |
| F3-021 | Django | 같은 테이블에 대한 migration 순서가 환경마다 충돌; migration graph 확인 → 분기 병합 migration 생성; 빈 DB와 기존 DB 업그레이드 시험 | [Migrations](https://docs.djangoproject.com/en/stable/topics/migrations/) |
| F3-022 | Django | POST만 403; CSRF 쿠키·헤더·trusted origin 확인 → origin과 토큰 전달 정합화; 정상 요청과 위조 요청 구분 시험 | [CSRF](https://docs.djangoproject.com/en/stable/howto/csrf/) |
| F3-023 | FastAPI | 실제 응답은 만들어졌으나 response model 검증 오류; 반환 값·응답 schema 비교 → 직렬화 가능 타입과 schema 정합화; 정상·누락 필드 테스트 | [Response model](https://fastapi.tiangolo.com/tutorial/response-model/) |
| F3-024 | FastAPI | 한 요청에서 dependency 결과가 여러 번 생성될 줄 알았으나 공유됨; 호출 수 기록 → dependency 캐시 정책을 의도에 맞춤; 요청 간 격리 시험 | [Dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/) |
| F3-025 | Flask | 첫 요청 뒤 route 등록 오류; blueprint 등록 시각 확인 → 앱 설정과 route 등록을 첫 요청 전 완료; 새 프로세스 부팅 시험 | [Application setup](https://flask.palletsprojects.com/en/stable/lifecycle/) |
| F3-026 | Flask | 배포 뒤 기존 session이 모두 풀림; SECRET_KEY 변경 기록 확인 → 계획된 키 회전 전략 사용; 이전·새 쿠키 처리 시험 | [Sessions](https://flask.palletsprojects.com/en/stable/quickstart/#sessions) |
| F3-027 | Spring Boot | 운영 환경에서만 설정값이 다름; active profile·property source 순서 확인 → 설정 우선순위 정리; 실행 환경별 최종 값 검사 | [Externalized config](https://docs.spring.io/spring-boot/reference/features/external-config.html) |
| F3-028 | Spring Boot | Actuator endpoint가 예상과 다르게 보이거나 숨겨짐; exposure·security 설정 확인 → 필요한 endpoint만 노출; 인증·비인증 호출 테스트 | [Actuator endpoints](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html) |
| F3-029 | ASP.NET Core | CORS preflight만 실패; middleware 순서·origin 정책 확인 → CORS 등록/적용 위치 수정; OPTIONS와 실제 요청 시험 | [CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors) |
| F3-030 | ASP.NET Core | 소수점 입력이 지역에 따라 다르게 해석됨; model binding culture 확인 → API 입력 문화권 계약 명시; 여러 locale에서 동일 입력 시험 | [Model binding](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/model-binding) |
| F3-031 | Rails | 백그라운드 작업 재시도 뒤 이메일이 두 번 발송됨; job ID·retry 로그 확인 → 외부 부작용에 멱등 키 적용; 실패 주입 후 발송 횟수 확인 | [Active Job](https://guides.rubyonrails.org/active_job_basics.html) |
| F3-032 | Rails | 특정 목록만 쿼리가 급증; association access·쿼리 로그 확인 → preload/includes 범위 조정; 행 수 증가 시 쿼리 수 비교 | [Active Record querying](https://guides.rubyonrails.org/active_record_querying.html) |
| F3-033 | Laravel | 요청 필드를 통째로 저장했더니 의도하지 않은 속성이 바뀜; fillable/guarded 확인 → 허용 필드를 명시; 초과 필드 요청이 무시·거부되는지 시험 | [Mass assignment](https://laravel.com/docs/eloquent#mass-assignment) |
| F3-034 | Laravel | 설정을 바꿔도 worker가 이전 값을 사용; config cache·worker 수명 확인 → 설정 캐시 재생성과 worker 재시작; 새 값 반영 검사 | [Configuration](https://laravel.com/docs/configuration) |
| F3-035 | Flutter | 작은 화면에서 RenderFlex overflow; layout constraint와 긴 문자열 확인 → 스크롤/유연 레이아웃 적용; 작은 화면·큰 글꼴 시험 | [Constraints](https://docs.flutter.dev/ui/layout/constraints) |
| F3-036 | Flutter | 목록 재정렬 후 다른 항목 상태가 남음; widget key와 항목 ID 확인 → 안정적 key 사용; 추가·삭제·재정렬 회귀 시험 | [Keys](https://api.flutter.dev/flutter/foundation/Key-class.html) |
| F3-037 | Android Jetpack | 권한 요청을 했지만 기능은 계속 실패; 권한 결과와 기능 호출 순서 확인 → 승인/거부별 분기 처리; 설정에서 권한 철회한 뒤 재시험 | [Permissions](https://developer.android.com/training/permissions/requesting) |
| F3-038 | Android Jetpack | 백그라운드 작업이 즉시 실행되지 않음; WorkManager constraint·scheduler 상태 확인 → 필수 제약과 실행 시점 기대 조정; 네트워크/충전 조건 변경 시험 | [WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager) |
| F3-039 | SwiftUI | 백그라운드 완료 후 UI 상태 갱신 경고; actor 격리 확인 → UI 소유 상태를 MainActor에서 변경; 동시 완료 시험 | [MainActor](https://developer.apple.com/documentation/swift/mainactor) |
| F3-040 | SwiftUI | 앱 재시작 후 navigation stack이 빈 화면; path 직렬화·복원 순서 확인 → 안정적 경로 데이터 저장; deep link와 재시작 시험 | [NavigationStack](https://developer.apple.com/documentation/swiftui/navigationstack) |
| F3-041 | Electron | preload API는 있는데 renderer에서 undefined; preload 경로·sandbox·context bridge 확인 → 로드/노출 순서 수정; 개발·패키지 빌드 시험 | [Preload](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload) |
| F3-042 | Electron | 업데이트 파일을 찾았지만 설치되지 않음; feed URL·서명·패키지 형식 확인 → 플랫폼별 배포 계약 조정; 이전 버전에서 업데이트 시험 | [Updates](https://www.electronjs.org/docs/latest/tutorial/updates) |
| F3-043 | Qt | 객체 삭제 뒤 signal callback이 옛 포인터를 참조; receiver 수명·connection 확인 → QObject 수명에 연결된 receiver와 안전한 포인터 사용; 삭제 후 이벤트 시험 | [Signals and slots](https://doc.qt.io/qt-6/signalsandslots.html) |
| F3-044 | Qt | `deleteLater` 호출 뒤 자원이 바로 해제되지 않음; event loop 실행 상태 확인 → 소유권·이벤트 루프 종료 순서 수정; 종료 시 누수 검사 | [QObject](https://doc.qt.io/qt-6/qobject.html) |
| F3-045 | Unity | 씬 전환 뒤 Destroy된 객체를 callback이 참조; 수명과 등록된 event 확인 → `OnDisable`/`OnDestroy` 정리; 반복 씬 전환 시험 | [Execution order](https://docs.unity3d.com/Manual/ExecutionOrder.html) |
| F3-046 | Unity | 로딩 직후 asset 참조가 null; 비동기 로딩 완료 시점 확인 → 완료 뒤 사용하도록 상태 전이 구성; 느린 저장장치에서 재현 시험 | [Addressables](https://docs.unity3d.com/Packages/com.unity.addressables@latest) |
| F3-047 | PyTorch | CPU/GPU 혼합 연산으로 예외; tensor·model device 기록 → 입력과 모델을 같은 장치로 이동; 작은 배치 추론·학습 시험 | [CUDA semantics](https://pytorch.org/docs/stable/notes/cuda.html) |
| F3-048 | PyTorch | 배포 추론 값이 학습 중 검증 값과 다름; train/eval 모드 확인 → 추론에 `eval()` 적용; 고정 입력 출력 비교 | [Module](https://pytorch.org/docs/stable/generated/torch.nn.Module.html) |
| F3-049 | TensorFlow | 배치 크기를 바꾸면 shape 오류; 모델 입력 차원과 실제 tensor 확인 → 동적/고정 축 계약 수정; 여러 배치 크기 시험 | [Tensor shapes](https://www.tensorflow.org/guide/tensor) |
| F3-050 | TensorFlow | SavedModel 로드 후 서명 입력 키가 다름; export signature 확인 → 저장·호출 인터페이스 일치; 별도 프로세스 로드 시험 | [SavedModel](https://www.tensorflow.org/guide/saved_model) |
| F3-051 | scikit-learn | 운영 데이터의 범주가 훈련 때 없던 값이라 변환 실패; encoder 설정 확인 → 미지 범주 처리 정책 지정; 새로운 범주 입력 시험 | [OneHotEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html) |
| F3-052 | scikit-learn | 교차 검증 점수가 비현실적으로 높음; 그룹·시간 정보가 train/test에 공유되는지 확인 → 데이터 생성 단위에 맞는 분할 사용; 홀드아웃 점수 비교 | [Cross validation](https://scikit-learn.org/stable/modules/cross_validation.html) |
| F3-053 | JAX | 같은 함수 호출마다 같은 난수 결과; PRNG key 재사용 확인 → key를 분할·전달; 재현성과 독립 샘플을 각각 시험 | [Random numbers](https://docs.jax.dev/en/latest/random-numbers.html) |
| F3-054 | JAX | GPU 연산인데 지연 측정이 지나치게 낮음; 비동기 dispatch 여부 확인 → block_until_ready 후 측정; 장치 동기화된 시간을 비교 | [Async dispatch](https://docs.jax.dev/en/latest/async_dispatch.html) |
| F3-055 | Spark | 소형 파일이 급증해 쿼리 계획·읽기가 느려짐; 파일 수/크기 확인 → 출력 partition·압축 전략 조정; 파일 수와 읽기 지연 비교 | [Performance tuning](https://spark.apache.org/docs/latest/sql-performance-tuning.html) |
| F3-056 | Spark | 새 필드가 들어온 뒤 파싱 실패; 저장 포맷 schema와 입력 비교 → schema 진화 정책 명시; 이전·새 파일을 함께 읽는 테스트 | [Data sources](https://spark.apache.org/docs/latest/sql-data-sources.html) |
| F3-057 | Flink | 이벤트가 들어와도 window가 닫히지 않음; watermark와 늦은 입력 확인 → event-time timestamp/watermark 전략 수정; 지연 이벤트 주입 시험 | [Event time](https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/) |
| F3-058 | Flink | 업그레이드 후 savepoint 복원이 실패; operator UID·state serializer 확인 → 호환 가능한 상태 마이그레이션 계획; 복제 환경에서 복원 시험 | [State schema evolution](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/fault-tolerance/serialization/schema_evolution/) |
| F3-059 | Airflow | 과거 날짜 DAG run이 예상보다 많이 생성; start_date·catchup 설정 확인 → 일정 의도에 맞게 catchup 조정; 날짜별 run 목록 확인 | [DAG runs](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dag-run.html) |
| F3-060 | Airflow | 재시도 후 외부 작업이 두 번 생성; task attempt와 외부 ID 확인 → task에 멱등 키 적용; 강제 재시도 뒤 중복 부작용 검사 | [Best practices](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html) |
| F3-061 | dbt | source freshness 경고가 계속 발생; loaded_at 값과 warehouse 시간대 확인 → 시간대·수집 주기 기준 수정; 새 적재 후 경고 해소 확인 | [Source freshness](https://docs.getdbt.com/docs/deploy/source-freshness) |
| F3-062 | dbt | 모델은 성공하지만 관계 테스트가 실패; test query와 참조 키 확인 → 데이터 계약 또는 모델 조인 수정; 실패 행이 0인지 재검증 | [Data tests](https://docs.getdbt.com/docs/build/data-tests) |
| F3-063 | Kubernetes | Pod가 CrashLoopBackOff; 이전 컨테이너 로그·종료 코드·설정 확인 → 실제 종료 원인 수정; 재시작 횟수 안정과 요청 성공 확인 | [Debug Pod](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/) |
| F3-064 | Kubernetes | HPA가 CPU 사용률을 못 읽음; metrics API·resource requests 확인 → 메트릭 제공과 request 설정 수정; 부하 증가에 replica 변화 확인 | [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) |
| F3-065 | Terraform | 원격 state lock이 해제되지 않음; lock ID·현재 실행 프로세스 확인 → 실행 중 변경이 없는지 확인하고 잠금 복구 절차 수행; plan 재실행 확인 | [State locking](https://developer.hashicorp.com/terraform/language/state/locking) |
| F3-066 | Terraform | 수동 생성 리소스를 코드에 추가하자 중복 생성 계획; state와 실제 ID 확인 → 올바른 import block/명령으로 연결; plan에서 신규 생성이 사라지는지 확인 | [Import](https://developer.hashicorp.com/terraform/language/import) |
| F3-067 | Spring Boot | `@ConfigurationProperties` 값이 비거나 바인딩 예외; prefix·등록·타입 변환 오류 확인 → 속성 등록과 입력 형식 정합화; 시작 테스트로 최종 값 확인 | [Type-safe configuration properties](https://docs.spring.io/spring-boot/reference/features/external-config.html#features.external-config.typesafe-configuration-properties) |

이 문서와 첫 33건은 프레임워크 100건을 구성한다. 같은 증상이라도 버전·환경에 따라 원인과 조치가 달라질 수 있다.
