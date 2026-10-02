# KubeEdge join·신뢰·차단망 연결 진단

Topic: cncf/kubeedge/setup-connection
Version: Living KubeEdge setup FAQ contains v1.12.0 installation examples; exact current release unspecified; no join executed
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kubeedge.io/docs/faq/setup/

<!-- evidence-sha256: ed1232be81148a5b040df34743f84d993c5525b3c9f81d8ab294f6da2a394694 -->

## 공식 계약과 범위

CA fetch 단계와 token 인증, x509 SAN, cloud endpoint 노출을 분리한다. FAQ의 예제 주소·port와 v1.12 설치 예시는 배포 버전에 대조한다. 차단망은 내부 registry·offline image 보관을 검토한다. token/key 원문은 수집하지 않았다. FAQ의 k3s 인증서 검증 해제 방식은 신뢰 검사를 약화하므로 자동 복구로 채택하지 않고 endpoint·certificate 계약을 조사한다. join·인증서 변경은 실행하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-KUBEEDGE-JOIN-001 | CA fetch refused·timeout | listener·route·허용 port | cloudcore·경로 실패 후보 | endpoint·network 조사 | CA 접근·join 단계 확인 |
| SYN-KUBEEDGE-JOIN-002 | 인증 token 실패 | format·invalid 오류만 | 잘못된 credential 후보 | 권한 보유자 갱신 절차 검토 | 비밀 출력 없이 인증 결과 확인 |
| SYN-KUBEEDGE-JOIN-003 | x509 SAN 불일치 | endpoint·공개 SAN | advertise 주소 불일치 | 주소·인증서 계약 검토 | 정상 인증서 handshake |
| SYN-KUBEEDGE-JOIN-004 | 차단망 image pull 실패 | registry·image 오류 | 기본 외부 registry 미접근 | 내부 registry·offline image 계획 | 필요한 image 확인 |
| SYN-KUBEEDGE-JOIN-005 | container-mode cloud 미접근 | hostNetwork·Service 노출 | edge에 도달 안 되는 주소 | node·LB·NodePort 노출 대조 | edge endpoint 연결 검사 |
