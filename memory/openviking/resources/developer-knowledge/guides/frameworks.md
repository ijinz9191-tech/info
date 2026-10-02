---
kind: curated-guide
origin: "frameworks.md"
source_access: see_document_links
---
# 프레임워크와 라이브러리 선택

확인일: 2026-09-30. 프레임워크 이름보다 **요청 수명, 상태 저장, 오류 경계, 배포 방식, 지원 버전**을 먼저 확인한다. 아래는 공식 문서에서 확인한 대표 선택지의 개발 관점 요약이다.

## 웹·API

| 생태계 | 주요 선택지 | 설계 출발점 | 공식 문서 |
|---|---|---|---|
| Python | Django | ORM·인증·관리 화면을 포함한 통합 웹 구조 | [Django](https://docs.djangoproject.com/) |
| Python | FastAPI | 타입 주석 기반 요청/응답 검증과 비동기 API | [FastAPI](https://fastapi.tiangolo.com/tutorial/) |
| Python | Flask | 작은 WSGI 앱에서 구성 요소를 직접 선택 | [Flask](https://flask.palletsprojects.com/) |
| Java/Kotlin | Spring Boot | 의존성 주입, 설정, HTTP, 데이터 접근의 계층화 | [Spring Boot](https://docs.spring.io/spring-boot/reference/) |
| C# | ASP.NET Core | 미들웨어 파이프라인, DI, API/MVC, 호스팅 | [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/overview) |
| JavaScript/TypeScript | Express | 미들웨어 순서와 라우팅을 직접 조합 | [Express](https://expressjs.com/en/guide/routing.html) |
| Go | 표준 `net/http` | `Handler`, 요청 컨텍스트, 서버 타임아웃 | [net/http](https://pkg.go.dev/net/http) |
| Ruby | Rails | 관례 기반 MVC, Active Record, 마이그레이션 | [Rails Guides](https://guides.rubyonrails.org/) |
| PHP | Laravel | 라우팅, 서비스 컨테이너, ORM, 큐 | [Laravel](https://laravel.com/docs) |

### 서버 구현 체크리스트

1. **입력 경계:** 경로·쿼리·본문·헤더를 각각 검증한다. 타입 선언과 ORM 모델은 인증·권한 검사를 대신하지 않는다.
2. **오류 경계:** 예상 가능한 4xx와 내부 5xx를 구분한다. 내부 예외·비밀값을 응답에 노출하지 않는다. 요청 ID를 로그·트레이스와 연결한다.
3. **취소·시간 제한:** 클라이언트 연결 종료, 상위 호출 타임아웃, DB 쿼리 타임아웃을 한 흐름으로 전파한다. 재시도에는 전체 시간 예산을 둔다.
4. **트랜잭션:** 한 요청의 DB 변경과 이벤트 발행 사이의 원자성 요구를 정의한다. 둘이 다른 시스템이면 [이벤트 문서](events.md)의 outbox 패턴을 검토한다.
5. **배포:** 헬스 검사, 준비 상태, 종료 신호, 연결 정리, 스키마 호환성을 테스트한다.

### 자주 생기는 오해

- 비동기 라우트가 CPU 연산을 자동 병렬화하지 않는다. 블로킹 라이브러리를 비동기 경로에서 호출하면 동시 처리량이 떨어질 수 있다.
- DI 컨테이너의 singleton에 요청별 가변 상태를 넣으면 요청 간 데이터가 섞일 수 있다.
- HTTP 성공은 DB 커밋·이벤트 전달·비동기 후속 작업의 완료와 다르다. API의 완료 의미를 계약에 명시한다.
- 프레임워크의 자동 직렬화가 입력 신뢰를 보장하지 않는다. 허용 필드, 크기, 인코딩, 권한을 별도로 검사한다.

## 프런트엔드

| 선택지 | 핵심 모델 | 먼저 읽을 공식 문서 |
|---|---|---|
| React | 함수 컴포넌트, 상태, 렌더링, 이벤트 | [React Learn](https://react.dev/learn) |
| Angular | 컴포넌트, DI, 라우팅, 반응형 상태 | [Angular 개요](https://angular.dev/overview) |
| Vue | 선언적 렌더링, 반응성, SFC | [Vue 가이드](https://vuejs.org/guide/introduction) |

- 화면 상태를 서버의 권위 있는 상태와 구별한다. 낙관적 UI는 실패 시 되돌리기와 중복 요청 처리를 설계한다.
- 이벤트 핸들러 안에서 오래 걸리는 작업을 실행하면 입력 반응이 느려진다. 작업 상태·취소·중복 클릭을 다룬다.
- 구독, 타이머, DOM 리스너는 컴포넌트 수명 종료 때 정리한다. 렌더링과 부작용의 경계를 명확히 한다.
- XSS 방지는 출력 인코딩/안전한 DOM API를 기본으로 하고, HTML 삽입은 별도 신뢰 경계로 취급한다.

## 데이터·메시징·관측 라이브러리

| 선택지 | 사용할 때 확인할 계약 | 공식 문서 |
|---|---|---|
| PostgreSQL 클라이언트/ORM | 트랜잭션 격리, 연결 풀, 마이그레이션 | [PostgreSQL](https://www.postgresql.org/docs/current/) |
| Apache Kafka | 파티션 순서, offset, 재처리, 전달 보장 | [Kafka Design](https://kafka.apache.org/design/) |
| OpenTelemetry | trace context, span, metric cardinality, log correlation | [OTel 개념](https://opentelemetry.io/docs/concepts/) |
| Kubernetes SDK/매니페스트 | 선언 상태, readiness, rollout, 리소스 제한 | [Kubernetes 문서](https://kubernetes.io/docs/) |

### 프레임워크를 새로 도입할 때 기록할 것

`문제 → 기대 이점 → 대안 → 언어/런타임 버전 → 지원 정책 → 의존성·라이선스 → 장애 모드 → 테스트 방법 → 철회 방법`을 한 페이지로 남긴다. 기능 목록만 비교하면 실제 운영 비용을 놓치기 쉽다.

프레임워크 문서는 빠르게 바뀐다. 이 페이지의 URL은 최신 페이지로 연결할 수 있으나, 이 위키의 내용은 확인일 기준이다. [갱신 절차](maintenance.md)로 차이를 재검증한다.
