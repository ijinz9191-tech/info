# Karpenter scheduling·초기화·축소 증거

Topic: infrastructure/karpenter
Version: Current troubleshooting includes historical 0.16.0 replica example; AWS-specific conditions not generalized to all CNIs
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://karpenter.sh/docs/troubleshooting/

<!-- evidence-sha256: b214213aa7e7f38d20f56946b088cc35e6e83b3fa6b4c75cd8759aecb98449f0 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-KARPENTER-001 | STS DNS timeout | dnsPolicy·cluster DNS | bootstrap DNS 의존 | DNS hosting·policy 검토 | STS 해석·controller 기동 |
| SYN-KARPENTER-002 | CRD unknown field | controller·CRD 버전 | 새 field와 이전 CRD | 업그레이드 절차 확인 | schema·reconcile 검증 |
| SYN-KARPENTER-003 | controller 두 번째 pod Pending | 0.16 replica 변경·기반 용량 | 자기 capacity provision 안 함 | 독립 기반 용량 확보 | 모든 controller Ready |
| SYN-KARPENTER-004 | node OOM·throttle | requests·실제 사용 | 과소 requests bin-packing | requests·LimitRange 검토 | 실제 부하·배치 비교 |
| SYN-KARPENTER-005 | topology spread 불충족 | pod eligible domain·NodePool | pod는 pool 요구 미상속 | affinity·domain 정합성 | 목표 분산 검증 |
| SYN-KARPENTER-006 | Ready인데 미초기화 | allocatable·startupTaints | resource 등록 또는 taint 잔류 | device/CNI 초기화 확인 | 세 초기화 조건 |
| SYN-KARPENTER-007 | node 축소 차단 | PDB·eviction | 가용성 조건 불충족 | 보호 조건 내 용량 조정 | 가용성과 drain 확인 |
| SYN-KARPENTER-008 | consolidation 미시도 | active do-not-disrupt | pod 보호 설정 | 업무 보호 기간 검토 | 설정 조건·consolidation 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
