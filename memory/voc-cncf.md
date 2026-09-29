# CNCF 분야별 예상 VOC와 해결 검증

확인일: 2026-09-30. [CNCF 공식 Landscape 스냅샷](public-data/cncf-landscape-index.json)에서 CNCF 프로젝트로 표시된 255개가 속한 **27개 세부 분야 각각**에 대표 장애 유형을 연결한다. 이 표는 각 프로젝트의 모든 버그를 수집했다는 뜻이 아니다. 같은 분야에서도 제품·버전·배포 방식마다 실제 원인과 복구 명령은 다르다. 프로젝트 소속은 [고정 프로젝트 목록](public-data/cncf-projects.md)에서 확인한다.

## Provisioning

| 분야 | 예상 VOC 증상 | 우선 확인할 원인 | 조치와 해결 확인 |
|---|---|---|---|
| Provisioning / Automation & Configuration | 선언한 구성과 실행 상태가 다름 | 입력 변수·권한·재조정 실패·drift | 계획과 실제 차이를 기록하고 변경 재적용 뒤 수렴 확인 |
| Provisioning / Container Registry | 이미지 push/pull 실패 | 인증·태그/다이제스트·TLS·저장 공간 | 실패 단계와 registry 로그를 확인하고 고정 digest로 push/pull 재시험 |
| Provisioning / Security & Compliance | 정책 차단 또는 위협 경보 폭증 | 정책 버전·예외·오탐·권한 | 거부 이벤트와 실제 작업을 대조하고 최소 권한/정책 테스트 |
| Provisioning / Key Management | 비밀/키를 못 읽거나 복호화 실패 | 권한·키 버전·회전·만료 | 키 접근 로그와 암호문 버전을 맞추고 회전 전후 복호화 테스트 |

## Runtime

| 분야 | 예상 VOC 증상 | 우선 확인할 원인 | 조치와 해결 확인 |
|---|---|---|---|
| Runtime / Cloud Native Storage | Pod 재시작 뒤 데이터가 사라지거나 mount 실패 | 볼륨 수명·접근 모드·노드/CSI 오류 | PVC/PV 이벤트와 노드 로그를 확인하고 재시작·장애 복구 테스트 |
| Runtime / Container Runtime | 컨테이너 시작 지연/실패 | 이미지 pull·snapshot·리소스·런타임 오류 | 노드와 런타임 로그를 분리하고 같은 이미지·노드에서 재현 확인 |
| Runtime / Cloud Native Network | Pod 간 연결 지연/차단 | CNI 경로·정책·MTU·DNS | 같은/다른 노드 경로를 나누어 측정하고 정책 변경 전후 패킷 확인 |

## Orchestration & Management

| 분야 | 예상 VOC 증상 | 우선 확인할 원인 | 조치와 해결 확인 |
|---|---|---|---|
| Orchestration & Management / Scheduling & Orchestration | Pod `Pending`·반복 재시작 | 스케줄 이벤트·자원 요청·종료 코드·probe | `describe`와 이전 로그로 원인을 특정하고 배포 후 준비/재시작 안정 확인 |
| Orchestration & Management / Coordination & Service Discovery | 이름 해석 실패·leader 변경 반복 | DNS 응답·etcd 건강·시계·네트워크 분리 | 질의 경로와 quorum 상태를 분리하고 장애 후 수렴 시간 검증 |
| Orchestration & Management / Remote Procedure Call | gRPC 요청이 시간 초과/실패 | deadline·로드밸런싱·TLS·서비스 발견 | 클라이언트/서버 trace를 연결하고 실패율·deadline 예산 테스트 |
| Orchestration & Management / Service Proxy | 일부 경로만 503 또는 연결 재설정 | upstream 건강·route·TLS·timeout | 프록시와 upstream 로그의 요청 ID를 맞추고 경로별 부하 테스트 |
| Orchestration & Management / API Gateway | 인증은 되는데 API가 403/404 | 라우트·인가 정책·플러그인 순서 | 게이트웨이와 서비스의 응답을 비교하고 허용/거부 계약 테스트 |
| Orchestration & Management / Service Mesh | mTLS 연결 실패·재시도 폭주 | 인증서·sidecar 설정·정책·retry budget | 양쪽 프록시의 설정/인증서를 확인하고 트래픽·오류율 비교 |

## App Definition and Development

| 분야 | 예상 VOC 증상 | 우선 확인할 원인 | 조치와 해결 확인 |
|---|---|---|---|
| App Definition and Development / Database | 읽기 지연·쓰기 충돌 | 느린 쿼리·잠금·복제 지연·저장 용량 | 실행 계획/잠금·복제 지표를 보고 기준 데이터 정합성 확인 |
| App Definition and Development / Streaming & Messaging | 중복·순서 역전·소비 지연 | 파티션 키·재시도·offset·소비 속도 | 동일 이벤트 반복/역순 재생 테스트와 lag 회복 확인 |
| App Definition and Development / Application Definition & Image Build | 차트/매니페스트는 성공했지만 앱 배포 실패 | 템플릿 값·이미지 태그·API 버전·secret | 렌더 결과와 실제 리소스를 비교하고 깨끗한 환경 배포 테스트 |
| App Definition and Development / Continuous Integration & Delivery | Git 리비전과 실제 배포가 다름 | sync 오류·drift·권한·승인 단계 | 소스 리비전·아티팩트 digest·클러스터 리비전을 연결해 확인 |

## Platform·Serverless

| 분야 | 예상 VOC 증상 | 우선 확인할 원인 | 조치와 해결 확인 |
|---|---|---|---|
| Platform / Certified Kubernetes - Distribution | 배포판 업그레이드 뒤 API/애드온 오류 | Kubernetes 버전 호환성·기능 게이트·벤더 확장 | 업그레이드 경로를 재현하고 API/워크로드 호환성 검사 |
| Platform / Certified Kubernetes - Installer | 새 클러스터 설치 중 control plane 준비 실패 | 네트워크·인증서·노드 전제 조건 | 설치 로그와 노드 조건을 확인하고 동일 구성 재설치 테스트 |
| Serverless / Installable Platform | 이벤트는 들어오지만 함수가 실행되지 않음 | trigger 연결·scale-to-zero·이미지 시작·타임아웃 | 이벤트 ID로 전달 단계를 추적하고 cold start/재시도 시험 |

## Observability and Analysis

| 분야 | 예상 VOC 증상 | 우선 확인할 원인 | 조치와 해결 확인 |
|---|---|---|---|
| Observability and Analysis / Feature Flagging | 일부 사용자에게 잘못된 기능 노출 | 대상 규칙·캐시·환경별 기본값 | 사용자 속성/환경별 평가 결과를 재현하고 rollback 검증 |
| Observability and Analysis / Chaos Engineering | 실험 종료 뒤 서비스가 복구되지 않음 | 중단 조건·복원 작업·안전 범위 | 실험 전후 상태를 대조하고 복구 자동화·중단 조건 테스트 |
| Observability and Analysis / Continuous Optimization | 최적화 뒤 비용은 줄었지만 지연 증가 | 자원 축소와 실제 부하의 불일치 | 비용·p95/p99·오류율을 같은 기간 비교하고 되돌리기 검증 |
| Observability and Analysis / Observability | 로그·메트릭·트레이스가 누락됨 | 수집 pipeline·drop·라벨 폭증·exporter | 소량의 기준 신호로 경로를 검사하고 수신량/누락량 확인 |

## Wasm·Inference

| 분야 | 예상 VOC 증상 | 우선 확인할 원인 | 조치와 해결 확인 |
|---|---|---|---|
| Wasm / Application Frameworks | 모듈 호출 실패·호스트 기능을 못 찾음 | import/export·WASI/호스트 버전·권한 | 호스트 계약과 모듈을 같은 버전으로 빌드해 최소 호출 시험 |
| Wasm / Orchestration & Management | 모듈은 배포됐지만 실행 환경에서 시작 실패 | runtime 지원·artifact 형식·정책 | 배포 대상 runtime과 artifact를 맞추고 시작/종료 이벤트 검사 |
| Inference / Framework | 모델 요청 지연·결과 불일치 | 모델 버전·입력 shape·장치·큐 대기 | 기준 입력/모델 버전을 고정하고 정확도·지연·자원 사용량 비교 |

## CNCF 공통 분류 절차

1. 사용자 영향과 제품·버전·클러스터/네임스페이스 범위를 적는다.
2. 위 표의 분야를 고르고 사용 중인 실제 프로젝트를 [목록](public-data/cncf-projects.md)에서 찾는다.
3. `요청 → 게이트웨이/프록시 → 서비스 → Pod/노드 → 저장소/메시지 → 관측 수집` 경로에서 첫 실패 지점을 찾는다.
4. 읽기 전용 증거(상태·이벤트·로그·메트릭·트레이스)를 확보한 뒤 하나의 원인 가설을 재현·반증한다.
5. 완화와 영구 해결을 구분하고 사용자 요청, 데이터 정합성, 재발 테스트로 종료한다.

핵심 프로젝트의 구체적인 첫 진단과 공식 근거는 [CNCF 지도](cncf-deep-dive.md)와 [공개 VOC 사례집](voc-public.md)에 있다. Landscape 항목 전체는 [오프라인 JSON 색인](public-data/cncf-landscape-index.json)에서 검색할 수 있다.
