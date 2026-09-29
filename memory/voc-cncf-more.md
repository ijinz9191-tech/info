# CNCF 프로젝트 추가 VOC 20건

확인일: 2026-09-30. 분야별/개별 프로젝트 [기존 100건](voc-cncf-projects-extra.md)에서 다루지 않은 프로젝트와 실패 경로를 보강한다. 아래는 공식 프로젝트 자료에 따라 조사할 수 있는 **가상 운영 사례**이며, 원인 확정에는 제품 버전과 관측 증거가 필요하다.

| ID | 프로젝트 | 증상·확인할 증거 | 가설 → 조치·해결 검증 | 공식 확인 입구 |
|---|---|---|---|---|
| C4-001 | Harbor | registry는 응답하지만 이미지 pull이 401; robot account·프로젝트 권한 확인 | 자격 증명 만료/범위 부족 → 최소 권한 credential 갱신; digest 지정 pull 시험 | [Harbor](https://goharbor.io/docs/) |
| C4-002 | Falco | 정상 기준 이벤트도 알림이 없음; 드라이버·규칙 로딩·출력 채널 확인 | 커널 수집 경로 또는 출력 설정 실패 → 수집 상태 복구; 안전한 테스트 이벤트가 알림으로 도달하는지 검증 | [Falco](https://falco.org/docs/) |
| C4-003 | Keycloak | 로그인 성공 후 응용 프로그램의 audience 검사 실패; 토큰 claim·client scope 확인 | 필요한 audience mapper 누락 → client scope 조정; 새 토큰의 claim과 API 인증 확인 | [Keycloak](https://www.keycloak.org/documentation) |
| C4-004 | OpenFGA | 관계를 추가했는데 권한 확인은 거부; tuple·authorization model ID 확인 | 다른 모델 버전/객체 ID로 검사 → 요청 모델과 tuple 통일; 허용·거부 경계 사례 시험 | [OpenFGA](https://openfga.dev/docs) |
| C4-005 | SOPS | CI만 암호문을 복호화하지 못함; 키 그룹·CI identity 확인 | 새 실행 환경에 복호화 키 접근이 없음 → 승인된 키 배포/권한 설정; 같은 파일의 CI 복호화 확인 | [SOPS](https://getsops.io/docs/) |
| C4-006 | OpenEBS | PVC는 생성되나 재시작 뒤 볼륨 attach가 지연; CSI·노드 상태 확인 | 노드 플러그인/엔진 재연결 문제 → CSI와 엔진 health 복구; Pod 재스케줄 후 읽기·쓰기 확인 | [OpenEBS](https://openebs.io/docs/) |
| C4-007 | Container Network Interface (CNI) | Pod 생성 시 sandbox 네트워크 설정 실패; kubelet·CNI plugin 로그 확인 | plugin binary/config 경로 불일치 → 노드 설치와 설정 정합화; 신규 Pod의 주소·통신 검사 | [CNI](https://www.cni.dev/docs/) |
| C4-008 | k0s | 노드 합류 뒤 Ready가 되지 않음; join token·control plane 연결 확인 | 토큰/방화벽/버전 불일치 → 합류 계약 수정; 새 노드에서 테스트 Pod 실행 | [k0s](https://docs.k0sproject.io/stable/) |
| C4-009 | Kubeflow | 실험 메타데이터는 있는데 학습 작업이 시작되지 않음; pipeline run·service account 확인 | 작업 제출 권한/이미지 접근 실패 → 권한·이미지 수정; 동일 pipeline의 task 완료 확인 | [Kubeflow](https://www.kubeflow.org/docs/) |
| C4-010 | OpenCost | 비용 합계가 클라우드 청구와 크게 다름; 가격표·idle allocation·기간 확인 | 가격·할당 기준 차이 → 비교 기간과 할당 규칙 통일; 샘플 namespace 비용 재계산 | [OpenCost](https://opencost.io/docs/) |
| C4-011 | Jaeger | 서비스는 trace를 보내지만 검색에 나타나지 않음; collector·storage·sampling 확인 | 샘플링에서 누락 또는 저장 경로 실패 → 수집/저장 설정 점검; 지정 trace ID 검색 | [Jaeger](https://www.jaegertracing.io/docs/) |
| C4-012 | Thanos | 장기 메트릭에 시간 구간 공백; sidecar 업로드·object store·compactor 확인 | 블록 업로드 실패 또는 중복 제거 설정 문제 → 저장 경로 복구; 원본과 장기 쿼리의 구간 비교 | [Thanos](https://thanos.io/tip/thanos/getting-started.md/) |
| C4-013 | Fluentd | 로그가 입력되지만 일부 필드가 사라짐; filter chain·buffer 오류 확인 | 파서/필터 순서 오류 → 단계별 이벤트 확인 후 순서 조정; 고유 로그 레코드의 필드 비교 | [Fluentd](https://docs.fluentd.org/) |
| C4-014 | Cortex | 동일 PromQL이 인스턴스마다 다름; tenant header·ingester 상태 확인 | 테넌트 헤더 누락 또는 replication 지연 → 인증/replication 점검; 같은 tenant·시각의 결과 비교 | [Cortex](https://cortexmetrics.io/docs/) |
| C4-015 | KubeArmor | 정책은 적용됐으나 차단이 없음; 노드 LSM 지원·policy selector 확인 | enforcement backend 또는 대상 선택 문제 → 노드 지원과 selector 정합화; 허용/차단 명령 시험 | [KubeArmor](https://docs.kubearmor.io/) |
| C4-016 | Ratify | 서명한 이미지가 검증 거부됨; artifact reference·trust policy 확인 | 서명 referrer/신뢰 저장소 불일치 → digest와 검증 정책 정합화; 유효·위조 이미지 각각 시험 | [Ratify](https://ratify.dev/docs/) |
| C4-017 | TiKV | 읽기 지연이 급증하고 region 이동이 많음; hot region·PD 상태 확인 | 키 분포 쏠림 → 키 설계와 region 분산 점검; hot region·P99 비교 | [TiKV](https://tikv.org/docs/) |
| C4-018 | Buildpacks | 같은 소스인데 새 이미지가 다른 런타임을 사용; builder/run image·buildpack 탐지 기록 확인 | builder가 바뀌어 빌드팩 선택이 달라짐 → builder digest 고정; SBOM·실행 테스트 비교 | [Buildpacks](https://buildpacks.io/docs/) |
| C4-019 | Backstage | 카탈로그 항목이 사라짐; location 등록·processor 로그 확인 | location 접근 실패 또는 엔터티 검증 오류 → 등록/스키마 수정; 재처리 후 항목 검색 확인 | [Backstage](https://backstage.io/docs/features/software-catalog/) |
| C4-020 | Telepresence | 로컬 intercept 후 특정 요청만 서비스에 닿지 않음; intercept 상태·namespace·헤더 매칭 확인 | 트래픽 매칭 조건 또는 라우팅 범위 불일치 → intercept 규칙 수정; 일치/불일치 요청의 목적지 검증 | [Telepresence](https://www.telepresence.io/docs/) |

새 사례는 중복을 피하고 공식 출처·관측 방법·조치 검증을 갖춰 이어서 추가한다.
