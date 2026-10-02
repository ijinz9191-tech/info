# Cilium wildcard HTTPS와 exact TLS 충돌 보고의 버전 해석

Topic: cncf/cilium/listener-protocol-conflict
Version: Reported Cilium 1.20.0, Gateway API 1.6.1, Kubernetes 1.36.2; previous 1.20.0-rc.1; no reproduction
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/cilium/cilium/issues/47590
- https://github.com/cilium/cilium/issues/46917
- https://github.com/cilium/cilium/pull/47457

<!-- evidence-sha256: 0212d4372ca2c46ac8682bc446909de52bc0f2214370f03a8b9cfbc1c8ee3472 -->

## 보고

2026-07-29 보고는 동일 443 port에서 wildcard HTTPS terminate와 더 구체적 hostname의 TLS passthrough를 함께 둘 때 ProtocolConflict를 제시한다. 해당 listener는 Accepted=False지만 다른 정상 listener 때문에 Gateway 전체 Accepted·Programmed는 True였다고 한다. passthrough listener 제거 시 wildcard route 회복, 재추가 시 실패를 보고했다.

## 원인 해석의 한계

보고 제목의 regression을 확정 제품 결함으로 승격하지 않는다. #46917은 이전 버전에서 거절된 listener가 오히려 serving했던 다른 경로이고 #47457은 그런 translation을 막는 수정이다. 이전 traffic 성공이 protocol 조합의 공식 유효성을 증명하지 않는다. 두 보고를 같은 해결 장애로 합산하거나 exact hostname이 protocol conflict를 항상 이긴다고 학습시키지 않는다.

## 조치 및 검증 후보

listener protocol·TLS mode·hostname overlap, CRD/controller version, listener status, route parent status와 실제 요청을 함께 조사한다. 비충돌 listener 구성이나 분리 port·Gateway는 통제 비교 후보이며 제품의 지원 조합을 확인해야 한다. 분리 시 의도한 terminate와 passthrough 기능을 모두 유지하는지 검증한다. 제거 우회는 passthrough 기능까지 보장하지 않는다. 이슈 Closed이나 수정 릴리스·로컬 재현은 미확인이다.
