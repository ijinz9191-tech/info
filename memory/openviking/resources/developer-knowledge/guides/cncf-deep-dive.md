---
kind: curated-guide
origin: "cncf-deep-dive.md"
source_access: see_document_links
---
# CNCF 전 범위 지도와 운영 진단

Landscape 원문 수집: 2026-10-02. 아래 개념 설명 확인일: 2026-09-30. [CNCF Landscape 원본](public-data/cncf-landscape.yml)을 공식 저장소의 커밋 `bc9d1b5c87904d9430fc3377938f38192bab3ad0`로 고정해 오프라인에 보관했다. [전체 검색용 색인](public-data/cncf-landscape-index.json)은 2,427개 Landscape 항목, [CNCF 프로젝트 목록](public-data/cncf-projects.md)은 그중 `project` 필드가 있는 255개를 담는다. Landscape에는 CNCF 프로젝트가 아닌 제품·서비스도 있으므로 두 숫자를 혼동하지 않는다. 성숙도 표시는 **스냅샷 당시** 값이다. 최신 상태는 [CNCF 프로젝트 목록](https://www.cncf.io/projects/)과 [Lifecycle](https://contribute.cncf.io/projects/lifecycle/)에서 확인한다. 프로젝트별 원문 수집과 빠진 원천은 [대량 원문 범위](corpus-overview.md)에 기록한다.

## Landscape를 읽는 순서

1. **문제 정의:** 배포, 런타임, 네트워크, 저장소, 보안, 관측 중 실제 문제가 무엇인지 적는다.
2. **분야 선택:** Landscape의 category/subcategory에서 후보를 좁힌다.
3. **소속 확인:** `project`가 없는 항목은 CNCF 공식 프로젝트라고 부르지 않는다. sandbox/incubating/graduated/archived의 의미는 Lifecycle 문서로 확인한다.
4. **채택 평가:** 기술 적합성, 지원 버전, 운영 복잡도, 보안 공지, 라이선스, 유지관리자 문서, 복구 경로를 확인한다. 성숙도만으로 환경 적합성을 결론 내리지 않는다.
5. **코드 확인:** GitHub 구현을 인용할 때는 저장소, 릴리스 태그/커밋, 파일 경로를 고정한다.

## 클라우드 네이티브 계층 지도

| 계층 | 대표 CNCF 프로젝트 예 | 먼저 확인할 불변식 |
|---|---|---|
| 배포·구성 | Helm, Argo, Flux | 원하는 상태와 실제 상태, 차이·되돌리기 |
| 오케스트레이션 | Kubernetes | 선언 상태·스케줄·컨트롤러 조정 |
| 런타임 | containerd | 이미지·컨테이너 수명과 노드 자원 |
| 서비스 발견 | CoreDNS, etcd | 이름 해석과 클러스터 상태의 범위 |
| 네트워크·프록시 | Cilium, Envoy, Istio | L3/L4/L7 정책, 연결·재시도·mTLS |
| 저장·이미지 | Harbor 및 스토리지 프로젝트 | 이미지 공급·데이터 내구성·복구 |
| 보안 | cert-manager, Falco | 인증서 수명·런타임 신호·권한 |
| 관측 | Prometheus, OpenTelemetry | 수집·라벨·전파·내보내기 경계 |

표의 소속·성숙도는 [고정된 원본 목록](public-data/cncf-projects.md)에서 확인한다. 제품마다 설정과 보장은 해당 버전의 공식 문서에서 다시 확인한다.

## 계층별 첫 진단

| VOC 증상 | 첫 증거 | 다음 분기 | 공식 근거 |
|---|---|---|---|
| Pod가 `Pending` | `kubectl describe pod`의 스케줄 이벤트 | CPU/메모리 요청, 노드 선택, taint, 볼륨 | [Pod 진단](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/) |
| `CrashLoopBackOff` | 직전 컨테이너 로그, 종료 코드, restart 수 | 애플리케이션 예외, 설정 누락, OOM, probe | [Pod 수명](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/) |
| 이미지 풀 실패 | 이벤트의 registry·인증·태그 오류 | 이미지 이름·태그·secret·네트워크 | [애플리케이션 문제 해결](https://kubernetes.io/docs/tasks/debug/debug-application/) |
| 서비스가 응답하지 않음 | Endpoint/EndpointSlice, readiness, DNS | Pod 준비, 선택자, 정책·포트, 프록시 | [Kubernetes Service 진단](https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/) |
| 메트릭 target이 `DOWN` | target 오류, scrape URL·labels | 서비스 발견, relabel, 포트, TLS, 타임아웃 | [Prometheus 설정](https://prometheus.io/docs/prometheus/latest/configuration/configuration/) |
| 트레이스·로그 누락 | Collector 자체 로그·메트릭, pipeline | receiver 활성화, processor drop, exporter·네트워크 | [OTel Collector 문제 해결](https://opentelemetry.io/docs/collector/troubleshooting/) |
| GitOps가 동기화되지 않음 | 원하는 Git 리비전, 실제 리소스, controller 로그 | 권한, 렌더 오류, health, drift·prune 정책 | [Argo CD](https://argo-cd.readthedocs.io/en/stable/), [Flux](https://fluxcd.io/flux/) |
| 인증서 발급 지연 | Certificate·Request·Challenge 상태와 이벤트 | issuer, DNS/HTTP 검증, 권한, 만료 정책 | [cert-manager](https://cert-manager.io/docs/) |

## 장애 해결의 공통 경로

`사용자 영향 → 요청/배포 리비전 → Kubernetes 리소스 상태 → 컨트롤러 이벤트 → 네트워크·저장소·인증 → 앱 로그·트레이스 → 완화 → 재발 테스트`.

첫 오류 메시지만으로 원인을 확정하지 않는다. 예를 들어 `CrashLoopBackOff`는 반복 재시작의 표시이며 애플리케이션 오류, OOM, 설정, probe 등 여러 원인이 가능하다. 진단 명령은 읽기 권한과 네임스페이스를 지정해 사용한다. 실제 운영 변경은 원인과 되돌리기 경로를 확인하고 수행한다.

## 갱신

```powershell
node C:\PRJ\apps\info\memory\sync-cncf.mjs --check
node C:\PRJ\apps\info\memory\sync-cncf.mjs --refresh
node C:\PRJ\apps\info\memory\lookup-cncf.mjs --projects-only prometheus
```

`--check`는 오프라인 스냅샷·색인의 해시와 항목을 검사한다. `--refresh`는 연결이 있을 때 공식 저장소의 현재 커밋을 고정해 원본과 목록을 다시 만든다. 데이터 출처 및 재사용 조건은 [공개 자료 표기](public-data/README.md)에 기록한다. 원본 갱신이 각 프로젝트별 설명·VOC 해결을 자동 검증했다는 뜻은 아니다.
