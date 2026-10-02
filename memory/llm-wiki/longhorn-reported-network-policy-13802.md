# Longhorn 공개 이슈 #13802: NetworkPolicy 증거와 주장 충돌

Topic: cncf/longhorn
Version: Report Longhorn 1.12.1; KB 1.12.1 and 1.12.2+ migration; no local reproduction
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/longhorn/longhorn/issues/13802
- https://longhorn.io/kb/troubleshooting-volume-attachment-stuck-cni-networkpolicies/

<!-- evidence-sha256: a05c64211c682977f6aa8d8362e914f5e0dabfdc4ac9a44a96ed9515aa6a15e0 -->

## 공개 보고

2026-08-20 보고자는 Longhorn 1.12.1 업그레이드 후 V1 attach/detach 실패, FailedAttachVolume, engine starting, Cilium host-origin TCP 3260 deny를 제시했다. 보고자의 환경·영향 범위는 독립 재현하지 않았다. 페이지는 Closed이며 연결 코드 변경이나 릴리스 실행 결과는 확인하지 않았다.

## 근거 충돌과 조치

보고자는 CSI sidecar→manager 직접 통신 누락도 주장한다. 공식 KB는 sidecar가 CSI plugin과 Unix socket으로 통신한다고 설명하며 manager ingress 추가를 해결책으로 요구하지 않는다. 이 주장을 확정 원인으로 승격하지 않는다. 실제 경로·CNI verdict·배포 버전을 확인해야 한다.

공식 KB는 V1 host-origin 3260과 Ambient RWX recovery 15008을 독립 경로로 구분한다. 증상에 해당하는 좁은 정책만 검토하고 예제 CIDR은 실제 source 증거 없이 적용하지 않는다. 적용 후 flow 허용, volume 상태, iSCSI 또는 share-manager 복구를 각각 확인한다.

## 중복과 실행 한계

longhorn1121-network-policy-paths와 같은 장애 경로의 공개 보고 증거다. 별도 신규 장애 총수에 합산하지 않는다. 운영 재현·자동 복구·모델 가중치 학습은 수행하지 않았다.
