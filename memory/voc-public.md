# 공개 VOC·장애 해결 사례집

확인일: 2026-09-30. **공개 이슈**는 실제 제보의 증상과 당시 환경만 증명한다. **문서 기반 유형**은 공식 문제 해결 문서에서 반복되는 증상을 정리한 자체 사례이며, 특정 고객 접수 건이라고 주장하지 않는다. 조치는 원인 가설이 맞을 때의 절차다. 해결 완료는 같은 버전·환경에서 재현과 회귀 테스트를 확인한 뒤에만 기록한다.

## 실제 공개 이슈

### PUB-REACT-001: 잘못된 HTML 중첩과 hydration 오류

- **제보:** [facebook/react#24519](https://github.com/facebook/react/issues/24519). SSR 환경에서 잘못된 DOM 중첩과 서버/클라이언트 초기 트리 불일치가 보고되었다. 이 이슈가 모든 hydration 오류의 원인은 아니다.
- **수집할 증거:** React와 SSR 프레임워크 버전, 서버가 보낸 HTML, 브라우저가 파싱한 DOM, 첫 클라이언트 렌더, 콘솔 경고.
- **판별:** 브라우저가 중첩 오류를 자동 수정한 부분을 찾는다. 시간·무작위 값·locale 차이도 별도 원인 후보로 비교한다.
- **해결과 검증:** 유효한 HTML로 수정하고 동일 입력에서 서버 HTML과 첫 클라이언트 렌더가 일치하는지 확인한다. [React hydrateRoot 지침](https://react.dev/reference/react-dom/client/hydrateRoot).
- **사례 상태:** 공개 이슈의 보고를 확인함. 이 위키에서 특정 앱의 해결 완료는 검증하지 않음.

### PUB-SPRING-001: `spring.config.import` 상대 경로 해석

- **제보:** [spring-projects/spring-boot#45349](https://github.com/spring-projects/spring-boot/issues/45349). `file:` 접두어가 있는 경로와 없는 경로의 해석에 관한 혼동이 보고되었고 유지관리자가 의도된 동작과 문서화 필요를 설명했다.
- **수집할 증거:** Boot 버전, 실행 작업 디렉터리, 가져오는 설정 파일의 위치, 실제 적용된 속성 값.
- **판별:** import 위치가 원래 파일에 상대적인지, 고정 URL/파일 위치인지 같은 테스트 환경에서 확인한다.
- **해결과 검증:** 사용할 버전의 [설정 문서](https://docs.spring.io/spring-boot/reference/features/external-config.html)에 맞춰 위치를 명시하고 다른 작업 디렉터리에서도 설정 로드 테스트를 실행한다.
- **사례 상태:** 공개 이슈와 유지관리자 설명 확인. 개별 애플리케이션의 해결 여부는 별도.

### PUB-SPRING-002: Boot 업그레이드 후 중첩 record 바인딩 변화

- **제보:** [spring-projects/spring-boot#34407](https://github.com/spring-projects/spring-boot/issues/34407). 2.7.8에서 3.0.2로 이동하며 초기화된 중첩 record의 바인딩이 달라졌다는 재현과 당시 우회 방법이 있다.
- **수집할 증거:** 두 버전의 바인딩 결과, `@ConfigurationProperties` 클래스, 중첩 record의 초기화 방식, 테스트 profile.
- **판별:** 초기화된 객체 재사용과 생성자 바인딩 중 어느 경로가 적용되는지 작은 재현 테스트로 비교한다.
- **해결과 검증:** 현재 사용 버전의 [설정 바인딩 규칙](https://docs.spring.io/spring-boot/reference/features/external-config.html)에 맞춰 모델을 수정한다. 이슈의 당시 우회 코드를 최신 버전의 일반 해법으로 복사하지 않는다.
- **사례 상태:** 과거 버전의 공개 이슈 확인. 현재 버전의 재현 여부는 미검증.

## 공식 문서 기반 반복 증상

### TYPE-REACT-001: 개발 모드에서 Effect 연결이 두 번 생김

- **증상:** 소켓·타이머·리스너가 중복 등록된다.
- **진단:** Strict Mode 설정과 setup → cleanup → setup 순서를 기록한다. [React `useEffect`](https://react.dev/reference/react/useEffect).
- **조치:** setup에서 등록한 자원을 cleanup에서 정확히 해제한다. 개발 모드와 프로덕션 모드 모두에서 한 활성 연결만 남는지 테스트한다.

### TYPE-REACT-002: 빠르게 바꾼 검색어의 결과가 역순으로 보임

- **증상:** 새 검색 후 오래된 요청의 응답이 화면을 덮는다.
- **진단:** 요청 ID·시작/완료 순서와 선택한 검색어를 비교한다. [React `useEffect`](https://react.dev/reference/react/useEffect).
- **조치:** 이전 요청을 취소하거나 결과를 무시한다. 응답을 의도적으로 역순 완료시키는 테스트로 최신 요청만 표시되는지 확인한다.

### TYPE-REACT-003: 화면 이동 후 폼 입력이 사라짐

- **증상:** 입력 컴포넌트가 다시 생성된다.
- **진단:** 렌더 트리 위치·컴포넌트 타입·`key`의 변화를 본다. [상태 보존 문서](https://react.dev/learn/preserving-and-resetting-state).
- **조치:** 유지할 상태는 같은 identity에 두고, 초기화가 필요한 경우에만 key를 바꾼다. 이동 전후 입력값 테스트를 붙인다.

### TYPE-SPRING-001: Bean을 찾지 못하거나 예상한 구현이 주입되지 않음

- **증상:** 시작 실패 또는 다른 구현 사용.
- **진단:** 조건 평가 보고서, classpath, 활성 profile, 사용자 정의 Bean을 확인한다. [Boot 자동 설정 진단](https://docs.spring.io/spring-boot/how-to/application.html).
- **조치:** 누락된 의존성과 조건을 명시적으로 정리하고 실제 앱 context로 통합 테스트한다.

### TYPE-SPRING-002: 예외가 났는데 트랜잭션이 롤백되지 않음

- **증상:** 실패 응답 뒤 일부 DB 변경이 남는다.
- **진단:** 호출이 트랜잭션 프록시를 지났는지, 예외 종류와 전파·비동기 경계를 확인한다. [트랜잭션 원리](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-decl-explained.html), [롤백 규칙](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html).
- **조치:** 경계와 정책을 명시하고 실제 DB에서 실패 주입 후 상태가 원복되는지 검증한다.

### TYPE-CNCF-001: Pod가 반복 재시작됨

- **증상:** `CrashLoopBackOff`, restart 수 증가.
- **진단:** `kubectl describe pod`의 종료 사유와 `kubectl logs POD -c CONTAINER --previous`를 비교한다. OOM·설정·애플리케이션 예외·probe를 나눈다. [Kubernetes Pod 수명](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/), [실행 중 Pod 진단](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/).
- **조치:** 확인된 원인을 수정하고 재시작 수가 안정화되는지, readiness와 실제 사용자 요청이 함께 회복되는지 검증한다.

### TYPE-CNCF-002: Pod가 스케줄되지 않음

- **증상:** `Pending`이 지속된다.
- **진단:** 이벤트의 `FailedScheduling` 이유, 자원 요청, 노드 선택 조건, 볼륨을 확인한다. [Kubernetes Pod 진단](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/).
- **조치:** 근거에 맞춰 요청량·노드 조건·용량을 수정한다. 스케줄 성공과 실제 서비스 준비를 별도로 확인한다.

### TYPE-CNCF-003: Collector에서 관측 데이터가 사라짐

- **증상:** 앱에서 telemetry를 전송하지만 백엔드에 안 보인다.
- **진단:** receiver → processor → exporter의 각 단계와 Collector 자체 지표를 본다. pipeline에 receiver가 활성화됐는지, drop·queue·네트워크 오류가 있는지 분리한다. [OTel Collector 진단](https://opentelemetry.io/docs/collector/troubleshooting/).
- **조치:** 소량의 테스트 데이터를 debug exporter로 경로 확인 후 누락 구간을 수정한다. 백엔드 수신량과 Collector drop 지표로 재검증한다.

### TYPE-CNCF-004: Prometheus target이 DOWN

- **증상:** 대상 수집 실패와 메트릭 공백.
- **진단:** target 오류, 실제 `__address__`·`__metrics_path__`·scheme, relabel 결과, TLS/권한을 확인한다. [Prometheus 설정](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).
- **조치:** 발견·경로·네트워크·인증의 확인된 오류를 고치고 target UP 및 새 샘플 도착을 검증한다. 오래된 시계열이 남아 있어도 새 수집 성공과는 구별한다.

### TYPE-SPRING-003: 인증 후 API가 403을 반환

- **증상:** 로그인은 성공했으나 특정 API가 거부된다.
- **진단:** 해당 경로의 filter chain, principal과 authority, 인가 규칙을 순서대로 본다. [Spring Security 구조](https://docs.spring.io/spring-security/reference/servlet/architecture.html).
- **조치:** 필요한 권한 매핑을 수정하고 허용·거부 사용자 모두의 보안 통합 테스트를 실행한다. 일괄 허용으로 증상을 숨기지 않는다.

### TYPE-SPRING-004: 목록 API의 쿼리가 항목 수에 비례해 증가

- **증상:** 목록이 커지며 DB 부하와 응답 시간이 급증한다.
- **진단:** SQL 로그/메트릭으로 기본 쿼리와 연관 데이터 조회 수를 분리한다. [Spring Data JPA 쿼리 방법](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html).
- **조치:** 필요한 fetch 계획이나 투영을 명시하고 실제 페이지 크기에서 SQL 수·결과 행 수·메모리를 비교한다.

## 실제 VOC를 추가할 때

사용자 제공 원문을 넣기 전 대상 자료의 권한·민감도·저장 범위를 확인한다. 각 건은 `ID / 접수 원문 위치 / 비식별화된 증상 / 제품·버전 / 재현 / 영향 / 근거 / 확정 원인 / 조치 / 결과 / 회귀 테스트 / 마지막 검증일`을 기록한다. 원인을 모르는 건은 **미확인**, 임시 완화만 한 건은 **완화**, 재현·회귀 테스트가 통과한 건만 **해결 검증**으로 표시한다.
