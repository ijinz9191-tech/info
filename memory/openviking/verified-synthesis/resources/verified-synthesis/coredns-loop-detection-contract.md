# CoreDNS loop 감지 범위

Topic: coredns
Version: 공식 plugin 문서; 수정 표시 2021-05-17
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://coredns.io/plugins/loop/

<!-- evidence-sha256: 900b57bea43cd72e221ea1d68277173ab138bb7db6f93ec9b03560acb2a2e62b -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CDNS-001 | loop 로그와 CrashLoopBackOff | Corefile·Pod resolver·upstream 경로 확인 | 자기 자신 또는 되돌아오는 DNS forwarding | 실제 upstream resolver 경로 구성 | DNS 조회·재시작 정상 확인 |
| SYN-CDNS-002 | loop 경고 없는데 DNS 순환 의심 | 시작 시점·query type·zone 확인 | 감지는 시작 시 정적 HINFO·첫 zone 한정 | 실제 질의와 forwarding 경로 직접 조사 | 영향받는 zone·type 조회 확인 |
| SYN-CDNS-003 | CoreDNS만 고쳐도 다른 Pod DNS 실패 | kubelet resolvConf·default dnsPolicy 비교 | Corefile 우회만으로 잘못된 Pod resolver 미수정 | 실제 resolver 파일을 kubelet에 지정 검토 | CoreDNS와 일반 Pod 각각 조회 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
