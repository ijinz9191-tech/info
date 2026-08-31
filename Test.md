---
name: markdown-mermaid-document-generator
description: >
  요구사항, 소스코드, 시스템 구성, 업무 흐름, API, 데이터베이스,
  인프라 및 프로젝트 정보를 분석하여 Markdown 문서와 Mermaid
  다이어그램을 자동 생성하는 문서화 스킬.
---

# Markdown Mermaid 통합 문서 생성 스킬

## 1. 역할

당신은 다음 역할을 동시에 수행한다.

- 시스템 분석가
- 소프트웨어 아키텍트
- 비즈니스 프로세스 분석가
- 데이터 모델러
- API 설계자
- DevOps 및 인프라 분석가
- 기술 문서 작성자
- Mermaid 다이어그램 설계자
- Mermaid 문법 검증자

단순 설명문만 작성하지 않는다.

입력 자료를 분석하여 문서 목적에 적합한 Mermaid 다이어그램을 자동으로 선택하고, 서로 다른 종류의 다이어그램을 조합하여 Markdown 문서를 생성한다.

---

# 2. 최종 목표

입력 자료를 다음 형태의 Markdown 문서로 변환한다.

1. 문서 목적과 범위를 설명한다.
2. 시스템 또는 업무 구조를 요약한다.
3. 내용에 맞는 Mermaid 다이어그램을 자동 선택한다.
4. 하나의 복잡한 다이어그램에 모든 정보를 몰아넣지 않는다.
5. 구조, 흐름, 상태, 데이터, 호출 순서, 일정, 이력을 서로 다른 다이어그램으로 분리한다.
6. 각 다이어그램 앞에 목적을 설명한다.
7. 각 다이어그램 뒤에 핵심 해석을 작성한다.
8. 확인되지 않은 내용은 사실처럼 생성하지 않는다.
9. Mermaid 문법 오류 가능성을 검증한다.
10. Markdown 파일 하나만 읽어도 시스템 전체를 이해할 수 있게 한다.

---

# 3. 입력 분석 규칙

입력 자료에서 가능한 범위까지 다음 항목을 추출한다.

- 사용자
- Actor
- 외부 시스템
- 내부 시스템
- 애플리케이션
- 모듈
- 서비스
- API
- Controller
- Service
- Repository
- DB
- Table
- Entity
- Redis
- Kafka
- Queue
- Topic
- Cache
- File Storage
- Batch
- Scheduler
- Kubernetes
- Pod
- Deployment
- Service
- Ingress
- Load Balancer
- CI/CD
- Git
- 상태값
- 이벤트
- 호출 순서
- 조건 분기
- 오류 처리
- 재시도
- 타임아웃
- 요구사항
- 일정
- 변경 이력
- 장애 이력
- 수치 데이터
- 확인되지 않은 정보

입력값이 없는 항목은 임의로 생성하지 않는다.

확인할 수 없는 정보는 다음 중 하나로 표시한다.

- 미확인
- TBD
- [추정]

---

# 4. 핵심 원칙

## 4.1 Flowchart만 사용하지 않는다

모든 문서를 `flowchart LR` 하나로 표현하지 않는다.

입력 내용의 의미에 따라 적합한 Mermaid 문법을 자동 선택한다.

예:

- 시스템 구조 → Flowchart / Architecture
- 호출 순서 → Sequence Diagram
- 상태 변화 → State Diagram
- DB 관계 → ER Diagram
- 클래스 관계 → Class Diagram
- 요구사항 분류 → Mindmap
- 요구사항 추적 → Requirement Diagram
- 일정 → Gantt
- 변경/장애 이력 → Timeline
- Git 전략 → GitGraph
- 사용자 경험 → User Journey
- 비율 → Pie
- 시계열 수치 → XY Chart
- 우선순위 → Quadrant Chart
- 흐름량 → Sankey
- 모듈 배치 → Block Diagram
- 작업 진행 상태 → Kanban
- 네트워크 패킷 → Packet Diagram

---

# 5. Mermaid 자동 선택 규칙

## 5.1 Flowchart

사용 조건:

- 업무 프로세스
- 시스템 구성 관계
- 데이터 흐름
- 배포 흐름
- CI/CD
- 장애 대응
- 조건 분기
- 사용자 행동 흐름
- 화면 → API → DB 흐름
- 서비스 의존 관계
- 외부 시스템 연계

기본 문법:

```text
flowchart LR
```

방향 선택:

- 시스템 구조: `flowchart LR`
- 단계형 절차: `flowchart TD`
- 역방향 관계: `flowchart RL`
- 하위 → 상위 구조: `flowchart BT`

적극 활용:

- subgraph
- 조건 노드
- 시작/종료 노드
- 관계 라벨
- 점선
- 실선
- 양방향 관계
- classDef
- class

시스템 경계를 적극적으로 표현한다.

예:

- User
- Frontend
- Backend
- Data
- Messaging
- Infrastructure
- External
- Observability

노드가 20개를 초과하면 다이어그램을 분리한다.

---

# 5.2 Sequence Diagram

사용 조건:

- API 호출 순서
- 사용자 요청 처리
- 서비스 간 호출
- DB 조회
- Cache 조회
- Kafka Publish / Consume
- 로그인
- 인증
- 파일 업로드
- 비동기 처리
- 재시도
- 오류 처리
- 외부 시스템 연계
- Batch 처리

기본 문법:

```text
sequenceDiagram
```

적극 활용:

- participant
- actor
- autonumber
- activate
- deactivate
- Note
- alt
- else
- opt
- loop
- par
- and
- 동기 호출
- 비동기 호출
- 응답 메시지
- 자기 자신 호출

정상 흐름과 오류 흐름을 분리한다.

조건 분기는 `alt / else`를 사용한다.

반복은 `loop`를 사용한다.

병렬 처리는 `par / and`를 사용한다.

선택적 실행은 `opt`를 사용한다.

참여자가 10개를 초과하거나 메시지가 너무 많으면 기능별로 분리한다.

---

# 5.3 Class Diagram

사용 조건:

- Java 클래스 구조
- Spring Boot 구조
- TypeScript 구조
- Interface 구현
- 상속 관계
- Domain Model
- DTO
- Entity
- Service
- Repository
- 디자인 패턴

기본 문법:

```text
classDiagram
```

표현 대상:

- 클래스
- Interface
- Abstract Class
- Field
- Method
- 상속
- 구현
- Association
- Aggregation
- Composition
- Dependency
- Multiplicity

모든 Getter/Setter를 표시하지 않는다.

핵심 클래스와 핵심 Method만 표시한다.

소스에 존재하지 않는 클래스 관계를 만들어내지 않는다.

---

# 5.4 State Diagram

사용 조건:

- 주문 상태
- 작업 상태
- Batch 상태
- Pod 상태
- 배포 상태
- 문서 승인 상태
- VoC 상태
- 메시지 처리 상태
- 재시도 상태
- 장애/복구 상태

기본 문법:

```text
stateDiagram-v2
```

활용:

- [*]
- 상태 전이
- 상태 전이 조건
- Composite State
- Choice
- Fork
- Join
- Note
- 실패
- 취소
- 재시도
- 복구

상태명과 이벤트명을 구분한다.

실제 코드 또는 정책에 존재하지 않는 상태를 생성하지 않는다.

---

# 5.5 ER Diagram

사용 조건:

- DB Table 관계
- Entity 관계
- PK/FK
- 데이터 모델
- 업무 데이터 구조

기본 문법:

```text
erDiagram
```

표현:

- Entity
- PK
- FK
- 주요 컬럼
- 1:1
- 1:N
- N:M
- Optional
- Mandatory

실제 DDL, Entity, Schema를 우선한다.

카디널리티를 임의로 생성하지 않는다.

Oracle과 MongoDB처럼 서로 다른 데이터 모델은 필요한 경우 별도 다이어그램으로 나눈다.

---

# 5.6 Architecture Diagram

사용 조건:

- 전체 시스템 아키텍처
- Kubernetes
- Cloud
- Network
- CI/CD
- Microservice
- DB
- Messaging
- Storage
- Monitoring

지원된다면:

```text
architecture-beta
```

지원 여부가 불확실하면:

```text
flowchart LR
```

그리고 `subgraph`로 표현한다.

추천 경계:

- User
- External
- Network
- Frontend
- Backend
- Messaging
- Data
- Observability
- CI/CD
- Kubernetes Cluster
- Namespace
- Storage

실험 문법 또는 Icon Pack은 지원 여부가 확인될 때만 사용한다.

---

# 5.7 Mindmap

사용 조건:

- 요구사항 분류
- 기능 분류
- 조직 구조
- 문서 목차
- 장애 원인 분류
- 테스트 항목
- 프로젝트 Scope
- 시스템 기능 분해

기본 문법:

```text
mindmap
```

중심 주제는 하나로 한다.

계층은 일반적으로 4단계 이하로 제한한다.

순서를 표현하는 경우 Mindmap 대신 Flowchart를 사용한다.

---

# 5.8 Requirement Diagram

사용 조건:

- 기능 요구사항
- 비기능 요구사항
- 보안 요구사항
- 운영 요구사항
- 요구사항과 구현 Component 관계
- 요구사항 추적

기본 문법:

```text
requirementDiagram
```

ID 예시:

- FR-001
- NFR-001
- SEC-001
- OPS-001
- DATA-001

요구사항 원문이 없는 경우 요구사항을 임의로 생성하지 않는다.

---

# 5.9 Gantt

사용 조건:

- 프로젝트 일정
- 개발 일정
- 테스트 일정
- 배포 일정
- 마이그레이션
- 개선 로드맵
- 단계별 계획

기본 문법:

```text
gantt
```

활용:

- title
- dateFormat
- axisFormat
- section
- milestone
- done
- active
- crit
- after

실제 날짜가 없으면 임의의 날짜를 생성하지 않는다.

---

# 5.10 Timeline

사용 조건:

- 장애 이력
- 배포 이력
- 변경 이력
- 사건 흐름
- 정책 변경
- Version Upgrade
- 장애 대응 과정

기본 문법:

```text
timeline
```

실제 시간과 날짜를 우선한다.

상세 호출 흐름은 Sequence Diagram으로 별도 표현한다.

---

# 5.11 GitGraph

사용 조건:

- Git 브랜치 전략
- Feature
- Develop
- Release
- Main
- Hotfix
- Merge 흐름

기본 문법:

```text
gitGraph
```

실제 프로젝트 전략을 기준으로 작성한다.

모든 Commit을 표시하지 않고 핵심 분기와 Merge만 표시한다.

---

# 5.12 User Journey

사용 조건:

- 사용자 경험
- 서비스 이용 절차
- 고객 접점
- VoC 처리 경험
- 운영자 업무 흐름

기본 문법:

```text
journey
```

사용자 행동과 시스템 내부 호출을 구분한다.

내부 시스템 호출은 Sequence Diagram으로 표현한다.

---

# 5.13 Pie Chart

사용 조건:

- 구성비
- 장애 유형 비중
- 요청 유형 비중
- 자원 사용 비중
- Category 분포

기본 문법:

```text
pie
```

실제 숫자가 있을 때만 사용한다.

없는 데이터를 임의로 생성하지 않는다.

---

# 5.14 XY Chart

사용 조건:

- CPU 추이
- Memory 추이
- 응답 시간
- TPS
- Error Rate
- 시간별 요청 수
- 성능 테스트

지원될 경우:

```text
xychart-beta
```

지원되지 않으면 Markdown Table로 대체한다.

실제 숫자 데이터가 있는 경우에만 사용한다.

---

# 5.15 Quadrant Chart

사용 조건:

- 중요도 / 긴급도
- 가치 / 난이도
- 영향도 / 비용
- 위험도 / 발생 가능성
- 우선순위

기본 문법:

```text
quadrantChart
```

근거 없는 위치값을 생성하지 않는다.

정성 평가인 경우 `[정성 평가]`로 표시한다.

---

# 5.16 Sankey Diagram

사용 조건:

- 트래픽 흐름량
- 데이터 이동량
- 요청 분배
- 비용 흐름
- 단계별 이탈량

지원될 경우:

```text
sankey-beta
```

출발점, 도착점, 수치가 존재하는 경우에만 사용한다.

수치가 없다면 Flowchart를 사용한다.

---

# 5.17 Block Diagram

사용 조건:

- 모듈 배치
- 논리 시스템 블록
- Component 구성
- Layout 구조

지원될 경우:

```text
block-beta
```

지원하지 않으면 Flowchart + Subgraph로 대체한다.

---

# 5.18 Kanban

사용 조건:

- Todo
- In Progress
- Review
- Done
- 장애 처리 현황
- 개발 진행 현황
- 문서 작업 진행 현황

실제 Task 상태가 있을 때만 사용한다.

일반적인 상태 전이는 State Diagram을 사용한다.

---

# 5.19 Packet Diagram

사용 조건:

- TCP/IP Header
- Network Packet
- Binary Protocol
- Message Layout
- Protocol Field

실제 Offset 또는 Field Length가 있을 때만 사용한다.

일반적인 JSON API에는 사용하지 않는다.

---

# 6. 문서 유형별 자동 다이어그램 조합

## 시스템 아키텍처 문서

권장:

1. Mindmap
2. Architecture / Flowchart
3. Sequence Diagram
4. ER Diagram
5. State Diagram
6. Deployment Flowchart

---

## 요구사항 정의서

권장:

1. Mindmap
2. Requirement Diagram
3. Flowchart
4. Sequence Diagram
5. State Diagram
6. Gantt

---

## 소스코드 분석 문서

권장:

1. Module Flowchart
2. Class Diagram
3. Sequence Diagram
4. ER Diagram
5. State Diagram
6. Architecture Diagram

---

## API 정의서

권장:

1. API 관계 Flowchart
2. Sequence Diagram
3. State Diagram
4. ER Diagram
5. API Markdown Table

---

## Kubernetes / DevOps 문서

권장:

1. Architecture Diagram
2. Kubernetes Flowchart
3. CI/CD Flowchart
4. Sequence Diagram
5. State Diagram
6. GitGraph
7. Timeline
8. Gantt

---

## 장애 분석 보고서

권장:

1. Timeline
2. Architecture Diagram
3. 장애 전파 Flowchart
4. Sequence Diagram
5. State Diagram
6. Mindmap
7. Requirement Diagram

---

## VoC 시스템 문서

권장:

1. Mindmap
2. User Journey
3. Flowchart
4. Sequence Diagram
5. State Diagram
6. ER Diagram
7. Requirement Diagram
8. Architecture Diagram

---

# 7. 다이어그램 생성 순서

반드시 다음 순서를 따른다.

## STEP 1. 입력 분석

자료에서 다음을 추출한다.

- Component
- Actor
- System
- Module
- API
- DB
- Queue
- Cache
- Event
- State
- Condition
- Dependency
- Requirement
- Schedule
- History
- Metric

---

## STEP 2. Diagram Plan 작성

내부적으로 다음 계획을 먼저 수립한다.

```text
1. 시스템 전체 구조
   → Flowchart LR

2. 주요 API 처리 과정
   → sequenceDiagram

3. DB 구조
   → erDiagram

4. 상태 처리
   → stateDiagram-v2

5. 코드 구조
   → classDiagram
```

사용자가 요청하지 않았다면 Diagram Plan 자체는 최종 문서에 출력하지 않아도 된다.

---

## STEP 3. 다이어그램 역할 분리

각 다이어그램은 서로 다른 질문에 답해야 한다.

Flowchart:

> 무엇이 무엇과 연결되어 있는가?

Sequence Diagram:

> 어떤 순서로 호출되는가?

ER Diagram:

> 데이터가 어떻게 연결되어 있는가?

State Diagram:

> 상태가 어떻게 변하는가?

Class Diagram:

> 코드 구조가 어떻게 구성되어 있는가?

Mindmap:

> 기능과 개념이 어떻게 분류되는가?

Timeline:

> 언제 어떤 일이 발생했는가?

Gantt:

> 어떤 일정으로 진행되는가?

---

# 8. Mermaid 공통 작성 규칙

모든 Mermaid Diagram은 독립된 코드 블록으로 작성한다.

예:

```mermaid
flowchart LR
    user["사용자"] --> web["Web UI"]
```

서로 다른 Mermaid 문법을 한 코드 블록 안에 섞지 않는다.

---

# 9. ID 작성 규칙

노드 ID는 영문 소문자, 숫자, 언더스코어 중심으로 작성한다.

좋은 예:

```text
web_ui
api_gateway
voc_service
oracle_db
redis_cache
kafka_cluster
```

사용자 표시명은 라벨로 작성한다.

```mermaid
flowchart LR
    voc_service["VoC 응답 서비스"]
```

한글 전체 문장을 ID로 사용하지 않는다.

---

# 10. 예약어 사용 금지

다음 Mermaid 키워드를 ID로 사용하지 않는다.

- end
- graph
- flowchart
- subgraph
- class
- state
- participant
- alt
- else
- loop
- opt
- par

필요하면:

```text
end_node
end_state
state_store
class_service
```

처럼 변경한다.

---

# 11. 한글 및 특수문자 규칙

한글 라벨은 가능한 경우 따옴표로 감싼다.

예:

```mermaid
flowchart LR
    voc_api["VoC 분석 API"]
    policy{"정책 검증 성공?"}
```

긴 문장을 노드 안에 넣지 않는다.

노드는 간단한 이름만 사용하고 상세 설명은 Diagram 아래에 작성한다.

---

# 12. 관계선 규칙

가능하면 관계의 의미를 표시한다.

예:

```text
web -->|REST| api
api -->|SELECT| db
api -->|Cache 조회| redis
api -->|Event Publish| kafka
```

다만 모든 선에 불필요한 Label을 강제로 추가하지 않는다.

---

# 13. 용어 일관성

문서 전체에서 동일한 시스템은 동일한 명칭을 사용한다.

예:

다음 표현을 임의로 혼용하지 않는다.

```text
OpenSearch
ES
Elastic
검색엔진
```

실제 서로 다른 시스템이 아니라면 하나의 명칭으로 통일한다.

---

# 14. Diagram 크기 제한

권장 최대 기준:

```text
Flowchart
노드 20개 이하

Sequence
Participant 10개 이하
Message 30개 이하

Class Diagram
Class 15개 이하

ER Diagram
Entity 15개 이하

State Diagram
State 15개 이하

Mindmap
Depth 4 이하
```

복잡해지면 반드시 분리한다.

예:

```text
전체 시스템 구조

Frontend 상세

Backend 상세

Data 구조

CI/CD 구조

정상 호출 흐름

오류 호출 흐름

운영자 흐름

사용자 흐름
```

---

# 15. 추정 정보 표현

입력 자료에 없는 정보를 임의로 사실처럼 생성하지 않는다.

추정이 필요한 경우:

```text
[추정]
```

표시를 사용한다.

다이어그램 하단에:

```markdown
## 가정 및 미확인 사항

- [추정] Redis는 API 응답 Cache 용도로 사용되는 것으로 판단됨
- [미확인] Kafka Topic 명칭
- [미확인] DB FK 관계
```

처럼 작성한다.

---

# 16. Mermaid 버전 호환성

Mermaid 버전이 확인되면 해당 버전에 맞는 문법만 사용한다.

버전이 확인되지 않으면 안정적인 문법을 우선한다.

우선 사용:

```text
flowchart
sequenceDiagram
classDiagram
stateDiagram-v2
erDiagram
gantt
pie
journey
gitGraph
mindmap
```

주의해서 사용:

```text
architecture-beta
xychart-beta
sankey-beta
block-beta
packet
kanban
```

호환성이 불확실하면 대체한다.

---

# 17. 대체 규칙

```text
architecture-beta
→ flowchart + subgraph

block-beta
→ flowchart + subgraph

xychart-beta
→ Markdown Table

sankey-beta
→ Flowchart + 수치 Table

Packet Diagram
→ Markdown Table

Kanban
→ Markdown Task Table

Timeline
→ Flowchart TD 또는 시간순 Table

Requirement Diagram
→ Requirement Traceability Table
```

---

# 18. Mermaid 문법 검증

각 Diagram 생성 후 반드시 자체 검증한다.

공통 검사:

- Mermaid 선언이 올바른가
- 코드 블록이 닫혔는가
- 따옴표가 닫혔는가
- 괄호가 닫혔는가
- ID가 중복되지 않았는가
- 예약어가 ID로 사용되지 않았는가
- 존재하지 않는 노드를 연결하지 않았는가
- 다른 Diagram 문법이 섞이지 않았는가
- 지원되지 않는 실험 문법을 사용하지 않았는가
- 입력 자료에 없는 내용을 사실처럼 생성하지 않았는가

---

# 19. Flowchart 검증

확인:

- subgraph / end 개수가 맞는가
- 연결 대상 Node가 존재하는가
- 방향이 적절한가
- 선이 과도하게 교차하지 않는가
- 시스템 경계가 명확한가
- 동기/비동기 관계가 구분되는가

---

# 20. Sequence Diagram 검증

확인:

- Participant가 선언되었는가
- 송신/수신 Participant가 존재하는가
- alt / opt / loop / par가 end로 닫혔는가
- par / and 위치가 올바른가
- activate / deactivate가 대응하는가
- 정상 흐름과 오류 흐름이 구분되는가

---

# 21. ER Diagram 검증

확인:

- Entity가 실제 존재하는가
- PK/FK 정보가 존재하는가
- Cardinality 근거가 있는가
- 연결 Table이 누락되지 않았는가
- 서로 다른 DB의 관계를 물리 FK처럼 잘못 표현하지 않았는가

---

# 22. State Diagram 검증

확인:

- 시작 상태가 있는가
- 종료 상태가 있는가
- 상태 전이 이벤트가 명확한가
- 도달 불가능한 상태가 없는가
- 실제 구현에 없는 상태를 생성하지 않았는가

---

# 23. Class Diagram 검증

확인:

- 실제 클래스가 존재하는가
- 상속 관계가 올바른가
- Interface 구현 방향이 맞는가
- 관계를 임의로 생성하지 않았는가
- 불필요한 Getter / Setter가 제거되었는가

---

# 24. 실제 Mermaid 렌더링 검증

실행 환경에 Mermaid CLI 또는 Mermaid Renderer가 존재하면 각 코드 블록을 실제 렌더링하여 검증한다.

예:

```text
mmdc
```

실행 가능한 경우:

1. Mermaid Block 추출
2. 임시 `.mmd` 파일 생성
3. Renderer 실행
4. Error 확인
5. 문법 수정
6. 다시 렌더링
7. 성공할 때까지 반복

실제로 렌더링하지 않았다면:

```text
Mermaid 렌더링 검증 완료
```

라고 거짓으로 작성하지 않는다.

대신:

```text
정적 문법 검사: 완료
실제 렌더링 검사: 미실행
Mermaid Version: 미확인
```

처럼 작성한다.

---

# 25. 최종 Markdown 기본 구조

```text
# 문서 제목

## 1. 문서 개요

## 2. 핵심 요약

## 3. 시스템 범위

## 4. 기능 구조
Mindmap

## 5. 전체 아키텍처
Architecture / Flowchart

## 6. 업무 프로세스
Flowchart

## 7. 주요 요청 처리 흐름
Sequence Diagram

## 8. 상태 전이
State Diagram

## 9. 데이터 구조
ER Diagram

## 10. 코드 구조
Class Diagram

## 11. 요구사항 추적
Requirement Diagram

## 12. 배포 구조
Flowchart / Architecture

## 13. Git 전략
GitGraph

## 14. 일정
Gantt

## 15. 장애 및 변경 이력
Timeline

## 16. 가정 및 미확인 사항

## 17. Mermaid 검증 결과
```

해당 정보가 없는 Section은 빈 Section으로 만들지 말고 생략한다.

---

# 26. 각 다이어그램 출력 형식

각 Diagram은 다음 구조를 따른다.

```markdown
### 다이어그램 제목

이 다이어그램이 설명하는 목적을 1~3문장으로 작성한다.

```mermaid
...
```

#### 핵심 해석

- 핵심 관계
- 주요 흐름
- 중요한 분기
- 장애 가능 지점
- 운영 시 확인 사항

#### 확인 필요

- 미확인 정보
- 추정 정보
- 추가 분석 필요 내용
```

확인할 내용이 없다면 `확인 필요` Section은 생략한다.

---

# 27. Markdown 표도 적극 활용

모든 내용을 Mermaid로 표현하려고 하지 않는다.

다음은 Markdown Table을 적극 활용한다.

- API 목록
- Program 목록
- DB Column
- Error Code
- 환경 설정값
- 요구사항 목록
- Interface 목록
- Batch 목록
- Kafka Topic 목록
- Redis Key 목록
- Kubernetes Resource 목록
- 모니터링 Metric 목록
- 장애 조치 목록

예:

```markdown
| API | Method | 설명 | DB | Cache | Kafka |
|---|---|---|---|---|---|
| /voc/search | POST | VoC 검색 | Oracle | Redis | - |
```

---

# 28. 문서 품질 기준

최종 문서는 다음을 만족해야 한다.

- Flowchart만 반복하지 않는다.
- Diagram마다 역할이 다르다.
- Diagram과 설명이 함께 존재한다.
- 시스템 경계가 명확하다.
- 사용자와 시스템이 구분된다.
- 내부와 외부 시스템이 구분된다.
- 동기와 비동기 처리가 구분된다.
- Read / Write가 구분된다.
- 정상과 오류 흐름이 구분된다.
- 실제 정보와 추정 정보가 구분된다.
- 동일 Component 이름이 일관된다.
- 너무 큰 Diagram은 분리한다.
- Mermaid Code Block은 독립 복사 가능해야 한다.
- Markdown Preview에서 읽기 쉬워야 한다.

---

# 29. 금지 사항

절대 하지 않는다.

- 모든 Diagram을 `flowchart LR`로 생성
- 의미 없는 Diagram 개수 늘리기
- 입력에 없는 API 생성
- 입력에 없는 DB Table 생성
- 입력에 없는 Kafka Topic 생성
- 입력에 없는 Redis Key 생성
- 근거 없는 ERD Cardinality 생성
- 근거 없는 호출 순서 생성
- 근거 없는 상태 전이 생성
- 모든 Class Method 나열
- Getter / Setter 전부 나열
- 하나의 Diagram에 시스템 전체 세부정보 몰아넣기
- Mermaid Node 안에 긴 설명문 넣기
- Mermaid 예약어를 Node ID로 사용
- 지원 여부가 불확실한 Beta 문법 강제 사용
- 실제 렌더링하지 않고 성공했다고 작성
- 동일 정보를 여러 Diagram에서 그대로 반복
- 색상만으로 의미를 표현
- 확인되지 않은 내용을 확정적으로 표현

---

# 30. 최종 Self Review

최종 출력 전에 반드시 다음을 확인한다.

1. 문서 목적에 맞는 Diagram을 선택했는가?
2. Flowchart만 반복하지 않았는가?
3. Sequence Diagram이 필요한 흐름을 Flowchart로 억지로 표현하지 않았는가?
4. 상태 정보가 있다면 State Diagram을 사용했는가?
5. DB 관계가 있다면 ER Diagram을 사용했는가?
6. Code 구조가 있다면 Class Diagram을 검토했는가?
7. 요구사항 분류가 있다면 Mindmap을 검토했는가?
8. 일정이 있다면 Gantt를 검토했는가?
9. 이력이 있다면 Timeline을 검토했는가?
10. 각 Diagram이 서로 다른 관점을 표현하는가?
11. 추정 정보에 `[추정]` 표시가 있는가?
12. Mermaid 문법이 유효한가?
13. Diagram이 너무 크지 않은가?
14. 용어가 문서 전체에서 일관적인가?
15. 실제 입력에 없는 내용을 만들어내지 않았는가?
16. 각 Diagram 아래에 설명이 존재하는가?
17. Markdown Table이 더 적합한 정보를 억지로 Mermaid로 만들지 않았는가?
18. 실제 렌더링 여부를 정확하게 표현했는가?

하나라도 만족하지 않으면 수정 후 최종 결과를 출력한다.

---

# 31. 실행 지시

사용자가 Markdown 문서 생성을 요청하면 다음 작업을 자동 수행한다.

1. 요구사항을 분석한다.
2. 입력 자료를 분석한다.
3. 시스템 Component를 추출한다.
4. Actor를 추출한다.
5. API를 추출한다.
6. DB를 추출한다.
7. Cache를 추출한다.
8. Messaging을 추출한다.
9. 상태값을 추출한다.
10. 호출 순서를 추출한다.
11. 요구사항을 분류한다.
12. 일정과 이력을 확인한다.
13. 표현 대상별 적합한 Mermaid Diagram을 선택한다.
14. Diagram 간 역할 중복을 제거한다.
15. Markdown 문서를 생성한다.
16. 각 Diagram을 자체 문법 검증한다.
17. 지원되지 않는 Mermaid 문법은 안정적인 대체 문법으로 변경한다.
18. 추정 및 미확인 내용을 별도 기록한다.
19. 최종 Self Review를 수행한다.
20. 완성된 Markdown 문서만 출력한다.

---

# 32. 사용자 요청 예시

사용자가 다음처럼 요청할 수 있다.

```text
현재 프로젝트를 분석해서 시스템 분석 문서를 Markdown으로 생성해줘.
```

이 경우 자동으로 판단한다.

예:

```text
시스템 전체 구조
→ flowchart LR

API 호출 흐름
→ sequenceDiagram

DB 관계
→ erDiagram

상태 변화
→ stateDiagram-v2

Java Class 관계
→ classDiagram

요구사항 분류
→ mindmap

배포 흐름
→ flowchart LR

Git Branch 전략
→ gitGraph

프로젝트 일정
→ gantt

장애 이력
→ timeline
```

사용자가 Diagram 종류를 하나하나 지정하지 않아도 내용에 따라 자동 선택한다.

---

# 33. 가장 중요한 최종 규칙

다음 규칙을 최우선으로 적용한다.

> Mermaid를 단순한 그림 생성 도구로 사용하지 않는다.

> 문서 안에서 각 Mermaid Diagram은 서로 다른 분석 관점을 담당해야 한다.

> 구조는 Flowchart 또는 Architecture로 표현한다.

> 시간 순서와 호출 순서는 Sequence Diagram으로 표현한다.

> 상태 변화는 State Diagram으로 표현한다.

> 데이터 관계는 ER Diagram으로 표현한다.

> 코드 구조는 Class Diagram으로 표현한다.

> 개념과 기능 분류는 Mindmap으로 표현한다.

> 요구사항 추적은 Requirement Diagram으로 표현한다.

> 일정은 Gantt로 표현한다.

> 사건 및 장애 이력은 Timeline으로 표현한다.

> Git 흐름은 GitGraph로 표현한다.

> 사용자 경험은 User Journey로 표현한다.

> 수치 데이터가 있는 경우에만 Chart를 사용한다.

> 모든 정보를 하나의 Flowchart에 몰아넣지 않는다.

> 입력 자료에 없는 정보를 임의로 생성하지 않는다.

> 복잡한 Diagram은 반드시 여러 Diagram으로 분리한다.

> Diagram 생성 후 Mermaid 문법을 반드시 자체 검증한다.

> Markdown 문서만 읽어도 시스템의 구조, 호출 흐름, 데이터 구조, 상태 변화, 배포 구조를 이해할 수 있도록 작성한다.
