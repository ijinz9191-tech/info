# Docker bind mount 경계 진단

Topic: frameworks/containers
Version: 현재 Engine 문서; OS·kernel 조건 명시
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.docker.com/engine/storage/bind-mounts/

<!-- evidence-sha256: 2e4a79b1618f36f1b01c74db32d711159a70b1ebe623e0acaf20961a9d0cae5a -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SYN-DBIND-001 | 이미지 파일 안 보임 | Mounts destination 확인 | 기존 경로가 mount로 가려짐 | mount 경로 조정·container 재생성 | 이미지·host 파일 구분 |
| SYN-SYN-DBIND-002 | 파일 mount가 directory가 됨 | 존재 여부·-v 확인 | 없는 source를 directory 생성 | 파일 준비·--mount 검토 | Mounts 타입과 파일 확인 |
| SYN-SYN-DBIND-003 | 원격 daemon에서 로컬 파일 불가 | daemon host 확인 | client 경로는 mount source 아님 | daemon 측 경로 준비 | daemon source readback |
| SYN-SYN-DBIND-004 | readonly 아래 submount 쓰기 가능 | kernel·recursive 옵션 확인 | 5.12 이전 recursive 제한 | kernel·옵션 정합화 | 각 submount 쓰기 실패 |
| SYN-SYN-DBIND-005 | Desktop propagation 기대 실패 | host 플랫폼 확인 | Desktop propagation 미지원 | 지원되는 데이터 공유 설계 | 양쪽 경로 실제 확인 |
| SYN-SYN-DBIND-006 | host 파일 예상 밖 수정 | Mounts RW 확인 | bind 기본 쓰기 허용 | 필요 시 readonly 적용 | 쓰기 실패·앱 기능 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
