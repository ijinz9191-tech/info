---
kind: curated-guide
origin: "spring-boot-deep-dive.md"
source_access: see_document_links
---
# Spring Boot 및 Spring 생태계: 설계·진단·VOC

확인일: 2026-09-30. 먼저 Spring Boot·Spring Framework·JDK·웹 스택(Servlet 또는 Reactive)·데이터베이스 드라이버의 버전을 각각 확인한다. Boot의 자동 설정, Framework의 트랜잭션, 클라우드 플랫폼의 readiness는 서로 다른 층이다.

## 실행 흐름과 실패 경계

1. **시작:** starter 의존성, classpath, 설정 값, 조건 평가에 따라 Bean이 만들어진다. 시작 실패나 예상과 다른 Bean을 조사할 때 조건 평가 보고서와 실제 환경 속성을 확인한다.
2. **설정:** 파일, 환경 변수, 시스템 속성, 명령 인수 등에는 우선순위가 있다. 같은 키의 출처와 활성 profile을 기록한다. `@ConfigurationProperties`의 바인딩 결과를 테스트에서 확인한다.
3. **HTTP 요청:** 필터/보안 → 컨트롤러 → 서비스 → 데이터 접근 → 응답의 각 경계에서 인증, 유효성, 트랜잭션, 예외 변환을 분리한다.
4. **트랜잭션:** 선언형 트랜잭션은 주로 프록시를 통해 적용된다. 자기 메서드 호출과 예외 종류, 전파 속성, 비동기 실행 경계를 검증한다. 기본 롤백 규칙을 무조건 모든 예외에 확장하지 않는다.
5. **운영:** Actuator의 health·readiness·liveness를 구분한다. 살아 있는 프로세스와 요청을 받을 준비가 된 서비스를 다른 신호로 본다.
6. **테스트:** 얇은 계층 테스트와 실제 부팅·DB 통합 테스트를 목적에 따라 구분한다. 프로덕션과 다른 profile/DB 때문에 사라지는 오류를 경계한다.

근거: [자동 설정 진단](https://docs.spring.io/spring-boot/how-to/application.html), [외부 설정](https://docs.spring.io/spring-boot/reference/features/external-config.html), [트랜잭션 구현](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-decl-explained.html), [롤백 규칙](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html), [애플리케이션 가용성](https://docs.spring.io/spring-boot/reference/features/spring-application.html).

## 주변 모듈을 구별하는 표

| 계층 | 예 | 확인할 계약 |
|---|---|---|
| Web | Spring MVC, WebFlux | 블로킹/논블로킹 호출, 요청 수명, 예외 응답 |
| Security | Spring Security | 필터 체인, 인증과 인가, CSRF·세션·토큰 정책 |
| Data | JDBC, Spring Data JPA | 영속성 context, 쿼리 수, flush, DB 트랜잭션 |
| Messaging | Spring for Apache Kafka | 소비 재시도·ack·트랜잭션 범위·중복 |
| Operations | Actuator, Micrometer | health와 readiness, 메트릭 이름·카디널리티 |
| Test | `@SpringBootTest`, slice tests | 실제 설정·DB와 테스트 대체물의 차이 |

### Security·Data·Kafka의 추가 경계

- **401/403:** 컨트롤러에 도착했는지부터 보지 말고 Servlet filter chain의 인증·인가 결과를 먼저 확인한다. 인증 정보가 없거나 거부된 경로와, 인증은 됐지만 권한이 부족한 경로를 나눈다. [Spring Security 구조](https://docs.spring.io/spring-security/reference/servlet/architecture.html).
- **N+1 쿼리:** 한 목록 요청에서 SQL 수가 항목 수에 따라 늘어나는지 측정한다. 필요한 연관 관계를 query/fetch graph로 가져오되 페이지네이션과 결과 크기를 검증한다. [Spring Data JPA 쿼리](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html).
- **Kafka 재처리:** listener 예외, 재시도, offset 확정, dead-letter 경계를 따로 기록한다. 재전달이 가능하므로 업무 쓰기에는 중복 처리 검증이 필요하다. [Spring Kafka 예외 처리](https://docs.spring.io/spring-kafka/reference/kafka/annotation-error-handling.html).
- **Actuator 노출:** health 등 관리 엔드포인트의 경로·노출·접근 제어를 배포 설정에서 확인한다. 내부 진단 정보의 무제한 외부 노출을 피한다. [Actuator HTTP 관리](https://docs.spring.io/spring-boot/reference/actuator/monitoring.html).
- **테스트 범위:** slice 테스트는 대상 계층을 빠르게 검증하고, `@SpringBootTest`는 Boot가 만든 context의 상호작용을 확인한다. 실제 DB·브로커·보안 필터를 대체했는지 결과에 명시한다. [Boot 테스트](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html).

## VOC 유형별 해결 카드

| 증상 | 확인할 증거 | 검증할 원인 | 조치와 완료 기준 |
|---|---|---|---|
| 기대한 Bean이 없다 | 조건 평가 보고서, classpath, profile | 조건 불일치 또는 다른 Bean으로 자동 설정 비활성 | 실제 설정 출처와 조건을 고치고 시작·통합 테스트. [진단 문서](https://docs.spring.io/spring-boot/how-to/application.html) |
| 환경별 설정이 예상과 다르다 | 활성 profile, 속성 출처·우선순위 | 파일/환경 변수/명령 인수 덮어쓰기 | 값의 출처를 명시하고 각 profile의 바인딩 결과 테스트. [외부 설정](https://docs.spring.io/spring-boot/reference/features/external-config.html) |
| `@Transactional`인데 DB가 커밋된다 | 프록시 경유 여부, 예외 타입, 스레드 | 자기 호출, 기본 롤백 규칙 오해, 비동기 경계 | 서비스 경계를 바꾸거나 트랜잭션 정책을 명시하고 실제 DB 통합 테스트. [트랜잭션](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-decl-explained.html), [롤백](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html) |
| DB 연결 대기가 늘어난다 | 풀 대기·활성 연결·느린 쿼리·DB 제한 | 풀 고갈, 긴 트랜잭션, 쿼리 지연 | 쿼리와 트랜잭션을 먼저 측정. 풀 크기는 DB 상한과 워커 수를 계산해 조정. [SQL 데이터](https://docs.spring.io/spring-boot/reference/data/sql.html) |
| 시작은 했지만 트래픽을 받지 못한다 | readiness/liveness, dependency 상태 | 준비 전 라우팅 또는 잘못된 probe | readiness와 liveness 목적을 나누고 배포 전후 라우팅 테스트. [가용성](https://docs.spring.io/spring-boot/reference/features/spring-application.html) |
| 인증된 사용자가 403을 받는다 | security filter chain, principal/authority, URL 규칙 | 역할 매핑 또는 filter chain 불일치 | 요청별 인가 결정을 테스트하고 필요한 권한만 허용. [Spring Security](https://docs.spring.io/spring-security/reference/servlet/architecture.html) |
| 목록 API에서 DB 질의가 폭증한다 | 요청당 SQL 개수, 엔티티 접근 순서 | 지연 로딩에 따른 N+1 | 필요한 fetch 계획을 명시하고 실제 목록 크기에서 쿼리 수와 메모리 사용량 검증. [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html) |
| Kafka 메시지가 계속 재처리된다 | listener 예외, 재시도 횟수, offset, DLT | 영구 오류와 일시 오류 혼합 | 오류 분류·재시도 상한·별도 보관을 설계하고 중복 메시지 테스트. [Spring Kafka](https://docs.spring.io/spring-kafka/reference/kafka/annotation-error-handling.html) |

### 검증된 공개 이슈: 설정 import 경로의 해석

[Spring Boot 이슈 #45349](https://github.com/spring-projects/spring-boot/issues/45349)는 `spring.config.import`의 상대 경로와 `file:` 접두어를 혼동한 사용자 보고다. 유지관리자가 의도된 동작과 문서 개선 필요를 설명했다. 해결 때는 사용하는 Boot 버전의 [외부 설정 문서](https://docs.spring.io/spring-boot/reference/features/external-config.html)를 기준으로 import 경로가 **가져오는 파일에 상대적인지, 고정 경로인지** 테스트한다. 이슈에 나온 특정 버전의 설명을 다른 버전에 그대로 적용하지 않는다.

### 검증된 공개 이슈: 중첩 record 속성 바인딩

[Spring Boot 이슈 #34407](https://github.com/spring-projects/spring-boot/issues/34407)는 2.7.8에서 3.0.2로 올릴 때 초기화된 중첩 record의 바인딩이 달라졌다는 재현과 당시 우회 방법을 담고 있다. 현재 버전의 일반 해결책으로 우회 코드를 복사하지 말고, 버전별 재현 테스트와 [설정 바인딩 문서](https://docs.spring.io/spring-boot/reference/features/external-config.html)를 먼저 대조한다.

## 접수 기록 형식

`증상 / Boot·Framework·JDK·드라이버 버전 / 활성 profile / 의존성 목록 / 조건 평가·로그 / 재현 요청 / DB 상태 / 원인 / 조치 / 통합·부하·회귀 테스트 / 해결 확인 날짜`.
