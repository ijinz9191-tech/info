# 프레임워크·런타임 추가 VOC 22건

확인일: 2026-09-30. [기본 33건](voc-frameworks-extra.md)과 [후속 67건](voc-frameworks-more.md)에 이어, 별도의 재현·관측 지점을 가진 사례를 적는다. F4-021·022는 공개 프로젝트 이슈·릴리스 노트의 수정 이력을 바탕으로 한 진단 경로다. 나머지 행은 실제 고객 접수가 아닌 **가능한 장애 가설**이다.

| ID | 대상 | 증상·증거 → 가설·조치·검증 | 공식 확인 입구 |
|---|---|---|---|
| F4-001 | React | Strict Mode 개발 환경에서 Effect setup/cleanup이 한 번 더 실행되어 중복 연결처럼 보임; 개발/운영 차이 확인 → cleanup 누락을 수정; 연결 수와 운영 빌드 동작 시험 | [Strict Mode](https://react.dev/reference/react/StrictMode) |
| F4-002 | Angular | OnPush 컴포넌트에서 내부 객체 필드만 바꿔 화면이 늦게 바뀜; 입력 참조와 변경 감지 확인 → 새 참조/명시적 상태 신호로 갱신; 동일 입력 회귀 시험 | [Change detection](https://angular.dev/best-practices/skipping-subtrees) |
| F4-003 | Vue | `computed` 안에서 부작용을 일으켜 계산·요청이 반복됨; getter 호출 횟수 확인 → 순수 계산과 effect 분리; 값 변경당 요청 수 확인 | [Computed](https://vuejs.org/guide/essentials/computed.html) |
| F4-004 | Svelte | 반응형 파생 값이 일반 변수에 복사되어 최신 값이 아님; 선언 위치 확인 → `$derived` 등 반응형 경로로 표현; 의존 값 변경 시험 | [Derived state](https://svelte.dev/docs/svelte/$derived) |
| F4-005 | Next.js | 서버에서만 secret 접근이 실패; 환경 변수의 설정 시점과 빌드/런타임 경계 확인 → 서버 환경 설정에 필요한 값을 배치; 빌드·실행 단계 모두 시험 | [Environment variables](https://nextjs.org/docs/app/guides/environment-variables) |
| F4-006 | Nuxt | 서버 API가 잘못된 method에서도 처리됨; server route 파일 명명과 handler 확인 → method별 라우트 경계 수정; GET/POST/거부 경로 시험 | [Server routes](https://nuxt.com/docs/guide/directory-structure/server) |
| F4-007 | Node.js | child process 출력이 커지자 호출이 실패; stdout buffer 제한 확인 → streaming spawn으로 소비; 대용량 출력과 종료 코드 시험 | [Child process](https://nodejs.org/api/child_process.html) |
| F4-008 | Express | 정적 파일보다 앞선 catch-all 라우트가 파일 요청을 가로챔; 미들웨어 등록 순서 확인 → static/라우팅 순서 수정; 파일·API·없는 경로 시험 | [Using middleware](https://expressjs.com/en/guide/using-middleware.html) |
| F4-009 | NestJS | 예외 필터가 HTTP 오류는 처리하지만 RPC 오류에는 적용되지 않음; execution context 확인 → 전송 유형별 필터 지정; 두 transport 실패 경로 시험 | [Exception filters](https://docs.nestjs.com/exception-filters) |
| F4-010 | Hono | 중첩 라우트가 기대 경로와 달리 404; `basePath`/mount 순서 확인 → 경로 합성 수정; prefix 경계 요청 시험 | [Routing](https://hono.dev/docs/api/routing) |
| F4-011 | Django | 캐시를 켠 뒤 사용자별 페이지가 다른 사용자에게 보임; cache key와 Vary 확인 → 사용자별 응답 캐싱 경계 수정; 두 계정 교차 요청 시험 | [Caching](https://docs.djangoproject.com/en/stable/topics/cache/) |
| F4-012 | FastAPI | 파일 업로드에서 메모리와 지연이 급증; 요청 크기·UploadFile 사용 방식 확인 → streaming/spooled 경로 사용; 크기별 RSS·응답 시간 시험 | [Request files](https://fastapi.tiangolo.com/tutorial/request-files/) |
| F4-013 | Flask | proxy 뒤 URL 생성이 HTTP 또는 옛 host로 나옴; forwarded 헤더와 신뢰 홉 확인 → ProxyFix를 실제 프록시 수에 맞춤; 위조 헤더 차단 시험 | [ProxyFix](https://werkzeug.palletsprojects.com/en/stable/middleware/proxy_fix/) |
| F4-014 | Spring Boot | 배포에는 설정이 있는데 bean 바인딩은 기본값; 설정 파일 위치·profile 활성화 확인 → 로딩 위치와 profile 정합화; 조건별 시작 테스트 | [Config data](https://docs.spring.io/spring-boot/reference/features/external-config.html) |
| F4-015 | ASP.NET Core | 예외 처리기보다 앞선 미들웨어 예외가 HTML 대신 끊긴 응답을 만듦; pipeline 순서 확인 → 오류 처리 위치 조정; 앞/뒤 단계 실패 주입 시험 | [Error handling](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling) |
| F4-016 | Rails | 코드 변경 뒤 일부 worker만 이전 동작; worker 프로세스·reload 전략 확인 → 배포 중 worker 교체 순서 수정; 버전 헤더/작업 결과 일치 시험 | [Autoloading](https://guides.rubyonrails.org/autoloading_and_reloading_constants.html) |
| F4-017 | Laravel | DB transaction 안에서 큐에 넣은 작업이 commit 전 데이터를 못 찾음; dispatch 시각 확인 → afterCommit 경계 적용; rollback/commit 양쪽 시험 | [Jobs and transactions](https://laravel.com/docs/queues#jobs-and-database-transactions) |
| F4-018 | Flutter | 배포 뒤 플랫폼 채널 호출만 MissingPluginException; plugin 등록과 native 빌드 산출물 확인 → 플랫폼 빌드를 재생성/등록; 기기별 호출 시험 | [Platform channels](https://docs.flutter.dev/platform-integration/platform-channels) |
| F4-019 | Android Jetpack | 앱 프로세스 종료 후 화면 상태가 복구되지 않음; saved state 기록 확인 → 보존해야 할 값만 SavedStateHandle에 저장; 프로세스 재생성 시험 | [SavedStateHandle](https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-savedstate) |
| F4-020 | SwiftUI | 동일 뷰를 조건 분기로 바꾸면 로컬 state가 초기화; view identity와 분기 위치 확인 → 상태 소유 위치 조정; 분기 왕복 뒤 입력 보존 시험 | [State](https://developer.apple.com/documentation/swiftui/state) |
| F4-021 | React | React 19.3 이전 특정 Suspense/서버 액션 재현에서 `useDeferredValue`가 이전 값에 고착된 공개 이슈 #35821; 입력 값·deferred 값·재현 경로를 기록 → React 내부 lane 처리 버그의 [수정 PR #36134](https://github.com/react/react/pull/36134)과 19.3 릴리스를 대조하고 지원되는 19.3으로 업그레이드; 같은 재현에서 지연 값이 결국 최신 값으로 수렴하는지 확인 | [React 19.3 릴리스](https://react.dev/blog/2026/09/09/react-19-3)·[이슈 #35821](https://github.com/react/react/issues/35821) |
| F4-022 | Spring Boot | Kafka `KafkaConnectionDetails`에서 소비자별 security protocol을 지정했는데 연결 실패; 소비자·생산자의 effective Kafka 설정과 Boot 버전을 비교 → Boot가 소비자 전용 값 대신 공통 값을 적용한 [공개 버그 #51365](https://github.com/spring-projects/spring-boot/issues/51365) 여부를 확인하고 4.0.8 또는 4.1.1 이상의 해당 유지보수 계열 수정판으로 갱신; 인증이 필요한 브로커에서 소비자 연결과 생산자 설정의 회귀를 각각 검증 | [Spring Boot 4.1.1 릴리스](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.1)·[4.1.x 수정 이슈 #51369](https://github.com/spring-projects/spring-boot/issues/51369) |

프레임워크 33개 항목 모두에 사례가 있으며, 목록 밖의 새 도구와 최신 릴리스도 갱신 때 탐색한다.
