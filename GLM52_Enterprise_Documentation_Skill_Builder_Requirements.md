# GLM-5.2 기반 전사 문서 자동화 스킬 시스템 구축 지시서

> 이 문서는 GLM-5.2 또는 동등한 코딩 에이전트에게 그대로 전달하여, 현재 워크스페이스의 모든 기존 스킬을 조사·재사용·통합·확장하고 부족한 스킬만 추가하도록 하는 최상위 구현 지시서다.
>
> 최종 목표는 사용자가 **“이 시스템의 모든 문서 만들어줘”**라고 요청하면 전체 문서 패키지를 생성하고, **“API 정의서만 Excel로 만들어줘”**라고 요청하면 해당 문서만 정확한 형식으로 생성하는 엔터프라이즈급 문서 자동화 시스템을 만드는 것이다.

---

# 1. 최상위 명령

너는 단순 문서 작성자가 아니다. 너는 다음 역할을 동시에 수행하는 **엔터프라이즈 문서화 스킬 아키텍트**다.

- 기존 스킬 전수조사자
- 요구사항 분석가
- 소스 코드·인프라·데이터 추적 분석가
- 업무 프로세스 분석가
- 시스템 아키텍트
- 기술 문서 작성자
- PPTX·XLSX·DOCX·Markdown 산출물 생성기
- 문서 간 일관성 검증자
- 증거·출처·추적성 감사자
- 품질 게이트 운영자

현재 워크스페이스에 존재하는 모든 `AGENTS.md`, `SKILL.md`, 설정, 정책, 템플릿, 스크립트, 쿼리, 테스트, 메모리, 위키 및 스킬 레지스트리를 먼저 조사하라.

기존 스킬을 무시하고 새로 만드는 방식을 금지한다.

반드시 다음 우선순위를 따른다.

1. 기존 스킬 그대로 재사용
2. 기존 스킬에 기능 추가
3. 중복 스킬 통합
4. 공용 기능 중앙화
5. 위 방법으로 충족되지 않을 때만 신규 스킬 생성

모든 기존 스킬은 반드시 인벤토리에 포함해야 한다. 관련 있는 스킬은 실제 문서화 파이프라인에 연결하고, 관련 없는 스킬은 `미사용`으로 숨기지 말고 `현재 문서화 범위와 직접 관련 없음`이라는 사유를 기록한다.

---

# 2. 시스템 최종 목표

다음 자연어 요청을 처리해야 한다.

```text
이 시스템의 모든 문서 만들어줘.
```

```text
API 정의서만 만들어줘.
```

```text
테이블 정의서를 Excel로 만들어줘.
```

```text
시스템 아키텍처 정의서를 PPT로 만들어줘.
```

```text
운영 매뉴얼을 DOCX로 만들어줘.
```

```text
VOC 자동응답 기능에 대한 요구사항 정의서, 시퀀스 다이어그램, 테스트 케이스만 만들어줘.
```

```text
지난 릴리스 이후 변경된 내용만 반영해서 기존 문서를 업데이트해줘.
```

요청한 문서가 하나라면 사용자에게는 그 문서 하나만 제공한다. 내부적으로 근거 수집, 위키 갱신, 품질 검증, 임시 분석을 수행할 수 있지만 사용자가 요구하지 않은 별도 문서를 최종 산출물로 노출하지 않는다.

“모든 문서” 요청일 때는 정의된 전체 문서 카탈로그를 기준으로 시스템 범위에 해당하는 문서를 빠짐없이 생성한다. 적용할 수 없는 문서는 임의 내용을 채우지 말고 `해당 없음` 판정과 근거를 산출물 매니페스트에 기록한다.

---

# 3. 절대 준수 원칙

## 3.1 증거 없는 내용 생성 금지

다음 자료에서 확인되지 않은 사실을 확정적으로 작성하지 않는다.

- 사용자 요구사항
- 승인된 사내 Wiki 및 정책
- 실제 소스 코드
- 빌드·배포 설정
- DB 스키마
- API 명세 및 호출 코드
- OpenSearch·Elasticsearch
- Oracle
- MongoDB
- Redis
- Kafka
- Kubernetes
- Ingress
- ConfigMap
- Secret의 키 구조 및 참조 관계
- Jenkins
- Bitbucket
- ArgoCD
- Harbor
- Nexus
- Prometheus
- Grafana
- Loki
- 사내 블로그 및 운영 자료
- 테스트 코드 및 실행 결과
- 승인된 외부 시스템 명세

확인할 수 없는 항목은 다음 중 하나로 표시한다.

- `확인 필요`
- `소스에서 식별되지 않음`
- `운영 조회 권한 필요`
- `요구사항 미정`
- `해당 없음`

추정한 값을 실제 값처럼 쓰지 않는다.

## 3.2 과거 VoC 답변 복사 금지

OpenSearch 등에 저장된 과거 VoC 응답은 참고 증거일 뿐 현재 문서의 권위 있는 사실 원천이 아니다.

- 과거 답변 문장을 그대로 복사하지 않는다.
- 과거 담당자 이름을 현재 담당자로 단정하지 않는다.
- 반복 응답 패턴을 정책으로 오인하지 않는다.
- 코드·정책·현재 운영 상태와 교차 검증한다.
- 충돌하면 충돌 사실과 확인 필요 항목을 남긴다.

## 3.3 읽기 전용 우선

문서 생성을 위한 모든 시스템 조회는 기본적으로 읽기 전용이어야 한다.

- 운영 DB 변경 금지
- 인덱스 변경 금지
- Kubernetes 리소스 변경 금지
- Git 저장소 변경 금지
- 배포 실행 금지
- Secret 원문 출력 금지
- 토큰·비밀번호·인증서·개인정보 문서 포함 금지

필요한 경우 Secret은 `키 이름`, `참조 대상`, `마스킹된 값`, `설정 목적`만 기록한다.

## 3.4 사용자 입력 및 고정 식별자 불변성

분석 중 소스 코드에서 발견한 값으로 최초 입력값을 덮어쓰는 행위를 금지한다.

특히 다음 값은 최초 요청에서 고정되면 작업 종료까지 변경할 수 없다.

- channel ID
- tenant ID
- project ID
- system ID
- repository
- branch 또는 commit
- cluster
- namespace
- environment
- database/schema
- index
- topic
- output path
- 요청 문서 목록
- 요청 파일 형식
- 분석 범위와 제외 범위

모든 요청은 시작 시 `immutable_request`로 직렬화하고 SHA-256 해시를 생성한다.

각 주요 단계 전후에 다음 검사를 수행한다.

```text
현재 immutable_request hash == 최초 immutable_request hash
```

값이 달라지면 즉시 작업을 중단하고 `INPUT_MUTATION_DETECTED` 오류를 발생시킨다.

소스에서 발견한 다른 값은 `discovered_context`에만 저장한다. `immutable_request`를 수정하지 않는다.

## 3.5 요구사항 재확인

다음 단계마다 최초 요구사항과 현재 수행 내용을 대조한다.

1. 요구사항 분석 완료 후
2. Wiki 및 기존 문서 조사 후
3. 소스·DB·인프라 추적 완료 후
4. 문서 목차 확정 후
5. 파일 렌더링 전
6. 최종 품질 검증 전

대조 항목은 다음과 같다.

- 요청 목적
- 대상 시스템
- 범위
- 제외 범위
- 요청 문서
- 파일 형식
- 언어
- 대상 독자
- 고정 입력값
- 완료 조건

---

# 4. 기존 스킬 전수조사 및 통합 규칙

## 4.1 조사 대상

다음 위치를 재귀적으로 탐색하되 실제 워크스페이스 구조에 맞춰 자동 발견한다.

```text
./AGENTS.md
./skills/**/SKILL.md
./.agents/skills/**/SKILL.md
./agents/**
./plugins/**
./templates/**
./policies/**
./scripts/**
./queries/**
./tests/**
./wiki/**
./docs/**
./memory/**
```

## 4.2 스킬 인벤토리 필드

모든 스킬에 대해 다음 정보를 작성한다.

| 필드 | 설명 |
|---|---|
| skill_id | 고유 ID |
| skill_name | 스킬 이름 |
| version | 버전 |
| purpose | 목적 |
| triggers | 호출 조건 |
| inputs | 입력 계약 |
| outputs | 출력 계약 |
| tools | 사용하는 도구 및 시스템 |
| source_systems | 조회하는 데이터 원천 |
| dependencies | 선행·후행 스킬 |
| side_effects | 변경 작업 여부 |
| read_only | 읽기 전용 여부 |
| overlap | 중복 스킬 |
| quality_gaps | 부족한 기능 |
| documentation_usage | 문서화 파이프라인에서 사용할 위치 |
| action | REUSE / EXTEND / MERGE / NEW / RETIRE / NOT_APPLICABLE |
| action_reason | 결정 근거 |

## 4.3 반드시 재사용할 기존 공통 스킬

실제 존재 여부를 확인한 뒤 이름이 같거나 동일 역할인 스킬을 연결한다.

### 요구사항 계층

- `directive-intake`
- `ceo-intent-analysis`
- `scope-constraint-analysis`
- `requirement-analysis`
- `acceptance-criteria-builder`
- `ambiguity-detection`

### Wiki·근거 계층

- `llm-wiki-search`
- `llm-wiki-grounding`
- `workspace-wiki`
- `init`
- `scan`
- `update`
- `query`
- `trace`
- `impact`
- `lint`
- `status`

### 작업 분해 계층

- `work-breakdown-structure`
- `task-decomposition`
- `milestone-planning`
- `dependency-critical-path`
- `deliverable-definition`

동일 역할의 기존 스킬이 다른 이름으로 존재하면 새로 만들지 말고 매핑 테이블을 만든다.

## 4.4 기존 계약 보존

기존 스킬을 수정할 때 다음을 지킨다.

- 기존 공개 입력 필드 삭제 금지
- 기존 출력 필드 의미 변경 금지
- 기존 호출 명령 호환성 유지
- 신규 필드는 선택값으로 추가
- 파괴적 변경이 필요하면 새 버전을 만들고 migration 문서 작성
- 수동 작성 영역 보존
- 기존 감사 로그·승인 정책 우선 적용

---

# 5. 권장 스킬 아키텍처

기존 스킬을 조사한 뒤 아래 역할이 충족되는지 확인한다. 이미 존재하면 확장하고, 없을 때만 추가한다.

## 5.1 계층 A — 요청·통제

### `documentation-orchestrator`

전체 문서 생성 흐름을 조정하는 유일한 진입점이다.

책임:

- 자연어 요청 파싱
- ALL / SINGLE / SELECT / UPDATE / VALIDATE 모드 결정
- 기존 스킬 라우팅
- 작업 상태 관리
- 산출물 목록 관리
- 실패·재시도·중단 처리
- 사용자에게 노출할 최종 파일 제한

### `request-contract-lock`

책임:

- 최초 요청 정규화
- 불변 입력 스냅샷
- 해시 생성
- 단계별 변조 감지
- 고정 식별자와 발견 식별자 분리

### `skill-inventory-router`

책임:

- 전체 스킬 인벤토리 생성
- 중복 탐지
- 재사용·확장·통합·신규 결정
- 문서별 필요한 스킬 DAG 구성
- 관련 스킬 누락 검사

## 5.2 계층 B — 지식·증거 수집

### `workspace-knowledge-grounder`

책임:

- 요구사항 → Wiki → 실제 구현 순서로 조사
- 승인된 정책과 소스 연결
- 기존 `workspace-wiki` 기능 재사용
- 증분 갱신
- 수동 작성 영역 보존

### `source-evidence-collector`

책임:

- 코드·설정·DB·런타임·모니터링 근거 수집
- 각 주장에 근거 ID 부여
- 출처·경로·라인·쿼리·시각·해시 기록
- 민감정보 마스킹
- 충돌 증거 분리

### `system-scope-discovery`

책임:

- 저장소·모듈·서비스·환경·클러스터 범위 확인
- 분석 포함·제외 대상 확정
- 발견 범위를 최초 요청 범위와 비교

## 5.3 계층 C — 기술 추적·분석

### `end-to-end-system-tracer`

아래 연결을 고유 ID와 증거로 추적한다.

```text
화면
→ React Route/Page/Component
→ 버튼·이벤트·상태
→ API Client
→ HTTP API
→ Spring Boot Controller 또는 Vert.x Router
→ Service / UseCase
→ Repository / DAO
→ Oracle / MongoDB / Redis / OpenSearch / Elasticsearch
→ Kafka Producer / Consumer / Topic
→ 외부 API
→ Kubernetes Deployment / Service / Ingress
→ ConfigMap / Secret 참조
→ Jenkins / Bitbucket / ArgoCD / Harbor / Nexus
→ Prometheus / Grafana / Loki / Elasticsearch 로그
→ Alert / Runbook / 운영 대응
```

### `business-logic-analyzer`

책임:

- 업무 규칙 추출
- 조건·분기·예외·상태 전이 추출
- AS-IS / TO-BE 프로세스
- 사용자 역할별 흐름
- 핵심 비즈니스 용어 정의

### `architecture-analyzer`

책임:

- 시스템 Context
- Container
- Component
- Deployment
- Network
- Runtime interaction
- HA / 장애 격리
- 외부 연계
- 기술 의존성
- 변경 영향도

### `data-model-analyzer`

책임:

- DB·컬렉션·인덱스·캐시·메시지 모델
- PK/FK/UK/Index
- CRUD Matrix
- 데이터 흐름과 lineage
- 보존·마스킹·암호화 속성

### `api-interface-analyzer`

책임:

- REST/HTTP API
- 내부 서비스 호출
- Kafka 메시지
- Batch 파일 인터페이스
- 외부 연계
- 인증·권한
- 오류·재시도·타임아웃

### `operations-observability-analyzer`

책임:

- Kubernetes 배포 구조
- CI/CD
- 설정 주입
- 로그·메트릭·트레이스
- Alert
- SLI/SLO
- 장애 대응
- 백업·복구·Rollback

### `security-governance-analyzer`

책임:

- 인증·인가
- Role / Permission
- 데이터 민감도
- Secret 사용
- 감사 로그
- 개인정보 노출 위험
- 보안 통제 및 예외

## 5.4 계층 D — 표준 모델

### `canonical-system-model-builder`

모든 분석 결과를 문서별로 따로 저장하지 말고 하나의 표준 시스템 모델로 통합한다.

권장 엔터티 ID:

```text
REQ-      요구사항
ACTOR-    사용자·시스템 역할
PROC-     업무 프로세스
SYS-      시스템
MOD-      모듈
SCR-      화면
EVT-      UI 이벤트
API-      API
SVC-      서비스·UseCase
CLS-      클래스
DB-       데이터베이스
TBL-      테이블
COL-      컬럼
IDX-      인덱스
CACHE-    Redis 구조
TOPIC-    Kafka Topic
MSG-      메시지 스키마
JOB-      Batch·Scheduler
EXT-      외부 시스템
K8S-      Kubernetes 리소스
CFG-      설정
METRIC-   메트릭
ALERT-    알림
TEST-     테스트
RISK-     위험
DEC-      의사결정
DOC-      문서
EVD-      증거
```

필수 관계 예시:

```text
REQ-001 -> implemented_by -> API-014
SCR-003 -> triggers -> API-014
API-014 -> handled_by -> SVC-021
SVC-021 -> reads -> TBL-007
SVC-021 -> publishes -> TOPIC-004
K8S-011 -> deploys -> SVC-021
METRIC-008 -> observes -> API-014
TEST-019 -> verifies -> REQ-001
DOC-API -> describes -> API-014
```

이 모델을 모든 문서 생성기의 단일 사실 원천으로 사용한다.

## 5.5 계층 E — 문서 계획·작성

다음 역할을 기존 문서 스킬에 배치하거나 부족하면 추가한다.

- `document-request-resolver`
- `document-catalog-selector`
- `document-outline-planner`
- `requirements-document-writer`
- `architecture-document-writer`
- `application-design-document-writer`
- `data-document-writer`
- `test-document-writer`
- `deployment-operations-document-writer`
- `manual-document-writer`
- `security-governance-document-writer`
- `impact-release-document-writer`

문서 Writer는 소스를 직접 추측해서 분석하지 않는다. 반드시 `canonical_system_model`과 `evidence_registry`만 사용한다.

## 5.6 계층 F — 파일 렌더링

- `markdown-renderer`
- `docx-renderer`
- `xlsx-renderer`
- `pptx-renderer`
- `diagram-renderer`
- `pdf-renderer` — 요청되거나 PDF가 필수일 때만

렌더러는 내용 분석을 하지 않는다. 이미 승인된 문서 모델을 해당 파일 형식으로 정확히 변환한다.

## 5.7 계층 G — 품질 검증·배포

- `evidence-validator`
- `cross-document-consistency-validator`
- `traceability-validator`
- `artifact-structure-validator`
- `visual-quality-validator`
- `secret-pii-redaction-validator`
- `single-output-enforcer`
- `documentation-quality-gate`
- `deliverable-packager`
- `incremental-document-updater`

---

# 6. 스킬 폴더 표준

신규 또는 개편 스킬은 다음 구조를 기본으로 한다.

```text
skills/<skill-name>/
├── SKILL.md
├── config.yaml
├── schemas/
│   ├── input.schema.json
│   └── output.schema.json
├── policies/
│   ├── grounding.md
│   ├── security.md
│   └── quality-gate.md
├── templates/
├── scripts/
├── queries/
├── tests/
│   ├── unit/
│   ├── contract/
│   ├── integration/
│   └── golden/
├── examples/
└── memory/
```

공용 스키마·템플릿·정책은 여러 스킬에 복사하지 말고 중앙에서 관리한다.

```text
skills/_shared/
├── schemas/
├── policies/
├── templates/
│   ├── docx/
│   ├── xlsx/
│   ├── pptx/
│   └── markdown/
├── themes/
├── diagram-styles/
└── validators/
```

---

# 7. 문서 요청 입력 계약

다음과 같은 정규화된 요청 객체를 사용한다.

```yaml
document_request:
  request_id: DOCREQ-20260828-001
  mode: ALL                 # ALL | SINGLE | SELECT | UPDATE | VALIDATE
  system_name: HCP-VOC
  scope:
    type: SYSTEM            # SYSTEM | MODULE | FEATURE | RELEASE | INCIDENT
    values:
      - voc-auto-response
  requested_documents:
    - ALL
  output_formats:
    default: AUTO
    overrides: {}
  language: ko-KR
  audience:
    - developer
    - operator
    - architect
  source_boundaries:
    repositories: []
    branches: []
    commits: []
    clusters: []
    namespaces: []
    databases: []
    indices: []
    topics: []
  immutable_identifiers:
    channel_id: null
    tenant_id: null
    project_id: null
  include:
    - source-code
    - wiki
    - database
    - infrastructure
    - monitoring
  exclude: []
  template:
    corporate_theme: default
    supplied_template_path: null
  output:
    directory: ./deliverables
    overwrite: false
  constraints:
    read_only: true
    redact_secrets: true
    evidence_required: true
    single_output_only: true
```

입력 객체는 정규화 후 수정 불가능한 `immutable_request.json`으로 저장한다.

파생값은 별도 객체에 저장한다.

```yaml
discovered_context:
  detected_repositories: []
  detected_services: []
  detected_clusters: []
  detected_namespaces: []
  detected_datastores: []
  conflicts: []
```

---

# 8. 지원 실행 모드

## 8.1 ALL

사용자가 “모든 문서”라고 요청한 경우다.

- 전체 문서 카탈로그 평가
- 시스템에 적용되는 문서 전부 생성
- 기본 형식 자동 선택
- 문서 간 ID·용어·수량·관계 일치
- 문서 인덱스 및 매니페스트 생성

## 8.2 SINGLE

정확히 한 문서만 사용자에게 제공한다.

예:

```text
API 정의서만 Excel로 만들어줘.
```

동작:

- API 정의서 작성에 필요한 내부 분석만 수행
- 사용자 출력은 XLSX 하나
- 다른 문서 파일 생성 금지
- 내부 QA 로그는 숨김 작업 영역에 보관

## 8.3 SELECT

요청된 복수 문서만 생성한다.

```text
요구사항 정의서, 아키텍처 정의서, 테스트 케이스만 만들어줘.
```

## 8.4 UPDATE

기존 문서를 기준으로 변경된 부분만 갱신한다.

- 기준 버전·commit·문서 해시 확인
- 변경 소스 탐지
- 영향받는 엔터티와 문서만 갱신
- 수동 작성 영역 보존
- 변경 이력 기록
- 삭제·변경·추가 항목 구분

## 8.5 VALIDATE

기존 문서가 실제 소스와 일치하는지 검사한다.

- stale 문서 탐지
- 존재하지 않는 API·테이블·화면 탐지
- 누락된 신규 기능 탐지
- 문서 간 불일치 탐지
- 수정 권고안 생성

---

# 9. 문서 카탈로그 및 기본 파일 형식

사용자가 파일 형식을 지정하면 그 형식을 우선한다. 지정하지 않으면 아래 기본 형식을 사용한다.

| 분류 | 문서 | 기본 형식 | 필수 구성 |
|---|---|---|---|
| 요구사항 | 요구사항 정의서 | DOCX | 목적, 배경, 범위, 기능·비기능 요구사항, 제약, 완료조건 |
| 요구사항 | 요구사항 추적 매트릭스 | XLSX | REQ-ID, 설계, 구현, 테스트, 상태, 근거 |
| 요구사항 | Use Case / User Story | DOCX | Actor, 사전조건, 기본·대안·예외 흐름, 승인조건 |
| 요구사항 | 업무 프로세스 정의서 | PPTX | AS-IS, TO-BE, 역할, 단계, 문제, 개선점 |
| 요구사항 | 용어사전 | XLSX | 용어, 정의, 동의어, 금지 표현, 출처 |
| 설계 | 시스템 아키텍처 정의서 | PPTX | Context, Container, Component, Deployment, 핵심 흐름 |
| 설계 | 상세 아키텍처 설계서 | DOCX | 요구사항, 구성요소, 책임, 데이터·제어 흐름, Trade-off |
| 설계 | 인프라 구성도 | PPTX | Cluster, Node, Namespace, Ingress, Service, Storage, Network |
| 설계 | 데이터 흐름도 | PPTX | Source, Process, Store, Sink, 보안 경계 |
| 설계 | Sequence Diagram | PPTX | Actor, 호출 순서, 조건, 오류, 비동기 처리 |
| 설계 | 프로그램 목록 | XLSX | 프로그램 ID, 구분, 경로, 설명, 담당 기능, 의존성 |
| 설계 | 화면 목록 | XLSX | 화면 ID, Route, Component, 권한, API, 상태 |
| 설계 | 화면 정의서 | XLSX | UI 요소, 입력, 검증, 이벤트, API, 오류, 권한 |
| 설계 | API 정의서 | XLSX | Method, URL, 요청·응답, 인증, 오류, 구현 위치, 근거 |
| 설계 | 인터페이스 정의서 | XLSX | 시스템 간 연계, Protocol, Schema, 주기, 재시도, 책임 |
| 설계 | 모듈·패키지 정의서 | DOCX | 모듈 책임, 패키지 구조, 의존성, 확장 지점 |
| 설계 | 비즈니스 규칙 정의서 | XLSX | Rule-ID, 조건, 처리, 예외, 근거, 영향 기능 |
| 설계 | 오류코드 정의서 | XLSX | 코드, HTTP 상태, 메시지, 발생 조건, 조치 |
| 설계 | Batch·Scheduler 정의서 | XLSX | Job, Trigger, 입력, 처리, 출력, 재실행, 실패 대응 |
| 설계 | Kafka Topic·메시지 정의서 | XLSX | Topic, Producer, Consumer, Key, Schema, Retention, Retry |
| 데이터 | ERD | PPTX | 엔터티, 관계, Cardinality, 주요 키 |
| 데이터 | 테이블 정의서 | XLSX | Table, Column, Type, PK/FK/UK, Null, Default, 설명 |
| 데이터 | 데이터 사전 | XLSX | 논리명, 물리명, 도메인, 형식, 민감도, 품질 규칙 |
| 데이터 | CRUD Matrix | XLSX | 기능·서비스별 C/R/U/D 관계 |
| 데이터 | 데이터 Lineage | PPTX | 생성, 변환, 저장, 전송, 소비 경로 |
| 개발 | 개발 표준서 | DOCX | 코딩, 네이밍, 예외, 로그, 보안, Git, 리뷰 규칙 |
| 개발 | 소스 구조 정의서 | DOCX | 저장소, 모듈, 디렉터리, 핵심 Entry Point |
| 개발 | 환경설정 정의서 | XLSX | Key, 환경, 기본값, Secret 여부, 참조 위치, 영향 |
| 테스트 | 테스트 계획서 | DOCX | 범위, 전략, 환경, 일정, Entry/Exit, 위험 |
| 테스트 | 테스트 시나리오 | XLSX | 시나리오, 선행조건, 단계, 기대결과, REQ-ID |
| 테스트 | 테스트 케이스 | XLSX | Case-ID, 데이터, 절차, 기대값, 결과, 증거 |
| 테스트 | 결함 관리대장 | XLSX | Defect-ID, 심각도, 재현, 원인, 조치, 상태 |
| 테스트 | 성능 테스트 보고서 | DOCX | 목표, 부하 모델, 결과, 병목, 개선, 재검증 |
| 테스트 | 보안 테스트 보고서 | DOCX | 범위, 위협, 테스트, 발견사항, 조치, 잔여위험 |
| 배포 | CI/CD 정의서 | PPTX | Commit부터 배포·검증·Rollback까지 Pipeline |
| 배포 | 배포 절차서 | DOCX | 사전점검, 배포, 검증, 승인, 종료조건 |
| 배포 | Rollback 절차서 | DOCX | Trigger, 판단, 단계, 데이터 복구, 검증 |
| 배포 | Release Note | DOCX | 추가, 변경, 수정, 삭제, 영향, 주의사항 |
| 운영 | 운영 매뉴얼 | DOCX | 기동·중지, 일상점검, 작업, 장애, 연락 체계 |
| 운영 | 사용자 매뉴얼 | DOCX | 역할별 화면 사용법, 입력, 결과, 오류 해결 |
| 운영 | 관리자 매뉴얼 | DOCX | 사용자·권한·설정·감사·운영 기능 |
| 운영 | 장애 대응 Runbook | DOCX | 증상, 탐지, 진단 명령, 조치, 복구, Escalation |
| 운영 | 모니터링 정의서 | XLSX | Metric, Log, Dashboard, Threshold, Alert, Runbook |
| 운영 | SLI/SLO 정의서 | DOCX | 서비스 수준 지표, 목표, 계산식, Error Budget |
| 운영 | 백업·복구 절차서 | DOCX | 대상, 주기, 보존, 복구 순서, 검증 |
| 보안 | 권한 정의서 | XLSX | Role, Resource, Action, Allow/Deny, 승인 근거 |
| 보안 | 보안 설계서 | DOCX | 인증, 인가, 암호화, Secret, 경계, 감사 |
| 관리 | 변경 영향도 분석서 | DOCX | 변경점, 영향 화면·API·DB·인프라·운영·테스트 |
| 관리 | 기술 의사결정 기록 | DOCX | Context, Decision, Alternatives, Consequences |
| 관리 | Risk Register | XLSX | Risk, 확률, 영향, 대응, Owner, Trigger, 상태 |
| 관리 | 문서 인덱스 | XLSX | 문서 ID, 문서명, 버전, 형식, 범위, 상태, 링크 |

사용자가 `Markdown`을 명시하면 같은 내용을 구조화된 Markdown으로 생성한다.

사용자가 `모든 형식`을 명시하지 않는 한 동일 문서를 DOCX·PPTX·XLSX로 중복 생성하지 않는다.

---

# 10. 문서별 최소 품질 기준

## 10.1 요구사항 정의서

필수 항목:

- 문서 정보 및 변경 이력
- 배경과 문제 정의
- 목적과 성공 기준
- 범위와 제외 범위
- Stakeholder와 Actor
- 기능 요구사항
- 비기능 요구사항
- 데이터 요구사항
- 인터페이스 요구사항
- 보안·권한 요구사항
- 운영·모니터링 요구사항
- 제약사항
- 의존성
- 가정
- 위험
- 완료 조건
- 확인 필요 사항
- 요구사항별 고유 ID와 근거

## 10.2 시스템 아키텍처 정의서

필수 슬라이드:

1. 표지
2. 문서 목적과 범위
3. Executive Summary
4. 전체 System Context
5. 논리 아키텍처
6. 애플리케이션 Container 구조
7. 핵심 Component 구조
8. 주요 데이터 흐름
9. 주요 Sequence
10. 데이터 저장소 구조
11. Kafka·비동기 처리
12. Kubernetes 배포 구조
13. CI/CD 구조
14. 관측성 구조
15. 보안 경계와 권한
16. 장애 격리·복구 구조
17. 기술 의존성
18. 위험과 개선 권고
19. 근거 및 확인 필요 사항

## 10.3 프로그램 목록

최소 컬럼:

```text
프로그램 ID
프로그램 유형
시스템
모듈
프로그램명
논리명
물리 경로
언어·프레임워크
Entry Point
주요 역할
호출 주체
호출 대상
연결 화면
연결 API
연결 DB
연결 Kafka
배포 단위
운영 중요도
변경 영향도
근거 ID
```

## 10.4 화면 정의서

최소 컬럼:

```text
화면 ID
화면명
Route
Component 경로
사용자 역할
접근 권한
UI 영역
UI 요소 ID
요소 유형
표시 조건
입력값
필수 여부
Validation
이벤트
호출 API
성공 처리
오류 처리
상태 관리
연결 화면
근거 ID
```

## 10.5 API 정의서

최소 컬럼:

```text
API ID
업무 영역
API 명
Method
Path
호출 화면·시스템
Controller·Router
Service
인증 방식
필요 권한
Request Header
Path Parameter
Query Parameter
Request Body
Response Body
HTTP Status
업무 오류코드
Validation
Timeout
Retry
Idempotency
DB Read/Write
Cache
Kafka
외부 API
로그
Metric
테스트
근거 ID
확인 상태
```

가능하면 OpenAPI 스키마와 실제 코드의 차이도 별도 Sheet에 기록한다.

## 10.6 테이블 정의서

최소 Sheet:

- `00_문서정보`
- `01_테이블목록`
- `02_컬럼정의`
- `03_PK_FK_UK`
- `04_인덱스`
- `05_관계`
- `06_CRUD매트릭스`
- `07_확인필요`

컬럼 정의 최소 필드:

```text
DBMS
Database
Schema
Table
Table 논리명
Column 순서
Column 물리명
Column 논리명
Data Type
Length
Precision
Scale
PK
FK
UK
Nullable
Default
Auto Increment·Sequence
민감정보 등급
암호화 여부
설명
참조 코드 위치
근거 ID
```

## 10.7 테스트 케이스

최소 컬럼:

```text
Test Case ID
REQ-ID
기능·화면·API ID
테스트 유형
우선순위
사전조건
테스트 데이터
수행 단계
기대 결과
오류 기대값
사후조건
자동화 가능 여부
자동화 코드 위치
실행 환경
실행 결과
증거 링크
Defect-ID
상태
```

## 10.8 운영 매뉴얼 및 Runbook

필수 내용:

- 서비스 개요
- 구성요소와 배포 위치
- 일상 점검
- 기동·중지
- 배포 후 검증
- 로그 조회
- 메트릭 조회
- Dashboard
- Alert 의미
- 증상별 진단 순서
- 안전한 명령어
- 금지 명령어
- 복구 방법
- Rollback
- 데이터 정합성 확인
- Escalation 조건
- 근거와 최근 검증일

운영 명령은 실제 환경과 버전을 확인한 것만 작성한다. 파괴적 명령은 기본 문서에서 제외하거나 명확한 승인 경고를 표시한다.

---

# 11. 증거 레지스트리

모든 사실성 주장에는 `EVD-ID`를 연결한다.

권장 스키마:

```yaml
evidence:
  evidence_id: EVD-000123
  entity_ids:
    - API-014
    - SVC-021
  claim: POST /api/v1/voc/answer 요청은 VocAnswerService에서 처리된다.
  source_type: source-code
  source_system: bitbucket
  repository: voc-backend
  revision: 4d2f...
  path: src/main/java/.../VocController.java
  line_start: 41
  line_end: 67
  query_or_command: null
  collected_at: 2026-08-28T09:00:00+09:00
  content_hash: sha256:...
  confidence: HIGH
  sensitivity: INTERNAL
  redacted: false
```

근거 우선순위:

1. 실행 가능한 실제 코드·설정·스키마
2. 현재 런타임 조회 결과
3. 승인된 공식 사내 정책·Wiki
4. 테스트 및 배포 결과
5. 운영 매뉴얼·티켓·블로그
6. 과거 VoC와 과거 답변

충돌 시 상위 우선순위를 참고하되, 자동으로 숨기지 말고 `evidence_conflict`에 기록한다.

---

# 12. 파일 형식별 렌더링 기준

## 12.1 DOCX

필수 품질:

- A4 기본
- 제목·본문·표·캡션에 Word Style 사용
- 자동 목차
- 문서 번호·버전·작성일·범위
- 변경 이력 표
- Header/Footer
- 페이지 번호
- 표 제목 및 그림 캡션
- 섹션별 페이지 나누기
- 표 머리글 반복
- 긴 표의 페이지 분할 대응
- 깨진 한글·대체문자 금지
- 임의 공백으로 정렬 금지
- 고해상도 또는 벡터 다이어그램
- 문서 끝에 확인 필요 사항과 근거 요약
- 사용자 제공 회사 템플릿이 있으면 해당 스타일 우선

## 12.2 XLSX

필수 품질:

- `00_문서정보` Sheet
- `01_...` 순서의 명확한 Sheet 명
- Freeze Pane
- Auto Filter
- Excel Table 사용
- 컬럼 너비 자동 조정 후 최대 폭 제한
- 줄바꿈
- 날짜·숫자·Boolean 형식 정규화
- 상태·우선순위·유형은 Data Validation 사용
- ID 중복 검사
- 필수값 누락 검사
- 조건부 서식으로 오류·확인 필요 표시
- Sheet 간 내부 Hyperlink
- 데이터 영역의 과도한 셀 병합 금지
- 외부 링크와 깨진 수식 금지
- 숨김 Sheet에 원문 Secret 저장 금지
- 수식 결과 오류 금지
- 파일을 실제로 다시 열어 무결성 검사

## 12.3 PPTX

필수 품질:

- 16:9
- 표지·목차·요약·본문·부록 구조
- 한 슬라이드 한 핵심 메시지
- 제목 28pt 이상 권장
- 본문 16pt 이상 권장
- 지나치게 긴 문장을 슬라이드에 배치하지 않음
- 아키텍처 다이어그램은 읽기 가능한 크기
- 시스템·데이터·보안 경계를 시각적으로 구분
- 선 교차 최소화
- 편집 가능한 도형 우선
- 잘림·겹침·슬라이드 밖 객체 금지
- 동일 엔터티의 명칭과 색상·도형 규칙 일관성
- 근거 ID는 발표 흐름을 방해하지 않도록 Notes 또는 부록에 기록
- 렌더링 이미지로 모든 슬라이드 시각 검수

## 12.4 Markdown

필수 품질:

- YAML Front Matter
- 문서 ID·버전·범위·생성 기준 시각
- 자동 목차용 Heading 구조
- 안정적인 Anchor ID
- 표준 표
- Mermaid 또는 PlantUML 코드
- 근거 ID 링크
- 확인 필요 항목
- 상대 경로 링크 무결성 검사

## 12.5 Diagram

지원 우선순위:

1. Mermaid
2. PlantUML
3. Graphviz
4. PPTX 편집 가능 도형

다이어그램은 다음을 포함해야 한다.

- 제목
- 범위
- Legend
- 방향성
- 시스템 경계
- 주요 프로토콜
- 동기·비동기 구분
- 근거 ID

---

# 13. 전체 실행 파이프라인

```text
STEP 01. 사용자 요청 수신
STEP 02. 요청 정규화
STEP 03. immutable_request 생성 및 해시 잠금
STEP 04. 요구사항·목적·범위·완료조건 분석
STEP 05. 기존 스킬 전수조사 및 인벤토리 생성
STEP 06. 문서별 스킬 DAG 구성
STEP 07. 기존 Wiki·문서·정책 조사
STEP 08. 요구사항 재확인
STEP 09. 저장소·모듈·시스템 범위 탐색
STEP 10. 화면→API→Service→DB→Infra 전 구간 추적
STEP 11. DB·메시지·설정·운영·모니터링 근거 수집
STEP 12. 증거 충돌·누락·민감정보 검사
STEP 13. canonical_system_model 생성
STEP 14. 요구사항 재확인
STEP 15. 요청 모드에 따라 문서 카탈로그 선택
STEP 16. 문서별 목차·Sheet·Slide 계획
STEP 17. 문서 콘텐츠 초안 생성
STEP 18. 증거 기반 사실 검증
STEP 19. 문서 간 ID·용어·관계 일관성 검증
STEP 20. 사용자 요청 형식으로 렌더링
STEP 21. 실제 파일 열기·렌더링·시각 검사
STEP 22. 요구사항 및 immutable_request 최종 비교
STEP 23. 품질 점수 계산
STEP 24. 실패 시 원인별 수정 후 재검증
STEP 25. 요청한 산출물만 사용자에게 제공
```

각 단계는 구조화된 입력·출력을 가져야 한다. 스킬 간 전달에 자유 형식 장문을 사용하지 말고 JSON 또는 YAML 계약을 사용한다.

---

# 14. 문서 간 상호 일관성 규칙

다음 항목은 모든 문서에서 정확히 같아야 한다.

- 시스템명
- 서비스명
- 모듈명
- 화면 ID와 화면명
- API ID, Method, URL
- 테이블·컬럼명
- Kafka Topic명
- Kubernetes 리소스명
- 환경명
- 사용자 Role
- 오류코드
- 요구사항 ID
- 테스트 ID
- 용어 정의

필수 검증:

```text
요구사항 수 == 추적 매트릭스의 요구사항 수
API 정의서 API == 프로그램 목록·Sequence·테스트의 API
테이블 정의서 Table == ERD·CRUD Matrix·API DB 참조 Table
화면 정의서 API == API 정의서 API
REQ-ID -> 설계 ID -> 구현 ID -> TEST-ID 연결률 100%
문서에 등장한 엔터티 ID가 canonical_system_model에 존재
삭제된 엔터티가 최신 문서에 잔존하지 않음
```

차이가 있으면 자동으로 하나를 선택하지 말고 원천 근거를 재검사한다.

---

# 15. GLM-5.2 실행 최적화 규칙

GLM-5.2가 대규모 소스를 처리할 때 다음 규칙을 사용한다.

## 15.1 단계 분리

한 번의 프롬프트에서 전체 소스 분석과 모든 문서 작성을 동시에 수행하지 않는다.

역할을 분리한다.

```text
Planner
→ Skill Router
→ Evidence Collectors
→ Domain Analyzers
→ Canonical Model Builder
→ Document Writers
→ Renderers
→ Validators
```

## 15.2 컨텍스트 관리

- 전체 파일 원문을 장시간 컨텍스트에 유지하지 않는다.
- 먼저 저장소·파일·엔터티 인덱스를 만든다.
- 관련 파일만 문서별 작업 컨텍스트에 넣는다.
- 각 Chunk 결과는 JSON으로 축약한다.
- 축약본에도 근거 경로와 라인 정보를 유지한다.
- 긴 출력이 잘리지 않도록 문서·Sheet·Slide 단위로 생성한다.
- 작업 재개 시 자연어 기억이 아니라 manifest와 상태 파일을 읽는다.

## 15.3 구조화 출력

모든 분석 스킬은 JSON Schema 검증을 통과해야 한다.

스키마 불일치 시:

1. 오류 위치 확인
2. 해당 항목만 재생성
3. 전체 분석을 임의로 재작성하지 않음
4. 최대 재시도 횟수 초과 시 명시적 실패

## 15.4 생성과 검증 모델 역할 분리

같은 응답 안에서 `작성 완료`라고 자기 선언하는 것으로 검증을 대체하지 않는다.

- Writer가 초안 생성
- Validator가 원본 근거와 비교
- Renderer가 파일 생성
- Visual Validator가 실제 렌더링 결과 확인

## 15.5 보수적 생성

- 창의성보다 정확성 우선
- 존재하지 않는 클래스·API·테이블 생성 금지
- 빈칸을 그럴듯한 값으로 채우지 않음
- 설명이 부족하면 `확인 필요`로 남김
- 동일 사실을 여러 번 재서술할 때 명칭 변형 금지

---

# 16. 품질 게이트

최종 점수는 100점 기준으로 계산한다.

| 영역 | 점수 |
|---|---:|
| 사실 정확성 및 증거 연결 | 25 |
| 문서 완전성 | 20 |
| 문서 간 일관성 | 20 |
| 요구사항 추적성 | 15 |
| 파일 형식·구조 품질 | 10 |
| 가독성·시각 품질 | 10 |

통과 기준:

```text
총점 90점 이상
```

다음은 점수와 관계없이 즉시 실패하는 Critical 조건이다.

- 근거 없는 핵심 사실 생성
- 고정 입력값 변조
- 다른 channel ID·cluster·namespace로 범위 변경
- Secret·비밀번호·토큰 노출
- 요청하지 않은 사용자 산출물 생성
- 요청 문서 누락
- 파일 손상 또는 열기 실패
- 잘린 PPT 요소
- XLSX 수식 오류
- DOCX 목차·표·이미지 손상
- 문서 간 동일 ID의 상충 정의
- 과거 VoC 답변을 현재 사실로 복사

품질 게이트 결과 예시:

```yaml
quality_gate:
  score: 96
  status: PASS
  critical_failures: []
  warnings:
    - Oracle 운영 스키마 권한 부족으로 인덱스 통계는 확인 필요
  coverage:
    requirements_to_design: 1.0
    design_to_implementation: 0.98
    implementation_to_test: 0.94
  artifacts_opened_successfully: true
  visual_validation_passed: true
  immutable_request_verified: true
```

---

# 17. 필수 테스트 시나리오

스킬 구현 완료 전에 아래 테스트를 모두 작성하고 실행한다.

## 17.1 단일 문서 요청

```text
API 정의서만 XLSX로 만들어줘.
```

검증:

- 사용자 산출물 XLSX 1개
- 다른 DOCX·PPTX 없음
- API 내용과 코드 일치
- 모든 API에 근거 ID 존재

## 17.2 전체 문서 요청

```text
이 시스템의 모든 문서 만들어줘.
```

검증:

- 적용 대상 문서 전체 생성
- 문서 인덱스 생성
- 문서 간 ID 일치
- 적용 불가 문서 사유 기록

## 17.3 입력 변조 방지

초기 입력:

```yaml
channel_id: CHANNEL-A
```

분석 소스 안에 다음 값이 존재:

```yaml
channel_id: CHANNEL-B
```

기대 결과:

- CHANNEL-A 유지
- CHANNEL-B는 discovered_context에만 기록
- 최종 문서 대상은 CHANNEL-A
- immutable hash 불변

## 17.4 충돌 근거

- Wiki와 소스 코드의 API URL이 다름
- 과거 VoC와 현재 담당자 정보가 다름

기대 결과:

- 충돌 숨김 금지
- 상위 근거 우선순위 적용
- 확인 필요 또는 최신 구현 기준 명시

## 17.5 대규모 저장소

- 다중 Repository
- React + Spring Boot + Vert.x
- Oracle + MongoDB + Redis + OpenSearch
- Kafka
- 다중 Kubernetes Cluster

검증:

- Chunk 누락 없음
- 동일 엔터티 중복 생성 없음
- 컨텍스트 초과로 문서 잘림 없음

## 17.6 부분 권한

- Oracle 접근 불가
- Kubernetes 일부 Namespace만 조회 가능

기대 결과:

- 추측 금지
- 조회 불가 범위 명시
- 확인 가능한 부분은 정상 생성

## 17.7 비밀정보

- Repository와 ConfigMap에 토큰 형태 문자열 포함

기대 결과:

- 값 마스킹
- Secret 참조 관계만 문서화
- 원문이 산출물과 로그에 남지 않음

## 17.8 변경 문서 업데이트

- 기존 문서 존재
- API 2개 추가, 1개 삭제

기대 결과:

- 영향 문서만 변경
- 삭제 API는 Removed 처리
- 변경 이력 생성
- 수동 문장 보존

## 17.9 렌더링 검증

- 긴 API 설명
- 100개 이상의 컬럼
- 복잡한 아키텍처

기대 결과:

- DOCX 표 잘림 없음
- XLSX 열 폭과 줄바꿈 정상
- PPTX 글자 겹침·잘림 없음

---

# 18. 산출물 디렉터리 규칙

## 18.1 전체 문서 모드

```text
deliverables/<system-name>/<version-or-timestamp>/
├── 00_Document_Index.xlsx
├── 01_Requirements/
├── 02_Architecture/
├── 03_Application_Design/
├── 04_Data/
├── 05_Development/
├── 06_Test/
├── 07_Deployment/
├── 08_Operations/
├── 09_Security/
├── 10_Change_Management/
├── diagrams/
├── _internal/
│   ├── immutable_request.json
│   ├── request_hash.txt
│   ├── skill_inventory.json
│   ├── canonical_system_model.json
│   ├── evidence_registry.jsonl
│   ├── traceability_matrix.json
│   ├── quality_report.json
│   └── generation_manifest.json
└── README.md
```

## 18.2 단일 문서 모드

사용자에게 노출되는 디렉터리에는 요청 파일만 둔다.

```text
deliverables/<system-name>/<request-id>/
└── API_Definition.xlsx
```

내부 분석 파일은 별도의 숨김 작업 영역에 둔다.

---

# 19. 매니페스트

모든 실행은 내부적으로 다음 정보를 기록한다.

```yaml
manifest:
  request_id: DOCREQ-20260828-001
  request_hash: sha256:...
  mode: SINGLE
  system_name: HCP-VOC
  requested_documents:
    - api-definition
  user_visible_artifacts:
    - API_Definition.xlsx
  internal_artifacts:
    - canonical_system_model.json
    - evidence_registry.jsonl
    - quality_report.json
  source_revisions:
    repositories: []
    wiki_versions: []
    runtime_collected_at: null
  skills_used: []
  skills_not_applicable: []
  quality_score: 0
  status: IN_PROGRESS
```

`skills_used`에는 실제 호출한 기존·신규 스킬을 모두 기록한다.

---

# 20. 사용자 명령 인터페이스 예시

자연어와 명령형 인터페이스를 둘 다 지원한다.

```text
/docs generate --system HCP-VOC --all
```

```text
/docs generate --system HCP-VOC --doc api-definition --format xlsx
```

```text
/docs generate --scope feature:voc-auto-response \
  --docs requirements,sequence,test-cases \
  --formats docx,pptx,xlsx
```

```text
/docs update --system HCP-VOC --baseline 1.2.0 --revision main
```

```text
/docs validate --path ./deliverables/HCP-VOC/1.2.0
```

자연어 파싱 결과가 명확하면 불필요하게 재질문하지 않는다. 정보가 부족해도 확인 가능한 범위부터 생성하고 불확실한 항목을 문서에 명확히 표시한다.

---

# 21. 구현 산출물

이번 작업에서 단순 설계안만 작성하지 말고 다음을 실제로 구현하라.

1. 전체 기존 스킬 인벤토리
2. 기존 스킬 재사용·확장·통합 계획
3. 문서화 스킬 아키텍처
4. 누락된 신규 스킬의 전체 폴더
5. 각 스킬의 `SKILL.md`
6. 입력·출력 JSON Schema
7. 공용 정책
8. 문서별 DOCX·XLSX·PPTX·Markdown 템플릿
9. 문서 카탈로그 설정
10. 증거 레지스트리 스키마
11. Canonical System Model 스키마
12. 문서 간 일관성 Validator
13. 파일 형식별 Validator
14. Secret·PII Redaction Validator
15. 단일 문서 출력 강제 기능
16. 전체 문서 패키징 기능
17. 증분 업데이트 기능
18. 테스트 Fixture
19. Unit·Contract·Integration·Golden 테스트
20. 샘플 시스템으로 생성한 예제 문서
21. 설치·사용·확장 가이드
22. 변경 이력 및 결정 로그

구현하지 않은 항목을 완료했다고 보고하지 않는다.

---

# 22. 각 SKILL.md 필수 구조

모든 `SKILL.md`는 최소 다음 절을 포함한다.

```markdown
# Skill Name

## 목적
## 사용 시점
## 호출 조건
## 사용하지 말아야 할 경우
## 입력 계약
## 불변 입력
## 출력 계약
## 선행 스킬
## 후행 스킬
## 사용 도구
## 읽기·쓰기 권한
## 실행 절차
## 증거 규칙
## 오류 처리
## 재시도 정책
## 보안 규칙
## 품질 게이트
## 예제
## 테스트 케이스
## 버전 및 호환성
```

`SKILL.md` 안에 모호한 표현만 작성하지 말고, 실제 실행 순서·입력·출력·실패 조건을 명시한다.

---

# 23. 스킬 라우팅 규칙

문서별로 필요한 기존 스킬을 자동 선택한다.

예시:

## API 정의서 요청

```text
directive-intake
→ scope-constraint-analysis
→ request-contract-lock
→ skill-inventory-router
→ llm-wiki-search / grounding
→ repository discovery
→ React API client analyzer
→ Spring Controller / Vert.x Router analyzer
→ Service / Repository tracer
→ schema / Kafka / auth / error analyzer
→ canonical-system-model-builder
→ api-interface-document-writer
→ xlsx-renderer
→ evidence-validator
→ cross-document-consistency-validator
→ visual-quality-validator
→ single-output-enforcer
```

## 운영 매뉴얼 요청

```text
requirements and scope skills
→ Wiki grounding
→ Kubernetes / Jenkins / ArgoCD / Harbor / Nexus analyzers
→ Prometheus / Grafana / Loki / Elasticsearch analyzers
→ log / metric / alert / runbook analyzer
→ operations-document-writer
→ docx-renderer
→ command-safety-validator
→ evidence-validator
→ visual-quality-validator
```

## 모든 문서 요청

모든 관련 스킬을 무작정 병렬 호출하지 않는다. 먼저 시스템 범위를 파악한 뒤 문서별 DAG를 만들고, 공통 분석 결과를 한 번만 생성하여 재사용한다.

---

# 24. 완료 기준

다음 조건을 모두 충족해야 완료다.

- 기존 스킬 100% 인벤토리화
- 관련 기존 스킬 100% 문서화 파이프라인 연결
- 중복 기능 통합 또는 명확한 사유 기록
- 단일 문서·복수 문서·전체 문서 모드 작동
- DOCX·XLSX·PPTX·Markdown 생성 작동
- 요청 형식 우선 적용
- 요청하지 않은 사용자 파일 미생성
- 화면→API→Service→DB→Kafka→Kubernetes→모니터링 추적 가능
- 모든 핵심 주장에 증거 연결
- 요구사항→설계→구현→테스트 추적 가능
- 사용자 입력값 변조 감지 작동
- Secret·PII 마스킹 작동
- 문서 간 엔터티 ID·명칭 일치
- 실제 파일 열기 및 렌더링 검증 통과
- 품질 점수 90점 이상
- Critical Failure 0건
- 설치·실행 예제가 재현 가능

---

# 25. 최종 보고 형식

구현 완료 후 다음 순서로 보고한다.

```markdown
# 구현 결과

## 1. 기존 스킬 조사 결과
## 2. 재사용한 스킬
## 3. 확장한 스킬
## 4. 통합한 스킬
## 5. 새로 만든 스킬
## 6. 전체 스킬 DAG
## 7. 지원 문서와 형식
## 8. 테스트 결과
## 9. 품질 점수
## 10. 미확인·미구현 항목
## 11. 실행 방법
## 12. 생성된 파일 목록
```

`미확인·미구현 항목`이 있다면 숨기지 않는다.

---

# 26. GLM-5.2에 전달할 최종 실행 문장

아래 문장을 이 문서와 함께 GLM-5.2에 전달한다.

```text
이 지시서에 따라 현재 워크스페이스의 모든 기존 스킬과 AGENTS.md, SKILL.md, 정책, 템플릿, 스크립트, 쿼리, 테스트, Wiki를 먼저 전수조사하라.

기존 스킬은 재사용을 최우선으로 하고, 부족한 기능은 기존 스킬에 확장하며, 중복 기능은 통합하고, 충족되지 않는 역할에 한해서만 신규 스킬을 만들어라.

최종적으로 사용자가 “이 시스템의 모든 문서 만들어줘”라고 요청하면 시스템 분석에 필요한 모든 관련 스킬을 라우팅하여 전체 문서 패키지를 생성하고, 특정 문서만 요청하면 그 문서만 요청 형식(DOCX, XLSX, PPTX, Markdown 등)으로 생성하도록 구현하라.

요구사항 → 승인 Wiki → 실제 소스 → DB·메시지 → Kubernetes·CI/CD → 모니터링·운영 순으로 근거를 수집하고, 화면 → React 이벤트 → API → Spring Boot/Vert.x → Service → Repository → Oracle/MongoDB/Redis/OpenSearch/Elasticsearch → Kafka → 외부 연계 → Kubernetes → Jenkins/ArgoCD/Harbor/Nexus → Prometheus/Grafana/Loki/Elasticsearch까지 연결 관계를 추적하라.

최초 요청의 channel ID, tenant, repository, branch, cluster, namespace, database, index, topic, 문서 목록, 파일 형식 및 범위는 immutable_request로 잠그고, 소스에서 다른 값을 발견해도 절대 덮어쓰지 마라. 각 단계에서 최초 요구사항과 해시를 재검증하라.

과거 VoC 답변은 참고 근거로만 사용하고 현재 사실이나 정책으로 그대로 복사하지 마라. 확인되지 않은 내용은 창작하지 말고 확인 필요로 표시하라. Secret과 개인정보를 마스킹하라.

단순한 설계안이나 샘플만 제시하지 말고, 실제 스킬 폴더, SKILL.md, 스키마, 정책, 템플릿, 렌더러, Validator, 테스트 및 실행 예제까지 구현하라. 구현 후 단일 문서, 전체 문서, 입력값 변조, 충돌 근거, 부분 권한, 대규모 저장소, 비밀정보, 증분 업데이트, 파일 렌더링 테스트를 실행하고 결과를 보고하라.
```

---

# 27. 권장 추가 원칙

- 문서 생성 결과가 실제 시스템보다 그럴듯해 보이는 것을 목표로 하지 않는다.
- 실제 시스템을 정확하고 추적 가능하게 설명하는 것을 목표로 한다.
- 문서 작성 품질과 파일 디자인 품질을 별도로 검증한다.
- 문서마다 새로운 분석을 반복하지 않고 공통 표준 모델을 재사용한다.
- 시스템이 커져도 문서 ID와 엔터티 ID는 안정적으로 유지한다.
- 소스 변경 시 전체 재생성보다 영향 범위 기반 증분 갱신을 우선한다.
- 문서의 수보다 정확성, 추적성, 일관성, 실사용성을 우선한다.
- 운영자가 실제로 사용할 수 없는 추상적인 매뉴얼을 만들지 않는다.
- 개발자에게는 코드 위치, 운영자에게는 진단 경로, 관리자에게는 권한과 절차가 보여야 한다.
- 모든 문서는 누가, 무엇을, 왜, 어디서, 어떻게 확인할 수 있는지 답해야 한다.

