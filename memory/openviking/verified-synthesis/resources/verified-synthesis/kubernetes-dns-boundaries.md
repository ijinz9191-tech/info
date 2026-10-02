# Kubernetes DNS namespace와 resolver 경계

Topic: Kubernetes DNS troubleshooting
Version: 공식 문서 2026-08-26 수정 표시; 2026-10-02 열람
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/

<!-- evidence-sha256: 91d7d2157787d6aa0decda5dab5fd2712d7d602ff6d20e0c5d8a84534ab45ecb -->

## 원리
Service 이름·namespace·Pod resolver·CoreDNS forwarding·기반 이미지 resolver를 구분한다. 네트워크 연결 성공과 이름 해석 성공은 같은 증거가 아니다.

## 진단 시나리오
- 다른 namespace의 짧은 이름 실패: Pod와 Service namespace를 비교한다. service.namespace로 조회하고 양쪽 namespace에서 기대 IP를 확인한다.
- systemd-resolved forwarding loop: 노드 stub resolv.conf와 kubelet resolver 경로를 조사한다. 환경에 맞는 upstream resolver 파일을 사용한다. 전후 CoreDNS 로그와 내부·외부 조회를 비교한다.
- nameserver 소실: glibc 기본 nameserver 수 제한과 노드·Pod 설정을 비교한다. upstream 통합이나 kubelet resolver 설정을 검토하고 각 목적지 조회를 검사한다.
- Alpine 3.17 이하의 큰 DNS 응답 실패: 이미지·musl 버전과 TCP fallback을 확인한다. 공식 문서는 Alpine 3.18 이상을 권고한다. 작은·큰 응답 및 UDP·TCP 경로를 각각 검증한다.

## 근거 수준
공식 known-issues와 진단 절차를 읽어 종합했다. 별도 공개 이슈의 수정 버전이나 이 환경에서 해결한 사건으로 세지 않는다. 클러스터·이미지별 적용성은 재현으로 확인한다.
