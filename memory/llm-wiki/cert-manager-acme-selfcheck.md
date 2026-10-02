# cert-manager ACME self-check·DNS zone 진단

Topic: cert-manager ACME
Version: 공식 latest 문서; 설치 cert-manager·solver별 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://cert-manager.io/docs/troubleshooting/acme/

<!-- evidence-sha256: 0aad881b672ce8d5c5057db9fc091f7783bb716092f3055c667091c777619912 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-CERT-001 | 인증서 갱신이 pending에서 멈춤 | Issuer·CertificateRequest·Order·Challenge 상태 | 발급 단계별 조건이나 self-check 미충족 | 실패한 리소스 단계부터 원인을 좁힘 | Challenge 완료와 새 인증서·만료일 확인 |
| SYN-CERT-002 | 공개 challenge URL은 되지만 내부 check 실패 | Pod 내부 조회와 외부 조회·DNS view | NAT loopback·split-horizon·분리된 ingress | 내외부 경로·resolver·solver 설정 검토 | Pod와 ACME가 보는 경로를 각각 검사 |
| SYN-CERT-003 | HTTP01 self-check가 404 | solver Pod·Ingress 상태·challenge URL | challenge 라우팅 또는 solver 준비 실패 | solver와 ingress의 정확한 경로 수정 | 외부·내부 URL의 기대 응답 확인 |
| SYN-CERT-004 | DNS01에서 잘못된 zone 선택 | SOA 응답과 DNS provider zone | resolver가 SOA를 필터링 | DNS01 resolver 경로와 SOA 전달 수정 | zone 식별과 TXT 전파를 독립 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
