# Dapr 정책 로드·재시작·gRPC 적용 한계

Topic: cncf
Version: Dapr docs v1.18; currently documented gRPC invocation limitation
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.dapr.io/operations/resiliency/resiliency-overview/

<!-- evidence-sha256: c1d7bfb87b0073dafd9715daa08c8c0521c4e18009d419f6a05c8aeb22849437 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-DAPR-LOAD-001 | self-hosted 정책 인식 실패 | components 위치·파일명 | 요구한 resiliency.yaml 불일치 | 해당 위치/이름 점검 | sidecar 로드 결과 확인 |
| SYN-DAPR-LOAD-002 | 정책 수정 뒤 sidecar 재시작 | HotReload·Resiliency 변경 | 문서상 graceful restart로 갱신 | 재시작 영향을 운영계획에 포함 | 갱신과 요청 복구 관측 |
| SYN-DAPR-LOAD-003 | gRPC invocation 정책 효과 없음 | 실제 invocation API·1.18 한계 | 문서상 해당 경로 정책 미지원 | 지원 범위와 호출자 실패 처리 검토 | 프로토콜별 적용 확인; 모든 gRPC 기능으로 일반화 금지 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
