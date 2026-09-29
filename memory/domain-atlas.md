# 개발 분야 전체 지도

확인일: 2026-09-30. 언어를 안다는 것과 시스템을 제대로 만드는 것은 별개다. 아래는 분야별 **설계 질문 → 흔한 실패 → 검증 수단**을 오프라인에서 찾는 출발점이다. 제품별 명령과 지원 버전은 연결된 공식 문서에서 재검증한다.

| 분야 | 설계 때 결정할 것 | 흔한 실패와 검증 | 공식 입구 |
|---|---|---|---|
| 웹 UI | 상태 소유자, 접근성, 렌더 경계 | 중복 상태·구독 누수·키보드 사용 불가; 컴포넌트/브라우저 테스트 | [React](https://react.dev/learn), [Angular](https://angular.dev/overview), [Vue](https://vuejs.org/guide/introduction) |
| 서버 렌더링 | 서버/클라이언트 데이터 경계, 캐시·인증 | hydration 불일치·오래된 캐시; 실제 배포 모드 검증 | [Next.js](https://nextjs.org/docs), [Svelte](https://svelte.dev/docs) |
| API 서버 | 계약, 인증, 멱등성, 타임아웃 | 중복 쓰기·부분 실패; 계약·통합·부하 테스트 | [HTTP 명세](https://www.rfc-editor.org/rfc/rfc9110.html), [FastAPI](https://fastapi.tiangolo.com/tutorial/), [Spring Boot](https://docs.spring.io/spring-boot/reference/) |
| 모바일 | 앱 수명, 권한, 오프라인 동기화 | 백그라운드 중단·권한 거부·동기 충돌; 실제 기기 테스트 | [Android](https://developer.android.com/develop), [SwiftUI](https://developer.apple.com/documentation/swiftui/), [Flutter](https://docs.flutter.dev/) |
| 데스크톱 | 업데이트·파일 시스템·프로세스 분리 | 패키지/OS 차이·권한 상승; 플랫폼별 설치 테스트 | [Electron](https://www.electronjs.org/docs/latest/), [Qt](https://doc.qt.io/) |
| 게임·실시간 | 프레임 예산, 시뮬레이션 시간, 자산 로딩 | 프레임 드롭·비결정성; 프레임 프로파일링 | [Unity 문서](https://docs.unity3d.com/) |
| 임베디드·IoT | 메모리·전력·인터럽트·하드웨어 상태 | 버퍼 손상·우발 재시작; 하드웨어/에뮬레이터 테스트 | [C 표준 위원회](https://open-std.org/jtc1/sc22/wg14/), [Rust Embedded Book](https://docs.rust-embedded.org/book/) |
| GPU·병렬 계산 | 데이터 배치·전송량·동기화 | 작은 kernel의 전송 비용·경합; CPU 기준 결과와 비교 | [CUDA](https://docs.nvidia.com/cuda/) |
| 관계형 DB | 키·제약·격리·인덱스 | N+1, 잠금 경합, 누락된 제약; 실행 계획·실제 데이터 테스트 | [PostgreSQL](https://www.postgresql.org/docs/current/) |
| 데이터 파이프라인 | 스키마·재처리·순서·멱등성 | 중복·유실·지연 데이터; 재실행 가능한 샘플 검증 | [Spark](https://spark.apache.org/docs/latest/), [Flink](https://nightlies.apache.org/flink/flink-docs-stable/), [Airflow](https://airflow.apache.org/docs/) |
| ML·AI | 데이터 분할·평가·모델 버전 | 데이터 누출·분포 변화·재현 실패; 홀드아웃·모니터링 | [PyTorch](https://pytorch.org/docs/stable/), [TensorFlow](https://www.tensorflow.org/guide), [scikit-learn](https://scikit-learn.org/stable/user_guide.html) |
| 분산 시스템 | 일관성·재시도·중복·장애 경계 | 부분 실패·시계 차이; fault injection과 계약 테스트 | [Google SRE](https://sre.google/sre-book/), [Kafka](https://kafka.apache.org/design/) |
| 이벤트·메시징 | 이벤트 ID·스키마·순서·재전달 | 순서 의존·중복 처리; 같은 이벤트 반복 재생 | [CloudEvents](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md) |
| 네트워크 | 프로토콜·DNS·연결 수명·타임아웃 | 무한 대기·재시도 폭주; 패킷·트레이스 확인 | [HTTP 의미론](https://www.rfc-editor.org/rfc/rfc9110.html) |
| 보안 | 신뢰 경계·인증/인가·비밀 관리 | 입력 주입·권한 확대·키 노출; 위협 모델과 권한 테스트 | [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/), [NIST SSDF](https://csrc.nist.gov/Projects/ssdf) |
| 컴파일러·파서 | 문법·AST·타입·진단 위치 | 모호한 문법·잘못된 복구; golden/fuzz 테스트 | [LLVM 문서](https://llvm.org/docs/) |
| 빌드·패키지 | 의존성 그래프·재현성·서명 | 로컬/CI 환경 차이; 깨끗한 환경 빌드 | [CMake](https://cmake.org/documentation/), [Gradle](https://docs.gradle.org/current/userguide/userguide.html) |
| CI/CD | 단계별 실패 기준·아티팩트·되돌리기 | 성공한 빌드와 실패한 배포의 혼동; 점진 배포 | [GitHub Actions](https://docs.github.com/en/actions) |
| 컨테이너·오케스트레이션 | 이미지·자원 제한·상태·배포 전략 | readiness 오판·OOM·설정 누락; 롤아웃 관찰 | [Docker](https://docs.docker.com/), [Kubernetes](https://kubernetes.io/docs/) |
| IaC·클라우드 | 선언 상태·변경 계획·권한 | drift·파괴적 변경·비밀 유출; plan 검토 | [Terraform](https://developer.hashicorp.com/terraform/docs) |
| 관측성·운영 | 로그·메트릭·트레이스의 질문 | 높은 카디널리티·민감정보 로깅; 장애 재현과 연결 | [OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/) |
| 성능 | 지연 분포·처리량·자원 상한 | 평균값 착시·측정 오버헤드; 프로파일과 반복 측정 | [Go diagnostics](https://go.dev/doc/diagnostics) |
| 테스트·품질 | 단위/통합/계약/시스템 경계 | 구현만 반복하는 테스트·불안정한 fixture; 실제 위험 검증 | [pytest](https://docs.pytest.org/), [JUnit 5](https://junit.org/junit5/docs/current/user-guide/) |
| 알고리즘 | 입력 규모·복잡도·정확도·메모리 | 최악 사례·정수 오버플로; 경계 입력과 불변식 | [NIST DADS](https://xlinux.nist.gov/dads/) |
| 접근성·국제화 | 입력 장치·언어·시간대·문자 | 화면 낭독기 차단·날짜 오류; 실제 보조기술 점검 | [W3C WCAG](https://www.w3.org/TR/WCAG22/), [Unicode](https://www.unicode.org/standard/standard.html) |

## 분야가 섞일 때 생기는 문제

- **프론트엔드 + API:** 클라이언트 타입은 서버의 실제 응답을 검증하지 않는다. 계약·버전·캐시 무효화를 함께 설계한다.
- **메시징 + DB:** DB 커밋과 메시지 발행은 별도 작업이다. 중복·유실 방지를 위해 outbox 또는 동등한 복구 절차를 고려한다.
- **ML + 서비스:** 학습 데이터의 스키마, 온라인 입력의 스키마, 평가 지표를 같은 계약으로 추적한다.
- **컨테이너 + 운영:** 프로세스 실행만으로 서비스 준비를 뜻하지 않는다. readiness·의존성·데이터 마이그레이션을 분리한다.
- **보안 + 로깅:** 진단에 필요한 정보와 개인정보·비밀정보의 수집 제한을 같이 설계한다.

주제별 상세 절차는 [데이터와 분산 시스템](data-distributed.md), [보안과 개발 도구](security-tooling.md), [알고리즘](algorithms.md), [장애 대응](incidents.md)을 따른다.
