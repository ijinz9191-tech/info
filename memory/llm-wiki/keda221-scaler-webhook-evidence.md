# KEDA 스케일러·메트릭·웹훅 장애 분리

Topic: keda221-scaler-webhook-evidence
Version: KEDA 2.21 troubleshooting
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://keda.sh/docs/2.21/troubleshooting/

<!-- evidence-sha256: f44e46fdcc01862009a413241afa7b84e4338a87d0fcbf930c24b3ddab89fbdd -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-KEDA-EVIDENCE-001 | 외부 메트릭 탐색 실패 | APIService 조건·6443 경로 | 제어면→메트릭 서버 통신 차단 가설 | CNI·NetworkPolicy·보안그룹 경로 확인 | APIService 정상화와 메트릭 조회 확인 |
| SYN-KEDA-EVIDENCE-002 | 프록시 환경 메트릭 timeout | 서비스 IP·no_proxy·연결 로그 | 클러스터 통신이 프록시로 우회 | 관리 권한 범위에서 서비스 IP 우회 설정 확인 | 직접 연결과 APIService 응답 비교 |
| SYN-KEDA-EVIDENCE-003 | 복제 수 정체 | READY/ACTIVE·스케일러 오류 | upstream 조회 실패로 현재 수 유지 | 원천 오류 복구 및 fallback 명세 검토 | 원천 복구 전후 상태·복제 수 관찰 |
| SYN-KEDA-EVIDENCE-004 | ScaledObject 적용 timeout | 웹훅 로그·9443 도달성 | 제어면→admission webhook 연결 실패 | 웹훅 수신과 제한된 통신 경로 점검 | 생성 또는 정상적인 거부 응답 확인 |
| SYN-KEDA-EVIDENCE-005 | 조정 지연·client throttling | QPS·burst·reconcile·API 지연 | 클라이언트 제한 또는 API 과부하 | 부하를 보며 점진적으로 조정 | 조정 지연과 API 부하 함께 비교 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
