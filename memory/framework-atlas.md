# 프레임워크·런타임 확장 지도

확인일: 2026-09-30. 특정 프레임워크를 쓰기 전에는 그 도구가 책임지는 층을 구분한다. 언어 런타임, UI 렌더러, 서버 프레임워크, ORM, 작업 큐, 배포 플랫폼은 같은 선택지가 아니다. [웹/API 심화](frameworks.md)와 [분야 지도](domain-atlas.md)를 함께 읽는다.

| 층 | 프레임워크·런타임 | 먼저 확인할 계약 | 공식 문서 |
|---|---|---|---|
| 브라우저 UI | React | 렌더/커밋, 상태 소유권, effect 정리 | [React](https://react.dev/learn) |
| 브라우저 UI | Angular | DI, change detection, 라우팅, RxJS 구독 수명 | [Angular](https://angular.dev/overview) |
| 브라우저 UI | Vue | 반응성, 컴포넌트 수명, 단방향 데이터 흐름 | [Vue](https://vuejs.org/guide/introduction) |
| 브라우저 UI | Svelte | 컴파일 결과, 반응성, 서버/클라이언트 경계 | [Svelte](https://svelte.dev/docs) |
| 웹 앱 | Next.js | 라우팅, 서버/클라이언트 컴포넌트, 캐시 | [Next.js](https://nextjs.org/docs) |
| 웹 앱 | Nuxt | 파일 기반 라우팅, 서버 렌더, 데이터 취득 | [Nuxt](https://nuxt.com/docs) |
| JS 런타임 | Node.js | 이벤트 루프, 스트림·버퍼, 프로세스 오류 | [Node API](https://nodejs.org/docs/latest/api/) |
| JS 서버 | Express | 미들웨어 순서, 오류 전달, 요청 수명 | [Express](https://expressjs.com/) |
| JS 서버 | NestJS | 모듈·DI·파이프·가드·예외 필터의 실행 순서 | [NestJS](https://docs.nestjs.com/) |
| JS 서버 | Hono | 런타임별 호환성, 미들웨어·context 수명 | [Hono](https://hono.dev/docs/) |
| Python 서버 | Django | ORM·마이그레이션·middleware·보안 기본값 | [Django](https://docs.djangoproject.com/) |
| Python 서버 | FastAPI | 타입 기반 검증·의존성·비동기 경계 | [FastAPI](https://fastapi.tiangolo.com/tutorial/) |
| Python 서버 | Flask | 요청/앱 context, 확장, 오류 핸들러 | [Flask](https://flask.palletsprojects.com/) |
| JVM 서버 | Spring Boot | 자동 설정·DI·트랜잭션·Actuator | [Spring Boot](https://docs.spring.io/spring-boot/reference/) |
| .NET 서버 | ASP.NET Core | middleware 순서·DI 수명·모델 바인딩 | [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/overview) |
| Ruby 서버 | Rails | convention·Active Record·요청/작업 큐 경계 | [Rails Guides](https://guides.rubyonrails.org/) |
| PHP 서버 | Laravel | 서비스 컨테이너·Eloquent·큐·마이그레이션 | [Laravel](https://laravel.com/docs) |
| 모바일 | Flutter | widget/state 수명, Dart isolate, 플랫폼 채널 | [Flutter](https://docs.flutter.dev/) |
| 모바일 | Android Jetpack | activity/fragment 수명, 상태 복원, 권한 | [Android](https://developer.android.com/develop) |
| Apple UI | SwiftUI | 상태와 view identity, 플랫폼 버전·수명 | [SwiftUI](https://developer.apple.com/documentation/swiftui/) |
| 데스크톱 | Electron | main/renderer 격리, IPC, 업데이트 | [Electron](https://www.electronjs.org/docs/latest/) |
| 데스크톱 | Qt | event loop, signal/slot, 객체 소유권 | [Qt](https://doc.qt.io/) |
| 게임 | Unity | component 수명, frame/update 순서, 자산 로딩 | [Unity](https://docs.unity3d.com/) |
| ML | PyTorch | tensor shape/device, autograd, 저장·로드 | [PyTorch](https://pytorch.org/docs/stable/) |
| ML | TensorFlow | eager/graph, tensor shape, 배포 서명 | [TensorFlow](https://www.tensorflow.org/guide) |
| ML | scikit-learn | train/test 변환 파이프라인, 데이터 누출 | [scikit-learn](https://scikit-learn.org/stable/user_guide.html) |
| ML | JAX | pure function, 배열 shape, JIT·장치 경계 | [JAX](https://docs.jax.dev/en/latest/) |
| 데이터 | Spark | 지연 실행, partition, shuffle, skew | [Spark](https://spark.apache.org/docs/latest/) |
| 데이터 | Flink | event time, state, checkpoint, 재시작 | [Flink](https://nightlies.apache.org/flink/flink-docs-stable/) |
| 작업 흐름 | Airflow | DAG 정의 시점, 스케줄, task 재시도 | [Airflow](https://airflow.apache.org/docs/) |
| 데이터 변환 | dbt | 모델 의존성, incremental·테스트·환경 | [dbt](https://docs.getdbt.com/docs/introduction) |
| 인프라 | Kubernetes | 원하는 상태, controller, probe, resource | [Kubernetes](https://kubernetes.io/docs/) |
| 인프라 | Terraform | plan/state/provider, drift, 변경 범위 | [Terraform](https://developer.hashicorp.com/terraform/docs) |

## 선택·업그레이드 점검

1. 해결할 문제가 렌더, HTTP 처리, 데이터 접근, 작업 실행, 배포 중 어느 층인지 적는다.
2. 현재 버전의 지원 정책과 런타임·플랫폼 호환성을 공식 문서에서 확인한다.
3. 최소 기능 경로와 실패 경로를 작은 예제로 만든다. 시작 시간, 메모리, 배포 복잡도는 실제 환경에서 잰다.
4. 의존성 그래프와 보안 공지, 라이선스, 유지관리 상태를 확인한다.
5. 업그레이드에는 마이그레이션 문서와 실제 사용자 경로의 회귀 테스트를 붙인다.

이 표는 빠른 색인이다. 프레임워크 전체 API와 최신 지원 버전을 오프라인에서 보장하는 것으로 해석하지 않는다.
