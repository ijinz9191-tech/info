# Velero 복구·로그·Kopia 진단

Topic: cncf/velero
Version: main 개발 문서; 안정 릴리스에 자동 일반화 금지
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://velero.io/docs/main/troubleshooting/

<!-- evidence-sha256: d588a0cd75260cbc9432f2d8ee46f6ea86c3df8f5f153692e39fa44d46d1d70e -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-VELERO-001 | 복구 후 LB DNS 변경 | Service UID·LB DNS 확인 | 복구 UID가 새 cloud 이름 생성 | CNAME 대상 갱신 | 실제 서비스 접근 |
| SYN-VELERO-002 | Admission webhook 복구 차단 | API reject·mutation 확인 | 복구도 admission 통과 | 복구용 정책·item action 검토 | 복구 객체·정책 확인 |
| SYN-VELERO-003 | 로그만 no such host | BSL s3Url·client DNS 확인 | cluster 내부 URL 접근 불가 | 도달 가능한 publicUrl 구성 | 로그 다운로드·backup 별도 |
| SYN-VELERO-004 | plugin EOF를 실패로 판단 | 작업 최종 상태 확인 | plugin 정상 종료 가능 | 실패와 종료 로그 구분 | backup 결과 확인 |
| SYN-VELERO-005 | custom resource not found | 필수 CRD 존재 확인 | 설치 CRD 누락 | 설치 버전에 맞게 복구 | server 시작·CRD |
| SYN-VELERO-006 | credentialsFile invalid keys | provider plugin 버전 확인 | 다중 credential 미지원 | 호환 plugin 검토 | BSL/VSL 접근 |
| SYN-VELERO-007 | Kopia 지정 사용자 maintenance 오류 | repository owner 확인 | 외부 CLI 소유권 변경 | 읽기 연결·owner 정합화 | maintenance 성공 |
| SYN-VELERO-008 | metrics target 없음 | enable·8085·scrape 확인 | 노출 또는 수집 설정 누락 | 지점별 설정 복구 | endpoint·Prometheus target |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
