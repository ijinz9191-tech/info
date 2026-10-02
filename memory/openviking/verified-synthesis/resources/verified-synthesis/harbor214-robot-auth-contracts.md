# Harbor 2.14 project robot 인증·권한 계약

Topic: cncf/harbor
Version: Official Harbor 2.14.0 project robot documentation; no registry operation
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://goharbor.io/docs/2.14.0/working-with-projects/project-configuration/create-robot-accounts/

<!-- evidence-sha256: f67da7e509d8e86b5466350d3ffc3fe00bd6dabf69d009b664000ea388ff6705 -->

## 공식 계약과 범위

project robot은 해당 project 범위의 OCI/API 자동화용이며 UI 로그인용이 아니다. 이름에는 실제 prefix와 project_name 및 account_name이 포함된다. push 권한은 pull 권한과 함께 부여해야 한다. 생성 후 원 secret을 다시 조회할 수 없고 refresh는 새 secret 관리 절차다. 2.2 이전 legacy 계정은 새 형식으로 자동 migration되지 않는다. 실제 secret은 공개 위키에 보관하지 않는다.

## 가상 진단 시나리오

아래는 공식 문서에서 도출한 가상 사례다. 실제 운영 재현이나 해결 완료가 아니다. Sources와 버전 범위는 모든 행에 적용된다. 조치와 검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-HARBOR214-001 | OCI 인증 계정으로 UI 로그인 실패 | robot 종류와 시도한 인증 interface | 자동화 계정을 UI 사용자로 혼동 | OCI/API 경로와 관리 UI 계정 구분 | 의도한 interface별 인증 결과 확인 |
| SYN-HARBOR214-002 | robot login에서 이름 거절 | 현재 prefix·project·account와 username | project robot 전체 이름 누락 | 실제 계정 metadata로 username 구성 | 비밀값 노출 없이 OCI 인증 확인 |
| SYN-HARBOR214-003 | pull 가능하지만 push 거절 | project scope와 push/pull permission | push 권한 부재 또는 다른 project 접근 | 해당 project의 필요한 permission 검토 | 허용 project push와 비허용 project 차단 확인 |
| SYN-HARBOR214-004 | 기존 자동화 인증이 갑자기 실패 | enabled·expiration·secret refresh 이력 | 만료·deactivation·오래된 credential 후보 | 해당 상태와 안전한 credential 갱신 경로 확인 | consumer 갱신 후 최소 권한 동작 확인 |
| SYN-HARBOR214-005 | legacy 계정에 refresh 동작 없음 | 생성 version과 Legacy label | legacy JWT 계정 제약 | 새 project/system 계정 생성·consumer 전환 계획 | 전환 consumer 정상과 legacy 의존 제거 확인 |
