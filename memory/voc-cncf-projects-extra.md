# CNCF 개별 프로젝트 추가 VOC 46건

확인일: 2026-09-30. [Landscape 고정 목록](public-data/cncf-projects.md)에 등재된 프로젝트를 골라 각기 다른 **가능한 운영 장애 시나리오**를 정리했다. 실제 접수·해결 기록으로 오인하지 않는다. 공식 프로젝트 문서에서 해당 버전의 동작을 확인하고, 증거와 재현으로 원인 가설을 좁힌다. [분야별 기존 사례](voc-cncf.md)와 [분야별 추가 사례](voc-cncf-extra.md)를 합쳐 CNCF 사례 100건을 제공한다.

| ID | 프로젝트 | 증상·확인할 증거 | 원인 가설 → 조치·검증 | 공식 확인 입구 |
|---|---|---|---|---|
| C3-001 | Atlantis | PR의 plan은 생성되는데 apply가 시작되지 않음; 저장소 권한·승인·lock 상태 확인 | 정책·잠금·웹훅 이벤트 불일치 → 승인·잠금 흐름 조정; 같은 PR에서 plan→apply 완료 확인 | [Atlantis](https://www.runatlantis.io/docs/) |
| C3-002 | Cloud Custodian | 정책 실행 후 기대 리소스가 남음; 필터 결과·권한·리전 확인 | 대상 조건 또는 실행 권한 불일치 → dry run으로 선택 대상을 먼저 확인; 조치 후 잔여 수 집계 | [Cloud Custodian](https://cloudcustodian.io/docs/) |
| C3-003 | KubeEdge | edge 노드가 중앙과 재연결되지만 workload 갱신이 늦음; 연결·동기화 로그 확인 | 연결 복구 뒤 상태 동기화 지연 → 동기화 큐·네트워크 상태 점검; 버전 갱신이 edge에 반영되는지 확인 | [KubeEdge](https://kubeedge.io/docs/) |
| C3-004 | OpenTofu | plan에 의도하지 않은 리소스 교체가 보임; state·provider schema·입력 변경 확인 | 불변 속성 변경 또는 상태 drift → 변경 원인을 plan에서 분리; 적용 전후 리소스 ID와 재계획 확인 | [OpenTofu](https://opentofu.org/docs/) |
| C3-005 | Distribution | 이미지 push가 끝나지 않거나 digest가 불일치; registry 로그·스토리지 오류 확인 | blob 업로드 세션 또는 백엔드 저장 실패 → 손상된 세션 정리·저장소 점검; digest로 pull 검증 | [Distribution](https://distribution.github.io/distribution/) |
| C3-006 | Dragonfly | 피어가 있어도 모든 이미지가 원본 registry에서 내려옴; scheduler·peer 통계 확인 | peer discovery 또는 캐시 키 불일치 → scheduler와 캐시 정책 점검; 원본 트래픽 감소 확인 | [Dragonfly](https://d7y.io/docs/) |
| C3-007 | cert-manager | Certificate가 Ready가 되지 않음; CertificateRequest·Challenge 상태 확인 | issuer 설정·DNS/HTTP 검증 실패 → 해당 challenge 경로 수정; 새 인증서 secret과 만료일 검증 | [cert-manager](https://cert-manager.io/docs/troubleshooting/) |
| C3-008 | Dex | 로그인 후 토큰 검증이 실패; issuer·audience·키 ID 비교 | 클라이언트 설정과 발급자 메타데이터 불일치 → issuer·audience 통일; 새 토큰으로 인증 경로 테스트 | [Dex](https://dexidp.io/docs/) |
| C3-009 | external-secrets | 외부 값은 바뀌었으나 Secret은 오래됨; ExternalSecret 조건·refresh interval 확인 | 외부 provider 권한 또는 동기화 주기 문제 → 인증·주기 조정; Secret의 값 버전 갱신 확인 | [External Secrets](https://external-secrets.io/latest/) |
| C3-010 | Kyverno | 정책이 특정 namespace에서만 적용되지 않음; match/exclude·failurePolicy 확인 | namespace selector 또는 제외 규칙 불일치 → 정책 범위 수정; 허용·차단 예제 모두 시험 | [Kyverno](https://kyverno.io/docs/) |
| C3-011 | OPA | 정책 변경 후에도 이전 허용 결정이 나옴; bundle revision·decision log 확인 | bundle 동기화 또는 캐시 지연 → 배포·캐시 경로 복구; 새 revision의 결정 결과 확인 | [OPA](https://www.openpolicyagent.org/docs/) |
| C3-012 | SPIRE | workload가 SVID를 받지 못함; attestor 결과·registration entry 확인 | selector가 실제 workload 속성과 다름 → 등록 규칙 수정; 발급·갱신 경로 검증 | [SPIRE](https://spiffe.io/docs/latest/spire-about/) |
| C3-013 | Longhorn | 볼륨 재구성 중 Pod가 계속 대기; replica·disk·node 상태 확인 | 충분한 replica 배치 공간 부족 → 스토리지 배치·용량 회복; attach와 재구성 완료 확인 | [Longhorn](https://longhorn.io/docs/) |
| C3-014 | Rook | Ceph PVC가 Pending으로 남음; StorageClass·Ceph health·CSI 로그 확인 | 클러스터 health 또는 CSI provisioning 실패 → 저장소 상태부터 복구; 새 PVC 생성·읽기·쓰기 검증 | [Rook](https://rook.io/docs/rook/latest/) |
| C3-015 | Velero | 복원 작업은 완료로 보이나 일부 볼륨 데이터가 없음; backup item·snapshot·restore 경고 확인 | 볼륨 백업 방식 또는 접근 권한 누락 → 백업 범위 수정; 별도 namespace에 실제 파일 복원 검사 | [Velero](https://velero.io/docs/) |
| C3-016 | containerd | kubelet이 이미지 실행을 거부; CRI 상태·runtime class·pull 오류 확인 | CRI 플러그인 또는 snapshotter 설정 불일치 → 런타임 설정 정합화; 단순 Pod pull·start 확인 | [containerd](https://containerd.io/docs/) |
| C3-017 | CRI-O | 노드 재시작 뒤 컨테이너가 생성되지 않음; CRI-O와 kubelet의 cgroup 설정 확인 | cgroup driver 불일치 → 양측 설정 맞춤; 재시작 뒤 Pod 생성과 자원 제한 검증 | [CRI-O](https://cri-o.io/) |
| C3-018 | Cilium | NetworkPolicy 적용 뒤 DNS 조회가 실패; flow verdict·DNS proxy 로그 확인 | DNS egress 규칙 누락 → 필요한 DNS 흐름만 허용; 정책 전후 이름 조회와 차단 흐름 검증 | [Cilium](https://docs.cilium.io/en/stable/operations/troubleshooting/) |
| C3-019 | MetalLB | LoadBalancer 서비스에 외부 IP가 할당되지 않음; IPAddressPool·advertisement·event 확인 | 주소 풀 고갈 또는 광고 설정 누락 → 할당·광고 정책 수정; 외부 네트워크에서 연결 확인 | [MetalLB](https://metallb.io/troubleshooting/) |
| C3-020 | Submariner | 클러스터 간 서비스가 한 방향으로만 통신; 터널·방화벽·서비스 export 확인 | 라우팅 또는 포트 개방의 비대칭 → 터널/라우트 복구; 양방향 접속 테스트 | [Submariner](https://submariner.io/operations/troubleshooting/) |
| C3-021 | Crossplane | 관리 리소스가 Ready로 가지 않음; composition·provider 조건과 이벤트 확인 | 참조 리소스 또는 provider 자격 증명 누락 → 참조·권한 수정; 원하는 외부 리소스 생성 확인 | [Crossplane](https://docs.crossplane.io/latest/) |
| C3-022 | KEDA | 이벤트가 쌓여도 replica가 늘지 않음; ScaledObject 조건·메트릭 API 확인 | trigger 인증 또는 메트릭 조회 실패 → 인증/trigger 설정 수정; 이벤트 증가에 따른 scale-out 확인 | [KEDA](https://keda.sh/docs/latest/troubleshooting/) |
| C3-023 | Knative | 유휴 뒤 첫 요청이 timeout; activator·queue-proxy·cold start 시간 확인 | scale-to-zero 복귀가 요청 제한보다 느림 → 최소 scale 또는 timeout 조정; 유휴 후 첫 요청 성공률 측정 | [Knative](https://knative.dev/docs/serving/) |
| C3-024 | Karmada | 다중 클러스터 정책이 일부 멤버에만 적용; propagation policy·member 상태 확인 | placement 선택 또는 멤버 연결 문제 → 배치 조건/연결 복구; 모든 대상의 리소스 버전 비교 | [Karmada](https://karmada.io/docs/) |
| C3-025 | CoreDNS | 서비스 이름만 간헐적으로 실패; CoreDNS 로그·상위 DNS 지연 확인 | upstream timeout 또는 캐시 정책 문제 → 전달 대상/시간 제한 조정; 내부·외부 조회 지연 재측정 | [CoreDNS](https://coredns.io/manual/toc/) |
| C3-026 | etcd | 쓰기 지연과 leader 변경 증가; disk fsync·quorum 상태 확인 | 느린 디스크/네트워크로 합의 지연 → 병목 복구; leader 안정성과 쓰기 지연 확인 | [etcd 운영](https://etcd.io/docs/v3.5/op-guide/) |
| C3-027 | gRPC | 일부 클라이언트만 호출 실패; deadline·status code·resolver 결과 확인 | 클라이언트 deadline이 실제 서비스 시간보다 짧음 → 작업별 timeout 설계; 지연 주입에서 상태 코드 확인 | [gRPC deadlines](https://grpc.io/docs/guides/deadlines/) |
| C3-028 | Envoy | 백엔드는 정상인데 503이 증가; cluster health·upstream reset reason 확인 | 엔드포인트 발견 또는 연결 풀 실패 → discovery/health/timeout 설정 점검; 503과 성공률 재측정 | [Envoy operations](https://www.envoyproxy.io/docs/envoy/latest/operations/operations) |
| C3-029 | Istio | sidecar 주입 후 특정 서비스 통신 실패; proxy config·mTLS 상태 확인 | PeerAuthentication/DestinationRule 정책 불일치 → 두 정책의 TLS 모드 정합화; 양쪽 호출 검증 | [Istio troubleshooting](https://istio.io/latest/docs/ops/common-problems/) |
| C3-030 | Linkerd | meshed Pod에서만 연결이 끊김; proxy 로그·identity 인증서 확인 | identity 발급 또는 trust anchor 문제 → 인증서 상태와 발급 경로 수정; meshed 간 mTLS 통신 확인 | [Linkerd troubleshooting](https://linkerd.io/2/tasks/troubleshooting/) |
| C3-031 | CloudNativePG | failover 뒤 클라이언트가 이전 primary에 붙음; 서비스 endpoint·연결 풀 확인 | 애플리케이션의 오래된 연결이 유지됨 → 서비스와 pool 재연결 전략 수정; failover 실험으로 쓰기 복구 시간 측정 | [CloudNativePG](https://cloudnative-pg.io/documentation/) |
| C3-032 | Vitess | reshard 중 일부 키 범위만 실패; vreplication·routing 규칙 확인 | 복제 진도 또는 라우트 전환 불일치 → 전환 순서 조정; 키 범위별 읽기·쓰기 검증 | [Vitess](https://vitess.io/docs/) |
| C3-033 | NATS | 재연결 뒤 소비 메시지가 중복 처리됨; ack·redelivery count 확인 | ack 전 장애로 재전송 → 소비자 멱등성/ack 전략 보강; 장애 주입 후 중복 부작용 검사 | [NATS JetStream](https://docs.nats.io/nats-concepts/jetstream) |
| C3-034 | Strimzi | Kafka rolling update가 멈춤; operator reconcile·브로커/PDB 상태 확인 | 가용성 예산 또는 브로커 health가 교체를 막음 → health 복구 뒤 순차 재시도; 모든 브로커 버전과 ISR 확인 | [Strimzi](https://strimzi.io/documentation/) |
| C3-035 | CloudEvents | 이벤트 소비자가 필수 속성 누락으로 거부; specversion·id·source 확인 | producer가 envelope 필수 필드를 빠뜨림 → 스키마/직렬화 수정; 유효·무효 이벤트 계약 테스트 | [CloudEvents](https://github.com/cloudevents/spec) |
| C3-036 | Helm | 업그레이드 후 값이 예상과 다름; 렌더된 manifest·values 병합 결과 확인 | 차트 기본값과 override 우선순위 착오 → `helm template` 결과 검토; 변경 전후 manifest diff 확인 | [Helm](https://helm.sh/docs/) |
| C3-037 | Dapr | pub/sub 요청은 성공하지만 구독자에 도달하지 않음; component scope·topic·sidecar 로그 확인 | 컴포넌트 범위 또는 구독 경로 불일치 → scope/route 수정; 고유 이벤트 ID로 end-to-end 추적 | [Dapr](https://docs.dapr.io/developing-applications/building-blocks/pubsub/) |
| C3-038 | KubeVirt | VM이 Pending이고 시작되지 않음; launcher Pod·노드 가상화 기능 확인 | 노드 자원/가상화 지원 부족 → 노드 기능과 스케줄 제약 정합화; VM 시작과 콘솔 접속 확인 | [KubeVirt](https://kubevirt.io/user-guide/) |
| C3-039 | Argo | Argo CD에서 Git 변경이 적용되지 않음; Application sync status·diff·repo 접근 확인 | 자동 동기화 비활성 또는 repo 인증 실패 → 접근과 sync 정책 수정; 지정 commit이 클러스터에 반영되는지 확인 | [Argo CD](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/) |
| C3-040 | Flux | GitRepository는 Ready인데 Kustomization만 실패; source artifact·조건·의존성 확인 | 순서/경로/health check 불일치 → 경로와 dependsOn 수정; reconcile 후 Ready 및 리소스 상태 확인 | [Flux](https://fluxcd.io/flux/cheatsheets/troubleshooting/) |
| C3-041 | Tekton | PipelineRun이 Task를 시작하지 못함; workspace·service account·TaskRun 조건 확인 | workspace 바인딩 또는 권한 누락 → 바인딩/권한 수정; 동일 입력의 PipelineRun 완료 검증 | [Tekton](https://tekton.dev/docs/pipelines/) |
| C3-042 | OpenFeature | flag provider 교체 뒤 기본값만 반환; provider status·evaluation reason 확인 | provider 초기화 전 평가 또는 키 불일치 → 초기화·키 설정 수정; 변형별 평가 결과 확인 | [OpenFeature](https://openfeature.dev/docs/reference/intro/) |
| C3-043 | Chaos Mesh | 실험 종료 뒤에도 대상이 정상화되지 않음; experiment 상태·finalizer·대상 Pod 확인 | 복구 단계가 실패 또는 대상 리소스 변경 → controller 상태 복구; 원래 네트워크/프로세스 동작 확인 | [Chaos Mesh](https://chaos-mesh.org/docs/) |
| C3-044 | OpenTelemetry | Collector는 정상인데 trace가 빠짐; receiver/exporter·queue·retry 지표 확인 | exporter 거부 또는 queue 포화 → 배치·재시도·용량 조정; 고유 trace ID의 종단 수신 확인 | [Collector troubleshooting](https://opentelemetry.io/docs/collector/troubleshooting/) |
| C3-045 | Prometheus | target은 UP인데 메트릭이 없음; scrape sample·relabel 설정 확인 | metric relabel 규칙에서 샘플 제거 → 규칙 수정; 원본 target과 쿼리 결과의 시계열 비교 | [Prometheus configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/) |
| C3-046 | KServe | InferenceService가 Ready여도 예측 요청이 실패; predictor 로그·모델 저장소 접근 확인 | 모델 artifact 접근 또는 로딩 실패 → 스토리지 자격 증명·모델 형식 점검; 샘플 추론과 출력 shape 확인 | [KServe](https://kserve.github.io/website/docs/intro) |

프로젝트 상태와 문서 주소는 바뀔 수 있다. 프로젝트별 버전, 배포 형태, 원인 확정 여부를 실제 사고 기록에 덧붙인다.
