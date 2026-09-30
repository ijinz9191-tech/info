---
kind: curated-guide
origin: "security-tooling.md"
source_access: see_document_links
---
# 보안·빌드·테스트·운영 도구

확인일: 2026-09-30. 보안과 재현성은 개별 도구 설치만으로 달성되지 않는다. 입력, 권한, 의존성, 배포, 관측의 경계를 연결해서 검증한다.

## 보안 설계 점검

| 경계 | 확인할 것 | 검증 예 |
|---|---|---|
| 외부 입력 | 길이·형식·인코딩·범위·스키마; 파서 오류 처리 | 잘못된 형식과 극단 크기 입력 |
| 인증 | 세션·토큰의 발급, 만료, 폐기, 전달 채널 | 만료·탈취·로그아웃 뒤 요청 |
| 인가 | 사용자·자원·작업별 서버 검사 | 다른 계정의 객체 ID로 접근 |
| 출력 | 문맥별 escaping·매개변수 바인딩 | HTML/SQL/명령 삽입 입력 |
| 비밀 | 저장·전달·회전·폐기와 로그 노출 | 테스트 로그·빌드 아티팩트 점검 |
| 의존성 | 잠금·출처·취약점·공급망 | 새 버전의 변경 내용과 서명 확인 |
| 가용성 | 요청 한도·타임아웃·자원 상한 | 과도한 입력·동시 요청 부하 |

SQL은 문자열 연결 대신 매개변수 바인딩을 쓰고, OS 명령은 문자열 셸 호출보다 인자 배열과 허용 목록을 우선한다. 브라우저 HTML, URL, JS, CSS는 서로 다른 출력 문맥이다. 암호 설계와 저장은 검증된 라이브러리·표준을 사용한다. [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/), [NIST SSDF](https://csrc.nist.gov/Projects/ssdf).

## 빌드와 배포 재현성

1. 언어 런타임·컴파일러·패키지 관리자의 버전을 고정한다.
2. 잠금 파일과 빌드 플래그를 기록하고 깨끗한 환경에서 재빌드한다.
3. 생성물에 소스 리비전·버전·빌드 환경을 식별 가능하게 남긴다.
4. 테스트를 통과한 **같은 아티팩트**를 배포 단계로 전달한다.
5. 변경 계획, DB 마이그레이션, 설정, 기능 플래그, 되돌리기 절차를 연결한다.

빌드 도구별 진입점: [CMake](https://cmake.org/documentation/), [Gradle](https://docs.gradle.org/current/userguide/userguide.html), [GitHub Actions](https://docs.github.com/en/actions), [Docker](https://docs.docker.com/), [Terraform](https://developer.hashicorp.com/terraform/docs).

## 테스트 피라미드보다 중요한 계약

- **단위 테스트:** 순수 계산·경계값·오류 분기를 빠르게 확인한다.
- **통합 테스트:** 실제 DB·파일·네트워크 어댑터와의 계약을 확인한다.
- **계약 테스트:** 생산자와 소비자의 스키마·상태 코드·호환성을 확인한다.
- **시스템 테스트:** 사용자 경로, 배포 설정, 권한·실패 복구를 확인한다.
- **속성/퍼즈 테스트:** 입력 공간이 넓은 파서·수치·상태 전이에 적합하다.
- **성능 테스트:** 대표 데이터와 부하를 고정하고 p95/p99 지연, 처리량, CPU/메모리 상한을 함께 본다.

테스트는 구현 행을 되풀이하는 대신 실패했을 때의 실제 위험을 드러내야 한다. 불안정한 시간·네트워크·공유 상태는 테스트 환경에서 제어한다. [pytest](https://docs.pytest.org/), [JUnit 5](https://junit.org/junit5/docs/current/user-guide/).

## 관측과 사고 대응 연결

로그는 사건의 맥락, 메트릭은 규모와 추세, 트레이스는 요청 경로를 설명한다. 사용자 식별자·토큰·원문 입력을 무심코 남기지 않는다. 경보는 원시 CPU 수치보다 사용자 영향과 복구 행동에 연결한다. 사고 타임라인에 배포 ID·설정 변경·완화 조치를 기록한다. [OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/), [Google SRE 사고 대응](https://sre.google/sre-book/managing-incidents/).
