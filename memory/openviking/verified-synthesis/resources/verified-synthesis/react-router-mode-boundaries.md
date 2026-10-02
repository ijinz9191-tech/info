# React Router 모드별 기능 경계

Topic: react-router
Version: 공식 표시 8.4.0
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://reactrouter.com/start/modes

<!-- evidence-sha256: 4619335ec81aa2cda627d8c0fc80a3a1aeaf2694d397ac1f84aec01f8f630f22 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-RR-001 | BrowserRouter에서 loader 기대 | 최상위 router API 확인 | Declarative와 Data 모드 혼동 | Data router 구성 또는 기존 데이터 계층 사용 | loader 호출 통합 확인 |
| SYN-RR-002 | Route 모듈 생성 타입 없음 | Framework Vite plugin·모드 확인 | Data와 Framework 기능 혼동 | 모드에 맞는 타입 구성 | 타입 검사 |
| SYN-RR-003 | NavLink pending 기대 불일치 | 모드와 isPending 계약 확인 | Declarative에는 해당 pending 기능 없음 | Data/Framework 또는 자체 pending 설계 | 진행 중 탐색 UI 검증 |
| SYN-RR-004 | prefetch 설정 기대 불일치 | Link prefetch 모드 확인 | Framework 전용 기능 계약 | 설정 모드와 기능 일치 | network prefetch 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
