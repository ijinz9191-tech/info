# Cilium 거절 listener가 실제 serving한 공개 보고

Topic: cncf/cilium/listener-translation
Version: Issue reports >=1.19.5 and <1.20.0; main PR merged 2026-07-28; release inclusion not checked
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/cilium/cilium/issues/46917
- https://github.com/cilium/cilium/pull/47457

<!-- evidence-sha256: 7fd8066be867844082a73cb86728687175b4e30a2efe71c1ff653501073fb9dc -->

## 공개 증거

2026-07-06 보고는 같은 port의 HTTPS terminate와 TLS passthrough가 ProtocolConflict로 거절됐는데도 Envoy translation에 들어가 serving했다고 설명한다. 다른 정상 listener가 Gateway 전체 Programmed를 허용하는 조건을 제시한다. status만 보고 해당 listener의 비활성을 확정하면 안 된다.

## 수정 근거와 범위

PR #47457은 2026-07-28 main에 merge됐다. 본문은 conflict와 invalid listener를 ingestion 전에 걸러내고 status-writing에 conflict 판단을 재사용한다고 설명한다. unsupported protocol, route kind, certificate·secret reference도 validation 경로로 거른다고 명시한다. PR 설명을 읽었으며 파일 diff·backport release·cluster execution은 별도 미검증이다.

## 조치·검증 후보

설치 version과 listener별 Accepted·Programmed·Conflicted, 생성 CiliumEnvoyConfig filter chain, Service 노출 port, 실제 handshake를 함께 대조한다. 수정 포함 여부를 확인한 뒤 통제 fixture에서 정상 listener는 유지되고 거절 listener는 traffic을 받지 않는지 검사한다. production certificate나 secret을 이 위키에 넣지 않는다. Closed 상태만으로 현재 운영 해결을 확정하지 않는다.
