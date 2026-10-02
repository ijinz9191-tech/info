# CNCF 분야별 추가 VOC 27건

확인일: 2026-09-30. [기존 CNCF VOC](voc-cncf.md)의 27개 분야마다 **다른 증상·실패 경로**를 한 건씩 추가한다. 이들은 제품별 실제 접수 기록이 아니라 [CNCF Landscape](public-data/cncf-landscape-index.json)의 분야와 프로젝트 공식 문서에서 도출한 가능한 운영 사례다. 제품·버전·배포 환경에 따라 원인 후보를 검증한다.

| ID | CNCF 분야 | 증상·확인할 증거 | 원인 후보 → 조치·해결 검증 | 공식 확인 입구 |
|---|---|---|---|---|
| C2-001 | Provisioning / Automation & Configuration | controller가 같은 리소스를 반복 수정; reconcile 로그·resourceVersion 확인 | 서로 다른 관리자가 같은 필드를 갱신 → 필드 소유권을 정리; 안정 상태에서 반복 변경이 멈추는지 확인 | [CNCF 프로젝트](public-data/cncf-projects.md) |
| C2-002 | Provisioning / Container Registry | 이미지는 존재하나 서명/검증 정책에서 차단; digest·서명 주체 확인 | 검증할 digest 또는 신뢰 루트가 다름 → 배포 artifact의 digest와 정책을 맞춤; 허용/거부 이미지 테스트 | [Harbor 문서](https://goharbor.io/docs/) |
| C2-003 | Provisioning / Security & Compliance | 경보가 갑자기 사라짐; 수집 agent 상태·규칙 버전 확인 | 감지 agent 중단 또는 규칙 비활성 → 수집·전달 경로 복구; 안전한 기준 이벤트가 탐지되는지 확인 | [Falco 문서](https://falco.org/docs/) |
| C2-004 | Provisioning / Key Management | 키 회전 후 이전 데이터가 열리지 않음; 암호문·키 버전 추적 | 이전 키 보존/참조 정책 누락 → 버전 호환 복호화 경로 복구; 이전·새 데이터 모두 왕복 검사 | [CNCF 프로젝트](public-data/cncf-projects.md) |
| C2-005 | Runtime / Cloud Native Storage | PVC 확장 후 파일시스템 크기가 그대로; 요청량·볼륨/FS 상태 비교 | 스토리지/파일시스템 확장 단계 미완료 → 지원 절차로 단계 완료; 실제 쓰기 가능한 공간 확인 | [Kubernetes 볼륨](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) |
| C2-006 | Runtime / Container Runtime | 노드 디스크가 가득 차며 새 컨테이너가 시작되지 않음; image/snapshot 사용량 확인 | 사용하지 않는 이미지·계층 또는 로그가 누적 → 보존 정책과 용량 확보; 새 Pod 시작·기존 데이터 보존 확인 | [containerd 문서](https://containerd.io/docs/) |
| C2-007 | Runtime / Cloud Native Network | 오래된 연결만 끊기고 새 연결은 정상; conntrack·노드별 오류 확인 | 연결 추적 테이블 포화/타임아웃 불일치 → 연결 수명·용량 조정; 장시간 연결 부하 테스트 | [Cilium 문서](https://docs.cilium.io/en/stable/) |
| C2-008 | Orchestration & Management / Scheduling & Orchestration | 새 배포가 진행되지 않지만 기존 Pod는 실행 중; rollout·readiness 이벤트 확인 | 새 버전의 준비 실패/리소스 제한 → 새 Pod 원인 수정; rollout 완료와 사용자 요청 동시 확인 | [Kubernetes Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) |
| C2-009 | Orchestration & Management / Coordination & Service Discovery | 교체된 서비스 IP로 일부 클라이언트만 계속 연결; DNS TTL·클라이언트 캐시 확인 | 이름 해석 캐시와 실제 Endpoint 불일치 → 캐시 수명·재조회 경로 수정; 교체 전후 연결 테스트 | [CoreDNS 문서](https://coredns.io/manual/toc/) |
| C2-010 | Orchestration & Management / Remote Procedure Call | 재시도 뒤 쓰기가 두 번 적용됨; request ID·deadline·서버 로그 확인 | RPC 응답 유실과 무조건 재시도 → 멱등 키/결과 조회를 설계; 응답 유실 주입 테스트 | [gRPC 가이드](https://grpc.io/docs/guides/) |
| C2-011 | Orchestration & Management / Service Proxy | proxy와 upstream 사이 재시도가 늘어 지연 폭증; retry 수·upstream 부하 확인 | 계층별 재시도 곱셈 → 전체 시도/시간 예산 설정; 장애 주입 시 처리량·오류율 비교 | [Envoy 문서](https://www.envoyproxy.io/docs/envoy/latest/) |
| C2-012 | Orchestration & Management / API Gateway | 정상 트래픽도 429가 증가; 정책 키·limit·클라이언트 분포 확인 | 여러 사용자가 하나의 제한 키 공유 → 키 범위와 한도 수정; 사용자별 허용·초과 테스트 | [CNCF 프로젝트](public-data/cncf-projects.md) |
| C2-013 | Orchestration & Management / Service Mesh | 인증서 교체 시 일부 프록시만 오래된 인증서 사용; proxy 설정/갱신 시각 확인 | control plane 전파·sidecar 연결 문제 → 전파 상태를 회복; 교체 기간 mTLS 성공률 테스트 | [Istio 문서](https://istio.io/latest/docs/) |
| C2-014 | App Definition and Development / Database | failover 뒤 쓰기가 이전 leader로 향함; topology·클라이언트 캐시 확인 | leader 전환/연결 재선택 지연 → 새 leader 발견과 재시도 정책 수정; failover 연습 후 정합성 확인 | [CNCF 프로젝트](public-data/cncf-projects.md) |
| C2-015 | App Definition and Development / Streaming & Messaging | consumer rebalance 때 lag가 계속 증가; partition·할당·처리시간 확인 | 소비자 처리시간/재조정 빈도 불일치 → 처리 단위·할당·재시도 조정; lag 복구 시간 측정 | [Kafka 설계](https://kafka.apache.org/design/) |
| C2-016 | App Definition and Development / Application Definition & Image Build | CRD 업그레이드 뒤 오래된 매니페스트가 거부됨; API version·schema 오류 확인 | CRD 스키마/버전 호환성 변경 → 매니페스트 변환 순서와 롤백 경로 설계; 이전/새 버전 배포 테스트 | [Kubernetes CRD](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) |
| C2-017 | App Definition and Development / Continuous Integration & Delivery | 실패한 배포를 롤백했지만 일부 리소스는 새 버전; Git·클러스터 리비전 비교 | 여러 controller/수동 변경으로 상태가 분리됨 → 소유권과 대상 리비전을 정리; 롤백 후 전체 리소스 대조 | [Argo CD 문서](https://argo-cd.readthedocs.io/en/stable/) |
| C2-018 | Platform / Certified Kubernetes - Distribution | 업그레이드 후 DNS/스토리지 애드온만 실패; 애드온·API 버전 확인 | 배포판과 애드온 호환 범위 불일치 → 호환 조합으로 순서대로 업그레이드; 핵심 서비스 테스트 | [Kubernetes 버전](https://kubernetes.io/releases/) |
| C2-019 | Platform / Certified Kubernetes - Installer | 재설치 뒤 노드가 control plane에 합류하지 않음; 인증서·토큰·네트워크 확인 | bootstrap 자격 증명 만료/주소 변경 → 신뢰 경로 갱신; 새 노드 합류와 워크로드 스케줄 검증 | [Kubernetes 클러스터](https://kubernetes.io/docs/setup/) |
| C2-020 | Serverless / Installable Platform | 첫 요청만 시간 초과하고 다음은 정상; cold start·이미지 pull 시간 확인 | scale-to-zero 후 초기화 비용이 deadline 초과 → 준비 용량/이미지/초기화 조정; 첫 요청 지연 분포 측정 | [CNCF 프로젝트](public-data/cncf-projects.md) |
| C2-021 | Observability and Analysis / Feature Flagging | flag를 껐는데 일부 인스턴스가 계속 켜짐; 평가 결과·캐시 갱신 시각 확인 | flag 전달/캐시 TTL 불일치 → 갱신 경로와 기본값 명시; 전체 인스턴스 평가 수렴 확인 | [CNCF 프로젝트](public-data/cncf-projects.md) |
| C2-022 | Observability and Analysis / Chaos Engineering | 실험이 지정한 네임스페이스 밖에 영향; 대상 selector·권한 확인 | selector/범위 조건 과도 → 최소 범위와 중단 조건 수정; 격리 환경에서 영향 범위 검증 | [CNCF 프로젝트](public-data/cncf-projects.md) |
| C2-023 | Observability and Analysis / Continuous Optimization | 자동 자원 조정이 상하로 반복; 조정 간격·부하 패턴 확인 | 불안정한 지표/임계값·지연 피드백 → 안정 구간과 상하한 설정; 피크/평시 부하 테스트 | [CNCF 프로젝트](public-data/cncf-projects.md) |
| C2-024 | Observability and Analysis / Observability | 메트릭 저장 비용이 급증; label cardinality·series 수 확인 | 사용자 ID 등 고유값을 label에 사용 → 고카디널리티 label 제거/집계; 시계열 수·질의 비용 비교 | [Prometheus 데이터 모델](https://prometheus.io/docs/concepts/data_model/) |
| C2-025 | Wasm / Application Frameworks | 실행 중 host 기능 호출이 권한 거부; capability·호스트 설정 확인 | 모듈에 필요한 capability 미부여 → 최소 권한으로 계약 명시; 허용/거부 호출 테스트 | [Wasm 명세](https://webassembly.github.io/spec/core/) |
| C2-026 | Wasm / Orchestration & Management | 한 노드에서만 모듈이 실행되지 않음; runtime·CPU·artifact 형식 비교 | 노드별 runtime/아키텍처 지원 차이 → 호환 타깃 지정; 각 노드 시작 테스트 | [CNCF 프로젝트](public-data/cncf-projects.md) |
| C2-027 | Inference / Framework | 모델 로딩 중 OOM으로 재시작; 모델 크기·장치 메모리·동시성 확인 | 모델 복제/배치 크기가 자원 한도 초과 → 배치·replica·정밀도 조정; 로딩·피크 추론 테스트 | [CNCF 프로젝트](public-data/cncf-projects.md) |

원인 후보가 확인되지 않았다면 설정을 변경하지 않고 [CNCF 진단 지도](cncf-deep-dive.md)의 증거 순서로 돌아간다. 공식 확인 입구가 분야 목록인 행은 **특정 프로젝트 동작을 직접 검증한 근거가 아니라** 해당 분야의 프로젝트를 찾기 위한 출발점이다.
